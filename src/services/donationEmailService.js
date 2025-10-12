/**
 * Send a donation receipt email to the donor via backend API
 * @param {string} to - Recipient email address
 * @param {number} amount - Donation amount
 * @returns {Promise} - Result of email send operation
 */
export async function sendDonationReceipt(to, amount) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/send-donation-receipt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, amount }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to send email");
    }

    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}
