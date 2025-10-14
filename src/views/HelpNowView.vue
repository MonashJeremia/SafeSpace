<template>
  <div class="help-now-container">
    <MainHeader />
    
    <main id="main-content" class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4" role="main">
      <div class="container-fluid px-3">
        <div class="row">
          <div class="col-12 col-lg-10">
            <div class="content-wrapper">
              <h1 class="main-heading fs-2 fs-sm-1 mb-3 mb-sm-4 mb-md-5">Crisis Hotlines</h1>
              <p class="sr-only">Access 24/7 crisis hotlines and mental health support services. Filter by category to find the help you need.</p>
              
              <!-- Category Filter Dropdown -->
              <div class="filter-section mb-3 mb-sm-4">
                <div class="dropdown category-dropdown col-8 col-sm-6 col-md-4 col-lg-3">
                  <label for="category-filter" class="sr-only">Filter hotlines by category</label>
                  <select 
                    id="category-filter"
                    v-model="selectedCategory" 
                    class="form-select category-select w-100"
                    aria-label="Filter hotlines by category"
                  >
                    <option value="">All Categories</option>
                    <option v-for="category in uniqueCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>
              
              <!-- Hotlines List -->
              <div class="hotlines-container" role="region" aria-label="Crisis hotline listings">
                <div class="row">
                  <div class="col-12">
                    <div 
                      v-for="hotline in filteredHotlines" 
                      :key="hotline.name"
                      class="hotline-card mb-4 mb-sm-5"
                      role="article"
                      :aria-label="`${hotline.name} hotline information`"
                    >
                      <div class="card-inner p-3 p-sm-4 p-md-5">
                        <div class="row align-items-start g-3 g-sm-4 g-md-5">
                          <div class="col-12 col-md-6 col-lg-3">
                            <div class="info-section category-section mb-3 mb-md-0">
                              <div class="section-label fs-7 fs-sm-6">Category</div>
                              <div class="category-value fs-5 fs-sm-4 fs-md-3">{{ hotline.category }}</div>
                            </div>
                          </div>
                          <div class="col-12 col-md-6 col-lg-3">
                            <div class="info-section name-section mb-3 mb-md-0">
                              <div class="section-label fs-7 fs-sm-6">Service</div>
                              <div class="name-value fs-5 fs-sm-4 fs-md-3">{{ hotline.name }}</div>
                            </div>
                          </div>
                          <div class="col-12 col-md-6 col-lg-3">
                            <div class="info-section phone-section mb-3 mb-md-0">
                              <div class="section-label fs-7 fs-sm-6">Phone</div>
                              <a :href="`tel:${hotline.phone}`" class="phone-value fs-5 fs-sm-4 fs-md-3" :aria-label="`Call ${hotline.name} at ${hotline.phone}`">{{ hotline.phone }}</a>
                            </div>
                          </div>
                          <div class="col-12 col-md-6 col-lg-3">
                            <div class="info-section hours-section mb-3 mb-md-0">
                              <div class="section-label fs-7 fs-sm-6">Hours</div>
                              <div class="hours-value fs-6 fs-sm-5 fs-md-4">{{ hotline.hours }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- No results message -->
                    <div v-if="filteredHotlines.length === 0" class="no-results py-4 py-sm-5">
                      <p class="text-muted fs-5 fs-sm-4">No hotlines found for the selected category.</p>
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
import MainHeader from '../components/MainHeader.vue'
import hotlinesData from '../json/Hotlines.json'

export default {
  name: 'HelpNowView',
  components: {
    MainHeader
  },
  data() {
    return {
      hotlines: hotlinesData.hotlines,
      selectedCategory: ''
    }
  },
  computed: {
    uniqueCategories() {
      return [...new Set(this.hotlines.map(hotline => hotline.category))].sort()
    },
    filteredHotlines() {
      if (this.selectedCategory === '') {
        return this.hotlines
      } else {
        return this.hotlines.filter(hotline => hotline.category === this.selectedCategory)
      }
    }
  }
}
</script>

<style scoped>
.help-now-container {
  font-family: Arial, sans-serif;
  position: relative;
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
}

.main-heading {
  font-weight: bold;
  color: #000;
  word-wrap: break-word;
  line-height: 1.2;
}

.filter-section {
  margin-bottom: 2rem;
}

.category-select {
  border: 2px solid #007bff;
  border-radius: 25px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-select:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: 0;
}

.category-select:hover {
  border-color: #0056b3;
}

.hotlines-container {
  width: 100%;
}

.hotline-card {
  background-color: white;
  border: 3px solid #e0e0e0;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow: hidden;
}

.hotline-card:hover {
  border-color: #007bff;
  box-shadow: 0 10px 24px rgba(0, 123, 255, 0.15);
  transform: translateY(-3px);
}

.card-inner {
  padding: 2rem 2.5rem;
  min-height: 140px;
}

.card-inner {
  min-height: 140px;
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  min-height: 80px;
}

.section-label {
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.8px;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.category-value {
  color: #007bff;
  font-weight: bold;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.name-value {
  color: #333;
  font-weight: bold;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.phone-value {
  color: #28a745;
  font-weight: 600;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-line;
}

.hours-value {
  color: #666;
  font-weight: 500;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-line;
}

.no-results {
  text-align: center;
  color: #666;
  padding: 3rem 2rem;
}

.contact {
  color: #666;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;
  z-index: 10;
}

.contact:hover {
  color: #007bff;
}
</style>
