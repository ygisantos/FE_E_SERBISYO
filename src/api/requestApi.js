import axios from '../axios';

export const fetchAllRequests = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      status: params.status,
      search: params.search
    };

    const response = await axios.get('/request-documents', { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch requests';
  }
};
