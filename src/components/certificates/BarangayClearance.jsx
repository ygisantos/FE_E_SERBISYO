import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import municipalSeal from '../../assets/logo/santol_logo.png'; 


const BarangayClearance = ({ data, onClose, onSubmit, previewOnly = false }) => {
  const standardPurposes = [
    'Local employment',
    'Overseas Employment',
    'Identification',
    'Postal Purpose',
    'Police Clearance',
    'License',
    'School Purpose',
    'Bank Purposes',
    'Franchise Permit'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Preview Notice and Back Button */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
          {previewOnly ? 'Back to Requests' : 'Back to Edit'}
        </button>
        {!previewOnly && (
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm flex-grow sm:flex-grow-0 text-center">
              Preview Mode - Please verify all details
            </div>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-red-900 text-white rounded-md text-sm font-medium hover:bg-red-800"
            >
              Submit Request
            </button>
          </div>
        )}
      </div>

      {/* Certificate Content */}
      <div className="bg-white p-4 sm:p-6 md:p-8 shadow-lg border relative overflow-x-auto">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform rotate-45 text-gray-200 text-5xl sm:text-7xl md:text-9xl font-bold opacity-20">
            PREVIEW
          </div>
        </div>

        {/* Header with adjusted spacing and positioning */}
        <div className="relative text-center mb-8">
          <div className="flex justify-between items-start mb-6">
            {/* Left: Municipal Seal */}
            <div className="w-16 sm:w-20 md:w-24">
              <img 
                src={municipalSeal} 
                alt="Municipal Seal" 
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Center: Header Text */}
            <div className="flex-1 px-4 sm:px-6 font-serif text-xs sm:text-sm space-y-0.5 max-w-sm mx-auto">
              <p>REPUBLIC OF THE PHILIPPINES</p>
              <p>PROVINCE OF BULACAN</p>
              <p>MUNICIPALITY OF BALAGTAS</p>
              <p className="font-bold">BARANGAY SANTOL</p>
            </div>

            {/* Right: Legacy Text (with improved responsive visibility) */}
            <div className="w-16 sm:w-20 md:w-24 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 origin-right -rotate-90 text-gray-400 text-[8px] sm:text-xs md:text-sm tracking-widest whitespace-nowrap">
                KEEPING THE LEGACY
              </div>
            </div>
          </div>

          {/* Office Title and Certificate Title with proper spacing */}
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            <p className="font-bold font-serif text-sm sm:text-base">
              OFFICE OF THE PUNONG BARANGAY
            </p>
            <h1 className="text-xl sm:text-2xl font-bold font-serif">
              BARANGAY CLEARANCE
            </h1>
          </div>
        </div>

         <div className="font-serif space-y-4 sm:space-y-6 text-xs sm:text-sm md:text-base">
          <p className="font-bold">TO WHOM IT MAY CONCERN:</p>

          <p className="text-justify leading-relaxed">
            This is to certify that the bearer, <span className="font-bold">{data?.fullName  }</span>,{' '}
            <span className="font-bold">{data?.age || '___'}</span> years old,{' '}
            <span className="font-bold">{data?.civilStatus || 'Single/Married/Widow/Widower'}</span> is a bonafide resident of{' '}
            <span className="font-bold">{data?.address || '_________________________________'}</span> Barangay Santol, Balagtas, Bulacan and a person of good moral character and a law abiding citizen of the community.
          </p>

          {/* Purpose Section */}
          <div className="mt-4 sm:mt-6">
            <p className="mb-2">This CERTIFICATION is issued upon the request of the above named person for:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {standardPurposes.map((purpose) => (
                <div key={purpose} className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 print:border-gray-900 flex items-center justify-center">
                    {purpose === data.purpose && "✓"}
                  </div>
                  <span className="text-sm">{purpose}</span>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 print:border-gray-900 flex items-center justify-center">
                  {!standardPurposes.includes(data.purpose) && "✓"}
                </div>
                <span className="text-sm">
                  Others: {!standardPurposes.includes(data.purpose) ? data.purpose : "_______________"}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
            <div>
              <p>DATE ISSUED: {data?.dateIssued || '_______________'}</p>
              <p>CTC No.: {data?.ctcNo || '_______________'}</p>
              <p>Issued at: {data?.issuedAt || '_______________'}</p>
              <p>Issued on: {data?.issuedOn || '_______________'}</p>
              <p>Control No: 25-0000-S</p>
            </div>
            <div className="text-justify text-center">
              <p>Approved by:</p>
              <div className="mt-14">
                <p className="font-bold">HON. MEL J. VENTURA</p>
                <p>Punong Barangay</p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 mt-8 sm:mt-12">
            <div className="text-center">
              <div className="border-t border-gray-400 mt-16 pt-1">
                Affiant
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 mt-8 pt-1">
                Kagawad
              </div>
            </div>
          </div>

          {/* Validity Notice */}
          <div className="flex flex-col justify-center items-center text-[10px] sm:text-xs">
            <div className="text-xs mt-8 text-center">
              <p className="font-bold">THIS CLEARANCE IS VALID FOR 6 MONTHS UPON ISSUANCE</p>
              <p className='text-xs'>*Use purpose only per clearance. Choose purpose is signed besides by authorized personnel only*</p>
              <p className='text-red-600'>*Not valid without official dry seal.*</p>
            </div>
          </div>
            <div className='border border-gray-400'></div>
          {/* Sangguniang Barangay */}
          <div className="p-2">
            <p className="font-bold text-center p-2 sm:p-4">SANGGUNIANG BARANGAY:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:text-xs">
              <p>HON. EDGARDO M. BAGAY</p>
              <p>HON. CESAR S. BIAG</p>
              <p>HON. SANTIAGO S. SOLINGAN</p>
              <p>HON. JONATHAN V. CABUJAT</p>
              <p>HON. MICHAEL H. SUAREZ</p>
              <p>HON. JOSEPHINE L. PAR</p>
              <p>HON. ELMER H. LIBIRAN</p>
              <p colSpan="2">HON. GERLYN LEEAN DC. DIMAGIRA - SK</p>
            </div>
          </div>

          {/* Officials */}
          <div className="grid grid-cols-2 gap-4 mt-6 sm:mt-8 text-center text-[10px] sm:text-sm">
            <div>
              <p className="font-bold">EDLYN R. GALVEZ</p>
              <p>Secretary</p>
            </div>
            <div>
              <p className="font-bold">GLENDELL A. DIZON</p>
              <p>Treasurer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Notice Footer */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-md">
        <p className="text-yellow-700 text-xs sm:text-sm">
          Note: This is a preview only. The official certificate will be issued at the barangay hall after verification and payment.
        </p>
      </div>
    </div>
  );
};

export default BarangayClearance;
