import axios from '../axios';

export const createCertificateLog = async (data) => {
  try {
    const response = await axios.post('/certificate-logs/create', {
      document_request: data.document_request,
      staff: data.staff,
      remark: data.remark
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to create certificate log';
  }
};

export const getAllCertificateLogs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.per_page || 10,
      document_request: params.document_request || '',
      staff: params.staff || '', 
      remark: params.search || '', // Using search as remark filter
      date_from: params.from_date || '',
      date_to: params.to_date || '',
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      requestor: params.requestor || '',
      document: params.document || ''
    }).toString();

    const response = await axios.get(`/certificate-logs?${queryParams}`);
    return {
      success: true,
      data: response.data.data,
      pagination: {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page
      }
    };
  } catch (error) {
    console.error('Error fetching certificate logs:', error);
    throw error.response?.data || { message: 'Failed to fetch certificate logs' };
  }
};

export const getCertificateLogById = async (id) => {
  try {
    const response = await axios.get(`/certificate-logs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch certificate log';
  }
};
