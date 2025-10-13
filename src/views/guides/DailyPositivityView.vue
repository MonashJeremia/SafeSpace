<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-5">
              <div class="page-header text-center">
                <div class="header-icon mb-3">☀️</div>
                <h1 class="page-title">Daily Positivity Challenge</h1>
                <p class="page-subtitle">Build positive habits and mindset through daily practices</p>
              </div>

              <!-- Challenge Description -->
              <div class="challenge-section mt-5">
                <h2 class="section-title">Share Positivity</h2>
                <p class="challenge-text">
                  Send a positive message to someone you care about
                </p>
              </div>

              <!-- Email Form Section -->
              <div class="email-form-section mt-4">
                <div class="form-card">
                  <!-- Success Message -->
                  <div v-if="showSuccess" class="success-msg">
                    ✓ Message sent
                  </div>

                  <!-- Error Message -->
                  <div v-if="showError" class="error-msg">
                    {{ errorMessage }}
                  </div>

                  <form @submit.prevent="sendEmail">
                    <div class="mb-3">
                      <input
                        type="text"
                        class="form-control"
                        v-model="senderName"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <input
                        type="email"
                        class="form-control"
                        v-model="recipientEmail"
                        placeholder="Send to (email)"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <textarea
                        class="form-control"
                        v-model="message"
                        rows="4"
                        placeholder="Your message..."
                        required
                        maxlength="500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      class="btn-send"
                      :disabled="isSending"
                    >
                      {{ isSending ? 'Sending...' : 'Send' }}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import MainHeader from '../../components/MainHeader.vue'
import config from '../../config/environment.js'

export default {
  name: 'DailyPositivityView',
  components: {
    MainHeader
  },
  setup() {
    const senderName = ref('')
    const recipientEmail = ref('')
    const message = ref('')
    const isSending = ref(false)
    const showSuccess = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')

    const sendEmail = async () => {
      try {
        isSending.value = true
        showSuccess.value = false
        showError.value = false

        const apiUrl = config.api.baseUrl || 'http://localhost:3000'
        
        await axios.post(`${apiUrl}/api/send-positivity-email`, {
          to: recipientEmail.value,
          message: message.value,
          senderName: senderName.value
        })

        showSuccess.value = true
        senderName.value = ''
        recipientEmail.value = ''
        message.value = ''
        
        setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      } catch (error) {
        showError.value = true
        errorMessage.value = 'Failed to send. Please try again.'
        setTimeout(() => {
          showError.value = false
        }, 3000)
      } finally {
        isSending.value = false
      }
    }

    return {
      senderName,
      recipientEmail,
      message,
      isSending,
      showSuccess,
      showError,
      errorMessage,
      sendEmail
    }
  }
}
</script>

<style scoped>
.guide-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content-wrapper {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-icon {
  font-size: 4rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
}

.challenge-section {
  padding: 2rem 0;
  text-align: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.challenge-text {
  font-size: 1rem;
  color: #666;
}

.email-form-section {
  padding: 2rem 0;
}

.form-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 3rem;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.95rem;
  width: 100%;
  transition: border 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.form-control::placeholder {
  color: #999;
}

.btn-send {
  width: 100%;
  background: #000;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-send:hover:not(:disabled) {
  background: #333;
}

.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg,
.error-msg {
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.success-msg {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-msg {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
