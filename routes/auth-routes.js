const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportSetup = require('../config/passport-setup');

//auth Login
router.get('/login', (req,res) => {
  res.render('login', {user : req.user});
});

//auth google-Login
router.get('/google', passport.authenticate('google', {
  //scope property
  scope : ['profile', 'email']
})
);

//google-auth-redirect
//when it redirects it comes with code but not with info,
// so we will use passport again as a middleware to fetch info
// and callback funtion of passport will fire in passportSetup
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  //console.log("Response from google",res);
  //res.send("Successfully Logged in using google"+ req.user);
  res.redirect('/profile/');
});
//end google-auth

//facbook-auth-login
router.get('/facebook', passport.authenticate('facebook', {
  scope : ['public_profile', 'email']
}));

router.get('/facebook/redirect', passport.authenticate('facebook'), (req,res) => {
  res.redirect('/profile');
});
//end facebook-auth-login

//twitter-auth-login
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect', passport.authenticate('twitter'), (req,res) => {
  res.redirect('/profile');
});
//end twitter-auth-login

//github-auth-Login
router.get('/github', passport.authenticate('github',{
  scope: ['user : email']
}));

router.get('/github/redirect', passport.authenticate('github'), (req,res) => {
  res.redirect('/profile');
});
//end github-auth-Login

//linkedin-auth-Login

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/redirect', passport.authenticate('linkedin'), (req, res) => {
  res.redirect('/profile');
});
//end linkedin-auth-Login

//logout
router.get('/logout', (req,res) => {
  //handle with passport
  req.logout();
  res.redirect("/");
});

module.exports = router;
