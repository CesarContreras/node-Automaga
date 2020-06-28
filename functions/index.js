const functions = require('firebase-functions');

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const details = require("./cuenta.json");
//const { request } = require('express');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.get('/timestamp',(request,response)=>{
    response.send(`${Date.now()}`);
})
app.get('timestamp-cached',(request,response)=>{
    response.set('Cache-Control','public,max-age=300,smaxage=600')
})

app.post("/sendmail", (req, res) => {
  let user = req.body;
  sendMail(user, info => {
    console.log(`Todo enviado`);
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password
    }
  });

  let mailOptions = {
    from: "Soporte de Automaga", // sender address
    to: "automaga.soporte@gmail.com", // list of receivers
    subject: "Pregunta acerca de servicio", // Subject line
    html: `<h2>El usuario -> ${user.name} ${user.apepat} ${user.apemat}</h2><br>
    <h2>Correo de contacto -> ${user.email}</h2><br>
    <h2>Tiene la siguiente pregunta -> ${user.pregunta}</h2><br>`

  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

 exports.app = functions.https.onRequest(app);
