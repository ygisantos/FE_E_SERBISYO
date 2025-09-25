import axios from '../axios';

export const login = async (email, password, setError) => {
  try {
    const formData = { email, password };
    const response = await axios.post('/login', formData);
    const { account, token } = response.data;

    if (account && account.type === 'residence' && account.status === 'pending') {
      setError('Your resident account is still pending approval. Please wait for verification.');
      return null;
    }

    return { token, account };
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Sorry, the username or password you entered is incorrect. Please try again."
    );
    throw error;
  }
};
