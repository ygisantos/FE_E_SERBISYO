import axios from '../axios';

export const fetchPendingResidents = async (page = 1, perPage = 10) => {
  const res = await axios.get(`/accounts/all`, {
    params: {
      per_page: perPage,
      status: 'pending',
      type: 'residence',
      page,
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

export const fetchAllResidents = async (page = 1, perPage = 10) => {
  const res = await axios.get(`/accounts/all`, {
    params: {
      per_page: perPage,
      status: 'active',
      type: 'residence',
      page,
    },
  });
  return res.data;
};

export const createOfficial = async (officialData) => {
  const formData = new FormData();
  formData.append('full_name', officialData.full_name);
  formData.append('position', officialData.position);
  formData.append('term_start', officialData.term_start);
  formData.append('term_end', officialData.term_end);
  formData.append('status', officialData.status);
  if (officialData.image) {
    formData.append('image', officialData.image);
  }

  const res = await axios.post('/officials/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

