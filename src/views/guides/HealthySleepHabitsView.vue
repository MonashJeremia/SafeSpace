<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper">
              <div class="page-header text-center mb-4">
                <div class="header-icon mb-3">😴</div>
                <h1 class="page-title">Building Healthy Sleep Habits</h1>
                <p class="page-subtitle">Develop better sleep routines for improved mental health</p>
              </div>

              <!-- Sleep Tips Section -->
              <div class="content-section">
                <h2 class="section-title">Essential Sleep Tips</h2>
                
                <div class="text-content">
                  <p><strong>Create a Sleep Schedule:</strong> Go to bed and wake up at the same time every day, even on weekends.</p>
                  
                  <p><strong>Prepare Your Environment:</strong> Keep your bedroom cool, dark, and quiet. Use blackout curtains if needed.</p>
                  
                  <p><strong>Wind Down Routine:</strong> Start relaxing 1 hour before bed. Avoid screens and bright lights.</p>
                  
                  <p><strong>Watch Your Diet:</strong> Avoid caffeine 6 hours before bed and large meals 3 hours before sleep.</p>
                  
                  <p><strong>Stay Active:</strong> Regular exercise during the day helps you sleep better at night.</p>
                  
                  <p><strong>Manage Stress:</strong> Practice relaxation techniques like deep breathing or gentle stretching.</p>
                  
                  <p><strong>If You Can't Sleep:</strong> Don't lie awake for more than 20 minutes. Get up and do a quiet activity until you feel sleepy.</p>
                </div>
              </div>

              <!-- Quick Facts -->
              <div class="facts-section mt-4">
                <h3 class="facts-title">Sleep Facts</h3>
                <div class="facts-content">
                  <p>• Adults need 7-9 hours of sleep per night</p>
                  <p>• Poor sleep affects mood, memory, and immune system</p>
                  <p>• Good sleep improves mental health and reduces anxiety</p>
                  <p>• It takes about 2 weeks to establish a new sleep routine</p>
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
import MainHeader from '../../components/MainHeader.vue'

export default {
  name: 'HealthySleepHabitsView',
  components: {
    MainHeader
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
  padding: 3rem 2.5rem;
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

.section-title {
  color: #212529;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.content-section {
  margin: 2rem 0;
}

.text-content {
  line-height: 1.8;
}

.text-content p {
  margin-bottom: 1.5rem;
  color: #495057;
  font-size: 1.1rem;
}

.text-content strong {
  color: #212529;
  font-weight: 600;
}

.facts-section {
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 1.5rem;
  border-radius: 8px;
}

.facts-title {
  color: #212529;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.facts-content p {
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
