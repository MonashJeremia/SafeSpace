<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content py-2 py-sm-3 py-md-4 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-4">
              <div class="page-header text-center">
                <div class="header-icon mb-2">☀️</div>
                <h1 class="page-title">Daily Positivity Challenge</h1>
                <p class="page-subtitle">Build positive habits and mindset through daily practices</p>
              </div>

              <!-- Streak Counter Section -->
              <div class="streak-section mt-3">
                <div class="streak-card">
                  <div class="streak-icon">🔥</div>
                  <div class="streak-info">
                    <h3 class="streak-title">Daily Streak</h3>
                    <div class="streak-counter">{{ streakData.currentStreak }}</div>
                    <p class="streak-label">{{ streakData.currentStreak === 1 ? 'day' : 'days' }}</p>
                  </div>
                  <div class="streak-stats">
                    <div class="streak-stat">
                      <span class="stat-number">{{ streakData.bestStreak }}</span>
                      <span class="stat-label">Best</span>
                    </div>
                    <div class="streak-stat">
                      <span class="stat-number">{{ streakData.totalMessages }}</span>
                      <span class="stat-label">Total</span>
                    </div>
                  </div>
                </div>
                
                <div class="streak-status mt-3">
                  <div v-if="streakData.lastMessageDate === todayDateString" class="streak-complete">
                    ✅ Today's positivity shared! Come back tomorrow to continue your streak.
                  </div>
                  <div v-else-if="streakData.currentStreak === 0" class="streak-start">
                    🌟 Start your positivity streak by sending your first message!
                  </div>
                  <div v-else class="streak-pending">
                    ⏰ Send a positive message today to continue your {{ streakData.currentStreak }}-day streak!
                  </div>
                </div>
              </div>

              <!-- Challenge Description -->
              <div class="challenge-section mt-3">
                <h2 class="section-title">Share Positivity</h2>
                <p class="challenge-text">
                  Send a positive message to someone you care about
                </p>
              </div>

              <!-- Email Form Section -->
              <div class="email-form-section mt-3">
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
import { ref, computed, onMounted } from 'vue'
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
    
    // Streak system
    const streakData = ref({
      currentStreak: 0,
      bestStreak: 0,
      lastMessageDate: null,
      totalMessages: 0
    })
    
    // Get today's date string for comparison
    const todayDateString = computed(() => {
      return new Date().toDateString()
    })
    
    // Initialize streak data from localStorage
    const initializeStreakData = () => {
      const savedStreak = localStorage.getItem('dailyPositivityStreak')
      if (savedStreak) {
        const parsed = JSON.parse(savedStreak)
        streakData.value = { ...parsed }
        
        // Check if streak should be reset due to missed days
        if (parsed.lastMessageDate) {
          const lastDate = new Date(parsed.lastMessageDate)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          
          // Reset streak if more than 1 day has passed
          if (lastDate.toDateString() !== today.toDateString() && 
              lastDate.toDateString() !== yesterday.toDateString()) {
            streakData.value.currentStreak = 0
            saveStreakData()
          }
        }
      }
    }
    
    // Save streak data to localStorage
    const saveStreakData = () => {
      localStorage.setItem('dailyPositivityStreak', JSON.stringify(streakData.value))
    }
    
    // Update streak when message is sent
    const updateStreak = () => {
      const today = todayDateString.value
      
      // Don't update streak if already sent today
      if (streakData.value.lastMessageDate === today) {
        return
      }
      
      // Check if this continues the streak (sent yesterday)
      if (streakData.value.lastMessageDate) {
        const lastDate = new Date(streakData.value.lastMessageDate)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          // Continue streak
          streakData.value.currentStreak += 1
        } else {
          // Start new streak
          streakData.value.currentStreak = 1
        }
      } else {
        // First message ever
        streakData.value.currentStreak = 1
      }
      
      // Update best streak if current is higher
      if (streakData.value.currentStreak > streakData.value.bestStreak) {
        streakData.value.bestStreak = streakData.value.currentStreak
      }
      
      // Update last message date and total count
      streakData.value.lastMessageDate = today
      streakData.value.totalMessages += 1
      
      // Save to localStorage
      saveStreakData()
    }

    const sendEmail = async () => {
      // Check if already sent today
      if (streakData.value.lastMessageDate === todayDateString.value) {
        showError.value = true
        errorMessage.value = 'You\'ve already sent your daily positivity message! Come back tomorrow to continue your streak.'
        setTimeout(() => {
          showError.value = false
        }, 3000)
        return
      }
      
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

        // Update streak on successful send
        updateStreak()
        
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
    
    // Initialize streak data on component mount
    onMounted(() => {
      initializeStreakData()
    })

    return {
      senderName,
      recipientEmail,
      message,
      isSending,
      showSuccess,
      showError,
      errorMessage,
      sendEmail,
      streakData,
      todayDateString
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
  font-size: 2.2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.75rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
}

/* Streak Section */
.streak-section {
  padding: 1rem 0;
}

.streak-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  margin-bottom: 0.75rem;
}

.streak-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.streak-info {
  flex: 1;
  text-align: center;
}

.streak-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  opacity: 0.9;
}

.streak-counter {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.15rem;
}

.streak-label {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
}

.streak-stats {
  display: flex;
  gap: 1.5rem;
}

.streak-stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.streak-status {
  text-align: center;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

.streak-complete {
  background: #d1f2eb;
  color: #0f5132;
  border: 2px solid #a7e9d1;
}

.streak-start {
  background: #fff3cd;
  color: #856404;
  border: 2px solid #ffeaa7;
}

.streak-pending {
  background: #cff4fc;
  color: #055160;
  border: 2px solid #b6effb;
}

.challenge-section {
  padding: 1rem 0;
  text-align: center;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.4rem;
}

.challenge-text {
  font-size: 0.95rem;
  color: #666;
}

.email-form-section {
  padding: 1rem 0;
}

.form-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .streak-card {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }
  
  .streak-icon {
    margin-right: 0;
    margin-bottom: 0.75rem;
    font-size: 2rem;
  }
  
  .streak-info {
    margin-bottom: 1rem;
  }
  
  .streak-counter {
    font-size: 2.2rem;
  }
  
  .streak-stats {
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.1rem;
  }
  
  .form-card {
    padding: 1.5rem 1.25rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-subtitle {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .streak-card {
    padding: 1rem;
  }
  
  .streak-counter {
    font-size: 1.8rem;
  }
  
  .streak-stats {
    gap: 0.75rem;
  }
  
  .form-card {
    padding: 1.25rem 1rem;
  }
  
  .content-wrapper {
    padding: 1.5rem 1rem !important;
  }
}
</style>
