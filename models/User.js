const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = new mongoose.Schema();

const userSchema = Schema({
  Fullname: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Organization: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
});
userSchema.pre('save', async ()=>{
    bcrypt.genSalt(10, function(err, salt) {
        if(err){
            throw err
        }else{
            bcrypt.hash("B4c0/\/", salt, function(err, hash) {
                if(!err || userSchema.Password){
                    User.Password = hash;
                }else{
                    throw err;
                }
            });  
        }
});

const User = mongoose.model('User', userSchema);

module.exports = User
