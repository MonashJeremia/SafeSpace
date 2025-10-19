<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content py-2 py-sm-3 py-md-4 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-4">
              <div class="page-header text-center">
                <div class="header-icon">☀️</div>
                <h1 class="page-title">Daily Positivity</h1>
                <p class="page-subtitle">Send kindness, build streaks</p>
              </div>

              <!-- Streak Counter Section -->
              <div class="streak-section mt-4">
                <div class="streak-card">
                  <div class="streak-main">
                    <div class="streak-number">{{ streakData.currentStreak }}</div>
                    <div class="streak-text">{{ streakData.currentStreak === 1 ? 'Day streak' : 'Days streak' }}</div>
                  </div>
                  <div class="streak-stats">
                    <div class="stat-item">
                      <div class="stat-value">{{ streakData.bestStreak }}</div>
                      <div class="stat-label">Best</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                      <div class="stat-value">{{ streakData.totalMessages }}</div>
                      <div class="stat-label">Total</div>
                    </div>
                  </div>
                </div>
                
                <div class="streak-status">
                  <div v-if="streakData.lastMessageDate === todayDateString" class="status-message complete">
                    Done for today! Come back tomorrow
                  </div>
                  <div v-else-if="streakData.currentStreak === 0" class="status-message start">
                    Send your first message to start
                  </div>
                  <div v-else class="status-message pending">
                    Keep your {{ streakData.currentStreak }}-day streak alive
                  </div>
                </div>
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

                    <!-- File Attachment Input -->
                    <div class="mb-3">
                      <label class="file-upload-label">
                        <input
                          type="file"
                          ref="fileInput"
                          @change="handleFileChange"
                          accept="image/*,.pdf,.doc,.docx"
                          class="file-input"
                        />
                        <div class="file-upload-button">
                          <span class="upload-icon">📎</span>
                          <span>{{ attachment ? attachment.name : 'Attach file (optional)' }}</span>
                        </div>
                      </label>
                      <div v-if="attachment" class="file-info">
                        <span class="file-name">{{ attachment.name }}</span>
                        <span class="file-size">({{ formatFileSize(attachment.size) }})</span>
                        <button type="button" @click="removeAttachment" class="remove-file-btn">✕</button>
                      </div>
                      <small class="form-text">Max 5MB • Images, PDF, Word documents</small>
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
import { authState } from '../../services/authService.js'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../main.js'

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
    const attachment = ref(null)
    const fileInput = ref(null)
    
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

    // Helper: check if user is authenticated and get UID
    const isAuthenticated = computed(() => authState.isAuthenticated)
    const currentUid = computed(() => authState.currentUser ? authState.currentUser.id : null)

    // Load streak data for authenticated user from Firestore or fallback to localStorage for guests
    const initializeStreakData = async () => {
      try {
        if (isAuthenticated.value && currentUid.value) {
          // Fetch user doc and read dailyPositivityStreak field
          const userDocRef = doc(db, 'users', currentUid.value)
          const snap = await getDoc(userDocRef)
          if (snap.exists()) {
            const data = snap.data()
            if (data && data.dailyPositivityStreak) {
              streakData.value = { ...data.dailyPositivityStreak }
            }
          }

          // If lastMessageDate exists, check if streak should be reset
          if (streakData.value.lastMessageDate) {
            const lastDate = new Date(streakData.value.lastMessageDate)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            if (lastDate.toDateString() !== today.toDateString() && 
                lastDate.toDateString() !== yesterday.toDateString()) {
              streakData.value.currentStreak = 0
              await saveStreakData()
            }
          }
        } else {
          // Guest/localStorage fallback
          const savedStreak = localStorage.getItem('dailyPositivityStreak_guest')
          if (savedStreak) {
            const parsed = JSON.parse(savedStreak)
            streakData.value = { ...parsed }

            // Check if streak should be reset due to missed days
            if (parsed.lastMessageDate) {
              const lastDate = new Date(parsed.lastMessageDate)
              const today = new Date()
              const yesterday = new Date(today)
              yesterday.setDate(yesterday.getDate() - 1)

              if (lastDate.toDateString() !== today.toDateString() && 
                  lastDate.toDateString() !== yesterday.toDateString()) {
                streakData.value.currentStreak = 0
                saveStreakData()
              }
            }
          }
        }
      } catch (err) {
        // Fail silently but keep local state
      }
    }

    // Save streak data to Firestore for authenticated users, otherwise to localStorage
    const saveStreakData = async () => {
      try {
        if (isAuthenticated.value && currentUid.value) {
          const userDocRef = doc(db, 'users', currentUid.value)
          await setDoc(userDocRef, { dailyPositivityStreak: streakData.value }, { merge: true })
        } else {
          localStorage.setItem('dailyPositivityStreak_guest', JSON.stringify(streakData.value))
        }
      } catch (err) {
        // Silent fail
      }
    }

    // Update streak when message is sent
    const updateStreak = async () => {
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
      
      // Save to Firestore or localStorage
      await saveStreakData()
    }

    /**
     * Handle file selection for attachment
     * Validates file size (max 5MB)
     */
    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
          showError.value = true
          errorMessage.value = 'File size must be less than 5MB'
          setTimeout(() => {
            showError.value = false
          }, 3000)
          // Reset file input
          if (fileInput.value) {
            fileInput.value.value = ''
          }
          return
        }
        attachment.value = file
      }
    }

    /**
     * Remove selected attachment
     */
    const removeAttachment = () => {
      attachment.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    /**
     * Format file size for display
     */
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    /**
     * Send positivity email with optional attachment
     * Uses FormData to handle file uploads
     */
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
        
        // Use FormData to handle file upload
        const formData = new FormData()
        formData.append('to', recipientEmail.value)
        formData.append('message', message.value)
        formData.append('senderName', senderName.value)
        
        // Add attachment if present
        if (attachment.value) {
          formData.append('attachment', attachment.value)
        }
        
        await axios.post(`${apiUrl}/api/send-positivity-email`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Update streak on successful send
        await updateStreak()
        
        showSuccess.value = true
        senderName.value = ''
        recipientEmail.value = ''
        message.value = ''
        removeAttachment()
        
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
    onMounted(async () => {
      await initializeStreakData()
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
      todayDateString,
      attachment,
      fileInput,
      handleFileChange,
      removeAttachment,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.guide-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.content-wrapper {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
  font-weight: 400;
}

/* Streak Section */
.streak-section {
  padding: 2rem 0 1rem;
}

.streak-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.streak-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4299e1 0%, #667eea 100%);
}

.streak-main {
  text-align: center;
  flex: 1;
}

.streak-number {
  font-size: 3.5rem;
  font-weight: 700;
  color: #4299e1;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.streak-text {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.streak-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: #e2e8f0;
}

.streak-status {
  text-align: center;
  margin-top: 1.5rem;
}

.status-message {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.status-message.complete {
  background: #f0fff4;
  color: #38a169;
  border-color: #9ae6b4;
}

.status-message.start {
  background: #fffbeb;
  color: #d69e2e;
  border-color: #fbd38d;
}

.status-message.pending {
  background: #ebf8ff;
  color: #3182ce;
  border-color: #90cdf4;
}

.email-form-section {
  padding: 2rem 0 1rem;
}

.form-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.form-control {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.95rem;
  width: 100%;
  transition: all 0.2s ease;
  background: #f7fafc;
}

.form-control:focus {
  outline: none;
  border-color: #4299e1;
  background: white;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-control::placeholder {
  color: #a0aec0;
}

.btn-send {
  width: 100%;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.3);
}

.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success-msg,
.error-msg {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
  border: 1px solid transparent;
}

.success-msg {
  background: #f0fff4;
  color: #38a169;
  border-color: #9ae6b4;
}

.error-msg {
  background: #fed7d7;
  color: #e53e3e;
  border-color: #feb2b2;
}

/* File Upload Styles */
.file-upload-label {
  display: block;
  cursor: pointer;
  margin: 0;
}

.file-input {
  display: none;
}

.file-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  background: #f7fafc;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.file-upload-button:hover {
  border-color: #4299e1;
  background: #ebf8ff;
  color: #3182ce;
}

.upload-icon {
  font-size: 1.25rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #ebf8ff;
  border-radius: 8px;
  font-size: 0.85rem;
}

.file-name {
  color: #2d3748;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #718096;
  font-size: 0.8rem;
}

.remove-file-btn {
  background: transparent;
  border: none;
  color: #e53e3e;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  color: #c53030;
  transform: scale(1.1);
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  color: #a0aec0;
  font-size: 0.8rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .streak-card {
    flex-direction: column;
    padding: 1.5rem;
    text-align: center;
  }
  
  .streak-main {
    margin-bottom: 1.5rem;
  }
  
  .streak-number {
    font-size: 2.5rem;
  }
  
  .streak-stats {
    justify-content: center;
    gap: 2rem;
  }
  
  .stat-divider {
    height: 1.5rem;
  }
  
  .form-card {
    padding: 2rem 1.5rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .streak-card {
    padding: 1.25rem;
  }
  
  .streak-number {
    font-size: 2rem;
  }
  
  .streak-stats {
    gap: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .form-card {
    padding: 1.5rem 1rem;
  }
  
  .content-wrapper {
    padding: 1.5rem 1rem !important;
    border-radius: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
