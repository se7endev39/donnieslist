const stripeConfig = require('../config/stripe');
const config = require('../config/main');
const stripe = require('stripe')(config.stripeApiKey);
const User = require('../models/user');
const Videosession = require('../models/videosession');
const SessionPayment = require('../models/sessionpayment');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var nodemailer = require("nodemailer");
var moment = require('moment');
require("moment-duration-format");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: config.gmailEmail,
        pass: config.gmailPassword
    }
});
/*
 function to recharge account before starting session
 percentage amount to admin will be transferred at same time
 */
exports.rechargeVideoSession = function (req, res, next) {
    var token = req.body.stripeToken.id; // Using Express
    var userEmail = req.body.userEmail;
    var amount = req.body.amount;
    var durationBought = 0;
    if (token) {

        var percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
        durationBought = amount;
        amount = amount * 100;    //cents
        percentageAmount = percentageAmount * 100;  //cents

        console.log('****** ****** amount: ' + amount);
        console.log('****** ****** percentageAmount: ' + percentageAmount);

        stripe.charges.create({
            amount: amount,
            currency: config.stripePaymentCurrencyCode,
            source: token,
            application_fee: percentageAmount,
        }, {
            stripe_account: "acct_1A3GaLILYsSoYQ7A", //expert connected account id  :donny
        }, function (err, charge) {
            if (err) {
                res.json(err);
            } else {

                var videoObj = new Videosession();
                videoObj.userEmail = userEmail;
                videoObj.stripePaymentStatus = charge.status;
                videoObj.stripePaymentAmount = (charge.status / 100);
                videoObj.stripePaymentId = charge.id;
                videoObj.stripePaymentCreationTime = charge.created;
                videoObj.stripePaymentCardLast4 = charge.source.last4;
                videoObj.stripePaymentApplication = charge.application;
                videoObj.stripePaymentApplicationFee = charge.application_fee;
                videoObj.stripePaymentBalanceTransaction = charge.balance_transaction;
                videoObj.sessionCompletionStatus = "UNCOMPLETED";
                videoObj.save(function (err, saved) {
                    if (err) {
                        res.status(200).json({error: err, response: null});
                    } else {
                        res.status(200).json({error: null, response: saved});
                    }
                });
            }
        });
    } else {
        res.status(400).json({"error": "empty parameters"});
    }
};

/**
 * payment of video session
 * Author: Avadhesh
 */
exports.paymentVideoSession = function (req, res, next) {
    var bind = {};
    var customer_id = req.body.customer_id;
    var userEmail = req.body.userEmail;
    var expertEmail = req.body.expertEmail;
    var amount = req.body.amount;
    var durationBought = 0;
    var stripe_connect_id = req.body.stripe_connect_id;
    var video_session_id = req.body.video_session_id;
    var videoSessionDuration = req.body.videoSessionDuration;
    var user_name = req.body.userName;
    var expert_name = req.body.expertName;
    var userImage = req.body.userImage;
    var expertImage = req.body.expertImage;

    if (customer_id) {
        console.log('%%%%%%%% case 1 %%%%%%%');
        var percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
        durationBought = amount;
        var cents_amount = amount * 100;    //cents
        percentageAmount = percentageAmount * 100;  //cents

        stripe.charges.create({
            amount: cents_amount,
            currency: config.stripePaymentCurrencyCode,
            customer: customer_id,
            destination: {
                amount: cents_amount - percentageAmount,
                //account: "acct_1A3GaLILYsSoYQ7A",
                account: stripe_connect_id,
            },
        }, function (err, charge) {
            if (err) {
                bind.status = 0;
                bind.message = 'Oops! error occured while stripe charging';
                bind.error = err;
                res.json(bind);
            } else {
                bind.status = 1;
                bind.payment_message = 'Video session payment done successfully';
                //bind.charge = charge;


                var sessionPayment = new SessionPayment();
                sessionPayment.expertEmail = expertEmail;
                sessionPayment.userEmail = userEmail;
                sessionPayment.usedDuration = videoSessionDuration;
                sessionPayment.amount = amount;
                sessionPayment.paymentStatus = 'success';
                sessionPayment.transactionId = charge.balance_transaction;
                sessionPayment.charge_id = charge.id;

                sessionPayment.save(function (err) {
                    if (err) {
                        bind.status = 0;
                        bind.message = 'Oops! error occured while saving session payment';
                        bind.error = err;
                        return res.json(bind);
                    } else {
                        Videosession.findOne({_id: video_session_id}, function (err, videosession) {
                            if (err) {
                                bind.status = 0;
                                bind.message = 'Oops! error occured while fetching video session by id';
                                bind.error = err;
                                return res.json(bind);
                            } else {
                                videosession.sessionPaymentId = sessionPayment._id;
                                videosession.sessionCompletionStatus = 'COMPLETED';
                                videosession.save(function (err) {
                                    if (err) {
                                        bind.status = 0;
                                        bind.message = 'Oops! error occured while updating video session';
                                        bind.error = err;
                                    } else {
                                        bind.status = 1;
                                        bind.message = 'Video session was updated successfully';
                                        
                                        
                                        // Expert invoice
                                        var templateDir = path.join(__dirname, '../views/email-templates', 'expert-invoice');
                                        var expert_invoice = new EmailTemplate(templateDir)
                                        
                                        var data = {
                                            amount: (cents_amount - percentageAmount)/100,
                                            application_fee: percentageAmount/100,
                                            user_email: userEmail,
                                            duration: moment.duration(parseInt(videoSessionDuration), "seconds").format('ss') + ' seconds',
                                            user_name: user_name,
                                            image: userImage,
                                            
                                        }
                                        expert_invoice.render(data, function (err, result) {
                                            var mailOptions = {
                                                from   : "Donnie's List <no-reply@donnieslist.com>",
                                                to     : expertEmail,
                                                subject: "Donnie's List - Session Detail",
                                                html   : result.html
                                            };
                                            send_email(mailOptions);
                                        });
                                        
                                        // user invoice
                                        var templateDir = path.join(__dirname, '../views/email-templates', 'user-invoice');
                                        var user_invoice = new EmailTemplate(templateDir)
                                        
                                        var data = {
                                            amount: (cents_amount)/100,
                                            application_fee: percentageAmount/100,
                                            user_email: expertEmail,
                                            duration: moment.duration(parseInt(videoSessionDuration), "seconds").format('ss') + ' seconds',
                                            user_name: expert_name,
                                            image: expertImage,
                                            
                                        }
                                        user_invoice.render(data, function (err, result) {
                                            var mailOptions = {
                                                from   : "Donnie's List <no-reply@donnieslist.com>",
                                                to     : userEmail,
                                                subject: "Donnie's List - Session Invoice",
                                                html   : result.html
                                            };
                                            send_email(mailOptions);
                                        });
                                    }
                                    return res.json(bind);
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).json({"error": "empty parameters"});
    }
};

exports.addMoneyToWallet = function (req, res, next) {

    var bind = {};
    var userEmail = req.body.userEmail;
    var amount = req.body.amount;
    var customer_id = req.body.customer_id;
    var durationBought = 0;


    var percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
    durationBought = amount;
    amount = amount * 100;    //cents
    percentageAmount = percentageAmount * 100;  //cents

    stripe.charges.create({
        amount: amount,
        currency: config.stripePaymentCurrencyCode,
        customer: customer_id,
        //application_fee: percentageAmount,
    }, function (err, charge) {
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

}

/*
 function to check whether user has made the payment before going to start session
 */
exports.checkBeforeSessionStart = function (req, res, next) {
    var bind = {};
    var userEmail = req.body.userEmail;
    var expertEmail = req.body.expertEmail;
    if (expertEmail) {
        //Videosession.findOne({'userEmail': userEmail, 'sessionCompletionStatus' : "UNCOMPLETED" },function(err, session){
        User.findOne({email: expertEmail, }, function (err, expertInfo) {
            if (err) {
                bind.status = 0;
                bind.message = 'Oops! error occured while finding exper';
                bind.error = err;
                return res.json(bind);
            }

            if (expertInfo) {
                if (expertInfo && expertInfo.expertSessionAvailability == true && expertInfo.videoSessionAvailability == true) {
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



        })
    } else {
        bind.status = 0;
        bind.message = 'empty parameters';

        return res.json(bind);

    }
};

exports.saveVideoSessionInfo = function (req, res, next) {
    var bind = {};
    var expertEmail = req.body.expertEmail;
    var userEmail = req.body.userEmail;
    var sessionCreationDate = req.body.sessionCreationDate;

    var videosession = new Videosession();
    videosession.expertEmail = expertEmail;
    videosession.userEmail = userEmail;
    videosession.sessionCreationDate = sessionCreationDate;
    videosession.save(function (err) {
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
}



exports.sendExpertInvoice = function (req, res, next) {
    
    //return res.send(moment.duration(630, "seconds").format('ss'));
    
    //res.render('expert-invoice');
    
    var templateDir = path.join(__dirname, '../views/email-templates', 'demo');
    var expert_invoice = new EmailTemplate(templateDir)
    var data = {amount: 100}
    expert_invoice.render(data, function (err, result) {
        var mailOptions = {
            from   : "Donnie's List <no-reply@donnieslist.com>",
            to     : 'mohit@rvtechnologies.co.in',
            subject: "Donnie's List - Expert Invoice",
            html   : result.html
        };
        send_email(mailOptions);
    });
    res.send('ok');
}

var send_email = function(mailOptions){
    console.log('//////////////// inside send_email function ////////////');
    smtpTransport.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
