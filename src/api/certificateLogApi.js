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
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      search: params.search || '',
      has_staff: 'true', //  parameter to only get logs with staff 
      ...(params.staff && { staff: params.staff }) // Only add staff param if provided
    }).toString();

    const response = await axios.get(`/certificate-logs?${queryParams}`);
    
    return {
      success: true,
      data: response.data.data || [],
      total: response.data.total,
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page
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
