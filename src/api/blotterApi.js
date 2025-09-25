import axios from '../axios';

/**
 * Create a new blotter
 */
export const createBlotter = async (blotterData) => {
  try {
    const response = await axios.post('/blotters/create', blotterData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      // Handle validation errors
      if (typeof error.response.data.error === 'object') {
        const validationErrors = error.response.data.error;
        const firstError = Object.values(validationErrors)[0][0];
        throw { validationErrors, message: firstError };
      }
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

/**
 * Get all blotters with optional filtering and pagination
 */
export const getAllBlotters = async (params = {}) => {
  try {
    const response = await axios.get('/blotters', { 
      params: {
        status: params.status || undefined,
        search: params.search || undefined,
        from_date: params.from_date || undefined,
        to_date: params.to_date || undefined,
        per_page: params.per_page || 10,
        page: params.page || 1
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

/**
 * Get a specific blotter by ID
 */
export const showBlotter = async (id) => {
  try {
    const response = await axios.post('/blotters/show', { id });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};