const passport = require('passport');
const twitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user-model');
const keys = require('./keys');



////
//// Twitter Strategy
////

passport.use(new twitterStrategy({
  //options for twitter Strategy
  consumerKey : keys.twitter.consumerKey,
  consumerSecret : keys.twitter.consumerSecret,
  callbackURL : '/auth/twitter/redirect'
}, (accessToken, refreshToken, profile, done) => {

//  console.log("Twitter profile :", profile);

  let newUser = new User({
    username : profile.username,
    twitter : {
      id : profile.id,
      thumbnail : profile.photos[0].value
    }
  });
  let query = {'twitter.id':newUser.twitter.id};

  User.findOne(query, (err, currentUser) => {
    if(err) throw err;
    if(currentUser){
      console.log("user exist " + currentUser);
      done(null,currentUser); //it will move to passport.serialize
    }else {
      newUser.save((err, user) => {
        if(err) throw err;
        if(user) {
          console.log("new user created " + user);
          done(null, user); //it will move to passport.serialize
        }
      });
    }

  });
}));

module.exports = passport;
