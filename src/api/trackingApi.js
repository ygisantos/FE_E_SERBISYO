import axios from '../axios';

export const trackDocument = async (transactionId) => {
  try {
    const response = await axios.get(`/track-document/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};