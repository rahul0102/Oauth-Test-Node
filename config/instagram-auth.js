const passport = require('passport');
const instagramStrategy = require('passport-instagram').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

////
//// Instagram Strategy
////

passport.use( new instagramStrategy({

  clientID : keys.instagram.clientID,
  clientSecret : keys.instagram.clientSecret,
  callbackURL : '/auth/instagram/redirect'

}, (accessToken, refreshToken, profile, done) => {

  //  console.log("Instagram profile: ", profile);
    let data = profile._json.data;
    let newUser = new User({
      username : data.username,
      instagram : {
        id : data.id,
        fullName : data.full_name,
        thumbnail : data.profile_picture,
        bio : data.bio,
      }
    });

    //check if user exist in database
    User.findOne({'instagram.id' : data.id}, (err, currentUser) =>{
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
