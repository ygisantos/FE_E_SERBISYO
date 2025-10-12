import React, { useState } from 'react';
import { trackDocument } from '../api/trackingApi';
import { 
  FaSearch, 
  FaClock, 
  FaCheckCircle, 
  FaCog, 
  FaClipboardList, 
  FaGift, 
  FaTimes,
  FaEye,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa';

const TrackDocument = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');

  const fetchTrackingData = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await trackDocument(id);
      setTrackingData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchTrackingData(searchId.trim());
    } else {
      setError('Please enter a valid transaction ID');
    }
  };

  const handleClear = () => {
    setSearchId('');
    setTrackingData(null);
    setError(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      processing: 'bg-blue-500',
      ready_to_pickup: 'bg-purple-500',
      released: 'bg-emerald-600',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="w-4 h-4" />,
      approved: <FaCheckCircle className="w-4 h-4" />,
      processing: <FaCog className="w-4 h-4" />,
      ready_to_pickup: <FaClipboardList className="w-4 h-4" />,
      released: <FaGift className="w-4 h-4" />,
      rejected: <FaTimes className="w-4 h-4" />
    };
    return icons[status] || <FaInfoCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Document</h1>
            <p className="text-sm text-gray-600">
              Enter your transaction ID to track the status of your document request
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Transaction ID (e.g., TXN_DOC_4080675)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 disabled:bg-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Tracking...
                  </>
                ) : (
                  <>
                    <FaSearch className="w-4 h-4" />
                    Track Document
                  </>
                )}
              </button>
              {trackingData && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Clear Results
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3">
              <FaTimes className="w-5 h-5 text-red-500" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <>
            {/* Document Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{trackingData.document_type}</h2>
                  <p className="text-gray-600 font-mono text-sm mb-4 flex items-center gap-2">
                    <FaInfoCircle className="w-4 h-4" />
                    Transaction ID: {trackingData.transaction_id}
                  </p>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium ${getStatusColor(trackingData.status)}`}>
                    <span className="mr-2">{getStatusIcon(trackingData.status)}</span>
                    <span>{trackingData.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Requestor Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Name:</span> {trackingData.requestor.name}</p>
                    <p><span className="font-medium text-gray-700">Email:</span> {trackingData.requestor.email}</p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="w-3 h-3 text-gray-500" />
                      <span className="font-medium text-gray-700">Request Date:</span> {trackingData.request_date}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="w-3 h-3 text-gray-500" />
                      <span className="font-medium text-gray-700">Last Updated:</span> {trackingData.last_updated}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Status Timeline</h3>
              <div className="hidden md:block">
                {/* Desktop Timeline */}
                <div className="relative">
                  <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
                  <div className="flex justify-between relative z-10">
                    {Object.entries(trackingData.status_timeline).map(([status, isActive]) => (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md text-white ${
                          isActive ? getStatusColor(status) : 'bg-gray-300'
                        }`}>
                          {getStatusIcon(status)}
                        </div>
                        <span className={`mt-2 text-xs font-medium text-center max-w-20 ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mobile Timeline */}
              <div className="md:hidden space-y-3">
                {Object.entries(trackingData.status_timeline).map(([status, isActive]) => (
                  <div key={status} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      isActive ? getStatusColor(status) : 'bg-gray-300'
                    }`}>
                      {getStatusIcon(status)}
                    </div>
                    <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Log</h3>
              <div className="space-y-4">
                {trackingData.certificate_logs.map((log) => (
                  <div key={log.id} className="border-l-4 border-l-red-900 border border-gray-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <FaCalendarAlt className="w-3 h-3" />
                      {log.logged_at}
                    </div>
                    <p className="text-gray-900 font-medium mb-1">{log.remark}</p>
                    <p className="text-xs text-gray-600 italic flex items-center gap-2">
                      <FaUser className="w-3 h-3" />
                      {log.staff_name && log.staff_name.trim() ? (
                        <>By: {log.staff_name} ({log.staff_email})</>
                      ) : (
                        'System Generated'
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Requirements */}
            {trackingData.uploaded_requirements && trackingData.uploaded_requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Uploaded Requirements</h3>
                <div className="space-y-3">
                  {trackingData.uploaded_requirements.map((req, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="mb-3 sm:mb-0">
                        <span className="font-medium text-gray-900 block">
                          {req.requirement_name !== 'N/A' ? req.requirement_name : `Document ${index + 1}`}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <FaCalendarAlt className="w-3 h-3" />
                          Uploaded: {req.uploaded_at}
                        </span>
                      </div>
                      <a 
                        href={req.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-red-900 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors duration-200"
                      >
                        <FaEye className="w-4 h-4 mr-2" />
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {trackingData.full_details && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaInfoCircle className="w-4 h-4 text-gray-600" />
                      Document Description
                    </h4>
                    <p className="text-gray-700 text-sm">{trackingData.full_details.document_details.description}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-gray-600" />
                      Contact Information
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">Phone:</span> {trackingData.full_details.account.contact_no}</p>
                      <p><span className="font-medium">Address:</span> {trackingData.full_details.account.house_no} {trackingData.full_details.account.street}, {trackingData.full_details.account.barangay}, {trackingData.full_details.account.municipality}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackDocument;