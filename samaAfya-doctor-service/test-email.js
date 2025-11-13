const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false
});

const mailOptions = {
  from: 'test@samaafya.com',
  to: 'docteur@samaafya.com',
  subject: 'Test MailDev - SamaAfya',
  html: '<h1>Test réussi !</h1><p>MailDev fonctionne correctement.</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Erreur:', error);
  } else {
    console.log('Email envoyé:', info.messageId);
  }
});
