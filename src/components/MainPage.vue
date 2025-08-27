<template>
  <div class="main-container">
    <MainPageHeader />
    
    <main class="content">
      <h1 class="main-heading">This is your SafeSpace</h1>
      <div class="contact">Contact us</div>
    </main>
  </div>
</template>

<script>
import MainPageHeader from './MainPageHeader.vue'

export default {
  name: 'MainPage',
  components: {
    MainPageHeader
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
  text-align: center;
  padding: 4rem 2rem;
}

.main-heading {
  font-size: 4rem;
  font-weight: bold;
  margin: 4rem 0 2rem 0;
  color: #000;
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