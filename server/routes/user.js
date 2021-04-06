const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');

router.post('/login',  userController.login);
router.post('/signup', userController.signup);
router.post('/password/forgot', userController.forgotPassword);
router.post('/password/reset', userController.resetPassword);

module.exports = router;
