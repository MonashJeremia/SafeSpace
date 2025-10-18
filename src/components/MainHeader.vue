<template>
  <header class="header-container" role="banner">
    <div class="container-fluid">
      <!-- Top Navigation -->
      <nav class="row navigation align-items-center" role="navigation" aria-label="Primary navigation">
        <div
          class="col-12 col-lg-6 nav-left d-flex align-items-center justify-content-center justify-content-lg-start mb-2 mb-lg-0"
        >
          <div class="logo-placeholder me-2 me-sm-3 d-none d-sm-block">
            Your Logo Here
          </div>
          <h1 class="mb-0 text-center text-lg-start fs-4 fs-sm-3 fs-md-2">
            SafeSpace
          </h1>
        </div>
        <div
          class="col-12 col-lg-6 nav-right d-flex justify-content-center justify-content-lg-end flex-wrap gap-1 gap-sm-2"
        >
          <button class="btn help-btn btn-sm" @click="goToHelpNow" aria-label="Get immediate mental health support">
            Help Now
          </button>
          <button class="btn donate-btn btn-sm" @click="goToDonateNow" aria-label="Support SafeSpace with a donation">
            Donate now
          </button>

          <!-- Show different buttons based on authentication state -->
          <div v-if="!isAuthenticated" class="d-flex gap-1 gap-sm-2">
            <button class="btn login-btn btn-sm" @click="goToLogin" aria-label="Login to your account">
              <span class="user-icon" aria-hidden="true">👤</span>
              <span class="d-none d-sm-inline">Login</span>
              <span class="d-sm-none">Login</span>
            </button>
            <button class="btn signup-btn btn-sm" @click="goToSignUp" aria-label="Create a new account">
              <span class="d-none d-sm-inline">Sign Up</span>
              <span class="d-sm-none">Join</span>
            </button>
          </div>

          <div v-else class="d-flex align-items-center gap-1 gap-sm-2">
            <div class="user-info d-flex align-items-center" role="status" aria-label="Logged in user">
              <span class="user-icon" aria-hidden="true">👤</span>
              <span class="user-name d-none d-sm-inline">
                {{ currentUser.firstName }}
                <small class="user-role">({{ currentUser.userType }})</small>
              </span>
            </div>
            <button class="btn logout-btn btn-sm" @click="handleLogout" aria-label="Logout from your account">
              <span class="d-none d-sm-inline">Logout</span>
              <span class="d-sm-none">Out</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Secondary Navigation -->
      <div class="row nav-secondary align-items-center">
        <div class="col-12">
          <div
            class="d-flex align-items-center justify-content-center justify-content-lg-start"
          >
            <button class="home-icon me-3 me-lg-4" @click="goToHome" aria-label="Go to home page">
              <span aria-hidden="true">🏠</span>
            </button>

            <!-- Desktop Navigation -->
            <div class="nav-items d-none d-lg-flex flex-wrap" role="menubar">
              <div class="dropdown nav-dropdown me-4" role="none">
                <button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" role="menuitem">For the Youth</button>
                <div class="dropdown-content" role="menu">
                  <div 
                    v-if="isAuthenticated && currentUser && currentUser.userType === 'youth'"
                    class="dropdown-item" 
                    @click="goToJournalLog" 
                    role="menuitem"
                  >
                    Journal Log
                  </div>
                  <div 
                    v-if="isAuthenticated && currentUser && currentUser.userType === 'youth'"
                    class="dropdown-item" 
                    @click="goToCalendar" 
                    role="menuitem"
                  >
                    Wellness Calendar
                  </div>
                  <div class="dropdown-item" @click="goToInteractiveTools" role="menuitem">
                    Interactive Tools
                  </div>
                </div>
              </div>
              <div class="dropdown nav-dropdown me-4" role="none">
                <button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" role="menuitem">
                  For Community & Health Professionals
                </button>
                <div class="dropdown-content">
                  <div class="dropdown-item">Resource A</div>
                  <div class="dropdown-item">Resource B</div>
                  <div class="dropdown-item">Resource C</div>
                </div>
              </div>
              <!-- Only show "For Educators" if user is advisor or not logged in -->
              <div
                v-if="
                  !isAuthenticated ||
                  (isAuthenticated && currentUser && currentUser.userType === 'advisor')
                "
                class="dropdown nav-dropdown me-4"
              >
                <button class="btn dropdown-toggle">For Educators</button>
                <div class="dropdown-content">
                  <div class="dropdown-item" @click="goToTeachingResources">
                    Teaching Resources
                  </div>
                  <div class="dropdown-item" @click="goToGuidelines">
                    Guidelines for Supporting Students
                  </div>
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
              <div class="dropdown nav-dropdown me-4">
                <button class="btn dropdown-toggle">About Us</button>
                <div class="dropdown-content">
                  <div class="dropdown-item" @click="goToAboutUs">About SafeSpace</div>
                  <div class="dropdown-item" @click="goToDonationStats">Donation Statistics</div>
                </div>
              </div>
              
              <!-- Admin Section - Only visible to admin users -->
              <div v-if="isAdmin" class="admin-button-container">
                <button class="btn admin-dashboard-btn" @click="goToAdminDashboard" aria-label="Access Admin Dashboard">
                  ⚙️ Admin Dashboard
                </button>
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
              <span class="navbar-toggler-icon">{{
                mobileMenuOpen ? "✕" : "☰"
              }}</span>
            </button>
          </div>

          <!-- Mobile Navigation Menu -->
          <div
            v-show="mobileMenuOpen"
            class="mobile-nav-menu d-lg-none mt-3"
            id="mobileNav"
          >
            <div class="row g-2">
              <div class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">
                    For the Youth
                  </button>
                  <div class="dropdown-content w-100">
                    <div 
                      v-if="isAuthenticated && currentUser && currentUser.userType === 'youth'"
                      class="dropdown-item" 
                      @click="goToJournalLog"
                    >
                      Journal Log
                    </div>
                    <div 
                      v-if="isAuthenticated && currentUser && currentUser.userType === 'youth'"
                      class="dropdown-item" 
                      @click="goToCalendar"
                    >
                      Wellness Calendar
                    </div>
                    <div class="dropdown-item" @click="goToInteractiveTools">
                      Interactive Tools
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">
                    Community & Health
                  </button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item">Resource A</div>
                    <div class="dropdown-item">Resource B</div>
                    <div class="dropdown-item">Resource C</div>
                  </div>
                </div>
              </div>
              <!-- Only show "For Educators" if user is advisor or not logged in -->
              <div
                v-if="
                  !isAuthenticated ||
                  (isAuthenticated && currentUser && currentUser.userType === 'advisor')
                "
                class="col-12 col-sm-6"
              >
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">
                    For Educators
                  </button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item" @click="goToTeachingResources">
                      Teaching Resources
                    </div>
                    <div class="dropdown-item" @click="goToGuidelines">
                      Guidelines for Supporting Students
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">
                    Support & Resources
                  </button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item">Support Resource 1</div>
                    <div class="dropdown-item">Support Resource 2</div>
                    <div class="dropdown-item">Support Resource 3</div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="dropdown nav-dropdown w-100">
                  <button class="btn dropdown-toggle w-100 text-start">
                    About Us
                  </button>
                  <div class="dropdown-content w-100">
                    <div class="dropdown-item" @click="goToAboutUs">About SafeSpace</div>
                    <div class="dropdown-item" @click="goToDonationStats">Donation Statistics</div>
                  </div>
                </div>
              </div>
              
              <!-- Admin Section for Mobile - Only visible to admin users -->
              <div v-if="isAdmin" class="col-12">
                <button class="btn admin-dashboard-btn w-100" @click="goToAdminDashboard" aria-label="Access Admin Dashboard">
                  ⚙️ Admin Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../main.js";
