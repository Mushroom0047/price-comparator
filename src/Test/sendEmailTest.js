const { createTransport } = require('nodemailer');
const { clpConverter } = require('../utils/clpConverter');
const { createLogMessage } = require('../utils/createLog');
require('dotenv').config();

const toEmail = 'hector@grupoqs.cl';
const subject = process.env.SUBJECT;
const userName = process.env.USER_NAME || 'usuario';
const apiKey = process.env.BREVO_API_KEY;
const bcc = process.env.BCC;

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "hectorvaldesm47@gmail.com",
    pass: apiKey,
  }
});

function sendEmailToUser(){
  const htmlContent = `
  <h1>Hola ${userName}</h1>
  <p>Email de prueba</p>
  `;

    const mailOptions = {
      from: 'Mushroom_bot@gmail.com',
      to: toEmail,
      subject: subject,
      text: htmlContent,
      bcc: bcc
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(`Error al enviar el mensaje: ${error}`);
      }else{
        console.log(`Email enviado: ${info.response}`);
      }
    })
};

(()=>{
    sendEmailToUser();  
})();