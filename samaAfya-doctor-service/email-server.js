const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create transporter for MailDev
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // MailDev SMTP port
  secure: false,
});

// Route to send MFA email
app.post('/send-mfa-email', async (req, res) => {
  try {
    const { email, mfaCode } = req.body;

    if (!email || !mfaCode) {
      return res.status(400).json({ error: 'Email and MFA code are required' });
    }

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

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email MFA envoyé à ${email}: ${mfaCode}`);

    res.json({ success: true, message: 'MFA email sent successfully' });
  } catch (error) {
    console.error('❌ Erreur envoi email MFA:', error);
    res.status(500).json({ error: 'Failed to send MFA email' });
  }
});

// Route to send tracking code email
app.post('/send-tracking-code', async (req, res) => {
  try {
    const { email, trackingCode, patientName } = req.body;

    if (!email || !trackingCode || !patientName) {
      return res.status(400).json({ error: 'Email, tracking code, and patient name are required' });
    }

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

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email code de suivi envoyé à ${email} pour ${patientName}: ${trackingCode}`);

    res.json({ success: true, message: 'Tracking code email sent successfully' });
  } catch (error) {
    console.error('❌ Erreur envoi email code de suivi:', error);
    res.status(500).json({ error: 'Failed to send tracking code email' });
  }
});

const EMAIL_PORT = 3002;
app.listen(EMAIL_PORT, () => {
  console.log(`🚀 Email server running on port ${EMAIL_PORT}`);
  console.log(`📧 Connected to MailDev SMTP on localhost:1025`);
});