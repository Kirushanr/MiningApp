const express = require('express');
const router = express.Router();
const {generateToken, sendToken, verifyToken} = require('../auth/token');
const passport = require('passport');


//Google Authentication route
router.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/auth/google' }),
 function(req,res,next) {
    
  req.auth = {
      id: req.id,
      fullName:req.fullName
  };
  next();
},generateToken, sendToken);

module.exports = router;