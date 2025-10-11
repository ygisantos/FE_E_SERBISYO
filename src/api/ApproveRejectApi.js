import axios from '../axios';

export const acceptAccount = async (accountId) => {
  try {
    const res = await axios.put(`/accounts/${accountId}/accept`);
    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw error.response.data.error;
    }
    throw error;
  }
};

export const rejectAccount = async (accountId, reason) => {
  try {
    const res = await axios.delete(`/accounts/${accountId}/reject`, {
      data: { reason }
    });
    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw error.response.data.error;
    }
    throw error;
  }
};
