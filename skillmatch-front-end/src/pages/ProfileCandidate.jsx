import { ArrowDownRightIcon } from "lucide-react";
import React from "react";
import '../styles/pages/profileCandidate/profileCandidate.css'


export default function ProfileCandidate ()  {
  // Profile information data
  const profileInfo = {
    name: "John Doe",
    field: "BACK-END Developer",
    creationDate: "January 5, 2023",
    email: "user.example@gmail.com",
    phone: "+212 654 321 000",
    address: "Example.19 , Tetouan , Morocco",
  };

  // Experience and education data
  const timelineItems = [
    {
      title: "Backend Developer Intern – TechNova Solutions",
      period: "Jul 2023 – Oct 2023",
      description:
        "Developed RESTful APIs for a task management app, optimized database queries in PostgreSQL, and collaborated with frontend devs to integrate secure authentication and user roles.",
      icon: "/icons8-licence-100.png",
      iconAlt: "Licence",
      completed: true,
    },
    {
      title: "Backend Development Bootcamp – Codecademy",
      period: "Completed in 2023",
      description:
        "Focused on building robust APIs, working with databases (MySQL, MongoDB), and mastering server-side logic using Node.js and Express.",
      icon: "/icons8-cdi-100.png",
      iconAlt: "Cdi",
      completed: true,
    },
    {
      title: "API Development with Node.js & Express",
      period: "Jul 2023 – Oct 2023",
      description:
        "Experienced in building scalable, secure REST APIs, handling middleware, JWT authentication, and integrating third-party services.",
      icon: "/icons8-comp-tences-de-r-flexion-48.png",
      iconAlt: "Comptences de",
      completed: false,
    },
  ];

  // Language proficiency data
  const languages = [
    { name: "English", level: "B2", completed: true },
    { name: "French", level: "B1", completed: false },
    { name: "Spanish", level: "A2", completed: true },
    { name: "Arabic", level: "C2", completed: false },
  ];

  return (
    <div className="containerProfileCandidate mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Information Card */}
        <div className="col-span-1 lg:col-span-3 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="relative  w-[100px] h-[100px] rounded-[78.5px/76.5px] flex-shrink-0">
                <div className="relative w-[131px] h-[135px] top-[26px] -left-1">
                  <img
                    className="absolute w-[24px] h-[24px] top-[85px] left-0 object-cover"
                    alt="Camera icon"
                    src="/assets/photo-camera.png"
                  />
                  <img
                    className=" w-24 h-24 object-cover"
                    alt="User icon"
                    src="/assets/user.png"
                  />
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-[40px] leading-9">
                    {profileInfo.name}
                  </h1>
                  <img
                      className="w-11 h-11 object-cover"
                      alt="Certification badge"
                      src="/assets/guarantee.png"
                    />
                </div>

                <div className="mt-6 space-y-2 text-xl font-light">
                  <p>Field : {profileInfo.field}</p>
                  <p>Creation date: {profileInfo.creationDate}</p>
                  <p>Email : {profileInfo.email}</p>
                  <p>Phone : {profileInfo.phone}</p>
                  <p>Address : {profileInfo.address}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button className="bg-[#baffdc] text-[#4c9f44] hover:bg-[#a8eecb] border-2 border-[#4c9f45] rounded-2xl font-medium text-lg px-4 py-2">
                    Download Resume
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#bde3ff] text-[#375870] hover:bg-[#a8d6f8] font-medium text-lg rounded-2xl px-4 py-1.5">
                      Certified
                    </span>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages Card */}
        <div className="col-span-1 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
            <h2 className="font-bold text-4xl mb-6">Languages</h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 w-[3px] h-full bg-indigo-600 opacity-50"></div>

              {/* Language items */}
              <div className="space-y-12">
                {languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-6 relative">
                    <div
                      className={`w-[25px] h-[23px] rounded-full border-[3px] border-indigo-600 bg-white flex items-center justify-center ${language.completed ? "relative" : ""}`}
                    >
                      {language.completed && (
                        <div className="w-[19px] h-[18px] rounded-full bg-indigo-600 border-[3px] border-solid"></div>
                      )}
                    </div>
                    <p className="font-light text-xl tracking-[1px]">
                      {language.name} :&nbsp;&nbsp;&nbsp;&nbsp;
                      {language.name === "Spanish" ? "\u00A0\u00A0" : ""}
                      {language.level}
                    </p>
                  </div>
                ))}
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
              <div className="space-y-12">
                {timelineItems.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    {/* Timeline dot */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-[3px] border-indigo-600 bg-white flex items-center justify-center">
                        {item.completed && (
                          <div className="w-[30px] h-[30px] rounded-full bg-indigo-600 border-[3px] border-solid"></div>
                        )}
                      </div>
                    </div>

                    {/* Timeline content */}
                    <div className="flex-1 border border-[#6c63ff] rounded-[25px]">
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            className="w-9 h-9 mt-3 object-cover"
                            alt={item.iconAlt}
                            src='http://localhost:8000/storage/images/creative-thinking.png'
                          />

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-[22px] leading-9">
                                {item.title}
                              </h3>
                              <div className="font-light text-[15px] leading-9">
                                {item.period}
                              </div>
                            </div>

                            <p className="mt-2 font-medium text-[15px] leading-6">
                              {item.description}
                            </p>
                          </div>

                          <div className="w-[46px] h-[46px] bg-[#a592ff] rounded-[23px] flex items-center justify-center flex-shrink-0">
                            <ArrowDownRightIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="col-span-1 bg-[#f7f8f9] rounded-[25px]">
          <div className="p-6">
            <h2 className="font-bold text-4xl mb-6">Bio</h2>
            <p className="text-xl leading-[30px]">
              I'm Walaa, a Backend Developer passionate about building scalable
              and secure web applications.
              <br /> I work mainly with Node.js, Express, and PostgreSQL to
              develop robust APIs.
              <br /> I enjoy solving backend challenges and optimizing system
              performance.
              <br /> Always learning — currently diving into Docker and
              microservices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};