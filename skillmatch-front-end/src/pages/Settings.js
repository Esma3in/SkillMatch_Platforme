import React, { useState, useEffect } from 'react';
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
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
    }
  });

  // Get candidate ID from localStorage
  const candidateId = JSON.parse(localStorage.getItem('candidate_id'));

  // Fetch candidate profile data
useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
  
        // Récupération sécurisée de l'ID depuis le localStorage
        const storedId = JSON.parse(localStorage.getItem("candidate_id"));
        if (!storedId) throw new Error("No candidate ID found in localStorage");
  
        const response = await api.get(`/api/candidate/settings/${storedId}`);
  
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
  }, []);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
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
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('candidate_id', candidateId);
      formDataObj.append('username', formData.username);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone_number', formData.phoneNumber);
      formDataObj.append('biography', formData.biography);
      
      // Append photo if selected
      if (formData.photo) {
        formDataObj.append('photo', formData.photo);
      }
      
      // Append social media links
      Object.entries(formData.socialMedia).forEach(([platform, url]) => {
        if (url) {
          formDataObj.append(`social_media[${platform}]`, url);
        }
      });
      
      // Send update request
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
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
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
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to change password. Please try again.');
      }
      
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Cancel form submission
  const handleCancel = () => {
    // Redirect back to profile page
    window.location.href = '/ProfileCandidate';
  };

  if (loading) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCandidate />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Profile</h2>
          <p className="text-gray-600 mb-6">Please update your profile settings here</p>
          
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Phone Number */}
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {formData.photoPreview ? (
                    <img 
                      src={formData.photoPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <label className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md cursor-pointer">
                    Edit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.photoPreview && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Biography */}
            <div className="mb-6">
              <label htmlFor="biography" className="block text-gray-700 font-medium mb-2">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {formData.biography ? 500 - formData.biography.length : 500} characters remaining
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Social Media Links</h3>
              <p className="text-gray-600 mb-4">Links for your social media</p>
              
              {/* Facebook */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    facebook.com/
                  </span>
                  <input
                    type="text"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleInputChange}
                    className="pl-28 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your-username"
                  />
                </div>
              </div>
              
              {/* Twitter */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    twitter.com/
                  </span>
                  <input
                    type="text"
                    name="socialMedia.twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleInputChange}
                    className="pl-28 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your-username"
                  />
                </div>
              </div>
              
              {/* Discord */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    discord.com/
                  </span>
                  <input
                    type="text"
                    name="socialMedia.discord"
                    value={formData.socialMedia.discord}
                    onChange={handleInputChange}
                    className="pl-28 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your-username"
                  />
                </div>
              </div>
              
              {/* LinkedIn */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    linkedin.com/in/
                  </span>
                  <input
                    type="text"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleInputChange}
                    className="pl-32 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your-username"
                  />
                </div>
              </div>
              
              {/* GitHub */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    github.com/
                  </span>
                  <input
                    type="text"
                    name="socialMedia.github"
                    value={formData.socialMedia.github}
                    onChange={handleInputChange}
                    className="pl-28 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your-username"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Password Change Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Password</h2>
          
          <form onSubmit={handlePasswordChange}>
            {/* Current Password */}
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* New Password */}
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength="8"
              />
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 8 characters
              </p>
            </div>
            
            {/* Confirm New Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}