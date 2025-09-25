import axios from '../axios';

export const getFeedbacks = async ({ page = 1, per_page = 10, category, rating, search, user }) => {
  try {
    const params = {
      page,
      per_page,
      ...(category && { category }),
      ...(rating && { rating }),
      ...(search && { search }),
      ...(user && { user })
    };

    const response = await axios.get('/feedback', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createFeedback = async (data) => {
  try {
    const response = await axios.post('/feedback', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
