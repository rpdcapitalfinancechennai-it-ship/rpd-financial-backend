const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
      console.log('GMAIL USER:', process.env.GMAIL_USER);
    const { name, email, phone, service, message } = req.body;

   if (!name || !email || !service || !message) {
  return res.status(400).json({
    success: false,
    message: 'Required fields missing',

  });
}


    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, /*waoe fcxz rgnv mdgo*/
      },
    });

   const mailOptions = {
  from: `"RPD Website" <${process.env.GMAIL_USER}>`,
  to: 'rpdcapitalfinancechennai@gmail.com',
  subject: `New Enquiry – ${service}`,
  html: `
    <h3>New Contact Enquiry</h3>
    <p><strong>Service Required:</strong> ${service}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `,
};


    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Email sending failed' });
  }
});

module.exports = router;
