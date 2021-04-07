const nodemailer = require("nodemailer");
const Config = require('../config');

const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: Config.email,
            pass: Config.password
        },
    });

    const mailOptions = {
        from: Config.email,
        to: email,
        subject: subject,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw err;
    }
}

module.exports = sendEmail;