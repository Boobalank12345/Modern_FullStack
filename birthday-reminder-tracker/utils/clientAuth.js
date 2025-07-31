// Client-side authentication utilities - Updated to use API folder
import { authAPI } from '../API';

export const clientAuthHelpers = {
  // Store authentication data
  setAuthData: (token, user, userType = 'user') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('userType', userType)
    }
  },

  // Get authentication data
  getAuthData: () => {
    return authAPI.getCurrentUser();
  },

  // Clear authentication data
  clearAuthData: () => {
    authAPI.logout();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return authAPI.isAuthenticated();
  },

  // Check if user is admin
  isAdmin: () => {
    return authAPI.isAdmin();
  },

  // Get authorization headers for API requests
  getAuthHeaders: () => {
    return authAPI.getAuthHeaders();
  },

  // Redirect based on user type
  redirectAfterLogin: (userType, router) => {
    if (userType === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/birthday-list')
    }
  },

  // Check if user has permission to access admin routes
  hasAdminAccess: () => {
    return clientAuthHelpers.isAuthenticated() && clientAuthHelpers.isAdmin()
  },

  // Check if user has permission to access user routes
  hasUserAccess: () => {
    return clientAuthHelpers.isAuthenticated()
  },

  // Login methods
  adminLogin: async (email, password) => {
    try {
      const response = await authAPI.adminLogin(email, password);
      if (response.token) {
        clientAuthHelpers.setAuthData(response.token, response.user, 'admin');
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  userLogin: async (email, password, name = null) => {
    try {
      const response = await authAPI.userLogin(email, password, name);
      if (response.token) {
        clientAuthHelpers.setAuthData(response.token, response.user, 'user');
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}