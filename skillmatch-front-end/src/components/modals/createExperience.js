import { ClockIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../../api/api';

const ModalExp = ({ user, onClose }) => {
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
    { id: "experience", label: "Experience", position: "left" },
    { id: "location", label: "Location", position: "left" },
    { id: "company", label: "Employment Type", position: "left" },
    { id: "role", label: "Role", position: "left" },
  ];

  const dateFields = [
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
  ];

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
    console.log("Form submitted, sending POST to /api/experiences", { user, formData, currentPath: window.location.pathname });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("candidate_id", user?.user_id || "");
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await api.post("/api/experiences", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Success:", response.data.message);
      navigate("/profile");
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to submit experience:", error.response?.data || error.message);
      setErrors({ general: `Failed to save experience: ${error.message}` });
    }
  };

  const handleCancel = () => {
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
    if (onClose) onClose();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[882px] h-[596px] relative bg-white shadow-xl rounded-2xl">
        <div className="p-7 h-full">
          <div className="flex justify-between items-center">
            <div className="font-medium text-black text-base leading-5">
              Creating an Experience
            </div>
            <XIcon
              className="w-5 h-5 cursor-pointer hover:text-gray-600"
              onClick={handleCancel}
            />
          </div>

          <hr className="my-4 border-gray-200" />

          <form onSubmit={handleSubmit} method="POST" action="">
            <div className="flex h-[calc(100%-80px)]">
              <div className="w-[376px] pr-8">
                {formFields.map((field) => (
                  <div key={field.id} className="mb-[20px]">
                    <div className="font-semibold text-gray-800 text-base mb-[10px]">
                      {field.label}
                    </div>
                    <input
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={`h-[60px] rounded-xl border-2 w-full px-4 focus:outline-none focus:border-indigo-500 transition-colors duration-200 ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    {errors[field.id] && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors[field.id]}
                      </div>
                    )}
                  </div>
                ))}
                {errors.general && (
                  <div className="text-red-500 text-sm mt-1">{errors.general}</div>
                )}
              </div>

              <div className="w-[1px] bg-gray-200 mx-4 h-[388px] mt-[10px]"></div>

              <div className="w-[376px] pl-4">
                {dateFields.map((field) => (
                  <div key={field.id} className="mb-[20px]">
                    <div className="font-semibold text-gray-800 text-base mb-[10px] font-['Poppins',Helvetica]">
                      {field.label}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        className={`h-[60px] rounded-xl border-2 w-full px-4 pr-10 font-normal text-gray-500 text-sm font-['Manrope',Helvetica] focus:outline-none focus:border-indigo-500 transition-colors duration-200 ${
                          errors[field.id] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <ClockIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors[field.id] && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors[field.id]}
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-[20px]">
                  <div className="font-semibold text-gray-800 text-base leading-5 mb-[10px] font-['Poppins',Helvetica]">
                    Description
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="h-[120px] rounded-xl border-2 border-gray-300 p-3.5 resize-none w-full focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Create your description here..."
                  ></textarea>
                </div>

                <div className="flex gap-4 mt-[30px] justify-end">
                  <button
                    type="submit"
                    className="h-[55px] w-[160px] bg-indigo-600 text-white rounded-[9px] font-semibold text-base hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Create experience
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="h-[55px] w-[120px] bg-white text-blue-600 border-2 border-blue-600 rounded-[9px] font-semibold text-base hover:bg-blue-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalExp;