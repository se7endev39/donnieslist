const ROLE_ADMIN = require('./constants').ROLE_ADMIN;
const ROLE_EXPERT = require('./constants').ROLE_EXPERT;
const ROLE_USER = require('./constants').ROLE_USER;
const ExpertSignupToken = require('./models/expertsignuptoken');

var config =  require ("./config/main")
var nodemailer = require("nodemailer");
var  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.gmailEmail,
      pass: config.gmailPassword,
    }
});

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    slug: request.slug,
    role: request.role,
    expertCategories: request.expertCategories,
    yearsexpertise:request.yearsexpertise,
    expertFocusExpertise:request.expertFocusExpertise,
    expertRates:request.expertRates,
    expertRating: request.expertRating,
    userBio: request.userBio,
    locationCountry: request.locationCountry,
    locationState: request.locationState,
    locationCity: request.locationCity,
    profileImage:request.profileImage,
    facebookURL : request.facebookURL,
    twitterURL  : request.twitterURL,
    linkedinURL  : request.linkedinURL,
    instagramURL  : request.instagramURL,
    snapchatURL  : request.snapchatURL,
    websiteURL  : request.websiteURL,
    customerId: request.stripe ? request.stripe.customerId : '',
    stripe_connect_id: request.stripeId ? request.stripeId : '',

  };

  return getUserInfo;
};

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_USER: role = 3; break;
    case ROLE_EXPERT: role = 2; break;
    case ROLE_ADMIN: role = 1; break;
    default: role = 1;
  }

  return role;
};

exports.sendRegistrationEmail = function sendRegistrationEmail(userInfo) {
    var site_name = "Donnie's List";
    //email header and footer
    var emailHtmlHead = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>';

    var emailHtmlHeader = '<div class="content-container" style="padding:18px;"><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;position:relative;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="http://www.donnieslist.com:3000/uploads/Donnys-List.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>';

    var emailHtmlFoot = '</body></html>';

    var htmlC = emailHtmlHead+'<div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>	<div class="content-container" style="padding:18px;">';

    htmlC = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;position:relative;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>	<div class="content-container" style="padding:18px;">';
    htmlC += '<h3>Welcome to '+site_name+'!</h3><p>Good Day To You, Thank you for registering with us!</p>';
    htmlC += '<p>To keep up with all the latest events at '+site_name+' please follow us on:</p>';
    htmlC += '<p><table width="100%" align="center"> <tbody> <tr> <td align="center"> <br> <a href="https://www.facebook.com" target="_blank" style="text-decoration:none;"> <img src="https://image.flaticon.com/icons/png/128/145/145802.png" border="0" hspace="3" width="34" height="32" style="border-radius: 20px;"> </a> <a href="https://twitter.com/" target="_blank" style="text-decoration:none;"> <img src="https://image.flaticon.com/icons/png/128/145/145812.png" border="0" hspace="3" width="34" height="32" style="border-radius: 20px;"> </a> <a href="https://www.instagram.com/" target="_blank" style="text-decoration:none;"> <img src="https://image.flaticon.com/icons/png/128/187/187207.png" border="0" hspace="3" width="34" height="32" style="border-radius: 20px;"> </a></td> </tr> </tbody> </table></p>';
    htmlC += '<p>We thank you,</p>';
    htmlC += '<p>Team '+site_name+'</p></div><table width="100%" align="center"><tbody> <tr> <td align="center"> <br> <a href="https://www.donnieslist.com/contact-us" target="_blank" style="font-size:10px;color:#666666;">Contact Us</a> </td> </tr> </tbody> </table></div>'+emailHtmlFoot;

    var mailOptions = {
        from   : site_name+" <no-reply@donnieslist.com>",
        to     : userInfo.email,
        subject: "Welcome to "+site_name+"!",
        html   : htmlC
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("In error of nodemailer")
            console.log(error);
        }else{
          console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
        }
    });
};

