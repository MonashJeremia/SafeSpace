<template>
  <div class="login-container">
    <MainHeader />
    
    <main class="login-content py-2 py-sm-3">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 col-xxl-5">
            <div class="login-form-container">
              <div class="login-form p-3 p-sm-4 p-md-5">
                <div class="text-center">
                  <div class="user-icon-large" style="font-size: clamp(2rem, 4vw, 3rem);">👤</div>
                  <h2 class="fs-4 fs-sm-3 fs-md-2">Create an account</h2>
                  <p class="login-subtitle fs-6 fs-sm-5">
                    Already have an account? <router-link to="/login" class="login-link">Log in</router-link>
                  </p>
                </div>
                
                <form @submit.prevent="submitForm">
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="firstName">First name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          class="form-control"
                          v-model="formData.firstName"
                          @blur="() => validateFirstName(true)"
                          @input="() => validateFirstName(false)"
                          required
                        >
                        <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="lastName">Last name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          class="form-control"
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
                      class="form-control"
                      v-model="formData.email"
                      @blur="() => validateEmail(true)"
                      @input="() => validateEmail(false)"
                      required
                    >
                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                  </div>
                  
                  <div class="form-group">
                    <label for="userType">I am a</label>
                    <select 
                      id="userType" 
                      class="form-control"
                      v-model="formData.userType"
                      @blur="() => validateUserType(true)"
                      @change="() => validateUserType(false)"
                      required
                    >
                      <option value="">Please select...</option>
                      <option value="youth">Youth</option>
                      <option value="advisor">Advisor</option>
                    </select>
                    <div v-if="errors.userType" class="error-message">{{ errors.userType }}</div>
                  </div>
                  
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                          :type="showPassword ? 'text' : 'password'" 
                          id="password" 
                          class="form-control"
                          v-model="formData.password"
                          @blur="() => validatePassword(true)"
                          @input="() => validatePassword(false)"
                          required
                        >
                        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="confirmPassword">Confirm your password</label>
                        <input 
                          :type="showPassword ? 'text' : 'password'" 
                          id="confirmPassword" 
                          class="form-control"
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
                  
                  <div class="form-check mb-3">
                    <input 
                      type="checkbox" 
                      id="showPassword" 
                      class="form-check-input"
                      v-model="showPassword"
                    >
                    <label for="showPassword" class="form-check-label">Show password</label>
                  </div>
                  
                  <!-- Registration Error Message -->
                  <div v-if="errors.registration" class="alert alert-danger mb-3" role="alert">
                    {{ errors.registration }}
                  </div>
                  
                  <div class="d-grid">
                    <button type="submit" class="btn create-account-btn">
                      Create an account
                    </button>
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
import { useRouter } from 'vue-router'
import MainHeader from '../components/MainHeader.vue'
import { registerUser } from '../services/authService.js'

const router = useRouter()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: ''
})

const showPassword = ref(false)

const errors = ref({
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  confirmPassword: null,
  userType: null,
  registration: null
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

const validateUserType = (blur) => {
  if (!formData.value.userType) {
    if (blur) errors.value.userType = "Please select your user type"
  } else {
    errors.value.userType = null
  }
}

const submitForm = async () => {
  // Clear previous registration error
  errors.value.registration = null
  
  // Validate all fields
  validateFirstName(true)
  validateLastName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateUserType(true)
  
  // Check if all validations pass
  const hasErrors = errors.value.firstName || errors.value.lastName || 
                   errors.value.email || errors.value.password || 
                   errors.value.confirmPassword || errors.value.userType
  
  if (!hasErrors) {
    try {
      // Register user using auth service
      const newUser = registerUser({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        password: formData.value.password,
        userType: formData.value.userType
      })
      
      // Success - redirect to login with success message
      router.push({ 
        path: '/login', 
        query: { 
          message: 'Account created successfully! Please log in.'
        } 
      })
      
    } catch (error) {
      // Handle registration errors (like duplicate email)
      errors.value.registration = error.message
    }
  }
}

const clearForm = () => {
  formData.value.firstName = ''
  formData.value.lastName = ''
  formData.value.email = ''
  formData.value.password = ''
  formData.value.confirmPassword = ''
  formData.value.userType = ''
}
</script>

<style scoped>
.login-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 1rem 0;
}

.login-form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.login-form {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.user-icon-large {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #6c757d;
}

.login-form h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #212529;
}

.login-subtitle {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.login-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  color: #0b5ed7;
  text-decoration: underline;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #212529;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  padding: 0.75rem;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.password-requirement {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.form-check-input {
  margin-top: 0.1rem;
}

.form-check-label {
  color: #212529;
  font-size: 0.95rem;
  cursor: pointer;
}

.create-account-btn {
  background-color: #6c757d;
  border: 2px solid #6c757d;
  color: white;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  width: 100%;
}

.create-account-btn:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

.create-account-btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
}



.alert {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
