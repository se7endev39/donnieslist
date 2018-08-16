const config = require('../config/main');
const stripe = require('stripe')(config.stripeApiKey);
const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;
const UserReview = require('../models/userreview');

var  request = require('request')
//= =======================================
// User Routes
//= =======================================
exports.viewProfile = function (req, res, next) {
  const userId = req.params.userId;

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
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId,{email:1, profile:1, expertCategories:1,locationCity:1,locationState:1,locationCountry:1,expertRating:1,expertCategories:1,
                        expertRates:1,expertFocusExpertise:1,yearsexpertise:1,password:1,contact:1,userBio:1,facebookURL:1,twitterURL:1,instagramURL:1,
                        linkedinURL:1,snapchatURL:1,profileImage:1, role:1, websiteURL:1,stripeId:1}, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    return res.status(200).json({ user: user });
  });
};
// editMyProfileStripeID
exports.editMyProfileStripeID= function(req,res, next){
        const userId = req.params.userId;

request.post({
    url: "https://connect.stripe.com/oauth/token",
    form: {
            grant_type: "authorization_code",
            client_id: "ca_AO6OL4V0irBbASlFy9dnrWoNYVgJC5Ru",
            code: req.params.code,
            client_secret: "sk_test_z8RFNnoaPTtap4kUehAMQ7Hi"
          }
  }, function(err, r, body) {


    var accessToken = JSON.parse(body).stripe_user_id;
    console.log("#######################################################")
    console.log(accessToken)
        if (req.user._id.toString() !== userId) { return res.json({ error: 'You are not authorized to view this user profile.' }); }
        User.findById(userId, function(err, user){
            if (err) {
              res.json({ error: 'No user could be found for this ID.' });
              return next(err);
            }
            else{
                user.stripeId=accessToken
                user.save()
                return res.json({status:"success", SuccessMessage:"Successfully Registered Stripe Payment Configuration"})
            }


        })


  });


}

exports.getUserReviews = function(req, res, next){
    const userEmail = req.param('userEmail');

    UserReview.aggregate([
        {
            $match: { userEmail: userEmail, reviewBy: "Expert" }
        },
        {
            $project: {

                createdAt: 1,
                title: 1,
                review: 1,
                rating: 1,
                expertFullName: 1,
            }
        },
        {
            $sort: { createdAt: -1 }
        }

    ], function(err, userReviews){
        var bind = {};
        if(err){
            bind.status = 0;
            bind.message = 'Oops! error occur while fetching user reviews';
            bind.error = err;
        } else if(userReviews){
            bind.status = 1;
            bind.userReviews = userReviews;
        } else {
            bind.status = 0;
            bind.message = 'No reviews found';
        }

        return res.json(bind);

    });
}

exports.UpdateMyOwnProfile =function(req, res){

          // console.log(req.body)
          const {email,firstName,lastName,password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity,facebookURL,twitterURL,instagramURL,linkedinURL,snapchatURL,websiteURL} = req.body.body
          // console.log(email)
          User.findOne({"email":email},function(err, user){
              if (err){
                res.json({errorMessage:"Sorry Something Went Wrong"})
              }
              else{
                user.profile.firstName=firstName;
                user.profile.lastName=lastName;
                // user.password  = password

                if(user.password!=password){
                  // user.password=password
                  console.log("Pass is different")
                  user.password = password
                }
                else{
                  console.log("Pass is same")
                }

                user.userBio = userBio;
                user.expertRates=expertRates
                user.expertCategories=expertCategories
                user.contact=expertContact
                user.expertFocusExpertise=expertFocusExpertise
                user.yearsexpertise=yearsexpertise
                user.locationCountry=locationCountry
                user.locationState=locationState
                user.locationCity=locationCity
                if(facebookURL && facebookURL!=null && facebookURL!=undefined && facebookURL!=""){
                    user.facebookURL= facebookURL
                }
                if(twitterURL && twitterURL!=null && twitterURL!=undefined && twitterURL!=""){
                    user.twitterURL= twitterURL
                }
                if(instagramURL && instagramURL!=null && instagramURL!=undefined && instagramURL!=""){
                    user.instagramURL= instagramURL
                }
                if(linkedinURL && linkedinURL!=null && linkedinURL!=undefined && linkedinURL!=""){
                    user.linkedinURL= linkedinURL
                }
                if(snapchatURL && snapchatURL!=null && snapchatURL!=undefined && snapchatURL!=""){
                    user.snapchatURL= snapchatURL
                }
                if(websiteURL && websiteURL!=null && websiteURL!=undefined && websiteURL!=""){
                    user.websiteURL= websiteURL
                }
                user.save()
              }
          })
        res.json({"message":"Working"})
}


