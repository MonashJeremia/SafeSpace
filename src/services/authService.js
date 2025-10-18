import { reactive } from 'vue'

// Reactive auth state - manages user authentication across the app
// isAuthenticated: boolean flag for current session status
// currentUser: object containing logged-in user data (null if not logged in)
// users: array of all registered users stored in localStorage
const authState = reactive({
  isAuthenticated: false,
  currentUser: null,
  users: []
})

// Persist users array to localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('safespace_users', JSON.stringify(users))
  } catch (error) {
    // Silent fail on storage error
  }
}

// Retrieve users array from localStorage
// Returns empty array if no data or parsing fails
const loadUsersFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('safespace_users') || '[]')
  } catch (error) {
    return []
  }
}

// Save currently authenticated user to localStorage for session persistence
// Accepts user object or null to clear session
const saveCurrentUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem('safespace_current_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('safespace_current_user')
    }
  } catch (error) {
    // Silent fail on storage error
  }
}

// Load current user session from localStorage
// Returns user object if session exists, null otherwise
const loadCurrentUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('safespace_current_user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    return null
  }
}

// Hydrate auth state from localStorage on initialization
// Called once when module loads to restore previous session
// Step 1: Load all registered users
// Step 2: Check if there's an active session
// Step 3: If session exists, mark user as authenticated
const initializeAuthState = () => {
  try {
    authState.users = loadUsersFromStorage()
    
    const storedUser = loadCurrentUserFromStorage()
    if (storedUser) {
      authState.currentUser = storedUser
      authState.isAuthenticated = true
    }
  } catch (error) {
    authState.users = []
  }
}

// Create new user account
// Validates email uniqueness before creating account
// Throws error if email already registered
const registerUser = (userData) => {
  const { firstName, lastName, email, password, userType } = userData
  
  // Prevent duplicate email registration
  const existingUser = authState.users.find(user => user.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    throw new Error('An account with this email already exists')
  }
  
  // Create user object with unique ID and timestamp
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email: email.toLowerCase(),
    password, 
    userType,
    createdAt: new Date().toISOString()
  }
  
  // Add to users array and persist to storage
  authState.users.push(newUser)
  saveUsersToStorage(authState.users)
  
  return newUser
}

// Authenticate user with credentials
// Returns sanitized user object if credentials match
// Throws error if credentials invalid
const loginUser = (email, password) => {
  // Find user by email and password match
  const user = authState.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  
  if (!user) {
    throw new Error('Invalid email or password')
  }
  
  // Update auth state with sanitized user data (exclude password)
  authState.isAuthenticated = true
  authState.currentUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType
  }
  
  // Persist session to localStorage
  saveCurrentUserToStorage(authState.currentUser)
  
  return authState.currentUser
}

// Clear session and reset auth state
// Removes user from storage and resets state to unauthenticated
const logoutUser = () => {
  authState.isAuthenticated = false
  authState.currentUser = null
  saveCurrentUserToStorage(null)
}

// Getter for current auth state
const getAuthState = () => authState

// Initialize auth state on module load
initializeAuthState()

export {
  authState,
  registerUser,
  loginUser,
  logoutUser,
  getAuthState
}
