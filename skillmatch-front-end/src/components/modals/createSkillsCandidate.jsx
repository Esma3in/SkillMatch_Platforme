import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const ModalSkill = ({ user, onClose }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        level: "",
        type: "",
        usageFrequency: "",
        classement: "",
    });

    const [errors, setErrors] = useState({});

    const formFields = [
        { id: "name", label: "Skill Name", placeholder: "e.g., JavaScript", position: "left" },
        { id: "level", label: "Proficiency Level", placeholder: "e.g., Intermediate", position: "left" },
        { id: "type", label: "Skill Type", placeholder: "e.g., Technical", position: "left" },
        { id: "usageFrequency", label: "Usage Frequency", placeholder: "e.g., Daily", position: "left" },
        { id: "classement", label: "Certification/Ranking", placeholder: "e.g., Certified Professional", position: "left" },
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
        if (!formData.name.trim()) newErrors.name = "Skill name is required.";
        else if (formData.name.length > 255) newErrors.name = "Skill name must be 255 characters or less.";
        if (!formData.level.trim()) newErrors.level = "Proficiency level is required.";
        else if (formData.level.length > 255) newErrors.level = "Proficiency level must be 255 characters or less.";
        if (!formData.type.trim()) newErrors.type = "Skill type is required.";
        else if (formData.type.length > 255) newErrors.type = "Skill type must be 255 characters or less.";
        if (!formData.usageFrequency.trim()) newErrors.usageFrequency = "Usage frequency is required.";
        else if (formData.usageFrequency.length > 255) newErrors.usageFrequency = "Usage frequency must be 255 characters or less.";
        if (!formData.classement.trim()) newErrors.classement = "Certification or ranking is required.";
        else if (formData.classement.length > 255) newErrors.classement = "Certification or ranking must be 255 characters or less.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted, sending POST to /api/skills", { user, formData });

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!user?.user_id) {
            setErrors({ general: "User ID is missing. Please log in." });
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("candidate_id", user.user_id);
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
            console.error("Failed to submit skill:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            if (error.response?.status === 422 && error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                const newErrors = {};
                Object.keys(apiErrors).forEach((key) => {
                    newErrors[key] = apiErrors[key][0];
                });
                setErrors(newErrors);
            } else {
                setErrors({ general: `Failed to save skill: ${error.response?.data.message || error.message}` });
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
                            Add a New Skill
                        </div>
                        <XIcon
                            className="w-5 h-5 cursor-pointer hover:text-gray-600"
                            onClick={handleCancel}
                        />
                    </div>

                    <hr className="my-4 border-gray-200" />

                    <form onSubmit={handleSubmit}>
                        <div className="flex h-[calc(100%-80px)]">
                            <div className="w-[376px] pr-8">
                                {formFields.map((field) => (
                                    <div key={field.id} className="mb-5">
                                        <label className="font-semibold text-gray-800 text-base mb-2 block">
                                            {field.label}
                                        </label>
                                        <input
                                            name={field.id}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            className={`h-[60px] rounded-xl border-2 w-full px-4 focus:outline-none focus:border-indigo-500 transition-colors duration-200 ${
                                                errors[field.id] ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder={field.placeholder}
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

                            <div className="w-[1px] bg-gray-200 mx-4 h-[388px] mt-2"></div>

                            <div className="flex-1 flex flex-col justify-end">
                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="submit"
                                        className="h-[55px] w-[160px] bg-indigo-600 text-white rounded-[9px] font-semibold text-base hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        Add Skill
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

export default ModalSkill;