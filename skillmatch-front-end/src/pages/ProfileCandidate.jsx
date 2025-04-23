import { ArrowDownRightIcon, Download, CheckCircle } from "lucide-react"; // Added Download, CheckCircle
import React from "react";

// Placeholder data (same as before)
const profileInfo = {
    name: "John Doe",
    field: "BACK-END Developer",
    creationDate: "January 5, 2023",
    email: "user.example@gmail.com",
    phone: "+212 654 321 000",
    address: "Example.19 , Tetouan , Morocco",
};

const timelineItems = [
    {
        title: "Backend Developer Intern – TechNova Solutions",
        period: "Jul 2023 – Oct 2023",
        description:
            "Developed RESTful APIs, optimized PostgreSQL queries, integrated secure auth.",
        icon: "/icons8-licence-100.png",
        iconAlt: "Licence",
        completed: true,
    },
    {
        title: "Backend Development Bootcamp – Codecademy",
        period: "Completed in 2023",
        description:
            "Built APIs, worked with MySQL & MongoDB, mastered Node.js & Express.",
        icon: "/icons8-cdi-100.png",
        iconAlt: "Cdi",
        completed: true,
    },
    {
        title: "API Development with Node.js & Express",
        period: "Jul 2023 – Oct 2023",
        description:
            "Built scalable APIs, middleware, JWT auth, integrated 3rd-party services.",
        icon: "/icons8-comp-tences-de-r-flexion-48.png",
        iconAlt: "Comptences",
        completed: false,
    },
];

const languages = [
    { name: "English", level: "B2", completed: true },
    { name: "French", level: "B1", completed: false },
    { name: "Spanish", level: "A2", completed: true },
    { name: "Arabic", level: "C2", completed: false },
];

// Reusable Card component for consistent styling
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        {children}
    </div>
);

// Reusable Section Title
const SectionTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-slate-800 mb-5">{children}</h2>
);

export const ProfileCandidat = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Profile Info */}
                    <Card className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {/* Profile Picture */}
                            <div className="relative flex-shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border-4 border-white shadow-md overflow-hidden">
                                {/* Placeholder Image - replace with actual user image logic */}
                                <img
                                    className="absolute inset-0 w-full h-full object-cover"
                                    src="/icons8-utilisateur-96-1.png" // Using placeholder user icon
                                    alt={profileInfo.name}
                                />
                                {/* Optional: Edit button overlay */}
                                <button className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-100 transition">
                                    <img
                                        className="w-5 h-5 object-contain"
                                        alt="Edit profile"
                                        src="/icons8-appareil-photo-pomme-150-1.png" // Assuming this is an edit/camera icon
                                    />
                                </button>
                            </div>

                            {/* Profile Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        {profileInfo.name}
                                    </h1>
                                    <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    {/* Removed the duplicate icon */}
                                </div>

                                <div className="space-y-1.5 text-sm text-slate-600">
                                    <p><span className="font-medium text-slate-800">Field:</span> {profileInfo.field}</p>
                                    <p><span className="font-medium text-slate-800">Member Since:</span> {profileInfo.creationDate}</p>
                                    <p><span className="font-medium text-slate-800">Email:</span> {profileInfo.email}</p>
                                    <p><span className="font-medium text-slate-800">Phone:</span> {profileInfo.phone}</p>
                                    <p><span className="font-medium text-slate-800">Address:</span> {profileInfo.address}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
                                    <button className="inline-flex items-center gap-2 bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-600 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <Download className="w-4 h-4" />
                                        Download Resume
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Certified</span>
                                        {/* Optional: Badge Image */}
                                        <img className="w-9 h-9" alt="Badge" src="/e8f1e2c420b463d58afb4c92a8abaaf6-removebg-preview-1.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <SectionTitle>Languages</SectionTitle>
                        <div className="relative pl-3">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                            <div className="space-y-6">
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex items-center gap-3 relative">
                                        {/* Dot */}
                                        <div className={`absolute left-[-5.5px] w-3 h-3 rounded-full ${lang.completed ? 'bg-indigo-500' : 'bg-white ring-2 ring-indigo-500'}`}></div>
                                        <p className="text-sm text-slate-700">
                                            <span className="font-medium text-slate-800">{lang.name}:</span> {lang.level}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* About Me / Timeline */}
                    <Card className="lg:col-span-3">
                        <SectionTitle>Experience & Education</SectionTitle>
                        <div className="relative pl-5 pt-2">
                             {/* Vertical Line */}
                             <div className="absolute left-0 top-5 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 ml-[21px]"></div> {/* Adjusted position */}
                            <div className="space-y-8">
                                {timelineItems.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        {/* Icon & Dot */}
                                        <div className="relative flex-shrink-0">
                                            <div className={`absolute left-[-29px] top-[14px] w-3 h-3 rounded-full ${item.completed ? 'bg-indigo-500' : 'bg-white ring-2 ring-indigo-500'}`}></div>
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center ring-1 ring-slate-200">
                                                <img className="w-6 h-6 object-contain" alt={item.iconAlt} src={item.icon} />
                                            </div>
                                        </div>

                                        {/* Item Content */}
                                        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1">
                                                <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                                                <span className="text-xs text-slate-500 flex-shrink-0 pt-0.5">{item.period}</span>
                                            </div>
                                            <p className="mt-1.5 text-sm text-slate-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Bio */}
                    <Card>
                        <SectionTitle>Bio</SectionTitle>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            I'm Walaa, a Backend Developer passionate about building scalable and secure web applications.
                            I specialize in Node.js, Express, and PostgreSQL, always eager to tackle complex backend
                            challenges and optimize performance. Currently expanding my skills in Docker and microservices architecture.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
