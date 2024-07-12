const { createTransport } = require('nodemailer');
const { clpConverter } = require('../utils/clpConverter');
const { createLogMessage } = require('../utils/createLog');
require('dotenv').config();

const toEmail = process.env.TO_EMAIL;
const subject = process.env.SUBJECT;
const userName = process.env.USER_NAME || 'usuario';
const apiKey = process.env.BREVO_API_KEY;

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "hectorvaldesm47@gmail.com",
    pass: apiKey,
  }
});

function sendEmailToUser(productNewData, productDataJson){
  createLogMessage('Inicio de la funcion sendEMail');
  const valueNewData = clpConverter(productNewData.currentPrice);
  const valueJsonData = clpConverter(productDataJson.currentPrice);
  const htmlContent = `
  <h1>Hola ${userName}</h1>
  <p>El producto ${productNewData.title} cambio de valor.
  Paso de estar a <b>${valueJsonData}</b> a <b>${valueNewData}</b></p>
  <br>
  <p>Puedes revisarlo en el siguiente link ${productNewData.url}</p>
  `;

    const mailOptions = {
      from: 'Mushroom_bot@gmail.com',
      to: toEmail,
      subject: subject,
      text: htmlContent
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        createLogMessage(`Error al enviar el mensaje: ${error}`);
      }else{
        createLogMessage(`Email enviado: ${info.response}`);
      }
    })
    createLogMessage('Fin de la funcion sendEMail');
};

module.exports = { sendEmailToUser };