import DonateNowView from "@/views/DonateNowView.vue";

export default {
  name: "MainHeader",
  setup() {
    const router = useRouter();
    const mobileMenuOpen = ref(false);
    const currentUser = ref(null);
    
    // Computed properties for auth state
    const isAuthenticated = computed(() => currentUser.value !== null);
    const isAdmin = computed(() => isAuthenticated.value && currentUser.value?.userType === 'admin');

    // Sync Firebase auth with localStorage user profile
    // Combines Firebase auth state with local user data (userType, names)
    let unsubscribe = null;
    onMounted(() => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // Retrieve full user profile from localStorage
          const storedUsers = JSON.parse(localStorage.getItem('safespace_users') || '[]');
          const userProfile = storedUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());
          
          // Merge Firebase auth data with stored profile
          currentUser.value = {
            email: user.email,
            firstName: userProfile?.firstName || user.email?.split("@")[0] || "User",
            lastName: userProfile?.lastName || "",
            userType: userProfile?.userType || "youth",
          };
        } else {
          currentUser.value = null;
        }
      });
    });

    // Cleanup auth listener on component unmount
    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });

    // Navigation functions
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const goToSignUp = () => {
      router.push("/signup");
    };

    const goToLogin = () => {
      router.push("/login");
    };

    /**
     * Sign out user from Firebase and redirect home
     * Clears Firebase auth session
     */
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/");
      } catch (error) {
        // Silent fail on logout error
      }
    };

    const goToHelpNow = () => {
      router.push("/help-now");
    };

    const goToHome = () => {
      router.push("/");
    };

    const goToInteractiveTools = () => {
      router.push("/interactive-tools");
    };

    const goToJournalLog = () => {
      router.push("/journal-log");
    };

    const goToTeachingResources = () => {
      router.push("/teaching-resources");
    };

    const goToGuidelines = () => {
      router.push("/guidelines");
    };

    const goToDonateNow = () => {
      router.push("/DonateNow");
    };

    const goToAboutUs = () => {
      router.push("/about-us");
    };

    const goToDonationStats = () => {
      router.push("/donation-statistics");
    };

    const goToAdminDashboard = () => {
      router.push("/admin/dashboard");
    };

    const goToCalendar = () => {
      router.push("/calendar");
    };

    return {
      mobileMenuOpen,
      isAuthenticated,
      currentUser,
      isAdmin,
      toggleMobileMenu,
      goToSignUp,
      goToLogin,
      handleLogout,
      goToHelpNow,
      goToHome,
      goToInteractiveTools,
      goToJournalLog,
      goToTeachingResources,
      goToGuidelines,
      goToDonateNow,
      goToAboutUs,
      goToDonationStats,
      goToAdminDashboard,
      goToCalendar,
    };
  },
};
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
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
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

.help-btn,
.donate-btn,
.signup-btn,
.login-btn,
.logout-btn {
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

.help-btn:hover,
.donate-btn:hover,
.signup-btn:hover,
.login-btn:hover {
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

.user-role {
  color: #6c757d;
  font-weight: 400;
  margin-left: 0.25rem;
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

/* Admin Styles */
.admin-button-container {
  margin-left: 1rem;
}

.admin-dashboard-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white !important;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.admin-dashboard-btn:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.admin-dashboard-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

/* Admin responsive adjustments */
@media (max-width: 991.98px) {
  .admin-button-container {
    margin-left: 0;
    margin-top: 0.5rem;
  }
  
  .admin-dashboard-btn {
    justify-content: center;
    text-align: center;
  }
}

/* High contrast mode for admin elements */
@media (prefers-contrast: high) {
  .admin-dashboard-btn {
    border: 2px solid currentColor;
  }
}
</style>
