import React, { useState } from 'react';
import { Clock, Shield, Mail, Phone, LogOut, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import UseLogout from '../hooks/useLogout';
import { api } from '../api/api';

export default function AccountDeactivatedPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
    const logout = UseLogout();
  

  const handleContactAdmin = () => {
    setEmailSent(true);
    //code send notification admin
  };

  const handleLogout = () => {
    logout()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Account Pending Activation
            </h1>
            <p className="text-amber-100">
              Your account is currently under review
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Account Deactivated
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your account is currently deactivated and waiting for administrator approval. 
                This is a security measure to ensure all accounts meet our verification standards.
              </p>
            </div>

            {/* Status Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">What's happening?</h3>
                  <p className="text-sm text-amber-700">
                    Our administrators are reviewing your account. This process typically takes 1-3 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleContactAdmin}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
               >
                <Mail className="w-5 h-5 mr-2" />
                Contact Administrator
              </button>
            </div>

            {/* Success Message */}
            {emailSent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-sm text-green-700 font-medium">
                    Message sent to administrator successfully!
                  </p>
                </div>
              </div>
            )} 
          </div>

          
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Account activation is typically completed within 1-3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}