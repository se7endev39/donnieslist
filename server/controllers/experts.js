/* eslint-disable global-require */
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');
const jwt = require('jsonwebtoken');
// const request = require('request');
// const path = require('path');
// const multer = require('multer');

const config = require('../config/main');
const OpenTok = require('../lib_opentok/opentok');

const { setUserInfo } = require('../helpers');
const { sendExpertSignupSuccessEmail } = require('../helpers');
const { deleteExpertSignupToken } = require('../helpers');

const Experts = require('../models/experts');
const ExpertStory = require('../models/expertstory');
// const ExpertsSubcategories = require('../models/expertssubcategories');
const User = require('../models/user');
const UserReview = require('../models/userreview');
const ExpertSignupToken = require('../models/expertsignuptoken');

const opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.gmailEmail,
    pass: config.gmailPassword
  }
});

function allTitleCase(inStr) {
  return inStr.replace(/\w\S*/g, (tStr) => tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase());
}

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}

//= =======================================
// Experts Routes
//= =======================================
function getExpertCount(slug) {
  return new Promise((resolve, reject) => {
    User.find({
      expertCategories: [slug]
    }, (err, results) => {
      if (err) reject(err);
      else resolve(results.length);
    });
  });
}

function CategoriesWithExpertsCounts(categories) {
  const newCategories = [];
  setTimeout(() => {
    categories.forEach(async (category) => {
      const newCat = {};
      newCat._id = category._id;
      newCat.name = category.name;
      newCat.slug = category.slug;
      const newSubCats = [];
      await category.subcategories.forEach(async (subcategory) => {
        const newsubCat = {};
        newsubCat.name = subcategory.name;
        newsubCat.slug = subcategory.slug;
        newsubCat.expertsCount = await getExpertCount(subcategory.slug);
        // console.log(newsubCat);
        newSubCats.push(newsubCat);
      // console.log(newSubCats);
      });
      newCat.subcategories = newSubCats;
      // console.log(category['subcategories']);
      newCategories.push(newCat);
    });
  // console.log(newCategories);
  // return newCategories;
  }, 2000);
  return newCategories;
}

/* API endpoint to render all categories list on homepage */
exports.getExpertsCategoryList = function (req, res) {
  Experts.aggregate(
    [
      {
        $project: {
          subcategory: 1,
          name: 1,
          slug: 1,
          order: 1,
          entity_id: { $literal: 54 }
        }
      },

      { $unwind: '$subcategory' },

      {
        $group: {
          _id: '$_id',
          name: {
            $first: '$name'
          },
          slug: {
            $first: '$slug'
          },
          subcategories: {
            $push: '$subcategory'
          }
        }
      },

      { $sort: { order: 1, name: 1 } }

    ], (err, users) => {
      if (err) {
        return res.status(200).json(err);
      }

      // console.log(JSON.stringify(users));

      return res.status(200).json(users);
    }
  );
};

/* API endpoint to render all experts list by keyword */
exports.getExpertsListingByKeyword = function (req, res, next) {
  if (!req.params.keyword) {
    res.status(422).send({ error: 'Please choose any keyword' });
    return next();
  }
  let { keyword } = req.params;
  if (keyword.length === 1) res.json([]);
  keyword = keyword.replace(/^&+/i, '');
  res.header('Access-Control-Allow-Origin', '*');
  User.aggregate(
    [
      {
        $match: {
          $or: [
            { expertCategories: { $regex: new RegExp(keyword, 'i') } },
            { expertFocusExpertise: { $regex: new RegExp(keyword, 'i') } },
            { locationCountry: { $regex: new RegExp(keyword, 'i') } },
            { locationState: { $regex: new RegExp(keyword, 'i') } },
            { locationCity: { $regex: new RegExp(keyword, 'i') } },
            { 'profile.firstName': { $regex: new RegExp(keyword, 'i') } },
            { 'profile.lastName': { $regex: new RegExp(keyword, 'i') } }
          ],
          role: 'Expert'
        }
      },
      {
        $project: {
          _id: 0,
          accountCreationDate: 0,
          createdAt: 0,
          enableAccount: 0,
          email: 0,
          contact: 0
          // 'onlineStatus':0,
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          onlineStatus: {
            $cond: {
              if: {
                $eq: ['$onlineStatus', 'ONLINE']
              },
              then: true,
              else: false
            }
          }
        }
      }
    ], (err, expertsList) => {
      if (expertsList) {
        console.log(expertsList);
        res.json(expertsList);
      } else {
        console.log(err);
        res.json({
          success: false,
          data: {},
          code: 404
        });
      }
    }
  );
};

