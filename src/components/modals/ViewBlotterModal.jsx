import React from "react";
import Modal from "../Modal/Modal";
import municipalSeal from "../../assets/logo/santol_logo.png";
import { FaPrint } from "react-icons/fa";

const ViewBlotterModal = ({ isOpen, onClose, data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="space-y-8 print:space-y-6">
        {/* Print Button - Hidden when printing */}
        <div className="print:hidden flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            <FaPrint />
            <span>I-print</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="relative bg-white print:shadow-none">
          {/* Header */}
          <div className="relative text-center font-serif">
            {/* Municipal Seal */}
            <div className="absolute left-0 top-0 w-24 h-24">
              <img
                src={municipalSeal}
                alt="Municipal Seal"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Heading Text */}
            <div className="space-y-1">
              <p className="text-sm">REPUBLIKA NG PILIPINAS</p>
              <p className="text-sm">LALAWIGAN NG BULACAN</p>
              <p className="text-sm">BAYAN NG BALAGTAS</p>
              <p className="text-sm font-bold">BARANGAY SANTOL</p>
            </div>

            {/* Legacy Text */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 origin-right -rotate-90 text-gray-400 text-sm tracking-widest">
              KEEPING THE LEGACY
            </div>

            {/* Form Title */}
            <div className="mt-8 space-y-4">
              <p className="font-bold">TANGGAPAN NG LUPONG TAGAPAMAYAPA</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">Form 7</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Usaping Barangay Blg.</span>
                  <span className="border-b border-gray-400 w-32 text-center">
                    {data?.case_number}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Complainant and Respondent Section */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left side - Complainant */}
              <div className="space-y-4">
                <div>
                  <div className="w-full border-b border-gray-400 text-center py-2">
                    {data?.complainant_name}
                  </div>
                  <p className="text-center font-bold mt-1">Nagsusumbong</p>
                </div>
                <p className="text-center">- laban -</p>
              </div>

              {/* Right side - Respondent */}
              <div className="space-y-4">
                <div>
                  <div className="w-full border-b border-gray-400 text-center py-2">
                    {data?.respondent_name}
                  </div>
                  <p className="text-center font-bold mt-1">Ipinagsusumbong</p>
                </div>
                <p className="text-center">- para -</p>
                <div className="w-full text-center font-medium">
                  {data?.case_type}
                </div>
              </div>
            </div>

            {/* Additional Respondents if any */}
            {data?.additional_respondent?.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Additional Respondents:</p>
                <div className="space-y-2">
                  {data.additional_respondent.map((name, index) => (
                    <div key={index} className="border-b border-gray-400 py-2">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaint Details */}
            <div className="space-y-4">
              <p className="font-bold">SUMBONG</p>
              <p className="text-sm">
                Ako/Kami ay nagsusumbong laban sa mga binabanggit sa itaas dahil
                sa paglabag sa akin/aming karapatan at kapakanan ayon sa mga
                sumusunod na paaran:
              </p>
              <div className="w-full border border-gray-300 rounded-md p-4 min-h-[100px] bg-gray-50">
                {data?.complaint_details}
              </div>
            </div>

            {/* Relief Sought */}
            <div className="space-y-4">
              <p className="text-sm">
                Dahil dito, ako/kami ay magalang na humihiling na inyong
                ipagkaloob sa akin/amin ang nararapat ayon sa batas o katwiran
                katulad ng mga sumusunod:
              </p>
              <div className="w-full border border-gray-300 rounded-md p-4 min-h-[80px] bg-gray-50">
                {data?.relief_sought}
              </div>
            </div>

            {/* Filing Details */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p>Ginawa ngayong ika-</p>
                <div className="border-b border-gray-400 py-2">
                  {new Date(data?.date_filed).toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <div className="mt-8 border-t border-gray-400 pt-1">
                  <p className="font-bold">{data?.complainant_name}</p>
                  <p className="text-sm">Nagsusumbong</p>
                </div>
              </div>
            </div>

            {/* Receiving Details */}
            <div className="text-center">
              <p>
                Inihain at tinanggap ngayong ika-
                {new Date(data?.date_created).toLocaleDateString()}
              </p>
              <div className="mt-8">
                <p className="font-bold">HON. MEL J. VENTURA</p>
                <p className="font-medium">Punong Barangay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewBlotterModal;
