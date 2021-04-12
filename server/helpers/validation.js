const validator = require("validator");
const isEmpty = require('is-empty');

const validateResetPassword = (data) => {
    let errors = {};

    data.password = !isEmpty(data.password) ? data.password : '';

    // Validate password
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateSignup = (data) => {
    let errors = {};

    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // Validate first name
    if (validator.isEmpty(data.firstName)) {
        errors.firstName = "First name is required";
    }

    // Validate last name
    if (validator.isEmpty(data.lastName)) {
        errors.lastName = "Last name is required";
    }

    // Validate email
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    // Validate password
    if (validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = {
    validateSignup,
    validateResetPassword
}