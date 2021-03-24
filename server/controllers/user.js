const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');
const StatusCode = require('../helpers/constants');
const config = require('../config');
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

module.exports = {
    login,
    signup,
};


