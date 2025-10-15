import axios from '../axios';

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};
