// Birthday API calls
import { authAPI } from './authAPI';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const birthdayAPI = {
  // Get all birthdays with optional filters
  getAllBirthdays: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/birthdays${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch birthdays');
      }

      return data;
    } catch (error) {
      console.error('Get birthdays error:', error);
      throw error;
    }
  },

  // Get single birthday by ID
  getBirthdayById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays/${id}`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch birthday');
      }

      return data;
    } catch (error) {
      console.error('Get birthday error:', error);
      throw error;
    }
  },

  // Create new birthday
  createBirthday: async (birthdayData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays/create`, {
        method: 'POST',
        headers: authAPI.getAuthHeaders(),
        body: JSON.stringify(birthdayData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create birthday');
      }

      return data;
    } catch (error) {
      console.error('Create birthday error:', error);
      throw error;
    }
  },

  // Update birthday
  updateBirthday: async (id, birthdayData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays/${id}`, {
        method: 'PUT',
        headers: authAPI.getAuthHeaders(),
        body: JSON.stringify(birthdayData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update birthday');
      }

      return data;
    } catch (error) {
      console.error('Update birthday error:', error);
      throw error;
    }
  },

  // Delete birthday
  deleteBirthday: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays/${id}`, {
        method: 'DELETE',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete birthday');
      }

      return data;
    } catch (error) {
      console.error('Delete birthday error:', error);
      throw error;
    }
  },

  // Get upcoming birthdays
  getUpcomingBirthdays: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays?upcoming=${days}`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch upcoming birthdays');
      }

      return data;
    } catch (error) {
      console.error('Get upcoming birthdays error:', error);
      throw error;
    }
  },

  // Search birthdays
  searchBirthdays: async (searchTerm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays?search=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search birthdays');
      }

      return data;
    } catch (error) {
      console.error('Search birthdays error:', error);
      throw error;
    }
  },

  // Get birthdays by relationship
  getBirthdaysByRelationship: async (relationship) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays?relationship=${encodeURIComponent(relationship)}`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch birthdays by relationship');
      }

      return data;
    } catch (error) {
      console.error('Get birthdays by relationship error:', error);
      throw error;
    }
  },

  // Get birthday statistics
  getBirthdayStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birthdays?stats=true`, {
        method: 'GET',
        headers: authAPI.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch birthday statistics');
      }

      return data;
    } catch (error) {
      console.error('Get birthday stats error:', error);
      throw error;
    }
  }
};