/*send email to expert for signup using homepage only for stanford & hardvard professionals*/
exports.sendExpertSignupTokenEmail = function sendExpertSignupTokenEmail(userInfo) {
    var site_name = "Donnie's List";
    //email header and footer
    var emailHtmlHead = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>';

    var emailHtmlHeader = '<div class="content-container" style="padding:18px;"><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;position:relative;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="http://www.donnieslist.com:3000/uploads/Donnys-List.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>';

    var emailHtmlFoot = '</body></html>';

    var htmlC = emailHtmlHead+'<div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>  <div class="content-container" style="padding:18px;">';

    var signupLink = config.website_url+'/expert-signup/'+userInfo.token;

    htmlC = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;position:relative;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>   <div class="content-container" style="padding:18px;">';
    htmlC += '<h3>Welcome to '+site_name+'!</h3><p>Good Day To You, Thank you for requesting for Expert account!</p>';
    htmlC += '<p>Please <a href='+signupLink+'>click here</a> to proceed with signup</p>';
    htmlC += '<p>We thank you,</p>';
    htmlC += '<p>Team '+site_name+'</p></div><table width="100%" align="center"><tbody> <tr> <td align="center"> <br> <a href="https://www.donnieslist.com/contact-us" target="_blank" style="font-size:10px;color:#666666;">Contact Us</a> </td> </tr> </tbody> </table></div>'+emailHtmlFoot;

    var mailOptions = {
        from   : "mobile.worldev@gmail.com", // site_name+" <no-reply@donnieslist.com>",
        to     : userInfo.email,
        //to     : 'ermohit400@yahoo.com',
        subject: "Welcome to "+site_name+"! Signup as Expert",
        html   : htmlC
    };
    console.log("mail options =======> ", mailOptions)
    
    console.log(config.gmailEmail, config.gmailPassword)
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("In error of nodemailer")
            console.log(error);
        }else{
          console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
        }
    });
};

/*send email to expert after successfull signup */
exports.sendExpertSignupSuccessEmail = function sendExpertSignupSuccessEmail(userInfo) {
    var site_name = "Donnie's List";
    //email header and footer
    var emailHtmlHead = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>';
    var emailHtmlHeader = '<div class="content-container" style="padding:18px;"><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;position:relative;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="http://www.donnieslist.com:3000/uploads/Donnys-List.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>';
    var emailHtmlFoot = '</body></html>';
    var htmlC = emailHtmlHead+'<div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>  <div class="content-container" style="padding:18px;">';
    var signupLink = config.website_url+'/expert-signup/'+userInfo.token;

    htmlC = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+site_name+' Registration</title></head><body><div style="width:580px;margin:0 auto;border:12px solid #f0f1f2;position:relative;color:#696969;font:14px Arial,Helvetica,sans-serif"><table align="center" width="100%" height="auto" style="position:relative" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <center><img src="http://www.donnieslist.com:3000/uploads/banner-email.jpg" border="0" width="100%" height="200" class="CToWUd a6T" tabindex="0"> <img src="https://www.donnieslist.com/src/public/img/donnieslist-logo.png" style="width: 35%;position: absolute;top: 150px;left: 10px;"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 641px; top: 270px;"></div></center> </td> </tr> </tbody></table>   <div class="content-container" style="padding:18px;">';
    htmlC += '<h3>Welcome to '+site_name+'!</h3><p>Good Day To You, Thank you for registering with us!</p>';
    htmlC += '<p>Now you can access awesome features of Donnies List as an Expert.</p>';
    htmlC += '<p>We thank you,</p>';
    htmlC += '<p>Team '+site_name+'</p></div><table width="100%" align="center"><tbody> <tr> <td align="center"> <br> <a href="https://www.donnieslist.com/contact-us" target="_blank" style="font-size:10px;color:#666666;">Contact Us</a> </td> </tr> </tbody> </table></div>'+emailHtmlFoot;

    var mailOptions = {
        from   : site_name+" <no-reply@donnieslist.com>",
        to     : userInfo.email,
        //to     : 'ermohit400@yahoo.com',
        subject: "Welcome to "+site_name+"! Successfully Registered",
        html   : htmlC
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("In error of nodemailer")
            console.log(error);
        }else{
          console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
        }
    });
};

/*after successfull expert signup, token from expertsignuptokens table will be deleted to prevent miss use*/
exports.deleteExpertSignupToken = function deleteExpertSignupToken(userEmail) {
    console.log('userEmail: '+userEmail);
    ExpertSignupToken.remove({ email: userEmail }, function(err) {
        if (!err) {
            console.log('record deleted');
            return true;
        }else{
            console.log('record not deleted');
            return false;
        }
    });
};
