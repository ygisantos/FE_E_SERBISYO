import axios from '../axios';

export const fetchRejectedAccounts = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      search: params.search || '',
    };

    const response = await axios.get('/rejected-accounts', { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch rejected accounts';
  }
};
