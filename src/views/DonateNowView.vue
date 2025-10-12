<template>
  <div>
    <MainHeader />
    <div class="donate-container">
      <div class="donate-card">
        <div class="donate-header">
          <div class="logo-placeholder">SafeSpace</div>
        </div>
        <div class="donate-body">
          <p class="donate-welcome">
            Welcome to SafeSpace donation, please fill out the form below.
            <br />
            <i>This is just a mockup - no actual payment processing is done.</i>
          </p>
          <p class="donation-amount-display">Donation: ${{ amount }}</p>
          <div class="donate-section">
            <label class="donate-label">Choose a donation amount</label>
            <div class="donate-amounts">
              <label class="donate-radio">
                <input type="radio" v-model="amount" :value="25" />
                $25
              </label>
              <label class="donate-radio">
                <input type="radio" v-model="amount" :value="50" />
                $50
              </label>
              <label class="donate-radio">
                <input type="radio" v-model="amount" :value="100" />
                $100
              </label>
            </div>
            <div class="custom-amount-link">
              <a href="#" @click.prevent="showCustom = true"
                >Enter a custom donation amount</a
              >
            </div>
            <div v-if="showCustom" class="custom-amount-input">
              <input
                type="number"
                min="1"
                v-model.number="customAmount"
                placeholder="Custom $"
              />
              <button class="btn btn-blue btn-sm" @click="setCustomAmount">
                Set
              </button>
              <button
                class="btn btn-outline btn-sm"
                @click="showCustom = false"
              >
                Cancel
              </button>
            </div>
          </div>
          <div class="donate-section">
            <label class="donate-label">Email to send receipt to</label>
            <input
              type="email"
              v-model="email"
              class="email-input"
              placeholder="your.email@example.com"
              required
            />
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
          </div>
          <div class="donate-actions">
            <button
              class="btn btn-blue btn-full"
              @click="checkout"
              :disabled="isProcessing"
            >
              <span v-if="!isProcessing">Pay ${{ amount }} Now</span>
              <span v-else>Processing...</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Thank You Popup -->
    <div v-if="showThankYou" class="popup-overlay" @click="closePopup">
      <div class="popup-card" @click.stop>
        <h2>Thank You!</h2>
        <p>
          Thank you for donating! The receipt has been sent to
          <strong>{{ email }}</strong>
        </p>
        <button class="btn btn-blue" @click="closePopup">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MainHeader from "../components/MainHeader.vue";
import { sendDonationReceipt } from "../services/donationEmailService";

const router = useRouter();
const amount = ref(25);
const showCustom = ref(false);
const customAmount = ref(null);
const email = ref("");
const emailError = ref("");
const showThankYou = ref(false);
const isProcessing = ref(false);

function setCustomAmount() {
  if (customAmount.value && customAmount.value > 0) {
    amount.value = customAmount.value;
    showCustom.value = false;
  }
}

function validateEmail(emailStr) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailStr);
}

async function checkout() {
  emailError.value = "";

  if (!email.value) {
    emailError.value = "Please enter an email address";
    return;
  }

  if (!validateEmail(email.value)) {
    emailError.value = "Please enter a valid email address";
    return;
  }

  // Process the donation and send email with Thank_you.pdf attachment
  isProcessing.value = true;

  try {
    console.log("💰 Processing donation of $" + amount.value);
    console.log("📧 Sending receipt to:", email.value);

    // Send donation receipt email with attached PDF
    const emailResult = await sendDonationReceipt(email.value, amount.value);

    if (emailResult.success) {
      console.log("✅ Donation receipt sent successfully!");
      console.log("📊 Email result:", emailResult.result);
    } else {
      console.error("❌ Failed to send donation receipt:", emailResult.error);
      // Still show thank you popup even if email fails
    }
  } catch (error) {
    console.error("❌ Error processing donation:", error);
    // Still show thank you popup even if email fails
  } finally {
    isProcessing.value = false;
    // Show thank you popup
    showThankYou.value = true;
  }
}

function closePopup() {
  showThankYou.value = false;
  router.push("/");
}
</script>

<style scoped>
.donate-container {
  min-height: calc(100vh - 180px);
  background: #f4f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}
.donate-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  max-width: 700px;
  width: 100%;
  padding: 0;
  overflow: hidden;
}
.donate-header {
  padding: 2rem 2rem 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #e5eaf1;
}
.logo-placeholder {
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.02em;
}
.donate-body {
  padding: 1.5rem 2rem;
}
.donate-welcome {
  color: #444;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.donation-amount-display {
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.donate-section {
  margin-bottom: 1.2rem;
}
.donate-label {
  font-weight: 600;
  color: #222;
  margin-bottom: 0.5rem;
  display: block;
}
.donate-amounts {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}
.donate-radio {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.1rem;
  color: #222;
}
.custom-amount-link {
  margin-bottom: 0.5rem;
}
.custom-amount-link a {
  color: #1976d2;
  font-size: 0.98rem;
  text-decoration: underline;
  cursor: pointer;
}
.custom-amount-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.custom-amount-input input {
  width: 120px;
  padding: 0.4rem 0.7rem;
  border: 1px solid #bcd0ee;
  border-radius: 6px;
  font-size: 1rem;
}
.donate-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
.btn {
  flex: 1 1 0;
  padding: 0.8rem 0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s, color 0.15s, border 0.15s;
}
.btn-blue {
  background: #1976d2;
  color: #fff;
}
.btn-blue:hover {
  background: #125ea7;
}
.btn-outline {
  background: #fff;
  color: #1976d2;
  border: 2px solid #1976d2;
}
.btn-outline:hover {
  background: #e3f0fd;
}
.btn-sm {
  padding: 0.4rem 1.2rem;
  font-size: 0.95rem;
  border-radius: 6px;
}
.btn-full {
  width: 100%;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.email-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #bcd0ee;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 0.5rem;
}
.email-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}
.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 0.4rem;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.popup-card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.popup-card h2 {
  color: #1976d2;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}
.popup-card p {
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
  line-height: 1.6;
}
.popup-card strong {
  color: #1976d2;
}
</style>
