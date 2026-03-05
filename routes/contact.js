const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

module.exports = () => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  router.post('/', async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body;

      if (!name || !email || !service || !message) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
      }

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'rpdcapitalfinanceoffice@gmail.com',
        subject: `New Enquiry – ${service}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background: #D97706; padding: 20px; text-align: center;">
              <h2 style="color: white; margin: 0;">New Contact Enquiry</h2>
              <p style="color: #fef3c7; margin: 4px 0 0;">RPD Capital Finance</p>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold; color: #6b7280; width: 30%;">Service</td><td style="padding: 8px; color: #111827;">${service}</td></tr>
                <tr style="background:#f9fafb;"><td style="padding: 8px; font-weight: bold; color: #6b7280;">Name</td><td style="padding: 8px; color: #111827;">${name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #6b7280;">Email</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr style="background:#f9fafb;"><td style="padding: 8px; font-weight: bold; color: #6b7280;">Phone</td><td style="padding: 8px;"><a href="tel:${phone}">${phone || 'N/A'}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #6b7280; vertical-align:top;">Message</td><td style="padding: 8px; color: #111827;">${message}</td></tr>
              </table>
            </div>
            <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #9ca3af;">
              RPD Capital Finance • Chennai – 600129
            </div>
          </div>
        `,
      });

      res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
      console.error('EMAIL ERROR:', error);
      res.status(500).json({ success: false, message: 'Email sending failed' });
    }
  });

  return router;
};