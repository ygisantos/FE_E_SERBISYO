import axios from '../axios';

/**
 * Create a new blotter
 */
export const createBlotter = async (blotterData) => {
  try {
    const formattedData = {
      complainant_name: blotterData.complainant_name,
      respondent_name: blotterData.respondent_name,
      additional_respondent: blotterData.additional_respondent || [],
      complaint_details: blotterData.complaint_details,
      relief_sought: blotterData.relief_sought,
      date_created: new Date(blotterData.date_created).toISOString().split('T')[0],
      date_filed: new Date(blotterData.date_filed).toISOString().split('T')[0],
      received_by: blotterData.received_by,
      created_by: blotterData.created_by,
      case_type: blotterData.case_type,
      status: 'filed'
    };

    const response = await axios.post('/blotters/create', formattedData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      // Handle validation errors
      if (typeof error.response.data.error === 'object') {
        const validationErrors = error.response.data.error;
        const firstError = Object.values(validationErrors)[0][0];
        throw { validationErrors, message: firstError };
      }
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

/**
 * Get all blotters with optional filtering and pagination
 */
export const getAllBlotters = async (params = {}) => {
  try {
    const queryParams = {
      status: params.status || undefined,
      from_date: params.from_date ? new Date(params.from_date).toISOString().split('T')[0] : undefined,
      to_date: params.to_date ? new Date(params.to_date).toISOString().split('T')[0] : undefined,
      page: params.page || 1,
      per_page: params.per_page ,
      sort_by: params.sort_by || 'date_filed',
      order: params.order || 'desc',
      search: params.search || undefined
    };

    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key] && queryParams[key] !== 0) {
        delete queryParams[key];
      }
    });

    const response = await axios.get('/blotters', { params: queryParams });

    return {
      data: response.data.data.data,
      pagination: {
        currentPage: response.data.data.current_page,
        totalItems: response.data.data.total,
        lastPage: response.data.data.last_page,
        perPage: response.data.data.per_page,
        from: response.data.data.from,
        to: response.data.data.to
      },
      success: response.data.success
    };
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch blotters';
  }
};

/**
 * Get a specific blotter by ID
 */
export const showBlotter = async (id) => {
  try {
    const response = await axios.post('/blotters/show', { id });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};