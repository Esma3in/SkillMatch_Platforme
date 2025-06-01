import { useState, useEffect } from "react";
import { api } from "../../api/api";

export default function CompanyBio() {
  const company_id = JSON.parse(localStorage.getItem("company_id"));
  const [isOpen, setIsOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setBio("");
    setError("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/company/bio/${company_id}`);
        setBio(response.data || "");
      } catch (error) {
        console.error("Error fetching company bio:", error);
        // If bio doesn't exist yet, keep bio empty
        setBio("");
      }
    };
    
    if (company_id) {
      fetchData();
    }
  }, [company_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!bio.trim()) {
      setError("Company bio cannot be empty.");
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.put("/api/company/updatebio", {
        company_id: company_id,
        bio: bio.trim(),
      });
      console.log("Success:", response.data);
      window.location.reload();
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors?.bio?.[0] || "Validation error");
      } else {
        console.error("Unexpected error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
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
            alt="Profile"
            src="https://c.animaapp.com/manu7kxgcmYZMO/img/e8f1e2c420b463d58afb4c92a8abaaf6-removebg-preview-1-1.png"
          />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">Update Company Bio</h5>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                name="bio"
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="6"
                placeholder="Write a bio about your company, its mission, values, and what makes it unique..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Bio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}