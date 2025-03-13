const nodemailer = require('nodemailer');
const { emailTypes } = require("../helper/constants.js")
const dayjs = require("dayjs")
// Function to send an email
async function sendEmail({ to, subject, text, html }) {
    try {
        // Create a transporter using SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_AUTH_USER,
                pass: process.env.SMTP_AUTH_PASS
            }
        });

        // Define email options
        let mailOptions = {
            from: process.env.SMTP_AUTH_SENDER,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}

async function sendInternalEmail({ subject, text, html }) {
    try {
        // Create a transporter using SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_AUTH_USER,
                pass: process.env.SMTP_AUTH_PASS
            }
        });

        // Define email options
        let mailOptions = {
            from: process.env.SMTP_AUTH_SENDER,
            to: JSON.parse(process.env.DEV_EMAILS),
            subject: subject,
            text: text,
            html: html
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}

async function setEmailTemplate(type, options) {
    let emailBody = ''

    switch (type) {
        case emailTypes.RESET_PASSWORD:
            emailBody = `
                <p style="margin-bottom: 20px;">You requesed to reset your password.</p>
                <p style="margin-bottom: 20px;">Please click the link below to reset your password.</p>
                <a href=${options.link} style="margin-bottom: 20px;">Reset Password Link</a>
`
            break
        case emailTypes.VERIFY_EMAIL:
            emailBody = `
                <p style="margin-bottom: 20px;">You requesed to verify your email.</p>
                <p style="margin-bottom: 20px;">Please click the link below to verify your email.</p>
                <a href=${options.link} style="margin-bottom: 20px;">Email Verification Link</a>
`
            break
        case emailTypes.INTERNAL_EMAIL:
            emailBody = `
                <p style="margin-bottom: 20px;">A new user has signed up!</p>
                <p style="margin-bottom: 20px;">Name: ${options.fullName} </p>
                <p style="margin-bottom: 20px;">Email: ${options.email} </p>
`
            break
        case emailTypes.SHARE_COURSE:
            emailBody = `
                <p style="margin-bottom: 20px;">A Teacher shared you their resources!</p>
                <p style="margin-bottom: 20px;">Please click the link below to open the resource.</p>
                <a href=${options.link} style="margin-bottom: 20px;">Resources Link</a>
`
            break
    }

    return `

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #f6f8fa; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
            <a href="https://vidynova.com/" target="_blank">
                <img  src="#" alt="VidyaNova" width="150" style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
            </a>
        </div>
        <div style="padding: 20px; line-height: 1.6;">
            <p style="margin-bottom: 20px;">Dear ${type == emailTypes.SHARE_COURSE ? 'Student' : options.firstName},</p>
            ${emailBody}
            <p style="margin-bottom: 20px;">Team VidyaNova</p>
        </div>
        <div
            style="background-color: #f4f4f4; color: #333333; padding: 10px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">&copy; ${dayjs().year()} VidyaNova. All rights reserved.</p>
        </div>
    </div>
</body>
`

}

module.exports = { sendEmail, setEmailTemplate, sendInternalEmail };