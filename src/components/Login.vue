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
                <h2>Login to your account</h2>
                <p class="login-subtitle">
                  Don't have an account? <a href="#" @click.prevent="switchToSignUp" class="login-link">Sign up</a>
                </p>
                
                <form @submit.prevent="handleSubmit">
                  <div class="form-group">
                    <label for="email">Email address</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="email"
                      @blur="() => validateEmail(true)"
                      @input="() => validateEmail(false)"
                      required
                    >
                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                  </div>
                  
                  <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      v-model="password"
                      @blur="() => validatePassword(true)"
                      @input="() => validatePassword(false)"
                      required
                    >
                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                  </div>
                  
                  <div class="row">
                    <div class="col-12 col-sm-6">
                      <div class="checkbox-group">
                        <input 
                          type="checkbox" 
                          id="showPassword" 
                          v-model="showPassword"
                        >
                        <label for="showPassword">Show password</label>
                      </div>
                    </div>
                    
                    <div class="col-12 col-sm-6">
                      <div class="checkbox-group">
                        <input 
                          type="checkbox" 
                          id="rememberMe" 
                          v-model="rememberMe"
                        >
                        <label for="rememberMe">Remember me</label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="forgot-password">
                    <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">Forgot your password?</a>
                  </div>
                  
                  <div class="form-actions">
                    <button type="submit" class="login-btn">Login</button>
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

<script>
import { ref } from 'vue'
import MainHeader from './MainHeader.vue'

export default {
  name: 'Login',
  components: {
    MainHeader
  },
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)

    const errors = ref({
      email: null,
      password: null
    })

    const validateEmail = (blur) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.value) {
        if (blur) errors.value.email = "Email address is required"
      } else if (!emailRegex.test(email.value)) {
        if (blur) errors.value.email = "Please enter a valid email address"
      } else {
        errors.value.email = null
      }
    }

    const validatePassword = (blur) => {
      if (!password.value) {
        if (blur) errors.value.password = "Password is required"
      } else if (password.value.length < 6) {
        if (blur) errors.value.password = "Password must be at least 6 characters long"
      } else {
        errors.value.password = null
      }
    }

    const goToHome = () => {
      emit('navigate-to-home')
    }

    const switchToSignUp = () => {
      emit('navigate-to-signup')
      console.log('Switching to sign up mode')
    }

    const handleForgotPassword = () => {
      alert('Forgot password functionality would be implemented here')
      console.log('Forgot password clicked')
    }

    const handleSubmit = () => {
      // Validate all fields
      validateEmail(true)
      validatePassword(true)

      // Check if there are any errors
      const hasErrors = Object.values(errors.value).some(error => error !== null)

      if (!hasErrors) {
        // Handle successful login submission
        console.log('Login submitted successfully:', {
          email: email.value,
          password: password.value,
          rememberMe: rememberMe.value
        })
        
        alert('Login successful! (This is just a demo)')
        
        // Clear form after successful submission
        email.value = ''
        password.value = ''
        rememberMe.value = false
        
        // Clear any remaining errors
        Object.keys(errors.value).forEach(key => {
          errors.value[key] = null
        })
        
        // Optionally navigate back to home after successful login
        goToHome()
      } else {
        console.log('Login form has validation errors')
      }
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      errors,
      validateEmail,
      validatePassword,
      goToHome,
      switchToSignUp,
      handleForgotPassword,
      handleSubmit
    }
  }
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
  min-height: 500px;
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
  margin-bottom: 1.5rem;
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.checkbox-group label {
  margin: 0;
  color: #333;
  cursor: pointer;
  font-size: 0.9rem;
}

.forgot-password {
  text-align: center;
  margin-bottom: 2rem;
}

.forgot-link {
  color: #007bff;
  text-decoration: underline;
  font-size: 0.9rem;
}

.forgot-link:hover {
  color: #0056b3;
}

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.login-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #0056b3;
}

.login-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
</style>