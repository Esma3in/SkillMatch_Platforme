import React, { useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import '../styles/pages/Profiles/CandidateProfile.css';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom'; // Corrected import
import NavbarCandidate from '../components/common/navbarCandidate';


export const Box = () => {
  const navigate = useNavigate(); 
  const [showModal, setShowModal] = useState(false);
// Corrected usage of useNavigate hook

  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));
  const [formData, setFormData] = useState({
    photoProfile: null,
    field: '',
    lastName: '',
    phone: '',
    file: null,
    projects: '',
    location: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.field.trim()) newErrors.field = 'You must type your first name!';
    else if (formData.field.length > 30) newErrors.field = 'Your first name is too long!';

    if (!formData.lastName.trim()) newErrors.lastName = 'You must type your last name!';
    else if (formData.lastName.length > 30) newErrors.lastName = 'Your last name is too long!';

    const phoneRegex = /^\+?[0-9]{6,20}$/;
    if (!formData.phone.trim()) newErrors.phone = 'You must type your phone number!';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number format!';

    if (!formData.file) newErrors.file = 'Please upload a file!';
    if (!formData.projects.trim()) newErrors.projects = 'Project field cannot be empty!';
    if (!formData.location.trim()) newErrors.location = 'Please specify your location!';
    if (!formData.photoProfile) newErrors.photoProfile = 'Please upload a profile photo!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (candidate_id) formDataToSend.append('candidate_id', candidate_id);
      formDataToSend.append('field', formData.field);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('file', formData.file);
      formDataToSend.append('projects', formData.projects);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('photoProfile', formData.photoProfile);
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/api/profiles', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data.message);
      navigate('/profile'); // Corrected navigation
      setFormData({
        photoProfile: null,
        field: '',
        lastName: '',
        phone: '',
        file: null,
        projects: '',
        location: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    }
  };

  const cancelSubmit = (e) => {
    e.preventDefault();
    setFormData({
      photoProfile: null,
      field: '',
      lastName: '',
      phone: '',
      file: null,
      projects: '',
      location: '',
    });
    setErrors({});
  };

  return (
    <>
    
    <NavbarCandidate/>
    <div className="containerBox">
      <div className="cardBox">
        <h1 className="titleBox">Create your profile on SkillMatch</h1>

        <form className="formGridBox" onSubmit={handleSubmit}>
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
              <label htmlFor="field" className="formLabelBox">Field</label>
              <input
                type="text"
                id="field"
                className="formInputBox"
                value={formData.field}
                onChange={handleChange}
              />
              <p className="ErrorBox">
                {errors.field && <FaExclamationCircle style={{ marginRight: '0.5rem' }} />}
                {errors.field}
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
            {/* <fieldset className="formGroupBox">
              <label className="formLabelBox">Skills</label>
              <button type="button" className="btnOutlineBox" onClick={()=>{navigate('/profile/skill')}}>
                <div className='titleBtn'> <FaPlus /> Add new skill </div>
              </button>
            </fieldset> */}
{/* 
            <fieldset className="formGroupBox">
              <label className="formLabelBox">Experiences</label>
              <button className='btnOutlineBox' onClick={()=>{navigate('/profile/exprience')}}>
              <div className='titleBtn'> <FaPlus /> Add new experience </div>
              </button>
            </fieldset>

            <fieldset className="formGroupBox">
              <label className="formLabelBox">Education</label>
              <button type="button" className="btnOutlineBox" onClick={()=>{navigate('/profile/education')}}>
                <div className='titleBtn'> <FaPlus /> Add new  education </div>
              </button>
            </fieldset>
          </div>

        
          <ModalExp user={user} onClose={() => {}} /> */}
            <div className="actionsBox">
            <button type="submit" className="btnPrimaryBox">Save</button>
            <button type="button" className="btnOutlineBox" onClick={cancelSubmit}>Cancel</button>
          </div>
</div>

        </form>
      </div>
    </div>
    </>
  );
};
