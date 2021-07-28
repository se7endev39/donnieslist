const Stripe = require('stripe');
const request = require('request');

const config = require('../config/main');
const { setUserInfo } = require('../helpers');

const User = require('../models/user');
const UserReview = require('../models/userreview');

const stripe = Stripe(config.stripeApiKey);
//= =======================================
// User Routes
//= =======================================
exports.viewProfile = (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = setUserInfo(user);

    return res.status(200).json({ user: userToReturn });
  });
};

// viewMyProfile   users own profile
exports.viewMyProfile = function (req, res, next) {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, {
    email: 1,
    profile: 1,
    expertCategories: 1,
    locationCity: 1,
    locationState: 1,
    locationCountry: 1,
    expertRating: 1,
    expertRates: 1,
    expertContactCC: 1,
    expertFocusExpertise: 1,
    googleURL: 1,
    university: 1,
    resume_path: 1,
    yearsexpertise: 1,
    password: 1,
    contact: 1,
    userBio: 1,
    facebookURL: 1,
    twitterURL: 1,
    instagramURL: 1,
    linkedinURL: 1,
    soundcloudURL: 1,
    youtubeURL: 1,
    snapchatURL: 1,
    profileImage: 1,
    role: 1,
    websiteURL: 1,
    stripeId: 1
  }, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    return res.status(200).json({ user });
  });
};
// editMyProfileStripeID
exports.editMyProfileStripeID = function (req, res, next) {
  const { userId } = req.params;

  request.post({
    url: 'https://connect.stripe.com/oauth/token',
    form: {
      grant_type: 'authorization_code',
      client_id: 'ca_AO6OL4V0irBbASlFy9dnrWoNYVgJC5Ru',
      code: req.params.code,
      client_secret: 'sk_test_z8RFNnoaPTtap4kUehAMQ7Hi'
    }
  }, (err, r, body) => {
    const accessToken = JSON.parse(body).stripe_user_id;
    if (req.user._id.toString() !== userId) { return res.json({ error: 'You are not authorized to view this user profile.' }); }
    User.findById(userId, (err1, user) => {
      if (err1) {
        res.json({ error: 'No user could be found for this ID.' });
        return next(err1);
      }
      user.stripeId = accessToken;
      user.save();
      return res.json({ status: 'success', SuccessMessage: 'Successfully Registered Stripe Payment Configuration' });
    });
  });
};

exports.getUserReviews = function (req, res, next) {
  const userEmail = req.param('userEmail');

  UserReview.aggregate([
    {
      $match: { userEmail, reviewBy: 'Expert' }
    },
    {
      $project: {

        createdAt: 1,
        title: 1,
        review: 1,
        rating: 1,
        expertFullName: 1
      }
    },
    {
      $sort: { createdAt: -1 }
    }

  ], (err, userReviews) => {
    const bind = {};
    if (err) {
      bind.status = 0;
      bind.message = 'Oops! error occur while fetching user reviews';
      bind.error = err;
    } else if (userReviews) {
      bind.status = 1;
      bind.userReviews = userReviews;
    } else {
      bind.status = 0;
      bind.message = 'No reviews found';
    }

    return res.json(bind);
  });
};

