const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Token = require("../models/token.js");
const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const config = require('../config');
const sendEmail = require('../helpers/sendEmail');
const { validateLogin, validateSignup } = require('../helpers/validation');
const salt = 6;

/**
 * Logs a user in using their email and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const login = async (req, res) => {
    try {
        // form validation
        const { errors, isValid } = validateLogin(req.body);
    
        if (!isValid) {
            return res.status(StatusCode.BAD_REQUEST).json( errors );
        }

        // read email and password from request body
        const {email, password} = req.body;

        // check if the user with the specified email exists in the database
        let user = await User.findOne({ email });

        if (user) {
            const isPassword = await bcrypt.compare(password, user.password);

            if (!isPassword)
                res.status(StatusCode.BAD_REQUEST).json({ auth: false, token: null });
            else {
                // payload for JWT
                const payload = { email: email };

                // generate access token
                const token = await jwt.sign(payload, "key", config.signOptions);
                
                res.json({ auth: true, token: token });

            }

        } else {
            res.status(StatusCode.BAD_REQUEST).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
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
        // form validation
        const { errors, isValid } = validateSignup(req.body);

        if (!isValid) {
            return res.status(StatusCode.BAD_REQUEST).json(errors);
        }

        // find if the user with the specified email already exist
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(StatusCode.BAD_REQUEST).json({ message: 'User already found!' });

        } else {
            const {firstName, lastName, email, password} = req.body;
            user = new User({firstName, lastName, email, password});

            // encrypt the raw password
            const encrypt = await bcrypt.genSalt(salt);
            user.password = await bcrypt.hash(user.password, encrypt);

            const newUser = await user.save();
            res.status(StatusCode.CREATED).json( newUser );
        }
    } catch (err) {

        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });

    }
};

/**
 * User request to change password.
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const passwordResetReq = async (req, res) => {
    try{
        const crypto = require('crypto');
        const email = req.body.email;
        const user = await User.findOne({ email });
        if (!user)
            res.status(StatusCode.BAD_REQUEST).json({ message: 'Email does not exist' });
        let token = await Token.findOne({ userId: user._id });
        if (token) await Token.deleteOne();

        let resetToken = crypto.randomBytes(32).toString("hex"); //creating the token to be sent to the forgot password form (react)
        const hash = await bcrypt.hash(resetToken, Number(salt));
        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();
         sendEmail(
            user.email,
            "Password Reset Request",
            {
                firstName: user.firstName,
                link: `${'http://127.0.0.1:8000'}/passwordReset?token=${resetToken}&id=${user._id}`,
            },
            "./resetPassword.handlebars"
        );
        res.status(StatusCode.OK).json({ message: 'Email sent' });

    } catch(err){
            res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
        }
};

/**
 * Resets a user's password after the request has been made
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const passwordReset = async (req, res) => {
    try{
        const userId = req.body.userId;
        const token = req.body.token;
        const password = req.body.password

        let passwordResetToken = await Token.findOne({ userId });

        if (!passwordResetToken) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Invalid or expired password reset token" });
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);

        if (!isValid) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Invalid or expired password reset token" });
        }

        const hash = await bcrypt.hash(password, Number(salt));

        await User.updateOne(
            { _id: userId },
            { $set: { password: hash } },
            { new: true }
        );

        const user = await User.findById({ _id: userId });
        sendEmail(
            user.email,
            "Password Reset Successfully",
            {
                firstName: user.firstName,
            },
            "./template/resetPassword.handlebars"
        );

        await passwordResetToken.deleteOne();

    }catch(err){
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};

module.exports = {
    login,
    signup,
    passwordReset,
    passwordResetReq,
};


