import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import HelpNowView from '../views/HelpNowView.vue'
import { authState } from '../services/authService.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { 
      requiresGuest: true // Only accessible when not logged in
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { 
      requiresGuest: true // Only accessible when not logged in
    }
  },
  {
    path: '/help-now',
    name: 'HelpNow',
    component: HelpNowView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authState.isAuthenticated
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login page with return path
    next({ 
      path: '/login', 
      query: { 
        redirect: to.fullPath,
        message: 'Please log in to access this page.'
      }
    })
    return
  }
  
  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect authenticated users away from login/signup pages
    next({ path: '/' })
    return
  }
  
  // Allow navigation
  next()
})

export default router
