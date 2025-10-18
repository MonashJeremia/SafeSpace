<template>
  <div class="login-container">
    <MainHeader />

    <main id="main-content" class="login-content py-2 py-sm-3" role="main" aria-labelledby="login-heading">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div class="login-form-container">
              <div class="login-form p-3 p-sm-4 p-md-5">
                <div class="text-center">
                  <div
                    class="user-icon-large"
                    style="font-size: clamp(2rem, 4vw, 3rem)"
                    aria-hidden="true"
                  >
                    👤
                  </div>
                  <h2 id="login-heading" class="fs-4 fs-sm-3 fs-md-2">Login to your account</h2>
                  <p class="login-subtitle fs-6 fs-sm-5">
                    Don't have an account?
                    <router-link to="/signup" class="login-link"
                      >Sign up</router-link
                    >
                  </p>
                </div>

                <!-- Success Message from Registration -->
                <div
                  v-if="successMessage"
                  class="alert alert-success mb-3"
                  role="alert"
                >
                  {{ successMessage }}
                </div>

                <!-- Login Error Message -->
                <div
                  v-if="loginError"
                  class="alert alert-danger mb-3"
                  role="alert"
                >
                  {{ loginError }}
                </div>

                <form @submit.prevent="handleLogin" aria-label="Login form">
                  <div class="form-group">
                    <label for="email">Email address <span class="required-indicator" aria-label="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      class="form-control"
                      v-model="email"
                      required
                      aria-required="true"
                      aria-describedby="email-hint"
                      autocomplete="email"
                    />
                    <span id="email-hint" class="sr-only">Enter your registered email address</span>
                  </div>

                  <div class="form-group">
                    <label for="password">Password <span class="required-indicator" aria-label="required">*</span></label>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      class="form-control"
                      v-model="password"
                      required
                      aria-required="true"
                      aria-describedby="password-hint"
                      autocomplete="current-password"
                    />
                    <span id="password-hint" class="sr-only">Enter your account password</span>
                  </div>

                  <div class="form-check mb-3">
                    <input
                      type="checkbox"
                      id="showPassword"
                      class="form-check-input"
                      v-model="showPassword"
                    />
                    <label for="showPassword" class="form-check-label"
                      >Show password</label
                    >
                  </div>

                  <div class="d-grid">
                    <button type="submit" class="btn login-btn" aria-label="Submit login credentials">Login</button>
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
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../main.js";
import MainHeader from "../components/MainHeader.vue";
// Import security utilities for input validation and XSS protection
import { sanitizeInput, isValidEmail } from "../utils/security.js";

export default {
  name: "LoginView",
  components: {
    MainHeader,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loginError = ref(null);
    const successMessage = ref(null);

    // Check for success message from registration
    onMounted(() => {
      if (route.query.message) {
        successMessage.value = route.query.message;
      }
    });

    const handleLogin = async () => {
      loginError.value = null;

      // Sanitize inputs to prevent XSS attacks
      const cleanEmail = sanitizeInput(email.value, 254).toLowerCase();
      const cleanPassword = sanitizeInput(password.value, 128);

      // Update the form values with sanitized versions
      email.value = cleanEmail;
      password.value = cleanPassword;

      // Basic validation with security checks
      if (!cleanEmail || !cleanPassword) {
        loginError.value = "Please enter both email and password";
        return;
      }

      // Validate email format to prevent malicious input
      if (!isValidEmail(cleanEmail)) {
        loginError.value = "Please enter a valid email address";
        return;
      }

      try {
        // Login user using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          cleanPassword
        );

        // Success - redirect to intended page or home
        const redirectPath = route.query.redirect || "/";
        router.push({ path: redirectPath });
      } catch (error) {
        // Handle Firebase login errors
        let errorMessage = "Failed to login. Please try again.";

        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          errorMessage = "Invalid email or password";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Please check your connection.";
        }

        loginError.value = errorMessage;
      }
    };

    return {
      email,
      password,
      showPassword,
      loginError,
      successMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
  width: 100%;
  overflow-x: hidden;
}

.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.login-form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  margin: 0 1rem;
}

.login-form {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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

.alert {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
