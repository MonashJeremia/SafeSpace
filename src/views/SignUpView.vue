<template>
  <div class="login-container">
    <MainHeader />

    <main
      id="main-content"
      class="login-content py-2 py-sm-3"
      role="main"
      aria-labelledby="signup-heading"
    >
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 col-xxl-5">
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
                  <h2 id="signup-heading" class="fs-4 fs-sm-3 fs-md-2">
                    Create an account
                  </h2>
                  <p class="login-subtitle fs-6 fs-sm-5">
                    Already have an account?
                    <router-link to="/login" class="login-link"
                      >Log in</router-link
                    >
                  </p>
                </div>

                <form @submit.prevent="submitForm" aria-label="Sign up form">
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="firstName"
                          >First name
                          <span class="required-indicator" aria-label="required"
                            >*</span
                          ></label
                        >
                        <input
                          type="text"
                          id="firstName"
                          class="form-control"
                          v-model="formData.firstName"
                          @blur="() => validateFirstName(true)"
                          @input="() => validateFirstName(false)"
                          required
                          aria-required="true"
                          :aria-invalid="errors.firstName ? 'true' : 'false'"
                          aria-describedby="firstName-error"
                          autocomplete="given-name"
                        />
                        <div
                          v-if="errors.firstName"
                          id="firstName-error"
                          class="error-message"
                          role="alert"
                        >
                          {{ errors.firstName }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="lastName"
                          >Last name
                          <span class="required-indicator" aria-label="required"
                            >*</span
                          ></label
                        >
                        <input
                          type="text"
                          id="lastName"
                          class="form-control"
                          v-model="formData.lastName"
                          @blur="() => validateLastName(true)"
                          @input="() => validateLastName(false)"
                          required
                          aria-required="true"
                          :aria-invalid="errors.lastName ? 'true' : 'false'"
                          aria-describedby="lastName-error"
                          autocomplete="family-name"
                        />
                        <div
                          v-if="errors.lastName"
                          id="lastName-error"
                          class="error-message"
                          role="alert"
                        >
                          {{ errors.lastName }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row g-3">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="email"
                          >Email address
                          <span class="required-indicator" aria-label="required"
                            >*</span
                          ></label
                        >
                        <input
                          type="email"
                          id="email"
                          class="form-control"
                          v-model="formData.email"
                          @blur="() => validateEmail(true)"
                          @input="() => validateEmail(false)"
                          required
                          aria-required="true"
                          :aria-invalid="errors.email ? 'true' : 'false'"
                          aria-describedby="email-error"
                          autocomplete="email"
                        />
                        <div
                          v-if="errors.email"
                          id="email-error"
                          class="error-message"
                          role="alert"
                        >
                          {{ errors.email }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row g-3">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="userType"
                          >I am a
                          <span class="required-indicator" aria-label="required"
                            >*</span
                          ></label
                        >
                        <select
                          id="userType"
                          class="form-control"
                          v-model="formData.userType"
                          @blur="() => validateUserType(true)"
                          @change="() => validateUserType(false)"
                          required
                          aria-required="true"
                          :aria-invalid="errors.userType ? 'true' : 'false'"
                          aria-describedby="userType-error"
                        >
                          <option value="">Please select...</option>
                          <option value="youth">Youth</option>
                          <option value="advisor">Advisor</option>
                          <option value="admin">Administrator</option>
                        </select>
                        <div
                          v-if="errors.userType"
                          id="userType-error"
                          class="error-message"
                          role="alert"
                        >
                          {{ errors.userType }}
                        </div>
                      </div>
                    </div>
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
                          @blur="() => validatePasswordField(true)"
                          @input="() => validatePasswordField(false)"
                          required
                        />
                        <div v-if="errors.password" class="error-message">
                          {{ errors.password }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label for="confirmPassword"
                          >Confirm your password</label
                        >
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          id="confirmPassword"
                          class="form-control"
                          v-model="formData.confirmPassword"
                          @blur="() => validateConfirmPassword(true)"
                          @input="() => validateConfirmPassword(false)"
                          required
                        />
                        <div
                          v-if="errors.confirmPassword"
                          class="error-message"
                        >
                          {{ errors.confirmPassword }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p class="password-requirement">
                    Use 8 or more characters with a mix of letters, numbers &
                    symbols
                  </p>

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

                  <!-- Registration Error Message -->
                  <div
                    v-if="errors.registration"
                    class="alert alert-danger mb-3"
                    role="alert"
                  >
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../main.js";
import MainHeader from "../components/MainHeader.vue";
// Import security utilities for input validation and XSS protection
import {
  validateName,
  isValidEmail,
  validatePassword,
  sanitizeInput,
} from "../utils/security.js";

const router = useRouter();

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: "",
});

const showPassword = ref(false);

const errors = ref({
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  confirmPassword: null,
  userType: null,
  registration: null,
});

// Simple validation functions with basic security
const validateFirstName = (blur) => {
  // Clean the input first
  const clean = sanitizeInput(formData.value.firstName);
  formData.value.firstName = clean;

  // Basic validation
  const validation = validateName(clean);

  if (!validation.isValid && blur) {
    errors.value.firstName = validation.error;
  } else {
    errors.value.firstName = null;
  }
};

const validateLastName = (blur) => {
  // Clean the input first
  const clean = sanitizeInput(formData.value.lastName);
  formData.value.lastName = clean;

  // Basic validation
  const validation = validateName(clean);

  if (!validation.isValid && blur) {
    errors.value.lastName = validation.error;
  } else {
    errors.value.lastName = null;
  }
};

const validateEmail = (blur) => {
  // Clean the input first
  const clean = sanitizeInput(formData.value.email);
  formData.value.email = clean.toLowerCase(); // Email should be lowercase

  if (!clean && blur) {
    errors.value.email = "Email is required";
  } else if (!isValidEmail(clean) && blur) {
    errors.value.email = "Please enter a valid email address";
  } else {
    errors.value.email = null;
  }
};

// Simple password validation with security
const validatePasswordField = (blur) => {
  const result = validatePassword(formData.value.password);

  if (!result.isValid && blur) {
    errors.value.password = result.errors[0]; // Show first error
  } else {
    errors.value.password = null;
  }

  // Also check confirm password if it exists
  if (formData.value.confirmPassword) {
    validateConfirmPassword(false);
  }
};

const validateConfirmPassword = (blur) => {
  if (!formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = "Please confirm your password";
  } else if (formData.value.confirmPassword !== formData.value.password) {
    if (blur) errors.value.confirmPassword = "Passwords do not match";
  } else {
    errors.value.confirmPassword = null;
  }
};

const validateUserType = (blur) => {
  if (!formData.value.userType) {
    if (blur) errors.value.userType = "Please select your user type";
  } else {
    errors.value.userType = null;
  }
};

const submitForm = async () => {
  // Clear previous registration error
  errors.value.registration = null;

  // Validate all fields with enhanced security validation
  validateFirstName(true);
  validateLastName(true);
  validateEmail(true);
  validatePasswordField(true);
  validateConfirmPassword(true);
  validateUserType(true);

  // Check if all validations pass
  const hasErrors =
    errors.value.firstName ||
    errors.value.lastName ||
    errors.value.email ||
    errors.value.password ||
    errors.value.confirmPassword ||
    errors.value.userType;

  if (!hasErrors) {
    try {
      // Register user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.value.email,
        formData.value.password
      );

      // Save user profile to localStorage for header access
      const userProfile = {
        id: userCredential.user.uid,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email.toLowerCase(),
        userType: formData.value.userType,
        createdAt: new Date().toISOString(),
      };

      // Get existing users from localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("safespace_users") || "[]"
      );
      existingUsers.push(userProfile);
      localStorage.setItem("safespace_users", JSON.stringify(existingUsers));

      // Success - redirect to login with success message
      router.push({
        path: "/login",
        query: {
          message: "Account created successfully! Please log in.",
        },
      });
    } catch (error) {
      // Handle Firebase registration errors
      let errorMessage = "Failed to create account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }

      errors.value.registration = errorMessage;
    }
  }
};

const clearForm = () => {
  formData.value.firstName = "";
  formData.value.lastName = "";
  formData.value.email = "";
  formData.value.password = "";
  formData.value.confirmPassword = "";
  formData.value.userType = "";
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
