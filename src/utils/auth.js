/**
 * Authentication utilities
 * Prepared for HttpOnly cookie-based authentication
 * 
 * Note: This is a structure for future implementation.
 * Currently, the app doesn't require authentication, but this
 * provides the foundation for when auth is needed.
 */

/**
 * Set authentication token in HttpOnly cookie
 * This should be done server-side, but we provide the structure here
 * 
 * @param {string} token - JWT or session token
 * @param {number} maxAge - Cookie max age in seconds (default: 7 days)
 */
export const setAuthToken = async (token, maxAge = 604800) => {
  // This should be handled by the backend API
  // Example: POST /api/auth/login with credentials
  // Server sets HttpOnly, Secure, SameSite cookie
  
  // For client-side, we can only make the API call
  // The actual cookie setting happens on the server
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies
      body: JSON.stringify({ token }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to set authentication token')
    }
    
    return await response.json()
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Auth error:', error)
    }
    throw error
  }
}

/**
 * Clear authentication token
 * Calls server endpoint to clear HttpOnly cookie
 */
export const clearAuthToken = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important: include cookies
    })
    
    if (!response.ok) {
      throw new Error('Failed to clear authentication token')
    }
    
    return await response.json()
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Auth error:', error)
    }
    throw error
  }
}

/**
 * Check if user is authenticated
 * Verifies token validity with server
 */
export const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
    })
    
    if (!response.ok) {
      return false
    }
    
    const data = await response.json()
    return data.authenticated === true
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Auth check error:', error)
    }
    return false
  }
}

/**
 * Get current user data
 * Fetches user info from authenticated session
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Get user error:', error)
    }
    return null
  }
}

/**
 * Example server-side cookie setting (Node.js/Express)
 * This is for reference - should be implemented in backend
 * 
 * res.cookie('authToken', token, {
 *   httpOnly: true,        // Prevents XSS attacks
 *   secure: true,          // HTTPS only
 *   sameSite: 'strict',    // CSRF protection
 *   maxAge: 604800000,     // 7 days in milliseconds
 *   path: '/',
 * })
 */

