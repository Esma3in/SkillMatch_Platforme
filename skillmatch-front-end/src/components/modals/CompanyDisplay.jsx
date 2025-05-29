import React, { useState } from "react";

const CompanyDisplay = ({ selectedCompaniesData, setSelectedCompaniesData }) => {
  const [isRemoving, setIsRemoving] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleRemove = (company) => {
    if (window.confirm(`Are you sure you want to remove ${company.name}?`)) {
      setIsRemoving(company.name);
      setTimeout(() => {
        setSelectedCompaniesData((prev) =>
          prev.filter((c) => c !== company)
        );
        setIsRemoving(null);
      }, 500); // Simulate a short delay
    }
  };

  const visibleCompanies = showAll ? selectedCompaniesData : selectedCompaniesData.slice(0, 1);

  if (selectedCompaniesData.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-2">No companies selected.</p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        {selectedCompaniesData.length > 1 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition"
          >
            {showAll ? "See Less" : "See All >"}
          </button>
        )}
      </div>
      <div className="space-y-4">
        {visibleCompanies.map((company) => (
          <div
            key={company.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.target.src = "/default-logo.png")}
                  />
                ) : (
                  "UT" // Placeholder initials
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{company.name}</h3>
                <p className="text-xs text-gray-600 truncate flex-wrap w-20 " title={company.Bio}>
                  {company.Bio || "No bio available"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
                {company.address || "No address"}
              </span>
              <button
                onClick={() => handleRemove(company)}
                disabled={isRemoving === company.name}
                className="text-xs font-medium text-red-500 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRemoving === company.name ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDisplay;