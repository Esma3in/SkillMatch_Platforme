import React from 'react';
import { MdOutlineAttachFile } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import '../styles/pages/Profiles/CandidateProfile.css';

import {FaExclamationCircle} from 'react-icons/fa'

export const Box = () => {
  const [formData, setFormData] = useState({
    photoProfile: '',
    firstName: '',
    lastName: '',
    phone: '',
    file: '',
    projects: '',
    location: '',
  });

  const [errors, setErrors] = useState({
    photoProfile: '',
    firstName: '',
    lastName: '',
    phone: '',
    file: '',
    projects: '',
    location: '',
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: files ? files[0]?.name : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    // Validate FirstName
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'You must type your first name!';
    } else if (formData.firstName.length > 30) {
      newErrors.firstName = 'Your first name is too long!';
    }
  
    // Validate LastName
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'You must type your last name!';
    } else if (formData.lastName.length > 30) {
      newErrors.lastName = 'Your last name is too long!';
    }
  
    // Validate Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'You must type your phone number!';
    } else if (!/^\+?[0-9\s\-]{6,20}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format!';
    }
  
    // Validate File
    if (!formData.file) {
      newErrors.file = 'Please upload a file!';
    }
  
    // Validate Projects
    if (!formData.projects.trim()) {
      newErrors.projects = 'Project field cannot be empty!';
    }
  
    // Validate Location
    if (!formData.location.trim()) {
      newErrors.location = 'Please specify your location!';
    }
  
    // Validate PhotoProfile
    if (!formData.photoProfile) {
      newErrors.photoProfile = 'Please upload a profile photo!';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('file', document.querySelector('#file').files[0]);
        formDataToSend.append('projects', formData.projects);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('photoProfile', document.querySelector('#photoProfile').files[0]);
  
        const response = await fetch('/api/profiles', {
          method: 'POST',
          body: formDataToSend,
        });
  
        if (!response.ok) {
          throw new Error('Failed to save profile');
        }
  
        const result = await response.json();
        console.log(result.message); // "Profile created successfully!"
  
        // Reset form
        setFormData({
          photoProfile: '',
          firstName: '',
          lastName: '',
          phone: '',
          file: '',
          projects: '',
          location: '',
        });
        setErrors({});
  
        // Optionally show a success message to the user
        alert('Profile saved successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ general: 'Failed to save profile. Please try again.' });
      }
    }
  };
  const cancelSubmit = (e)=>{
    e.preventDefault()
    setFormData({
        
    photoProfile: '',
    firstName: '',
    lastName: '',
    phone: '',
    file: '',
    projects: '',
    location: '',
  })
    setErrors({
        photoProfile: '',
        firstName: '',
        lastName: '',
        phone: '',
        file: '',
        projects: '',
        location: '',
      })
  }
  return (
    <div className="containerBox">
      <div className="cardBox">
        <h1 className="titleBox">Create your profile on SkillMatch</h1>

        <form className="formGridBox" onSubmit={handleSubmit}>
          {/* Left column */}
          <section className="formSectionBox">
            <fieldset className="formGroupBox">
              <label htmlFor="photoProfile" className="formLabelBox">Profile Photo</label>
              <input
                type="file"
                id="photoProfile"
                accept="image/*"
                className="formInputBox"
                onChange={handleChange}
              />
            <p className="ErrorBox">
                        {errors.photoProfile && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.photoProfile}
             </p>
            </fieldset>

            <fieldset className="formGroupBox">
              <label htmlFor="firstName" className="formLabelBox">First Name</label>
              <input
                type="text"
                id="firstName"
                className="formInputBox"
                value={formData.firstName}
                onChange={handleChange}
              />
                 <p className="ErrorBox">
                        {errors.firstName && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.firstName}
             </p>
            </fieldset>

            <fieldset className="formGroupBox">
              <label htmlFor="lastName" className="formLabelBox">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="formInputBox"
                value={formData.lastName}
                onChange={handleChange}
              />
                  <p className="ErrorBox">
                        {errors.lastName && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.lastName}
             </p>
            </fieldset>

            <fieldset className="formGroupBox">
              <label htmlFor="phone" className="formLabelBox">Phone number</label>
              <input
                type="tel"
                id="phone"
                className="formInputBox"
                placeholder="+212 (654) 000-00"
                value={formData.phone}
                onChange={handleChange}
              />
              <p className="ErrorBox">
                        {errors.phone && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.phone}
             </p>
            </fieldset>
          </section>

          {/* Right column */}
          <section className="formSectionBox">
            <fieldset className="formGroupBox">
              <label htmlFor="file" className="formLabelBox">File</label>
              <div className="fileUploadBox">
                <input
                  type="file"
                  id="file"
                  className="formInputBox"
                  onChange={handleChange}
                />
        
              </div>
              <p className="ErrorBox">
                        {errors.file && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.file}
             </p>
            </fieldset>

            <fieldset className="formGroupBox">
              <label htmlFor="projects" className="formLabelBox">Projects</label>
              <textarea
                id="projects"
                className="formTextareaBox"
                placeholder="Describe your projects here..."
                value={formData.projects}
                onChange={handleChange}
              />
               <p className="ErrorBox">
                        {errors.projects && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.projects}
             </p>
            </fieldset>

            <fieldset className="formGroupBox">
              <label htmlFor="location" className="formLabelBox">Location</label>
              <input
                type="text"
                id="location"
                className="formInputBox"
                value={formData.location}
                onChange={handleChange}
              />
           <p className="ErrorBox">
                        {errors.location && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                        {errors.location}
             </p>
            </fieldset>
          </section>

          <div className="Box-Expriences">
            <fieldset className="formGroupBox">
              <label className="formLabelBox">Skills</label>
              <button type="button" className="btnOutlineBox">
                <FaPlus /> Add new skill
              </button>
            </fieldset>

            <fieldset className="formGroupBox">
              <label className="formLabelBox">Experiences</label>
              <button type="button" className="btnOutlineBox">
                <FaPlus /> Add new experience
              </button>
            </fieldset>

            <fieldset className="formGroupBox">
              <label className="formLabelBox">Education</label>
              <button type="button" className="btnOutlineBox">
                <FaPlus /> Add new education
              </button>
            </fieldset>
          </div>

          <div className="actionsBox">
            <button type="submit" className="btnPrimaryBox">Save</button>
            <button type="button" className="btnOutlineBox" onClick={cancelSubmit}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};