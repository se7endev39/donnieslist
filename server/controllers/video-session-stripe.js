const moment = require('moment');
const nodemailer = require('nodemailer');
require('moment-duration-format');
const Stripe = require('stripe');
const { EmailTemplate } = require('email-templates');
const path = require('path');

const stripeConfig = require('../config/stripe');
const config = require('../config/main');

const User = require('../models/user');
const Videosession = require('../models/videosession');
const SessionPayment = require('../models/sessionpayment');

const stripe = Stripe(config.stripeApiKey);

const smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.gmailEmail,
    pass: config.gmailPassword
  }
});

const send_email = function (mailOptions) {
  console.log('[INSIDE]:[SEND_MAIL]:[FUNCTION]');
  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};
/*
 function to recharge account before starting session
 percentage amount to admin will be transferred at same time
 */
exports.rechargeVideoSession = function (req, res, next) {
  const token = req.body.stripeToken.id; // Using Express
  const { userEmail } = req.body;
  let { amount } = req.body;
  let durationBought = 0;
  if (token) {
    let percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
    durationBought = amount;
    amount *= 100; // cents
    percentageAmount *= 100; // cents
    stripe.charges.create({
      amount,
      currency: config.stripePaymentCurrencyCode,
      source: token,
      application_fee: percentageAmount
    }, {
      stripe_account: 'acct_1A3GaLILYsSoYQ7A' // expert connected account id  :donny
    }, (err, charge) => {
      if (err) {
        res.json(err);
      } else {
        const videoObj = new Videosession();
        videoObj.userEmail = userEmail;
        videoObj.stripePaymentStatus = charge.status;
        videoObj.stripePaymentAmount = (charge.status / 100);
        videoObj.stripePaymentId = charge.id;
        videoObj.stripePaymentCreationTime = charge.created;
        videoObj.stripePaymentCardLast4 = charge.source.last4;
        videoObj.stripePaymentApplication = charge.application;
        videoObj.stripePaymentApplicationFee = charge.application_fee;
        videoObj.stripePaymentBalanceTransaction = charge.balance_transaction;
        videoObj.sessionCompletionStatus = 'UNCOMPLETED';
        videoObj.save((err1, saved) => {
          if (err1) {
            res.status(200).json({ error: err1, response: null });
          } else {
            res.status(200).json({ error: null, response: saved });
          }
        });
      }
    });
  } else {
    res.status(400).json({ error: 'empty parameters' });
  }
};

/**
 * payment of video session
 * Author: Avadhesh
 */
exports.paymentVideoSession = function (req, res, next) {
  const bind = {};
  const { customer_id } = req.body;
  const { userEmail } = req.body;
  const { expertEmail } = req.body;
  const { amount } = req.body;
  let durationBought = 0;
  const { stripe_connect_id } = req.body;
  const { video_session_id } = req.body;
  const { videoSessionDuration } = req.body;
  const user_name = req.body.userName;
  const expert_name = req.body.expertName;
  const { userImage } = req.body;
  const { expertImage } = req.body;

  if (customer_id) {
    let percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
    durationBought = amount;
    const cents_amount = amount * 100; // cents
    percentageAmount *= 100; // cents

    stripe.charges.create({
      amount: cents_amount,
      currency: config.stripePaymentCurrencyCode,
      customer: customer_id,
      destination: {
        amount: cents_amount - percentageAmount,
        // account: "acct_1A3GaLILYsSoYQ7A",
        account: stripe_connect_id
      }
    }, (err, charge) => {
      if (err) {
        bind.status = 0;
        bind.message = 'Oops! error occured while stripe charging';
        bind.error = err;
        res.json(bind);
      } else {
        bind.status = 1;
        bind.payment_message = 'Video session payment done successfully';
        // bind.charge = charge;

        const sessionPayment = new SessionPayment();
        sessionPayment.expertEmail = expertEmail;
        sessionPayment.userEmail = userEmail;
        sessionPayment.usedDuration = videoSessionDuration;
        sessionPayment.amount = amount;
        sessionPayment.paymentStatus = 'success';
        sessionPayment.transactionId = charge.balance_transaction;
        sessionPayment.charge_id = charge.id;

        sessionPayment.save((err1) => {
          if (err1) {
            bind.status = 0;
            bind.message = 'Oops! error occured while saving session payment';
            bind.error = err1;
            return res.json(bind);
          }
          Videosession.findOne({ _id: video_session_id }, (err2, videosession) => {
            if (err2) {
              bind.status = 0;
              bind.message = 'Oops! error occured while fetching video session by id';
              bind.error = err2;
              return res.json(bind);
            }
            videosession.sessionPaymentId = sessionPayment._id;
            videosession.sessionCompletionStatus = 'COMPLETED';
            videosession.save((err3) => {
              if (err3) {
                bind.status = 0;
                bind.message = 'Oops! error occured while updating video session';
                bind.error = err3;
              } else {
                bind.status = 1;
                bind.message = 'Video session was updated successfully';

                // Expert invoice
                let templateDir = path.join(__dirname, '../views/email-templates', 'expert-invoice');
                const expert_invoice = new EmailTemplate(templateDir);

                let data = {
                  amount: (cents_amount - percentageAmount) / 100,
                  application_fee: percentageAmount / 100,
                  user_email: userEmail,
                  duration: `${moment.duration(Number(videoSessionDuration), 'seconds').format('ss')} seconds`,
                  user_name,
                  image: userImage

                };
                expert_invoice.render(data, (err4, result) => {
                  const mailOptions = {
                    from: "Donnie's List <no-reply@donnieslist.com>",
                    to: expertEmail,
                    subject: "Donnie's List - Session Detail",
                    html: result.html
                  };
                  send_email(mailOptions);
                });

                // user invoice
                templateDir = path.join(__dirname, '../views/email-templates', 'user-invoice');
                const user_invoice = new EmailTemplate(templateDir);

                data = {
                  amount: (cents_amount) / 100,
                  application_fee: percentageAmount / 100,
                  user_email: expertEmail,
                  duration: `${moment.duration(Number(videoSessionDuration), 'seconds').format('ss')} seconds`,
                  user_name: expert_name,
                  image: expertImage

                };
                user_invoice.render(data, (err5, result) => {
                  const mailOptions = {
                    from: "Donnie's List <no-reply@donnieslist.com>",
                    to: userEmail,
                    subject: "Donnie's List - Session Invoice",
                    html: result.html
                  };
                  send_email(mailOptions);
                });
              }
              return res.json(bind);
            });
          });
        });
      }
    });
  } else {
    res.status(400).json({ error: 'empty parameters' });
  }
};

