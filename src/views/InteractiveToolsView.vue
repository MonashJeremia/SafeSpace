<template>
  <div class="interactive-tools-container">
    <MainHeader />

    <main id="main-content" class="tools-content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4" role="main">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-5">
              <h1 class="sr-only">Interactive Mental Health Tools and Guides</h1>
              <div class="row g-4">
                <!-- Step-by-Step Guides Section -->
                <div class="col-12 col-lg-6">
                  <div class="tools-section" role="region" aria-labelledby="guides-heading">
                    <div
                      class="section-header d-flex flex-column flex-md-row align-items-center text-center text-md-start"
                    >
                      <div class="section-icon me-0 me-md-3 mb-2 mb-md-0" aria-hidden="true">
                        📋
                      </div>
                      <h2 id="guides-heading" class="section-title">Step-by-Step Guides</h2>
                    </div>

                    <nav class="guides-list" aria-label="Step-by-step guides navigation">
                      <div class="guide-item">
                        <button
                          class="guide-btn"
                          @click="openGuide('wellbeing-map')"
                          aria-label="Open Wellbeing Map guide"
                        >
                          Wellbeing Map
                        </button>
                      </div>

                      <div class="guide-item">
                        <button
                          class="guide-btn"
                          @click="openGuide('healthy-sleep-habits')"
                          aria-label="Open Building Healthy Sleep Habits guide"
                        >
                          Building Healthy Sleep Habits
                        </button>
                      </div>

                      <div class="guide-item">
                        <button
                          class="guide-btn"
                          @click="openGuide('managing-stress')"
                          aria-label="Open Managing Stress guide"
                        >
                          Managing Stress
                        </button>
                      </div>

                      <div class="guide-item">
                        <button
                          class="guide-btn"
                          @click="openGuide('daily-positivity')"
                          aria-label="Open Daily Positivity Message guide"
                        >
                          Daily Positivity Message
                        </button>
                      </div>

                      <div class="guide-item">
                        <button
                          class="guide-btn"
                          @click="openGuide('mindful-reading')"
                          aria-label="Open Mindful Reading guide"
                        >
                          Mindful Reading
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>

                <!-- Daily Challenge Section -->
                <div class="col-12 col-lg-6">
                  <div class="tools-section">
                    <div
                      class="section-header d-flex flex-column flex-md-row align-items-center text-center text-md-start"
                    >
                      <div class="section-icon me-0 me-md-3 mb-2 mb-md-0">
                        ⭐
                      </div>
                      <h2 class="section-title">Daily Challenge !</h2>
                    </div>

                    <div class="challenge-card">
                      <div class="challenge-content">
                        <div class="challenge-text">
                          <p>{{ dailyChallenge.text }}</p>
                        </div>

                        <div
                          class="challenge-actions d-flex flex-column flex-md-row gap-3"
                        >
                          <button
                            class="btn challenge-complete-btn"
                            @click="completeChallenge"
                            :disabled="challengeCompleted"
                          >
                            {{
                              challengeCompleted
                                ? "✅ Completed!"
                                : "Mark as Complete"
                            }}
                          </button>

                          <button
                            class="btn challenge-new-btn"
                            @click="generateNewChallenge"
                            :disabled="loading"
                          >
                            {{ loading ? 'Loading...' : 'New Challenge' }}
                          </button>
                        </div>
                        <div v-if="fetchError" class="mt-2 text-danger">{{ fetchError }}</div>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainHeader from "../components/MainHeader.vue";

export default {
  name: "InteractiveToolsView",
  components: {
    MainHeader,
  },
  setup() {
    const router = useRouter();
    const challengeCompleted = ref(false);
    const dailyChallenge = ref({
      text: "Loading your daily challenge...",
    });

    // Track API request state
    const loading = ref(false);
    const fetchError = ref(null);

    // Gemini API configuration from environment variables
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
    const MODEL_NAME = 'gemini-2.0-flash-001';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    /**
     * Fetch daily challenge from Gemini AI API
     * Generates a short positivity challenge using AI
     * Returns cleaned text string or throws error
     */
    const fetchGeminiChallenge = async () => {
      // Validate API key exists before making request
      if (!GEMINI_API_KEY) {
        throw new Error('API key not configured');
      }

      // Prompt for AI to generate positivity challenge
      const prompt = "Generate a short, actionable daily positivity challenge that can be done in 5-15 minutes. Focus on gratitude, mindfulness, kindness, creativity, or connection. Make it one sentence only.";
      
      try {
        // Make POST request to Gemini API
        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 50,
              topP: 0.8,
              topK: 40
            }
          }),
        });

        const responseText = await response.text();

        // Check for HTTP errors
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = JSON.parse(responseText);
        // Parse nested Gemini response structure
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
          const text = data.candidates[0].content.parts[0].text;
          // Strip markdown formatting from AI response
          const cleanedText = text.replace(/^[*#>\s-]+|[\n\r]+.*$/g, '').trim();
          return cleanedText || "Take a moment to practice deep breathing and feel gratitude for this present moment.";
        }
        
        throw new Error("Invalid response format from Gemini API");
      } catch (error) {
        throw error;
      }
    };

    /**
     * Mark challenge as completed for today
     * Saves completion status to localStorage with today's date
     */
    const completeChallenge = () => {
      challengeCompleted.value = true;
      const today = new Date().toDateString();
      localStorage.setItem(`challenge_completed_${today}`, "true");
    };

    /**
     * Generate and display a new challenge
     * Resets completion status and fetches from API
     */
    const generateNewChallenge = async () => {
      challengeCompleted.value = false;
      const today = new Date().toDateString();
      localStorage.removeItem(`challenge_completed_${today}`);

      loading.value = true;
      fetchError.value = null;
      
      try {
        const newText = await fetchGeminiChallenge();
        dailyChallenge.value.text = newText;
      } catch (err) {
        fetchError.value = "Unable to generate a new challenge. Please check your internet connection and try again.";
        dailyChallenge.value.text = "Challenge generation unavailable. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    /**
     * Navigate to specified guide page
     * Maps guide IDs to their corresponding routes
     */
    const openGuide = (guideId) => {
      const routeMap = {
        "wellbeing-map": "/guides/wellbeing-map",
        "healthy-sleep-habits": "/guides/healthy-sleep-habits",
        "managing-stress": "/guides/managing-stress",
        "daily-positivity": "/guides/daily-positivity",
        "mindful-reading": "/guides/mindful-reading",
      };

      const routePath = routeMap[guideId];
      if (routePath) {
        router.push(routePath);
      }
    };

    // Check completion state and load initial challenge
    onMounted(async () => {
      // Check if challenge was already completed today
      const today = new Date().toDateString();
      const completed = localStorage.getItem(`challenge_completed_${today}`);
      if (completed) {
        challengeCompleted.value = true;
      }

      // Fetch initial challenge from AI
      loading.value = true;
      try {
        const initialText = await fetchGeminiChallenge();
        dailyChallenge.value.text = initialText;
      } catch (err) {
        fetchError.value = "Unable to load daily challenge. Please check your internet connection.";
        dailyChallenge.value.text = "Challenge generation unavailable. Click 'New Challenge' to try again.";
      } finally {
        loading.value = false;
      }
    });

      return {
      challengeCompleted,
      dailyChallenge,
      completeChallenge,
      generateNewChallenge,
      openGuide,
      loading,
      fetchError,
    };
  },
};
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
}

.tools-section {
  height: 100%;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.section-icon {
  font-size: 2rem;
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
  margin-top: 1rem;
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
</style>
