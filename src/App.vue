<script setup>
import { ref } from 'vue'
import Main from './components/Main.vue'
import Login from './components/Login.vue'

const currentView = ref('main')

const navigateToLogin = () => {
  currentView.value = 'login'
}

const navigateToHome = () => {
  currentView.value = 'main'
}
</script>

<template>
  <div id="app">
    <Main 
      v-if="currentView === 'main'" 
      @navigate-to-login="navigateToLogin"
    />
    <Login 
      v-if="currentView === 'login'" 
      @navigate-to-home="navigateToHome"
    />
  </div>
</template>

<style scoped></style>
