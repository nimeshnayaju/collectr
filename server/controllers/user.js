const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const ResetToken = require("../models/resetToken.js");
const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const config = require('../config');
const sendEmail = require('../helpers/email');
const { validateLogin, validateSignup } = require('../helpers/validation');
const { reset } = require('nodemon');

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
 * Sends an email to the user with a link to reset their password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const forgotPassword = async (req, res) => {
    try{
        const email = req.body.email;

        try {

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(StatusCode.BAD_REQUEST).json({ message: 'email does not exist' });
            }

                const resetToken = await ResetToken.findOne({ user: user._id });
                if (resetToken) {
                    await resetToken.deleteOne();
                    const resetToken = crypto.randomBytes(32).toString("hex");
                    const hash = bcrypt.hash(token, salt);

                    await new ResetToken({ userId: user._id, token: hash, createdAt: Date.now() }).save();
            
                    const body =  'You are receiving this because we received a password reset request from your account.\n\n'
                                + 'Please click on the following link, or paste the link into your browser within an hour of receiving it to reset your password:\n\n'
                                + `${config.clientURL}/reset/?token=${resetToken}&userId=${user._id}\n\n`
                                + `If you did not request this, please ignore this email and your password will remain unchanged`;
        
                    const subject = 'Password Reset Request';
        
                    try {
                        await sendEmail(user.email, subject, body);
                        return res.status(StatusCode.OK).json({ message: 'password reset email sent' });
                    } catch (err) {
                        console.log(err); 
                    }
                }
                
        } catch (err) {
            console.log(err);
        }
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
const resetPassword = async (req, res) => {
    try{
        const { token, userId } = req.params;
        const { password } = req.body;

        const passwordResetToken = await Token.findOne({ userId });

        if (!passwordResetToken) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "invalid or expired password reset token" });
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "invalid or expired password reset token" });
        }

        const hash = await bcrypt.hash(password, salt);

        const user = await User.findByIdAndUpdate(userId, { $set: { password: hash } }, { new: true });
        const body =  'Your password has been changed successfully.\n\n'

        const subject = 'Password Change Sucessfull';

        try {
            await sendEmail(user.email, subject, body);
            return res.status(StatusCode.OK).json({ message: 'password sucessfully changed' });
        } catch (err) {
            console.log(err); 
        }

    } catch(err){

        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });

    }
};

module.exports = {
    login,
    signup,
    forgotPassword,
    resetPassword,
};


