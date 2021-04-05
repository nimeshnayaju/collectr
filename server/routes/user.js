const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');

router.post('/login',  userController.login);
router.post('/signup', userController.signup);
router.post('/forgotPassword', userController.passwordResetReq);
router.post('/resetPassword', userController.passwordReset);

module.exports = router;
