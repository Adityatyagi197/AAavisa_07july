const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT == 465;
const SMTP_FROM = process.env.SMTP_FROM || `"AAA Business Consultancy" <info@aaabusinessconsultancy.com>`;

let resendClient = null;
let transporter = null;

if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here') {
  console.log('Email Service: Initializing Resend client');
  resendClient = new Resend(RESEND_API_KEY);
} else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  console.log(`Email Service: Initializing SMTP transporter to ${SMTP_HOST}:${SMTP_PORT}`);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  console.warn('Email Service: Neither Resend nor SMTP credentials configured. Running in local DRY-RUN/Sandbox mode.');
}

/**
 * Sends an email using Resend, SMTP, or prints to logs if neither is configured (dry-run).
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text body fallback
 * @returns {Promise<{success: boolean, messageId?: string, dryRun?: boolean}>}
 */
exports.sendEmail = async ({ to, subject, html, text }) => {
  if (resendClient) {
    try {
      const fromAddress = RESEND_FROM || SMTP_FROM;
      const response = await resendClient.emails.send({
        from: fromAddress,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Basic HTML strip for fallback text
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log(`Email sent successfully via Resend to ${to}. Message ID: ${response.data?.id}`);
      return { success: true, messageId: response.data?.id, dryRun: false };
    } catch (error) {
      console.error(`Failed to send email via Resend to ${to}:`, error);
      throw error;
    }
  } else if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''), // Basic HTML strip for fallback text
        html
      });
      console.log(`Email sent successfully via SMTP to ${to}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, dryRun: false };
    } catch (error) {
      console.error(`Failed to send email via SMTP to ${to}:`, error);
      throw error;
    }
  } else {
    // Sandbox / Dry-Run Log
    const fromAddress = RESEND_FROM || SMTP_FROM;
    console.log('------------------------------------------------------------');
    console.log(`[EMAIL DRY-RUN (NOT CONFIGURED)]`);
    console.log(`From:    ${fromAddress}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Preview): ${html.substring(0, 150)}...`);
    console.log('------------------------------------------------------------');
    return { success: true, messageId: `dryrun-${Date.now()}`, dryRun: true };
  }
};
