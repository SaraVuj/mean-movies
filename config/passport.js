const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/db');
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
     
        User.getUserById(jwt_payload._id, (err, user) => {
            if(err){
                return done(err, false);
            }

            if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        });
    }));

    dotenv.config();
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(
        new FacebookStrategy(
          {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["email", "name"]
          },
          function(accessToken, refreshToken, profile, done) {
            const { email, first_name, last_name } = profile._json;
            console.log(profile);
            user = new User();
            user.email = email;

            /* User.addUserOAuth(user, (err, user) => {
                if(err) throw err;
            }); */
            done(null, profile);
          }
        )
      );
}