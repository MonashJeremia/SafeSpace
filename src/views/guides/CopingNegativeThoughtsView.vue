<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-5">
              <div class="page-header text-center">
                <div class="header-icon mb-3">🧠</div>
                <h1 class="page-title">Coping with Negative Thoughts</h1>
                <p class="page-subtitle">Learn strategies to manage and overcome negative thinking patterns</p>
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
  name: 'CopingNegativeThoughtsView',
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


</style>
