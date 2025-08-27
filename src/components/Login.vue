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
                  required
                >
              </div>
              <div class="form-group">
                <label for="lastName">Last name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="lastName"
                  required
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email address</label>
              <input 
                type="email" 
                id="email" 
                v-model="email"
                required
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="password">Password</label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password"
                  required
                >
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm your password</label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  required
                >
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
              <a href="#" @click.prevent="goToHome" class="log-in-instead">log in instead</a>
              <button type="submit" class="create-account-btn">Create an account</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import MainHeader from './MainHeader.vue'

export default {
  name: 'Login',
  components: {
    MainHeader
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      isLoginMode: false
    }
  },
  methods: {
    goToHome() {
      this.$emit('navigate-to-home');
    },
    switchToLogin() {
      this.isLoginMode = !this.isLoginMode;
      // Here you could switch between login and register forms
      console.log('Switching to login mode');
    },
    handleSubmit() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      
      // Handle form submission
      console.log('Form submitted:', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      });
      
      // You would typically send this data to your backend
      alert('Account creation submitted! (This is just a demo)');
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
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.log-in-instead {
  color: #007bff;
  text-decoration: underline;
  font-size: 0.9rem;
}

.log-in-instead:hover {
  color: #0056b3;
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
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .create-account-btn {
    width: 100%;
  }
}
</style>