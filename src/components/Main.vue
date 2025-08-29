<template>
  <div class="main-container">
    <MainHeader @navigate-to-signup="handleNavigateToSignUp" />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8 col-xl-6">
            <div class="content-wrapper text-center">
              <h1 class="main-heading display-4 display-sm-3 display-md-2 display-lg-1">This is your SafeSpace</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="contact position-fixed bottom-0 start-0 m-2 m-sm-3 m-lg-4 fs-6 fs-sm-5">Contact us</div>
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
    handleNavigateToSignUp() {
      this.$emit('navigate-to-signup');
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
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
  justify-content: center;
}

.content-wrapper {
  width: 100%;
}

.main-heading {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 2rem 0;
  color: #000;
  word-wrap: break-word;
  line-height: 1.2;
}

.contact {
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
  z-index: 10;
}

.contact:hover {
  color: #007bff;
}
</style>
