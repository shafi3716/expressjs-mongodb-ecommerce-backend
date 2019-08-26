const express = require('express')
const router = express.Router()
const passport = require('passport')

// controller 
const AuthController = require('../../controllers/auth/auth.controller')

// register post
router.post('/register', AuthController.register);

// login 
router.post('/login', AuthController.login);

// current User 
router.post('/user', passport.authenticate("jwt", { session: false }), AuthController.currentUser);

module.exports = router;