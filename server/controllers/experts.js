const Experts = require('../models/experts');
const ExpertStory = require('../models/expertstory');
const ExpertsSubcategories = require('../models/expertssubcategories');
const User = require('../models/user');
const userReview = require('../models/userreview');
var nodemailer = require("nodemailer");
var config = require('../config/main');
var OpenTok = require('../lib_opentok/opentok');
var opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

const setUserInfo = require('../helpers').setUserInfo;
const jwt = require('jsonwebtoken');
const sendExpertSignupSuccessEmail = require('../helpers').sendExpertSignupSuccessEmail;
const deleteExpertSignupToken = require('../helpers').deleteExpertSignupToken;
const ExpertSignupToken = require('../models/expertsignuptoken');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.gmailEmail,
    pass: config.gmailPassword,
  },
});

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
function getExpertCount(slug){
  console.log(slug)
  User.find({
    "expertCategories":['$slug']
  }, function(err, userscount) {
    return(userscount.length)
  });
}

/* API endpoint to render all categories list on homepage */
exports.getExpertsCategoryList = function(req, res, next) {
  Experts.aggregate([
    {
      $project: {
        'subcategory': 1,
        'name': 1,
        'slug': 1,
        'order': 1
      }
    },
    {
        $unwind: '$subcategory'
    },
    {
      $sort: {
        'slug': -1,
        'subcategory.slug': 1
      }
    },
    //{   $sort: {'subcategory.name': 1} },
      {
          $lookup: {
              from: "users",
              localField: "subcategory.slug",
              foreignField: "expertCategories",
              as: "subcategory_experts"
          }
      },
    {
      $group: {
        _id: '$_id',
        'name': {
          $first: '$name'
        },
        'slug': {
          $first: '$slug'
        },
        'subcategory': {
          $push: '$subcategory'
        },
        'subcategory_experts': {
          $push: '$subcategory_experts.expertCategories'
        }
      }
    }
  ],
  function(err, users) {
    if (err) {
      return res.status(200).json(err);
    }
    return res.status(200).json(users);
  });
}
/* API endpoint to render all experts list by category */
exports.getExpertsListing = function(req, res, next) {

  if (!req.params.category) {
    res.status(422).send({
      error: 'Please choose any category'
    });
    return next();
  }

  var category = req.params.category;
  if (category.indexOf('-') > -1) {

    category = category.split("-");
    category = category.join(' ').toUpperCase()

  }

  res.header('Access-Control-Allow-Origin', '*');
  User.aggregate(
  [
    {
      $match: {
        'expertCategories' : { $regex : new RegExp(category, "i") },
        "role":'Expert',
      }
    },
    {
      $project:{
        '_id':0,
        'accountCreationDate':0,
        'createdAt':0,
        'enableAccount':0,
        'email':0,
        'contact':0,
        //'onlineStatus':0,
      }
    },
    {
      $sort: {'createdAt': -1}
    },
    {
      "$addFields": {
        'onlineStatus' : { "$cond": {
          if: {
              '$eq': ['$onlineStatus', "ONLINE"]
            },
            'then': true,
            'else': false
          }
        }
      }
    }
  ],function (err, expertsList) {
    if(expertsList){
        res.json(expertsList);
    }else{
      console.log(err)
        res.json({
            success: false,
            data: {},
            code: 404
        });
    }
  });
  /*ExpertsSubcategories.findOne({'slug':{ $regex : new RegExp(category, "i") }}, function (err, expertsList) {
      if(expertsList){
          res.json(expertsList);
      }else{
          res.json({
              success: false,
              data: {},
              code: 404
          });
      }
  });*/
};
//
exports.getTopExpertsListing = function(req, res, next) {
  if (!req.params.category) {
    res.status(422).send({
      error: 'Please choose any category'
    });
    return next();
  }

  var category = req.params.category;

  res.header('Access-Control-Allow-Origin', '*');
  User.find({
    'expertCategories': {
      $regex: new RegExp(category, "i")
    },
    'expertRating': {
      '$lte': 5,
      "$gte": 4,
    },
    'role': "Expert"
    // 'expertRating' : ['5','4']
  }, {
    '_id': 0,
    'accountCreationDate': 0,
    'createdAt': 0,
    'enableAccount': 0,
    // locationCity :0,
    // locationCountry : 0,
    // locationState : 0,
    locationZipcode: 0,
    password: 0,
    websiteURL: 0
  }).sort({
    "expertRating": -1
  }).exec(
    function(err, expertsList) {
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
/* API endpoint to send email message to expert */
exports.sendEmailMessageToExpert = function(req, res, next) {
  console.log(req.body.email);
  if ((!req.body.email && req.body.email != undefined) && (!req.body.message && req.body.message != undefined) && (!req.params.expertemail && req.params.expertemail != undefined)) {
    res.status(422).send({
      error: 'Please choose any category'
    });
    return next();
  }

  var email = req.body.email;
  var message = req.body.message;
  var expertemail = req.body.expertemail;

  /* email for expert */
  var html = 'Hello , <br> Someone requested to have Donnies list session with you. ';
  html += '<p>Following is user information:</p>';
  html += '<p>Email : ' + email + '</p>';
  html += '<p>Message : ' + message + '</p>';

  var mailOptions = {
    from: "Donnies list <no-reply@donnieslist.com>",
    to: expertemail,
    subject: "Donnies List Session Request",
    html: html
  };

  /* email for session requester */
  var html1 = 'Hello , <br> Thank you for submitting your request.';
  html1 += '<p>Information you entered:</p>';
  html1 += '<p>Your Email : ' + email + '</p>';
  html1 += '<p>Your Message : ' + message + '</p>';
  html1 += '<br><p>We will contact you soon! <br>Team Donnies List</p>';
  var mailOptions1 = {
    from: "Donnies List <no-reply@donnieslist.com>",
    to: email,
    subject: "Donnies List Session Request",
    html: html1
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log("In error of nodemailer")
      console.log(error);
    } else {
      console.log('Message sent to user: ' /*+ JSON.stringify(info)*/ );
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
exports.sendTextMessageToExpert = function(req, res, next) {
  console.log("*****************************************")
  if ((req.body.text_message != "" && req.body.text_message != undefined) && (req.body.text_expert_email != "" && req.body.text_expert_email != undefined)) {
    var request = require('request'),
      bodyMessage = req.body.text_message,
      expertEmail = req.body.text_expert_email,
      twilioAccountSID = "AC498497309e749bdb201a20c3d1e0c1f9",
      twilioauthToken = "2cd189a265a979a999c0656396e1b8fb",
      twilioFromNumber = "+14237026040",
      messageBodyPrefix = "Hi, Someone contacted you on www.donnieslist.com. Message : ";

    console.log('text_expert_email: ' + req.body.text_expert_email);

    User.findOne({
      "email": expertEmail
    }, function(err, user) {
      if (!err && user != "") {
        console.log(user)
        var client = require('twilio')(twilioAccountSID, twilioauthToken);
        client.messages.create({
          // to: user.contact,
          to: user.expertContactCC + user.contact,
          from: twilioFromNumber,
          body: messageBodyPrefix + bodyMessage
        }, function(err, message) {
          if (!err && message.sid) {
            res.status(200).send({
              message: "Message successfully sent to expert!",
              messageId: message.sid,
              error: ""
            });
          } else {
            console.log(err)
            res.status(200).send({
              message: "",
              error: err
            });
          }
        });
      } else {
        res.send({
          err: err
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
exports.createExpert = function(req, res, next) {

  const email = req.body.email;
  const firstName = req.body.firstName != 'undefined' ? req.body.firstName : '';
  const contact = req.body.expertContact != 'undefined' ? req.body.expertContact : '';
  const expertContactCC = req.body.expertContactCC != 'undefined' ? req.body.expertContactCC : '';
  const lastName = req.body.lastName;
  const password = req.body.password;
  let slug = req.body.firstName + '-' + req.body.lastName;
  var role = 'Expert';
  const userBio = req.body.userBio;
  const expertRates = req.body.expertRates;
  const university = req.body.university != 'undefined' ? req.body.university : '';
  const expertCategories = req.body.expertCategories != 'undefined' ? req.body.expertCategories : '';
  const expertRating = req.body.expertRating;
  const expertFocusExpertise = req.body.expertFocusExpertise != 'undefined' ? req.body.expertFocusExpertise : '';
  const yearsexpertise = req.body.yearsexpertise != 'undefined' ? req.body.yearsexpertise : '';
  const isMusician= req.body.isMusician && req.body.isMusician ;

  const facebookURL = req.body.facebookLink;
  const twitterURL = req.body.twitterLink;
  const instagramURL = req.body.instagramLink;
  const googleURL = req.body.googleLink;
  const linkedinURL = req.body.linkedinLink;
  const snapchatURL = req.body.snapchatLink ? req.body.snapchatLink : '';
  const youtubeURL = req.body.youtubeLink ? req.body.youtubeLink : '';
  const soundcloudURL = req.body. soundcloudLink ? req.body. soundcloudLink : '';
  const endorsements = req.body.endorsements;
  const myFavorite = req.body.myFavorite;
  const expertUniversity = req.body.expertUniversity ? req.body.expertUniversity : '';
  const profileImage = req.files ? '/uploads/' + Date.now() + '-' + req.files.profile.name : ''
  const resume_path = req.files ? '/uploads/' + Date.now() + '-' + req.files.resume.name : ''
  // Return error if no email provided
  let emailtest1 = new RegExp("@stanford.edu").test(email);
  let emailtest2 = new RegExp("@harvard.edu").test(email);

  // if(!(emailtest1 || emailtest2)){
  //   return res.status(422).send({ error: 'Email Should start with @stanford.edu  or @harvard.edu' });
  // }

    if (!firstName || !lastName) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter your full name.'
      })
    }


    if (!email) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter an email address.'
      })

    }


  if (req.body.token) {
    if (req.body.token && !(emailtest1 || emailtest2)) {
      return res.json({
        code: 422,
        success: false,
        error: 'Email Should start with @stanford.edu  or @harvard.edu'
      })
    }
  }

  // Return error if no password provided

    if (!password) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a password.'
      })
    }


  if (req.body.token) {
    if (!profileImage) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a profile image.'
      })
    }
  }
  if (req.body.token) {
    if (!resume_path) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter a resume.'
      })
    }
  }

  if (req.body.token) {
    if (!expertCategories) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert Categories.'
      })
    }
  }
  if (req.body.token) {
    if (!contact) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert Contact.'
      })
    }
  }
  if (req.body.token) {
    if (!expertContactCC) {
      return res.json({
        code: 422,
        success: false,
        error: 'You must enter expert ContactCC.'
      })
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
    let file = req.files.profile;
    file.mv('./public' + profileImage, function(err, res) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('file uploaded');
      }
    });
  }

  if (req.files && req.files.resume) {
    let file = req.files.resume;
    file.mv('./public' + resume_path, function(err, res) {
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

    //slug = firstName+'-'+new Date().getUTCMilliseconds();

    // If user is not unique, return error
    if (existingUser) {
      return res.json({
        code: 422,
        success: false,
        error: 'That email address is already in use.'
      })

    }

    // audioSessionId
    opentok.createSession(function(err, asession) {
      if (err) {
        console.log("error: " + err);
        return res.json({
          err: err,
          sessionId: "",
          token: ""
        });
      }

      //archiveSessionId
      opentok.createSession(function(err, aRSession) {

        if (err) {
          console.log("error: " + err);
          return res.json({
            err: err,
            sessionId: "",
            token: ""
          });
        }
        //videoSessionId
        opentok.createSession(function(err, vSession) {

          if (err) {
            console.log("error: " + err);
            return res.json({
              err: err,
              sessionId: "",
              token: ""
            });
          }

          var videoSessionId = vSession.sessionId
          var archiveSessionId = aRSession.sessionId
          var audioSessionId = asession.sessionId
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
            myFavorite,
          });

          User.findOne({
            slug: slug
          }, function(err, slugfound) {

            if (err) {} else if (slugfound && slugfound != null && slugfound != undefined && slugfound != "") {
              var t = ((new Date()).getHours()).toString() + ((new Date()).getMinutes()).toString() + ((new Date()).getSeconds()).toString() + ((new Date()).getMilliseconds()).toString()
              console.log(t)
              console.log(slug)
              slug = slug + t
              console.log(slug)
              user.slug = slug

              user.save((err, user) => {
                if (err) {
                  return next(err);
                }

                sendExpertSignupSuccessEmail(user);
                deleteExpertSignupToken(user.email);
                const userInfo = setUserInfo(user);
                res.status(201).json({
                  success: true,
                  user: {
                    _id: user._id,
                    customerId: "",
                    expertCategories: "",
                    expertFocusExpertise: "",
                    expertRates: "",
                    expertRating: "",
                    facebookURL: "",
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    locationCity: "",
                    locationCountry: "",
                    gender: "",
                    profileImage: '',
                    email: user.email,
                    slug: user.slug,
                    role: user.role,
                    userBio: user.userBio,
                    profile: {
                      firstName: user.profile.firstName,
                      lastName: user.profile.lastName
                    },
                    endorsements:'',
                    myFavorite:'',
                  },
                  message: 'Account Created Successfully',
                  token: `JWT ${generateToken(userInfo)}`,
                });
              });
            } else {

              console.log("Expert Pass")
              user.save((err, user) => {
                if (err) {
                  console.log(">>>>",err)
                  return next(err);
                }

                sendExpertSignupSuccessEmail(user);
                deleteExpertSignupToken(user.email);
                const userInfo = setUserInfo(user);
                res.status(201).json({
                  success: true,
                  user: {
                    _id: user._id,
                    customerId: "",
                    expertCategories: "",
                    expertFocusExpertise: "",
                    expertRates: "",
                    expertRating: "",
                    facebookURL: "",
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    locationCity: "",
                    locationCountry: "",
                    gender: "",
                    profileImage: profileImage,
                    resume_path: resume_path,
                    email: user.email,
                    slug: user.slug,
                    role: user.role,
                    userBio: user.userBio,
                    profile: {
                      firstName: user.profile.firstName,
                      lastName: user.profile.lastName
                    },
                    endorsements:'',
                    myFavorite:'',
                  },
                  message: 'Account Created Successfully',
                  token: `JWT ${generateToken(userInfo)}`,
                });
              });
            }
          })
        });
      });
    });
  });
};

