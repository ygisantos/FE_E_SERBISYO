import axios from '../axios';

export const getConfigurations = async () => {
  try {
    const response = await axios.get('/configs');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch configurations';
  }
};

export const createConfiguration = async (data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('value', data.value);

    const response = await axios.post('/configs/create', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create configuration';
  }
};

export const updateConfiguration = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('value', data.value);

    const response = await axios.put(`/configs/update?id=${id}&name=${data.name}&value=${data.value}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update configuration';
  }
};

export const deleteConfiguration = async (id) => {
  try {
    const formData = new FormData();
    formData.append('id', id.toString());

    const response = await axios.delete(`/configs/delete?id=${id}`, { data: formData });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete configuration';
  }
};