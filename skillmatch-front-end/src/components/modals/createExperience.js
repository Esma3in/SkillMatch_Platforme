import { CalendarIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function CreateExperienceModal({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    experience: "",
    customExperience: "",
    location: "",
    customLocation: "",
    company: "",
    customCompany: "",
    role: "",
    customRole: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const moroccanCities = [
    { value: "", label: "Select location" },
    { value: "Casablanca", label: "Casablanca" },
    { value: "Fez", label: "Fez" },
    { value: "Tangier", label: "Tangier" },
    { value: "Marrakesh", label: "Marrakesh" },
    { value: "Salé", label: "Salé" },
    { value: "Meknes", label: "Meknes" },
    { value: "Rabat", label: "Rabat" },
    { value: "Oujda", label: "Oujda" },
    { value: "Kenitra", label: "Kenitra" },
    { value: "Agadir", label: "Agadir" },
    { value: "Tetouan", label: "Tetouan" },
    { value: "Safi", label: "Safi" },
    { value: "Mohammedia", label: "Mohammedia" },
    { value: "Khouribga", label: "Khouribga" },
    { value: "El Jadida", label: "El Jadida" },
    { value: "Beni Mellal", label: "Beni Mellal" },
    { value: "Nador", label: "Nador" },
    { value: "Ksar El Kebir", label: "Ksar El Kebir" },
    { value: "Larache", label: "Larache" },
    { value: "Taza", label: "Taza" },
    { value: "Settat", label: "Settat" },
    { value: "Berrechid", label: "Berrechid" },
    { value: "Khemisset", label: "Khemisset" },
    { value: "Ifrane", label: "Ifrane" },
    { value: "Taroudant", label: "Taroudant" },
    { value: "Essaouira", label: "Essaouira" },
    { value: "Chefchaouen", label: "Chefchaouen" },
    { value: "Ouarzazate", label: "Ouarzazate" },
    { value: "Asilah", label: "Asilah" },
    { value: "Sidi Ifni", label: "Sidi Ifni" },
    { value: "Tinghir", label: "Tinghir" },
    { value: "Midelt", label: "Midelt" },
    { value: "Rissani", label: "Rissani" },
    { value: "Mhamid", label: "Mhamid" },
    { value: "Azrou", label: "Azrou" },
    { value: "Remote", label: "Remote" },
    { value: "Other", label: "Other" },
  ];

  const formFields = [
    {
      id: "experience",
      label: "Experience",
      type: "select",
      options: [
        { value: "", label: "Select experience" },
        { value: "Software Development", label: "Software Development" },
        { value: "Project Management", label: "Project Management" },
        { value: "Data Analysis", label: "Data Analysis" },
        { value: "UI/UX Design", label: "UI/UX Design" },
        { value: "DevOps", label: "DevOps" },
        { value: "Cybersecurity", label: "Cybersecurity" },
        { value: "Machine Learning", label: "Machine Learning" },
        { value: "Business Analysis", label: "Business Analysis" },
        { value: "Quality Assurance", label: "Quality Assurance" },
        { value: "Database Administration", label: "Database Administration" },
        { value: "Cloud Computing", label: "Cloud Computing" },
        { value: "Network Engineering", label: "Network Engineering" },
        { value: "Product Management", label: "Product Management" },
        { value: "Marketing", label: "Marketing" },
        { value: "Sales", label: "Sales" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      id: "location",
      label: "Location",
      type: "select",
      options: moroccanCities,
    },
    {
      id: "company",
      label: "Employment Type",
      type: "select",
      options: [
        { value: "", label: "Select employment type" },
        { value: "Full-time", label: "Full-time" },
        { value: "Part-time", label: "Part-time" },
        { value: "Contract", label: "Contract" },
        { value: "Freelance", label: "Freelance" },
        { value: "Internship", label: "Internship" },
        { value: "Temporary", label: "Temporary" },
        { value: "Volunteer", label: "Volunteer" },
        { value: "Apprenticeship", label: "Apprenticeship" },
        { value: "Seasonal", label: "Seasonal" },
        { value: "Consultant", label: "Consultant" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      id: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "", label: "Select role" },
        { value: "Software Engineer", label: "Software Engineer" },
        { value: "Product Manager", label: "Product Manager" },
        { value: "Data Scientist", label: "Data Scientist" },
        { value: "Designer", label: "Designer" },
        { value: "DevOps Engineer", label: "DevOps Engineer" },
        { value: "Business Analyst", label: "Business Analyst" },
        { value: "QA Engineer", label: "QA Engineer" },
        { value: "Security Analyst", label: "Security Analyst" },
        { value: "Team Lead", label: "Team Lead" },
        { value: "Solutions Architect", label: "Solutions Architect" },
        { value: "Database Administrator", label: "Database Administrator" },
        { value: "Network Engineer", label: "Network Engineer" },
        { value: "Marketing Manager", label: "Marketing Manager" },
        { value: "Sales Manager", label: "Sales Manager" },
        { value: "Consultant", label: "Consultant" },
        { value: "Other", label: "Other" },
      ],
    },
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
      customExperience: "",
      location: "",
      customLocation: "",
      company: "",
      customCompany: "",
      role: "",
      customRole: "",
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
    if (!formData.experience) {
      newErrors.experience = "Experience is required.";
    } else if (formData.experience === "Other" && !formData.customExperience.trim()) {
      newErrors.customExperience = "Custom experience is required when 'Other' is selected.";
    }
    if (!formData.location) {
      newErrors.location = "Location is required.";
    } else if (formData.location === "Other" && !formData.customLocation.trim()) {
      newErrors.customLocation = "Custom location is required when 'Other' is selected.";
    }
    if (!formData.company) {
      newErrors.company = "Employment type is required.";
    } else if (formData.company === "Other" && !formData.customCompany.trim()) {
      newErrors.customCompany = "Custom employment type is required when 'Other' is selected.";
    }
    if (!formData.role) {
      newErrors.role = "Role is required.";
    } else if (formData.role === "Other" && !formData.customRole.trim()) {
      newErrors.customRole = "Custom role is required when 'Other' is selected.";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }
    return newErrors;
  };

  const formatDateToDMY = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
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
      formDataToSend.append("experience", formData.experience === "Other" ? formData.customExperience : formData.experience);
      formDataToSend.append("location", formData.location === "Other" ? formData.customLocation : formData.location);
      formDataToSend.append("company", formData.company === "Other" ? formData.customCompany : formData.company);
      formDataToSend.append("role", formData.role === "Other" ? formData.customRole : formData.role);
      formDataToSend.append("startDate", formatDateToDMY(formData.startDate));
      formDataToSend.append("endDate", formatDateToDMY(formData.endDate));
      formDataToSend.append("description", formData.description);

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
                    <select
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formData[field.id] === "Other" && (
                      <input
                        type="text"
                        name={`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`}
                        value={formData[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`]}
                        onChange={handleChange}
                        placeholder={`Enter custom ${field.label.toLowerCase()}`}
                        className={`w-full px-4 py-2 border mt-2 ${
                          errors[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    )}
                    {errors[field.id] && (
                      <div className="text-red-500 text-sm mt-1">{errors[field.id]}</div>
                    )}
                    {errors[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`] && (
                      <div className="text-red-500 text-sm mt-1">{errors[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`]}</div>
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
                        type="date"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${
                          errors[field.id] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
              
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