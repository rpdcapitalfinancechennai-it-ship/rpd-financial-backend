const express = require('express');

module.exports = (transporter) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body;

      if (!name || !email || !service || !message) {
        return res.status(400).json({
          success: false,
          message: 'Required fields missing',
        });
      }

      const mailOptions = {
        from: `"RPD Website" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `New Enquiry – ${service}`,
        html: `
          <h3>New Contact Enquiry</h3>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error("EMAIL ERROR:", error);
      res.status(500).json({
        success: false,
        message: 'Email sending failed',
      });
    }
  });

  return router;
};
