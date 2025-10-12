import { Resend } from "resend";

// Initialize Resend - will be set when sending email
let resend;

function getResendInstance() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

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
      <body>
        <h1>SafeSpace</h1>
        <p>Mental Health Support Platform</p>
        
        <h2>Thank You for Your Generous Donation!</h2>
        <p>Dear Supporter,</p>
        <p>
          We are incredibly grateful for your generous contribution to SafeSpace. 
          Your donation helps us continue providing vital mental health resources 
          and support to those who need it most.
        </p>
        
        <h3>Your Donation Amount: $${amount.toFixed(2)}</h3>
        
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
        
        <p>This email serves as your donation receipt. Please keep it for your records.</p>
        
        <p>
          <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}<br>
          <strong>Receipt Email:</strong> ${to}
        </p>
        
        <hr>
        <p><strong>SafeSpace</strong> - Supporting Mental Health & Well-being</p>
        <p><small>This is a mockup donation receipt. No actual payment was processed.</small></p>
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

    const resendInstance = getResendInstance();
    const result = await resendInstance.emails.send(emailData);
    console.log("Donation receipt email sent:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Error sending donation receipt email:", error);
    return { success: false, error: error.message };
  }
}
