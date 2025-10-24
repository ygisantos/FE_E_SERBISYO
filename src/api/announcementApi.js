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

export const getAnnouncements = async ({ 
  page = 1, 
  per_page = 10, 
  type = '',
  sort_by = 'created_at',
  order = 'desc',
  search = ''
} = {}) => {
  try {
    const response = await axios.get('/announcements', {
      params: {
        page,
        per_page,
        type,
        sort_by,
        order,
        search
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAnnouncementById = async (id) => {
  try {
    const formData = new FormData();
    formData.append('id', id);
    const response = await axios.post('/announcements/show', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw error.response?.data || 'Failed to fetch announcement';
  }
};

export const updateAnnouncement = async (id, formData) => {
  try {
     const response = await axios.post('/announcements/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update announcement' };
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await axios.delete('/announcements/delete', { data: { id } });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to delete announcement';
  }
};