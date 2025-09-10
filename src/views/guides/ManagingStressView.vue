<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-5">
              <div class="page-header text-center mb-4">
                <div class="header-icon mb-3">🌊</div>
                <h1 class="page-title">Managing Stress</h1>
                <p class="page-subtitle">Effective techniques to reduce and manage everyday stress</p>
              </div>

              <!-- Quick Stress Relief -->
              <div class="content-section">
                <h2 class="section-title">Quick Stress Relief (5 minutes or less)</h2>
                
                <div class="text-content">
                  <p><strong>Deep Breathing:</strong> Take 5 slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.</p>
                  
                  <p><strong>Progressive Muscle Relaxation:</strong> Tense and release different muscle groups, starting with your toes and working up.</p>
                  
                  <p><strong>5-4-3-2-1 Technique:</strong> Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.</p>
                  
                  <p><strong>Take a Walk:</strong> Even a 2-minute walk can help clear your mind and reduce stress.</p>
                </div>
              </div>

              <!-- Long-term Strategies -->
              <div class="content-section">
                <h2 class="section-title">Long-term Stress Management</h2>
                
                <div class="text-content">
                  <p><strong>Regular Exercise:</strong> Physical activity reduces stress hormones and releases mood-boosting endorphins.</p>
                  
                  <p><strong>Healthy Boundaries:</strong> Learn to say no to commitments that cause unnecessary stress.</p>
                  
                  <p><strong>Time Management:</strong> Break large tasks into smaller steps and prioritize what's most important.</p>
                  
                  <p><strong>Social Support:</strong> Talk to friends, family, or a counselor about what's stressing you.</p>
                  
                  <p><strong>Mindfulness Practice:</strong> Spend 10 minutes daily focusing on the present moment.</p>
                  
                  <p><strong>Adequate Sleep:</strong> Aim for 7-9 hours per night to help your body recover from daily stress.</p>
                </div>
              </div>

              <!-- Warning Signs -->
              <div class="warning-section mt-4">
                <h3 class="warning-title">When to Seek Help</h3>
                <div class="warning-content">
                  <p>Contact a healthcare professional if you experience:</p>
                  <p>• Persistent feelings of overwhelm that don't improve</p>
                  <p>• Physical symptoms like headaches, stomach problems, or sleep issues</p>
                  <p>• Difficulty concentrating or making decisions</p>
                  <p>• Using alcohol or substances to cope with stress</p>
                  <p>• Thoughts of self-harm or feeling hopeless</p>
                </div>
              </div>

              <!-- Rating Component -->
              <RatingComponent guideId="managing-stress" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue'
import RatingComponent from '@/components/RatingComponent.vue'

export default {
  name: 'ManagingStressView',
  components: {
    MainHeader,
    RatingComponent
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

.warning-section {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 1.5rem;
  border-radius: 8px;
}

.warning-title {
  color: #856404;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.warning-content p {
  color: #856404;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.warning-content p:first-child {
  font-weight: 600;
  margin-bottom: 1rem;
}


</style>
