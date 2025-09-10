<template>
  <header class="header-container">
    <div class="container-fluid">
      <!-- Top Navigation -->
      <nav class="row navigation align-items-center">
        <div class="col-12 col-lg-6 nav-left d-flex align-items-center justify-content-center justify-content-lg-start mb-2 mb-lg-0">
          <div class="logo-placeholder me-2 me-sm-3 d-none d-sm-block">Your Logo Here</div>
          <h1 class="mb-0 text-center text-lg-start fs-4 fs-sm-3 fs-md-2">SafeSpace</h1>
        </div>
        <div class="col-12 col-lg-6 nav-right d-flex justify-content-center justify-content-lg-end flex-wrap gap-1 gap-sm-2">
          <button class="btn help-btn btn-sm" @click="goToHelpNow">Help Now</button>
          <button class="btn donate-btn btn-sm">Donate now</button>
          
          <!-- Show different buttons based on authentication state -->
          <div v-if="!isAuthenticated" class="d-flex gap-1 gap-sm-2">
            <button class="btn login-btn btn-sm" @click="goToLogin">
              <span class="user-icon">👤</span>
              <span class="d-none d-sm-inline">Login</span>
              <span class="d-sm-none">Login</span>
            </button>
            <button class="btn signup-btn btn-sm" @click="goToSignUp">
              <span class="d-none d-sm-inline">Sign Up</span>
              <span class="d-sm-none">Join</span>
            </button>
          </div>
          
          <div v-else class="d-flex align-items-center gap-1 gap-sm-2">
            <div class="user-info d-flex align-items-center">
              <span class="user-icon">👤</span>
              <span class="user-name d-none d-sm-inline">{{ currentUser.firstName }}</span>
            </div>
            <button class="btn logout-btn btn-sm" @click="handleLogout">
              <span class="d-none d-sm-inline">Logout</span>
              <span class="d-sm-none">Out</span>
            </button>
          </div>
        </div>
      </nav>
      
      <!-- Secondary Navigation -->
      <div class="row nav-secondary align-items-center">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-center justify-content-lg-start">
            <div class="home-icon me-3 me-lg-4" @click="goToHome">🏠</div>
            
            <!-- Desktop Navigation -->
            <div class="nav-items d-none d-lg-flex flex-wrap">
              <div class="dropdown nav-dropdown me-4">
                <button class="btn dropdown-toggle">For the Youth</button>
                <div class="dropdown-content">
                  <div class="dropdown-item">Youth Resource 1</div>
                  <div class="dropdown-item">Youth Resource 2</div>
                  <div class="dropdown-item" @click="goToInteractiveTools">Interactive Tools</div>
                </div>
              </div>
              <div class="dropdown nav-dropdown me-4">
                <button class="btn dropdown-toggle">For Community & Health Professionals</button>
                <div class="dropdown-content">
                  <div class="dropdown-item">Resource A</div>
                  <div class="dropdown-item">Resource B</div>
                  <div class="dropdown-item">Resource C</div>
                </div>
              </div>
              <!-- Only show "For Educators" if user is advisor or not logged in -->
              <div v-if="!isAuthenticated || (currentUser && currentUser.userType === 'advisor')" class="dropdown nav-dropdown me-4">
                <button class="btn dropdown-toggle">For Educators</button>
                <div class="dropdown-content">
                  <div class="dropdown-item" @click="goToTeachingResources">Teaching Resources</div>
                  <div class="dropdown-item" @click="goToGuidelines">Guidelines for Supporting Students</div>
                </div>
              </div>
              <div class="dropdown nav-dropdown me-4">
                <button class="btn dropdown-toggle">Support & Resources</button>
                <div class="dropdown-content">
                  <div class="dropdown-item">Support Resource 1</div>
                  <div class="dropdown-item">Support Resource 2</div>
                  <div class="dropdown-item">Support Resource 3</div>
                </div>
              </div>
              <div class="dropdown nav-dropdown">
                <button class="btn dropdown-toggle">About Us</button>
                <div class="dropdown-content">
                  <div class="dropdown-item">Our Story</div>
                  <div class="dropdown-item">Team</div>
                  <div class="dropdown-item">Careers</div>
                </div>
              </div>
            </div>
            
            <!-- Mobile Navigation Toggle -->
            <button 
              class="btn mobile-menu-toggle d-lg-none ms-auto" 
              type="button" 
              @click="toggleMobileMenu"
              :aria-expanded="mobileMenuOpen"
              aria-controls="mobileNav"
            >
              <span class="navbar-toggler-icon">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
            </button>
          </div>
          
          <!-- Mobile Navigation Menu -->
          <div v-show="mobileMenuOpen" class="mobile-nav-menu d-lg-none mt-3" id="mobileNav">
            <div class="row g-2">
              <div class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">For the Youth</button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item">Youth Resource 1</div>
                    <div class="dropdown-item">Youth Resource 2</div>
                    <div class="dropdown-item" @click="goToInteractiveTools">Interactive Tools</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">Community & Health</button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item">Resource A</div>
                    <div class="dropdown-item">Resource B</div>
                    <div class="dropdown-item">Resource C</div>
                  </div>
                </div>
              </div>
              <!-- Only show "For Educators" if user is advisor or not logged in -->
              <div v-if="!isAuthenticated || (currentUser && currentUser.userType === 'advisor')" class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">For Educators</button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item" @click="goToTeachingResources">Teaching Resources</div>
                    <div class="dropdown-item" @click="goToGuidelines">Guidelines for Supporting Students</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">Support & Resources</button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item">Support Resource 1</div>
                    <div class="dropdown-item">Support Resource 2</div>
                    <div class="dropdown-item">Support Resource 3</div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">About Us</button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item">Our Story</div>
                    <div class="dropdown-item">Team</div>
                    <div class="dropdown-item">Careers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authState, logoutUser } from '../services/authService.js'

export default {
  name: 'MainHeader',
  setup() {
    const router = useRouter()
    const mobileMenuOpen = ref(false)
    
    // Computed properties for authentication state
    const isAuthenticated = computed(() => authState.isAuthenticated)
    const currentUser = computed(() => authState.currentUser)
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const goToSignUp = () => {
      router.push('/signup')
      console.log('Sign up button clicked')
    }
    
    const goToLogin = () => {
      router.push('/login')
      console.log('Login button clicked')
    }
    
    const handleLogout = () => {
      logoutUser()
      router.push('/')
      console.log('User logged out')
    }
    
    const goToHelpNow = () => {
      router.push('/help-now')
      console.log('Help Now button clicked')
    }
    
    const goToHome = () => {
      router.push('/')
      console.log('Home navigation clicked')
    }
    
    const goToInteractiveTools = () => {
      router.push('/interactive-tools')
      console.log('Interactive Tools navigation clicked')
    }
    
    const goToTeachingResources = () => {
      router.push('/teaching-resources')
      console.log('Teaching Resources navigation clicked')
    }
    
    const goToGuidelines = () => {
      router.push('/guidelines')
      console.log('Guidelines navigation clicked')
    }
    
    return {
      mobileMenuOpen,
      isAuthenticated,
      currentUser,
      toggleMobileMenu,
      goToSignUp,
      goToLogin,
      handleLogout,
      goToHelpNow,
      goToHome,
      goToInteractiveTools,
      goToTeachingResources,
      goToGuidelines
    }
  }
}
</script>

<style scoped>
.header-container {
  font-family: Arial, sans-serif;
  width: 100%;
}

.navigation {
  padding: 0.8rem 1rem;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
}

.nav-secondary {
  padding: 0.6rem 1rem;
  background-color: white;
  border-bottom: 3px solid #007bff;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.home-icon {
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.home-icon:hover {
  color: #007bff;
}

.nav-items {
  padding: 0.6rem 0;
}

.nav-dropdown {
  position: relative;
}

.nav-dropdown button {
  background: none;
  border: none;
  color: #333;
  font-size: 0.95rem;
  padding: 0.4rem 0;
  cursor: pointer;
  transition: color 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.nav-dropdown button:hover {
  color: #007bff;
}

.nav-dropdown .dropdown-arrow {
  margin-left: 0.5rem;
  font-size: 0.9rem;
}

/* Dropdown content styling */
.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  width: 100%;
  min-width: max-content;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
  z-index: 1000;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.nav-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.help-btn, .donate-btn, .signup-btn, .login-btn, .logout-btn {
  background-color: #e8e8e8;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.help-btn:hover, .donate-btn:hover, .signup-btn:hover, .login-btn:hover {
  background-color: #d8d8d8;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
}

.logout-btn:hover {
  background-color: #c82333;
}

.user-info {
  background-color: #f8f9fa;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  color: #333;
}

.user-name {
  margin-left: 0.5rem;
  font-weight: 500;
}

.user-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.logo-placeholder {
  color: #666;
  font-size: 0.85rem;
  border: 2px solid #999;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.mobile-menu-toggle {
  background-color: transparent;
  border: 2px solid #0d6efd;
  color: #0d6efd;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.mobile-menu-toggle:hover {
  background-color: #0d6efd;
  color: white;
}

.navbar-toggler-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.mobile-menu-toggle:hover .navbar-toggler-icon {
  transform: scale(1.1);
}

.mobile-nav-menu {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  border: 1px solid #dee2e6;
}
</style>
