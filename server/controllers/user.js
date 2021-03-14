const bcrypt = require('bcrypt');
const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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
        if (!validateEmail(req.body.email))
            res.status(StatusCode.BAD_REQUEST).json({ message: 'Invalid email format' });
        if (req.body.password.length < 6)
            res.status(StatusCode.BAD_REQUEST).json({message: "Password must be more than 6 characters"});
        else {
            const isPassword = await bcrypt.compare(password, user.password);
            if (!isPassword)
                res.status(StatusCode.BAD_REQUEST).json({message: "Incorrect Password"});
            else {
                const payload = {user: {id: user.id}};
                jwt.sign(payload, "key", {expiresIn: 3600},
                    (err, token) => {
                        if (err) throw err;
                        res.status(StatusCode.OK).json({token});
                    }
                );
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
    // find if the user already exist
    let user = await User.findOne({ email: req.body.email });
    if (user)
        res.status(StatusCode.BAD_REQUEST).json({ message: 'User already found!' });
    if (!validateEmail(req.body.email))
        res.status(StatusCode.BAD_REQUEST).json({message: 'Invalid email format'});
    if (req.body.password.length < 6)
            res.status(StatusCode.BAD_REQUEST).json({message: "Password must be more than 6 characters"});
    else {

            const {firstName, lastName, email, password} = req.body;
            user = new User({firstName, lastName, email, password});

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

/* function that checks the format of a given email address */
function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

module.exports = {
  login,
  signup,
};
