// Authentication API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const authAPI = {
  // Admin login
  adminLogin: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // User login/registration
  userLogin: async (email, password, name = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/userLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('User login error:', error);
      throw error;
    }
  },

  // Logout (clear local storage)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  },

  // Get current user from token
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const userType = localStorage.getItem('userType');
      
      if (token && user) {
        try {
          return {
            token,
            user: JSON.parse(user),
            userType
          };
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const currentUser = authAPI.getCurrentUser();
    return !!currentUser?.token;
  },

  // Check if user is admin
  isAdmin: () => {
    const currentUser = authAPI.getCurrentUser();
    return currentUser?.userType === 'admin';
  },

  // Get auth headers for API requests
  getAuthHeaders: () => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser?.token) {
      return {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }
};