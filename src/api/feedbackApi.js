import axios from '../axios';

export const getFeedbacks = async ({ 
  page = 1, 
  per_page = 10, 
  category, 
  rating, 
  search,
  sort_by,  // Add sort parameters
  order
}) => {
  try {
    const params = new URLSearchParams({
      page,
      per_page,
      ...(category && { category }),
      ...(rating && { rating }),
      ...(search && { search }),
      ...(sort_by && { sort_by }), // Add sort parameters to query
      ...(order && { order })
    });

    const response = await axios.get(`/feedback?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createFeedback = async (data) => {
  try {
    const response = await axios.post('/feedback/create', {
      user: data.user,
      remarks: data.remarks,
      category: data.category,
      rating: data.rating
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to submit feedback';
  }
};
