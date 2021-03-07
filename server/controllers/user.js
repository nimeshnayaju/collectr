const User = require('../models/user');
const StatusCode = require('../helpers/constants');

/**
 * Logs a user in using their email and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const login = async (req, res) => {
    // Fill in here
}

/**
 * Signs up a new user using their first name, last name, email, and password
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
 const signup = async (req, res) => {
    // Fill in here
    const {
        firstName, lastName, email, password,
    } = req.body;

    try{
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });
        res.status(StatusCode.CREATED).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

    res.json(StatusCode.OK);
};

module.exports = {
    login,
    signup,
}
