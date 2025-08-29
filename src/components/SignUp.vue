<template>
  <div class="login-container">
    <MainHeader @navigate-to-home="goToHome" />
    
    <main class="login-content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="login-form-container">
              <div class="login-form">
                <div class="user-icon-large">👤</div>
                <h2>Create an account</h2>
                <p class="login-subtitle">
                  Already have an account? <a href="#" @click.prevent="switchToLogin" class="login-link">Log in</a>
                </p>
                
                <form @submit.prevent="submitForm">
                  <div class="row">
                    <div class="col-12 col-sm-6">
                      <div class="form-group">
                        <label for="firstName">First name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          v-model="formData.firstName"
                          @blur="() => validateFirstName(true)"
                          @input="() => validateFirstName(false)"
                          required
                        >
                        <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="form-group">
                        <label for="lastName">Last name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          v-model="formData.lastName"
                          @blur="() => validateLastName(true)"
                          @input="() => validateLastName(false)"
                          required
                        >
                        <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="email">Email address</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="formData.email"
                      @blur="() => validateEmail(true)"
                      @input="() => validateEmail(false)"
                      required
                    >
                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                  </div>
                  
                  <div class="row">
                    <div class="col-12 col-sm-6">
                      <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                          :type="showPassword ? 'text' : 'password'" 
                          id="password" 
                          v-model="formData.password"
                          @blur="() => validatePassword(true)"
                          @input="() => validatePassword(false)"
                          required
                        >
                        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="form-group">
                        <label for="confirmPassword">Confirm your password</label>
                        <input 
                          :type="showPassword ? 'text' : 'password'" 
                          id="confirmPassword" 
                          v-model="formData.confirmPassword"
                          @blur="() => validateConfirmPassword(true)"
                          @input="() => validateConfirmPassword(false)"
                          required
                        >
                        <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p class="password-requirement">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
                  
                  <div class="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="showPassword" 
                      v-model="showPassword"
                    >
                    <label for="showPassword">Show password</label>
                  </div>
                  
                  <div class="form-actions">
                    <button type="submit" class="create-account-btn">Create an account</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainHeader from './MainHeader.vue'

const { emit } = defineEmits(['navigate-to-home', 'navigate-to-login'])

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)

const errors = ref({
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  confirmPassword: null
})

const validateFirstName = (blur) => {
  if (formData.value.firstName.length < 3) {
    if (blur) errors.value.firstName = "First name must be at least 3 characters"
  } else {
    errors.value.firstName = null
  }
}

const validateLastName = (blur) => {
  if (formData.value.lastName.length < 3) {
    if (blur) errors.value.lastName = "Last name must be at least 3 characters"
  } else {
    errors.value.lastName = null
  }
}

const validateEmail = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email) {
    if (blur) errors.value.email = "Email address is required"
  } else if (!emailRegex.test(formData.value.email)) {
    if (blur) errors.value.email = "Please enter a valid email address"
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUpperCase) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter"
  } else if (!hasLowerCase) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter"
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Password must contain at least one number"
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Password must contain at least one special character"
  } else {
    errors.value.password = null
  }
  
  if (formData.value.confirmPassword) {
    validateConfirmPassword(false)
  }
}

const validateConfirmPassword = (blur) => {
  if (!formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = "Please confirm your password"
  } else if (formData.value.confirmPassword !== formData.value.password) {
    if (blur) errors.value.confirmPassword = "Passwords do not match"
  } else {
    errors.value.confirmPassword = null
  }
}

const submitForm = () => {
  validateFirstName(true)
  validateLastName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  
  if (!errors.value.firstName && !errors.value.lastName && !errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    alert('Account Created!')
    clearForm()
  }
}

const clearForm = () => {
  formData.value.firstName = ''
  formData.value.lastName = ''
  formData.value.email = ''
  formData.value.password = ''
  formData.value.confirmPassword = ''
}

const goToHome = () => {
  emit('navigate-to-home')
}

const switchToLogin = () => {
  emit('navigate-to-login')
}
</script>

<style scoped>
.login-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.login-form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  min-height: 600px;
}

.login-form {
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.user-icon-large {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.login-form h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.login-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.login-link {
  color: #007bff;
  text-decoration: underline;
}

.login-link:hover {
  color: #0056b3;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-group input.error {
  border-color: #dc3545;
}

.password-requirement {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.checkbox-group label {
  margin: 0;
  color: #333;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.create-account-btn {
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-account-btn:hover {
  background-color: #bbb;
}

.create-account-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
</style>
