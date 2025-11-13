const nodemailer = require('nodemailer');

// Create transporter for MailDev
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // MailDev SMTP port
  secure: false, // true for 465, false for other ports
});

// Function to send MFA email
async function sendMFAEmail(email, mfaCode) {
  try {
    const mailOptions = {
      from: '"SamaAfya HealthCare" <noreply@samaafya.com>',
      to: email,
      subject: 'Votre code de vérification - SamaAfya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007BBA;">Code de vérification</h2>
          <p>Bonjour,</p>
          <p>Voici votre code de vérification pour accéder à votre espace professionnel SamaAfya :</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #007BBA; font-size: 32px; margin: 0; letter-spacing: 5px;">${mfaCode}</h1>
          </div>
          <p>Ce code est valable pendant 3 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
          <br>
          <p>Cordialement,<br>L'équipe SamaAfya HealthCare</p>
        </div>
      `,
      text: `
        Code de vérification SamaAfya

        Voici votre code de vérification : ${mfaCode}

        Ce code est valable pendant 3 minutes.

        Cordialement,
        L'équipe SamaAfya HealthCare
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email MFA envoyé:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email MFA:', error);
    return false;
  }
}

// Function to send tracking code email
async function sendTrackingCodeEmail(email, trackingCode, patientName) {
  try {
    const mailOptions = {
      from: '"SamaAfya HealthCare" <noreply@samaafya.com>',
      to: email,
      subject: 'Votre code de suivi médical - SamaAfya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007BBA;">Code de suivi médical</h2>
          <p>Bonjour,</p>
          <p>Un code de suivi médical a été généré pour ${patientName}.</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #007BBA; font-size: 32px; margin: 0; letter-spacing: 2px;">${trackingCode}</span></h1>
          </div>
          <p>Ce code permet à ${patientName} de s'inscrire et de commencer son suivi médical.</p>
          <p>Vous pouvez partager ce code de manière sécurisée.</p>
          <br>
          <p>Cordialement,<br>L'équipe SamaAfya HealthCare</p>
        </div>
      `,
      text: `
        Code de suivi médical SamaAfya

        Un code de suivi médical a été généré pour ${patientName}.

        Code: ${trackingCode}

        Ce code permet à ${patientName} de s'inscrire et de commencer son suivi médical.

        Cordialement,
        L'équipe SamaAfya HealthCare
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email code de suivi envoyé:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email code de suivi:', error);
    return false;
  }
}

module.exports = {
  sendMFAEmail,
  sendTrackingCodeEmail
};