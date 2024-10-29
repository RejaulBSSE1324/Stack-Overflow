const express = require('express');
const { signIn, signUp } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);  // SignUp route
router.post('/signin', signIn);

module.exports = router;
