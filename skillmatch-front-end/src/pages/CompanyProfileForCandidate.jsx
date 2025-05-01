import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";


export default function CompanyProfileForCandidate() {
  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'))
  console.log(candidate_id);
  const [roadmap , setroadmap]=useState({})
  const { id } = useParams();
  const [companyInfoFetched, setCompanyInfo] = useState({});
  const [candidateInfo, setCandidateInfo] = useState({});
  const [rror , setError]= useState({})
  const [errors, setErrors] = useState({
    fetchError: ''
  });
  console.log(id)
  const [message,setmessage] = useState('');
  const [Loading,setLoading] = useState(true)
const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/candidate/companyInfo/${id}`);
        const response1 = await api.get(`/api/candidate/${candidate_id}`)
        setCompanyInfo(response.data); // <- set state here
        setCandidateInfo(response1.data);
        setLoading(false)   
      } catch (err) {
        console.log(err.message);
        setErrors(prev => ({
          ...prev,
          fetchError: err.message
        }));
      }
    };

    if (id) {
      fetchData(); // don't pass id, use from outer scope
    }
  }, [candidate_id ,id]);

  useEffect(() => {
    const createSelectedCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(`/api/selected/company/${id}`, {
          candidate_id: candidate_id,
          company_id: id,
          name : companyInfo.name ,
        
        });

        // Optionally handle the response (e.g., update state)
        console.log("Selected company created:", response.data);
        // Example: setcompanySelected(response.data); // If you need to update state
      } catch (err) {
        // Handle errors (e.g., network error, API failure)
        setError(err.message || "Failed to create selected company");
        console.error("Error creating selected company:", err);
      } finally {
        setLoading(false);
      }
    };

    // Call the async function
    createSelectedCompany();

    // Cleanup (optional, if needed)
    return () => {
      // If using AbortController for cancellation
      // controller.abort();
    };
  }, [id, candidate_id]);
  const companyInfo = {
    name: companyInfoFetched?.name || 'N/A',
    logo: companyInfoFetched?.logo || 'N/A',
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus,el..",
    address: companyInfoFetched?.profile?.address|| 'N/A',
    email: companyInfoFetched?.profile?.email || 'N/A',
    sector: companyInfoFetched.sector|| 'N/A',
  };

  // CEO information
  const ceoInfo = {
    name: companyInfoFetched?.ceo?.name,
    avatar: companyInfoFetched?.ceo?.avatar,
    description:companyInfoFetched?.ceo?.description
  };

  // Technology tags

  const Style = [
    { bgColor: "bg-[#1b56fd33]", textColor: "text-[#1b56fd]" },
    { bgColor: "bg-[#a31d1d33]", textColor: "text-[#a31d1d]" },
    { bgColor: "bg-[#09969e1a]", textColor: "text-[#09969e]" }
  ];

  const techTags = companyInfoFetched?.skills?.map((skill) => {
    const nb = Math.floor(Math.random() * Style.length);
    return {
      name: skill.name, // Only show the skill name
      bgColor: Style[nb].bgColor,
      textColor: Style[nb].textColor
    };
  }) || [];
const createRoadmap =async ()=>{

    const response = await api.get(`/api/roadmaps${1}`);
   setroadmap(response.data)
   return roadmap

  

}
console.log(roadmap)

  // Company vision/recruitment message
  const companyVision = `Subject: Join our team and help shape the future with us
Hello ${candidateInfo?.name},
At ${companyInfo?.name}, we believe that the future is built by passionate, curious, and bold minds. When we came across your profile on Futurna, we were genuinely impressed by your journey, your projects, and most of all, your ability to actively learn and innovate.
We are currently looking for a collaborator capable of contributing to ${companyInfo?.sector}, and we believe your profile aligns perfectly with this vision. Your approach to ${companyInfoFetched?.skills?.[0]?.['name']}, along with your drive to grow, is exactly what we value.
Here's what we offer you:
A stimulating environment where every idea matters
A clear roadmap to grow your skills, with hands-on projects at each stage
Personalized and supportive mentoring
Opportunities for growth if you wish to continue the journey with us
Your potential deserves to be supported and nurtured. With us, you won't be just another intern — you'll be a full member of the team, able to learn, contribute, and make an impact.
We would be thrilled to connect with you and share more about how this collaboration could benefit you.
Looking forward to speaking with you,
${companyInfoFetched?.ceo?.name}
Team Lead at ${companyInfo?.name}
${companyInfo?.email} – ${companyInfoFetched?.profile?.phone} `;

  // Test information
  const testInfo = {
    title: "Our tests",
    description: `🎯 Objective: At ${companyInfo?.name}, we believe that technical skills go beyond a CV. That's why we offer a series of short problem-solving tests to help us discover how you think, analyze, and approach real-world challenges.
These exercises aren't just about finding the right answer — they're about creativity, logic, and clarity.
Whether you're solving an algorithmic puzzle or optimizing a simple function, we value the way you think through problems and communicate your solutions.
🧩 Each test is designed to be:
Short and focused (15–45 minutes)
Language-flexible English
Centered on real challenges from our team's daily work
We encourage you to explore them when you're ready — take your time and have fun!.`,
  };
  if (Loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavbarCandidate />
      {

        message && (<div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-md shadow-sm">
  <span>{message}</span>
</div>)
      }
      

      <div className="w-full w-[100%] min-h-screen bg-white">
        <div className="relative w-full max-w-[1448px] mx-auto pt-[69px] pb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column */}
            <div className="w-full md:w-[749px] bg-white">
              {/* Company header */}
              <div className="flex items-start mb-8">
                <img
                  className="w-[102px] h-[103px] object-cover rounded-full"
                  alt={companyInfo?.logo}
                  src={companyInfo?.logo}
                />

                <div className="ml-4 flex flex-col">
                  <h1 className="font-semibold text-2xl text-center font-['Plus_Jakarta_Sans',Helvetica]">
                    {companyInfo?.name}
                  </h1>
                  <div className="mt-2 bg-[#5845ee26] rounded-3xl px-1.5 py-1">
                    <a
                      className="font-normal text-[#0800f1] text-sm underline overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] font-['Manrope',Helvetica]"
                      href={companyInfo?.linkedIn}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {companyInfo?.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {techTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`${tag.bgColor} ${tag.textColor} h-[33px] text-[10px] font-bold font-['Manrope',Helvetica] rounded-3xl px-3 py-2 inline-flex items-center`}
                  >
                    {tag.name}
                  </span>
                ))}
                <div className="flex w-[31px] h-[29px] items-center justify-center p-1 bg-gray-100 rounded-2xl">
                  <PlusIcon className="w-3 h-3" />
                </div>
              </div>

              {/* General info card */}
              <div className="mb-6 bg-[#f7f8f9] rounded-2xl p-6">
                <div className="pb-0">
                  <div className="flex items-start">
                    <img
                      className="w-[21px] h-[21px] mr-2"
                      alt="Icon"
                      src="/assets/contract-documents.png"
                    />
                    <h2 className="font-bold text-xl text-center font-['Hind_Kochi-Bold',Helvetica]">
                      General
                    </h2>
                  </div>
                </div>
                <div>
                  <div className="mt-2 mb-4">
                    <h3 className="font-bold text-xl font-['Manrope',Helvetica]">
                      Bio
                    </h3>
                    <p className="font-normal text-[15px] text-neutral-800 font-['Manrope',Helvetica] mt-2">
                      {companyInfo?.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-base font-['Manrope',Helvetica]">
                        Adresse
                      </h3>
                      <p className="font-normal text-base font-['Manrope',Helvetica]">
                        {companyInfo?.address}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-base font-['Manrope',Helvetica]">
                        Email
                      </h3>
                      <p className="font-normal text-base font-['Manrope',Helvetica]">
                        {companyInfo?.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base font-['Manrope',Helvetica]">
                      Secteur d'activite
                    </h3>
                    <p className="font-normal text-base font-['Manrope',Helvetica]">
                      {companyInfo?.sector}
                    </p>
                  </div>
                </div>
              </div>

              {/* CEO card and Tests card */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[320px] bg-[#f7f8f9] rounded-2xl p-6">
                  <h2 className="font-bold text-xl text-center font-['Hind_Kochi-Bold',Helvetica] mb-4">
                    Ceo of the company
                  </h2>
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                        <img
                          src={ceoInfo?.avatar}
                          alt="CEO avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="ml-3 font-semibold text-sm font-['Manrope',Helvetica]">
                        {ceoInfo?.name}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-sm font-['Manrope',Helvetica] mb-2">
                        Description
                      </h3>
                      <p className="font-normal text-[13px] font-['Manrope',Helvetica]">
                        {ceoInfo?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tests card */}
                <div className="w-full md:w-[313px] bg-[#f7f8f9] rounded-2xl p-6">
                  <h2 className="font-bold text-xl text-center font-['Hind_Kochi-Bold',Helvetica] mb-2">
                    {testInfo?.title}
                  </h2>
                  <p className="font-normal text-[13px] leading-5 font-['Hind_Kochi-Regular',Helvetica]">
                    <span className="font-bold font-['Hind_Kochi-Bold',Helvetica]">
                      {testInfo?.description.split(":")[0]}:
                    </span>
                    {testInfo?.description.split(":").slice(1).join(":")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Company vision */}
            <div className="w-full md:w-[682px] bg-[#f7f8f9] rounded-2xl p-6">
              <h2 className="font-bold text-xl tracking-[0] leading-[18px] font-['Istok_Web',Helvetica] mb-4">
                Company vision
              </h2>
              <p className="font-normal text-xl whitespace-pre-line font-['Manrope',Helvetica]">
                {companyVision}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
            onClick={()=>{window.location.href=`/candidate/Session/${candidate_id}`}}
              className="flex-1 h-[59px] bg-[#f7f8f9] font-extrabold text-[#5856d6] font-['Manrope',Helvetica] rounded-md border border-[#5856d6]"
            >
              cancel
            </button>
            <button
              className="flex-1 h-[59px] bg-[#5856d6] font-semibold text-shadeswhite font-['Manrope',Helvetica] rounded-md"
              onClick={createRoadmap}
            >
              Select entreprise
            </button>
          </div>
        </div>
      </div>
    </>
  );
};