/* API endpoint to render all experts list by category */
exports.getExpertsListing = function (req, res, next) {
  if (!req.params.category) {
    res.status(422).send({
      error: 'Please choose any category'
    });
    return next();
  }

  let { category } = req.params;
  if (category.indexOf('-') > -1) {
    category = category.split('-');
    category = category.join(' ').toUpperCase();
  }

  res.header('Access-Control-Allow-Origin', '*');
  User.aggregate(
    [
      {
        $match: {
          expertCategories: { $regex: new RegExp(category, 'i') },
          role: 'Expert'
        }
      },
      {
        $project: {
          _id: 0,
          accountCreationDate: 0,
          createdAt: 0,
          enableAccount: 0,
          email: 0,
          contact: 0
          // 'onlineStatus':0,
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          onlineStatus: {
            $cond: {
              if: {
                $eq: ['$onlineStatus', 'ONLINE']
              },
              then: true,
              else: false
            }
          }
        }
      }
    ], (err, expertsList) => {
      if (expertsList) {
        res.json(expertsList);
      } else {
        console.log(err);
        res.json({
          success: false,
          data: {},
          code: 404
        });
      }
    }
  );

  /* ExpertsSubcategories.findOne({'slug':{ $regex : new RegExp(category, "i") }}, function (err, expertsList) {
      if(expertsList){
          res.json(expertsList);
      }else{
          res.json({
              success: false,
              data: {},
              code: 404
          });
      }
  }); */
};
//
exports.getTopExpertsListing = function (req, res, next) {
  if (!req.params.category) {
    res.status(422).send({
      error: 'Please choose any category'
    });
    return next();
  }

  const { category } = req.params;

  res.header('Access-Control-Allow-Origin', '*');
  User.find({
    expertCategories: {
      $regex: new RegExp(category, 'i')
    },
    expertRating: {
      $lte: 5,
      $gte: 4
    },
    role: 'Expert'
    // 'expertRating' : ['5','4']
  }, {
    _id: 0,
    accountCreationDate: 0,
    createdAt: 0,
    enableAccount: 0,
    // locationCity :0,
    // locationCountry : 0,
    // locationState : 0,
    locationZipcode: 0,
    password: 0,
    websiteURL: 0
  }).sort({
    expertRating: -1
  }).exec(
    (err, expertsList) => {
      if (expertsList) {
        res.json(expertsList);
      } else {
        res.json({
          success: false,
          data: {},
          code: 404
        });
      }
    }
  );
};
/* API endpoint to send email message to expert */
exports.sendEmailMessageToExpert = function (req, res, next) {
  // console.log(req.body.email);
  if ((!req.body.email && req.body.email !== undefined) && (!req.body.message && req.body.message !== undefined) && (!req.params.expertemail && req.params.expertemail !== undefined)) {
    res.status(422).send({
      error: 'Please choose any category'
    });
    return next();
  }

  const { email } = req.body;
  const { message } = req.body;
  const { expertemail } = req.body;

  /* email for expert */
  let html = 'Hello , <br> Someone requested to have Donnies list session with you. ';
  html += '<p>Following is user information:</p>';
  html += `<p>Email : ${email}</p>`;
  html += `<p>Message : ${message}</p>`;

  const mailOptions = {
    from: 'Donnies list <no-reply@donnieslist.com>',
    to: expertemail,
    subject: 'Donnies List Session Request',
    html
  };

  /* email for session requester */
  let html1 = 'Hello , <br> Thank you for submitting your request.';
  html1 += '<p>Information you entered:</p>';
  html1 += `<p>Your Email : ${email}</p>`;
  html1 += `<p>Your Message : ${message}</p>`;
  html1 += '<br><p>We will contact you soon! <br>Team Donnies List</p>';
  const mailOptions1 = {
    from: 'Donnies List <no-reply@donnieslist.com>',
    to: email,
    subject: 'Donnies List Session Request',
    html: html1
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('In error of nodemailer');
      console.log(error);
    } else {
      console.log('Message sent to user: ', JSON.stringify(info));
    }
  });
  // nodemailer.mail(mailOptions);
  // nodemailer.mail(mailOptions1);

  res.json({
    success: true,
    message: 'Email sent successfully!',
    code: 200
  });
};

/* API endpoint to send text message to expert */
exports.sendTextMessageToExpert = function (req, res) {
  // console.log("*****************************************");
  if ((req.body.text_message !== '' && req.body.text_message !== undefined) && (req.body.text_expert_email !== '' && req.body.text_expert_email !== undefined)) {
    const bodyMessage = req.body.text_message;
    const expertEmail = req.body.text_expert_email;
    const twilioAccountSID = 'AC498497309e749bdb201a20c3d1e0c1f9';
    const twilioauthToken = '2cd189a265a979a999c0656396e1b8fb';
    const twilioFromNumber = '+14237026040';
    const messageBodyPrefix = 'Hi, Someone contacted you on www.donnieslist.com. Message : ';

    // console.log('text_expert_email: ' + req.body.text_expert_email);

    User.findOne({
      email: expertEmail
    }, (err, user) => {
      if (!err && user !== '') {
        // console.log(user)
        const client = require('twilio')(twilioAccountSID, twilioauthToken);
        client.messages.create({
          // to: user.contact,
          to: user.expertContactCC + user.contact,
          from: twilioFromNumber,
          body: messageBodyPrefix + bodyMessage
        }, (err1, message) => {
          if (!err1 && message.sid) {
            res.status(200).send({
              message: 'Message successfully sent to expert!',
              messageId: message.sid,
              error: ''
            });
          } else {
            console.log(err1);
            res.status(200).send({
              message: '',
              error: err1
            });
          }
        });
      } else {
        res.send({
          err
        });
      }
    });
  } else {
    res.status(422).send({
      error: 'parameters empty'
    });
  }
};

