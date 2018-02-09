const passport = require('passport');
const linkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user-model');
const keys = require('./keys');

////
//// linkedin Strategy
////

passport.use( new linkedinStrategy({
  clientID : keys.linkedin.clientID,
  clientSecret : keys.linkedin.clientSecret,
  callbackURL : '/auth/linkedin/redirect',
  scope : ['r_emailaddress', 'r_basicprofile']
}, (accessToken, refreshToken, profile, done) => {

  console.log("linkedin Profile:\n " , profile);
  let newUser = new User({
    username : profile.displayName,
    email : profile.emails[0].value,
    linkedin : {
      id : profile.id,
      thumbnail : profile.photos[0].value
    }
  });

  //check if user exist in database
  User.findOne({'linkedin.id' : profile.id}, (err, currentUser) =>{
    if (err) console.log(err);
    if(currentUser){
      //if user is available
      console.log("user exist " + currentUser);
      done(null,currentUser); //it will move to passport.serialize
    }else {
      //storing in database
      newUser.save( (err, user) => {
          if (err) console.log(err);
          else {
            console.log("New User created." + user);
            done(null,user); //it will move to passport.serialize
          }
      });
    }
  });

}));

module.exports = passport;
