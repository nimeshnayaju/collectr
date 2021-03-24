const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');

router.post('/login',  userController.login);
router.post('/signup', userController.signup);
router.post('/passwordResetReq', userController.passwordResetReq);
router.post('/passwordReset', userController.passwordReset);

module.exports = router;
