<template>
  <header class="header-container">
    <nav class="navigation">
      <div class="nav-left">
        <div class="logo-placeholder">Your Logo Here</div>
        <h1>SafeSpace</h1>
      </div>
      <div class="nav-right">
        <button class="help-btn">Help Now</button>
        <button class="donate-btn">Donate now</button>
        <button class="login-btn" @click="goToLogin">
          <span class="user-icon">👤</span>
          Login In
        </button>
      </div>
    </nav>
    
    <div class="nav-secondary">
      <div class="home-icon" @click="goToHome">🏠</div>
      <div class="nav-items">
        <div class="dropdown nav-dropdown">
          <button>For the Youth <span class="dropdown-arrow">▾</span></button>
          <div class="dropdown-content">
            <div class="dropdown-item">Youth Resource 1</div>
            <div class="dropdown-item">Youth Resource 2</div>
            <div class="dropdown-item">Youth Resource 3</div>
          </div>
        </div>
        <div class="dropdown nav-dropdown">
          <button>For Community & Health Professionals <span class="dropdown-arrow">▾</span></button>
          <div class="dropdown-content">
            <div class="dropdown-item">Resource A</div>
            <div class="dropdown-item">Resource B</div>
            <div class="dropdown-item">Resource C</div>
          </div>
        </div>
        <div class="dropdown nav-dropdown">
          <button>For Educators <span class="dropdown-arrow">▾</span></button>
          <div class="dropdown-content">
            <div class="dropdown-item">Educator Resource 1</div>
            <div class="dropdown-item">Educator Resource 2</div>
            <div class="dropdown-item">Educator Resource 3</div>
          </div>
        </div>
        <div class="dropdown nav-dropdown">
          <button>Support & Resources <span class="dropdown-arrow">▾</span></button>
          <div class="dropdown-content">
            <div class="dropdown-item">Support Resource 1</div>
            <div class="dropdown-item">Support Resource 2</div>
            <div class="dropdown-item">Support Resource 3</div>
          </div>
        </div>
        <div class="dropdown nav-dropdown">
          <button>About Us <span class="dropdown-arrow">▾</span></button>
          <div class="dropdown-content">
            <div class="dropdown-item">Our Story</div>
            <div class="dropdown-item">Team</div>
            <div class="dropdown-item">Careers</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'MainHeader',
  methods: {
    goToLogin() {
      // Emit an event to parent component
      this.$emit('navigate-to-login');
      console.log('Login button clicked');
    },
    goToHome() {
      // Emit event to navigate back to home
      this.$emit('navigate-to-home');
      console.log('Home navigation clicked');
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 3rem;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-left h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.nav-right {
  display: flex;
  gap: 1.2rem;
}

.nav-secondary {
  display: flex;
  align-items: center;
  padding: 0 3rem;
  background-color: white;
  border-bottom: 3px solid #007bff;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.home-icon {
  font-size: 2rem;
  margin-right: 3rem;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.home-icon:hover {
  color: #007bff;
}

.nav-items {
  display: flex;
  gap: 3.5rem;
  padding: 0.6rem 0;
  flex: 1;
}

.nav-dropdown {
  position: relative;
}

.nav-dropdown button {
  background: none;
  border: none;
  color: #333;
  font-size: 1.1rem;
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
  z-index: 1;
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

.help-btn, .donate-btn, .login-btn {
  background-color: #e8e8e8;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.8rem;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.help-btn:hover, .donate-btn:hover, .login-btn:hover {
  background-color: #d8d8d8;
}

.user-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.logo-placeholder {
  color: #666;
  font-size: 1rem;
  border: 2px solid #999;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  background-color: #f9f9f9;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .nav-items {
    gap: 2.5rem;
  }
  
  .dropdown button {
    font-size: 1rem;
  }
}
</style>
