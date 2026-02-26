const express = require('express');
const router = express.Router();

module.exports = (transporter) => {
  router.post('/', async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body;

      if (!name || !email || !service || !message) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
      }

      // Email to RPD Capital Finance (notification)
      const toOwnerMail = {
        from: `"RPD Capital Finance Website" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
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
              RPD Capital Finance • Plot No.328LA, S Kolathur Main Road, Kovilambakkam, Chennai – 600129
            </div>
          </div>
        `,
      };

      // Auto-reply to the customer
      const toCustomerMail = {
        from: `"RPD Capital Finance" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `We received your enquiry – ${service}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background: #D97706; padding: 20px; text-align: center;">
              <h2 style="color: white; margin: 0;">Thank You, ${name}!</h2>
              <p style="color: #fef3c7; margin: 4px 0 0;">We've received your enquiry</p>
            </div>
            <div style="padding: 24px;">
              <p style="color: #374151;">Thank you for reaching out to <strong>RPD Capital Finance</strong>. We have received your enquiry regarding <strong>${service}</strong> and our team will get back to you within <strong>24 hours</strong>.</p>
              <div style="background: #fef3c7; border-left: 4px solid #D97706; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e;"><strong>Your Enquiry Summary</strong></p>
                <p style="margin: 4px 0 0; color: #78350f;">Service: ${service}<br/>Message: ${message}</p>
              </div>
              <p style="color: #374151;">For urgent matters, call us directly:</p>
              <p style="color: #374151;"><strong>📞 <a href="tel:+919663316054" style="color:#D97706;">+91 96633 16054</a></strong></p>
            </div>
            <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #9ca3af;">
              RPD Capital Finance • Plot No.328LA, S Kolathur Main Road, Kovilambakkam, Chennai – 600129
            </div>
          </div>
        `,
      };

      // Send both emails in parallel
      await Promise.all([
        transporter.sendMail(toOwnerMail),
        transporter.sendMail(toCustomerMail),
      ]);

      res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
      console.error('EMAIL ERROR:', error);
      res.status(500).json({ success: false, message: 'Email sending failed' });
    }
  });

  return router;
};