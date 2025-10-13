<template>
  <div class="main-container">
    <MainHeader />

    <main class="content py-4 py-sm-5 px-3 px-sm-4">
      <div class="container">
        <!-- Page Title -->
        <div class="row justify-content-center mb-5">
          <div class="col-12 col-lg-10">
            <h1 class="page-title text-center mb-3">About SafeSpace</h1>
            <p class="lead text-center text-muted">
              A mental health support platform dedicated to helping youth, educators, and communities
            </p>
          </div>
        </div>

        <!-- Our Story Section -->
        <div class="row justify-content-center mb-5">
          <div class="col-12 col-lg-10">
            <div class="section-card">
              <h2 class="section-title">Our Story</h2>
              <p>
                SafeSpace was created with a mission to provide accessible mental health resources and support
                for young people and the communities that care for them. We believe that everyone deserves
                a safe space to learn, grow, and find the support they need.
              </p>
              <p>
                Through interactive tools, educational resources, and a supportive community, we're working
                to break down barriers to mental health care and create a more understanding, compassionate world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import MainHeader from "../components/MainHeader.vue";

export default {
  name: "AboutUsView",
  components: {
    MainHeader,
  },
};
</script>

<style scoped>
.main-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.25rem;
  line-height: 1.6;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.section-card p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
}

.hero-image-container {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  max-height: 400px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
