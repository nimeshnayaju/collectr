const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const StatusCode = require('../helpers/constants');

const sendEmail = async (email, subject, payload, template, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
                user: 'collectr.team@gmail.com',
                pass: 'group5123',
            },
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);
        const options = () => {
            return {
                from: 'collectr.team@gmail.com',
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        transporter.sendMail(options(), (error, info) =>{
            if (error) {
                res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
            } else {
                res.status(StatusCode.OK).json({ message: "Email sent" + info.response});
            }
        });
    } catch (error) {
        return error;

    }
}

module.exports = sendEmail;