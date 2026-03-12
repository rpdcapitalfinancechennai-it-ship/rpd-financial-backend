const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

module.exports = () => {

  const resend = new Resend(process.env.RESEND_API_KEY);

  router.post('/', async (req, res) => {

    try {

      const { name, email, phone, service, message } = req.body;

      if (!name || !email || !service || !message) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing"
        });
      }

      // 1️⃣ EMAIL TO ADMIN
      await resend.emails.send({
        from: "RPD Capital Finance <onboarding@resend.dev>",
        to: "rpdcapitalfinanceoffice@gmail.com",
        reply_to: email,
        subject: `New Enquiry – ${service}`,
        html: `
        <h2>New Contact Enquiry</h2>

        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>

        <hr>
        <p>RPD Capital Finance</p>
        <p>Chennai – 600129</p>
        `
      });

      // 2️⃣ CONFIRMATION EMAIL TO USER
      await resend.emails.send({
        from: "RPD Capital Finance <onboarding@resend.dev>",
        to: email,
        subject: "We received your enquiry",
        html: `
        <h2>Thank you for contacting RPD Capital Finance</h2>

        <p>Dear ${name},</p>

        <p>We have received your enquiry regarding <strong>${service}</strong>.</p>

        <p>Our team will contact you shortly.</p>

        <br>

        <p><strong>Your Message:</strong></p>
        <p>${message}</p>

        <br>

        <p>Regards,</p>
        <p><strong>RPD Capital Finance</strong></p>
        <p>📍 Kovilambakkam, Chennai – 600129</p>
        <p>📞 +91 96633 16054</p>
        `
      });

      res.json({
        success: true,
        message: "Message sent successfully"
      });

    } catch (error) {

      console.error("EMAIL ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Email sending failed"
      });

    }

  });

  return router;

};