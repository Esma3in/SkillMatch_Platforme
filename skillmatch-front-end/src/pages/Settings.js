import React, { useState, useEffect } from 'react';
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [noProfile, setNoProfile] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phoneNumber: '',
    biography: '',
    photo: null,
    photoPreview: null,
    socialMedia: {
      facebook: '',
      twitter: '',
      discord: '',
      linkedin: '',
      github: ''
    },
    notifications: {
      emailUpdates: true,
      smsUpdates: false,
      pushNotifications: true
    }
  });

  // Get candidate ID from localStorage
  const candidateId = localStorage.getItem('candidate_id') ? JSON.parse(localStorage.getItem('candidate_id')) : null;

  // Fetch candidate profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        if (!candidateId) {
          setNoProfile(true);
          setLoading(false);
          return;
        }
        const response = await api.get(`/api/candidate/settings/${candidateId}`);
        const { candidate, profile, social_media } = response.data;
        setFormData({
          username: candidate.name || '',
          email: candidate.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          phoneNumber: profile?.phoneNumber || '',
          biography: profile?.description || '',
          photo: null,
          photoPreview: profile?.photoProfil 
            ? `http://localhost:8000/storage/${profile.photoProfil}` 
            : null,
          socialMedia: {
            facebook: social_media?.facebook || '',
            twitter: social_media?.twitter || '',
            discord: social_media?.discord || '',
            linkedin: social_media?.linkedin || '',
            github: social_media?.github || ''
          },
          notifications: {
            emailUpdates: true,
            smsUpdates: false,
            pushNotifications: true
          }
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load profile data', err);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [candidateId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  // Delete profile picture
  const handleDeletePhoto = async () => {
    try {
      setSaving(true);
      await api.post('/api/candidate/settings/delete-profile-picture', {
        candidate_id: candidateId
      });
      setFormData(prev => ({
        ...prev,
        photo: null,
        photoPreview: null
      }));
      setSuccess('Profile picture deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      setSaving(false);
    } catch (err) {
      console.error('Failed to delete profile picture', err);
      setError('Failed to delete profile picture. Please try again.');
      setTimeout(() => setError(null), 3000);
      setSaving(false);
    }
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('candidate_id', candidateId);
      formDataObj.append('username', formData.username);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone_number', formData.phoneNumber);
      formDataObj.append('biography', formData.biography);
      if (formData.photo) {
        formDataObj.append('photo', formData.photo);
      }
      Object.entries(formData.socialMedia).forEach(([platform, url]) => {
        if (url) {
          formDataObj.append(`social_media[${platform}]`, url);
        }
      });
      Object.entries(formData.notifications).forEach(([key, value]) => {
        formDataObj.append(`notifications[${key}]`, value);
      });
      await api.post('/api/candidate/settings/update', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Profile settings updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update profile settings', err);
      setError('Failed to update profile settings. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      setSaving(false);
      return;
    }
    try {
      await api.post('/api/candidate/settings/change-password', {
        candidate_id: candidateId,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword
      });
      setSuccess('Password changed successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to change password', err);
      setError(err.response?.data?.error || 'Failed to change password. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Cancel form submission
  const handleCancel = () => {
    window.location.href = '/companies/list';
  };

  // Navigate to profile creation
  const handleViewProfile = () => {
    window.location.href = '/profile';
  };

  if (noProfile) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md w-full transform transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile Not Found</h2>
            <p className="text-gray-600 mb-8 text-center">
              It looks like you're not logged in or don't have a profile yet.
            </p>
            <div className="flex flex-col space-y-4">
              <a
                href="/login"
                className="bg-indigo-600 text-white text-center py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Navigate to login page"
              >
                Login
              </a>
              <a
                href="/CreateProfile"
                className="bg-indigo-600 text-white text-center py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Navigate to create profile page"
              >
                Create Profile
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCandidate />
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Profile Settings</h1>
          <button
            onClick={handleViewProfile}
            className="relative bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="View your profile"
          >
            View Profile
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              !
            </span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-10 animate-slide-in">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-10 animate-slide-in">
            {success}
          </div>
        )}
        
        {/* Profile Settings Form */}
        <div className="bg-white shadow-xl rounded-xl p-10 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          <p className="text-gray-500 mb-8 text-sm">Update your personal details and social media links</p>
          
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-6 relative">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2 transition-all duration-300">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`pl-12 w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${!formData.username ? 'border-red-300' : 'border-gray-200'}`}
                  required
                  aria-required="true"
                />
    
              </div>
              {!formData.username && (
                <p className="text-red-500 text-sm mt-1">Username is required</p>
              )}
            </div>
            
            {/* Email */}
            <div className="mb-6 relative">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2 transition-all duration-300">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6m-18 0v8a2 2 0 002 2h12a2 2 0 002-2V8" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-12 w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${!formData.email ? 'border-red-300' : 'border-gray-200'}`}
                  required
                  aria-required="true"
                />
        
              </div>
              {!formData.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div className="mb-6 relative">
              <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2 transition-all duration-300">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V19H3V5z" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="pl-12 w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
         
              </div>
            </div>

            <hr className="my-8 border-gray-200" />
            
            {/* Profile Picture */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 shadow-md">
                  {formData.photoPreview ? (
                    <img 
                      src={formData.photoPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <svg
                        className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <label className="relative bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      !
                    </span>
                  </label>
                  {formData.photoPreview && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="relative bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      disabled={saving}
                      aria-label="Delete profile picture"
                    >
                      Delete
                      <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        !
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-200" />
            
            {/* Biography */}
            <div className="mb-8 relative">
              <label htmlFor="biography" className="block text-gray-700 font-medium mb-2">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows="5"
                className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                placeholder="Tell us about yourself"
                maxLength="500"
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                {formData.biography ? 500 - formData.biography.length : 500} characters remaining
              </p>
            </div>

            <hr className="my-8 border-gray-200" />
            
            {/* Social Media Links */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h3>
              <p className="text-gray-500 mb-6 text-sm">Add your social media profiles to enhance your visibility</p>
              
              {[
                { platform: 'facebook', prefix: 'facebook.com/' },
                { platform: 'twitter', prefix: 'twitter.com/' },
                { platform: 'discord', prefix: 'discord.com/' },
                { platform: 'linkedin', prefix: 'linkedin.com/in/' },
                { platform: 'github', prefix: 'github.com/' }
              ].map(({ platform, prefix }) => (
                <div className="mb-4 relative" key={platform}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 bg-gray-100 rounded-l-lg px-3">
                      {prefix}
                    </span>
                    <input
                      type="text"
                      name={`socialMedia.${platform}`}
                      value={formData.socialMedia[platform]}
                      onChange={handleInputChange}
                      className="pl-36 w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      placeholder={`your-${platform}-username`}
                      aria-label={`${platform} username`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-8 border-gray-200" />
            
            {/* Notification Preferences */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <p className="text-gray-500 mb-6 text-sm">Choose how you want to receive updates</p>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.emailUpdates"
                    checked={formData.notifications.emailUpdates}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-200 rounded"
                    aria-label="Email updates"
                  />
                  <span className="ml-3 text-gray-700">Email Updates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.smsUpdates"
                    checked={formData.notifications.smsUpdates}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-200 rounded"
                    aria-label="SMS updates"
                  />
                  <span className="ml-3 text-gray-700">SMS Updates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.pushNotifications"
                    checked={formData.notifications.pushNotifications}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-200 rounded"
                    aria-label="Push notifications"
                  />
                  <span className="ml-3 text-gray-700">Push Notifications</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        
        {/* Password Change Section */}
        <div className="bg-white shadow-xl rounded-xl p-10 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
          
          <form onSubmit={handlePasswordChange}>
            {/* Current Password */}
            <div className="mb-6 relative">
              <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${!formData.currentPassword ? 'border-red-300' : 'border-gray-200'}`}
                required
                aria-required="true"
              />
       
              {!formData.currentPassword && (
                <p className="text-red-500 text-sm mt-1">Current password is required</p>
              )}
            </div>
            
            {/* New Password */}
            <div className="mb-6 relative">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${formData.newPassword && formData.newPassword.length < 8 ? 'border-red-300' : 'border-gray-200'}`}
                required
                minLength="8"
                aria-required="true"
              />
        
              <p className="text-sm text-gray-500 mt-2">
                Password must be at least 8 characters
              </p>
              {formData.newPassword && formData.newPassword.length < 8 && (
                <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>
              )}
            </div>
            
            {/* Confirm New Password */}
            <div className="mb-6 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${formData.newPassword !== formData.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                required
                aria-required="true"
              />
       
              {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="relative bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                disabled={saving}
                aria-label="Update password"
              >
                {saving ? 'Updating...' : 'Update Password'}
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  !
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="relative px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Cancel changes"
            >
              Cancel
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                !
              </span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="relative px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
              disabled={saving}
              aria-label="Save changes"
            >
              {saving ? 'Saving...' : 'Save Changes'}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                !
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}