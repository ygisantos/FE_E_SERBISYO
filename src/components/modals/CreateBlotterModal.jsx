import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { createBlotter } from "../../api/blotterApi";
import { toast } from "react-toastify";
import municipalSeal from "../../assets/logo/santol_logo.png";

// Form initial state
const initialFormState = {
  complainant_name: "",
  respondent_name: "",
  additional_respondent: [],
  complaint_details: "",
  relief_sought: "",
  date_created: new Date().toISOString().split("T")[0],
  date_filed: new Date().toISOString().split("T")[0],
  received_by: "Barangay Secretary",
  case_type: "",
  status: "filed",
  created_by: null,  
};

const caseTypes = [
  "Utang",
  "Away Pamilya",
  "Noise Complaint",
  "Property Dispute",
  "Physical Injury",
  "Theft",
  "Harassment",
  "Other",
];

const CreateBlotterModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [additionalRespondent, setAdditionalRespondent] = useState("");

  const handleAddRespondent = () => {
    if (additionalRespondent.trim()) {
      setFormData((prev) => ({
        ...prev,
        additional_respondent: [...prev.additional_respondent, additionalRespondent.trim()],
      }));
      setAdditionalRespondent("");
    }
  };

  const handleRemoveRespondent = (index) => {
    setFormData((prev) => ({
      ...prev,
      additional_respondent: prev.additional_respondent.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await createBlotter(formData);
      toast.success("Blotter created successfully");
      setFormData(initialFormState);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to create blotter");
    }
  };

  // Format date to Filipino format
  const formatDateFilipino = (dateString) => {
    const months = [
      "Enero",
      "Pebrero",
      "Marso",
      "Abril",
      "Mayo",
      "Hunyo",
      "Hulyo",
      "Agosto",
      "Setyembre",
      "Oktubre",
      "Nobyembre",
      "Disyembre",
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ng ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Kanselahin
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-800"
          >
            I-submit
          </button>
        </div>
      }
    >
      <div className="space-y-8 print:space-y-6">
        {/* Print Controls - Hidden when printing */}
        <div className="print:hidden flex justify-end">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            <span>I-print</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="relative bg-white print:shadow-none">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none print:hidden">
            <div className="transform rotate-45 text-gray-200 text-9xl font-bold opacity-20">
              DRAFT
            </div>
          </div>

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
                  <input
                    type="text"
                    value={formData.blotter_number}
                    onChange={(e) =>
                      setFormData({ ...formData, blotter_number: e.target.value })
                    }
                    className="border-b border-gray-400 w-32 focus:outline-none focus:border-gray-600 text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the form content */}
          <div className="p-8 space-y-6">
            {/* Complainant and Respondent Section */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left side - Complainant */}
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.complainant_name}
                    onChange={(e) =>
                      setFormData({ ...formData, complainant_name: e.target.value })
                    }
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-red-500"
                    placeholder="Complainant's Name"
                    required
                  />
                  <p className="text-center font-bold mt-1">Nagsusumbong</p>
                </div>
                <p className="text-center">- laban -</p>
              </div>

              {/* Right side - Respondent and Case Type */}
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.respondent_name}
                    onChange={(e) =>
                      setFormData({ ...formData, respondent_name: e.target.value })
                    }
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-red-500"
                    placeholder="Respondent's Name"
                    required
                  />
                  <p className="text-center font-bold mt-1">Ipinagsusumbong</p>
                </div>
                <p className="text-center">- para -</p>

                {/* Additional Respondents */}
                <div>
                  <p className="text-sm font-medium">Additional Respondents:</p>
                  {formData.additional_respondent.map((name, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <span className="text-sm">{name}</span>
                      <button
                        onClick={() => handleRemoveRespondent(index)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={additionalRespondent}
                      onChange={(e) => setAdditionalRespondent(e.target.value)}
                      className="flex-1 border-b border-gray-400"
                      placeholder="Add respondent"
                    />
                    <button
                      onClick={handleAddRespondent}
                      className="text-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Case Type Selection */}
                <div className="space-y-2">
                  <select
                    value={formData.case_type}
                    onChange={(e) =>
                      setFormData({ ...formData, case_type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Case Type</option>
                    {caseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {formData.case_type === "Other" && (
                    <input
                      type="text"
                      placeholder="Specify other case type"
                      value={formData.other_case_type || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, other_case_type: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div className="space-y-4">
              <p className="font-bold">SUMBONG</p>
              <p className="text-sm">
                Ako/Kami ay nagsusumbong laban sa mga binabanggit sa itaas dahil
                sa paglabag sa akin/aming karapatan at kapakanan ayon sa mga
                sumusunod na paaran:
              </p>
              <textarea
                rows={5}
                value={formData.complaint_details}
                onChange={(e) =>
                  setFormData({ ...formData, complaint_details: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                required
              />
            </div>

            {/* Relief Sought */}
            <div className="space-y-4">
              <p className="text-sm">
                Dahil dito, ako/kami ay magalang na humihiling na inyong
                ipagkaloob sa akin/amin ang nararapat ayon sa batas o katwiran
                katulad ng mga sumusunod:
              </p>
              <textarea
                rows={3}
                value={formData.relief_sought}
                onChange={(e) =>
                  setFormData({ ...formData, relief_sought: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                required
              />
            </div>

            {/* Filing Details */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p>Ginawa ngayong ika-</p>
                <input
                  type="date"
                  value={formData.date_filed}
                  onChange={(e) =>
                    setFormData({ ...formData, date_filed: e.target.value })
                  }
                  className="border-b border-gray-400 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div className="text-center">
                <div className="mt-8 border-t border-gray-400 pt-1">
                  <p className="font-bold">Nagsusumbong</p>
                </div>
              </div>
            </div>

            {/* Receiving Details */}
            <div className="text-center">
              <p>
                Inihain at tinanggap ngayong ika-
                {new Date().toLocaleDateString()}
              </p>
              <div className="mt-8">
                <p className="font-bold">{formData.received_by}</p>
                <p className="font-bold">Punong Barangay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateBlotterModal;