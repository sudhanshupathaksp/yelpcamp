const express = require('express');
const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');
const passport = require('passport');
const router  = express.Router();
const users = require('../controllers/users')


router.get('/register', users.registerForm );

router.post('/register', asyncHandler(users.register));

router.get('/login', users.loginForm);

router.post('/login', passport.authenticate('local', { failureFlash:true, failureRedirect: '/login'}) , users.secureLogin);

router.get('/logout', users.logout);
module.exports = router;