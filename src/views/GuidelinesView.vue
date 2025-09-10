<template>
  <div class="guidelines-container">
    <MainHeader />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-5">
              <!-- Header Section -->
              <div class="page-header text-center mb-5">
                <div class="header-icon mb-3">🤝</div>
                <h1 class="page-title">Guidelines for Supporting Students</h1>
                <p class="page-subtitle">Evidence-based strategies to help students navigate mental health challenges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import MainHeader from '../components/MainHeader.vue'

export default {
  name: 'GuidelinesView',
  components: {
    MainHeader
  }
}
</script>

<style scoped>
.guidelines-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content-wrapper {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 2rem;
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

.quick-card {
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  height: 100%;
  transition: transform 0.3s ease;
}

.quick-card:hover {
  transform: translateY(-3px);
}

.quick-card.warning {
  background-color: #fff3cd;
  border: 2px solid #ffeaa7;
}

.quick-card.support {
  background-color: #d1ecf1;
  border: 2px solid #bee5eb;
}

.quick-card.resources {
  background-color: #d4edda;
  border: 2px solid #c3e6cb;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.quick-card h4 {
  color: #212529;
  margin-bottom: 1rem;
  font-weight: 600;
}

.quick-card p {
  color: #6c757d;
  margin: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.section-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.content-card {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 2rem;
  height: 100%;
}

.content-card h4 {
  color: #212529;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.content-card ul {
  margin: 0;
}

.content-card li {
  margin-bottom: 0.5rem;
  color: #495057;
}

.strategy-item {
  background-color: white;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #007bff;
  height: 100%;
}

.strategy-item strong {
  color: #212529;
  display: block;
  margin-bottom: 0.5rem;
}

.strategy-item p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.protocol-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-card {
  display: flex;
  align-items: flex-start;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.step-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.1);
}

.step-number {
  background-color: #007bff;
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.step-content h4 {
  color: #212529;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.step-content p {
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

.emergency-section {
  background-color: #fff5f5;
  border: 2px solid #fed7d7;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
}

.emergency-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #c53030;
  margin-bottom: 2rem;
}

.emergency-icon {
  font-size: 1.8rem;
  margin-right: 1rem;
}

.contact-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  border: 2px solid #e2e8f0;
}

.contact-card.crisis {
  border-color: #fc8181;
}

.contact-card.text {
  border-color: #68d391;
}

.contact-card.school {
  border-color: #63b3ed;
}

.contact-card.emergency {
  border-color: #f6ad55;
}

.contact-card h5 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
}

.contact-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2b6cb0;
  margin-bottom: 0.5rem;
}

.contact-description {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
}


</style>
