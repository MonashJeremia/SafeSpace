<template>
  <div class="main-container">
    <MainHeader @navigate-to-login="handleNavigateToLogin" />
    
    <main class="content">
      <div class="content-wrapper">
        <h1 class="main-heading">This is your SafeSpace</h1>
      </div>
      <div class="contact">Contact us</div>
    </main>
  </div>
</template>

<script>
import MainHeader from './MainHeader.vue'

export default {
  name: 'Main',
  components: {
    MainHeader
  },
  methods: {
    handleNavigateToLogin() {
      this.$emit('navigate-to-login');
    }
  }
}
</script>

<style scoped>
.main-container {
  font-family: Arial, sans-serif;
  position: relative;
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
}

.main-heading {
  font-size: 4rem;
  font-weight: bold;
  margin: 4rem 0 2rem 0;
  color: #000;
  word-wrap: break-word;
}

.contact {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.contact:hover {
  color: #007bff;
}
</style>
