import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/common/navbarAdmin";
import { FaPlus, FaTrash } from "react-icons/fa";
import api from "../../api/axios";

const AddLeetcodeProblem = () => {
  const [skills, setSkills] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    constraints: "",
    skill_id: "",
    challenge_id: "",
    examples: [{ input: "", output: "", explanation: "" }],
    test_cases: [{ input: "", expected_output: "" }],
    starter_code: {
      javascript: "function solve() {\n  // Your code here\n}",
      python: "def solve():\n    # Your code here\n    pass",
      java: "public class Solution {\n    public void solve() {\n        // Your code here\n    }\n}",
      php: "<?php\nfunction solve() {\n    // Your code here\n}\n?>"
    },
    solution_code: {
      javascript: "function solve() {\n  // Solution code here\n}",
      python: "def solve():\n    # Solution code here\n    pass",
      java: "public class Solution {\n    public void solve() {\n        // Solution code here\n    }\n}",
      php: "<?php\nfunction solve() {\n    // Solution code here\n}\n?>"
    }
  });

  useEffect(() => {
    // Fetch skills and challenges on component mount
    const fetchData = async () => {
      try {
        const [skillsResponse, challengesResponse] = await Promise.all([
          api.get("/skills/all"),
          api.get("/challenges")
        ]);
        
        setSkills(skillsResponse.data);
        setChallenges(challengesResponse.data.data || challengesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load required data. Please refresh the page.");
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle code editor changes
  const handleCodeChange = (language, type, value) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [language]: value
      }
    });
  };

  // Handle example changes
  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[index] = { ...updatedExamples[index], [field]: value };
    setFormData({ ...formData, examples: updatedExamples });
  };

  // Add a new example
  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: "", output: "", explanation: "" }]
    });
  };

  // Remove an example
  const removeExample = (index) => {
    const updatedExamples = formData.examples.filter((_, i) => i !== index);
    setFormData({ ...formData, examples: updatedExamples });
  };

  // Handle test case changes
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.test_cases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  // Add a new test case
  const addTestCase = () => {
    setFormData({
      ...formData,
      test_cases: [...formData.test_cases, { input: "", expected_output: "", target: "" }]
    });
  };

  // Remove a test case
  const removeTestCase = (index) => {
    const updatedTestCases = formData.test_cases.filter((_, i) => i !== index);
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Format the data properly - ensure correct JSON structure for the database
      const formattedTestCases = formData.test_cases.map(testCase => {
        // Create a clean test case without empty fields
        const cleanedTestCase = {};
        
        // Handle input field - try to parse as JSON if it's a JSON string
        if (testCase.input && testCase.input.trim()) {
          try {
            if (testCase.input.trim().startsWith('[') || testCase.input.trim().startsWith('{')) {
              cleanedTestCase.input = JSON.parse(testCase.input);
            } else {
              cleanedTestCase.input = testCase.input;
            }
          } catch (e) {
            // If parsing fails, use as-is
            cleanedTestCase.input = testCase.input;
          }
        } else {
          cleanedTestCase.input = "";
        }
        
        // Handle expected output - try to parse as JSON if it's a JSON string
        if (testCase.expected_output && testCase.expected_output.trim()) {
          try {
            if (testCase.expected_output.trim().startsWith('[') || testCase.expected_output.trim().startsWith('{')) {
              cleanedTestCase.expected_output = JSON.parse(testCase.expected_output);
            } else {
              cleanedTestCase.expected_output = testCase.expected_output;
            }
          } catch (e) {
            // If parsing fails, use as-is
            cleanedTestCase.expected_output = testCase.expected_output;
          }
        } else {
          cleanedTestCase.expected_output = "";
        }
        
        // Handle target field if present (for Two Sum style problems)
        if (testCase.target && testCase.target.trim()) {
          // Try to convert to number if it's numeric
          const numericTarget = Number(testCase.target);
          cleanedTestCase.target = isNaN(numericTarget) ? testCase.target : numericTarget;
        }
        
        return cleanedTestCase;
      });

      const problem = {
        ...formData,
        // Parse arrays/objects correctly
        examples: JSON.stringify(formData.examples),
        test_cases: JSON.stringify(formattedTestCases),
        starter_code: JSON.stringify(formData.starter_code),
        solution_code: JSON.stringify(formData.solution_code)
      };

      // Send the data to the server
      const response = await api.post("/leetcode/problems", problem);
      
      console.log("Problem created:", response.data);
      setSuccess(true);
      
      // Reset the form
      setFormData({
        title: "",
        description: "",
        difficulty: "medium",
        constraints: "",
        skill_id: "",
        challenge_id: "",
        examples: [{ input: "", output: "", explanation: "" }],
        test_cases: [{ input: "", expected_output: "" }],
        starter_code: {
          javascript: "function solve() {\n  // Your code here\n}",
          python: "def solve():\n    # Your code here\n    pass",
          java: "public class Solution {\n    public void solve() {\n        // Your code here\n    }\n}",
          php: "<?php\nfunction solve() {\n    // Your code here\n}\n?>"
        },
        solution_code: {
          javascript: "function solve() {\n  // Solution code here\n}",
          python: "def solve():\n    # Solution code here\n    pass",
          java: "public class Solution {\n    public void solve() {\n        // Solution code here\n    }\n}",
          php: "<?php\nfunction solve() {\n    // Solution code here\n}\n?>"
        }
      });
    } catch (err) {
      console.error("Error creating problem:", err);
      setError(err.response?.data?.message || "Failed to create problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Add New LeetCode Problem</h1>
          </div>
          
          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p className="font-medium">Success! The problem was created successfully.</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Two Sum"
                  />
                </div>
                
                {/* Difficulty */}
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skill */}
                <div>
                  <label htmlFor="skill_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Category *
                  </label>
                  <select
                    id="skill_id"
                    name="skill_id"
                    value={formData.skill_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Challenge */}
                <div>
                  <label htmlFor="challenge_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Challenge (Optional)
                  </label>
                  <select
                    id="challenge_id"
                    name="challenge_id"
                    value={formData.challenge_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">None (Standalone Problem)</option>
                    {challenges.map((challenge) => (
                      <option key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Problem Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Problem Description</h2>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the problem in detail..."
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Use clear language and provide all necessary context for solving the problem.
                </p>
              </div>
              
              <div>
                <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-1">
                  Constraints
                </label>
                <textarea
                  id="constraints"
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 2 <= nums.length <= 104, -109 <= nums[i] <= 109"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Specify any constraints on input size, value ranges, etc.
                </p>
              </div>
            </div>
            
            {/* Examples */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Examples</h2>
                <button
                  type="button"
                  onClick={addExample}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  <FaPlus size={12} />
                  Add Example
                </button>
              </div>
              
              {formData.examples.map((example, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Example {index + 1}</h3>
                    {formData.examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Input *
                      </label>
                      <textarea
                        value={example.input}
                        onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Input for this example"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Output *
                      </label>
                      <textarea
                        value={example.output}
                        onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Expected output"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Explanation
                    </label>
                    <textarea
                      value={example.explanation}
                      onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Explain how the output is derived from the input"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Test Cases */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Test Cases</h2>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  <FaPlus size={12} />
                  Add Test Case
                </button>
              </div>
              
              <p className="mb-4 text-sm text-gray-600">
                Add comprehensive test cases to validate solutions. These are used to evaluate submitted code.
              </p>
              
              {formData.test_cases.map((testCase, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Test Case {index + 1}</h3>
                    {formData.test_cases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Input *
                      </label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Test case input (format depends on problem)"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Output *
                      </label>
                      <textarea
                        value={testCase.expected_output}
                        onChange={(e) => handleTestCaseChange(index, "expected_output", e.target.value)}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Expected output for this input"
                      ></textarea>
                    </div>
                  </div>

                  {/* Target field for Two Sum type problems */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target (Optional - for Two Sum type problems)
                    </label>
                    <input
                      type="text"
                      value={testCase.target || ""}
                      onChange={(e) => handleTestCaseChange(index, "target", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Target value (e.g. for Two Sum problem)"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Only needed for problems like "Two Sum" where a target value is required
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Code Templates */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Starter Code Templates</h2>
              
              <p className="mb-4 text-sm text-gray-600">
                Provide starter code templates for each supported language. This is what candidates will see when they begin solving.
              </p>
              
              <div className="space-y-6">
                {/* JavaScript */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JavaScript
                  </label>
                  <textarea
                    value={formData.starter_code.javascript}
                    onChange={(e) => handleCodeChange("javascript", "starter_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                {/* Python */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Python
                  </label>
                  <textarea
                    value={formData.starter_code.python}
                    onChange={(e) => handleCodeChange("python", "starter_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                {/* Java */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Java
                  </label>
                  <textarea
                    value={formData.starter_code.java}
                    onChange={(e) => handleCodeChange("java", "starter_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                {/* PHP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PHP
                  </label>
                  <textarea
                    value={formData.starter_code.php}
                    onChange={(e) => handleCodeChange("php", "starter_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Solution Code */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Solution Code</h2>
              
              <p className="mb-4 text-sm text-gray-600">
                Provide reference solutions for each supported language. These will be used for verification and hints.
              </p>
              
              <div className="space-y-6">
                {/* JavaScript */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JavaScript Solution
                  </label>
                  <textarea
                    value={formData.solution_code.javascript}
                    onChange={(e) => handleCodeChange("javascript", "solution_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                {/* Python */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Python Solution
                  </label>
                  <textarea
                    value={formData.solution_code.python}
                    onChange={(e) => handleCodeChange("python", "solution_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                {/* Java */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Java Solution
                  </label>
                  <textarea
                    value={formData.solution_code.java}
                    onChange={(e) => handleCodeChange("java", "solution_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                {/* PHP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PHP Solution
                  </label>
                  <textarea
                    value={formData.solution_code.php}
                    onChange={(e) => handleCodeChange("php", "solution_code", e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating Problem..." : "Create Problem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddLeetcodeProblem; 