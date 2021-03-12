const bcrypt = require('bcrypt');
const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const express = require("express");
const { check, validationResult} = require("express-validator/check");
const router = express.Router();

/**
 * Logs a user in using their email and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user)
            res.status(StatusCode.BAD_REQUEST).json({message: "User not found"});
        else {
            const isPassword = await bcrypt.compare(password, user.password);
            if (!isPassword)
                res.status(StatusCode.BAD_REQUEST).json({message: "Incorrect Password"});
            else {
                res.status(StatusCode.OK).json({message: "Login Successful"})
            }
        }
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({message: "Error"});
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
    check("email", "Enter email").isEmail();
    check("password", "Enter password").isLength({min: 6})
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(StatusCode.BAD_REQUEST).json({message: "Wrong format for email or password"});
    }
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
