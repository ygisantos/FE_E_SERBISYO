import axios from '../axios';

export const logout = async (email, password) => {
  try {
    const formData = { email, password };
    const response = await axios.post('/logout', formData);
    
    // Get user data before clearing
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    
    // Only clear chat messages if user is a resident
    if (userData.type === 'residence') {
      localStorage.removeItem('chat_messages');
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Logout failed';
  }
};