exports.addMoneyToWallet = function (req, res, next) {
  const bind = {};
  const { userEmail } = req.body;
  let { amount } = req.body;
  const { customer_id } = req.body;
  let durationBought = 0;

  let percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
  durationBought = amount;
  amount *= 100; // cents
  percentageAmount *= 100; // cents

  stripe.charges.create({
    amount,
    currency: config.stripePaymentCurrencyCode,
    customer: customer_id
    // application_fee: percentageAmount,
  }, (err, charge) => {
    if (err) {
      bind.status = 0;
      bind.message = 'Oops! error occured while adding money';
      bind.error = err;
      res.json(bind);
    } else {
      bind.status = 1;
      bind.message = 'Money was added to wallet successfully';
      bind.charge = charge;
      res.json(bind);
    }
  });
};

/*
 function to check whether user has made the payment before going to start session
 */
exports.checkBeforeSessionStart = function (req, res, next) {
  const bind = {};
  const { userEmail } = req.body;
  const { expertEmail } = req.body;
  if (expertEmail) {
    // Videosession.findOne({'userEmail': userEmail, 'sessionCompletionStatus' : "UNCOMPLETED" },function(err, session){
    User.findOne({ email: expertEmail }, (err, expertInfo) => {
      if (err) {
        bind.status = 0;
        bind.message = 'Oops! error occured while finding exper';
        bind.error = err;
        return res.json(bind);
      }

      if (expertInfo) {
        if (expertInfo && expertInfo.expertSessionAvailability === true && expertInfo.videoSessionAvailability === true) {
          bind.status = 1;
          bind.data = expertInfo;
        } else {
          bind.status = 0;
          bind.message = 'Expert session is not available right now! Please try after some time';
        }
      } else {
        bind.status = 0;
        bind.message = 'No expert found!';
      }
      return res.json(bind);
    });
  } else {
    bind.status = 0;
    bind.message = 'empty parameters';

    return res.json(bind);
  }
};

exports.saveVideoSessionInfo = function (req, res, next) {
  const bind = {};
  const { expertEmail } = req.body;
  const { userEmail } = req.body;
  const { sessionCreationDate } = req.body;

  const videosession = new Videosession();
  videosession.expertEmail = expertEmail;
  videosession.userEmail = userEmail;
  videosession.sessionCreationDate = sessionCreationDate;
  videosession.save((err) => {
    if (err) {
      bind.status = 0;
      bind.message = 'Oops! error occured while saving video session info';
      bind.error = err;
    } else {
      bind.status = 1;
      bind.message = 'Video session was saved successfully';
      bind.video_session_id = videosession._id;
    }
    return res.json(bind);
  });
};

exports.sendExpertInvoice = function (req, res, next) {
  // return res.send(moment.duration(630, "seconds").format('ss'));

  // res.render('expert-invoice');

  const templateDir = path.join(__dirname, '../views/email-templates', 'demo');
  const expert_invoice = new EmailTemplate(templateDir);
  const data = { amount: 100 };
  expert_invoice.render(data, (err, result) => {
    const mailOptions = {
      from: "Donnie's List <no-reply@donnieslist.com>",
      to: 'mohit@rvtechnologies.co.in',
      subject: "Donnie's List - Expert Invoice",
      html: result.html
    };
    send_email(mailOptions);
  });
  res.send('ok');
};
