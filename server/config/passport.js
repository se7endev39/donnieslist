const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('./main');
const { setUserInfo } = require('../helpers');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secret
};

const localOptions = {
  usernameField: 'email'
};

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(localOptions, (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }
        user.comparePassword(password, (err1, isMatch) => {
          if (err1) { return done(err1); }
          if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }
          if (user.enableAccount && user.enableAccount !== null && user.enableAccount !== undefined && user.enableAccount === true) {
            user.onlineStatus = 'ONLINE';
            user.save((err2, doc) => done(null, doc));
          } else {
            return done(null, { message: "you've been Banned", status: false });
          }
          return done(null, user);
        });
      });
    })
  );

  passport.use(
    new JwtStrategy(jwtOptions, (payload, done) => {
      User.findById(payload._id, (err, user) => {
        if (err) { return done(err, false); }
        if (user) {
          if (user.enableAccount && user.enableAccount !== null && user.enableAccount !== undefined && user.enableAccount === true) {
            done(null, user);
          } else {
            done(null, false, { message: 'Sorry the account is banned' });
          }
        } else {
          done(null, false);
        }
      });
    })
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebookAuthClientID,
        clientSecret: config.facebookAuthClientSecret,
        callbackURL: config.facebookAuthCallbackURL,
        // passReqToCallback : true,
        profileFields: ['id', 'emails', 'photos', 'name', 'birthday', 'about', 'gender']
      },
      ((token, refreshToken, profile, done) => {
        // if(profile){
        // asynchronous
        process.nextTick(() => {
          User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) return done(err);

            if (user) {
              const userInfo = setUserInfo(user);
              // user.fbLoginAccessToken  = token;
              user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
              user.loginSource = 'Facebook';
              user.onlineStatus = 'ONLINE';
              user.save((err1, doc) => {
                console.log(`** ** ** generateToken user : ${doc}`);
                return done(null, doc);
              });
              // return done(null, user); // user found, return that user
            } else {
              const newUser = new User();
              const slug = `${profile.emails[0].value.substring(0, profile.emails[0].value.lastIndexOf('@'))}-${profile._json.first_name}`;
              newUser.email = profile.emails[0].value;
              newUser.password = 'rvtech123#';
              newUser.profile.firstName = profile._json.first_name;
              newUser.profile.lastName = profile._json.last_name;
              newUser.slug = slug;
              newUser.gender = profile._json.gender.charAt(0).toUpperCase() + profile._json.gender.slice(1);
              // newUser.fbLoginAccessToken = token;
              newUser.loginSource = 'Facebook';
              newUser.onlineStatus = 'ONLINE';
              newUser.save((err1) => {
                if (err1) {
                  console.log(`error occured while saving: ${err1}`);
                  throw err1;
                } else {
                  console.log('data added');
                }
                // if successful, return the new user
                const userInfo = setUserInfo(user);
                return done(null, newUser, `JWT ${generateToken(userInfo)}`);
                // return done(null, newUser);
              });
            }
          });
        });
      })
    )
  );

  /*
  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(new TwitterStrategy({
      consumerKey     : config.twitterAuthConsumerKey,
      consumerSecret  : config.twitterAuthConsumerSecret,
      callbackURL     : config.twitterAuthCallbackURL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
        User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
              const userInfo = setUserInfo(user);
              //user.fbLoginAccessToken  = token;
              user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
              user.loginSource       = 'Twitter';
              user.save(function(err, doc) {
                  console.log('** ** ** generateToken user : '+doc);
                  return done(null,doc);
              });

            } else {
                var newUser               = new User();
                var slug                  = profile.emails[0].value.substring(0, profile.emails[0].value.lastIndexOf("@"))+'-'+profile._json.first_name;
                newUser.email             = profile.emails[0].value;
                newUser.password          = "rvtech123#";
                newUser.profile.firstName = profile._json.first_name;
                newUser.profile.lastName  = profile._json.last_name;
                newUser.slug              = slug;
                newUser.gender            = profile._json.gender.charAt(0).toUpperCase() + profile._json.gender.slice(1);
                //newUser.fbLoginAccessToken = token;
                newUser.loginSource       = 'Twitter';
                newUser.save(function(err) {
                  if (err){
                        console.log('error occured while saving: '+err);
                        throw err;
                    }else{
                        console.log('data added');
                    }
                    // if successful, return the new user
                    const userInfo = setUserInfo(user);
                    return done(null, newUser,`JWT ${generateToken(userInfo)}`);
                    //return done(null, newUser);
                });
            }
        });
    });
  }));
  */
};
