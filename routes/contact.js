const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const Enquiry = require('../models/Enquiry');

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

      /* -----------------------
         SAVE TO MONGODB
      ----------------------- */

      const enquiry = new Enquiry({
        name,
        email,
        phone,
        service,
        message
      });

      await enquiry.save();

      /* -----------------------
         GOLD DARK EMAIL DESIGN
      ----------------------- */

      const adminEmail = `
      <div style="background:#0F172A;padding:40px;font-family:Arial;color:#E2E8F0">

      <div style="max-width:600px;margin:auto;background:#1E293B;padding:30px;border-radius:10px">

      <h2 style="color:#FCD34D">New Website Enquiry</h2>

      <p><b style="color:#FCD34D">Service:</b> ${service}</p>
      <p><b style="color:#FCD34D">Name:</b> ${name}</p>
      <p><b style="color:#FCD34D">Email:</b> ${email}</p>
      <p><b style="color:#FCD34D">Phone:</b> ${phone || "N/A"}</p>

      <p style="margin-top:20px"><b style="color:#FCD34D">Message:</b></p>
      <p>${message}</p>

      <hr style="border-color:#334155;margin:30px 0">

      <p style="font-size:14px;color:#94A3B8">
      RPD Capital Finance<br>
      Chennai – 600129
      </p>

      </div>
      </div>
      `;

      await resend.emails.send({
        from: "RPD Capital Finance <onboarding@resend.dev>",
        to: "rpdcapitalfinanceoffice@gmail.com",
        reply_to: email,
        subject: `New Enquiry - ${service}`,
        html: adminEmail
      });

      /* -----------------------
         USER AUTO REPLY
      ----------------------- */

      const userEmail = `
      <div style="background:#0F172A;padding:40px;font-family:Arial;color:#E2E8F0">

      <div style="max-width:600px;margin:auto;background:#1E293B;padding:30px;border-radius:10px">

      <h2 style="color:#FCD34D">Thank You for Contacting Us</h2>

      <p>Dear ${name},</p>

      <p>
      We received your enquiry regarding 
      <b style="color:#FCD34D">${service}</b>.
      </p>

      <p>Our team will contact you shortly.</p>

      <hr style="border-color:#334155;margin:30px 0">

      <p><b>Your Message:</b></p>
      <p>${message}</p>

      <br>

      <p>
      Regards,<br>
      <b style="color:#FCD34D">RPD Capital Finance</b>
      </p>

      <p style="font-size:14px;color:#94A3B8">
      📍 Chennai – 600129<br>
      📞 +91 96633 16054
      </p>

      </div>
      </div>
      `;

      await resend.emails.send({
        from: "RPD Capital Finance <onboarding@resend.dev>",
        to: email,
        subject: "We received your enquiry",
        html: userEmail
      });

      res.json({
        success: true,
        message: "Enquiry submitted successfully"
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