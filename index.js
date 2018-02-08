const express = require('express');
const app = express();
const port = process.env.PORT||4000;
const authRoutes = require('./routes/auth-routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const profileRoutes = require('./routes/profile-routes');


//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, (err) => {
  if(err) console.log("mongodb error");
  else console.log('Connected to mongodb');
});

//setting up views
app.set('/views', __dirname + '/views');

//setting up public
app.use(express.static(__dirname + '/public'));

//setting up view engine
app.set('view engine','ejs');


//cookie-session middleware
app.use(cookieSession({
  maxAge : 24 * 60 * 60 * 1000, //maxAge of cookie in mills
  keys : [keys.session.cookieKey],
}));

//initialize passport
app.use(passport.initialize());
//using session with passport
app.use(passport.session());

//
app.get('/',(req,res) => {
  res.render('home', {user : req.user});
});

//routing middleware for /auth
app.use('/auth', authRoutes);

//routing middleware for /profile
app.use('/profile', profileRoutes);

//setting  up server
app.listen(port,() => {
  console.log("Server is running on port 4000");
});
