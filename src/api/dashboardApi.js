import axiosInstance from '../axios';

export const getDashboardOverview = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/overview', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardDocumentTypes = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/document-types', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardTopDocuments = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/top-documents', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardDocumentRequests = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/document-requests', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardUsers = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/users', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardPerformance = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/performance', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardMonthlyComparison = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/monthly-comparison', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getDashboardAllStatistics = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/all-statistics', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const generateDashboardReport = async (payload = {}) => {
  try {
    const res = await axiosInstance.post('/dashboard/generate-report', payload);
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getSystemStats = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/dashboard/system-stats', { params });
    return res.data;
  } catch (e) {
    return { success: false, error: e };
  }
};
