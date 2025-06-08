const nodemailer = require('nodemailer'); /*------ nodemailer Require ------*/
const dotenv = require('dotenv'); /*------ dotenv Require ------*/
const ejs = require('ejs'); /*------ ejs Require for rendering templates ------*/
const path = require('path'); /*------ path Require for resolving file paths ------*/

dotenv.config();

/*------ Create Nodemailer Transporter ------*/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

/*------ Send Simple Email ------*/
const sendEmail = async (email, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Recipient address
            subject, // Subject line
            text, // Plain text content
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

/*------ Send Email with EJS Template ------*/
const sendTemplateEmail = async (email, subject, templateName, templateData) => {
    try {
        // Resolve the path to the EJS template
        const templatePath = path.join(__dirname, `../views/${templateName}.ejs`);

        // Render the EJS template with the provided data
        const html = await ejs.renderFile(templatePath, templateData);

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Recipient address
            subject, // Subject line
            html, // Rendered HTML content
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Template email (${templateName}) sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending template email (${templateName}):`, error);
    }
};






/*------ Export Email Functions ------*/
module.exports = { sendEmail, sendTemplateEmail };