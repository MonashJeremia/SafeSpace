<template>
  <div class="interactive-tools-container">
    <MainHeader />
    
    <main class="tools-content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper">
              <div class="row g-4">
                <!-- Step-by-Step Guides Section -->
                <div class="col-12 col-lg-6">
                  <div class="tools-section">
                    <div class="section-header">
                      <div class="section-icon">📋</div>
                      <h2 class="section-title">Step-by-Step Guides</h2>
                    </div>
                    
                    <div class="guides-list">
                      <div class="guide-item">
                        <button class="guide-btn" @click="openGuide('coping-negative-thoughts')">
                          Coping with Negative Thoughts
                        </button>
                      </div>
                      
                      <div class="guide-item">
                        <button class="guide-btn" @click="openGuide('healthy-sleep-habits')">
                          Building Healthy Sleep Habits
                        </button>
                      </div>
                      
                      <div class="guide-item">
                        <button class="guide-btn" @click="openGuide('managing-stress')">
                          Managing Stress
                        </button>
                      </div>
                      
                      <div class="guide-item">
                        <button class="guide-btn" @click="openGuide('coping-negative-thoughts-2')">
                          Coping with Negative Thoughts
                        </button>
                      </div>
                      
                      <div class="guide-item">
                        <button class="guide-btn" @click="openGuide('daily-positivity')">
                          Daily Positivity Challenge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Daily Challenge Section -->
                <div class="col-12 col-lg-6">
                  <div class="tools-section">
                    <div class="section-header">
                      <div class="section-icon">⭐</div>
                      <h2 class="section-title">Daily Challenge !</h2>
                    </div>
                    
                    <div class="challenge-card">
                      <div class="challenge-content">
                        <div class="challenge-text">
                          <p>{{ dailyChallenge.text }}</p>
                        </div>
                        
                        <div class="challenge-actions">
                          <button 
                            class="btn challenge-complete-btn" 
                            @click="completeChallenge"
                            :disabled="challengeCompleted"
                          >
                            {{ challengeCompleted ? '✅ Completed!' : 'Mark as Complete' }}
                          </button>
                          
                          <button 
                            class="btn challenge-new-btn" 
                            @click="generateNewChallenge"
                          >
                            New Challenge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
import { ref, onMounted } from 'vue'
import MainHeader from '../components/MainHeader.vue'

export default {
  name: 'InteractiveToolsView',
  components: {
    MainHeader
  },
  setup() {
    const challengeCompleted = ref(false)
    const dailyChallenge = ref({
      text: "Write down three things you're grateful for today and share one with someone you care about."
    })
    
    const challenges = [
      "Write down three things you're grateful for today and share one with someone you care about.",
      "Take a 10-minute walk outside and notice five beautiful things around you.",
      "Send a kind message to someone who has made a difference in your life.",
      "Practice deep breathing for 5 minutes and focus on the present moment.",
      "Do something creative for 15 minutes - draw, write, or make something with your hands.",
      "Help someone today, even if it's just a small gesture of kindness.",
      "Spend 10 minutes in nature and practice mindful observation.",
      "Write a positive affirmation and repeat it to yourself throughout the day.",
      "Listen to uplifting music and dance or move your body for 5 minutes.",
      "Reach out to someone you haven't talked to in a while and check in on them."
    ]
    
    const completeChallenge = () => {
      challengeCompleted.value = true
      // Save completion status to localStorage
      const today = new Date().toDateString()
      localStorage.setItem(`challenge_completed_${today}`, 'true')
    }
    
    const generateNewChallenge = () => {
      const randomIndex = Math.floor(Math.random() * challenges.length)
      dailyChallenge.value.text = challenges[randomIndex]
      challengeCompleted.value = false
      // Clear completion status for new challenge
      const today = new Date().toDateString()
      localStorage.removeItem(`challenge_completed_${today}`)
    }
    
    const openGuide = (guideId) => {
      // Placeholder for opening specific guides
      console.log(`Opening guide: ${guideId}`)
      alert(`Opening ${guideId} guide - This would navigate to a detailed guide page`)
    }
    
    // Check if challenge was already completed today
    onMounted(() => {
      const today = new Date().toDateString()
      const completed = localStorage.getItem(`challenge_completed_${today}`)
      if (completed) {
        challengeCompleted.value = true
      }
    })
    
    return {
      challengeCompleted,
      dailyChallenge,
      completeChallenge,
      generateNewChallenge,
      openGuide
    }
  }
}
</script>

<style scoped>
.interactive-tools-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.tools-content {
  padding-top: 2rem;
}

.content-wrapper {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2.5rem;
}

.tools-section {
  height: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.section-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.guides-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guide-item {
  width: 100%;
}

.guide-btn {
  width: 100%;
  background-color: #e9ecef;
  border: 2px solid #dee2e6;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 0.95rem;
}

.guide-btn:hover {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  transform: translateY(-2px);
}



.challenge-card {
  background-color: transparent;
  border: none;
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
}

.challenge-content {
  width: 100%;
}

.challenge-text {
  margin-bottom: 1.5rem;
}

.challenge-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #495057;
  margin: 0;
  font-style: italic;
}

.challenge-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.challenge-complete-btn {
  background-color: #28a745;
  border: 2px solid #28a745;
  color: white;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.challenge-complete-btn:hover:not(:disabled) {
  background-color: #218838;
  border-color: #218838;
}

.challenge-complete-btn:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.challenge-new-btn {
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.challenge-new-btn:hover {
  background-color: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
  }
  
  .section-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .challenge-actions {
    flex-direction: column;
  }
}
</style>
