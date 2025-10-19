import { reactive } from 'vue'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../main.js'

// Reactive auth state - manages user authentication across the app
// isAuthenticated: boolean flag for current session status
// currentUser: object containing logged-in user data (null if not logged in)
const authState = reactive({
  isAuthenticated: false,
  currentUser: null
})

// Create user profile in Firestore
// Stores user data in 'users' collection using Firebase Auth UID as document ID
const createUserProfile = async (uid, userData) => {
  const { firstName, lastName, email, userType } = userData
  
  const userProfile = {
    firstName,
    lastName,
    email: email.toLowerCase(),
    userType,
    createdAt: new Date().toISOString()
  }
  
  // Save to Firestore users collection
  await setDoc(doc(db, 'users', uid), userProfile)
  
  return userProfile
}

// Fetch user profile from Firestore by UID
// Returns user object if found, null otherwise
const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    
    if (userDoc.exists()) {
      return {
        id: uid,
        ...userDoc.data()
      }
    }
    return null
  } catch (error) {
    return null
  }
}

// Set current user in auth state
// Updates isAuthenticated flag and currentUser object
const setCurrentUser = (user) => {
  if (user) {
    authState.isAuthenticated = true
    authState.currentUser = user
  } else {
    authState.isAuthenticated = false
    authState.currentUser = null
  }
}

// Clear session and reset auth state
// Resets state to unauthenticated
const logoutUser = () => {
  authState.isAuthenticated = false
  authState.currentUser = null
}

// Getter for current auth state
const getAuthState = () => authState

export {
  authState,
  createUserProfile,
  getUserProfile,
  setCurrentUser,
  logoutUser,
  getAuthState
}
