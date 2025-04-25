import { useState } from "react";
import { api } from "../../api/api";

export default function Bio() {
  const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));
  const [isOpen, setIsOpen] = useState(false);
  const [description, setdescription] = useState("");
  const [error, setError] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setdescription("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.put("/api/candidate/setdescription", {
        candidate_id: candidate_id,
        description: description.trim(),
      });
      console.log("Success:", response.data);
      window.location.reload();
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors?.description?.[0] || "Validation error");
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
          className="flex items-center px-4 py-2 bg-transparent text-white rounded-full focus:outline-none"
        >
          <img src="assets/edit.png" alt="Edit icon" className="w-5 h-5 mr-2" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">Add Description</h5>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                rows="5"
                placeholder="Write a short description about yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              <div className="text-right mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save description
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
