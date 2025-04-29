import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import AddLanguageModal from "../components/modals/AddLanguage";
import Bio from "../components/modals/AddBioCandidate";
import CreateExperienceModal from '../components/modals/createExperience'
import ModalSkill from "../components/modals/createSkillsCandidate";
// import "../styles/pages/profileCandidate/profileCandidate.css";
import NavbarCandidate from "../components/common/navbarCandidate";

export default function ProfileCandidate() {

  const [candidateInfo, setCandidateInfo] = useState(null);
  const [error, setError] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Fetch candidate information, experiences, and skills
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve candidate ID from localStorage
        const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));
        if (!candidate_id) {
          throw new Error("Candidate ID not found in localStorage");
        }

        // Fetch candidate profile
        const profileResponse = await api.get(`/api/candidate/${candidate_id}`);
        setCandidateInfo(profileResponse.data);

        // Fetch experiences
        const expResponse = await api.get(
          `/api/experiences/candidate/${candidate_id}`
        );
        setExperiences(expResponse.data);

        // Fetch skills
        const skillsResponse = await api.get(
          `/api/skills/candidate/${candidate_id}`
        );
        setSkills(skillsResponse.data);

        // Fetch educations (placeholder for future implementation)
        // const eduResponse = await api.get(`/api/educations/candidate/${candidate_id}`);
        // setEducations(eduResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("There was an error loading your profile. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Handle CV download
  const handleDownloadCV = async (id) => {
    try {
      await api.get("/api/sanctum/csrf-cookie", { withCredentials: true });
      window.open(`http://localhost:8000/api/candidate/CV/${id}`, "_blank");
    } catch (error) {
      console.error("Error fetching CV:", error);
    }
  };

  // Loading state
  if (!candidateInfo && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex flex-col items-center justify-center p-8 bg-red-100 rounded-lg shadow-md mx-auto max-w-3xl mt-12">
          <p className="text-xl font-medium text-red-700">{error}</p>
        </div>
      </>
    );
  }

  // No profile state
  if (candidateInfo && !candidateInfo.profile) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md mx-auto max-w-3xl mt-12">
          <p className="text-xl font-medium text-gray-700 mb-4">
            You don't have a profile yet.
          </p>
          <a
            href="/CreateProfile"
            className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
          >
            Create Your Profile
          </a>
        </div>
      </>
    );
  }

  // Destructure candidate data
  const { name, created_at, email, id } = candidateInfo;
  const { field, phoneNumber, localisation, photoProfil, description } =
    candidateInfo.profile;

  return (
    <>
      <NavbarCandidate />
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
                  <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
                    {name}
                  </h1>
                  <img
                    className="w-9 h-9 object-cover"
                    alt="Certification badge"
                    src="/assets/guarantee.png"
                  />
                </div>

                <div className="mt-5 space-y-2 text-lg text-gray-600 leading-relaxed">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Field:</span>{" "}
                    {field}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Joined:</span>{" "}
                    {new Date(created_at).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Email:</span>{" "}
                    {email}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Phone:</span>{" "}
                    {phoneNumber}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Location:</span>{" "}
                    {localisation}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                  <button
                    onClick={() => handleDownloadCV(id)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
                  >
                    Download Resume
                  </button>
                  <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    Certified Professional
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="col-span-1 lg:col-span-4 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Bio
              </h2>
              <Bio />
            </div>
            <p className="text-base text-gray-600 leading-relaxed">
              {description || "Add a bio to tell your story."}
            </p>
          </div>

          {/* Languages Section */}
          <div className="col-span-1 lg:col-span-4 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Languages
              </h2>
              <AddLanguageModal />
            </div>
            <div className="relative ml-8">
              <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
              <div className="space-y-5">
                {Array.isArray(candidateInfo.languages) &&
                candidateInfo.languages.length > 0 ? (
                  candidateInfo.languages.map((language, index) => (
                    <div key={index} className="flex items-center gap-5">
                      <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-md"></div>
                      <p className="text-lg text-gray-700 font-medium">
                        {language.language}:{" "}
                        <span className="text-gray-600">{language.level}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-base">
                    Add your first language to showcase your skills.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Experiences Section */}
          <div className="col-span-1 lg:col-span-8 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Experiences
              </h2>
             <CreateExperienceModal user={candidateInfo.id}/>
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
                        <h3 className="text-xl font-semibold text-gray-900">
                          {exp.experience}
                        </h3>
                        <p className="text-lg text-gray-700 mt-1 font-medium">
                          {exp.role} at {exp.employement_type}
                        </p>
                        <p className="text-base text-gray-500 mt-1">
                          {exp.location}
                        </p>
                        <p className="text-base text-gray-500 mt-1">
                          {new Date(exp.start_date).toLocaleDateString()} -{" "}
                          {exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString()
                            : "Present"}
                        </p>
                        {exp.description && (
                          <p className="mt-3 text-base text-gray-600 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-base">
                    Share your experiences to build a stronger profile.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="col-span-1 lg:col-span-8 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Skills
              </h2>
              <button
                    type="button"
                    onClick={() => setShowSkillModal(true)}
                    className="flex items-center px-4 py-2 bg-transparent text-white rounded-full focus:outline-none"
                >
                    <img src="assets/edit.png" alt="Edit icon" className="w-5 h-5 mr-2" />
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
                        <h3 className="text-xl font-semibold text-gray-900">
                          {skill.name}
                        </h3>
                        <p className="text-lg text-gray-700 mt-1 font-medium">
                          {skill.level} at {skill.type}
                        </p>
                        <p className="text-base text-gray-500 mt-1">
                          {skill.usageFrequency}
                        </p>
                        {skill.classement && (
                          <p className="mt-3 text-base text-gray-600 leading-relaxed">
                            {skill.classement}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-base">
                    Share your skills to improve your visibility to companies.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Placeholder for Education Section */}
          <div className="col-span-1 lg:col-span-8 bg-white shadow-lg border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Education
              </h2>
              <button
                onClick={() => alert("Education modal not implemented yet")}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center gap-2"
              >
                <span>+ Add Education</span>
              </button>
            </div>
            <div className="text-gray-500 text-base">
              Add your education details to enhance your profile.
            </div>
          </div>
        </div>

        {/* Modals */}
        {showSkillModal && (
          <ModalSkill
            user={candidateInfo.id}
            onClose={() => {
              setShowSkillModal(false);
              if (candidateInfo && candidateInfo.id) {
                api
                  .get(`/api/skills/candidate/${candidateInfo.id}`)
                  .then((response) => {
                    setSkills(response.data); // Corrected to update skills
                  })
                  .catch((err) => {
                    console.error("Failed to refresh skills", err);
                  });
              }
            }}
          />
        )}
      </div>
    </>
  );
}