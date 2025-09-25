import axios from '../axios';

export const updateAccountInformation = async (accountId, formData) => {
  try {
    // Detect if formData is FormData (for file upload)
    const isFormData = typeof FormData !== "undefined" && formData instanceof FormData;
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put(`/accounts/${accountId}/update-information`, formData, config);
    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      // Handle validation errors
      if (typeof error.response.data.error === 'object') {
        const validationErrors = error.response.data.error;
        const firstError = Object.values(validationErrors)[0][0];
        throw { validationErrors, message: firstError };
      }
      throw error.response.data.error;
    } else {
      throw 'An error occurred while updating account information';
    }
  }
};

export const getAccountInformation = async (accountId) => {
  try {
    const res = await axios.get(`/accounts/${accountId}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw error.response.data.error;
    } else {
      throw 'An error occurred while fetching account information';
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.get('/user');
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw error.response.data.error;
    } else {
      throw 'An error occurred while fetching user information';
    }
  }
};