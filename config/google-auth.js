const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');
const keys = require('./keys');

////
//// Google Strategy
////
passport.use(
  new googleStrategy({
    //options for google strategy
    clientID : keys.google.clientID,
    clientSecret : keys.google.clientSecret,
    callbackURL : '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    //passport callback function

  //console.log("Passport callback funtion fired");
  //  console.log("Profile:", profile);


    let newUser = new User({
      username : profile.displayName,
      google : {
        id : profile.id,
        thumbnail : profile._json.image.url
      }
    });

    //check if user exist in database
    User.findOne({'google.id' : profile.id}, (err, currentUser) =>{
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
  })
);
module.exports = passport;