exports.UpdateMyOwnProfile = function (req, res) {
  const {
    email, firstName, university, isMusician, lastName, password, confirm_password, userBio, expertRates, expertCategories, expertContact, expertRating, expertFocusExpertise, yearsexpertise, locationCountry, locationState, locationCity, facebookURL, twitterURL, instagramURL, soundcloudURL, youtubeURL, linkedinURL, snapchatURL, websiteURL, googleURL
  } = req.body.body;
  let passchange = false;

  User.findOne({ email }, (err, user) => {
    if (err) {
      res.json({ errorMessage: 'Sorry Something Went Wrong' });
    } else {
      user.profile.firstName = firstName;
      user.profile.lastName = lastName;
      // user.password  = password

      if (confirm_password.length > 0) {
        user.password = confirm_password;
        passchange = true;
      }

      user.university = university;
      user.userBio = userBio;
      user.expertRates = expertRates;
      user.expertCategories = expertCategories;
      user.contact = expertContact;
      user.expertFocusExpertise = expertFocusExpertise;
      user.yearsexpertise = yearsexpertise;
      user.locationCountry = locationCountry;
      user.locationState = locationState;
      user.locationCity = locationCity;
      user.googleURL = googleURL;
      user.facebookURL = facebookURL;
      user.linkedinURL = linkedinURL;
      user.twitterURL = twitterURL;
      user.isMusician = isMusician;

      if (!user.isMusician) {
        User.updateOne({ _id: user._id }, { $unset: { soundcloudURL: 1, instagramURL: 1, youtubeURL: 1 } }, { multi: true }, (err1, response) => {
          console.log('[USER]:[UPDATED]:[USER_NOT_MUSICIAN]');
        });
      } else {
        if (instagramURL && instagramURL !== null && instagramURL !== undefined && instagramURL !== '') {
          user.instagramURL = instagramURL;
        }

        if (soundcloudURL && soundcloudURL !== null && soundcloudURL !== undefined && soundcloudURL !== '') {
          user.soundcloudURL = soundcloudURL;
        }

        if (snapchatURL && snapchatURL !== null && snapchatURL !== undefined && snapchatURL !== '') {
          user.snapchatURL = snapchatURL;
        }
        if (websiteURL && websiteURL !== null && websiteURL !== undefined && websiteURL !== '') {
          user.websiteURL = websiteURL;
        }

        if (youtubeURL && youtubeURL !== null && youtubeURL !== undefined && youtubeURL !== '') {
          user.youtubeURL = youtubeURL;
        }
      }

      user.save((err1, savedUser) => {
        if (err1) {
          res.json({ code: 422, success: false, message: 'Something went wrong!' });
        } else if (passchange) {
          res.json({
            code: 200, success: true, message: 'Profile Update Successfully.', passchange: true
          });
        } else {
          res.json({ code: 200, success: true, message: 'Profile Update Successfully.' });
        }
      });
    }
  });
};

exports.UpdateMyOwnResume = function (req, res) {
  if (req.body.expertEmail && req.files) {
    const resume_path = req.files ? `/uploads/${Date.now()}-${req.files.resume.name}` : '';
    if (req.files.resume) {
      const file = req.files.resume;
      file.mv(`./public${resume_path}`, (err, res1) => {
        if (err) {
          res.json({ code: 422, success: false, errorMessage: 'Something Went Wrong' });
        } else {
          console.log('[FILE]:[UPLOADED]');
        }
      });
    }

    User.findOne({ email: req.body.expertEmail }, (err, user) => {
      if (err) {
        res.json({ code: 422, success: false, errorMessage: 'Something Went Wrong' });
      } else if (!user || user === undefined) {
        res.json({ code: 422, success: false, errorMessage: "Sorry user Doesn't exist" });
      } else {
        user.resume_path = resume_path;
        user.save((err1) => {
          if (err1) {
            res.json({ code: 422, success: false, errorMessage: 'Sorry Couldnt Save' });
          } else {
            res.json({ code: 200, success: true, SuccessMessage: 'Successfully Updated' });
          }
        });
      }
    });
  }
};

