// Importing Node packages required for schema
const mongoose    = require('mongoose');
const bcrypt      = require('bcrypt-nodejs');
const ROLE_EXPERT = require('../constants').ROLE_EXPERT;
const ROLE_USER   = require('../constants').ROLE_USER;
const ROLE_ADMIN  = require('../constants').ROLE_ADMIN;
const GENDER_MALE = require('../constants').GENDER_MALE;
const GENDER_FEMALE   = require('../constants').GENDER_FEMALE;
const GENDER_OTHER  = require('../constants').GENDER_OTHER;
const SESSION_ACTIVE  = require('../constants').SESSION_ACTIVE;
const SESSION_INACTIVE  = require('../constants').SESSION_INACTIVE;

const LOGIN_SOURCE_FACEBOOK = require('../constants').LOGIN_SOURCE_FACEBOOK;
const LOGIN_SOURCE_TWITTER = require('../constants').LOGIN_SOURCE_TWITTER;
const LOGIN_SOURCE_GMAIL = require('../constants').LOGIN_SOURCE_GMAIL;

const STATUS_ONLINE = require('../constants').STATUS_ONLINE;
const STATUS_OFFLINE = require('../constants').STATUS_OFFLINE;

const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  profileImage          : { type: String, default:''},
  email                 : { type: String, lowercase: true, unique: true, required: true },
  password              : { type: String, required: true },
  profile               : { firstName: { type: String }, lastName: { type: String } },
  role                  : { type: String, enum: [ROLE_EXPERT, ROLE_USER, ROLE_ADMIN], default: ROLE_USER },
  //stripe                : { customerId: { type: String }, subscriptionId: { type: String }, lastFour: { type: String }, plan: { type: String }, activeUntil: { type: Date } },
  stripe                : { customerId: String , cardInfo: {
                            exp_month: Number, // Two digit number representing the card's expiration month. 
                            exp_year: Number, // Two or four digit number representing the card's expiration year.
                            number: String, // The card number, as a string without any separators. 
                            address_city: String,
                            address_country: String,
                            address_line1: String,
                            address_line2: String,
                            address_state: String,
                            address_zip : String,
                            cvc: String,
                            name: String // Cardholder's full name. 
      } },
  resetPasswordToken    : { type: String },
  resetPasswordExpires  : { type: Date },
  contact               : {type: String},
  expertContactCC       : {type: String},
  dob                   : {type: String},
  gender                : {type: String, enum: [GENDER_MALE, GENDER_FEMALE, GENDER_OTHER]},
  locationZipcode       : {type: String, default: ''},
  locationCity          : {type: String, default: ''},
  locationState         : {type: String, default: ''},
  locationCountry       : {type: String, default: ''},
  userBio               : {type: String, default: ''},
      
  facebookURL           : {type: String, default: ''},
  twitterURL            : {type: String, default: ''},
  instagramURL          : { type: String, default: '' },
  linkedinURL           : { type: String, default: '' },
  snapchatURL           : { type: String, default: '' },
      
  websiteURL            : {type: String, default: ''},

  enableAccount         : {type: Boolean, default: true}, // true: enable, false: disable
  accountCreationDate   : {type: Date, default: Date.now()},
  slug                  : {type: String, default: ''},  //act as username
  expertRating          : {type: Number, default: ''},
  expertCategories      : {type: Array, default: [] },
  expertRates           : {type: Array, default: [] },
  expertFocusExpertise  : {type: String, default: ''},
  yearsexpertise        : {type: String, default: ''},
  fbLoginAccessToken    : {type: String, default: ''},
  jwtLoginAccessToken   : {type: String, default: ''},
  loginSource           : {type: String, enum: [LOGIN_SOURCE_FACEBOOK, LOGIN_SOURCE_TWITTER, LOGIN_SOURCE_GMAIL]},
  onlineStatus          : {type: String, enum: [STATUS_ONLINE, STATUS_OFFLINE]},

  videoSessionId        : {type: String, default: ''},
  audioSessionId        : {type: String, default: ''},
  archiveSessionId      : {type: String, default: ''},
  stripeId              : {type: String, default: ''},

  audioCallAvailability : {type: Boolean, default: true},
  videoSessionAvailability : {type: Boolean, default: true},
  expertSessionAvailability :    {type: Boolean, default: false},
  isUserJoinVideoSession         : {type: Boolean, default: false}
},
  {
    timestamps: true
  });

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
