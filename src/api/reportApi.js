import axios from '../axios';

export const generateReport = async (reportData) => {
  try {
    const response = await axios.post('/dashboard/generate-report', reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to generate report';
  }
};

export const exportReportToExcel = async (reportData) => {
  try {
    const response = await axios.post('/dashboard/generate-report', reportData, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `${reportData.report_type}_report_${reportData.period}.xlsx`;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true, filename };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to export report';
  }
};