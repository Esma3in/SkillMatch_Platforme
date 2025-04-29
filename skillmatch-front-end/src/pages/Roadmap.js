import React, { useState } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";

export const Roadmap = ()=> {
  // State for active tab
  const [activeTab, setActiveTab] = useState("1");

  // Data for roadmap steps
  const roadmapSteps = [
    { id: 1, name: "prequitsties" },
    { id: 2, name: "Courses" },
    { id: 3, name: "Impove Skills" },
    { id: 4, name: "Quiz" },
    { id: 5, name: "Badge" },
  ];

  // Java competences data
  const javaCompetences = [
    {
      id: 1,
      text: "Syntaxe de base : Variables, types de données, opérateur , Structures de contrôle (if, switch, while, for)",
      completed: true,
    },
    {
      id: 2,
      text: "Programmation orientée objet (POO) : Classes, objets, méthodes ,Héritage, polymorphisme, encapsulation, abstraction",
      completed: false,
    },
    {
      id: 3,
      text: "Programmation multithread :Threads, Runnable, synchronization ,Notions de concurrence (concurrency)",
      completed: false,
    },
    {
      id: 4,
      text: "Entrées / Sorties (I/O) :Lire/écrire dans les fichiers , Streams (InputStream, OutputStream, BufferedReader, etc.)",
      completed: false,
    },
  ];

  // Angular competences data
  const angularCompetences = [
    {
      id: 1,
      text: "Syntaxe de base : Variables, types de données, opérateur , Structures de contrôle (if, switch, while, for)",
      completed: false,
    },
    {
      id: 2,
      text: "Composants Création et utilisation de composants et Communication entre composants (Input/Output, EventEmitter)",
      completed: false,
    },
    {
      id: 3,
      text: "Templates & Data Binding  ,Interpolation {{ }} {{ }}  ,Property Binding [ ] et Event Binding ( ) ,Two-way binding [(ngModel)]",
      completed: false,
    },
    {
      id: 4,
      text: "Routing & Navigation ,Configuration des routes et Routing dynamique avec paramètres",
      completed: false,
    },
  ];

  // Competitors data
  const competitors = [
    {
      id: 1,
      name: "Jenny Wilson",
      email: "w.lawson@example.com",
      location: "Austin",
      badges: 4,
      image: "/image.png",
    },
    {
      id: 2,
      name: "Devon Lane",
      email: "dat.roberts@example.com",
      location: "New York",
      badges: 2,
      image: "/image-1.png",
    },
    {
      id: 3,
      name: "Jane Cooper",
      email: "jgraham@example.com",
      location: "Toledo",
      badges: 6,
      image: "/image-2.png",
    },
    {
      id: 4,
      name: "Dianne Russell",
      email: "curtis.d@example.com",
      location: "Naperville",
      badges: 1,
      image: "/image-3.png",
    },
  ];

  return (
    <>
     <NavbarCandidate />
    <div className="relative w-full max-w-[1512px] min-h-screen bg-white overflow-hidden p-4">
       
      <div className="mb-8 mt-10 ml-[103px]">
        <h1 className="font-bold text-4xl leading-9 tracking-tight">
          Your new Roadmap !
        </h1>
        <p className="font-semibold text-[#898989] text-base tracking-[0.10px] leading-[30px]">
          Choosed company | NTTDATA
        </p>
      </div>

      <div className="flex flex-row gap-12">
        {/* Main roadmap content */}
        <div className="relative w-full max-w-[942px] ml-[97px] bg-[#f7f8f980] border border-solid border-[#89898966] rounded-2xl">
          <div className="p-8 pb-0">
            {/* Tabs navigation */}
            <div className="flex items-center">
              <div className="w-[163px] h-[31px] font-semibold text-[15px] tracking-[-0.20px] leading-7 font-['Poppins',Helvetica]">
                Date.now()
              </div>
              <div className="w-[731px]">
                <div className="w-full h-11 bg-white flex justify-start">
                  {roadmapSteps.map((step) => (
                    <div key={step.id} className="relative flex items-center">
                      <button
                        onClick={() => setActiveTab(step.id.toString())}
                        className={`flex flex-col items-center px-6 ${
                          activeTab === step.id.toString()
                            ? "text-black"
                            : "text-gray-500"
                        }`}
                      >
                        <div className="w-[17px] h-[17px] bg-[#6c63ff] rounded-full flex items-center justify-center mb-1">
                          <span className="text-white text-xs font-medium">
                            {step.id}
                          </span>
                        </div>
                        <span className="font-bold text-xs">{step.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="w-full mt-8 border-[#89898966]" />

          {/* Prerequisites section */}
          <div className="mt-12 px-7">
            <div className="flex items-center">
              <div className="w-[25px] h-[25px] bg-[#d9d9d9] rounded-full mr-3"></div>
              <h3 className="font-semibold text-[15px] tracking-[-0.20px] leading-7 font-['Poppins',Helvetica]">
                prerequisites
              </h3>
              <div className="ml-auto">
                <span className="bg-[#d9d9d9] bg-opacity-20 text-black text-[10px] font-normal border border-gray-300 rounded px-2 py-1">
                  Mark as done
                </span>
              </div>
            </div>

            <div className="ml-[47px] mt-4 bg-[#a31d1d1a] rounded-[14px] p-4 w-[710px] h-[108px]">
              {/* Prerequisites content would go here */}
            </div>
          </div>

          {/* Improve your skills section */}
          <div className="mt-12 px-7">
            <div className="flex items-center">
              <div className="w-[25px] h-[25px] bg-[#d9d9d9] rounded-full mr-3"></div>
              <h3 className="font-semibold text-[15px] tracking-[-0.20px] leading-7 font-['Poppins',Helvetica]">
                Improve your skills
              </h3>
              <div className="ml-auto">
                <span className="bg-[#d9d9d9] bg-opacity-20 text-black text-[10px] font-normal border border-gray-300 rounded px-2 py-1">
                  Mark as done
                </span>
              </div>
            </div>

            {/* Java competences */}
            <div className="ml-[40px] mt-6">
              <div className="bg-[url(/rectangle-50.svg)] bg-[100%_100%] w-[710px] h-[45px] flex items-center px-6">
                <span className="font-extrabold text-[#09969e] text-[10px] font-['Manrope',Helvetica]">
                  PART 1 | JAVA COMPETENCES
                </span>
              </div>

              <div className="ml-[50px] mt-4">
                {javaCompetences.map((competence, index) => (
                  <div key={competence.id} className="flex items-start mb-6">
                    <div className="relative mr-6">
                      <div
                        className={`w-[17px] h-[17px] rounded-full border border-solid ${
                          competence.completed
                            ? "bg-[#23823b] border-[#23823b8c]"
                            : "bg-[#f7f8f9] border-[#8989898c]"
                        } flex items-center justify-center`}
                      >
                        {competence.completed && (
                          <span className="text-[10px] text-[#898989]">
                            1
                          </span>
                        )}
                      </div>
                      {index < javaCompetences.length - 1 && (
                        <div className="absolute top-[17px] left-[8px] w-px h-[23px] bg-gray-300"></div>
                      )}
                    </div>
                    <p className="text-[10px] font-normal font-['Manrope',Helvetica]">
                      {competence.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Angular competences */}
            <div className="ml-[40px] mt-6">
              <div className="bg-[url(/rectangle-50.svg)] bg-[100%_100%] w-[710px] h-[45px] flex items-center px-6">
                <span className="font-extrabold text-[#09969e] text-[10px] font-['Manrope',Helvetica]">
                  PART 2 | ANGULAR COMPETENCES
                </span>
              </div>
              <div className="ml-auto mr-7">
                <span className="bg-[#d9d9d9] bg-opacity-20 text-black text-[10px] font-normal border border-gray-300 rounded px-2 py-1">
                  Mark as done
                </span>
              </div>

              <div className="ml-[50px] mt-4">
                {angularCompetences.map((competence, index) => (
                  <div key={competence.id} className="flex items-start mb-6">
                    <div className="relative mr-6">
                      <div className="w-[17px] h-[17px] rounded-full bg-[#f7f8f9] border border-solid border-[#8989898c] flex items-center justify-center"></div>
                      {index < angularCompetences.length - 1 && (
                        <div className="absolute top-[17px] left-[8px] w-px h-[23px] bg-gray-300"></div>
                      )}
                    </div>
                    <p className="text-[10px] font-normal font-['Manrope',Helvetica]">
                      {competence.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Take the Quiz section */}
            <div className="mt-12 flex items-center">
              <div className="w-[25px] h-[25px] bg-[#d9d9d9] rounded-full mr-3"></div>
              <h3 className="font-semibold text-[15px] tracking-[-0.20px] leading-7 font-['Poppins',Helvetica]">
                Take the Quiz
              </h3>
            </div>

            <div className="ml-[47px] mt-4 bg-[url(/rectangle-58.svg)] bg-[100%_100%] p-4 w-[704px]">
              <div className="font-extrabold text-[#988d3f] text-[13px] font-['Manrope',Helvetica]">
                !Warning !
              </div>
              <div className="mt-2 text-[13px] font-['Manrope',Helvetica]">
                <span className="font-extrabold">
                  Before You Start the Quiz
                  <br />
                </span>
                <span className="font-medium text-[11px]">
                  This quiz is designed to assess your understanding of the
                  key skills covered in this part. If you pass, you'll earn a
                  skill badge to showcase your achievement on your profile.
                  <br />
                  Take your time, read each question carefully, and do your
                  best!
                  <br />
                  Show what you've learned and claim your{" "}
                </span>
                <span className="font-extrabold text-[11px]">badge</span>
                <span className="font-medium text-[11px]">!</span>
              </div>
            </div>

            <div className="flex justify-end mt-8 mb-8">
              <button className="bg-[#5856d6] text-white font-extrabold text-xl py-6 px-8 rounded">
                Take the Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-8">
          {/* Progress card */}
          <div className="w-[388px] bg-[#f7f8f9] shadow-[0px_2px_6px_2px_#00000026] rounded-2xl">
            <div className="p-6">
              <h2 className="font-semibold text-2xl mb-2">Overall Progress</h2>

              <div className="flex justify-center items-center my-8">
                <div className="relative">
                  <div className="w-[169px] h-[171px] bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-5xl">
                    15%
                  </div>
                  <img
                    className="absolute -top-5 right-0 w-[120px] h-[122px]"
                    alt="Progress circle"
                    src="/ellipse-22.svg"
                  />
                </div>
              </div>

              <div className="mt-16">
                <h2 className="font-semibold text-2xl">Recent Activity</h2>
                <p className="font-light text-[15px]">12 december 2024</p>
              </div>
            </div>
          </div>

          {/* Competitors card */}
          <div className="w-[388px] border border-solid border-zinc-200 rounded-[10px]">
            <div className="p-6">
              <h2 className="font-bold text-[16px] text-gray-900 mb-1">
                Your competitors
              </h2>
              <p className="text-[13px] text-gray-500 mb-6">
                Lorem ipsum dolor sit ametis.
              </p>

              {competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex justify-between items-center mb-6"
                >
                  <div className="flex items-center">
                    <img
                      className="w-9 h-[34px] rounded-full mr-3"
                      src={competitor.image}
                      alt={competitor.name}
                    />
                    <div>
                      <p className="font-bold text-[13px] text-gray-900">
                        {competitor.name}
                      </p>
                      <p className="text-[13px] text-gray-500">
                        {competitor.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[13px] text-gray-900">
                      {competitor.badges} badges
                    </p>
                    <p className="text-[13px] text-gray-500">
                      {competitor.location}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-center mt-4 opacity-50 text-[11px] font-bold">
                <span>SEE ALL DETAILS</span>
                <img
                  className="w-3.5 h-[13px] ml-2"
                  alt="Icon outline"
                  src="/icon-outline-cheveron-right.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};