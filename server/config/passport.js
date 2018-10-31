// Importing Passport, strategies, and config
const User = require('../models/user'),
  config = require('./main'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local'),
  FacebookStrategy = require('passport-facebook').Strategy,
  TwitterStrategy  = require('passport-twitter').Strategy,
  jwt = require('jsonwebtoken'),
  setUserInfo = require('../helpers').setUserInfo;

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}
// Setting username field to email rather than username
const localOptions = {
  usernameField: 'email'
};

module.exports = function(passport) {
// Setting up local login strategy
  const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    
    User.findOne({ email }, (err, user) => {
      //console.log("i am in");
      if (err) {console.log("err"); return done(err); }
      if (!user) {console.log("err"); return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

      user.comparePassword(password, (err, isMatch) => {
        // console.log("Password matched in passwport")
        if (err) { return done(err); }
        if (!isMatch) {console.log("Password not Matched"); return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }
        
        if(user.enableAccount && user.enableAccount !== null && user.enableAccount !== undefined && user.enableAccount === true){
          //console.log("if 1");
          //console.log("Password matched in passwport");
          user.onlineStatus      = 'ONLINE';
          user.save(function(err, doc) {
              return done(null,doc);
          });
        }else{
          //console.log("else 1");
          return done(null, { message: "you've been Banned", status:false }); 
        }

        //return done(null, user);
      });
    });
  });

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
      clientID        : config.facebookAuthClientID,
      clientSecret    : config.facebookAuthClientSecret,
      callbackURL     : config.facebookAuthCallbackURL,
      //passReqToCallback : true,
      profileFields: ['id', 'emails', 'photos','name', 'birthday', 'about', 'gender']
  },
  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
      //if(profile){
          // asynchronous
          process.nextTick(function() {
              // find the user in the database based on their facebook id
              User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                  if (err)
                      return done(err);

                  // if the user is found, then log them in
                  if (user) {
                    const userInfo = setUserInfo(user);
                    //user.fbLoginAccessToken  = token;
                    user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
                    user.loginSource       = 'Facebook';
                    user.onlineStatus      = 'ONLINE';
                    user.save(function(err, doc) {
                        console.log('** ** ** generateToken user : '+doc);
                        return done(null,doc);
                    });
                      //return done(null, user); // user found, return that user
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
                      newUser.loginSource       = 'Facebook';
                      newUser.onlineStatus      = 'ONLINE';
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
  // Setting JWT strategy options
  const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: config.secret

    // TO-DO: Add issuer and audience checks
  };

  // Setting up JWT login strategy
  const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
      if (err) { return done(err, false); }

      if (user) {
        console.log("***********")
        // console.log(JSON.stringify(user))
        // console.log("***********")
        // console.log("***********")
        console.log("***********"+user.enableAccount)
        if(user.enableAccount && user.enableAccount!==null && user.enableAccount!==undefined && user.enableAccount===true)
        {
          done(null, user)
        }
        else{
          done(null, false,{message:"Sorry the account is banned"});
        }
      
      } else {
        done(null, false);
      }
    });
  });

  passport.use(jwtLogin);
  passport.use(localLogin);

};
