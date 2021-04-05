const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const StatusCode = require('./constants');
const Config = require('../config');

const sendEmail = async (email, subject, body, successMessage, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: Config.email,
            pass: Config.password
        },
    });

    const mailOptions = {
        from: auth.user,
        to: email,
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw err;
    }
}

module.exports = sendEmail;