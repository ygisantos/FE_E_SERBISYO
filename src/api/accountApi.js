import axios from '../axios';

export const updateAccountInformation = async (accountId, data) => {
  try {
    const response = await axios.put(`/accounts/${accountId}/update-information`, {
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      suffix: data.suffix,
      sex: data.sex,
      nationality: data.nationality,
      birthday: data.birthday,
      contact_no: data.contact_no,
      birth_place: data.birth_place,
      municipality: data.municipality,
      barangay: data.barangay,
      house_no: data.house_no,
      zip_code: data.zip_code,
      street: data.street,
      type: data.type
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update account information' };
  }
};

export const getAccountInformation = async (accountId) => {
  try {
    const res = await axios.get(`/accounts/${accountId}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw error.response.data.error;
    } else {
      throw 'An error occurred while fetching account information';
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.get('/user');
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw error.response.data.error;
    } else {
      throw 'An error occurred while fetching user information';
    }
  }
};

export const createAccount = async (formData) => {
  try {
    const isFormData = formData instanceof FormData;
    const config = isFormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/admin/add-account', formData, config);
    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      if (typeof error.response.data.error === 'object') {
        const validationErrors = error.response.data.error;
        const firstError = Object.values(validationErrors)[0][0];
        throw { validationErrors, message: firstError };
      }
      throw error.response.data.error;
    }
    throw 'An error occurred while creating account';
  }
};

export const fetchAllAccounts = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      search: params.search,
    };

    const response = await axios.get('/accounts/all', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Fetch accounts error:', error);
    
    throw error.response?.data?.message || 'Failed to fetch accounts';
  }
};