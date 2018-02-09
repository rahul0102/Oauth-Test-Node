const passport = require('passport');
const passportGoogle = require('./google-auth');
const passportFacebook = require('./facebook-auth');
const passportTwitter = require('./twitter-auth');
const passportGithub = require('./github-auth');
const passportlinkedin = require('./linkedin-auth');
const keys = require('./keys');
const User = require('../models/user-model');

//serialize user
passport.serializeUser( (user,done) => {
  done(null, user.id); //(err,user.id) and sending user.id to browser cookie
});

//deserialize User
passport.deserializeUser( (id, done) => {
  User.findById(id, (err, user) => {
    if (err) console.log(err);
    if(user){
      console.log("getting user ", user);
      done(null, user);
    }
  });
});