exports.UpdateMyOwnProfilePicture = function(req, res){
        console.log(req.body)
        console.log("**********************************")
        // console.log(JSON.stringify(req.files))
        if(req.body.expertEmail && req.body.expertEmail!=null && req.body.expertEmail!=undefined && req.body.expertEmail!="" && req.files && req.files!=null && req.files!=undefined && req.files.RelatedImages1 && req.files.RelatedImages1!=null && req.files.RelatedImages1[0] && req.files.RelatedImages1[0]!=null && req.files.RelatedImages1[0]!=undefined){
          User.findOne({email:req.body.expertEmail}, function(err, user){
            if(err){
                res.json({"errorMessage":"Something Went Wrong"})
            }
            else if(!user || user==undefined){
              res.json({"errorMessage":"Sorry user Doesn't exist"})
            }
            else{
              var path =req.files.RelatedImages1[0].path
              path = path.replace("public", "")
              console.log(path)
              user.profileImage=path
              user.save(function(err){
                if(err){
                  res.json({"errorMessage":"Sorry Couldnt Save"})
                }
                else{
                  res.json({"SuccessMessage":"Successfully Updated"})
                }
              })
            }
          })
        }

}

exports.addAccountInfo = function(req, res, next){
    // console.log("##################################")
    // console.log("req.body")
    // console.log(JSON.stringify(req.body.body))
    var bind = {};
    var emailId = req.body.body.emailId;
    var exp_month = req.body.body.exp_month;
    var exp_year = req.body.body.exp_year;
    var number = req.body.body.car_number;
    var address_city = req.body.body.address_city;
    var address_country = req.body.body.address_country;
    var address_line1 = req.body.body.address_line1;
    var address_line2 = req.body.body.address_line2;
    var address_state = req.body.body.address_state;
    var address_zip = req.body.body.address_zip;
    var cvc = req.body.body.cvc;
    var name = req.body.body.car_holder_name;

    User.findOne({ email: emailId }, function(err, user){
        if(err){
            bind.status = 0;
            bind.message = 'Oops! Error occured while fetching user information';
            bind.error = err;
            return res.json(bind);
        }
        if(user){
            stripe.customers.create({
            source: {
                 object: 'card',
                exp_month: exp_month,
                exp_year: exp_year,
                number: number,
                address_city: address_city,
                address_country: address_country,
                address_line1: address_line1,
                address_line2: address_line2,
                address_state: address_state,
                address_zip: address_zip,
                cvc: cvc,
                name: name
            },
            email: emailId,
            }, function(err, customer) {
                if(err){
                    bind.status = 0;
                    bind.message = 'Oops! Error occur while creating customer in stripe';
                    bind.error = err;
                    return res.json(bind);
                } else {
                    var customer_id = customer.id;
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

                    user.save(function(err){
                        if(err){
                            bind.status = 0;
                            bind.message = 'Oops! Error occured while saving user account info';
                            bind.error = err;
                        } else {
                            bind.status = 1;
                            bind.message = 'User account info was saved successfully';
                            bind.customer = customer;
                        }
                        return res.json(bind);
                    });
                }
            });
        } else {
            bind.status = 0;
            bind.message = 'No user found';
            return res.json(bind);
        }
    });
}
// FetchAccountInfo
exports.FetchAccountInfo = function(req, res, next){

    console.log(req.body.body.emailId);
    var emailId =req.body.body.emailId;
    var bind={};
    User.findOne({ email: emailId }, function(err, user){
        if(err){
            bind.status = 0;
            bind.message = 'Oops! Error Occured While Fetching User';
            bind.error = err;
            return res.json(bind);
        }
        if(user && user!=null){
            res.json({user:user.stripe})
        }
        else{
            bind.status = 0;
            bind.message = 'Oops! No Such User Found';
            bind.error = err;
            return res.json(bind);
        }

    })




    }
