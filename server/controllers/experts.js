const Experts = require('../models/experts');
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

var  transporter = nodemailer.createTransport({
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

/* API endpoint to render all categories list on homepage */
exports.getExpertsCategoryList = function (req, res, next) {
  Experts.aggregate(
    [
      {   $project: {'subcategory': 1, 'name': 1, 'slug': 1, 'order': 1} },
      {   $sort: {'order': -1} },
      {   $unwind: '$subcategory' },
      //{   $sort: {'subcategory.name': 1} },
      {   $group: {_id: '$_id', 'name': {  $first: '$name'}, 'slug': {  $first: '$slug'} ,'subcategory': {  $push: '$subcategory'} } },
      //{   $sort: {'name': 1} }
    ], function (err, users) {
      if(err){
          return res.status(200).json(err);
      }
      return res.status(200).json(users);
  });
};

/* API endpoint to render all experts list by category */
exports.getExpertsListing = function(req, res, next) {
  if (!req.params.category) {
    res.status(422).send({ error: 'Please choose any category' });
    return next();
  }

  var category = req.params.category;

  res.header('Access-Control-Allow-Origin', '*');
    User.find(
        {
          'expertCategories' : { $regex : new RegExp(category, "i") },
          "role":'Expert',
        },
        {
          '_id':0,
          'accountCreationDate':0,
          'createdAt':0,
          'enableAccount':0,
          // locationCity :0,
          // locationCountry : 0,
          // locationState : 0,
          locationZipcode: 0,
          password: 0,
          websiteURL: 0
        }).sort( { "createdAt": -1 } ).exec(
      function (err, expertsList) {
      if(expertsList){
          res.json(expertsList);
      }else{
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
    res.status(422).send({ error: 'Please choose any category' });
    return next();
  }

  var category = req.params.category;

  res.header('Access-Control-Allow-Origin', '*');
    User.find(
        {
          'expertCategories' : { $regex : new RegExp(category, "i") },
          'expertRating':{
            '$lte':5,
            "$gte":4,
          },
          'role':"Expert"
          // 'expertRating' : ['5','4']
        },
        {
          '_id':0,
          'accountCreationDate':0,
          'createdAt':0,
          'enableAccount':0,
          // locationCity :0,
          // locationCountry : 0,
          // locationState : 0,
          locationZipcode: 0,
          password: 0,
          websiteURL: 0
        }).sort( { "expertRating": -1 } ).exec(
      function (err, expertsList) {
      if(expertsList){
          res.json(expertsList);
      }else{
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
  if ( ( !req.body.email && req.body.email != undefined ) && ( !req.body.message  && req.body.message != undefined ) && ( !req.params.expertemail  && req.params.expertemail != undefined ) ) {
    res.status(422).send({ error: 'Please choose any category' });
    return next();
  }

  var email = req.body.email;
  var message = req.body.message;
  var expertemail = req.body.expertemail;

  /* email for expert */
  var html = 'Hello , <br> Someone requested to have Donnies list session with you. ';
  html += '<p>Following is user information:</p>';
  html += '<p>Email : '+email+'</p>';
  html += '<p>Message : '+message+'</p>';

  var mailOptions = {
      from   : "Donnies list <no-reply@donnieslist.com>",
      to     : expertemail,
      subject: "Donnies List Session Request",
      html   : html
  };

  /* email for session requester */
  var html1 = 'Hello , <br> Thank you for submitting your request.';
  html1 += '<p>Information you entered:</p>';
  html1 += '<p>Your Email : '+email+'</p>';
  html1 += '<p>Your Message : '+message+'</p>';
  html1 += '<br><p>We will contact you soon! <br>Team Donnies List</p>';
  var mailOptions1 = {
      from   : "Donnies List <no-reply@donnieslist.com>",
      to     : email,
      subject: "Donnies List Session Request",
      html   : html1
  };
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log("In error of nodemailer")
              console.log(error);
          }
          else{
            console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
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
    if ( ( req.body.text_message != "" && req.body.text_message != undefined ) && ( req.body.text_expert_email != "" && req.body.text_expert_email != undefined ) ){
      var request = require('request'),
        bodyMessage = req.body.text_message,
        expertEmail = req.body.text_expert_email,
        twilioAccountSID  = "AC498497309e749bdb201a20c3d1e0c1f9",
        twilioauthToken = "2cd189a265a979a999c0656396e1b8fb",
        twilioFromNumber  = "+14237026040",
        messageBodyPrefix = "Hi, Someone contacted you on www.donnieslist.com. Message : ";

        console.log('text_expert_email: '+req.body.text_expert_email);

        User.findOne({"email" : expertEmail},function(err, user){
          if(!err && user != ""){
            console.log(user)
            var client = require('twilio')(twilioAccountSID, twilioauthToken);
            client.messages.create({
                // to: user.contact,
                to: user.expertContactCC+user.contact,
                from: twilioFromNumber,
                body: messageBodyPrefix+bodyMessage
            }, function(err, message) {
                if(!err && message.sid){
                  res.status(200).send({message: "Message successfully sent to expert!", messageId : message.sid, error : ""});
                }else{
                  console.log(err)
                  res.status(200).send({message: "", error : err});
                }
            });
          }else{
            res.send({err : err});
          }
        });
    }else{
      res.status(422).send({ error: 'parameters empty' });
    }
};

/* API endpoint to create expert by admin user */
exports.createExpert = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const contact = req.body.expertContact;
  const expertContactCC= req.body.expertContactCC;
  const lastName = req.body.lastName;
  const password = req.body.password;
  let slug = req.body.firstName+'-'+req.body.lastName;
  var  role = 'Expert';
  const userBio = req.body.userBio;
  const expertRates = req.body.expertRates;
  const expertCategories = req.body.expertCategories;
  const expertRating = req.body.expertRating;
  const expertFocusExpertise = req.body.expertFocusExpertise;
  const yearsexpertise = req.body.yearsexpertise;
  const facebookURL = req.body.facebookLink;
  const twitterURL = req.body.twitterLink;
  const instagramURL = req.body.instagramLink;
  const linkedinURL = req.body.linkedinLink;
  const snapchatURL = req.body.snapchatLink ? req.body.snapchatLink : '';
  const expertUniversity = req.body.expertUniversity ? req.body.expertUniversity : '';

  // Return error if no email provided  
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    //slug = firstName+'-'+new Date().getUTCMilliseconds();

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That email address is already in use.' });
    }

      // audioSessionId
      opentok.createSession(function(err, asession) {
    
        if(err){
            console.log("error: " + err);
            return res.json({ err : err, sessionId : "", token : ""});
        }

          //archiveSessionId
          opentok.createSession(function(err, aRSession) {
        
            if(err){
                console.log("error: " + err);
                return res.json({ err : err, sessionId : "", token : ""});
            }
                //videoSessionId
                opentok.createSession(function(err, vSession) {
              
                  if(err){
                      console.log("error: " + err);
                      return res.json({ err : err, sessionId : "", token : ""});
                  }

                  var videoSessionId    = vSession.sessionId
                  var archiveSessionId  = aRSession.sessionId
                  var audioSessionId    = asession.sessionId

                    // If email is unique and password was provided, create account
                  const user = new User({
                    email,
                    password,
                    contact,
                    expertContactCC,
                    profile: { firstName, lastName },
                    slug,
                    userBio,
                    expertRates,
                    expertCategories,
                    expertRating,
                    expertFocusExpertise,
                    yearsexpertise,
                    facebookURL,
                    twitterURL,
                    instagramURL,
                    linkedinURL,
                    snapchatURL,
                    role,
                    videoSessionId,
                    archiveSessionId,
                    audioSessionId,
                    expertUniversity,
                  });

                  User.findOne({slug:slug}, function(err, slugfound){
                    if(err){
                    }
                    else if(slugfound && slugfound!=null && slugfound!=undefined && slugfound!=""){
                      var t =((new Date()).getHours()).toString()+((new Date()).getMinutes()).toString()+((new Date()).getSeconds()).toString()+((new Date()).getMilliseconds()).toString()
                      console.log(t)
                      console.log(slug)
                      slug = slug+t
                      console.log(slug)
                      user.slug = slug

                      user.save((err, user) => {
                        if (err) { return next(err); }

                        sendExpertSignupSuccessEmail(user);
                        deleteExpertSignupToken(user.email);
                        const userInfo = setUserInfo(user);
                        res.status(201).json({
                          user: {
                            _id : user._id,
                            customerId : "",
                            expertCategories : "",
                            expertFocusExpertise : "",
                            expertRates : "",
                            expertRating: "",
                            facebookURL: "",
                            firstName: user.profile.firstName,
                            lastName: user.profile.lastName,
                            locationCity: "",
                            locationCountry: "",
                            gender : "",
                            profileImage: '',
                            email : user.email,
                            slug : user.slug,
                            role : user.role,
                            userBio: user.userBio,
                            profile : {
                              firstName : user.profile.firstName,
                              lastName : user.profile.lastName
                            },
                          },
                          message: 'Account Created Successfully',
                          token: `JWT ${generateToken(userInfo)}`,
                        });
                      });
                    }
                    else{
                      console.log("Expert Pass")
                      user.save((err, user) => {
                        if (err) { return next(err); }

                        sendExpertSignupSuccessEmail(user);
                        deleteExpertSignupToken(user.email);
                        const userInfo = setUserInfo(user);
                        res.status(201).json({
                          user: {
                            _id : user._id,
                            customerId : "",
                            expertCategories : "",
                            expertFocusExpertise : "",
                            expertRates : "",
                            expertRating: "",
                            facebookURL: "",
                            firstName: user.profile.firstName,
                            lastName: user.profile.lastName,
                            locationCity: "",
                            locationCountry: "",
                            gender : "",
                            profileImage: '',
                            email : user.email,
                            slug : user.slug,
                            role : user.role,
                            userBio: user.userBio,
                            profile : {
                              firstName : user.profile.firstName,
                              lastName : user.profile.lastName
                            },
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
    res.status(422).send({ error: 'Please choose expert slug' });
    return next();
  }
  User.find(
      {
        'slug' : { $regex : new RegExp(slug, "i") },
      },
      {
        '_id':0,
        'accountCreationDate':0,
        'createdAt':0,
        'enableAccount':0,
        // locationCity :0,
        // locationCountry : 0,
        // locationState : 0,
        locationZipcode: 0,
        password: 0,
      },
    function (err, expertsList) {
    if(expertsList){
        res.json(expertsList);
    }else{
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

exports.saveUserReview = function(req, res, next){
    var bind = {};
    var rating = req.body.rating;
    var review = req.body.review;
    var title = req.body.title;
    var expertEmail = req.body.expertEmail;
    var expertFullName = req.body.expertFullName;
    var userEmail = req.body.userEmail;
    var userFullName = req.body.userFullName;
    var expertSlug = req.body.expertSlug;
    var reviewBy =  req.body.reviewBy;
    
    
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
    
    newUserReview.save(function(error){
        if(error){
            bind.status = 0;
            bind.message = 'Oops! error occured while saving user review';
            bind.error    = error;
        } else {

          userReview.find({"expertEmail":req.body.expertEmail, "reviewBy":"User"},function(err, usersreviews){
            if(usersreviews){
                var total=0;
                for(var x=0;x<usersreviews.length;x++){
                  total=total+usersreviews[x].rating
                }
                var average= total/(usersreviews.length)
                User.findOne({"email":req.body.expertEmail},function(err, user){
                  user.expertRating=average
                  user.save()
                })
            }else{
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
            var smtpTransport = nodemailer.createTransport("SMTP",{
                service: "Gmail",
                auth: {
                    user: config.gmailEmail,
                    pass: config.gmailPassword
                }
            });
            
            /* email for expert */
            var html = 'Hello <strong>'+allTitleCase(expertFullName)+'</strong>, <br> <strong>'+ allTitleCase(userFullName) + '</strong> reviewed on your session.';
            html += '<p>Following is user information:</p>';
            html += '<p>Email : '+userEmail+'</p>';
            html += '<p>Title : '+title+'</p>';
            html += '<p>Review : '+review+'</p>';
            html += '<p>Rating : '+rating+'</p>';
            
           var mailOptions = {
                from   : "Donnies List <no-reply@donnieslist.com>",
                to     : expertEmail,
                subject: "Donnies List: User Review",
                html   : html
            };
            smtpTransport.sendMail(mailOptions, function(error, response){
            });
        }
        return res.json(bind);
    });
}

exports.getExpertReviews = function(req, res, next){
    var bind = {};
    var expertSlug = req.params.expertSlug;
    console.log(expertSlug)
    userReview.find({ expertSlug:expertSlug, reviewBy:"User" }, function(err, reviews){
        if(err){
            bind.status = 0;
            bind.message = 'Oops! error occured while fetching user reviews';
            bind.error = err;
        } else if(reviews){
            bind.status = 1;
            bind.reviews = reviews;
        } else {
            bind.status = 0;
            bind.message = 'No reviews Found';
        }
        
        return res.json(bind);
    }).sort({ _id: -1 });
    
}

exports.getExpertEmailFromToken = function(req, res, next){
  var bind = {};
  ExpertSignupToken.findOne({'token':req.params.token},function(err, response){
    if(!err){
      bind.status = 1;
      bind.message = 'Expert found';
      bind.email = response.email;
      return bind;
    }else{
      bind.status = 0;
      bind.message = 'Expert not found';
      bind.email = '';
      return bind;
    }
  });
};

function allTitleCase(inStr) {
    return inStr.replace(/\w\S*/g, function(tStr) { return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase(); });
} 


