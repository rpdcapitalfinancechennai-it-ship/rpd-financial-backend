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

      const enquiry = new Enquiry({ name, email, phone, service, message });
      await enquiry.save();

      /* -----------------------
         SHARED STYLES
      ----------------------- */

      const emailWrapper = (content) => `
        <div style="margin:0;padding:0;background-color:#F0F4F8;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4F8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- HEADER BANNER -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1A3C5E 0%,#2563A8 100%);border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding-bottom:12px;">
                            <!-- Finance Icon: Bar Chart -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                              <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.12)"/>
                              <rect x="10" y="28" width="6" height="12" rx="2" fill="#F59E0B"/>
                              <rect x="21" y="20" width="6" height="20" rx="2" fill="#FCD34D"/>
                              <rect x="32" y="12" width="6" height="28" rx="2" fill="#F59E0B"/>
                              <polyline points="13,28 24,20 35,12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                              <circle cx="13" cy="28" r="2.5" fill="#FFFFFF"/>
                              <circle cx="24" cy="20" r="2.5" fill="#FFFFFF"/>
                              <circle cx="35" cy="12" r="2.5" fill="#FFFFFF"/>
                            </svg>
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:700;letter-spacing:0.5px;">RPD Capital Finance</h1>
                            <p style="margin:6px 0 0;color:#BFDBFE;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Smart Lending. Trusted Growth.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="background:#FFFFFF;padding:36px 40px;">
                      ${content}
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;border-radius:0 0 12px 12px;padding:24px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p style="margin:0 0 4px;font-size:13px;color:#64748B;">
                              📍 Chennai – 600129 &nbsp;|&nbsp; 📞 +91 96633 16054
                            </p>
                            <p style="margin:0;font-size:12px;color:#94A3B8;">
                              This is an automated message from RPD Capital Finance. Please do not reply directly to this email.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
      `;

      /* -----------------------
         ADMIN EMAIL
      ----------------------- */

     /* -----------------------
   ADMIN EMAIL WRAPPER (Green & Gold)
----------------------- */

