import { useState, useEffect } from "react";
import { api } from "../../api/api";

export default function CompanyProfileUpdateModal() {
  const company_id = JSON.parse(localStorage.getItem("company_id"));
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ceo: "",
    address: "",
    creation_date: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await api.get(`/api/company/profile/${company_id}`);
        const company = response.data;
        setFormData({
          name: company?.name || "",
          email: company?.user?.email || "",
          ceo: company?.ceo?.name || "",
          address: company?.profile?.address || "",
          creation_date: company.profile?.DateCreation || ""
        });
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    if (company_id) {
      fetchCompanyData();
    }
  }, [company_id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@")) newErrors.email = "Invalid email format";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.put("/api/company/updateprofile", {
        company_id: company_id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        ceo: formData.ceo.trim(),
        address: formData.address.trim(),
        creation_date: formData.creation_date
      });
      
      console.log("Success:", response.data);
      window.location.reload();
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Unexpected error:", error.message);
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <button
          type="button"
          onClick={openModal}
          className="flex text-indigo-600 hover:text-blue-700 text-sm font-medium items-center gap-2"
        >
          <img
            className="w-11 h-11 object-cover"
            alt="Edit Profile"
            src="https://c.animaapp.com/manu7kxgcmYZMO/img/e8f1e2c420b463d58afb4c92a8abaaf6-removebg-preview-1-1.png"
          />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">Update Company Profile</h5>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            {errors.general && (
              <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company email"
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              {/* CEO */}
              <div>
                <label htmlFor="ceo" className="block text-sm font-medium text-gray-700 mb-1">
                  CEO of the company
                </label>
                <input
                  type="text"
                  id="ceo"
                  name="ceo"
                  value={formData.ceo}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter CEO name"
                />
                {errors.ceo && <div className="text-red-500 text-sm mt-1">{errors.ceo}</div>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company address"
                />
                {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
              </div>

              {/* Creation Date */}
              <div>
                <label htmlFor="creation_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Creation Date
                </label>
                <input
                  type="date"
                  id="creation_date"
                  name="creation_date"
                  value={formData.creation_date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.creation_date && <div className="text-red-500 text-sm mt-1">{errors.creation_date}</div>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}