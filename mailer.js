const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another service if needed
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
