<script setup>
import { ref } from 'vue'
import Main from './components/Main.vue'
import SignUp from './components/SignUp.vue'
import Login from './components/Login.vue'

const currentView = ref('main')

const navigateToLogin = () => {
  currentView.value = 'login'
}

const navigateToSignUp = () => {
  currentView.value = 'signup'
}

const navigateToHome = () => {
  currentView.value = 'main'
}
</script>

<template>
  <div id="app" class="w-100">
    <Main 
      v-if="currentView === 'main'" 
      @navigate-to-signup="navigateToSignUp"
    />
    <SignUp 
      v-if="currentView === 'signup'" 
      @navigate-to-home="navigateToHome"
      @navigate-to-login="navigateToLogin"
    />
    <Login 
      v-if="currentView === 'login'" 
      @navigate-to-home="navigateToHome"
      @navigate-to-signup="navigateToSignUp"
    />
  </div>
</template>

<style scoped></style>
