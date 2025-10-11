import axios from '../axios';

export const createActivityLog = async (data) => {
  try {
    const response = await axios.post('/activitylogs/create', {
      account: data.account,  
      module: data.module,
      remark: data.remark
    });
    return response.data;
  } catch (error) {
    console.error('Activity Log Error:', error);
    throw new Error('Failed to create activity log');
  }
};

export const getAllActivityLogs = async ({
  page = 1,
  sort_by = 'created_at',
  order = 'desc',
  search = '',
  module = ''
} = {}) => {
  try {
    const response = await axios.get('/activitylogs', {
      params: {
        page,
        sort_by,
        order,
        search,
        module
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Activity Logs Error:', error);
    throw error.response?.data?.message || 'Failed to fetch activity logs';
  }
};
 