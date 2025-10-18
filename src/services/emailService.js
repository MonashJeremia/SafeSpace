import { Resend } from "resend";

// Initialize Resend API client with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML content of email body
 * Returns nothing, fails silently on error
 */
export async function sendEmail(to, subject, html) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
  } catch (error) {
    // Silent fail - email sending is non-critical
  }
}
