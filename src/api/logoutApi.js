import axios from '../axios';

export const logout = async (email, password) => {
  try {
    const formData = { email, password };
    const response = await axios.post('/logout', formData);
    // Remove user data from localStorage after successful logout
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Logout failed';
  }
};
