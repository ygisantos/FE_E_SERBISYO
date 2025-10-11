import axios from '../axios';

export const createDocumentRequest = async (formData) => {
  try {
    console.log('Request Data:', {
      document: formData.get('document'),
      purpose: formData.get('purpose'),
      requirements: Array.from(formData.entries())
        .filter(([key]) => key.includes('requirements'))
    });

    const response = await axios.post('/request-documents/create', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Document request error:', error);
    throw error.response?.data?.message || 'Failed to create document request';
  }
};

export const createDocument = async (documentData) => {
  try {
    const response = await axios.post('/documents/create', documentData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw error.response.data.error;
    }
    throw 'Failed to create document';
  }
};

export const updateDocument = async (id, data) => {
  try {
    const response = await axios.put(`/documents/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update document';
  }
};

/**
 * Get all documents with optional filtering and pagination
 */
export const getAllDocuments = async (params = {}) => {
  try {
    const queryParams = {
      status: params.status || undefined,
      page: params.page || 1,
      per_page: params.per_page,
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      search: params.search || undefined
    };

    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key] && queryParams[key] !== 0) {
        delete queryParams[key];
      }
    });

    const response = await axios.get('/documents', { params: queryParams });

    // The response is already an array of documents
    return {
      data: response.data, // Direct access since backend returns array
      pagination: {
        currentPage: params.page || 1,
        totalItems: response.data.length,
        lastPage: Math.ceil(response.data.length / (params.per_page || 10)),
        perPage: params.per_page || 10
      },
      success: true
    };
  } catch (error) {
    console.error('Documents fetch error:', error);
    throw error.response?.data?.error || 'Failed to fetch documents';
  }
};

export const getAllRequests = async (params = {}) => {
  try {
    const queryParams = {
      status: params.status,
      requestor: params.requestor,
      document: params.document,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      page: params.page || 1
    };

    const response = await axios.get('/request-documents', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Request fetch error:', error);
    throw error.response?.data?.message || 'Failed to fetch requests';
  }
};
