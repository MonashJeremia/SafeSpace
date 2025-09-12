// Basic XSS protection and input validation

// Escape HTML characters to prevent XSS
export function escapeHtml(text) {
  if (!text) return ''
  
  return String(text)
    .replace(/&/g, '&amp;')   // Must be first
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Remove dangerous content from user input
export function sanitizeInput(input) {
  if (!input) return ''
  
  let clean = String(input)
  
  clean = clean.replace(/<script.*?<\/script>/gi, '')  // Remove scripts
  clean = clean.replace(/javascript:/gi, '')           // Remove JS links
  clean = clean.replace(/\s*on\w+\s*=/gi, '')         // Remove event handlers
  clean = clean.trim()
  
  // Prevent abuse with length limit
  if (clean.length > 1000) {
    clean = clean.substring(0, 1000)
  }
  
  return clean
}

// Basic email format validation
export function isValidEmail(email) {
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validate name input (letters, spaces, hyphens, apostrophes only)
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' }
  }
  
  const clean = name.trim()
  
  if (clean.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' }
  }
  
  if (clean.length > 50) {
    return { isValid: false, error: 'Name is too long' }
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(clean)) {
    return { isValid: false, error: 'Name contains invalid characters' }
  }
  
  return { isValid: true, error: null }
}

// Check password meets security requirements
export function validatePassword(password) {
  const errors = []
  
  if (!password) {
    return { isValid: false, errors: ['Password is required'] }
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password needs an uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password needs a lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password needs a number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password needs a special character')
  }
  
  return { isValid: errors.length === 0, errors }
}