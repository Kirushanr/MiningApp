const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    googleId:{
        type:String,
    },
    fullName:{
        type:String
    }
});

module.exports = mongoose.model('User', userSchema);
