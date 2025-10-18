import axios from '../axios';

{/*For residence requesting document*/}
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
{/*Create Document*/}
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

{/*Remove Document from the record */}
export const deleteDocument = async (id) => {
  try {
    const response = await axios.delete(`/documents/destroy/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete document';
  }
};

export const deleteDocumentTemplate = async (documentId) => {
  try {
    const response = await axios.delete(`/documents/${documentId}/template/delete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to delete template';
  }
};

/**
 * Get all documents with optional filtering and pagination
 */
export const getAllDocuments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.per_page || 10,
      status: params.status || '',
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      search: params.search || ''
    }).toString();

    const response = await axios.get(`/documents?${queryParams}`);
    
    // The backend returns a simple array, process it for pagination
    const data = Array.isArray(response.data) ? response.data : [];
    
    // Calculate pagination manually since backend doesn't provide it
    const startIndex = (params.page - 1) * params.per_page;
    const endIndex = startIndex + params.per_page;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedData,
      pagination: {
        totalItems: data.length,
        currentPage: parseInt(params.page),
        lastPage: Math.ceil(data.length / params.per_page),
        perPage: params.per_page
      }
    };
  } catch (error) {
    console.error('Documents fetch error:', error);
    throw error.response?.data?.error || 'Failed to fetch documents';
  }
};

{/*Get all document request by residence*/}
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

{/*extract placeholders from the template */}
export const extractPlaceholders = async (documentId) => {
  try {
    const response = await axios.get(`/documents/${documentId}/template/extract-placeholders`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to extract placeholders';
  }
};

{/*For Uploading Template (docx) */}
export const uploadDocumentTemplate = async (documentId, templateFile) => {
  try {
    const formData = new FormData();
    formData.append('template', templateFile);
    formData.append('document_id', documentId);

    const response = await axios.post(
      `/documents/${documentId}/template/upload`,
      formData,
      {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response || error);
    throw error.response?.data?.message || 'Failed to upload template';
  }
};

{/*Get document by ID ex.Viewing,Editing*/}
export const getDocumentById = async (id) => {
  try {
    const response = await axios.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch document';
  }
};

export const getDocumentTemplate = async (documentId) => {
  try {
    const response = await axios.get(`/documents/${documentId}/template/get`, {
      responseType: 'blob'
    });
    
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = '';
    
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    // Fallback filename if none found in header
    if (!filename) {
      filename = 'template.docx';
    }
    
    return { blob: response.data, filename };
  } catch (error) {
    throw error.response?.data || 'Failed to fetch template';
  }
};
