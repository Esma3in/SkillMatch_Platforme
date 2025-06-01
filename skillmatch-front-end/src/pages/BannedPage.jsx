import React, { useState } from 'react';
import { Shield, AlertTriangle, Mail, Phone, FileText, ExternalLink, Clock, Ban } from 'lucide-react';

export default function AccountBannedPage() {
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [appealText, setAppealText] = useState('');

  const handleSubmitAppeal = (e) => {
    e.preventDefault();
    if (appealText.trim()) {
      setAppealSubmitted(true);
      setAppealText('');
      // In a real app, you'd submit the appeal to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Ban className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Account Suspended
            </h1>
            <p className="text-red-100">
              Access to your account has been restricted
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Account Access Restricted
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your account has been suspended due to a violation of our Terms of Service or Community Guidelines. 
                This action was taken to maintain the safety and integrity of our platform.
              </p>
            </div>

            {/* Violation Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800 mb-1">Suspension Details</h3>
                  <p className="text-sm text-red-700 mb-3">
                    <strong>Reason:</strong> Community Guidelines Violation
                  </p>
                  <p className="text-sm text-red-700 mb-3">
                    <strong>Date:</strong> March 15, 2024
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>Status:</strong> Permanent Suspension
                  </p>
                </div>
              </div>
            </div>

            {/* Appeal Section */}
            {!appealSubmitted ? (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Submit an Appeal</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you believe this suspension was made in error, you can submit an appeal for review.
                </p>
                <div>
                  <textarea
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    placeholder="Please explain why you believe this suspension should be reviewed..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="4"
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center mt-2 mb-4">
                    <span className="text-xs text-gray-500">
                      {appealText.length}/500 characters
                    </span>
                  </div>
                  <button
                    onClick={handleSubmitAppeal}
                    disabled={!appealText.trim()}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Submit Appeal
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Appeal Submitted</h3>
                    <p className="text-sm text-blue-700">
                      Your appeal has been submitted and will be reviewed within 5-7 business days. 
                      You will receive an email with the decision.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Policy Links */}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              This action was taken in accordance with our Terms of Service to maintain platform safety.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Appeal decisions are typically communicated within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  );
}