import axios from '../axios';

export const fetchPendingResidents = async (page = 1, params = {}) => {
  const res = await axios.get(`/accounts/all`, {
    params: {
      page,
      status: 'pending',
      type: 'residence',
      sort_by: params.sort_by,
      order: params.order,
    },
  });
  return res.data;
};

export const fetchArchivedResidents = async (page = 1, perPage = 10) => {
  const res = await axios.get(`/accounts/all`, {
    params: {
      per_page: perPage,
      status: 'inactive',
      type: 'residence',
      page,
    },
  });
  return res.data;
};

export const fetchAllResidents = async (params = {}) => {
  try {
    const queryParams = {
      ...params,
      status: 'active',
      type: 'residence',
      min_age: params.min_age || undefined,
      max_age: params.max_age || undefined,
    };

    const response = await axios.get('/accounts/all', { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

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

export const createOfficial = async (formData) => {
  try {
    const response = await axios.post('/officials/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      throw { errors: error.response.data.errors };
    }
    throw new Error(error.response?.data?.message || 'Failed to create official');
  }
};

export const fetchOfficials = async (params = {}) => {
  try {
    const queryParams = {
      status: params.status || 'active',
      sort_by: params.sort_by || 'full_name',
      order: params.order || 'desc',
      page: params.page || 1,
      search: params.search || '',
    };

    const response = await axios.get('/officials/get', { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch officials';
  }
};

export const updateOfficial = async (id, formData) => {
  try {
    const response = await axios.post(`/officials/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update official';
  }
};

export const updateOfficialStatus = async (id, status) => {
  try {
    const response = await axios.post(`/officials/update/status/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update official status';
  }
};

export const getOfficialById = async (id) => {
  try {
    const response = await axios.get(`/officials/get/${id}`);
    return response.data.official;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch official details');
  }
};