const adminEmailHtml = `
  <div style="margin:0;padding:0;background-color:#F0F7F1;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F7F1;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#14532D 0%,#166534 60%,#15803D 100%);border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" style="margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;">
                  <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.10)"/>
                  <rect x="10" y="28" width="6" height="12" rx="2" fill="#F59E0B"/>
                  <rect x="21" y="20" width="6" height="20" rx="2" fill="#FCD34D"/>
                  <rect x="32" y="12" width="6" height="28" rx="2" fill="#F59E0B"/>
                  <polyline points="13,28 24,20 35,12" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <circle cx="13" cy="28" r="2.5" fill="#FCD34D"/>
                  <circle cx="24" cy="20" r="2.5" fill="#FCD34D"/>
                  <circle cx="35" cy="12" r="2.5" fill="#FCD34D"/>
                </svg>
                <h1 style="margin:0;color:#FCD34D;font-size:22px;font-weight:700;letter-spacing:0.5px;">RPD Capital Finance</h1>
                <p style="margin:6px 0 0;color:#BBF7D0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Smart Lending. Trusted Growth.</p>
              </td>
            </tr>

            <!-- GOLD ACCENT BAR -->
            <tr><td style="background:#F59E0B;height:4px;"></td></tr>

            <!-- BODY -->
            <tr>
              <td style="background:#FFFFFF;padding:36px 40px;">

                <div style="background:#F0FDF4;border-left:4px solid #16A34A;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#14532D;text-transform:uppercase;letter-spacing:0.5px;">🔔 New Enquiry Received</p>
                </div>

                <h2 style="margin:0 0 24px;font-size:20px;color:#14532D;font-weight:700;">Lead Details</h2>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td width="48%" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px;vertical-align:top;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.8px;">Full Name</p>
                      <p style="margin:0;font-size:15px;font-weight:600;color:#14532D;">${name}</p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:16px;vertical-align:top;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#B45309;text-transform:uppercase;letter-spacing:0.8px;">Service Requested</p>
                      <p style="margin:0;font-size:15px;font-weight:600;color:#92400E;">${service}</p>
                    </td>
                  </tr>
                  <tr><td colspan="3" style="padding:8px 0;"></td></tr>
                  <tr>
                    <td width="48%" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px;vertical-align:top;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.8px;">Email Address</p>
                      <p style="margin:0;font-size:15px;color:#15803D;">${email}</p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px;vertical-align:top;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.8px;">Phone Number</p>
                      <p style="margin:0;font-size:15px;color:#14532D;">${phone || 'Not provided'}</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
                <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:18px;">
                  <p style="margin:0;font-size:14px;line-height:1.7;color:#166534;">${message}</p>
                </div>

                <div style="margin-top:28px;text-align:center;">
                  <a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#15803D,#166534);color:#FCD34D;font-size:14px;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                    Reply to ${name}
                  </a>
                </div>

              </td>
            </tr>

            <!-- GOLD ACCENT BAR -->
            <tr><td style="background:#F59E0B;height:3px;"></td></tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#F0FDF4;border-radius:0 0 12px 12px;padding:24px 40px;">
                <p style="margin:0 0 4px;font-size:13px;color:#15803D;">
                  📍 Chennai – 600129 &nbsp;|&nbsp; 📞 +91 96633 16054
                </p>
                <p style="margin:0;font-size:12px;color:#16A34A;">
                  This is an automated message from RPD Capital Finance.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`;



      /* -----------------------
         USER AUTO-REPLY EMAIL
      ----------------------- */

      const userContent = `
        <h2 style="margin:0 0 8px;font-size:22px;color:#0F172A;font-weight:700;">Thank you, ${name}!</h2>
        <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">We've received your enquiry and our team will get back to you within <strong style="color:#0F172A;">24–48 business hours</strong>.</p>

        <!-- Confirmation Card -->
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#1E40AF;text-transform:uppercase;letter-spacing:0.8px;">Service Enquired</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:#1E40AF;">${service}</p>
        </div>

        <!-- Your Message -->
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Your Message</p>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #2563A8;border-radius:0 8px 8px 0;padding:16px 18px;margin-bottom:28px;">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;">${message}</p>
        </div>

        <!-- What happens next -->
        <p style="margin:0 0 14px;font-size:14px;font-weight:600;color:#0F172A;">What happens next?</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;vertical-align:middle;">
              <span style="display:inline-block;width:28px;height:28px;background:#EFF6FF;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#2563A8;margin-right:12px;">1</span>
              <span style="font-size:14px;color:#334155;">Our team reviews your enquiry</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;vertical-align:middle;">
              <span style="display:inline-block;width:28px;height:28px;background:#EFF6FF;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#2563A8;margin-right:12px;">2</span>
              <span style="font-size:14px;color:#334155;">A finance specialist is assigned to you</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;vertical-align:middle;">
              <span style="display:inline-block;width:28px;height:28px;background:#EFF6FF;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#2563A8;margin-right:12px;">3</span>
              <span style="font-size:14px;color:#334155;">We contact you to discuss your requirements</span>
            </td>
          </tr>
        </table>

        <div style="margin-top:28px;text-align:center;">
          <p style="margin:0;font-size:14px;color:#64748B;">Questions? Call us at</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#2563A8;">+91 96633 16054</p>
        </div>
      `;

      /* -----------------------
         SEND EMAILS
      ----------------------- */

      await resend.emails.send({
        from: "RPD Capital Finance <onboarding@resend.dev>",
        to: "rpdcapitalfinanceoffice@gmail.com",
        reply_to: email,
        subject: `New Enquiry — ${service} from ${name}`,
        html: emailWrapper(adminContent)
      });

      await resend.emails.send({
        from: "RPD Capital Finance <onboarding@resend.dev>",
        to: email,
        subject: "We received your enquiry — RPD Capital Finance",
        html: emailWrapper(userContent)
      });

      res.json({ success: true, message: "Enquiry submitted successfully" });

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