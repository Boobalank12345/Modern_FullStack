import jwt from 'jsonwebtoken'

// Verify JWT token from request headers
export function verifyToken(req) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Generate JWT token
export function generateToken(payload) {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
  } catch (error) {
    console.error('Token generation error:', error)
    return null
  }
}

// Middleware to protect routes
export function requireAuth(handler) {
  return async (req, res) => {
    const decoded = verifyToken(req)
    
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Add user info to request
    req.user = decoded
    
    return handler(req, res)
  }
}

// Middleware to require admin role
export function requireAdmin(handler) {
  return async (req, res) => {
    const decoded = verifyToken(req)
    
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    // Add user info to request
    req.user = decoded
    
    return handler(req, res)
  }
}

// Client-side auth helpers
export const authHelpers = {
  // Store token in localStorage
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  // Get token from localStorage
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },

  // Remove token from localStorage
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    }
  },

  // Store user data in localStorage
  setUserData: (userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(userData))
    }
  },

  // Get user data from localStorage
  getUserData: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData')
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authHelpers.getToken()
    if (!token) return false

    try {
      // Decode token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      if (payload.exp < currentTime) {
        // Token expired, remove it
        authHelpers.removeToken()
        return false
      }
      
      return true
    } catch (error) {
      // Invalid token, remove it
      authHelpers.removeToken()
      return false
    }
  },

  // Get authorization headers for API requests
  getAuthHeaders: () => {
    const token = authHelpers.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  // Logout user
  logout: () => {
    authHelpers.removeToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}