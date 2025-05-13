import React, { useState, useEffect } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { id: "overview", label: "Platform Overview" },
    { id: "candidates", label: "For Candidates" },
    { id: "companies", label: "For Companies" },
    { id: "admins", label: "For Admins" },
    { id: "bans", label: "Ban & Restriction Rules" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "support", label: "Support Resources" },
    { id: "faq", label: "FAQs" },
    { id: "contact", label: "Contact Us" },
  ];

  // Mock search handler
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Replace with real search logic (e.g., API call to /api/support/search)
  };
  const navigate =  useNavigate()
  return (
    <>
   
      <div className="relative">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Sticky Header with Search */}
        <header className="sticky top-0 bg-white shadow-md z-40 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="text-2xl font-bold text-indigo-600">SkillMatch Support Hub</h2>
            <button className ="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors" onClick={()=>navigate('/')}>return back </button>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search support topics..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 px-6">
          {/* Hero Banner */}
          <section className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-3xl p-12 mb-12 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">SkillMatch: Your Ultimate Platform Guide</h1>
            <p className="text-lg mb-8 max-w-2xl animate-fade-in delay-100">
              Whether you're a candidate earning badges, a company hiring talent, or an admin managing the platform, this guide covers everything you need to know about SkillMatch’s features, rules, privacy, and support.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in delay-200">
              <a
                href="#overview"
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              >
                Explore the Platform
              </a>
              <a
                href="#contact"
                className="bg-violet-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-violet-600 transform hover:scale-105 transition-all duration-300"
              >
                Get Support
              </a>
            </div>
          </section>

          {/* Platform Overview */}
          <section id="overview" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">SkillMatch Platform Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Connecting Talent with Opportunity</h3>
                <p className="text-gray-600 mb-6">
                  SkillMatch is a cutting-edge platform designed to empower candidates, companies, and admins. Candidates complete Question-and-Answer Competency Modules (QCMs) to earn verifiable badges, companies recruit top talent based on these credentials, and admins ensure a fair, secure environment. Our mission is to bridge the skills gap with transparency and innovation, inspired by platforms like OpenClassrooms and Udemy.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Skill Assessments</h4>
                      <p className="text-gray-600">
                        Candidates complete QCM-based roadmaps (e.g., “Python Programming”) to test skills. Scores above 80/100 earn badges, stored securely in our database.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Badge Verification</h4>
                      <p className="text-gray-600">
                        Companies verify candidate badges via unique IDs, ensuring authenticity. Badges include score, roadmap title, and date earned.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Platform Management</h4>
                      <p className="text-gray-600">
                        Admins oversee user activity, enforce rules, and manage data, ensuring compliance with GDPR and platform policies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Rigorous badge criteria (score grather than 80)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>GDPR-compliant data handling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Global talent network</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Robust admin controls</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* For Candidates */}
          <section id="candidates" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">For Candidates</h2>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Journey on SkillMatch</h3>
              <p className="text-gray-600 mb-6">
                As a candidate, SkillMatch empowers you to showcase your skills through QCM assessments and earn badges that open doors to career opportunities. Here’s how to succeed:
              </p>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">1. Completing QCM Roadmaps</h4>
                  <p className="text-gray-600 mb-4">
                    Choose a roadmap (e.g., “Data Analysis with SQL”) from your dashboard. Each QCM tests specific skills with timed questions. Aim for a score above 80/100 to earn a badge.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Prepare using provided resources or external materials.</li>
                    <li>Answer within the time limit to demonstrate proficiency.</li>
                    <li>Review feedback after submission to improve on retakes.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">2. Earning Badges</h4>
                  <p className="text-gray-600 mb-4">
                    Badges are digital credentials awarded for QCM scores above 80/100. Each badge includes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Your score (e.g., 85/100).</li>
                    <li>Roadmap title (e.g., “Frontend Development”).</li>
                    <li>Date earned and unique ID for verification.</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    Display badges in your profile or share with employers. Control visibility (public, private, employer-only) in your settings.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">3. Candidate Rights</h4>
                  <p className="text-gray-600 mb-4">
                    You have full control over your data and experience, with rights inspired by GDPR:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Transparency", desc: "View how your data and scores are processed in your dashboard." },
                      { title: "Access", desc: "Export your profile, QCM results, and badges via 'Export Data'." },
                      { title: "Rectification", desc: "Correct errors (e.g., wrong score) by contacting support." },
                      { title: "Erasure", desc: "Delete your account; data purged within 90 days, except audit logs." },
                      { title: "Restrict Processing", desc: "Opt out of notifications or hide badges." },
                      { title: "Portability", desc: "Download data in JSON/PDF for other platforms." },
                      { title: "Fair Assessment", desc: "Appeal scores or badge denials within 7 days." },
                      { title: "Non-Discrimination", desc: "Fair evaluations with audited algorithms." }
                    ].map((right, index) => (
                      <div
                        key={index}
                        className="bg-indigo-50 rounded-lg p-4 hover:bg-indigo-100 transition-colors duration-300"
                      >
                        <h5 className="text-lg font-medium text-indigo-600">{right.title}</h5>
                        <p className="text-gray-600">{right.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">4. Candidate Rules</h4>
                  <p className="text-gray-600 mb-4">
                    Adhere to these rules to maintain a fair environment:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Provide accurate profile and assessment information.</li>
                    <li>Complete QCMs independently without cheating (e.g., no shared answers).</li>
                    <li>Do not sell or misrepresent badges.</li>
                    <li>Communicate respectfully with employers and support.</li>
                    <li>Protect others’ data and platform content.</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                Exercise rights or report issues at{" "}
                <a href="mailto:support@skillmatch.com" className="text-indigo-600 hover:underline">
                  support@skillmatch.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* For Companies */}
          <section id="companies" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">For Companies</h2>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Hiring with SkillMatch</h3>
              <p className="text-gray-600 mb-6">
                Companies use SkillMatch to recruit top talent by leveraging our verified badge system and candidate profiles. Here’s how to maximize your hiring process:
              </p>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">1. Accessing Candidate Profiles</h4>
                  <p className="text-gray-600 mb-4">
                    Browse candidate profiles with verified badges, showcasing skills like “React Development” or “Project Management.” Each badge is tied to a QCM score above 80/100.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Filter candidates by skills, badge count, or roadmap completion.</li>
                    <li>Request access to detailed profiles with candidate consent.</li>
                    <li>Verify badges using unique IDs via our API or dashboard.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">2. Posting Opportunities</h4>
                  <p className="text-gray-600 mb-4">
                    Create job listings and match with candidates based on their badges and profiles:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Specify required skills or badge types (e.g., “AWS Certified”).</li>
                    <li>Receive applications with verified credentials.</li>
                    <li>Communicate directly with candidates via secure messaging.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">3. Company Rights</h4>
                  <p className="text-gray-600 mb-4">
                    Companies have rights to ensure a fair hiring process:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Access verified candidate data with consent.</li>
                    <li>Request corrections to job listings or candidate interactions.</li>
                    <li>Appeal platform decisions (e.g., account restrictions) within 14 days.</li>
                    <li>Receive transparent data handling details.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">4. Company Rules</h4>
                  <p className="text-gray-600 mb-4">
                    Follow these rules to maintain platform integrity:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Post accurate job listings and requirements.</li>
                    <li>Respect candidate data privacy; do not share without consent.</li>
                    <li>Communicate professionally and avoid discriminatory practices.</li>
                    <li>Verify badges through official channels only.</li>
                    <li>Comply with GDPR and platform policies.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">5. Example Workflow</h4>
                  <p className="text-gray-600">
                    A tech company needs a Python developer:
                  </p>
                  <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                    <li>Post a job listing requiring a “Python Advanced” badge.</li>
                    <li>Filter candidates with the badge and scores above 85/100.</li>
                    <li>Request profile access and verify badges via API.</li>
                    <li>Interview top candidates and hire based on verified skills.</li>
                  </ol>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                For hiring support, contact{" "}
                <a href="mailto:companies@skillmatch.com" className="text-indigo-600 hover:underline">
                  companies@skillmatch.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* For Admins */}
          <section id="admins" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">For Admins</h2>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Managing SkillMatch</h3>
              <p className="text-gray-600 mb-6">
                Admins play a critical role in maintaining SkillMatch’s integrity, security, and fairness. Here’s how to manage the platform effectively:
              </p>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">1. User Moderation</h4>
                  <p className="text-gray-600 mb-4">
                    Monitor candidate and company activity to ensure compliance with platform rules:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Review reports of cheating, harassment, or data misuse.</li>
                    <li>Issue warnings, restrictions, or bans as needed.</li>
                    <li>Handle appeals within 14 days, reviewing evidence (e.g., QCM logs).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">2. Data Oversight</h4>
                  <p className="text-gray-600 mb-4">
                    Ensure data compliance and security:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Audit data access logs to prevent unauthorized use.</li>
                    <li>Process candidate data deletion requests within 90 days.</li>
                    <li>Verify GDPR compliance for international data transfers.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">3. Admin Rights</h4>
                  <p className="text-gray-600 mb-4">
                    Admins have rights to manage the platform effectively:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Access user activity logs for moderation purposes.</li>
                    <li>Request platform updates or bug fixes from developers.</li>
                    <li>Receive training on GDPR and platform policies.</li>
                    <li>Appeal platform-level decisions (e.g., admin account issues).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">4. Admin Rules</h4>
                  <p className="text-gray-600 mb-4">
                    Admins must follow strict guidelines:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Use admin privileges only for authorized tasks.</li>
                    <li>Do not access user data without justification.</li>
                    <li>Maintain confidentiality of platform operations.</li>
                    <li>Comply with GDPR and security protocols.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">5. Example Scenario</h4>
                  <p className="text-gray-600">
                    A candidate reports cheating on a QCM:
                  </p>
                  <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                    <li>Review QCM logs and user activity.</li>
                    <li>Issue a warning or badge revocation if evidence confirms cheating.</li>
                    <li>Notify the candidate and provide appeal instructions.</li>
                    <li>Update audit logs to document the action.</li>
                  </ol>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                For admin support, contact{" "}
                <a href="mailto:admin@skillmatch.com" className="text-indigo-600 hover:underline">
                  admin@skillmatch.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* Ban and Restriction Rules */}
          <section id="bans" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">Ban & Restriction Rules</h2>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Maintaining Platform Integrity</h3>
              <p className="text-gray-600 mb-6">
                SkillMatch enforces strict ban and restriction policies to ensure fairness and security for all users. Below are the rules and consequences for candidates, companies, and admins.
              </p>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">1. Candidate Violations</h4>
                  <p className="text-gray-600 mb-4">
                    Candidates may face restrictions or bans for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong>Cheating on QCMs:</strong> Using unauthorized tools, sharing answers, or manipulating scores. <em>Consequence:</em> Badge revocation, 30-day suspension, or permanent ban for repeat offenses.
                    </li>
                    <li>
                      <strong>Misrepresenting Badges:</strong> Selling or falsifying badges. <em>Consequence:</em> Badge removal, account termination.
                    </li>
                    <li>
                      <strong>Harassment:</strong> Inappropriate behavior toward employers or staff. <em>Consequence:</em> Warning, 7-day restriction, or ban.
                    </li>
                    <li>
                      <strong>Data Misuse:</strong> Sharing others’ data or QCM content. <em>Consequence:</em> Suspension, legal action if severe.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">2. Company Violations</h4>
                  <p className="text-gray-600 mb-4">
                    Companies may be restricted or banned for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong>Inaccurate Listings:</strong> Posting false job details. <em>Consequence:</em> Listing removal, 14-day posting restriction.
                    </li>
                    <li>
                      <strong>Data Misuse:</strong> Sharing candidate data without consent. <em>Consequence:</em> Account suspension, legal action.
                    </li>
                    <li>
                      <strong>Discrimination:</strong> Unfair hiring practices. <em>Consequence:</em> Warning, 30-day restriction, or ban.
                    </li>
                    <li>
                      <strong>Non-Compliance:</strong> Violating GDPR or platform policies. <em>Consequence:</em> Account termination.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">3. Admin Violations</h4>
                  <p className="text-gray-600 mb-4">
                    Admins face strict consequences for misuse of privileges:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong>Unauthorized Access:</strong> Viewing user data without justification. <em>Consequence:</em> Admin privileges revoked, possible termination.
                    </li>
                    <li>
                      <strong>Policy Violation:</strong> Ignoring GDPR or platform rules. <em>Consequence:</em> Suspension, retraining, or removal.
                    </li>
                    <li>
                      <strong>Bias in Moderation:</strong> Unfair bans or restrictions. <em>Consequence:</em> Audit, privilege suspension.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">4. Appeal Process</h4>
                  <p className="text-gray-600 mb-4">
                    If restricted or banned, users can appeal:
                  </p>
                  <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                    <li>Contact{" "}
                        <a href="mailto:appeals@skillmatch.com" className="text-indigo-600 hover:underline">
                          appeals@skillmatch.com
                        </a>{" "}
                        within 14 days.
                    </li>
                    <li>Provide evidence (e.g., QCM ID, communication logs).</li>
                    <li>Admins review within 7 days, escalating to senior staff if needed.</li>
                    <li>Receive a decision (e.g., reinstate account, uphold ban).</li>
                  </ol>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">5. Example Scenarios</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong>Candidate:</strong> A user shares QCM answers online. <em>Action:</em> Badge revoked, 30-day suspension, appeal option.
                    </li>
                    <li>
                      <strong>Company:</strong> A firm misuses candidate data. <em>Action:</em> Account suspended, legal review, appeal within 14 days.
                    </li>
                    <li>
                      <strong>Admin:</strong> An admin bans a user without evidence. <em>Action:</em> Privilege suspension, case audited.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                Report violations or appeal at{" "}
                <a href="mailto:appeals@skillmatch.com" className="text-indigo-600 hover:underline">
                  appeals@skillmatch.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">Privacy Policy</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Protecting Your Data</h3>
              <p className="text-gray-600 mb-6">
                SkillMatch is committed to safeguarding data for candidates, companies, and admins, complying with GDPR, the Indian DPDP Act, and global standards.
              </p>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">1. Data Collection</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong>Candidates:</strong> Profile (name, email, resume), QCM scores, badges, interaction data.
                    </li>
                    <li>
                      <strong>Companies:</strong> Business details, job listings, candidate interaction logs.
                    </li>
                    <li>
                      <strong>Admins:</strong> Activity logs, moderation records, access permissions.
                    </li>
                    <li>
                      <strong>All Users:</strong> Technical data (IP, device) for security and analytics.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">2. Data Usage</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Certify candidate skills and award badges (scores  grather tahn 80).</li>
                    <li>Match candidates with company opportunities.</li>
                    <li>Enable admin moderation and platform oversight.</li>
                    <li>Send notifications and improve platform features.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">3. Data Sharing</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong>Candidates:</strong> Profile/badges shared with companies (with consent).
                    </li>
                    <li>
                      <strong>Companies:</strong> Job data shared with candidates; analytics with providers.
                    </li>
                    <li>
                      <strong>Admins:</strong> Limited data access for moderation, shared internally only.
                    </li>
                    <li>
                      <strong>Legal:</strong> Shared for compliance or to protect SkillMatch’s rights.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">4. Security & Retention</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>AES-256 encryption, OAuth 2.0 APIs, annual audits.</li>
                    <li>International transfers via Standard Contractual Clauses (SCCs).</li>
                    <li>Active accounts: Data retained indefinitely.</li>
                    <li>Deleted accounts: Purged within 90 days, except 12-month audit logs.</li>
                    <li>Inactive accounts: Deleted after 36 months unless reactivated.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">5. Your Choices</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Candidates: Opt out of notifications, control badge visibility.</li>
                    <li>Companies: Manage job listing visibility, data sharing preferences.</li>
                    <li>Admins: Request data access logs for transparency.</li>
                    <li>All: Export or delete data via dashboard or support.</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                Full policy at{" "}
                <a href="/privacy-policy" className="text-indigo-600 hover:underline">
                  skillmatch.com/privacy
                </a>
                . Contact{" "}
                <a href="mailto:privacy@skillmatch.com" className="text-indigo-600 hover:underline">
                  privacy@skillmatch.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* Support Resources */}
          <section id="support" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">Support Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Guide: Earning Badges (Candidates)",
                  desc: "Complete QCMs, score >80, and display badges to attract employers."
                },
                {
                  title: "Guide: Hiring Talent (Companies)",
                  desc: "Post jobs, verify badges, and connect with skilled candidates."
                },
                {
                  title: "Guide: Moderating Users (Admins)",
                  desc: "Review reports, enforce rules, and ensure platform fairness."
                },
                {
                  title: "Blog: Optimizing Your Profile",
                  desc: "Tips for candidates to stand out with badges and bios."
                },
                {
                  title: "Blog: Effective Job Listings",
                  desc: "Best practices for companies to attract top talent."
                },
                {
                  title: "Blog: Admin Best Practices",
                  desc: "Strategies for fair and efficient platform management."
                }
              ].map((resource, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{resource.title}</h3>
                  <p className="text-gray-600">{resource.desc}</p>
                  <a
                    href="#"
                    className="text-indigo-600 hover:underline mt-4 inline-block"
                  >
                    Read More
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section id="faq" className="mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">Frequently Asked Questions</h2>
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              {[
                {
                  question: "How do candidates earn badges?",
                  answer: "Complete a QCM roadmap and score above 80/100. Badges are awarded automatically and verifiable by employers."
                },
                {
                  question: "How do companies verify badges?",
                  answer: "Use the unique badge ID via our API or dashboard to confirm authenticity, including score and roadmap details."
                },
                {
                  question: "What actions can admins take?",
                  answer: "Admins can moderate users, issue bans, audit data, and handle appeals to maintain platform integrity."
                },
                {
                  question: "What happens if I violate rules?",
                  answer: "Violations may lead to warnings, suspensions, or bans. Appeal within 14 days via appeals@skillmatch.com."
                },
                {
                  question: "How is my data protected?",
                  answer: "We use AES-256 encryption, secure APIs, and GDPR-compliant practices. You control data visibility."
                },
                {
                  question: "Can I appeal a ban?",
                  answer: "Yes, email appeals@skillmatch.com with evidence within 14 days. Reviews take 7 days."
                },
                {
                  question: "How long is data retained?",
                  answer: "Active accounts: indefinitely. Deleted accounts: purged in 90 days, except 12-month audit logs."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 py-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUpIcon className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6 text-indigo-600" />
                    )}
                  </button>
                  {openFaq === index && (
                    <p className="text-gray-600 mt-2 animate-fade-in">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="text-center py-12">
            <h2 className="text-4xl font-bold text-indigo-600 mb-8">Contact Us</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <p className="text-gray-600 text-lg mb-6">
                Our support team is available 24/7 for candidates, companies, and admins. Reach out for help with badges, hiring, moderation, or any platform queries.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <a
                  href="mailto:support@skillmatch.com"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
                >
                  Email Support
                </a>
                <a
                  href="/chat-support"
                  className="bg-violet-500 text-white px-6 py-3 rounded-full hover:bg-violet-600 transform hover:scale-105 transition-all duration-300"
                >
                  Live Chat
                </a>
                <a
                  href="tel:+1-800-555-1234"
                  className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transform hover:scale-105 transition-all duration-300"
                >
                  Call Us
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                Email responses within 24 hours. Chat and phone support vary by region.
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SupportPage;