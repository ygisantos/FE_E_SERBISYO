import axios from '../axios';

export const register = async (formData) => {
  try {
    // Detect if formData is FormData (for file upload)
    const isFormData = typeof FormData !== "undefined" && formData instanceof FormData;
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : { headers: { 'Content-Type': 'application/json' } };

    // Remove empty file if no file is selected
    if (isFormData && (!formData.get('profile_picture') || formData.get('profile_picture').size === 0)) {
      formData.delete('profile_picture');
    }

    const res = await axios.post('/register', formData, config);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw error.response.data.error;
    }
    throw error;
  }
};
