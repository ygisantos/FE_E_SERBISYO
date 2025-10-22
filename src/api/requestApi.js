import axios from '../axios';


export const fetchAllRequests = async (params = {}) => {
  try {

    
    const response = await axios.get('/request-documents', {
      params: {
        status: params.status || undefined,
        requestor: params.requestor,
        document: params.document,
        per_page: params.per_page || 10,
        page: params.page || 1,
        sort_by: params.sort_by || 'created_at',
        order: params.order || 'desc',
        search: params.search || undefined
      }
    });


    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error.response?.data?.message || 'Failed to fetch requests';
  }
};

export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await axios.put(`/request-documents/status/${requestId}`, {
      status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update status';
  }
};

export const getRequestById = async (id) => {
  try {
    const response = await axios.get(`/request-documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch request details';
  }
};
