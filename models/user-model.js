const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username : String,
  email : String,
  google : {
    id : String,
    thumbnail : String
  },
  facebook : {
    id : String,
    thumbnail : String
  },
  twitter : {
    id : String,
    thumbnail : String
  }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
