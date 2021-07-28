const nodemailer = require('nodemailer');
const User = require('../models/user');
const config = require('../config/main');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.gmailEmail,
    pass: config.gmailPassword

  }
});

exports.theAdminsUserList = function (req, res, next) {
  User.find({ role: { $ne: ['Admin'] }, isDeleted: false }, (err, users) => {
    // User.find({role:{$ne :["Admin"]} }, (err, users) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    users.forEach((item) => {
      if (!item.isDeleted) {
        User.updateOne(
          { _id: item._id },
          { $set: { isDeleted: false } }
        )
          .then((result) => {
            console.log('isDeleted status updated');
          })
          .catch((err1) => {
            console.log('error in update isDeleted', err1);
          });
      }
    });
    return res.status(200).json({ user: users });
  });
};
exports.AdminGetUserInfo = function (req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.json({ FailureMessage: 'Sorry ' });
    } else {
      res.json({ user });
    }
  });
};
exports.UpdateUserInfo = function (req, res) {
  const {
    email, firstName, lastName, password,
    university, expertCategories, expertContact,
    expertContactCC, expertRating, expertFocusExpertise, yearsexpertise,
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
  } = req.body;

  const profileImage = req.files ? `/uploads/${Date.now()}-${req.files.profile.name}` : '';
  const resume_path = req.files ? `/uploads/${Date.now()}-${req.files.resume.name}` : '';

  let passchange = false;

  User.findOne({ email }, (err, user) => {
    if (req.files) {
      const file = req.files.profile;
      file.mv(`./public${profileImage}`, (err1, res1) => {
        if (err1) {
          console.log('[FILE]:[UPLOAD]:[ERROR]', err1);
        } else {
          console.log('[FILE]:[UPLOADED]');
        }
      });
    }

    if (req.files) {
      const file = req.files.resume;
      file.mv(`./public${resume_path}`, (err1, res1) => {
        if (err1) {
          console.log('[FILE]:[UPLOAD]:[ERROR]', err1);
        } else {
          console.log('[FILE]:[UPLOADED]');
        }
      });
    }

    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    if (password) {
      user.comparePassword(password, (err1, pass) => {
        if (!pass) {
          user.password = password;
          passchange = true;
        }
      });
    }

    if (req.files != null && req.files.resume != null) {
      user.resume_path = resume_path;
    }
    if (req.files && req.files.profile != null) {
      user.profileImage = profileImage;
    }

    // user.userBio = userBio
    // user.expertRates = expertRates
    user.expertCategories = expertCategories;
    user.contact = expertContact;
    user.expertContactCC = expertContactCC;
    user.expertRating = expertRating;
    user.expertFocusExpertise = expertFocusExpertise;
    user.yearsexpertise = yearsexpertise;
    user.university = university;
    user.isMusician = isMusician;

    user.facebookURL = facebookLink;
    user.linkedinURL = linkedinLink;
    user.twitterURL = twitterLink;
    user.googleURL = googleLink;

    user.soundcloudURL = soundcloudLink;
    user.instagramURL = instagramLink;
    user.youtubeURL = youtubeLink;

    user.save((err1, updateUser) => {
      if (err1) {
        console.log(err1);
        return res.json({ code: 402, success: false, message: 'Something went worng!' });
      }
      if (passchange) {
        return res.json({
          code: 200, success: true, message: 'Profile Update Successfully.', passchange: true
        });
      }
      return res.json({ code: 200, success: true, message: 'Profile Update Successfully.' });
    });
  });
};

exports.AdminToBanOrUnBanUser = function (req, res) {
  let message = '';
  let state = '';
  User.findById(req.body.id, (err, users) => {
    if (users.enableAccount === true) {
      users.enableAccount = false;
      message = 'Successfully Banned the User';
      state = 'Banned';
      const mailOptions = {
        from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
        to: `test4rvtech@gmail.com, ${users.email}`, // list of receivers
        // to: "test4rvtech@gmail.com, "+email, // list of receivers
        subject: 'DonnysList Youve Been Banned', // Subject line

        html: `<b> Hello ${users.profile.firstName}.</b> You've been banned` // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('[ERROR]:[NODE MAILER]', error);
        } else {
          console.log('[MSG]:[SEND_TO]:[USER]:', JSON.stringify(info));
        }
      });
    } else {
      users.enableAccount = true;
      message = 'Successfully Un Banned the User';
      state = 'UnBanned';
      const mailOptions = {
        from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
        to: `test4rvtech@gmail.com, ${users.email}`, // list of receivers
        // to: "test4rvtech@gmail.com, "+email, // list of receivers
        subject: "DonnysList- Congratulations You've Been UnBanned", // Subject line

        html: `<b> Hello ${users.profile.firstName}.</b> You've been Unbanned` // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('[ERROR]:[NODE MAILER]', error);
        } else {
          console.log('[MSG]:[SEND_TO]:[USER]:', JSON.stringify(info));
        }
      });
    }

    users.save((err1) => {
      if (err1) {
        res.status(400).json({ error: 'Something Went Wrong' });
      } else {
        res.json({ SuccessMessage: message, state });
      }
    });
  });
};

exports.deleteHim = function (req, res) {
  let message = '';
  let state = '';
  User.findById(req.body.id, (err, users) => {
    users.isDeleted = true;
    users.enableAccount = false;
    message = 'Successfully Delete the User';
    state = 'Deleted';
    const mailOptions = {
      from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
      to: `test4rvtech@gmail.com, ${users.email}`, // list of receivers
      // to: "test4rvtech@gmail.com, "+email, // list of receivers
      subject: 'DonnysList, You have Been Deleted', // Subject line

      html: `<b> Hello ${users.profile.firstName}.</b> You've been Delete` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('[ERROR]:[NODE MAILER]', error);
      } else {
        console.log('[MSG]:[SEND_TO]:[USER]:', JSON.stringify(info));
      }
    });

    users.save((err1) => {
      if (err1) {
        res.status(400).json({ error: 'Something Went Wrong' });
      } else {
        res.json({ SuccessMessage: message, state });
      }
    });
  });
};
