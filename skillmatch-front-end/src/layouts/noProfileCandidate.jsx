import React from "react";
import { Link } from "react-router-dom"; // Using Link for SPA navigation

const NoProfilePrompt = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-lg mx-auto max-w-3xl mt-10">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's Get Started!
        </h2>
        <p className="text-base font-medium text-gray-700">
          You don’t have a profile yet.
        </p>
      </div>

      {/* Illustration/Icon Section */}
      <div className="mb-6">
        <img
          src="https://img.icons8.com/fluent/96/user-male-circle.png"
          alt="Profile creation illustration"
          className="w-40 h-40 object-contain"
        />
        {/* Fallback can be added if needed: onError={(e) => (e.target.src = "https://img.icons8.com/fluent/96/user.png")} */}
      </div>

      {/* Detailed Description Section */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
          Creating a profile is the first step to unlocking opportunities! Showcase your skills, experiences, education, and more to stand out to potential employers. A complete profile helps companies find you faster and increases your chances of landing your dream job.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <img
              src="https://img.icons8.com/fluent/48/visible.png"
              alt="Visibility icon"
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm font-medium text-gray-800">Increase Visibility</p>
          <p className="text-xs text-gray-500 text-center">
            Get noticed by top companies.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <img
              src="https://img.icons8.com/fluent/48/lightning-bolt.png"
              alt="Skills icon"
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm font-medium text-gray-800">Showcase Skills</p>
          <p className="text-xs text-gray-500 text-center">
            Highlight your expertise.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <img
              src="https://img.icons8.com/fluent/48/rocket.png"
              alt="Opportunities icon"
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm font-medium text-gray-800">Unlock Opportunities</p>
          <p className="text-xs text-gray-500 text-center">
            Connect with employers.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <Link
        to="/CreateProfile"
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 shadow-md"
      >
        Create Your Profile Now
      </Link>
    </div>
  );
};

export default NoProfilePrompt;