exports.UpdateMyOwnProfilePicture = function (req, res) {
  if (!req.body.expertEmail) {
    res.json({ code: 422, success: false, errorMessage: 'Something Went Wrong' });
  }

  if (!req.files) {
    res.json({ code: 422, success: false, errorMessage: 'Something Went Wrong' });
  }

  if (!req.files.profileImage) {
    res.json({ code: 422, success: false, errorMessage: 'Something Went Wrong' });
  }

  const profile_path = `/uploads/${Date.now()}-${req.files.profileImage.name}`;
  if (req.files.profileImage) {
    const file = req.files.profileImage;
    file.mv(`./public${profile_path}`, (err, res1) => {
      if (err) {
        res.json({ code: 422, success: false, errorMessage: 'Something Went Wrong' });
      } else {
        console.log('[FILE]:[UPDATED]');
      }
    });
  }

  if (req.body.expertEmail && req.files.profileImage) {
    User.findOne({ email: req.body.expertEmail }, (err, user) => {
      if (err) {
        res.json({ errorMessage: 'Something Went Wrong' });
      } else if (!user || user === undefined) {
        res.json({ errorMessage: "Sorry user Doesn't exist" });
      } else {
        user.profileImage = profile_path;
        user.save((err1) => {
          if (err1) {
            res.json({ errorMessage: 'Sorry Couldnt Save' });
          } else {
            res.json({ code: 200, success: true, SuccessMessage: 'Successfully Updated' });
          }
        });
      }
    });
  }
};

exports.addAccountInfo = function (req, res, next) {
  const bind = {};
  const { emailId } = req.body.body;
  const { exp_month } = req.body.body;
  const { exp_year } = req.body.body;
  const number = req.body.body.car_number;
  const { address_city } = req.body.body;
  const { address_country } = req.body.body;
  const { address_line1 } = req.body.body;
  const { address_line2 } = req.body.body;
  const { address_state } = req.body.body;
  const { address_zip } = req.body.body;
  const { cvc } = req.body.body;
  const name = req.body.body.car_holder_name;

  User.findOne({ email: emailId }, (err, user) => {
    if (err) {
      bind.status = 0;
      bind.message = 'Oops! Error occured while fetching user information';
      bind.error = err;
      return res.json(bind);
    }
    if (user) {
      stripe.customers.create({
        source: {
          object: 'card',
          exp_month,
          exp_year,
          number,
          address_city,
          address_country,
          address_line1,
          address_line2,
          address_state,
          address_zip,
          cvc,
          name
        },
        email: emailId
      }, (err1, customer) => {
        if (err1) {
          bind.status = 0;
          bind.message = 'Oops! Error occur while creating customer in stripe';
          bind.error = err1;
          return res.json(bind);
        }
        const customer_id = customer.id;
        user.stripe.customerId = customer_id;
        user.stripe.cardInfo.exp_month = exp_month;
        user.stripe.cardInfo.exp_year = exp_year;
        user.stripe.cardInfo.number = number;
        user.stripe.cardInfo.address_city = address_city;
        user.stripe.cardInfo.address_country = address_country;
        user.stripe.cardInfo.address_line1 = address_line1;
        user.stripe.cardInfo.address_line2 = address_line2;
        user.stripe.cardInfo.address_state = address_state;
        user.stripe.cardInfo.address_zip = address_zip;
        user.stripe.cardInfo.cvc = cvc;
        user.stripe.cardInfo.name = name;

        user.save((err2) => {
          if (err1) {
            bind.status = 0;
            bind.message = 'Oops! Error occured while saving user account info';
            bind.error = err2;
          } else {
            bind.status = 1;
            bind.message = 'User account info was saved successfully';
            bind.customer = customer;
          }
          return res.json(bind);
        });
      });
    } else {
      bind.status = 0;
      bind.message = 'No user found';
      return res.json(bind);
    }
  });
};
// FetchAccountInfo
exports.FetchAccountInfo = function (req, res, next) {
  const { emailId } = req.body.body;
  const bind = {};
  User.findOne({ email: emailId }, (err, user) => {
    if (err) {
      bind.status = 0;
      bind.message = 'Oops! Error Occured While Fetching User';
      bind.error = err;
      return res.json(bind);
    }
    if (user && user !== null) {
      res.json({ user: user.stripe });
    } else {
      bind.status = 0;
      bind.message = 'Oops! No Such User Found';
      bind.error = err;
      return res.json(bind);
    }
  });
};
