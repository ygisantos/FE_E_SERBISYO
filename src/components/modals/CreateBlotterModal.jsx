import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { createBlotter } from "../../api/blotterApi";
import { toast } from "react-toastify";

// Form initial state
const initialFormState = {
  blotter_number: "",
  remarks: "",
  incidents: "",
  reporter: "",
  status: "pending",
  location: "",
  incident_date: new Date().toISOString().split("T")[0],
};

const CreateBlotterModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async () => {
    try {
       const formattedDate = new Date(formData.incident_date)
        .toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });

      // Prepare the data for API submission
      const submissionData = {
        ...formData,
        incident_date: formattedDate
      };

      const response = await createBlotter(submissionData);
      
      // Show success message
      toast.success(response.message || 'Blotter created successfully');
      
      // Reset and close
      setFormData(initialFormState);
      onClose();
      
      // Notify parent to refresh data
      if (onSuccess) onSuccess();
      
    } catch (error) {
      // Show error message
      toast.error(error.message || 'Failed to create blotter');
      console.error('Error creating blotter:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setFormData(initialFormState);
        onClose();
      }}
      title="Create New Blotter Case"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setFormData(initialFormState);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Create Blotter
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blotter Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.blotter_number}
                  onChange={(e) =>
                    setFormData({ ...formData, blotter_number: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                  placeholder="e.g., 20001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.incident_date}
                  onChange={(e) =>
                    setFormData({ ...formData, incident_date: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location and Reporter Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location and Reporter</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                placeholder="Enter incident location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reporter ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.reporter}
                onChange={(e) =>
                  setFormData({ ...formData, reporter: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                placeholder="Enter reporter ID"
                required
              />
            </div>
          </div>
        </div>

        {/* Incident Details Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.incidents}
                onChange={(e) =>
                  setFormData({ ...formData, incidents: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                placeholder="e.g., Car Accident, Physical Altercation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                required
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                placeholder="Additional remarks about the incident..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Include all relevant details about the incident
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateBlotterModal;