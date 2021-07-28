const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const validator = require('node-email-validation');
const Verifier = require('email-verifier');

const { BulkCountryUpdateList } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate');
const mailgun = require('../config/mailgun');
const config = require('../config/main');
// const mailchimp = require('../config/mailchimp');

const { setUserInfo } = require('../helpers');
const { sendRegistrationEmail } = require('../helpers');
const { sendExpertSignupTokenEmail } = require('../helpers');
const { getRole } = require('../helpers');

const User = require('../models/user');
const ExpertSignupToken = require('../models/expertsignuptoken');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.gmailEmail,
    pass: config.gmailPassword
  }
});

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}

//= =======================================
// Login Route
//= =======================================
exports.login = (req, res) => {
  console.log('hell---');
  if (req.user.status === false) {
    return res.json({ errorMessage: "Sorry You've Been Banned" });
  }
  const userInfo = setUserInfo(req.user);
  return res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

//= =======================================
// Logout Route
//= =======================================
exports.logout = (req, res, next) => {
  const { userId } = req.params;

  if (!userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId)
    .then((user) => {
      user.onlineStatus = 'OFFLINE';
      user.save();
      return res.status(200).json({});
    })
    .catch((err) => {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    });
};

exports.loginFacebookUser = (req, res, done) => {
  if (req.body.response) {
    User.findOne({ email: req.body.response.email })
      .then((user) => {
        if (user) {
          const userInfo = setUserInfo(user);
          // user.fbLoginAccessToken  = token;
          user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
          user.loginSource = 'Facebook';
          user.onlineStatus = 'ONLINE';
          user.role = 'User';
          user.save()
            .then((doc) => {
              console.log(`** ** ** generateToken user : ${doc}`);
              return res.status(200).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: {
                  _id: doc._id,
                  customerId: doc.email,
                  expertCategories: doc.expertCategories,
                  expertFocusExpertise: doc.expertFocusExpertise,
                  expertRates: doc.expertRates,
                  expertRating: doc.expertRating,
                  facebookURL: doc.facebookURL,
                  firstName: doc.profile.firstName,
                  lastName: doc.profile.lastName,
                  locationCity: doc.locationCity,
                  locationCountry: doc.locationCity,
                  profileImage: doc.profileImage,
                  email: doc.email,
                  slug: doc.slug,
                  profile: doc.profile,
                  gender: doc.gender,
                  userBio: doc.userBio,
                  role: 'User'
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          const unixTimeStamp = Date.now();
          const newUser = new User();
          const slug = `${req.body.response.email.substring(0, req.body.response.email.lastIndexOf('@'))}-${unixTimeStamp}`;
          newUser.email = req.body.response.email;
          newUser.password = 'rvtech123#';
          newUser.profile.firstName = req.body.response.name;
          newUser.profile.lastName = req.body.response.name;
          newUser.slug = slug;
          newUser.userBio = 'Facebook User';
          newUser.loginSource = 'Facebook';
          newUser.onlineStatus = 'ONLINE';
          newUser.role = 'User';
          newUser.profileImage = req.body.response.picture.data.url;
          newUser.save()
            .then((doc) => {
              console.log('data added');
              // if successful, return the new user
              const userInfo = setUserInfo(newUser);
              // return done(null, newUser,`JWT ${generateToken(userInfo)}`);

              res.status(200).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: {
                  _id: doc._id,
                  customerId: '',
                  expertCategories: '',
                  expertFocusExpertise: '',
                  expertRates: '',
                  expertRating: '',
                  facebookURL: '',
                  firstName: req.body.response.name,
                  lastName: req.body.response.name,
                  locationCity: '',
                  locationCountry: '',
                  gender: '',
                  profileImage: req.body.response.picture.data.url,
                  email: req.body.response.email,
                  slug,
                  role: newUser.role,
                  userBio: newUser.userBio,
                  profile: {
                    firstName: req.body.response.name,
                    lastName: req.body.response.name
                  }
                }
              });
            })
            .catch((err) => {
              console.log(`error occured while saving: ${err}`);
              throw err;
            });
        }
      })
      .catch((err) => done(err));
  }
};

//= =======================================
// Facebook Route
//= =======================================
exports.facebookSendJWTtoken = (req, res) => {
  if (req.body.token) {
    User.findOne({ jwtLoginAccessToken: req.body.token })
      .then((userInfo) => {
        if (userInfo) {
          setUserInfo(userInfo);
          return res.status(200).json({
            token: userInfo.jwtLoginAccessToken,
            user: userInfo
          });
        }
        return res.status(200).json({
          token: '',
          user: ''
        });
      })
      .catch(() => res.status(500));
  } else {
    return res.status(200).json({
      token: '',
      user: ''
    });
  }
};

//= =======================================
// Twitter Route
//= =======================================
exports.twitterSendJWTtoken = (req, res) => {
  if (req.body.token) {
    User.findOne({ jwtLoginAccessToken: req.body.token })
      .then((userInfo) => {
        if (userInfo) {
          setUserInfo(userInfo);
          res.status(200).json({
            token: userInfo.jwtLoginAccessToken,
            user: userInfo
          });
        } else {
          res.status(200).json({
            token: '',
            user: ''
          });
        }
      })
      .catch(() => res.status(500));
  } else {
    res.status(200).json({
      token: '',
      user: ''
    });
  }
};

//= =======================================
// Registration Route
//= =======================================
exports.register = (req, res, next) => {
  // Check for registration errors
  const { email } = req.body;
  const { firstName } = req.body;
  // const firstName = email.split('@')[0];
  const { lastName } = req.body;
  const { password } = req.body;
  // const { cfmPassword } = req.body;
  const slug = `${req.body.firstName}-${req.body.lastName}`;
  const role = 'Expert';

  const expertSubCategories = 'new_category';

  // if (!req.body.firstName) {
  //   slug = email.split('@')[0];
  // }

  // Return error if no email provided
  if (!email) {
    return res.json({ error: 'You must enter an email address.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.json({ error: 'You must enter a password.' });
  }

  // Mail checking

  if (!validator.is_email_valid(email)) {
    return res.json({ err: 'Please input valid mail address' });
  }

  /* if ( password != cfmPassword) {
    return res.json({ error: 'Password and Confirm Password must be same!' });
  } */
  User.findOne({ email })
    .then(async (existingUser) => {
      if (existingUser) {
        console.log('[ERROR]:[NEW USER USED ALREADY EXISTING EMAIL]');
        return res.json({ error: 'That email address is already in use.' });
      }
      const user = new User({
        email,
        password,
        profile: { firstName, lastName },
        slug,
        expertSubCategories,
        role
      });
      await bcrypt.genSalt(5, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err1, hash) => {
          if (err1) return next(err1);
          user.password = hash;
        });
        console.log(user);
        user.onlineStatus = 'ONLINE';
        user.save()
          .then((savedUser) => {
            if (savedUser) {
              console.log('now, send mail');
              sendRegistrationEmail(savedUser);
            }
            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            const userInfo = setUserInfo(user);
            console.log('[SUCCESS]:[USER_REGISTER_SUCCESS');
            return res.json({
              success: true,
              token: `JWT ${generateToken(userInfo)}`,
              user: userInfo
            });
          })
          .catch((err2) => next(err2));
      });
    })
    .catch((err) => next(err));
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    const { user } = req;

    User.findById(user._id)
      .then((foundUser) => {
        // If user is found, check role.
        if (getRole(foundUser.role) >= getRole(requiredRole)) {
          return next();
        }
        return res.status(401).json({ error: 'You are not authorized to view this content.' });
      })
      .catch((err) => {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      });
  };
};

//= =======================================
// Forgot Password Route
//= =======================================

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      console.log(`\nerr: ${err}\n existingUser: ${JSON.stringify(existingUser)}`);
      res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
      return next(err);
    }

    // If user is found, generate and save resetToken

    // Generate a token with Crypto
    crypto.randomBytes(48, (err1, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err1) { return next(err1); }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      existingUser.save((err2) => {
        // If error in saving token, return it
        if (err2) { return next(err2); }

        const message = {
          subject: 'Reset Password',
          // text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          //   'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          //   'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
          //   `If you did not request this, please ignore this email and your password will remain unchanged.\n`

          text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
            + ''}${req.headers.origin}/reset-password/${resetToken}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

        };

        // Otherwise, send user email via Mailgun
        mailgun.sendEmail(existingUser.email, message);

        // send mail with node mailer testing..
        // var html = `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        //     'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
        //     `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        const html = `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
            + ''}${req.headers.origin}/reset-password/${resetToken}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';

        const mailOptions = {
          from: 'Donnies List <no-reply@donnieslist.com>',
          to: email,
          subject: 'Reset Password',
          html
        };
        transporter.sendMail(mailOptions, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            console.log('password reset mail sent!');
            console.log(response);
          }
        });
        // send mail with node mailer testing..

        console.log('1st controller forgot password');
        return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
      });
    });
  });
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
    }

    // Otherwise, save new password and clear resetToken from database
    resetUser.password = req.body.password;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save((err1) => {
      if (err1) { return next(err1); }

      // If password change saved successfully, alert user via email
      const message = {
        subject: 'Password Changed',
        text: 'You are receiving this email because you changed your password. \n\n'
          + 'If you did not request this change, please contact us immediately.'
      };

      // Otherwise, send user email confirmation of password change via Mailgun
      mailgun.sendEmail(resetUser.email, message);

      return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
    });
  });
};

//= =======================================
// Signup Expert Send Signup Link Route
//= =======================================
exports.signupExpertSendSignupLink = function (req, res, next) {
  // Check for registration errors
  const { email } = req.body;
  const { expertemail } = req.body;
  // let emailtest1=new RegExp("@stanford.edu").test(email);
  // let emailtest2=new RegExp("@harvard.edu").test(email);
  // Return error if no email provided
  if (!email) {
    return res.json({ error: 'You must enter an email address.', email, expertemail });
  }

  // if(!(emailtest1 || emailtest2)){
  //   return res.status(422).send({ error: 'Email Should start with @stanford.edu  or @harvard.edu' });
  // }

  // else if( !/.+@stanford\.edu/.test(email) || !/.+@harvard\.edu/.test(email) ){
  //   return res.json({error: 'Email should be of @stanford.edu OR @harvard.edu', email: email, expertemail: expertemail });
  // }

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }
    let resetToken = '';
    if (existingUser) {
      return res.json({ error: 'This email address is already in use.', email, expertemail });
    }
    const buf = crypto.randomBytes(48);
    resetToken = buf.toString('hex');
    ExpertSignupToken.findOne({ email }, (err2, existingUserSignupToken) => {
      if (err2) {
        console.error(err2);
        return res.status(500);
      }
      if (existingUserSignupToken) {
        // sendExpertSignupTokenEmail(existingUserSignupToken);
        return res.json({ message: 'Success: Email with signup link is sent to you!' });
      }
      // case new account
      const expertSignupToken = new ExpertSignupToken({
        email,
        token: resetToken,
        tokenExpires: Date.now() + 3600000 // 1 hour
      });
      expertSignupToken.save((err1, user) => {
        if (err1) {
          return next(err1);
        }
        if (user) {
          sendExpertSignupTokenEmail(user);
        }
        return res.json({ message: 'Congrats! We have sent you link on your email. Please check your email.' });
      });
    });
  });
};

// change password
exports.changePassword = async function (req, res, next) {
  console.log('change password controller');
  console.log(req.body);

  const SALT_FACTOR = 5;

  let newPassword = '';

  await bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(req.body.password, salt, null, (err1, hash) => {
      if (err1) return next(err1);
      // console.log(hash);
      newPassword = hash;
      // next();
    });
  });

  console.log('new pass');

  console.log(newPassword);

  User.findOne({ resetPasswordToken: req.body.resetToken }, (err, user) => {
    if (err) {
      console.log('err---');
      console.log(err);
    } else {
      console.log('user---');
      console.log(user);
      if (user) {
        const updateUser = {};
        updateUser.password = newPassword;
        updateUser.resetPasswordToken = null;

        User.findOneAndUpdate({ _id: user._id }, updateUser, { new: true }, (err4, companyObj) => {
          if (err4) {
            console.log('error occured');
            console.log(err4);
            return next(err4);
          }
          console.log('updated successfully');
          console.log(companyObj);
          res.status(201).json({
            success: true,
            message: 'Password changed successfully!'
          });
        });
      } else {
        res.status(201).json({
          success: true,
          message: 'Something went wrong!'
        });
      }
    }
  });
};
// change password
