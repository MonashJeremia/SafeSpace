// SafeSpace app configuration - CLIENT-SIDE ONLY
// WARNING: Never store secrets here - they'll be visible to users!

const config = {
  // Basic app metadata
  app: {
    name: 'SafeSpace',
    version: '1.0.0',
    environment: 'development' // Use import.meta.env.VITE_APP_ENV in production
  },
  
  // API endpoints and timeouts
  api: {
    baseUrl: 'http://localhost:3000', // Use import.meta.env.VITE_API_URL in production
    timeout: 10000 // 10 seconds for API calls
  },
  
  // Client-side validation limits
  security: {
    maxInputLength: 1000,    // General text input limit
    maxNameLength: 50,       // First/last name limit
    maxEmailLength: 254,     // RFC standard email limit
    maxPasswordLength: 128,  // Prevent DoS attacks
    
    // Password strength requirements
    passwordRules: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  }
}

// Get nested config values using dot notation
// Example: getConfig('app.name') returns 'SafeSpace'
export const getConfig = (key) => {
  const keys = key.split('.')
  let value = config
  
  // Navigate through nested object properties
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value
}

export default config