import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const CreateSkillsModal = ({ user, onClose }) => {
  console.log(user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    type: "",
    usageFrequency: "",
    classement: "",
    language: "", // Added language field
  });
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch skills from backend
  useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await api.get('/api/skills/all');
        setSkills(response.data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setErrors({ general: "Failed to load skills. Please try again." });
      }
    };
    getSkills();
  }, []);

  // Predefined language options (since no database for languages)
  const languageOptions = [
    { value: "", label: "Select a language" },
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
  ];

  const formFields = [
    {
      id: "name",
      label: "Skill Name",
      type: "select",
      options: [
        { value: "", label: "Select a skill" },
        ...skills.map(skill => ({ value: skill.name, label: skill.name })),
      ],
    },
    {
      id: "language",
      label: "Language",
      type: "select",
      options: languageOptions,
    },
    {
      id: "level",
      label: "Proficiency Level",
      type: "select",
      options: [
        { value: "", label: "Select proficiency" },
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
        { value: "Expert", label: "Expert" },
      ],
    },
    {
      id: "type",
      label: "Skill Type",
      type: "select",
      options: [
        { value: "", label: "Select type" },
        { value: "Technical", label: "Technical" },
        { value: "Soft", label: "Soft" },
        { value: "Analytical", label: "Analytical" },
        { value: "Creative", label: "Creative" },
      ],
    },
    {
      id: "usageFrequency",
      label: "Usage Frequency",
      type: "select",
      options: [
        { value: "", label: "Select frequency" },
        { value: "Daily", label: "Daily" },
        { value: "Weekly", label: "Weekly" },
        { value: "Monthly", label: "Monthly" },
        { value: "Occasionally", label: "Occasionally" },
      ],
    },
    {
      id: "classement",
      label: "Certification/Ranking",
      type: "select",
      options: [
        { value: "", label: "Select certification" },
        { value: "Certified Professional", label: "Certified Professional" },
        { value: "Associate", label: "Associate" },
        { value: "Expert", label: "Expert" },
        { value: "None", label: "None" },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      if (!formData[field.id]) {
        newErrors[field.id] = `${field.label} is required.`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!user) {
      setErrors({ general: "User ID is missing. Please log in." });
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("candidate_id", user);
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await api.post("/api/skills", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Success:", response.data.message);
      navigate("/profile");
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to submit skill:", error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const newErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          newErrors[key] = apiErrors[key][0];
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error.response?.data.message || error.message });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      level: "",
      type: "",
      usageFrequency: "",
      classement: "",
      language: "",
    });
    setErrors({});
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-semibold">Add New Skill</h5>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block text-gray-700 mb-1">
                {field.label}
              </label>
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[field.id] ? "border-red-500" : "border-gray-300"
                }`}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
          {errors.general && (
            <div className="text-red-500 text-sm mb-4">{errors.general}</div>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Skill
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSkillsModal;