const jsonServer = require('json-server');
const { sendMFAEmail, sendTrackingCodeEmail } = require('./mailService');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Custom middleware to handle MFA email sending
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'PATCH' && req.path.startsWith('/doctors/')) {
    // Store original response
    const originalJson = res.json;

    res.json = function(data) {
      // After doctor is updated with MFA code, send email
      if (data.mfaCode && data.email) {
        console.log(`🔐 MFA Code généré pour ${data.email}: ${data.mfaCode}`);
        console.log(`📧 [TEST MODE] Code MFA envoyé à ${data.email}: ${data.mfaCode}`);

        // Send email via MailDev
        sendMFAEmail(data.email, data.mfaCode).then(success => {
          if (success) {
            console.log('✅ Email MFA envoyé avec succès via MailDev');
          }
        });
      }

      // Call original json method
      originalJson.call(this, data);
    };
  }

  next();
});

// Custom route for sending tracking codes
server.post('/send-tracking-code', (req, res) => {
  const { email, trackingCode, patientName } = req.body;

  if (!email || !trackingCode || !patientName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  sendTrackingCodeEmail(email, trackingCode, patientName).then(success => {
    if (success) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
});

// Use default router
server.use(router);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server with MailDev integration is running on port ${PORT}`);
  console.log(`📧 MailDev SMTP server should be running on localhost:1025`);
  console.log(`🌐 MailDev web interface: http://localhost:1080`);
});