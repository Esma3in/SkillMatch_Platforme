import { useState } from "react";
import { api } from "../../api/api";
import { FaPlus } from "react-icons/fa";

export default function AddLanguageModal() {
    const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        candidate_id:candidate_id,
        language: '',
        level: ''
    });

    const [errors, setErrors] = useState({});

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setFormData({ language: '', level: '' });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors on change
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            await api.get("/sanctum/csrf-cookie");
            const response = await api.post("/api/candidate/NewLanguage", formData);
            console.log("Success:", response.data);
            window.location.reload();
            closeModal();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Laravel validation errors
                setErrors(error.response.data.errors);
            } else {
                console.error("Unexpected error:", error.message);
            }
        }
    };


    return (
        <>
            <div>
                <button
                    type="button"
                    onClick={openModal}
                    className="flex text-indigo-600 hover:text-blue-700 text-sm font-medium flex items-center"
                          >
                       <FaPlus/>
                            Add
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <div className="flex justify-between items-center">
                            <h5 className="text-xl font-semibold">Add Language</h5>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="language" className="block text-gray-700">
                                    Language
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                >
                                    <option value="">Select language</option>
                                    <option value="French">French</option>
                                    <option value="English">English</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Spanish">Spanish</option>
                                </select>
                                {errors.language && (
                                    <div className="text-red-500 text-sm mt-1">{errors.language[0]}</div>
                                )}

                            </div>

                            <div className="mb-4">
                                <label htmlFor="level" className="block text-gray-700">
                                    Level
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                >
                                    <option value="">Select level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Native">Native</option>
                                </select>
                                {errors.level && (
                                    <div className="text-red-500 text-sm mt-1">{errors.level[0]}</div>
                                )}

                            </div>

                            <div className="text-right">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Add Language
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
