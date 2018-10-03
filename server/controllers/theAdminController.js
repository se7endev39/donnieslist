var User = require('../models/user')
var nodemailer = require('nodemailer')


var   config =require ("../config/main")


  var  transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.gmailEmail,
        pass: config.gmailPassword,

      },
  });


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user : 'test4rvtech@gmail.com',
//         pass : 'RVtechtest#123',
//     },

// });



exports.theAdminsUserList = function(req, res) {

	      User.find({role:{$ne :["Admin"]} ,isDeleted:false}, (err, users) => {
	        if (err) {
	          res.status(400).json({ error: 'No user could be found for this ID.' });
	          return next(err);
	        }
	        else{
	        	console.log(JSON.stringify(users))
	        	return res.status(200).json({ user: users });
	        }

	      });
    }
exports.AdminGetUserInfo = function(req,res){
  // console.log("HI")
  // console.log(req.params.id)
  User.findById(req.params.id,function(err, user){
    if(err){
      res.json({FailureMessage:"Sorry "})
    }
    else{
      res.json({user:user})
    }

  })
}
exports.UpdateUserInfo =function(req,res){

      const {email,firstName,lastName,password,
        university,expertCategories,expertContact,
        expertContactCC,expertRating,expertFocusExpertise,yearsexpertise,
        facebookLink,
        profile,
        resume,
        isMusician,
        linkedinLink,
        instagramLink,
        youtubeLink,
        soundcloudLink,
        twitterLink,
        googleLink
      } = req.body

      const profileImage=req.files ?'/uploads/'+Date.now()+ '-' +req.files.profile.name:''
      const resume_path=req.files?'/uploads/'+Date.now() + '-' +req.files.resume.name:''

let passchange=false;

      User.findOne({"email":email}, function(err, user){
        if(req.files){
          let file = req.files.profile;
              file.mv('./public'+profileImage, function(err,res) {
                if (err){
                   console.log('Error',err);
                }else{
                   console.log('file uploaded');
                  }
              });
        }

        if(req.files){
          let file = req.files.resume;
              file.mv('./public'+resume_path, function(err,res) {
                if (err){
                   console.log('Error',err);
                }else{
                   console.log('file uploaded');
                  }
              });
        }

        user.profile.firstName  = firstName
        user.profile.lastName   = lastName
        if(password){
          user.comparePassword(password,function(err,pass){
            if(!pass){
              user.password=password
              passchange=true
            }
        })
        }

        if(req.files !=null && req.files.resume !=null ){
          user.resume_path= resume_path
        }
        if(req.files  && req.files.profile !=null ){
          user.profileImage=profileImage
        }

        // user.userBio            	= userBio
        // user.expertRates        	= expertRates
        user.expertCategories     	= expertCategories
        user.contact           	  	= expertContact
        user.expertContactCC	    	= expertContactCC
        user.expertRating           = expertRating
        user.expertFocusExpertise   = expertFocusExpertise
        user.yearsexpertise         = yearsexpertise
        user.university             =university;
        user.isMusician             =isMusician;

        user.facebookURL            = facebookLink
        user.linkedinURL            = linkedinLink,
        user.twitterURL             = twitterLink,
        user.googleURL              = googleLink,

        user.soundcloudURL=soundcloudLink,
        user.instagramURL=instagramLink,
        user.youtubeURL=youtubeLink

      user.save(function(err,updateUser){
          if(err){
            console.log(err)
              return res.json({code:402,success:false,message:'Something went worng!'})
          }else{
            if(passchange){
              return res.json({code:200,success:true,"message":"Profile Update Successfully.",passchange:true})
            }else{
            return   res.json({code:200,success:true,"message":"Profile Update Successfully."})

            }
          }
      })

      })

    }

exports.AdminToBanOrUnBanUser=function(req, res){

    var message = ""
    var state = ""
    // console.log(JSON.stringify(req.body.data))
      User.findById(req.body.id, (err, users) => {
          // console.log(JSON.stringify(users))
          if(users.enableAccount==true){
            users.enableAccount=false
            message="Successfully Banned the User"
            state="Banned"
				let mailOptions = {
				    from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
				    to: 'test4rvtech@gmail.com, '+users.email, // list of receivers
				    // to: "test4rvtech@gmail.com, "+email, // list of receivers
				    subject: 'DonnysList Youve Been Banned', // Subject line

				    html: '<b> Hello '+users.profile.firstName+".</b> You've been banned", // html body
				};

				// send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log("In error of nodemailer")
                        console.log(error);
                    }
                    else{
                    	console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
                    }

                });

          }
          else{
            users.enableAccount=true
            message= "Successfully Un Banned the User"
            state="UnBanned"
				let mailOptions = {
				    from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
				    to: 'test4rvtech@gmail.com, '+users.email, // list of receivers
				    // to: "test4rvtech@gmail.com, "+email, // list of receivers
				    subject: "DonnysList- Congratulations You've Been UnBanned", // Subject line

				    html: '<b> Hello '+users.profile.firstName+".</b> You've been Unbanned", // html body
				};

				// send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log("In error of nodemailer")
                        console.log(error);
                    }
                    else{
                    	console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
                    }

                });
          }

          users.save(function(err){
            if(err){
              res.status(400).json({ error: 'Something Went Wrong' });
            }
            else{
              res.json({SuccessMessage:message, state:state})
            }
          })
      })
   }

  exports.deleteHim=function(req, res){
       var message = ""
       var state = ""
       // console.log(JSON.stringify(req.body.data))
         User.findById(req.body.id, (err, users) => {
             // console.log(JSON.stringify(users))
               users.isDeleted=true
              users.enableAccount=false
               message="Successfully Delete the User"
               state="Deleted"
   				let mailOptions = {
   				    from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
   				    to: 'test4rvtech@gmail.com, '+users.email, // list of receivers
   				    // to: "test4rvtech@gmail.com, "+email, // list of receivers
   				    subject: 'DonnysList, You have Been Deleted', // Subject line

   				    html: '<b> Hello '+users.profile.firstName+".</b> You've been Delete", // html body
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


             users.save(function(err){
               if(err){
                 res.status(400).json({ error: 'Something Went Wrong' });
               }
               else{
                 res.json({SuccessMessage:message, state:state})
               }
             })
         })
      }
