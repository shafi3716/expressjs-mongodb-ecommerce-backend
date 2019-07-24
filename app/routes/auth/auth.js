const express = require('express')
const router = express.Router()
const passport = require('passport')

// controller 
const AuthController = require('../../controllers/auth/auth.controller')

// register post
router.post('/auth/register', AuthController.register);

// login 
router.post('/auth/login', AuthController.login);

// current User 
router.post('/auth/user', passport.authenticate("jwt", { session: false }), AuthController.currentUser);

module.exports = router;