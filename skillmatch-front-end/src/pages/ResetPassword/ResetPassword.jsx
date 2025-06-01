import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';

// You'll need to import your actual API
import { api } from '../../api/api';

// Mock API for demonstration - replace with your actual API

function ResetPassword() {
  // Extract token and email from URL
  const [token, setToken] = useState('');
  const [emailFromURL, setEmailFromURL] = useState('');

  useEffect(() => {
    // Get current URL
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    
    // Extract token from pathname
    // Format: /password-reset/TOKEN
    const pathParts = url.pathname.split('/');
    const extractedToken = pathParts[pathParts.length - 1]; // Last part of the path
    
    // Extract email from search params
    const extractedEmail = url.searchParams.get('email');
    
    setToken(extractedToken);
    setEmailFromURL(extractedEmail || '');
  }, []);

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e) => {
    if (e) e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/reset-password', {
        token,
        email: emailFromURL,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(response.data.message || 'Password has been reset successfully.');
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password && passwordConfirmation && password === passwordConfirmation;
  const passwordValid = password.length >= 6;

  // Show loading state while extracting URL params
  if (!token || !emailFromURL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          {!isSuccess ? (
            <div className="space-y-6">
              {/* Email Field (Disabled) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={emailFromURL}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${passwordValid ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm transition-colors duration-300 ${passwordValid ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid ? 'Strong password' : 'At least 6 characters required'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordConfirmation && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm transition-colors duration-300 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading || !passwordValid || !passwordsMatch}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-8 animate-fade-in">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
              <button
                onClick={() => window.location.href = '/signin'}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Messages */}
          {message && !isSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-slide-down">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Remember your password? 
            <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;