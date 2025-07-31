// User API calls
import { authAPI } from './authAPI';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: authAPI.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage with new user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'POST',
        headers: authAPI.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/notifications`, {
        method: 'PUT',
        headers: authAPI.getAuthHeaders(),
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update notification preferences');
      }

      return data;
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async (password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/delete-account`, {
        method: 'DELETE',
        headers: authAPI.getAuthHeaders(),
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Clear local storage
      authAPI.logout();

      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // Get user statistics (for admin)
  getUserStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/stats`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user statistics');
      }

      return data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  // Get all users (for admin)
  getAllUsers: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/users${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }
};