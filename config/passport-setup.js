const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const twitterStrategy = require('passport-twitter').Strategy;
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
  console.log("Facebook profile: ", profile);
}));

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
