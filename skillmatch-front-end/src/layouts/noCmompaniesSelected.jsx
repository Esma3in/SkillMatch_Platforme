import React from "react";
import { Link } from "react-router-dom"; // Using Link for SPA navigation if needed

const NoCompaniesPrompt = ({ onBrowseCompanies }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-3xl mx-auto mt-10">
      {/* Header Section with Icon */}
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      </div>

      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        No Companies Selected Yet
      </h2>

      {/* Detailed Description */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
          Selecting companies you're interested in is a key step to connecting with potential employers. By choosing companies that align with your career goals, values, and skills, you can increase your chances of finding the perfect job match. Let’s get started by exploring companies that suit your aspirations!
        </p>
      </div>

      {/* Advice Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tips for Choosing the Right Companies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">Align with Your Goals</p>
            <p className="text-xs text-gray-500 text-center">
              Choose companies that match your career aspirations and industry interests.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">Research Thoroughly</p>
            <p className="text-xs text-gray-500 text-center">
              Look into company culture, values, and reviews to ensure a good fit.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">Match Your Skills</p>
            <p className="text-xs text-gray-500 text-center">
              Select companies where your skills and experience can shine.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <button
        onClick={onBrowseCompanies}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all shadow-md"
      >
        Browse Companies
      </button>
    </div>
  );
};

export default NoCompaniesPrompt;