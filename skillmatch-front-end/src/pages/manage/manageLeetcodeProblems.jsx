import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarAdmin from "../../components/common/navbarAdmin";
import api from "../../api/axios";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";

const ManageLeetcodeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [skills, setSkills] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchProblems();
    fetchSkills();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/leetcode/problems");
      setProblems(response.data.data || response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError("Failed to load problems. Please try again later.");
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills/all");
      setSkills(response.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleDelete = async (id) => {
    // First confirmation step
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    // Actual deletion
    try {
      await api.delete(`/leetcode/problems/${id}`);
      setProblems(problems.filter(problem => problem.id !== id));
      setConfirmDelete(null);
      showNotification("Problem deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting problem:", err);
      showNotification("Failed to delete problem", "error");
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = searchQuery === "" || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === "" || 
      problem.difficulty === difficultyFilter;
    
    const matchesSkill = skillFilter === "" || 
      problem.skill_id.toString() === skillFilter;
    
    return matchesSearch && matchesDifficulty && matchesSkill;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage LeetCode Problems</h1>
            <Link
              to="/manage/addLeetcodeProblem"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <FaPlus className="mr-2" /> Add New Problem
            </Link>
          </div>

          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-4 rounded-md ${
              notification.type === "success" 
                ? "bg-green-100 text-green-700 border border-green-400" 
                : "bg-red-100 text-red-700 border border-red-400"
            }`}>
              {notification.message}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Title
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search problems..."
                />
              </div>

              {/* Difficulty filter */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Skill filter */}
              <div>
                <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Skill
                </label>
                <select
                  id="skill"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Problems list */}
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading problems...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No problems found. Add some problems to get started!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Cases
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProblems.map((problem) => (
                    <tr key={problem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {problem.skill ? problem.skill.name : "Unknown Skill"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Array.isArray(problem.test_cases) ? problem.test_cases.length : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(problem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/manage/editLeetcodeProblem/${problem.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Problem"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(problem.id)}
                            className="text-red-600 hover:text-red-900"
                            title={confirmDelete === problem.id ? "Click again to confirm" : "Delete Problem"}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageLeetcodeProblems; 