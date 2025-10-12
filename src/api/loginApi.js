import axios from '../axios';

export const login = async (email, password) => {
  try {
    const formData = { email, password };
    const response = await axios.post('/login', formData);
    const { account, token } = response.data;

    // Check for error message in response
    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return { token, account };
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Sorry, the username or password you entered is incorrect. Please try again."
    );
  }
};
