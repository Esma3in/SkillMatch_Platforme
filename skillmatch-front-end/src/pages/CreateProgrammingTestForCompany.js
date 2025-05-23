import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Save, ArrowLeft } from "lucide-react";

export default function TestCreationForm() {
  const [formData, setFormData] = useState({
    objective: "",
    prerequisites: "",
    tools_required: "",
    before_answer: "",
    qcm_id: "",
    company_id: "",
    skill_id: "",
  });
  const [qcms, setQcms] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qcmsRes, companiesRes, skillsRes] = await Promise.all([
          api.get("/api/qcms/company"),
          api.get("/api/companies/company"),
          api.get("/api/skills/company"),
        ]);
        setQcms(Array.isArray(qcmsRes.data) ? qcmsRes.data : []);
        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err.response?.status === 404
            ? "Requested resource not found. Please check the server configuration."
            : "Unable to load the data required for the form."
        );
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.objective.trim()) {
      setError("The objective is required.");
      return false;
    }
    if (!formData.company_id) {
      setError("Please select a company.");
      return false;
    }
    if (!formData.skill_id) {
      setError("Please select a primary skill.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        objective: formData.objective,
        prerequisites: formData.prerequisites || null,
        tools_required: formData.tools_required || null,
        before_answer: formData.before_answer || null,
        qcm_id: formData.qcm_id ? parseInt(formData.qcm_id) : null,
        company_id: parseInt(formData.company_id),
        skill_id: parseInt(formData.skill_id),
      };

      const response = await api.post("/api/tests/company/create", submitData);
      console.log("Test created:", response.data);
      setSuccess(true);
      setFormData({
        objective: "",
        prerequisites: "",
        tools_required: "",
        before_answer: "",
        qcm_id: "",
        company_id: "",
        skill_id: "",
      });
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error while creating the test:", err);
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors.join(", "));
      } else {
        setError(
          err.response?.data?.message ||
            "An error occurred while creating the test."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <a href="#" className="text-blue-600 hover:underline text-sm">
            Back to list
          </a>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Create a New Test</h1>
        <p className="text-gray-600 mt-1">
          Set up the test details for candidates.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          Test created successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Main Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Objective <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Test objective"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prerequisites
                </label>
                <input
                  type="text"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prerequisites for the test"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Required Tools
                </label>
                <input
                  type="text"
                  name="tools_required"
                  value={formData.tools_required}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Required tools (e.g., VS Code, Node.js)"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Preliminary Instructions
                </label>
                <input
                  type="text"
                  name="before_answer"
                  value={formData.before_answer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructions before starting"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Company <span className="text-red-500">*</span>
              </label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Associated QCM
              </label>
              <select
                name="qcm_id"
                value={formData.qcm_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a QCM</option>
                {qcms.map((qcm) => (
                  <option key={qcm.id} value={qcm.id}>
                    {qcm.question}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Primary Skill <span className="text-red-500">*</span>
              </label>
              <select
                name="skill_id"
                value={formData.skill_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a primary skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {loading ? "Creating..." : "Save Test"}
          </button>
        </div>
      </form>
    </div>
  );
}