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