/* API endpoint to create expert by admin user */
exports.createExpert = function (req, res, next) {
  const { email } = req.body;
  const firstName = req.body.firstName !== 'undefined' ? req.body.firstName : '';
  const contact = req.body.expertContact !== 'undefined' ? req.body.expertContact : '';
  const expertContactCC = req.body.expertContactCC !== 'undefined' ? req.body.expertContactCC : '';
  const { lastName } = req.body;
  const { password } = req.body;
  let slug = `${req.body.firstName}-${req.body.lastName}`;
  const role = 'Expert';
  const { userBio } = req.body;
  const { expertRates } = req.body;
  const university = req.body.university !== 'undefined' ? req.body.university : '';
  const expertCategories = req.body.expertCategories !== 'undefined' ? req.body.expertCategories : '';
  const { expertRating } = req.body;
  const expertFocusExpertise = req.body.expertFocusExpertise !== 'undefined' ? req.body.expertFocusExpertise : '';
  const yearsexpertise = req.body.yearsexpertise !== 'undefined' ? req.body.yearsexpertise : '';
  const isMusician = req.body.isMusician && req.body.isMusician;

  const facebookURL = req.body.facebookLink;
  const twitterURL = req.body.twitterLink;
  const instagramURL = req.body.instagramLink;
  const googleURL = req.body.googleLink;
  const linkedinURL = req.body.linkedinLink;
  const snapchatURL = req.body.snapchatLink ? req.body.snapchatLink : '';
  const youtubeURL = req.body.youtubeLink ? req.body.youtubeLink : '';
  const soundcloudURL = req.body.soundcloudLink ? req.body.soundcloudLink : '';
  const { endorsements } = req.body;
  const { myFavorite } = req.body;
  const expertUniversity = req.body.expertUniversity ? req.body.expertUniversity : '';
  const profileImage = req.files ? `/uploads/${Date.now()}-${req.files.profile.name}` : '';
  const resume_path = req.files ? `/uploads/${Date.now()}-${req.files.resume.name}` : '';
  // Return error if no email provided
  const emailtest1 = new RegExp('@stanford.edu').test(email);
  const emailtest2 = new RegExp('@harvard.edu').test(email);

  // if(!(emailtest1 || emailtest2)){
  //   return res.status(422).send({ error: 'Email Should start with @stanford.edu  or @harvard.edu' });
  // }

  if (!firstName || !lastName) {
    return res.json({
      code: 422,
      success: false,
      error: 'You must enter your full name.'
    });
  }

  if (!email) {
    return res.json({
      code: 422,
      success: false,
      error: 'You must enter an email address.'
    });
  }

  if (req.body.token) {
    if (req.body.token && !(emailtest1 || emailtest2)) {
      return res.json({
        code: 422,
        success: false,
        error: 'Email Should start with @stanford.edu  or @harvard.edu'
      });
    }
  }

  // Return error if no password provided

  if (!password) {
    return res.json({
      code: 422,
      success: false,
      error: 'You must enter a password.'
    });
  }

  if (req.body.token) {
    if (!profileImage) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a profile image.'
      });
    }
  }
  if (req.body.token) {
    if (!resume_path) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a resume.'
      });
    }
  }

  if (req.body.token) {
    if (!expertCategories) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert Categories.'
      });
    }
  }
  if (req.body.token) {
    if (!contact) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert Contact.'
      });
    }
  }
  if (req.body.token) {
    if (!expertContactCC) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert ContactCC.'
      });
    }
  }
  // if(!expertFocusExpertise){
  //     return res.status(422).send({ error: 'You must enter expert Focus Expertise.' });
  // }
  // if(!yearsexpertise){
  //     return res.status(422).send({ error: 'You must enter years expertise.' });
  // }
  // if(!facebookURL){
  //     return res.status(422).send({ error: 'You must enter facebook profile link.' });
  // }
  // if(!linkedinURL){
  //   return res.status(422).send({ error: 'You must enter linkdin profile link.' });
  // }
  // if(!googleURL){
  //   return res.status(422).send({ error: 'You must enter google profile link.' });
  // }
  //
  // if(!twitterURL){
  //   return res.status(422).send({ error: 'You must enter twitter profile link.' });
  // }

  if (req.files && req.files.profile) {
    const file = req.files.profile;
    file.mv(`./public${profileImage}`, (err) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('file uploaded');
      }
    });
  }

  if (req.files && req.files.resume) {
    const file = req.files.resume;
    file.mv(`./public${resume_path}`, (err) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('file uploaded');
      }
    });
  }

  User.findOne({
    email
  }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // slug = firstName+'-'+new Date().getUTCMilliseconds();

    // If user is not unique, return error
    if (existingUser) {
      return res.json({
        code: 422,
        success: false,
        error: 'That email address is already in use.'
      });
    }

    // audioSessionId
    opentok.createSession((err1, asession) => {
      if (err1) {
        console.log(`error: ${err1}`);
        return res.json({
          err1,
          sessionId: '',
          token: ''
        });
      }

      // archiveSessionId
      opentok.createSession((err2, aRSession) => {
        if (err2) {
          console.log(`error: ${err2}`);
          return res.json({
            err2,
            sessionId: '',
            token: ''
          });
        }
        // videoSessionId
        opentok.createSession((err3, vSession) => {
          if (err3) {
            console.log(`error: ${err3}`);
            return res.json({
              err3,
              sessionId: '',
              token: ''
            });
          }

          const videoSessionId = vSession.sessionId;
          const archiveSessionId = aRSession.sessionId;
          const audioSessionId = asession.sessionId;
          // If email is unique and password was provided, create account
          const user = new User({
            email,
            password,
            contact,
            expertContactCC,
            profile: {
              firstName,
              lastName
            },
            slug,
            isMusician,
            userBio,
            university,
            profileImage,
            resume_path,
            expertRates,
            expertCategories,
            expertRating,
            expertFocusExpertise,
            yearsexpertise,
            facebookURL,
            twitterURL,
            soundcloudURL,
            googleURL,
            instagramURL,
            linkedinURL,
            youtubeURL,
            snapchatURL,
            role,
            videoSessionId,
            archiveSessionId,
            audioSessionId,
            expertUniversity,
            endorsements,
            myFavorite
          });

          User.findOne({
            slug
          }, (err4, slugfound) => {
            if (err4) { return next(err4); } if (slugfound && slugfound !== null && slugfound !== undefined && slugfound !== '') {
              const t = ((new Date()).getHours()).toString() + ((new Date()).getMinutes()).toString() + ((new Date()).getSeconds()).toString() + ((new Date()).getMilliseconds()).toString();
              // console.log(t)
              // console.log(slug)
              slug += t;
              // console.log(slug)
              user.slug = slug;

              user.save((err5, savedUser) => {
                if (err5) {
                  return next(err5);
                }

                sendExpertSignupSuccessEmail(savedUser);
                deleteExpertSignupToken(savedUser.email);
                const userInfo = setUserInfo(savedUser);
                res.status(201).json({
                  success: true,
                  user: {
                    _id: savedUser._id,
                    customerId: '',
                    expertCategories: '',
                    expertFocusExpertise: '',
                    expertRates: '',
                    expertRating: '',
                    facebookURL: '',
                    firstName: savedUser.profile.firstName,
                    lastName: savedUser.profile.lastName,
                    locationCity: '',
                    locationCountry: '',
                    gender: '',
                    profileImage: '',
                    email: savedUser.email,
                    slug: savedUser.slug,
                    role: savedUser.role,
                    userBio: savedUser.userBio,
                    profile: {
                      firstName: savedUser.profile.firstName,
                      lastName: savedUser.profile.lastName
                    },
                    endorsements: '',
                    myFavorite: ''
                  },
                  message: 'Account Created Successfully',
                  token: `JWT ${generateToken(userInfo)}`
                });
              });
            } else {
              // console.log("Expert Pass 1111")
              user.save((err6, savedUser) => {
                if (err6) {
                  console.log('>>>>', err6);
                  return next(err6);
                }

                sendExpertSignupSuccessEmail(savedUser);
                deleteExpertSignupToken(savedUser.email);
                const userInfo = setUserInfo(savedUser);
                res.status(201).json({
                  success: true,
                  user: {
                    _id: savedUser._id,
                    customerId: '',
                    expertCategories: '',
                    expertFocusExpertise: '',
                    expertRates: '',
                    expertRating: '',
                    facebookURL: '',
                    firstName: savedUser.profile.firstName,
                    lastName: savedUser.profile.lastName,
                    locationCity: '',
                    locationCountry: '',
                    gender: '',
                    profileImage,
                    resume_path,
                    email: savedUser.email,
                    slug: savedUser.slug,
                    role: savedUser.role,
                    userBio: savedUser.userBio,
                    profile: {
                      firstName: savedUser.profile.firstName,
                      lastName: savedUser.profile.lastName
                    },
                    endorsements: '',
                    myFavorite: ''
                  },
                  message: 'Account Created Successfully',
                  token: `JWT ${generateToken(userInfo)}`
                });
              });
            }
          });
        });
      });
    });
  });
};

