// Main API exports
export { authAPI } from './authAPI';
export { birthdayAPI } from './birthdayAPI';
export { userAPI } from './userAPI';

// API utilities
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    console.error('API Error:', error);
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  },

  // Format API response
  formatResponse: (data, message = 'Success') => {
    return {
      success: true,
      message,
      data
    };
  },

  // Format API error response
  formatError: (message = 'An error occurred', statusCode = 500) => {
    return {
      success: false,
      message,
      statusCode
    };
  },

  // Validate required fields
  validateRequiredFields: (data, requiredFields) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  },

  // Format date for API
  formatDate: (date) => {
    if (!date) return null;
    
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    
    if (date instanceof Date) {
      return date.toISOString();
    }
    
    return null;
  },

  // Parse API date
  parseDate: (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  },

  // Debounce function for search
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if response is successful
  isSuccessResponse: (response) => {
    return response && response.success === true;
  },

  // Get error message from response
  getErrorMessage: (response) => {
    if (response && response.message) {
      return response.message;
    }
    return 'An unexpected error occurred';
  }
};