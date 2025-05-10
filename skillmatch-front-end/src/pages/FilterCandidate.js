import React, { useState, useEffect, useCallback } from "react";
import { api } from "../api/api";
import { Search, ChevronDown, Briefcase } from "lucide-react";

const FilterCandidate = () => {
  const [filters, setFilters] = useState({ domain: "", skill: "" });
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
  });

  const domainOptions = [
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile Development" },
    { id: "ai", name: "AI & Machine Learning" },
    { id: "data", name: "Data & Database" },
    { id: "cloud", name: "Cloud Computing" },
    { id: "devops", name: "DevOps" },
  ];

  // Load skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("/api/skills");
        const skills = Array.isArray(response.data)
          ? response.data.map((skill) => (typeof skill === "string" ? skill : skill.name))
          : [];
        setAvailableSkills(skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setAvailableSkills([]);
      }
    };
    fetchSkills();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch candidates based on filters
  const handleApplyFilters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure the API endpoint path is correct
      const response = await api.get("/api/candidates/filter", {
        params: {
          domain: filters.domain || undefined,
          skill: filters.skill || undefined,
          page: pagination.currentPage,
          perPage: pagination.perPage,
        },
      });
      
      console.log("API Response:", response.data);
      
      setCandidates(response.data.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.meta?.last_page || 1,
      }));
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError(`Failed to fetch candidates: ${error.response?.data?.message || error.message}`);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  // Change page
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Fetch candidates when page changes
  useEffect(() => {
    if (filters.domain || filters.skill || candidates.length > 0) {
      handleApplyFilters();
    }
  }, [pagination.currentPage, handleApplyFilters]);

  // Skill badge colors
  const getSkillColor = (index) => {
    const colors = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800"];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Debug Info */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Filter Section */}
      <div className="bg-white p-4 rounded shadow mb-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={filters.domain}
              onChange={(e) => handleFilterChange("domain", e.target.value)}
            >
              <option value="">Any domain</option>
              {domainOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Skill</label>
            <button
              className="w-full border rounded p-2 text-sm text-left flex justify-between items-center"
              onClick={() => setIsSkillsOpen(!isSkillsOpen)}
            >
              {filters.skill || "Any skill"}
              <ChevronDown size={16} className={isSkillsOpen ? "rotate-180" : ""} />
            </button>
            {isSkillsOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                <div
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleFilterChange("skill", "");
                    setIsSkillsOpen(false);
                  }}
                >
                  Any skill
                </div>
                {availableSkills.map((skill) => (
                  <div
                    key={skill}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleFilterChange("skill", skill);
                      setIsSkillsOpen(false);
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Candidate List */}
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white p-4 rounded shadow border"
              >
                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={14} />
                  {candidate.field || "N/A"}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {candidate.skills?.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${getSkillColor(index)}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() =>
                    pagination.currentPage > 1 &&
                    handlePageChange(pagination.currentPage - 1)
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border rounded disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    pagination.currentPage < pagination.totalPages &&
                    handlePageChange(pagination.currentPage + 1)
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 border rounded disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-white rounded shadow">
            {error ? "Error loading candidates." : "No candidates found."}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCandidate;