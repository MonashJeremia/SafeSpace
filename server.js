import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

// ES module equivalents for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for cross-origin requests from frontend
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Initialize Resend email service client
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("SafeSpace Email Server is running!");
});

/**
 * POST /api/send-donation-receipt
 * Sends donation receipt email to donor
 * Request body: { to: string, amount: number }
 * Response: { success: boolean, result?: object, error?: string }
 */
app.post("/api/send-donation-receipt", async (req, res) => {
  try {
    const { to, amount } = req.body;

    // Validate required fields
    if (!to || !amount) {
      return res.status(400).json({
        success: false,
        error: "Email and amount are required",
      });
    }

    const subject = "Thank you for your Donation - SafeSpace";

    // HTML template for donation receipt email
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
          
          <h3>Your Donation Amount: $${Number(amount).toFixed(2)}</h3>
          
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

    // Prepare email data object
    const emailData = {
      from: "SafeSpace <onboarding@resend.dev>",
      to,
      subject,
      html,
    };

    // Attach PDF receipt if available in assets
    const pdfPath = path.join(__dirname, "src", "assets", "Thank_you.pdf");
    if (fs.existsSync(pdfPath)) {
      const pdfContent = fs.readFileSync(pdfPath);
      const base64Content = pdfContent.toString("base64");
      emailData.attachments = [
        {
          filename: "Thank_you.pdf",
          content: base64Content,
        },
      ];
    }

    // Send email via Resend API
    const result = await resend.emails.send(emailData);

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/send-positivity-email
 * Sends positivity message from Daily Positivity Challenge
 * Request body: { to: string, from?: string, message: string, senderName?: string }
 * Response: { success: boolean, result?: object, error?: string }
 */
app.post("/api/send-positivity-email", async (req, res) => {
  try {
    const { to, from, message, senderName } = req.body;

    // Validate required fields
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: "Recipient email and message are required",
      });
    }

    const subject = `Message from ${senderName || "Someone"} via SafeSpace`;

    // HTML template for positivity message email
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #333; font-weight: 500;">SafeSpace</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 4px; margin-bottom: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0;">
              "${message}"
            </p>
            <p style="text-align: right; color: #666; margin-top: 20px;">
              — ${senderName || "A Friend"}
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 13px;">
            <p>Sent via SafeSpace Daily Positivity Challenge</p>
          </div>
        </body>
      </html>
    `;

    // Prepare email data with optional reply-to
    const emailData = {
      from: "SafeSpace Positivity <onboarding@resend.dev>",
      to,
      subject,
      html,
      reply_to: from || undefined,
    };

    // Send email via Resend API
    const result = await resend.emails.send(emailData);

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start Express server on specified port
app.listen(port, () => {});
