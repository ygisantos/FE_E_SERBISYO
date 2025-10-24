import axios from '../axios';

/**
 * Create a new blotter
 */
export const createBlotter = async (formData) => {
  try {
    // Send FormData directly, with proper headers for multipart/form-data
    const response = await axios.post('/blotters/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API error:', error.response?.data);
    throw error.response?.data || { message: 'Failed to create blotter' };
  }
};

/**
 * Get all blotters with optional filtering and pagination
 */
/**
 * Update a blotter
 */
export const updateBlotter = async (caseNumber, data) => {
  try {
    const response = await axios.put(`/blotters/update/${caseNumber}`, data);
    return response.data;
  } catch (error) {
    console.error('API error:', error.response?.data);
    throw error.response?.data || { message: 'Failed to update blotter' };
  }
};

export const getAllBlotters = async (params = {}) => {
  try {
    const queryParams = {
      status: params.status || undefined,
      from_date: params.from_date ? new Date(params.from_date).toISOString().split('T')[0] : undefined,
      to_date: params.to_date ? new Date(params.to_date).toISOString().split('T')[0] : undefined,
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || 'date_filed',
      order: params.order || 'desc',
      search: params.search || undefined,
      created_by: params.created_by || undefined
    };

    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key] && queryParams[key] !== 0) {
        delete queryParams[key];
      }
    });

    const response = await axios.get('/blotters', { params: queryParams });

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch blotters';
  }
};

/**
 * Get a specific blotter by ID
 */
export const showBlotterByCase = async (caseNumber) => {
  try {
    const response = await axios.post(`/blotters/show/${caseNumber}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch blotter details';
  }
};

/**
 * Update blotter status
 */
export const updateBlotterStatus = async (caseNumber, data) => {
  try {
    // Change to PUT method
    const response = await axios.put(`/blotters/update-status/${caseNumber}`, {
      status: data.status,
      notes: data.notes
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update blotter status';
  }
};

/**
 * Get blotter history
 */
export const getBlotterHistory = async (caseNumber) => {
  try {
    const response = await axios.get(`/blotters/history/${caseNumber}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch blotter history';
  }
};

/**
 * Delete a blotter
 */
export const deleteBlotter = async (caseNumber) => {
  try {
    const response = await axios.delete(`/blotters/delete/${caseNumber}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};