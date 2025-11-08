import React, { useState } from 'react';
import { Calendar, Download, FileText, BarChart3, Users, MessageSquare, Bell, ClipboardList, Activity, FolderOpen } from 'lucide-react';
import { FaFilePdf, FaFileExcel, FaEye, FaCalendarAlt, FaFilter, FaUsers, FaBalanceScale, FaFileAlt, FaBullhorn, FaComments, FaStar, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { generateReport, exportReportToExcel, exportListToExcel } from '../../api/reportApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import Select from '../../components/reusable/Select';
import ReportSummary from '../../components/reports/ReportSummary';
import ReportDetailView from '../../components/reports/ReportDetailView';

const Reports = () => {
  const [reportConfig, setReportConfig] = useState({
    report_type: 'monthly',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM format
    modules: [],
    format: 'json'
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detailed'

  // State for list export section
  const [listExportConfig, setListExportConfig] = useState({
    listType: 'residents',
    perPage: 10,
    filters: {}
  });
  const [exportingList, setExportingList] = useState(false);

  const reportTypeOptions = [
    { label: 'Monthly Report', value: 'monthly' },
    { label: 'Yearly Report', value: 'yearly' }
  ];

  const moduleOptions = [
    { label: 'Overview', value: 'overview', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Users', value: 'users', icon: <Users className="w-4 h-4" /> },
    { label: 'Requests', value: 'requests', icon: <FileText className="w-4 h-4" /> },
    { label: 'Blotters', value: 'blotters', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Feedbacks', value: 'feedbacks', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Announcements', value: 'announcements', icon: <Bell className="w-4 h-4" /> },
    { label: 'Certificates', value: 'certificates', icon: <FileText className="w-4 h-4" /> },
    { label: 'Activity Logs', value: 'activity_logs', icon: <Activity className="w-4 h-4" /> },
    { label: 'Documents', value: 'documents', icon: <FolderOpen className="w-4 h-4" /> }
  ];

  // Get current period suggestions
  const getCurrentPeriods = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const periods = [];
    
    if (reportConfig.report_type === 'monthly') {
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth - 1 - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        periods.push({ label, value: `${year}-${month}` });
      }
    } else {
      // Last 5 years
      for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        periods.push({ label: year.toString(), value: year.toString() });
      }
    }
    
    return periods;
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      
      // Create request payload, excluding modules if empty
      const requestPayload = {
        report_type: reportConfig.report_type,
        period: reportConfig.period,
        format: reportConfig.format
      };
      
      // Only include modules if there are selected modules
      if (reportConfig.modules.length > 0) {
        requestPayload.modules = reportConfig.modules;
      }
      
      const response = await generateReport(requestPayload);
      setReportData(response);
      showCustomToast('Report generated successfully', 'success');
    } catch (error) {
      showCustomToast(error.message || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      
      // Create request payload, excluding modules if empty
      const requestPayload = {
        report_type: reportConfig.report_type,
        period: reportConfig.period,
        format: reportConfig.format
      };
      
      // Only include modules if there are selected modules
      if (reportConfig.modules.length > 0) {
        requestPayload.modules = reportConfig.modules;
      }
      
      const result = await exportReportToExcel(requestPayload);
      showCustomToast(`Report exported successfully as ${result.filename}`, 'success');
    } catch (error) {
      showCustomToast(error.message || 'Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleModuleToggle = (moduleValue) => {
    setReportConfig(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleValue)
        ? prev.modules.filter(m => m !== moduleValue)
        : [...prev.modules, moduleValue]
    }));
  };

  const resetConfig = () => {
    setReportConfig({
      report_type: 'monthly',
      period: new Date().toISOString().slice(0, 7),
      modules: [],
      format: 'json'
    });
    setReportData(null);
  };

  // List export options
  const listTypeOptions = [
    { label: 'Residents List', value: 'residents', icon: <FaUsers className="w-4 h-4" /> },
    { label: 'Blotter Cases', value: 'blotters', icon: <FaBalanceScale className="w-4 h-4" /> },
    { label: 'Document Requests', value: 'requests', icon: <FaFileAlt className="w-4 h-4" /> },
    { label: 'Announcements', value: 'announcements', icon: <FaBullhorn className="w-4 h-4" /> },
    { label: 'Feedbacks', value: 'feedbacks', icon: <FaComments className="w-4 h-4" /> }
  ];

  const perPageOptions = [
    { label: '10 Records', value: 10 },
    { label: '25 Records', value: 25 },
    { label: '50 Records', value: 50 },
    { label: '100 Records', value: 100 },
    { label: '250 Records', value: 250 },
    { label: '500 Records', value: 500 },
    { label: '1000 Records', value: 1000 },
    { label: 'More (Custom)', value: 'more' }
  ];

  // Dynamic filter options based on list type
  const getFilterOptions = (listType) => {
    switch (listType) {
      case 'residents':
        return {
          type: [
            { label: 'All Types', value: '' },
            { label: 'Residence', value: 'residence' },
            { label: 'Admin', value: 'admin' },
            { label: 'Staff', value: 'staff' }
          ],
          status: [
            { label: 'All Status', value: '' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Pending', value: 'pending' }
          ]
        };
      case 'blotters':
        return {
          status: [
            { label: 'All Status', value: '' },
            { label: 'Filed', value: 'filed' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Settled', value: 'settled' },
            { label: 'Reopen', value: 'reopen' },
            { label: 'Unsettled', value: 'unsettled' }
          ]
        };
      case 'requests':
        return {
          status: [
            { label: 'All Status', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Processing', value: 'processing' },
            { label: 'Ready to Pickup', value: 'ready to pickup' },
            { label: 'Released', value: 'released' },
            { label: 'Rejected', value: 'rejected' }
          ]
        };
      case 'announcements':
        return {
          type: [
            { label: 'All Types', value: '' },
            { label: 'Information', value: 'information' },
            { label: 'Problem', value: 'problem' },
            { label: 'Warning', value: 'warning' }
          ]
        };
      case 'feedbacks':
        return {
          category: [
            { label: 'All Categories', value: '' },
            { label: 'Service', value: 'service' },
            { label: 'System', value: 'system' },
            { label: 'Staff', value: 'staff' },
            { label: 'Other', value: 'other' }
          ],
          rating: [
            { label: 'All Ratings', value: '' },
            { label: '5 Stars', value: '5' },
            { label: '4 Stars', value: '4' },
            { label: '3 Stars', value: '3' },
            { label: '2 Stars', value: '2' },
            { label: '1 Star', value: '1' }
          ]
        };
      default:
        return {};
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setListExportConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: value
      }
    }));
  };

  const handleExportList = async () => {
    try {
      setExportingList(true);
      
      const filters = {
        per_page: listExportConfig.perPage,
        ...listExportConfig.filters
      };
      
      const result = await exportListToExcel(listExportConfig.listType, filters);
      showCustomToast(
        `Successfully exported ${result.count} records to ${result.filename}`,
        'success'
      );
    } catch (error) {
      showCustomToast(error.message || 'Failed to export list. The list is empty', 'error');
    } finally {
      setExportingList(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-red-900" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Generate comprehensive reports for barangay operations and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaFilter className="text-red-900" />
              Report Configuration
            </h2>

            <div className="space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <Select
                  options={reportTypeOptions}
                  value={reportTypeOptions.find(opt => opt.value === reportConfig.report_type)}
                  onChange={(option) => setReportConfig(prev => ({ 
                    ...prev, 
                    report_type: option.value,
                    period: option.value === 'yearly' 
                      ? new Date().getFullYear().toString()
                      : new Date().toISOString().slice(0, 7)
                  }))}
                  isClearable={false}
                />
              </div>

              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period
                </label>
                <Select
                  options={getCurrentPeriods()}
                  value={getCurrentPeriods().find(opt => opt.value === reportConfig.period)}
                  onChange={(option) => setReportConfig(prev => ({ ...prev, period: option.value }))}
                  isClearable={false}
                />
              </div>

              {/* Module Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Include Modules (Optional)
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {moduleOptions.map((module) => (
                    <label 
                      key={module.value} 
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={reportConfig.modules.includes(module.value)}
                        onChange={() => handleModuleToggle(module.value)}
                        className="rounded border-gray-300 text-red-900 focus:ring-red-500"
                      />
                      <div className="ml-3 flex items-center gap-2">
                        {module.icon}
                        <span className="text-sm font-medium text-gray-700">
                          {module.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave empty to include all modules
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaEye />
                      Generate Report
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={exporting || !reportData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaFileExcel />
                      Export to Excel
                    </>
                  )}
                </button>

                <button
                  onClick={resetConfig}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Configuration
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Display */}
        <div className="xl:col-span-2">
          {reportData ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {reportData.report_info?.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Period: {reportData.report_info?.date_range?.from} to {reportData.report_info?.date_range?.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'summary' ? 'detailed' : 'summary')}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {viewMode === 'summary' ? 'Detailed View' : 'Summary View'}
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Generated: {reportData.report_info?.generated_at}</p>
                  <p>Generated by: {reportData.report_info?.generated_by}</p>
                </div>
              </div>

              {/* Report Content */}
              {viewMode === 'summary' ? (
                <ReportSummary 
                  data={reportData.data} 
                  selectedModules={reportConfig.modules} 
                />
              ) : (
                <ReportDetailView 
                  data={reportData.data} 
                  selectedModules={reportConfig.modules} 
                />
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Report Generated
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure your report settings and click "Generate Report" to view analytics and insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>Comprehensive Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Download className="w-4 h-4" />
                    <span>Excel Export</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List Export Section */}
      <div className="mt-8">
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border-2 border-blue-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-600" />
              Export Lists to Excel
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Export filtered lists of residents, blotters, requests, and more directly to Excel format
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* List Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select List Type
              </label>
              <Select
                options={listTypeOptions}
                value={listTypeOptions.find(opt => opt.value === listExportConfig.listType)}
                onChange={(option) => setListExportConfig(prev => ({ 
                  ...prev, 
                  listType: option.value,
                  filters: {} // Reset filters when changing list type
                }))}
                isClearable={false}
                formatOptionLabel={(option) => (
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                )}
              />
            </div>

            {/* Per Page Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Records to Export
              </label>
              <Select
                options={perPageOptions}
                value={perPageOptions.find(opt => opt.value === listExportConfig.perPage)}
                onChange={(option) => {
                  if (option.value === 'more') {
                    const customValue = prompt('Enter number of records (max 5000):', '1000');
                    if (customValue && !isNaN(customValue)) {
                      const numValue = Math.min(parseInt(customValue), 5000);
                      setListExportConfig(prev => ({ ...prev, perPage: numValue }));
                    }
                  } else {
                    setListExportConfig(prev => ({ ...prev, perPage: option.value }));
                  }
                }}
                isClearable={false}
              />
            </div>

            {/* Dynamic Filters */}
            {Object.entries(getFilterOptions(listExportConfig.listType)).map(([filterKey, options]) => (
              <div key={filterKey}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  Filter by {filterKey}
                </label>
                <Select
                  options={options}
                  value={options.find(opt => opt.value === (listExportConfig.filters[filterKey] || ''))}
                  onChange={(option) => handleFilterChange(filterKey, option.value)}
                  isClearable={false}
                />
              </div>
            ))}

            {/* Export Button */}
            <div className="flex items-end">
              <button
                onClick={handleExportList}
                disabled={exportingList}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {exportingList ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FaFileExcel />
                    Export to Excel
                  </>
                )}
              </button>
            </div>
          </div>

          {/* List Type Description */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-2xl flex items-center">
                {listTypeOptions.find(opt => opt.value === listExportConfig.listType)?.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  {listTypeOptions.find(opt => opt.value === listExportConfig.listType)?.label}
                  {Object.keys(listExportConfig.filters).length > 0 && 
                    Object.values(listExportConfig.filters).some(v => v !== '') && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaFilter className="w-3 h-3" />
                      Filtered
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {listExportConfig.listType === 'residents' && 
                    'Export complete list of registered residents with their personal information and contact details.'}
                  {listExportConfig.listType === 'blotters' && 
                    'Export blotter cases including case numbers, parties involved, case types, and status information.'}
                  {listExportConfig.listType === 'requests' && 
                    'Export document requests with requestor details, document types, status, and processing dates.'}
                  {listExportConfig.listType === 'announcements' && 
                    'Export announcements with types, descriptions, and posting dates.'}
                  {listExportConfig.listType === 'feedbacks' && 
                    'Export user feedbacks including categories, ratings, and remarks.'}
                </p>
                {Object.keys(listExportConfig.filters).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(listExportConfig.filters).map(([key, value]) => 
                      value && value !== '' ? (
                        <span key={key} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          <strong className="capitalize">{key}:</strong> {value}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;