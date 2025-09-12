import { reactive } from 'vue'

// Authentication state
const authState = reactive({
  isAuthenticated: false,
  currentUser: null,
  users: []
})

// Helper functions for localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('safespace_users', JSON.stringify(users))
  } catch (error) {
    console.error('Error saving users to storage:', error)
  }
}

const loadUsersFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('safespace_users') || '[]')
  } catch (error) {
    console.error('Error loading users from storage:', error)
    return []
  }
}

const saveCurrentUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem('safespace_current_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('safespace_current_user')
    }
  } catch (error) {
    console.error('Error saving current user to storage:', error)
  }
}

const loadCurrentUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('safespace_current_user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Error loading current user from storage:', error)
    return null
  }
}

// Initialise state from localStorage
const initializeAuthState = () => {
  try {
    // Load users
    authState.users = loadUsersFromStorage()
    
    // Load current user session
    const storedUser = loadCurrentUserFromStorage()
    if (storedUser) {
      authState.currentUser = storedUser
      authState.isAuthenticated = true
    }
  } catch (error) {
    console.error('Error initializing auth state:', error)
    authState.users = []
  }
}

// Register a new user
const registerUser = (userData) => {
  const { firstName, lastName, email, password, userType } = userData
  
  // Check if user already exists
  const existingUser = authState.users.find(user => user.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    throw new Error('An account with this email already exists')
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(), // Simple ID generation
    firstName,
    lastName,
    email: email.toLowerCase(),
    password, 
    userType,
    createdAt: new Date().toISOString()
  }
  
  // Add user to the list and manually save to localStorage
  authState.users.push(newUser)
  saveUsersToStorage(authState.users)
  
  return newUser
}

// Login user
const loginUser = (email, password) => {
  const user = authState.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  
  if (!user) {
    throw new Error('Invalid email or password')
  }
  
  // Set authentication state
  authState.isAuthenticated = true
  authState.currentUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType
  }
  
  // Manually save current user to localStorage
  saveCurrentUserToStorage(authState.currentUser)
  
  return authState.currentUser
}

// Logout user
const logoutUser = () => {
  authState.isAuthenticated = false
  authState.currentUser = null
  
  // Manually clear current user from localStorage
  saveCurrentUserToStorage(null)
}

// Get current authentication state
const getAuthState = () => authState

// Initialise the service
initializeAuthState()

export {
  authState,
  registerUser,
  loginUser,
  logoutUser,
  getAuthState
}
