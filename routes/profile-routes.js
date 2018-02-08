const router = require('express').Router();
const authCheck = (req, res, next) => {
  if (!req.user){ // if req object does not contain user
    //if user not logged in
    res.redirect('/auth/login'); //redirect him to login page
  }
  else{
    //if user logged in
    next(); //call the next process
  }
};

//using authCheck middleware here to verify if user is logged in or not
router.get('/', authCheck, (req, res) => {
  res.render('profile', {user : req.user});
//  res.send('Hi welcome to your profile ' + req.user.username);
});

module.exports = router;
