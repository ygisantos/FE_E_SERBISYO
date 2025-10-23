import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { formatToYYYYMMDD } from "../../utils/dateUtils";
import { validateForm } from "../../utils/validations";
import { showCustomToast } from "../Toast/CustomToast";
import InputField from "../reusable/InputField";
import { updateAccountInformation } from "../../api/accountApi";
import { Mail, Phone, User, Calendar, MapPin } from "lucide-react";

const EditProfileModal = ({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  onSave,
}) => {
  const [invalidFields, setInvalidFields] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      const validation = validateForm(editForm);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        showCustomToast(firstError, "error");
        setInvalidFields(validation.errors);
        return;
      }
      setInvalidFields({});
      setLoading(true);

      const formattedData = {
        ...editForm,
        birthday: editForm.birthday
          ? formatToYYYYMMDD(editForm.birthday)
          : null,
      };

      const response = await updateAccountInformation(
        formattedData.id,
        formattedData
      );
      showCustomToast(response.message, "success");
      onSave(response.account);
      onClose();
    } catch (error) {
      showCustomToast(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Role Badge */}
        <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <div className="text-sm text-gray-900 capitalize">
              {editForm.type}
            </div>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            {editForm.status}
          </span>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="first_name"
              value={editForm.first_name || ""}
              onChange={(e) => {
                setEditForm({ ...editForm, first_name: e.target.value });
                if (invalidFields.first_name) {
                  setInvalidFields({ ...invalidFields, first_name: "" });
                }
              }}
              error={invalidFields.first_name}
              required
              icon={<User className="w-4 h-4" />}
            />

            <InputField
              label="Last Name"
              name="last_name"
              value={editForm.last_name || ""}
              onChange={(e) => {
                setEditForm({ ...editForm, last_name: e.target.value });
                if (invalidFields.last_name) {
                  setInvalidFields({ ...invalidFields, last_name: "" });
                }
              }}
              error={invalidFields.last_name}
              required
              icon={<User className="w-4 h-4" />}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={editForm.email || ""}
              onChange={(e) => {
                setEditForm({ ...editForm, email: e.target.value });
                if (invalidFields.email) {
                  setInvalidFields({ ...invalidFields, email: "" });
                }
              }}
              error={invalidFields.email}
              required
              readOnly
              disabled
              icon={<Mail className="w-4 h-4" />}
            />

            <InputField
              label="Contact Number"
              name="contact_no"
              type="tel"
              value={editForm.contact_no || ""}
              onChange={(e) => {
                setEditForm({ ...editForm, contact_no: e.target.value });
                if (invalidFields.contact_no) {
                  setInvalidFields({ ...invalidFields, contact_no: "" });
                }
              }}
              error={invalidFields.contact_no}
              required
              icon={<Phone className="w-4 h-4" />}
            />

            <InputField
              label="Birthday"
              name="birthday"
              type="date"
              value={editForm.birthday || ""}
              onChange={(e) => {
                setEditForm({ ...editForm, birthday: e.target.value });
                if (invalidFields.birthday) {
                  setInvalidFields({ ...invalidFields, birthday: "" });
                }
              }}
              error={invalidFields.birthday}
              required
              icon={<Calendar className="w-4 h-4" />}
            />

            <InputField
              label="Sex"
              name="sex"
              type="select"
              value={editForm.sex || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, sex: e.target.value })
              }
              options={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
              required
            />

            <InputField
              label="Birth Place"
              name="birth_place"
              value={editForm.birth_place || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, birth_place: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-white rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Address Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="House No."
              name="house_no"
              value={editForm.house_no || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, house_no: e.target.value })
              }
              error={invalidFields.house_no}
              required
            />

            <InputField
              label="Street"
              name="street"
              value={editForm.street || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, street: e.target.value })
              }
              error={invalidFields.street}
              required
            />

            <InputField
              label="Municipality"
              name="municipality"
              value={editForm.municipality || ""}
              readOnly
              className="bg-gray-50"
            />

            <InputField
              label="Barangay"
              name="barangay"
              value={editForm.barangay || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
