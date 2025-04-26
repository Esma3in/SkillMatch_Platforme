import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { api } from "../api/api";
import AddLanguageModal from "../components/modals/AddLanguage";
import Bio from '../components/modals/AddBioCandidate';
import ModalExp from "../components/modals/createExperience";
import ModalSkill from "../components/modals/createSkillsCandidate";

=======
import '../styles/pages/profileCandidate/profileCandidate.css';
import { api } from "../api/api";
import AddLanguageModal from "../components/modals/AddLanguage";
import Bio from '../components/modals/AddBioCandidate';
import NavbarCandidate from "../components/common/navbarCandidate";
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5

export default function ProfileCandidate() {
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [user, setUser] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [skills , setSkills] = useState([])
  const [educations ,setEducations] = useState([])
  const [showExpModal, setShowExpModal] = useState(false);
  const [showSkillModal , setShowSkillModal] = useState(false);

  const print = async (id) => {
    try {
      await api.get('/api/sanctum/csrf-cookie', { withCredentials: true });
      window.open(`http://localhost:8000/api/candidate/CV/${id}`, '_blank');
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };
=======
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5

  useEffect(() => {
    const fetchCandidateInfo = async () => {
      const candidate_id = JSON.parse(localStorage.getItem('candidate_id'))
      try {
        const response = await api.get(`/api/candidate/${candidate_id}`);
        setCandidateInfo(response.data);
        console.log(response.data)
      } catch (err) {
        console.error("Failed to fetch candidate info", err);
        setError("There was an error loading your profile. Please try again later.");
      }
    };

<<<<<<< HEAD
      const fetchCandidateInfo = async () => {
        try {
          const response = await api.get(`/api/ProfileCandidate/${parsedUser.user_id}`);
          setCandidateInfo(response.data);
          console.log(response.data);
        } catch (err) {
          console.error("Failed to fetch candidate info", err);
          setError("There was an error loading your profile. Please try again later.");
        }
      };

      const fetchExperiences = async () => {
        try {
          const response = await api.get(`/api/experiences/candidate/${parsedUser.user_id}`);
          setExperiences(response.data);
          console.log("Experiences:", response.data);
        } catch (err) {
          console.error("Failed to fetch experiences", err);
        }
      };

      fetchCandidateInfo();
      fetchExperiences();
    }
=======
    fetchCandidateInfo();
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
  }, []);

  const handleDownloadCV = async (id) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      window.open(`http://localhost:8000/api/candidate/CV/${id}`, '_blank');
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  if (!candidateInfo && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
<<<<<<< HEAD
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl shadow-lg mx-auto max-w-3xl transition-all duration-300">
        <p className="text-xl font-medium text-red-700">{error}</p>
      </div>
=======
      <>
        <NavbarCandidate />
        <div className="flex flex-col items-center justify-center p-6 bg-red-100 rounded-lg shadow-md">
          <p className="text-xl text-red-700 mb-4">{error}</p>
        </div>
      </>
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
    );
  }

  if (candidateInfo && !candidateInfo.profile) {
    return (
<<<<<<< HEAD
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl shadow-lg mx-auto max-w-3xl transition-all duration-300">
        <p className="text-xl font-medium text-gray-700 mb-4">You don't have a profile yet.</p>
        <a href="/CreateProfile" className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors">
          Create Your Profile
        </a>
      </div>
    );
  }

  // Destructure data
  const { name, created_at, email } = candidateInfo;
  const { field, phoneNumber, localisation, photoProfil, description } = candidateInfo.profile;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Information Card */}
        <div className="col-span-1 lg:col-span-8 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Profile Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
              <img
                className="w-full h-full object-cover rounded-full border-4 border-blue-100 shadow-sm"
                alt="User icon"
                src={
                  photoProfil
                    ? `http://localhost:8000/storage/${photoProfil}`
                    : "/assets/default-avatar.png"
                }
              />
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">{name}</h1>
                <img
                  className="w-9 h-9 object-cover"
                  alt="Certification badge"
                  src="/assets/guarantee.png"
                />
              </div>

              <div className="mt-5 space-y-2 text-lg text-gray-600 leading-relaxed">
                <p className="flex items-center gap-2"><span className="font-medium text-gray-800">Field:</span> {field}</p>
                <p className="flex items-center gap-2"><span className="font-medium text-gray-800">Joined:</span> {new Date(created_at).toLocaleDateString()}</p>
                <p className="flex items-center gap-2"><span className="font-medium text-gray-800">Email:</span> {email}</p>
                <p className="flex items-center gap-2"><span className="font-medium text-gray-800">Phone:</span> {phoneNumber}</p>
                <p className="flex items-center gap-2"><span className="font-medium text-gray-800">Location:</span> {localisation}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                <button
                  onClick={() => print(candidateInfo.id)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
                >
                  Download Resume
                </button>
                <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  Certified Professional
                </span>
=======
      <>
        <NavbarCandidate />
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
          <p className="text-xl text-gray-700 mb-4">You don't have a profile yet.</p>
          <p className="text-lg text-gray-600">
            <a href="/CreateProfile" className="text-blue-600 hover:underline">Please create one</a>
          </p>
        </div>
      </>
    );
  }

  const { name, created_at, email } = candidateInfo;
  const { field, phoneNumber, localisation, photoProfil, description } = candidateInfo.profile || {};

  return (
    <>
      <NavbarCandidate />

      <div className="containerProfileCandidate mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Info */}
          <div className="col-span-1 lg:col-span-3 bg-[#f7f8f9] rounded-[25px] p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-[100px] h-[100px] rounded-full flex-shrink-0">
                <img
                  className="w-24 h-24 object-cover rounded-full"
                  alt="User"
                  src={photoProfil ? `http://localhost:8000/storage/${photoProfil}` : "/default-avatar.png"}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-[40px] leading-9">{name}</h1>
                  <img className="w-11 h-11 object-cover" alt="Certified" src="/assets/guarantee.png" />
                </div>

                <div className="mt-6 space-y-2 text-xl font-light">
                  <p>Field: {field}</p>
                  <p>Creation date: {new Date(created_at).toLocaleDateString()}</p>
                  <p>Email: {email}</p>
                  <p>Phone: {phoneNumber}</p>
                  <p>Address: {localisation}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => handleDownloadCV(candidateInfo.id)}
                    className="bg-[#baffdc] text-[#4c9f44] hover:bg-[#a8eecb] border-2 border-[#4c9f45] rounded-2xl font-medium text-lg px-4 py-2"
                  >
                    Download Resume
                  </button>
                  <span className="bg-[#bde3ff] text-[#375870] hover:bg-[#a8d6f8] font-medium text-lg rounded-2xl px-4 py-1.5">
                    Certified
                  </span>
                </div>
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
              </div>
            </div>
          </div>