/* API endpoint to render expert details */
exports.getExpertDetail = function (req, res, next) {
  const { slug } = req.params;
  if (!req.params.slug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  User.find({
    /* 'slug': {
        $regex: new RegExp(slug, "i")
      }, */
    slug
  }, {
    _id: 0,
    accountCreationDate: 0,
    createdAt: 0,
    enableAccount: 0,
    // locationCity :0,
    // locationCountry : 0,
    // locationState : 0,
    locationZipcode: 0,
    password: 0
  },
  (err, expertsList) => {
    if (expertsList) {
      // console.log('found');
      // console.log(expertsList);
      res.json(expertsList);
    } else {
      // console.log('not found');
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });

  /* ExpertsSubcategories.aggregate( [
    {   "$match": {
            "experts.slug": { $regex : new RegExp(slug, "i") }
        }
    },
    {   "$unwind": "$experts" },
    {   "$match": {
            "experts.slug": { $regex : new RegExp(slug, "i") }
        }
    },
    {   $limit : 1  }
  ], function (err, expert){
    if(expert){
        res.json(expert);
    }else{
        res.json({
            success: false,
            data: {},
            code: 404
        });
    }
  }); */
};

// get expert details
exports.getExpert = function (req, res, next) {
  const email = req.params.slug;

  if (!req.params.slug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  User.find({
    email
  },
  (err, expertsList) => {
    if (expertsList) {
      res.json(expertsList);
    } else {
      // console.log('not found');
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });
};
// get expert details

/* API endpoint to add endorsements and my favorite */
exports.addEndorsements = async function (req, res, next) {
  const { toSlug, fromSlug } = req.body;
  if (!toSlug || !fromSlug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  await User.findOne({ slug: toSlug }, (err, user) => {
    if (err) {
      res.json({ errorMessage: 'Sorry Something Went Wrong' });
    } else {
      const { endorsements } = user;
      if (endorsements.indexOf(fromSlug) < 0) {
        endorsements.push(fromSlug);
      }

      user.endorsements = endorsements;
      user.save((err1, savedUser) => {
        if (err1) {
          // res.json({code:422,success:false,"message":"Something went wrong!"})
        } else {
          // console.log(savedUser);
          // res.json({code:200,success:true,"message":"Expert added Successfully."})
        }
      });
    }
  });
  User.findOne({ slug: fromSlug }, (err, user) => {
    if (err) {
      res.json({ errorMessage: 'Sorry Something Went Wrong' });
    } else {
      const { myFavorite } = user;

      if (myFavorite.indexOf(toSlug) < 0) {
        myFavorite.push(toSlug);
      }
      user.myFavorite = myFavorite;
      user.save((err1, savedUser) => {
        if (err1) {
          res.json({ code: 422, success: false, message: 'Something went wrong!' });
        } else {
          res.json({ code: 200, success: true, message: 'Expert added Successfully.' });
        }
      });
    }
  });
};
/* API endpoint to get endorsements */

exports.getEndorsements = function (req, res, next) {
  const { slug } = req.body;
  if (!slug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  User.find({
    slug: {
      $in: slug
    }
  }, { profileImage: 1, slug: 1 },
  (err, expertsList) => {
    if (expertsList) {
      res.json(expertsList);
    } else {
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });
};

exports.getMyExpertsListing = function (req, res, next) {
  const { slug, category } = req.body;
  if (!slug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }

  User.find({
    expertCategories: {
      $regex: new RegExp(category, 'i')
    },
    role: 'Expert',
    slug: {
      $in: slug
    }
    // 'expertRating' : ['5','4']
  }, {
    _id: 0,
    accountCreationDate: 0,
    createdAt: 0,
    enableAccount: 0,
    // locationCity :0,
    // locationCountry : 0,
    // locationState : 0,
    locationZipcode: 0,
    password: 0,
    websiteURL: 0
  },
  (err, expertsList) => {
    if (expertsList) {
      console.log(expertsList);
      res.json(expertsList);
    } else {
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });
};

exports.getExpertStories = function (req, res, next) {
  const { expertEmail } = req.params;
  if (!req.params.expertEmail) {
    res.status(422).send({ error: 'Please choose expert Email' });
    return next();
  }
  ExpertStory.find({
    'expert.email': expertEmail
  }, {
    _id: 0,
    'timestamps.updatedAt': 0
  },
  (err, expertStoryList) => {
    if (expertStoryList) {
      res.json(expertStoryList);
    } else {
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });
};

exports.saveUserReview = function (req, res) {
  const bind = {};
  const { rating } = req.body;
  const { review } = req.body;
  const { title } = req.body;
  const { expertEmail } = req.body;
  const { expertFullName } = req.body;
  const { userEmail } = req.body;
  const { userFullName } = req.body;
  const { expertSlug } = req.body;
  const { reviewBy } = req.body;

  const newUserReview = new UserReview();
  newUserReview.rating = rating;
  newUserReview.review = review;
  newUserReview.title = title;
  newUserReview.expertEmail = expertEmail;
  newUserReview.expertFullName = expertFullName;
  newUserReview.userEmail = userEmail;
  newUserReview.userFullName = userFullName;
  newUserReview.expertSlug = expertSlug;
  newUserReview.reviewBy = reviewBy;

  newUserReview.save((error) => {
    if (error) {
      bind.status = 0;
      bind.message = 'Oops! error occured while saving user review';
      bind.error = error;
    } else {
      UserReview.find({
        expertEmail: req.body.expertEmail,
        reviewBy: 'User'
      }, (err, usersreviews) => {
        if (usersreviews) {
          let total = 0;
          for (let x = 0; x < usersreviews.length; x += 1) {
            total += usersreviews[x].rating;
          }
          const average = total / (usersreviews.length);
          User.findOne({
            email: req.body.expertEmail
          }, (err1, user) => {
            user.expertRating = average;
            user.save();
          });
        } else {
          //                User.find({"email":req.body.expertEmail, "reviewBy":"User"},function(err, user){
          //                  user.expertRating=req.body.rating
          //
          //                  user.save()
          //
          //                })
        }
      });

      bind.status = 1;
      bind.message = 'User review was saved successfully';
      // create reusable transport method (opens pool of SMTP connections)
      const smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: config.gmailEmail,
          pass: config.gmailPassword
        }
      });

      /* email for expert */
      let html = `Hello <strong>${allTitleCase(expertFullName)}</strong>, <br> <strong>${allTitleCase(userFullName)}</strong> reviewed on your session.`;
      html += '<p>Following is user information:</p>';
      html += `<p>Email : ${userEmail}</p>`;
      html += `<p>Title : ${title}</p>`;
      html += `<p>Review : ${review}</p>`;
      html += `<p>Rating : ${rating}</p>`;

      const mailOptions = {
        from: 'Donnies List <no-reply@donnieslist.com>',
        to: expertEmail,
        subject: 'Donnies List: User Review',
        html
      };
      smtpTransport.sendMail(mailOptions, (error1, response) => {});
    }
    return res.json(bind);
  });
};

exports.getExpertStoriesBasedOnRole = function (req, res, next) {
  const { expertRole } = req.params;
  if (!req.params.expertRole) {
    res.status(422).send({ error: 'Please choose expert Role' });
    return next();
  }
  ExpertStory.aggregate([
    {
      $lookup:
        {
          from: 'users',
          localField: 'expert.email',
          foreignField: 'email',
          as: 'expert_details'
        }
    },
    {
      $match: {
        expert_details: { $ne: [] },
        'expert_details.role': 'Expert',
        'expert_details.expertCategories': expertRole
      }
    },
    {
      $project: {
        'expert_details._id': 0,
        'expert_details.email': 0,
        'expert_details.createdAt': 0,
        'expert_details.updatedAt': 0,
        'expert_details.password': 0,
        'expert_details.accountCreationDate': 0,
        'expert_details.enableAccount': 0,
        'expert_details.contact': 0,
        'expert_details.stripeId': 0
      }
    }
  ],
  (err, expertStoryList) => {
    if (expertStoryList) {
      res.json(expertStoryList);
    } else {
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });
};

exports.getExpertReviews = function (req, res, next) {
  const bind = {};
  const { expertSlug } = req.params;
  UserReview.find({
    expertSlug
    // reviewBy: "User"
  }, (err, reviews) => {
    if (err) {
      bind.status = 0;
      bind.message = 'Oops! error occured while fetching user reviews';
      bind.error = err;
    } else if (reviews) {
      bind.status = 1;
      bind.reviews = reviews;
    } else {
      bind.status = 0;
      bind.message = 'No reviews Found';
    }

    return res.json(bind);
  }).sort({
    _id: -1
  });
};

exports.getExpertEmailFromToken = function (req, res, next) {
  const bind = {};
  ExpertSignupToken.findOne({
    token: req.params.token
  }, (err, response) => {
    if (!err) {
      bind.status = 1;
      bind.message = 'Expert found';
      bind.email = response.email;
      return bind;
    }
    bind.status = 0;
    bind.message = 'Expert not found';
    bind.email = '';
    return bind;
  });
};

exports.userExpertUpdate = async function (req, res, next) {
  let user_obj;
  console.log(req.body);
  await User.findOne({ email: req.body.user_email }, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      user_obj = result;
    }
  });

  console.log('userExpertUpdate controller');

  let filename = '';
  const d = new Date();
  const name = d.getTime();

  if (req.body.file) {
    let base64Data = '';
    let extension = '';
    if (req.body.file.split(',')[0].includes('png') === true) {
      extension = 'png';
      base64Data = req.body.file.replace(/^data:image\/png;base64,/, '');

      filename = `${name}.${extension}`;
      fs.writeFile(`../client/public/profile_images/${filename}`, base64Data, 'base64', (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
      });
    } else if (req.body.file.split(',')[0].includes('jpg') === true) {
      extension = 'jpg';
      base64Data = req.body.file.replace(/^data:image\/jpg;base64,/, '');

      filename = `${name}.${extension}`;
      fs.writeFile(`../client/public/profile_images/${filename}`, base64Data, 'base64', (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
      });
    } else if (req.body.file.split(',')[0].includes('jpeg') === true) {
      base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, '');
      extension = 'jpeg';

      filename = `${name}.${extension}`;
      fs.writeFile(`../client/public/profile_images/${filename}`, base64Data, 'base64', (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
      });
    }
  }

  const firstName = req.body.updated_name.split(' ')[0] !== 'undefined' ? req.body.updated_name.split(' ')[0] : '';
  const lastName = req.body.updated_name.split(' ')[1] !== 'undefined' ? req.body.updated_name.split(' ')[1] : '';

  let slug = firstName;
  if (lastName) {
    slug = `${slug}-${lastName}`;
  }

  if (slug === '' || slug === null || slug === 'undefined') {
    // eslint-disable-next-line prefer-destructuring
    slug = user_obj.email.split('@')[0];
  }

  const profile = {
    firstName,
    lastName
  };

  const updateuser = {};

  updateuser.profile = profile;
  updateuser.university = req.body.updated_university;
  updateuser.expertFocusExpertise = req.body.updated_focus_of_experties;
  updateuser.yearsexpertise = req.body.updated_years_of_experties;
  updateuser.yearsexpertise = req.body.updated_years_of_experties;
  updateuser.expertCategories = req.body.updated_area_of_experties2;
  updateuser.slug = slug;
  updateuser.role = 'Expert';
  if (filename !== '') {
    updateuser.profileImage = filename;
  }

  User.findOneAndUpdate({ _id: user_obj._id }, updateuser, { new: true }, (err4, company_obj) => {
    if (err4) {
      console.log('error occured', err4);
      return next(err4);
    }
    console.log('updated successfully');
    res.status(201).json({
      success: true,
      category: req.body.updated_area_of_experties2,
      slug,
      first_name: company_obj.profile.firstName,
      last_name: company_obj.profile.lastName,
      profile_image: company_obj.profileImage,
      user_data: company_obj,
      message: 'Data updated Successfully'
    });
  });
};

exports.userExpert = function (req, res, next) {
  const { email } = req.body;
  const firstName = req.body.firstName !== 'undefined' ? req.body.firstName : '';
  const contact = req.body.expertContact !== 'undefined' ? req.body.expertContact : '';
  const expertContactCC = req.body.expertContactCC !== 'undefined' ? req.body.expertContactCC : '';
  const { lastName } = req.body;
  const { password } = req.body;
  let slug = `${req.body.firstName}-${req.body.lastName}`;
  const role = 'Expert';
  const { userBio } = req.body;
  const { expertRates } = req.body;
  const university = req.body.university !== 'undefined' ? req.body.university : '';
  // const expertCategories = req.body.expertCategories !== 'undefined' ? req.body.expertCategories : '';
  const expertCategories = req.body.expertSubCategories;

  const { expertRating } = req.body;
  const expertFocusExpertise = req.body.expertFocusExpertise !== 'undefined' ? req.body.expertFocusExpertise : '';
  const yearsexpertise = req.body.yearsexpertise !== 'undefined' ? req.body.yearsexpertise : '';
  const isMusician = req.body.isMusician && req.body.isMusician;

  const facebookURL = req.body.facebookLink;
  const twitterURL = req.body.twitterLink;
  const instagramURL = req.body.instagramLink;
  const googleURL = req.body.googleLink;
  const linkedinURL = req.body.linkedinLink;
  const snapchatURL = req.body.snapchatLink ? req.body.snapchatLink : '';
  const youtubeURL = req.body.youtubeLink ? req.body.youtubeLink : '';
  const soundcloudURL = req.body.soundcloudLink ? req.body.soundcloudLink : '';
  const { endorsements } = req.body;
  const { myFavorite } = req.body;
  const expertUniversity = req.body.expertUniversity ? req.body.expertUniversity : '';
  const profileImage = req.files ? `/uploads/${Date.now()}-${req.files.profile.name}` : '';
  const resume_path = req.files ? `/uploads/${Date.now()}-${req.files.resume.name}` : '';
  const emailtest1 = new RegExp('@stanford.edu').test(email);
  const emailtest2 = new RegExp('@harvard.edu').test(email);

  if (!firstName || !lastName) {
    return res.json({
      code: 422,
      success: false,
      error: 'You must enter your full name.'
    });
  }

  if (!email) {
    return res.json({
      code: 422,
      success: false,
      error: 'You must enter an email address.'
    });
  }

  if (req.body.token) {
    if (req.body.token && !(emailtest1 || emailtest2)) {
      return res.json({
        code: 422,
        success: false,
        error: 'Email Should start with @stanford.edu  or @harvard.edu'
      });
    }
  }

  // Return error if no password provided

  if (!password) {
    return res.json({
      code: 422,
      success: false,
      error: 'You must enter a password.'
    });
  }

  if (req.body.token) {
    if (!profileImage) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a profile image.'
      });
    }
  }
  if (req.body.token) {
    if (!resume_path) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a resume.'
      });
    }
  }

  if (req.body.token) {
    if (!expertCategories) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert Categories.'
      });
    }
  }
  if (req.body.token) {
    if (!contact) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert Contact.'
      });
    }
  }
  if (req.body.token) {
    if (!expertContactCC) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert ContactCC.'
      });
    }
  }

  if (req.files && req.files.profile) {
    const file = req.files.profile;
    file.mv(`./public${profileImage}`, (err, response) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('file uploaded');
      }
    });
  }

  if (req.files && req.files.resume) {
    const file = req.files.resume;
    file.mv(`./public${resume_path}`, (err, response) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('file uploaded');
      }
    });
  }

  User.findOne({
    email
  }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    opentok.createSession((error1, asession) => {
      opentok.createSession((error2, aRSession) => {
        opentok.createSession((error3, vSession) => {
          const videoSessionId = vSession.sessionId;
          const archiveSessionId = aRSession.sessionId;
          const audioSessionId = asession.sessionId;
          // If email is unique and password was provided, create account

          const user = new User({
            email,
            password,
            contact,
            expertContactCC,
            profile: {
              firstName,
              lastName
            },
            slug,
            isMusician,
            userBio,
            university,
            profileImage,
            resume_path,
            expertRates,
            expertCategories,
            expertRating,
            expertFocusExpertise,
            yearsexpertise,
            facebookURL,
            twitterURL,
            soundcloudURL,
            googleURL,
            instagramURL,
            linkedinURL,
            youtubeURL,
            snapchatURL,
            role,
            videoSessionId,
            archiveSessionId,
            audioSessionId,
            expertUniversity,
            endorsements,
            myFavorite
          });

          User.findOne({
            slug
          }, (err2, slugfound) => {
            if (err2) { return next(err2); } if (slugfound && slugfound !== null && slugfound !== undefined && slugfound !== '') {
              const t = ((new Date()).getHours()).toString() + ((new Date()).getMinutes()).toString() + ((new Date()).getSeconds()).toString() + ((new Date()).getMilliseconds()).toString();
              slug += t;
              user.slug = slug;

              user.save((err1) => {
                if (err1) {
                  return next(err1);
                }

                // sendExpertSignupSuccessEmail(user);
                // deleteExpertSignupToken(user.email);
                const userInfo = setUserInfo(user);
                res.status(201).json({
                  success: true,
                  user: {
                    _id: user._id,
                    customerId: '',
                    expertCategories: '',
                    expertFocusExpertise: '',
                    expertRates: '',
                    expertRating: '',
                    facebookURL: '',
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    locationCity: '',
                    locationCountry: '',
                    gender: '',
                    profileImage: '',
                    email: user.email,
                    slug: user.slug,
                    role: user.role,
                    userBio: user.userBio,
                    profile: {
                      firstName: user.profile.firstName,
                      lastName: user.profile.lastName
                    },
                    endorsements: '',
                    myFavorite: ''
                  },
                  message: 'Account Created Successfully',
                  token: `JWT ${generateToken(userInfo)}`
                });
              });
            } else {
              user.save((err1, savedUser) => {
                if (err1) {
                  console.log('[ERROR]:', err1);
                  return next(err1);
                }

                sendExpertSignupSuccessEmail(savedUser);
                deleteExpertSignupToken(savedUser.email);
                const userInfo = setUserInfo(savedUser);
                res.status(201).json({
                  success: true,
                  user: {
                    _id: user._id,
                    customerId: '',
                    expertCategories: '',
                    expertFocusExpertise: '',
                    expertRates: '',
                    expertRating: '',
                    facebookURL: '',
                    firstName: savedUser.profile.firstName,
                    lastName: savedUser.profile.lastName,
                    locationCity: '',
                    locationCountry: '',
                    gender: '',
                    profileImage,
                    resume_path,
                    email: savedUser.email,
                    slug: savedUser.slug,
                    role: savedUser.role,
                    userBio: savedUser.userBio,
                    profile: {
                      firstName: savedUser.profile.firstName,
                      lastName: savedUser.profile.lastName
                    },
                    endorsements: '',
                    myFavorite: ''
                  },
                  message: 'Account Created Successfully',
                  token: `JWT ${generateToken(userInfo)}`
                });
              });
            }
          });
        });
      });
    });
  });
};

