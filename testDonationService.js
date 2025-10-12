import dotenv from "dotenv";
import { sendDonationReceipt } from "./src/services/donationEmailService.js";

// Load environment variables
dotenv.config();

// Test configuration
const testEmail = "jeremiayo@gmail.com";
const testAmount = 75.0;

console.log("═══════════════════════════════════════");
console.log("  DONATION EMAIL SERVICE TEST");
console.log("═══════════════════════════════════════\n");
console.log(`📧 Sending to: ${testEmail}`);
console.log(`💰 Amount: $${testAmount.toFixed(2)}\n`);

// Send test email
sendDonationReceipt(testEmail, testAmount)
  .then((result) => {
    console.log("\n═══════════════════════════════════════");
    if (result.success) {
      console.log("✅ TEST PASSED");
      console.log("📬 Email sent successfully!");
      console.log("📊 Result:", JSON.stringify(result.result, null, 2));
      console.log("\n💡 Check your inbox:", testEmail);
    } else {
      console.log("❌ TEST FAILED");
      console.log("Error:", result.error);
    }
    console.log("═══════════════════════════════════════");
  })
  .catch((error) => {
    console.error("\n❌ Unexpected error:", error);
    console.log("═══════════════════════════════════════");
  });
