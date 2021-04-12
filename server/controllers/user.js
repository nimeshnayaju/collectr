const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const Token = require("../models/token.js");
const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const config = require('../config');
const sendEmail = require('../helpers/email');
const { validateLogin, validateSignup, validateResetPassword } = require('../helpers/validation');
const salt = 6;


/**
 * Logs a user in using their email and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const login = async (req, res) => {
    try {
        // read email and password from request body
        const {email, password} = req.body;

        // check if the user with the specified email exists in the database
        let user = await User.findOne({ email });

        if (user) {
            
            if (user.status !== "Active") {
                return res.status(StatusCode.BAD_REQUEST).json({ message: "Pending account. Please verify your email!" });
            }

            const isPassword = await bcrypt.compare(password, user.password);

            if (!isPassword) {
                return res.status(StatusCode.BAD_REQUEST).json({ message: "Incorrect email or password" });
            }
            else {
                // payload for JWT
                const payload = { id: user.id };

                // generate access token
                const token = await jwt.sign(payload, config.accessTokenSecret, config.signOptions);
                
                return res.json({ auth: true, token: token });

            }

        } else {
            return res.status(StatusCode.BAD_REQUEST).json({ message: "user not found" });
        }
    } catch (err) {
        return res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
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

        if (user && user.status === "Active") {
            return res.status(StatusCode.BAD_REQUEST).json({ message: 'User already found!' });

        } else {
            if (!user) {
                const {firstName, lastName, email, password} = req.body;
                user = new User({firstName, lastName, email});
                // encrypt the raw password
                const encrypt = await bcrypt.genSalt(salt);
                user.password = await bcrypt.hash(password, encrypt);
                
                await user.save();
            }

            let token = await Token.findOne({ user: user._id });
            if (token) {
                await token.deleteOne();
            }
            let verificationToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(verificationToken, salt);
            await new Token({ user: user._id, token: hash, expiresAt: Date.now() + 360000 }).save(); // expires in 1 hour
    
            const html =  '<p>Please click on the following link within the next one hour to verify your account on Collectrs</p>'
                        + `<a href='https://${config.serverURL}/users/signup/verify/?token=${verificationToken}&userId=${user._id}'>Verify Account</a>`
                        + '<p>Thank you,</p>'
                        + '<p>Collectrs</p>';

            const subject = 'Activate Your Collectrs Account';

            try {
                await sendEmail(user.email, subject, html);
                return res.status(StatusCode.CREATED).json({ message: 'verification email sent' });
            } catch (err) {
                console.log(err); 
            }
        }
    } catch (err) {
        return res.status(StatusCode.BAD_REQUEST).json({ message: err.message });

    }
};

/**
 * Sign up user after email verification
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const verifySignup = async (req, res) => {
    try{
        const { token, userId } = req.query;

        const verificationToken = await Token.findOne({ user: userId, expiresAt: {$gt: Date.now()} });
        if (!verificationToken) {
            return res.status(StatusCode.BAD_REQUEST).json({ message: "invalid or expired verification token" });
        }

        const isValid = await bcrypt.compare(token, verificationToken.token);
        if (!isValid) {
            return res.status(StatusCode.BAD_REQUEST).json({ message: "invalid or expired verification token" });
        }

        await User.findByIdAndUpdate(userId, { $set: { status: "Active" } }, { new: true });
        verificationToken.deleteOne();
        return res.status(StatusCode.CREATED).send("Your account has been activated successfully");

    } catch (err) {
        return res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


/**
 * Sends an email to the user with a link to reset their password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
        try {

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(StatusCode.BAD_REQUEST).json({ message: 'email does not exist' });
            }
            let token = await Token.findOne({ user: user._id });
            if (token) {
                await token.deleteOne();
            }
            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(resetToken, salt);
            await new Token({ user: user._id, token: hash, expiresAt: Date.now() + 3600000 }).save(); // expires in 1 hours
    
            const html =  '<p>You are receiving this because we received a password reset request from your account. Please click on the following link, or paste the link into your browser within an hour of receiving it to reset your password:</p>'
                        + `<a href='https://${config.clientURL}/reset/?token=${resetToken}&userId=${user._id}'>Reset Password</a>`
                        + '<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>'
                        + '<p>Thank you,</p>'
                        + '<p>Collectrs</p>';

            const subject = 'Password Reset Request';

            try {
                await sendEmail(user.email, subject, html);
                return res.status(StatusCode.OK).json({ message: 'password reset email sent' });
            } catch (err) {
                console.log(err); 
            }
                
        } catch (err) {
            console.log(err);
        }
    } catch(err){
            return res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
        }
};

/**
 * Resets a user's password after the request has been made
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const resetPassword = async (req, res) => {
    try{
        const { token, userId, password } = req.body;

        const passwordResetToken = await Token.findOne({ user: userId, expiresAt: {$gt: Date.now()} });

        if (!passwordResetToken) {
            return res.status(StatusCode.BAD_REQUEST).json({ message: "invalid or expired password reset token" });
        }

        const isValidToken = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValidToken) {
            return res.status(StatusCode.BAD_REQUEST).json({ message: "invalid or expired password reset token" });
        }

        // form validation
        const { errors, isValid } = validateResetPassword(req.body);

        if (!isValid) {
            return res.status(StatusCode.BAD_REQUEST).json(errors);
        }

        const hash = await bcrypt.hash(password, salt);

        const user = await User.findByIdAndUpdate(userId, { $set: { password: hash } }, { new: true });
        const html =  '<p>Your password has been reset successfully.<p>' 
                    + '<p>Thank you,</p>'
                    + '<p>Collectrs</p>';

        const subject = 'Password Reset Sucessful';

        try {
            await sendEmail(user.email, subject, html);
            passwordResetToken.deleteOne();
            return res.status(StatusCode.OK).json({ message: 'password sucessfully changed' });
        } catch (err) {
            console.log(err); 
        }

    } catch(err){

        return res.status(StatusCode.BAD_REQUEST).json({ message: err.message });

    }
};

module.exports = {
    login,
    verifySignup,
    signup,
    forgotPassword,
    resetPassword,
};


