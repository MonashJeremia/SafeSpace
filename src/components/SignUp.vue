<template>
  <div class="login-container">
    <MainHeader @navigate-to-home="goToHome" />
    
    <main class="login-content">
      <div class="login-form-container">
        <div class="login-form">
          <div class="user-icon-large">👤</div>
          <h2>Create an account</h2>
          <p class="login-subtitle">
            Already have an account? <a href="#" @click.prevent="switchToLogin" class="login-link">Log in</a>
          </p>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="firstName"
                  @blur="() => validateFirstName(true)"
                  @input="() => validateFirstName(false)"
                  required
                >
                <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
              </div>
              <div class="form-group">
                <label for="lastName">Last name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="lastName"
                  @blur="() => validateLastName(true)"
                  @input="() => validateLastName(false)"
                  required
                >
                <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
              </div>
            </div>
            
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
            
            <div class="form-row">
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
              <div class="form-group">
                <label for="confirmPassword">Confirm your password</label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  @blur="() => validateConfirmPassword(true)"
                  @input="() => validateConfirmPassword(false)"
                  required
                >
                <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
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
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import MainHeader from './MainHeader.vue'

export default {
  name: 'SignUp',
  components: {
    MainHeader
  },
  setup(props, { emit }) {
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const isLoginMode = ref(false)

    const errors = ref({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null
    })

    const validateFirstName = (blur) => {
      if (firstName.value.length < 2) {
        if (blur) errors.value.firstName = "First name must be at least 2 characters"
      } else if (!/^[a-zA-Z\s]+$/.test(firstName.value)) {
        if (blur) errors.value.firstName = "First name can only contain letters and spaces"
      } else {
        errors.value.firstName = null
      }
    }

    const validateLastName = (blur) => {
      if (lastName.value.length < 2) {
        if (blur) errors.value.lastName = "Last name must be at least 2 characters"
      } else if (!/^[a-zA-Z\s]+$/.test(lastName.value)) {
        if (blur) errors.value.lastName = "Last name can only contain letters and spaces"
      } else {
        errors.value.lastName = null
      }
    }

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
      const minLength = 8
      const hasUpperCase = /[A-Z]/.test(password.value)
      const hasLowerCase = /[a-z]/.test(password.value)
      const hasNumber = /\d/.test(password.value)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)

      if (password.value.length < minLength) {
        if (blur) errors.value.password = `Password must be at least ${minLength} characters long`
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
      
      // Also validate confirm password when password changes
      if (confirmPassword.value) {
        validateConfirmPassword(false)
      }
    }

    const validateConfirmPassword = (blur) => {
      if (!confirmPassword.value) {
        if (blur) errors.value.confirmPassword = "Please confirm your password"
      } else if (confirmPassword.value !== password.value) {
        if (blur) errors.value.confirmPassword = "Passwords do not match"
      } else {
        errors.value.confirmPassword = null
      }
    }

    const goToHome = () => {
      emit('navigate-to-home')
    }

    const switchToLogin = () => {
      emit('navigate-to-login')
      console.log('Switching to login mode')
    }

    const handleSubmit = () => {
      // Validate all fields
      validateFirstName(true)
      validateLastName(true)
      validateEmail(true)
      validatePassword(true)
      validateConfirmPassword(true)

      // Check if there are any errors
      const hasErrors = Object.values(errors.value).some(error => error !== null)

      if (!hasErrors) {
        // Handle successful form submission
        console.log('Form submitted successfully:', {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        })
        
        alert('Account created successfully! (This is just a demo)')
        
        // Clear form after successful submission
        firstName.value = ''
        lastName.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        
        // Clear any remaining errors
        Object.keys(errors.value).forEach(key => {
          errors.value[key] = null
        })
      } else {
        console.log('Form has validation errors')
      }
    }

    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      showPassword,
      isLoginMode,
      errors,
      validateFirstName,
      validateLastName,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      goToHome,
      switchToLogin,
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
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 50vw;
  min-width: 500px;
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

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
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

/* Responsive design */
@media (max-width: 1024px) {
  .login-form-container {
    max-width: 70vw;
    min-width: 400px;
  }
}

@media (max-width: 768px) {
  .login-form-container {
    margin: 1rem;
    max-width: 90vw;
    min-width: unset;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .login-form {
    padding: 2rem;
  }
  
  .form-actions {
    justify-content: center;
  }
  
  .create-account-btn {
    width: 100%;
  }
}
</style>
