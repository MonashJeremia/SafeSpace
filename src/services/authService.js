import { reactive, ref, watch, computed } from 'vue'

// Authentication state
const authState = reactive({
  isAuthenticated: false,
  currentUser: null,
  users: []
})

// Computed properties for localStorage
const usersFromLocalStorage = computed(() => {
  return JSON.parse(localStorage.getItem('safespace_users') || '[]')
})

const currentUserFromLocalStorage = computed(() => {
  const storedUser = localStorage.getItem('safespace_current_user')
  return storedUser ? JSON.parse(storedUser) : null
})

// Watchers for automatic localStorage sync
watch(() => authState.users, (newUsers) => {
  try {
    localStorage.setItem('safespace_users', JSON.stringify(newUsers))
  } catch (error) {
    console.error('Error saving users to storage:', error)
  }
}, { deep: true })

watch(() => authState.currentUser, (newUser) => {
  try {
    if (newUser && !newUser.temporary) {
      // Only save to localStorage if it's not a temporary session
      const userToSave = { ...newUser }
      delete userToSave.temporary // Remove temporary flag before saving
      localStorage.setItem('safespace_current_user', JSON.stringify(userToSave))
    } else if (!newUser) {
      // Clear localStorage when user is null (logout)
      localStorage.removeItem('safespace_current_user')
    }
    // If user.temporary is true, don't save to localStorage
  } catch (error) {
    console.error('Error managing current user session:', error)
  }
}, { deep: true })

// Initialize state from localStorage
const initializeAuthState = () => {
  try {
    // Load users
    authState.users = usersFromLocalStorage.value
    
    // Load current user session
    const storedUser = currentUserFromLocalStorage.value
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
    password, // In a real app, this should be hashed
    userType,
    createdAt: new Date().toISOString()
  }
  
  // Add user to the list (watcher will automatically save to localStorage)
  authState.users.push(newUser)
  
  return newUser
}

// Login user
const loginUser = (email, password, rememberMe = false) => {
  const user = authState.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  
  if (!user) {
    throw new Error('Invalid email or password')
  }
  
  // Set authentication state
  authState.isAuthenticated = true
  
  if (rememberMe) {
    // Save full session (watcher will handle localStorage)
    authState.currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType
    }
  } else {
    // Set current user but don't persist to localStorage
    authState.currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      temporary: true // Flag to indicate this shouldn't be persisted
    }
  }
  
  return authState.currentUser
}

// Logout user
const logoutUser = () => {
  authState.isAuthenticated = false
  authState.currentUser = null // Watcher will clear localStorage
}

// Get current authentication state
const getAuthState = () => authState

// Initialize the service
initializeAuthState()

export {
  authState,
  registerUser,
  loginUser,
  logoutUser,
  getAuthState
}
