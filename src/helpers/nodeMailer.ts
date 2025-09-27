import config from '../config';
import nodemailer from 'nodemailer';
import logger from '../shared/logger';

/**
 * Sends an email using the Gmail SMTP server.
 * @param to - The recipient's email address.
 * @param html - The HTML content of the email.
 * @param subject  - The subject line of the email.
 * @returns
 */
export async function sendEmail(to: string, html: string, subject: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.net',
    port: 465,
    secure: true,
    auth: {
      user: config.softograph_email,
      pass: config.softograph_pass,
    },
  });

  try {
    const mailResponse = await transporter.sendMail({
      from: `"E-Commerce" <${config.softograph_email}>`,
      to,
      subject,
      html,
    });
    return mailResponse;
  } catch (error) {
    logger.error(`Email sending failed: `, {
      email: to,
      subject,
      error: error instanceof Error ? error.message : error,    
    });
    return null; // Return null on failure without throwing
  }
}
