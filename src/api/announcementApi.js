import axios from '../axios';

export const createAnnouncement = async (formData) => {
  try {
    const response = await axios.post('/announcements/create', 
      // Send data as a plain object which will be automatically converted to JSON
      {
        type: formData.type,
        description: formData.description
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getAnnouncements = async ({ page = 1, per_page = 10, type = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', per_page);
    // Only append type if it's not an empty string
    if (type && type.trim() !== '') {
      params.append('type', type);
    }

    const response = await axios.get(`/announcements?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};
