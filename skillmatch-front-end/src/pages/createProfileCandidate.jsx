import React, { useState } from "react";
import { FaExclamationCircle, FaUpload, FaCamera, FaInfoCircle } from "react-icons/fa";
import "../styles/pages/Profiles/CandidateProfile.css";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";

export const Box = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));

  const [formData, setFormData] = useState({
    photoProfile: null,
    field: "",
    lastName: "",
    phone: "",
    file: null,
    projects: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const developmentFields = [
    "Web Development", "Mobile Development", "Frontend Development",
    "Backend Development", "Full Stack Development", "DevOps", "UI/UX Design",
  ];

  const moroccanCities = [
    "Agadir", "Casablanca", "Fès", "Marrakech", "Rabat", "Tangier", "Meknès",
    "Oujda", "Tétouan", "Safi", "Kenitra", "El Jadida", "Beni Mellal", "Nador", "Khouribga",
  ];

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    const file = files ? files[0] : null;
    setFormData((prev) => ({
      ...prev,
      [id]: file || value,
    }));

    if (file && id === "photoProfile") {
      setPhotoPreview(URL.createObjectURL(file));
    } else if (file && id === "file") {
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.field) newErrors.field = "Please select your field of expertise!";
    if (!formData.lastName.trim()) newErrors.lastName = "Please enter your last name!";
    else if (formData.lastName.length > 30) newErrors.lastName = "Last name must not exceed 30 characters!";
    const phoneRegex = /^\+?[0-9]{6,20}$/;
    if (!formData.phone.trim()) newErrors.phone = "Please enter your phone number!";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Invalid format (e.g., +212 654-000-00)!";
    if (!formData.file) newErrors.file = "Please upload your resume or portfolio!";
    if (!formData.projects.trim()) newErrors.projects = "Please describe your projects!";
    if (!formData.location) newErrors.location = "Please select your location!";
    if (!formData.photoProfile) newErrors.photoProfile = "Please upload a profile photo!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (candidate_id) formDataToSend.append("candidate_id", candidate_id);
      formDataToSend.append("field", formData.field);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("file", formData.file);
      formDataToSend.append("projects", formData.projects);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("photoProfile", formData.photoProfile);
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/profiles", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data.message);
      navigate("/profile");
      setFormData({
        photoProfile: null,
        field: "",
        lastName: "",
        phone: "",
        file: null,
        projects: "",
        location: "",
      });
      setErrors({});
      setPhotoPreview(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Failed to save profile. Please try again later." });
    }
  };

  const cancelSubmit = (e) => {
    e.preventDefault();
    setFormData({
      photoProfile: null,
      field: "",
      lastName: "",
      phone: "",
      file: null,
      projects: "",
      location: "",
    });
    setErrors({});
    setPhotoPreview(null);
    setFilePreview(null);
  };

  return (
    <>
      <NavbarCandidate />
      <div className="containerBox min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Descriptive Hero Section */}
          <div className="mb-10 text-center bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Your SkillMatch Journey</h1>
            <p className="text-lg text-gray-600 mb-4">
              Build a standout profile to showcase your skills and connect with opportunities in the digital world. Follow these steps to create a professional presence—let’s get started!
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">1</div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">2</div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">3</div>
              <p className="text-sm text-gray-500 mt-2 text-center block">Step 1: Create Your Profile</p>

            </div>
          </div>

          {/* Profile Form Card */}
          <div className="cardBox bg-white p-8 rounded-xl shadow-xl border border-gray-200">
            <form className="formGridBox space-y-6" onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div className="formGroupBox">
                <label htmlFor="photoProfile" className="formLabelBox block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaCamera className="mr-2 text-blue-500" /> Profile Photo
                  <span className="ml-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" title="Upload a clear headshot">
                    <FaInfoCircle />
                  </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="photoProfile"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                    aria-label="Upload profile photo"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("photoProfile").click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaUpload className="inline mr-2" /> Upload Photo
                  </button>
                  {photoPreview && (
                    <div className="mt-4">
                      <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-full mx-auto" />
                    </div>
                  )}
                </div>
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-2">
                  {errors.photoProfile && <FaExclamationCircle className="mr-1" />}
                  {errors.photoProfile}
                </p>
              </div>

              {/* Field */}
              <div className="formGroupBox">
                <label htmlFor="field" className="formLabelBox block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Field of Expertise
                  <span className="ml-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" title="Choose your primary skill area">
                    <FaInfoCircle />
                  </span>
                </label>
                <select
                  id="field"
                  className="formInputBox w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.field}
                  onChange={handleChange}
                  aria-label="Select your field of expertise"
                >
                  <option value="">Select a field</option>
                  {developmentFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-1">
                  {errors.field && <FaExclamationCircle className="mr-1" />}
                  {errors.field}
                </p>
              </div>

              {/* Last Name */}
              <div className="formGroupBox">
                <label htmlFor="lastName" className="formLabelBox block text-sm font-medium text-gray-700 mb-2">
                Name complet
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="formInputBox w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  aria-label="Enter your last name"
                />
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-1">
                  {errors.lastName && <FaExclamationCircle className="mr-1" />}
                  {errors.lastName}
                </p>
              </div>

              {/* Phone */}
              <div className="formGroupBox">
                <label htmlFor="phone" className="formLabelBox block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Phone Number
                  <span className="ml-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" title="Use format +212 654-000-00">
                    <FaInfoCircle />
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="formInputBox w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="+212 (654) 000-00"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-label="Enter your phone number"
                />
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-1">
                  {errors.phone && <FaExclamationCircle className="mr-1" />}
                  {errors.phone}
                </p>
              </div>

              {/* File Upload */}
              <div className="formGroupBox">
                <label htmlFor="file" className="formLabelBox block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Resume/Portfolio
                  <span className="ml-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" title="Upload PDF or DOCX files">
                    <FaInfoCircle />
                  </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleChange}
                    aria-label="Upload resume or portfolio"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("file").click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaUpload className="inline mr-2" /> Upload File
                  </button>
                  {filePreview && <p className="mt-2 text-sm text-gray-600">{filePreview}</p>}
                </div>
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-2">
                  {errors.file && <FaExclamationCircle className="mr-1" />}
                  {errors.file}
                </p>
              </div>

              {/* Projects */}
              <div className="formGroupBox">
                <label htmlFor="projects" className="formLabelBox block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Projects
                  <span className="ml-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" title="Highlight your key projects">
                    <FaInfoCircle />
                  </span>
                </label>
                <textarea
                  id="projects"
                  className="formTextareaBox w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Describe your key projects and accomplishments (e.g., built a responsive website using React)..."
                  value={formData.projects}
                  onChange={handleChange}
                  aria-label="Describe your projects"
                />
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-1">
                  {errors.projects && <FaExclamationCircle className="mr-1" />}
                  {errors.projects}
                </p>
              </div>

              {/* Location */}
              <div className="formGroupBox">
                <label htmlFor="location" className="formLabelBox block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Location
                  <span className="ml-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" title="Select your city in Morocco">
                    <FaInfoCircle />
                  </span>
                </label>
                <select
                  id="location"
                  className="formInputBox w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={handleChange}
                  aria-label="Select your location in Morocco"
                >
                  <option value="">Select a city</option>
                  {moroccanCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <p className="ErrorBox text-red-600 text-sm flex items-center mt-1">
                  {errors.location && <FaExclamationCircle className="mr-1" />}
                  {errors.location}
                </p>
              </div>

              {/* Actions */}
              <div className="actionsBox flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="btnOutlineBox px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={cancelSubmit}
                  aria-label="Cancel profile creation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btnPrimaryBox px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  aria-label="Save profile"
                >
                  Save
                </button>
              </div>
            </form>
            {errors.general && (
              <div className="text-red-600 text-sm flex items-center justify-center mt-4">
                <FaExclamationCircle className="mr-1" /> {errors.general}
              </div>
            )}
          </div>
        </div>
      </div>
 
    </>
  );
};