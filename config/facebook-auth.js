const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user-model');
const keys = require('./keys');

////
//// Facebook Strategy
////
passport.use(new facebookStrategy({

  //options for facebok Strategy
  clientID : keys.facebook.clientID,
  clientSecret : keys.facebook.clientSecret,
  callbackURL : '/auth/facebook/redirect',
  profileFields: ['email','id', 'first_name', 'gender', 'last_name', 'picture']
}, (accessToken, refreshToken, profile, done) => {
  let query = {'facebook.id' : profile.id };

  User.findOne(query, (err, currentUser) => {
    if (err) console.log("Error in facebook data");
    if (currentUser){
      console.log("user exist " + currentUser);
      done(null,currentUser); //it will move to passport.serialize
    }
    else{
      let newUser = new User({
        email : profile.emails[0].value,
        facebook : {
          id : profile.id,
          thumbnail :  profile.photos[0].value
        }
      });
      newUser.save( (err, user) => {
        if(err) console.log(err.message);
        if(user){
          console.log("new user created " + user);
          done(null, user); //it will move to passport.serialize
        }
      });
    }
  });
  //console.log("Facebook profile: ", profile);
}));

module.exports = passport;
