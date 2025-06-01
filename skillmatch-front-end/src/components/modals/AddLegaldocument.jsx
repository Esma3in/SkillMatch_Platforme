import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function AddLegalDocumentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    descriptions: [""] // Start with one empty description
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  const resetForm = () => {
    setFormData({
      title: "",
      descriptions: [""]
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.descriptions];
    newDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      descriptions: newDescriptions
    }));

    // Clear description errors
    if (errors.descriptions) {
      setErrors(prev => ({
        ...prev,
        descriptions: ""
      }));
    }
  };

  const addDescription = () => {
    setFormData(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, ""]
    }));
  };

  const removeDescription = (index) => {
    if (formData.descriptions.length > 1) {
      const newDescriptions = formData.descriptions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        descriptions: newDescriptions
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Validate descriptions
    const validDescriptions = formData.descriptions.filter(desc => desc.trim());
    if (validDescriptions.length === 0) {
      newErrors.descriptions = "At least one description is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Filter out empty descriptions
      const cleanedDescriptions = formData.descriptions.filter(desc => desc.trim());
      
      const documentData = {
        title: formData.title.trim(),
        descriptions: cleanedDescriptions
      };

      await onSubmit(documentData);
      handleClose();
    } catch (error) {
      console.error("Error adding legal document:", error);
      setErrors({ general: "Failed to add legal document. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Legal Document</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter document title"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Descriptions Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descriptions *
                </label>
                <button
                  type="button"
                  onClick={addDescription}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  Add Description
                </button>
              </div>

              <div className="space-y-3">
                {formData.descriptions.map((description, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <textarea
                        value={description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder={`Description ${index + 1}`}
                        rows="3"
                        disabled={loading}
                      />
                    </div>
                    {formData.descriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDescription(index)}
                        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors.descriptions && (
                <p className="text-red-500 text-sm mt-1">{errors.descriptions}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Document"}
          </button>
        </div>
      </div>
    </div>
  );
}

