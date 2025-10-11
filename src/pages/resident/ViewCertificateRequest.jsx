import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BarangayClearance from '../../components/certificates/BarangayClearance';

const ViewCertificateRequest = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  // Temporarily hardcode the data - replace with API call later
  const certificateData = {
    fullName: "John Doe",
    age: "25",
    civilStatus: "Single",
    address: "123 Street",
    purpose: "Local employment",
    dateIssued: new Date().toLocaleDateString()
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <BarangayClearance 
        data={certificateData}
        onClose={() => navigate('/resident/certificates')}
        previewOnly={true}
      />
    </div>
  );
};

export default ViewCertificateRequest;
