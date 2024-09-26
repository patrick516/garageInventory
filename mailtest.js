const nodemailer = require('nodemailer');
require('dotenv').config();

let transportmail = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD  // Change 'password' to 'pass'
    }
});

let mailContent = {
    from: process.env.EMAIL_USERNAME,
    to: 'patricklingstone51@gmail.com',
    subject: 'Selected for pilot study',
    text: 'This is an email sent to you to try the functionality of this component.'
};

transportmail.sendMail(mailContent, function(err, val) {
    if (err) {
        console.log(err);
    } else {
        console.log(val.response, "Email sent successfully");
    }
});
