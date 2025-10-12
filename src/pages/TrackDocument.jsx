import React, { useState } from 'react';
import { trackDocument } from '../api/trackingApi';
import { 
  FaSearch, 
  FaEye,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';
import InputField from '../components/reusable/InputField';
import Button from '../components/reusable/Button';
import StatusBadge from '../components/reusable/StatusBadge';
import TimelineItem from '../components/reusable/TimelineItem';
import InfoCard from '../components/reusable/InfoCard';
import { showCustomToast } from '../components/Toast/CustomToast';

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
      showCustomToast('Document tracking data loaded successfully!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tracking data';
      setError(errorMessage);
      showCustomToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchTrackingData(searchId.trim());
    } else {
      const errorMessage = 'Please enter a valid transaction ID';
      setError(errorMessage);
      showCustomToast(errorMessage, 'error');
    }
  };

  const handleClear = () => {
    setSearchId('');
    setTrackingData(null);
    setError(null);
    showCustomToast('Results cleared', 'info');
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
              <div className="flex-1">
                <InputField
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Transaction ID (e.g., TXN_DOC_4080675)"
                  icon={<FaSearch className="w-4 h-4" />}
                  className="mb-0"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  loading={loading}
                  loadingText="Tracking..."
                  disabled={loading}
                  className="!bg-red-900 hover:!bg-red-800 !mt-0 flex items-center gap-2 px-6"
                >
                  <FaSearch className="w-4 h-4" />
                  Track Document
                </Button>
                {trackingData && (
                  <Button
                    type="button"
                    onClick={handleClear}
                    className="!bg-gray-600 hover:!bg-gray-700 !mt-0 px-6"
                  >
                    Clear Results
                  </Button>
                )}
              </div>
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
                  <StatusBadge status={trackingData.status} />
                </div>
                <InfoCard 
                  title="Requestor Information" 
                  icon={<FaUser className="w-4 h-4" />}
                >
                  <div className="space-y-2">
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
                </InfoCard>
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
                      <TimelineItem 
                        key={status} 
                        status={status} 
                        isActive={isActive} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mobile Timeline */}
              <div className="md:hidden space-y-3">
                {Object.entries(trackingData.status_timeline).map(([status, isActive]) => (
                  <TimelineItem 
                    key={status} 
                    status={status} 
                    isActive={isActive} 
                    isMobile={true}
                  />
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
                      <Button
                        onClick={() => window.open(req.file_url, '_blank')}
                        className="!bg-red-900 hover:!bg-red-800 !mt-0 !py-2 !text-sm p-2 flex flex-row items-center"
                      >
                        <FaEye className="w-4 h-4 mr-2" />
                        View Document
                      </Button>
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
                  <InfoCard 
                    title="Document Description" 
                    icon={<FaInfoCircle className="w-4 h-4" />}
                  >
                    <p>{trackingData.full_details.document_details.description}</p>
                  </InfoCard>
                  <InfoCard 
                    title="Contact Information" 
                    icon={<FaUser className="w-4 h-4" />}
                  >
                    <div className="space-y-1">
                      <p><span className="font-medium">Phone:</span> {trackingData.full_details.account.contact_no}</p>
                      <p><span className="font-medium">Address:</span> {trackingData.full_details.account.house_no} {trackingData.full_details.account.street}, {trackingData.full_details.account.barangay}, {trackingData.full_details.account.municipality}</p>
                    </div>
                  </InfoCard>
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