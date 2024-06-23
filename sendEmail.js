const { createTransport } = require('nodemailer');
require('dotenv').config();

const apiKey = process.env.BREVO_API_KEY;

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "hectorvaldesm47@gmail.com",
    pass: apiKey,
  }
});


const sendEmail = async (toEmail, subject, htmlContent) => {
    const mailOptions = {
      from: 'Mushroom_bot@gmail.com',
      to: toEmail,
      subject: subject,
      text: htmlContent
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
        console.log('email sent:', info.response);
      }
    })
};

module.exports = sendEmail;