/* API endpoint to render expert details */
exports.getExpertDetail = function(req, res, next) {
  var slug = req.params.slug;

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
      'slug' : slug,
    }, {
      '_id': 0,
      'accountCreationDate': 0,
      'createdAt': 0,
      'enableAccount': 0,
      // locationCity :0,
      // locationCountry : 0,
      // locationState : 0,
      locationZipcode: 0,
      password: 0,
    },
    function(err, expertsList) {
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

  /*ExpertsSubcategories.aggregate( [
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
  });*/
};

/* API endpoint to add endorsements and my favorite */
exports.addEndorsements = function(req, res, next){

  const {toSlug,fromSlug} = req.body
  if (!toSlug || !fromSlug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  User.findOne({"slug":toSlug},function(err, user){
        if (err){
          res.json({errorMessage:"Sorry Something Went Wrong"})
        }else{
          const endorsements = user.endorsements;
          if(endorsements.indexOf(fromSlug) < 0){
            endorsements.push(fromSlug);
          }

          user.endorsements  = endorsements;
          user.save(function(err,user){
            if(err){
              //res.json({code:422,success:false,"message":"Something went wrong!"})
            }else{
              //res.json({code:200,success:true,"message":"Expert added Successfully."})
            }
          })
        }
    })
  User.findOne({"slug":fromSlug},function(err, user){
        if (err){
          res.json({errorMessage:"Sorry Something Went Wrong"})
        }else{

          const myFavorite = user.myFavorite;

          if(myFavorite.indexOf(toSlug) < 0){
            myFavorite.push(toSlug);
          }
          user.myFavorite  = myFavorite;
          user.save(function(err,user){
            if(err){
              res.json({code:422,success:false,"message":"Something went wrong!"})
            }else{
              res.json({code:200,success:true,"message":"Expert added Successfully."})
            }
          })
        }
    })
}
/* API endpoint to get endorsements */

exports.getEndorsements = function(req, res, next){

  const {slug} = req.body
  console.log(slug)
  if (!slug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  User.find({
      'slug': {
         $in: slug
      },
    }, { profileImage: 1, slug: 1 },
    function(err, expertsList) {
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


}

exports.getMyExpertsListing = function(req, res, next){

  const {slug,category} = req.body


  if (!slug) {
    res.status(422).send({
      error: 'Please choose expert slug'
    });
    return next();
  }
  User.find({
    'expertCategories': {
      $regex: new RegExp(category, "i")
    },
    'role': "Expert",
    'slug': {
         $in: slug
      }
    // 'expertRating' : ['5','4']
  }, { '_id': 0,
    'accountCreationDate': 0,
    'createdAt': 0,
    'enableAccount': 0,
    // locationCity :0,
    // locationCountry : 0,
    // locationState : 0,
    locationZipcode: 0,
    password: 0,
    websiteURL: 0 },
    function(err, expertsList) {
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
}

exports.getExpertStories = function(req, res, next){
  var expertEmail = req.params.expertEmail;
  if (!req.params.expertEmail) {
    res.status(422).send({ error: 'Please choose expert Email' });
    return next();
  }
  ExpertStory.find({
    'expert.email' : expertEmail,
  },{
    _id:0,
    "timestamps.updatedAt" :0,
  },
  function (err, expertStoryList) {
    if(expertStoryList) {
      res.json(expertStoryList);
    } else {
      res.json({
        success: false,
        data: {},
        code: 404
      });
    }
  });
}

exports.saveUserReview = function(req, res, next) {
  var bind = {};
  var rating = req.body.rating;
  var review = req.body.review;
  var title = req.body.title;
  var expertEmail = req.body.expertEmail;
  var expertFullName = req.body.expertFullName;
  var userEmail = req.body.userEmail;
  var userFullName = req.body.userFullName;
  var expertSlug = req.body.expertSlug;
  var reviewBy = req.body.reviewBy;


  var newUserReview = new userReview();
  newUserReview.rating = rating;
  newUserReview.review = review;
  newUserReview.title = title;
  newUserReview.expertEmail = expertEmail;
  newUserReview.expertFullName = expertFullName;
  newUserReview.userEmail = userEmail;
  newUserReview.userFullName = userFullName;
  newUserReview.expertSlug = expertSlug;
  newUserReview.reviewBy = reviewBy

  newUserReview.save(function(error) {
    if (error) {
      bind.status = 0;
      bind.message = 'Oops! error occured while saving user review';
      bind.error = error;
    } else {

      userReview.find({
        "expertEmail": req.body.expertEmail,
        "reviewBy": "User"
      }, function(err, usersreviews) {
        if (usersreviews) {
          var total = 0;
          for (var x = 0; x < usersreviews.length; x++) {
            total = total + usersreviews[x].rating
          }
          var average = total / (usersreviews.length)
          User.findOne({
            "email": req.body.expertEmail
          }, function(err, user) {
            user.expertRating = average
            user.save()
          })
        } else {
          //                User.find({"email":req.body.expertEmail, "reviewBy":"User"},function(err, user){
          //                  user.expertRating=req.body.rating
          //
          //                  user.save()
          //
          //                })
        }

      })

      bind.status = 1;
      bind.message = 'User review was saved successfully';
      // create reusable transport method (opens pool of SMTP connections)
      var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: config.gmailEmail,
          pass: config.gmailPassword
        }
      });

      /* email for expert */
      var html = 'Hello <strong>' + allTitleCase(expertFullName) + '</strong>, <br> <strong>' + allTitleCase(userFullName) + '</strong> reviewed on your session.';
      html += '<p>Following is user information:</p>';
      html += '<p>Email : ' + userEmail + '</p>';
      html += '<p>Title : ' + title + '</p>';
      html += '<p>Review : ' + review + '</p>';
      html += '<p>Rating : ' + rating + '</p>';

      var mailOptions = {
        from: "Donnies List <no-reply@donnieslist.com>",
        to: expertEmail,
        subject: "Donnies List: User Review",
        html: html
      };
      smtpTransport.sendMail(mailOptions, function(error, response) {});
    }
    return res.json(bind);
  });
}

exports.getExpertStoriesBasedOnRole = function(req, res, next){
  var expertRole = req.params.expertRole;
  if (!req.params.expertRole) {
    res.status(422).send({ error: 'Please choose expert Role' });
    return next();
  }
  ExpertStory.aggregate([
    {
      $lookup:
        {
          from: "users",
          localField: "expert.email",
          foreignField: "email",
          as: "expert_details"
        }
    },
    {
      $match: {
        "expert_details": { $ne: [] },
        "expert_details.role":"Expert",
        "expert_details.expertCategories":expertRole
      }
    },
    {
      $project:{
        'expert_details._id':0,
        'expert_details.email':0,
        'expert_details.createdAt':0,
        'expert_details.updatedAt':0,
        'expert_details.password':0,
        'expert_details.accountCreationDate':0,
        'expert_details.enableAccount':0,
        'expert_details.contact':0,
        'expert_details.stripeId':0
      }
    }
  ],
    function (err, expertStoryList) {
    if(expertStoryList){
        res.json(expertStoryList);
    }else{
        res.json({
            success: false,
            data: {},
            code: 404
        });
    }
  });
}

exports.getExpertReviews = function(req, res, next) {
  var bind = {};
  var expertSlug = req.params.expertSlug;
  console.log(expertSlug)
  userReview.find({
    expertSlug: expertSlug,
    reviewBy: "User"
  }, function(err, reviews) {
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

}

exports.getExpertEmailFromToken = function(req, res, next) {
  var bind = {};
  ExpertSignupToken.findOne({
    'token': req.params.token
  }, function(err, response) {
    if (!err) {
      bind.status = 1;
      bind.message = 'Expert found';
      bind.email = response.email;
      return bind;
    } else {
      bind.status = 0;
      bind.message = 'Expert not found';
      bind.email = '';
      return bind;
    }
  });
};

function allTitleCase(inStr) {
  return inStr.replace(/\w\S*/g, function(tStr) {
    return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase();
  });
}
