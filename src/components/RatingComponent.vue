<template>
  <div class="rating-component">
    <h3>Rate this guide</h3>
    
    <!-- Star Rating -->
    <div class="stars">
      <span 
        v-for="star in 5" 
        :key="star"
        class="star"
        :class="{ 'filled': star <= userRating }"
        @click="setRating(star)"
      >
        ★
      </span>
    </div>

    <!-- Simple Stats -->
    <div class="stats">
      <p>Average: {{ averageRating }} stars ({{ totalRatings }} ratings)</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'RatingComponent',
  props: {
    guideId: String
  },
  setup(props) {
    const userRating = ref(0)
    const ratings = ref([])

    const averageRating = computed(() => {
      if (ratings.value.length === 0) return 0
      const sum = ratings.value.reduce((a, b) => a + b, 0)
      return (sum / ratings.value.length).toFixed(1)
    })

    const totalRatings = computed(() => ratings.value.length)

    const setRating = (rating) => {
      userRating.value = rating
      ratings.value.push(rating)
      
      // Save to localStorage
      const key = `ratings_${props.guideId}`
      localStorage.setItem(key, JSON.stringify(ratings.value))
    }

    onMounted(() => {
      // Load ratings from localStorage
      const key = `ratings_${props.guideId}`
      const saved = localStorage.getItem(key)
      if (saved) {
        ratings.value = JSON.parse(saved)
      }
    })

    return {
      userRating,
      averageRating,
      totalRatings,
      setRating
    }
  }
}
</script>

<style scoped>
.rating-component {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
}

.rating-component h3 {
  color: #212529;
  margin-bottom: 1rem;
}

.stars {
  margin: 1rem 0;
}

.star {
  font-size: 2rem;
  color: #dee2e6;
  cursor: pointer;
  margin: 0 0.2rem;
}

.star.filled {
  color: #ffc107;
}

.stats p {
  color: #6c757d;
  margin: 0;
}
</style>
