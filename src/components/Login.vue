<template>
  <div class="login-container">
    <MainHeader @navigate-to-home="goToHome" />
    
    <main class="login-content py-2 py-sm-3">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div class="login-form-container">
              <div class="login-form p-3 p-sm-4 p-md-5">
                <div class="text-center">
                  <div class="user-icon-large" style="font-size: clamp(2rem, 4vw, 3rem);">👤</div>
                  <h2 class="fs-4 fs-sm-3 fs-md-2">Login to your account</h2>
                  <p class="login-subtitle fs-6 fs-sm-5">
                    Don't have an account? <a href="#" @click.prevent="switchToSignUp" class="login-link">Sign up</a>
                  </p>
                </div>
                
                <form>
                  <div class="form-group">
                    <label for="email">Email address</label>
                    <input 
                      type="email" 
                      id="email" 
                      class="form-control"
                      v-model="email"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      class="form-control"
                      v-model="password"
                      required
                    >
                  </div>
                  
                  <div class="row g-2 mb-3">
                    <div class="col-12 col-sm-6">
                      <div class="form-check">
                        <input 
                          type="checkbox" 
                          id="showPassword" 
                          class="form-check-input"
                          v-model="showPassword"
                        >
                        <label for="showPassword" class="form-check-label">Show password</label>
                      </div>
                    </div>
                    
                    <div class="col-12 col-sm-6">
                      <div class="form-check">
                        <input 
                          type="checkbox" 
                          id="rememberMe" 
                          class="form-check-input"
                          v-model="rememberMe"
                        >
                        <label for="rememberMe" class="form-check-label">Remember me</label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-center mb-4">
                    <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">Forgot your password?</a>
                  </div>
                  
                  <div class="d-grid">
                    <button type="button" class="btn login-btn">Login</button>
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

    const goToHome = () => {
      emit('navigate-to-home')
    }

    const switchToSignUp = () => {
      emit('navigate-to-signup')
    }

    const handleForgotPassword = () => {
      // Empty function
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      goToHome,
      switchToSignUp,
      handleForgotPassword
    }
  }
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
  margin-bottom: 1.25rem;
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

.form-check-input {
  margin-top: 0.1rem;
}

.form-check-label {
  color: #212529;
  font-size: 0.9rem;
  cursor: pointer;
}

.forgot-link {
  color: #0d6efd;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.forgot-link:hover {
  color: #0b5ed7;
  text-decoration: underline;
}

.login-btn {
  background-color: #0d6efd;
  border: 2px solid #0d6efd;
  color: white;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  width: 100%;
}

.login-btn:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.login-btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.5);
}

.login-btn:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

/* Form states */
.was-validated .form-control:invalid,
.form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6.4.4.4-.4m0 4.2v.6h-.8v-.6z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.was-validated .form-control:valid,
.form-control.is-valid {
  border-color: #198754;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='m2.3 6.73.13-.12L6.29 2.76l.07-.08L5.77 2l-.07.08L2.96 4.82 2.12 3.99l-.06-.08L1.48 4.5l.06.08z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
</style>