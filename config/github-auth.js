const passport = require('passport');
const githubStrategy = require('passport-github').Strategy;
const User = require('../models/user-model');
const keys = require('./keys');

////
//// Github Strategy
////

passport.use( new githubStrategy({
  //options for github-oauth
  clientID : keys.github.clientID,
  clientSecret : keys.github.clientSecret,
  callbackURL : '/auth/github/redirect'
}, (accessToken, refreshToken, profile, done) => {

  //  console.log("Github profile :", profile);
    let newUser = new User({
      username : profile.username,
      github : {
        id : profile.id,
        thumbnail : profile.photos[0].value
      }
    });

    //check if user exist in database
    User.findOne({'github.id' : profile.id}, (err, currentUser) =>{
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