<<<<<<< HEAD
        {/* Languages Card */}
        <div className="col-span-1 lg:col-span-4 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Languages</h2>
            <AddLanguageModal />
          </div>

          <div className="relative ml-8">
            <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            <div className="space-y-5">
              {Array.isArray(candidateInfo.languages) && candidateInfo.languages.length > 0 ? (
                candidateInfo.languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-5">
                    <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-md"></div>
                    <p className="text-lg text-gray-700 font-medium">
                      {language.language}: <span className="text-gray-600">{language.level}</span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-base">Add your first language to showcase your skills.</div>
              )}
            </div>
=======
          {/* Languages */}
          <div className="col-span-1 bg-[#f7f8f9] rounded-[25px] p-6">
            <div className="card-head flex justify-between items-center mb-6">
              <h2 className="font-bold text-4xl">Languages</h2>
              <AddLanguageModal />
            </div>

            <div className="relative">
              <div className="absolute left-9 top-0 bottom-0 w-[3px] bg-indigo-600 opacity-50"></div>

              <div className="space-y-6 ml-6">
                {candidateInfo.languages?.length > 0 ? (
                  candidateInfo.languages.map((language, index) => (
                    <div key={index} className="flex items-center gap-6 relative">
                      <div className="w-[25px] h-[23px] rounded-full border-[3px] border-indigo-600 bg-white flex items-center justify-center">
                        <div className="w-[19px] h-[18px] rounded-full bg-indigo-600 border-[3px] border-solid"></div>
                      </div>
                      <p className="font-light text-xl tracking-[1px]">
                        {language.language} : {language.level}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="ml-6 text-gray-500">You don't have any languages yet. Add a new one.</div>
                )}
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="col-span-1 lg:col-span-3 bg-[#f7f8f9] rounded-[25px] p-6">
            <h2 className="font-bold text-4xl mb-6">About Me</h2>
            
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
          </div>

<<<<<<< HEAD
        {/* Experience Section */}
        <div className="col-span-1 lg:col-span-8 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Experiences</h2>
            <button
              onClick={() => setShowExpModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <span>+ Add Experience</span>
            </button>
          </div>

          <div className="relative ml-8 mt-8">
            <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            <div className="space-y-10">
              {experiences && experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-md"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.experience}</h3>
                      <p className="text-lg text-gray-700 mt-1 font-medium">{exp.role} at {exp.employement_type}</p>
                      <p className="text-base text-gray-500 mt-1">{exp.location}</p>
                      <p className="text-base text-gray-500 mt-1">
                        {new Date(exp.start_date).toLocaleDateString()} - 
                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                      </p>
                      {exp.description && (
                        <p className="mt-3 text-base text-gray-600 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-base">Share your experiences to build a stronger profile.</div>
              )}
            </div>
          </div>
        </div>


           {/* Skill Section */}
           <div className="col-span-1 lg:col-span-8 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Skills</h2>
            <button
              onClick={() => setShowSkillModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <span>+ Add skill</span>
            </button>
          </div>

          <div className="relative ml-8 mt-8">
            <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            <div className="space-y-10">
            {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-md"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
                      <p className="text-lg text-gray-700 mt-1 font-medium">{skill.level} at {skill.type}</p>
                      <p className="text-base text-gray-500 mt-1">{skill.usageFrequency}</p>
                      <p className="mt-3 text-base text-gray-600 leading-relaxed">{skill.classement}</p>
                   
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-base">Share your skills to imporve you deserve companies following you.</div>
              )}
         
            </div>
          </div>
        </div>

        




        {/* Bio Section */}
        <div className="col-span-1 lg:col-span-4 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Bio</h2>
            <Bio />
=======
          {/* Bio */}
          <div className="col-span-1 bg-[#f7f8f9] rounded-[25px] p-6">
            <div className="card-head flex justify-between items-center mb-6">
              <h2 className="font-bold text-4xl">Bio</h2>
              <Bio />
            </div>
            <p className="text-xl leading-[30px]">{description||"No bio added yet."}</p>
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
          </div>
          <p className="text-base text-gray-600 leading-relaxed">{description || "Add a bio to tell your story."}</p>
        </div>
      </div>
<<<<<<< HEAD
      {showExpModal && (
        <ModalExp 
          user={user} 
          onClose={() => {
            setShowExpModal(false);
            if (user && user.user_id) {
              api.get(`/api/experiences/candidate/${user.user_id}`)
                .then(response => {
                  setExperiences(response.data);
                })
                .catch(err => {
                  console.error("Failed to refresh experiences", err);
                });
            }

          }} 
        />
      )}
    
           {showSkillModal && (
            <ModalSkill
              user={user} 
              onClose={() => {
                setShowSkillModal(false);
                if (user && user.user_id) {
                  api.get(`/api/skills/candidate/${user.user_id}`)
                    .then(response => {
                      setExperiences(response.data);
                    })
                    .catch(err => {
                      console.error("Failed to refresh experiences", err);
                    });
                }
    
              }} 
            />
          )}


    </div>
=======
    </>
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
  );
}
