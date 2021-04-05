const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const StatusCode = require('./constants');
const Config = require('../config');

const sendEmail = async (email, subject, body, res) => {
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
        res.status(StatusCode.OK).json({ message: "password resset email sent" });
    } catch (err) {
        console.log(err);
    }
}

module.exports = sendEmail;