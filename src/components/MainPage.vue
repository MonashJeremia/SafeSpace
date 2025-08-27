<template>
  <div class="main-container">
    <nav class="navigation">
      <div class="nav-left">
        <div class="logo-placeholder">Your Logo Here</div>
        <!-- <img src="@/assets/logo.svg" alt="SafeSpace Logo" class="logo" /> -->
        <h1>SafeSpace</h1>
      </div>
      <div class="nav-center">
        <div class="dropdown">
          <button>For the Youth</button>
        </div>
        <div class="dropdown">
          <button>For Community & Health Professionals</button>
        </div>
        <div class="dropdown">
          <button>For Educators</button>
        </div>
        <div class="dropdown">
          <button>Support & Resources</button>
        </div>
        <div class="dropdown">
          <button>About Us</button>
        </div>
      </div>
      <div class="nav-right">
        <button class="help-btn">Help Now</button>
        <button class="donate-btn">Donate now</button>
        <button class="login-btn">Login In</button>
      </div>
    </nav>

    <main class="content">
      <h1 class="main-heading">This is your SafeSpace</h1>
      <div class="contact">Contact us</div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'MainPage'
}
</script>

<style scoped>
.main-container {
  font-family: Arial, sans-serif;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 40px;
}

.nav-center {
  display: flex;
  gap: 2rem;
}

.nav-right {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.help-btn, .donate-btn {
  background-color: #e0e0e0;
}

.login-btn {
  background-color: #e0e0e0;
}

.content {
  text-align: center;
  padding: 4rem 2rem;
}

.main-heading {
  font-size: 4rem;
  margin-bottom: 2rem;
}

.contact {
  margin-top: 2rem;
}
</style>