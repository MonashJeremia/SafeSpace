import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Load PDF file and convert to base64
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<string>} - Base64 encoded PDF content
 */
async function loadPdfAsBase64(pdfPath) {
  try {
    const response = await fetch(pdfPath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw error;
  }
}

/**
 * Send a donation receipt email to the donor
 * @param {string} to - Recipient email address
 * @param {number} amount - Donation amount
 * @param {Array} attachments - Optional array of attachments
 * @returns {Promise} - Result of email send operation
 */
export async function sendDonationReceipt(to, amount, attachments = null) {
  const subject = "Thank you for your Donation - SafeSpace";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1976d2 0%, #125ea7 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5eaf1;
            border-top: none;
          }
          .amount-box {
            background: #f4f6fa;
            border-left: 4px solid #1976d2;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .amount {
            font-size: 32px;
            font-weight: bold;
            color: #1976d2;
            margin: 0;
          }
          .footer {
            background: #f4f6fa;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 14px;
            color: #666;
          }
          .thank-you {
            color: #1976d2;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SafeSpace</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Mental Health Support Platform</p>
        </div>
        <div class="content">
          <p class="thank-you">Thank You for Your Generous Donation!</p>
          <p>Dear Supporter,</p>
          <p>
            We are incredibly grateful for your generous contribution to SafeSpace. 
            Your donation helps us continue providing vital mental health resources 
            and support to those who need it most.
          </p>
          <div class="amount-box">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Your Donation Amount:</p>
            <p class="amount">$${amount.toFixed(2)}</p>
          </div>
          <p>
            Your support makes a real difference in the lives of individuals facing 
            mental health challenges. Thanks to donors like you, we can:
          </p>
          <ul>
            <li>Provide free access to mental health resources</li>
            <li>Maintain our 24/7 crisis hotline connections</li>
            <li>Develop interactive tools and coping strategies</li>
            <li>Create educational content for mental health awareness</li>
          </ul>
          <p>
            This email serves as your donation receipt. Please keep it for your records.
          </p>
          <p style="margin-top: 25px;">
            <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}<br>
            <strong>Receipt Email:</strong> ${to}<br>
            <strong>Transaction ID:</strong> ${generateTransactionId()}
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>SafeSpace</strong> - Supporting Mental Health & Well-being
          </p>
          <p style="margin: 0; font-size: 12px;">
            This is a mockup donation receipt. No actual payment was processed.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const emailData = {
      from: "SafeSpace <onboarding@resend.dev>",
      to,
      subject,
      html,
    };

    // Load and attach the Thank_you.pdf file
    try {
      const pdfPath = new URL("../assets/Thank_you.pdf", import.meta.url).href;
      const pdfBase64 = await loadPdfAsBase64(pdfPath);

      emailData.attachments = [
        {
          filename: "Thank_you.pdf",
          content: pdfBase64,
        },
      ];

      // Add any additional attachments if provided
      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        emailData.attachments = [...emailData.attachments, ...attachments];
      }
    } catch (pdfError) {
      console.error(
        "Error loading Thank_you.pdf, sending email without attachment:",
        pdfError
      );
      // Continue without attachment if PDF loading fails
      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        emailData.attachments = attachments;
      }
    }

    const result = await resend.emails.send(emailData);
    console.log("Donation receipt email sent:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Error sending donation receipt email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a unique transaction ID for the donation
 * @returns {string} - Transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `SS-${timestamp}-${random}`;
}
