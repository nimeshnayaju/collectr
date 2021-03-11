const bcrypt = require('bcrypt');
const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * Logs a user in using their email and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const login = async (req, res) => {
    check("email", "Enter email").isEmail();
    check("password", "Enter password").isLength({min: 6})
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCode.BAD_REQUEST).json({
            errors: errors.array()
        });
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({
            email
        });
        if (!user)
            return res.status(StatusCode.BAD_REQUEST).json({
            });
        const isPassword = await bcrypt.compare(password, User.password);
        if (!isPassword)
            return res.status(StatusCode.BAD_REQUEST).json({
            });
    }
    catch (e) {
        console.error(e);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        });
    }
}

/**
 * Signs up a new user using their first name, last name, email, and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const signup = async (req, res) => {
  try {
    // find if the user already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) {

      res.status(StatusCode.BAD_REQUEST).json({ message: 'User already found!' });

    } else {

      const { firstName, lastName, email, password } = req.body;
      user = new User({ firstName, lastName, email, password });

      // encrypt the raw password
      const encrypt = await bcrypt.genSalt(5);
      user.password = await bcrypt.hash(user.password, encrypt);

      const newUser = await user.save();
      res.status(StatusCode.CREATED).json(newUser);
    }

  } catch (err) {

    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });

  }
};

module.exports = {
  login,
  signup,
};
