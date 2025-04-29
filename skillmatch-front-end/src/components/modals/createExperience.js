import { ClockIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function CreateExperienceModal({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    experience: "",
    location: "",
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const formFields = [
    { id: "experience", label: "Experience" },
    { id: "location", label: "Location" },
    { id: "company", label: "Employment Type" },
    { id: "role", label: "Role" },
  ];

  const dateFields = [
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
  ];

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      experience: "",
      location: "",
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.experience.trim()) newErrors.experience = "Experience is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.company.trim()) newErrors.company = "Employment type is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";
    if (!formData.startDate.trim()) newErrors.startDate = "Start date is required.";

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (formData.startDate && !dateRegex.test(formData.startDate)) {
      newErrors.startDate = "Date must be in DD/MM/YYYY format.";
    }
    if (formData.endDate && formData.endDate.length && !dateRegex.test(formData.endDate)) {
      newErrors.endDate = "Date must be in DD/MM/YYYY format.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("candidate_id", user || "");

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await api.post("/api/experiences", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Success:", response.data.message);
      closeModal();
      window.location.reload();
     
    } catch (error) {
      console.error("Failed to submit experience:", error.response?.data || error.message);
      setErrors({ general: `Failed to save experience: ${error.message}` });
    }
  };

  return (
    <>
      <button
                    type="button"
                    onClick={openModal}
                    className="flex items-center px-4 py-2 bg-transparent text-white rounded-full focus:outline-none"
                >
                    <img src="assets/edit.png" alt="Edit icon" className="w-5 h-5 mr-2" />
                </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">Add Experience</h5>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    {errors[field.id] && (
                      <div className="text-red-500 text-sm mt-1">{errors[field.id]}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {dateFields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        className={`w-full px-4 py-2 border ${
                          errors[field.id] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <ClockIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                    </div>
                    {errors[field.id] && (
                      <div className="text-red-500 text-sm mt-1">{errors[field.id]}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-28 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter your description..."
                ></textarea>
              </div>

              {errors.general && (
                <div className="text-red-500 text-sm mt-2">{errors.general}</div>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
