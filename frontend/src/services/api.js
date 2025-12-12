import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6543';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI processing
});

// Add request interceptor for logging (optional)
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.statusText;
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Cannot connect to server. Please check if backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

/**
 * API Service Methods
 */

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Analyze a new review
export const analyzeReview = async (productName, reviewText) => {
  const response = await api.post('/api/analyze-review', {
    product_name: productName,
    review_text: reviewText,
  });
  return response.data;
};

// Get all reviews with pagination
export const getReviews = async (limit = 50, offset = 0) => {
  const response = await api.get('/api/reviews', {
    params: { limit, offset },
  });
  return response.data;
};

// Get single review by ID
export const getReviewById = async (id) => {
  const response = await api.get(`/api/reviews/${id}`);
  return response.data;
};

// Delete review by ID
export const deleteReview = async (id) => {
  const response = await api.delete(`/api/reviews/${id}`);
  return response.data;
};

export default api;
