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
    // Fill in here
}

module.exports = {
    login,
    signup
}