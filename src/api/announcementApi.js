import axios from '../axios';

export const createAnnouncement = async (data) => {
  try {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('description', data.description);
    
    if (data.images?.length > 0) {
      data.images.forEach(image => {
        formData.append('images[]', image);
      });
    }

    const response = await axios.post('/announcements/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to create announcement';
  }
};

export const getAnnouncements = async ({ page = 1, per_page = 10, type = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', per_page);

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