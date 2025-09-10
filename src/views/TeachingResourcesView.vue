<template>
  <div class="teaching-resources-container">
    <MainHeader />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper">
              <!-- Header Section -->
              <div class="page-header text-center mb-5">
                <div class="header-icon mb-3">📚</div>
                <h1 class="page-title">Teaching Resources</h1>
                <p class="page-subtitle">Comprehensive materials to support mental health education in your classroom</p>
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
  name: 'TeachingResourcesView',
  components: {
    MainHeader
  }
}
</script>

<style scoped>
.teaching-resources-container {
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

.resource-card {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.resource-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.resource-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 1rem;
}

.resource-description {
  color: #6c757d;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.resource-items {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  text-align: left;
}

.resource-items li {
  padding: 0.5rem 0;
  color: #495057;
  position: relative;
  padding-left: 1.5rem;
}

.resource-items li:before {
  content: "•";
  color: #007bff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.resource-btn {
  background-color: #007bff;
  border: 2px solid #007bff;
  color: white;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.resource-btn:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.emergency-btn {
  background-color: #dc3545;
  border-color: #dc3545;
}

.emergency-btn:hover {
  background-color: #c82333;
  border-color: #c82333;
}

.info-section {
  border-top: 2px solid #e9ecef;
  padding-top: 2rem;
}

.info-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  margin-bottom: 1rem;
}

.info-card h4 {
  color: #212529;
  margin-bottom: 1rem;
}

.info-card p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.contact-btn, .newsletter-btn {
  background-color: #28a745;
  border: 2px solid #28a745;
  color: white;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-btn:hover, .newsletter-btn:hover {
  background-color: #218838;
  border-color: #218838;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .resource-card {
    padding: 1.5rem;
  }
}
</style>