exports.getExpertsSubCategoryList = function (req, res) {
  Experts.aggregate(
    [
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.category)
        }
      }
    ], (err, subcategory) => {
      if (err) {
        return res.status(200).json(err);
      }

      return res.status(200).json(subcategory);
    }
  );
};

exports.upload = function (req, res, next) {
  let filename = '';
  const d = new Date();
  const name = d.getTime();

  if (req.body.base64_image) {
    let base64Data = '';
    let extension = '';
    if (req.body.base64_image.split(',')[0].includes('png') === true) {
      extension = 'png';
      base64Data = req.body.base64_image.replace(/^data:image\/png;base64,/, '');

      filename = `${name}.${extension}`;
      fs.writeFile(`../client/public/profile_images/${filename}`, base64Data, 'base64', (err) => {
        console.log(err);
      });
    } else if (req.body.base64_image.split(',')[0].includes('jpg') === true) {
      extension = 'jpg';
      base64Data = req.body.base64_image.replace(/^data:image\/jpg;base64,/, '');

      filename = `${name}.${extension}`;
      fs.writeFile(`../client/public/profile_images/${filename}`, base64Data, 'base64', (err) => {
        console.log(err);
      });
    } else if (req.body.base64_image.split(',')[0].includes('jpeg') === true) {
      base64Data = req.body.base64_image.replace(/^data:image\/jpeg;base64,/, '');
      extension = 'jpeg';

      filename = `${name}.${extension}`;
      fs.writeFile(`../client/public/profile_images/${filename}`, base64Data, 'base64', (err) => {
        console.log(err);
      });
    }
  }

  const updateuser = {};
  if (filename !== '') {
    updateuser.profileImage = filename;
  }

  User.findOneAndUpdate({ _id: req.body.user_id }, updateuser, { new: true }, (err4, user_obj) => {
    if (err4) {
      console.log('error occured');
      console.log(err4);
      return next(err4);
    }
    // console.log('updated successfully');
    res.status(201).json({
      success: true,
      profile_image: user_obj.profile.profileImage,
      user_data: user_obj,
      message: 'Data updated Successfully'
    });
  });
};
