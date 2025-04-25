import React, { useEffect, useState } from "react";
import { ArrowDownRightIcon } from "lucide-react";
import '../styles/pages/profileCandidate/profileCandidate.css';
import { api } from "../api/api";
import AddLanguageModal from "../components/modals/AddLanguage";
import Bio from '../components/modals/AddBioCandidate'

export default function ProfileCandidate() {
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const print = async (id) => {
    try {
      // Ensure CSRF token is fetched before making API requests
      await api.get('/api/sanctum/csrf-cookie', { withCredentials: true });
  
      // Fetch the candidate's CV using the ID
      window.open(`http://localhost:8000/api/candidate/CV/${id}`,'_blank') ;
      
      // Handle response here, for example, show a download link or open the PDF
    } catch (error) {
      console.error('Error fetching CV:', error);
      // Optionally, show an error message to the user
    }
  };
  
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchCandidateInfo = async () => {
        try {
          const response = await api.get(`/api/ProfileCandidate/${parsedUser.user_id}`);
          setCandidateInfo(response.data);
          console.log(response.data)
        } catch (err) {
          console.error("Failed to fetch candidate info", err);
          setError("There was an error loading your profile. Please try again later.");
        }
      };

      fetchCandidateInfo();
    }
  }, []);

  // Loading state
  if (!candidateInfo && !error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-100 rounded-lg shadow-md">
        <p className="text-xl text-red-700 mb-4">{error}</p>
      </div>
    );
  }

  // No profile yet
  if (candidateInfo && !candidateInfo.profile) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
        <p className="text-xl text-gray-700 mb-4">You don't have a profile yet.</p>
        <p className="text-lg text-gray-600">
          <a href="/CreateProfile" className="text-blue-600 hover:underline">
            Please create one
          </a>
        </p>
      </div>
    );
  }

  // Destructure data
  const { name, created_at, email} = candidateInfo;
  const { field,phoneNumber, localisation, photoProfil,description  } = candidateInfo.profile;


  return (
    <div className="containerProfileCandidate mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Information Card */}
        <div className="col-span-1 lg:col-span-3 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="relative w-[100px] h-[100px] rounded-full flex-shrink-0">
                <img
                  className="w-24 h-24 object-cover rounded-full"
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
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-[40px] leading-9">{name}</h1>
                  <img
                    className="w-11 h-11 object-cover"
                    alt="Certification badge"
                    src="/assets/guarantee.png"
                  />
                </div>

                <div className="mt-6 space-y-2 text-xl font-light">
                  <p>Field : {field}</p>
                  <p>Creation date: {new Date(created_at).toLocaleDateString()}</p>
                  <p>Email : {email}</p>
                  <p>Phone : {phoneNumber}</p>
                  <p>Address : {localisation}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button onClick={() => print(candidateInfo.id)} className="bg-[#baffdc] text-[#4c9f44] hover:bg-[#a8eecb] border-2 border-[#4c9f45] rounded-2xl font-medium text-lg px-4 py-2">
                    Download Resume
                  </button>
                  <span className="bg-[#bde3ff] text-[#375870] hover:bg-[#a8d6f8] font-medium text-lg rounded-2xl px-4 py-1.5">
                    Certified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages Card */}
        <div className="col-span-1 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
            <div className="card-head flex justify-between items-center mb-6">
              <h2 className="font-bold text-4xl">Languages</h2>
              <AddLanguageModal /> {/* Modal trigger button */}
            </div>


            <div className="relative">
              {/* Vertical line on the left */}
              <div className="absolute left-9 top-0 bottom-0 w-[3px] bg-indigo-600 opacity-50"></div>

              <div className="space-y-6 ml-6">
                {Array.isArray(candidateInfo.languages) && candidateInfo.languages.length > 0 ? (
                  candidateInfo.languages.map((language, index) => (
                    <div key={index} className="flex items-center gap-6 relative">
                      <div
                        className="w-[25px] h-[23px] rounded-full border-[3px] border-indigo-600 bg-white flex items-center justify-center"
                      >
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
        </div>

        {/* About Me Section */}
        <div className="col-span-1 lg:col-span-3 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
            <h2 className="font-bold text-4xl mb-6">About Me</h2>

            <div className="relative mt-8">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 w-[3px] h-full bg-indigo-600 opacity-50"></div>

              {/* Timeline items */}
              {/* <div className="space-y-12">
                {timelineItems.map((item, index) => (
                  <div key={index} className="flex gap-6">
                   
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="col-span-1 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
          <div className="card-head flex justify-between items-center mb-6">
              <h2 className="font-bold text-4xl">Bio</h2>
             <Bio></Bio>
            </div>
            <p className="text-xl leading-[30px]">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}