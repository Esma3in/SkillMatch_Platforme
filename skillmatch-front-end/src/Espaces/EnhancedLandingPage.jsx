import React from "react";
import { ArrowRightIcon, CheckIcon, MenuIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '../assets/Logoo.png';

export const EnhancedLandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Features data
  const features = [
    {
      title: "Skill-Based Matching",
      description: "Connect with companies based on your actual skills, not just your resume",
      icon: "🎯",
    },
    {
      title: "Personalized Roadmaps",
      description: "Follow custom learning paths designed for your target companies",
      icon: "🗺️",
    },
    {
      title: "Real-World Challenges",
      description: "Prove your abilities through practical tests created by companies",
      icon: "🏆",
    },
    {
      title: "Direct Connections",
      description: "Get noticed by companies looking for your specific skill set",
      icon: "🔗",
    },
  ];
  const footerSections = [
    {
        title: "About SkillMatch",
        description:
            "SkillMatch is a platform designed to connect young talent with forward-thinking companies by focusing on skills and performance instead of traditional resumes.",
    },
    {
        title: "Company",
        links: ["About Us", "Our Mission", "Team", "Career"],
    },
    {
        title: "Platform",
        links: [
            "How It Works",
            "Candidate Roadmaps",
            "Company Challenges",
            "Skill-based Tests",
        ],
    },
    {
        title: "Legal & Help",
        links: ["Terms & Conditions", "Privacy Policy", "Contact Support", "FAQs"],
    },
];


  // Testimonials data
  const testimonials = [
    {
      quote: "SkillMatch completely changed how I approach job hunting. Instead of sending out countless applications, companies now reach out to me based on my proven skills.",
      author: "Sarah K.",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      quote: "As a self-taught developer, I struggled to get interviews. With SkillMatch, I completed challenges that showcased my abilities, and landed three job offers in two weeks!",
      author: "Michael T.",
      role: "Full Stack Engineer",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      quote: "The personalized roadmap helped me identify and fill skill gaps that were holding me back. Now I'm working at my dream company.",
      author: "Aisha J.",
      role: "Data Scientist",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  // Pricing plans
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Basic profile creation",
        "Access to public challenges",
        "Limited company matches",
        "Community forum access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Everything you need to land your dream job",
      features: [
        "Enhanced profile visibility",
        "Unlimited company matches",
        "Priority access to challenges",
        "Personalized roadmaps",
        "Direct messaging with companies",
        "Skills certification",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For companies seeking top talent",
      features: [
        "Custom challenge creation",
        "Advanced candidate filtering",
        "Dedicated account manager",
        "API access",
        "Analytics dashboard",
        "Bulk messaging",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  // Partner companies
  const partners = [
    "Alten",
    "OCP Group",
    "Capgemini",
    "CGI",
    "CBI",
  ];

  return (
    <div className="bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full max-w-[90%] mx-auto py-4 bg-white/95 backdrop-blur-sm rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="nav-item">
                <img src={logo} alt="Logo" className="h-11 w-auto" />
                <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text">
                  SkillMatch  
                </h2>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">Features</Link>
              <Link to="#testimonials" className="text-sm font-medium text-gray-500 hover:text-gray-900">Testimonials</Link>
              <Link to="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900">Pricing</Link>
              <Link to="#faq" className="text-sm font-medium text-gray-500 hover:text-gray-900">FAQ</Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/signIn" className="text-sm font-medium text-gray-500 hover:text-gray-900">Sign in</Link>
              <Link 
                to="/signUp" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-75">
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <img
                          src="https://c.animaapp.com/ma5cixatPLPI5h/img/whatsapp-image-2025-04-11-at-15-17-07-f1938157-removebg-preview--1.png"
                          alt="SkillMatch Logo"
                          className="h-8 w-auto"
                        />
                        <span className="ml-2 text-xl font-semibold text-gray-900">SkillMatch</span>
                      </div>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 px-4 sm:px-6">
                    <div className="flex flex-col space-y-6">
                      <Link to="#features" className="text-base font-medium text-gray-900 hover:text-gray-700">Features</Link>
                      <Link to="#testimonials" className="text-base font-medium text-gray-900 hover:text-gray-700">Testimonials</Link>
                      <Link to="#pricing" className="text-base font-medium text-gray-900 hover:text-gray-700">Pricing</Link>
                      <Link to="#faq" className="text-base font-medium text-gray-900 hover:text-gray-700">FAQ</Link>
                      <div className="pt-6 border-t border-gray-200">
                        <Link to="/signIn" className="block w-full text-center px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                          Sign in
                        </Link>
                        <Link to="/signUp" className="mt-4 block w-full text-center px-4 py-2 rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                          Sign up
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <div className="pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 bg-[#1a124a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Flip the hiring game</span>
                <span className="block text-white">where companies <span className="bg-gradient-to-br from-violet-400 to-white bg-clip-text text-transparent">compete</span> for your talent</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                SkillMatch flips the script—now companies chase your talent. Showcase your skills, solve challenges, and let opportunities come to you.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  to="/signUp"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/support"
                  target="_blank"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
                >
                  Learn more
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Preview */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">Platform Preview</span>
              </div>
            </div>
            <div className="mt-12">
              <img
                className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 mx-auto"
                src="https://c.animaapp.com/ma5cixatPLPI5h/img/-6c945d41-b0c2-42d8-a646-7d1da5f99633--2.png"
                alt="SkillMatch Platform Preview"
              />
            </div>
          </div>
        </div>

        {/* Partner Companies */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">
              Trusted by leading companies
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
              {partners.map((partner, index) => (
                <div key={index} className="col-span-1 flex justify-center items-center">
                  <img
                    className="h-12 object-contain"
                    src={`https://c.animaapp.com/ma5cixatPLPI5h/img/${partner.toLowerCase().replace(' ', '-')}-removebg-preview-1.png`}
                    alt={`${partner} logo`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gradient-to-r from-indigo-50 to-blue-50 text-lg font-medium text-indigo-600">Features</span>
              </div>
            </div>
            
            <div className="mt-12">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Showcase your real skills, not just your resume
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg text-gray-500">
                    SkillMatch helps you demonstrate your abilities through practical challenges and personalized roadmaps, connecting you directly with companies looking for your specific talents.
                  </p>
                  
                  <div className="mt-10 space-y-10">
                    {features.map((feature, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            <span className="text-xl">{feature.icon}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                          <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-10 lg:mt-0">
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <img
                      className="w-full"
                      src="https://c.animaapp.com/ma5cixatPLPI5h/img/image-1.png"
                      alt="Roadmap feature"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How It Works</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">Three simple steps to success</p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Build Your Profile</h3>
                  <p className="mt-2 text-base text-gray-500">Create your profile highlighting your skills, experience, and career goals.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Complete Challenges</h3>
                  <p className="mt-2 text-base text-gray-500">Demonstrate your abilities through real-world challenges created by companies.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Get Matched</h3>
                  <p className="mt-2 text-base text-gray-500">Companies will reach out to you based on your proven skills and performance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div id="testimonials" className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Testimonials</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">Hear from our successful users</p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={testimonial.avatar}
                        alt={testimonial.author}
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{testimonial.author}</h3>
                        <p className="text-sm text-indigo-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-500 italic">{testimonial.quote}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">Plans for every stage of your career</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">Choose the perfect plan to help you showcase your skills and connect with top companies.</p>
            </div>

            <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div key={index} className={`rounded-lg shadow-lg divide-y divide-gray-200 ${plan.popular ? 'border-2 border-indigo-500 relative' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-indigo-500 rounded-full px-4 py-1 text-xs font-semibold text-white transform rotate-12">
                      Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                    <p className="mt-8">
                      <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                      {plan.period && <span className="text-base font-medium text-gray-500">{plan.period}</span>}
                    </p>
                    <a
                      href="#"
                      className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                    <ul className="mt-6 space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex">
                          <CheckIcon className="flex-shrink-0 h-6 w-6 text-green-500" />
                          <span className="ml-3 text-base text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">FAQ</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">Frequently asked questions</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">Everything you need to know about SkillMatch and how it works.</p>
            </div>

            <div className="mt-12">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                <div>
                  <dt className="text-lg font-medium text-gray-900">How does SkillMatch work?</dt>
                  <dd className="mt-2 text-base text-gray-500">SkillMatch connects candidates with companies based on demonstrated skills rather than traditional resumes. Complete challenges, follow roadmaps, and let companies discover your talents.</dd>
                </div>
                <div>
                  <dt className="text-lg font-medium text-gray-900">Is SkillMatch free to use?</dt>
                  <dd className="mt-2 text-base text-gray-500">We offer a free tier with basic features, as well as premium plans with enhanced capabilities for both job seekers and companies.</dd>
                </div>
                <div>
                  <dt className="text-lg font-medium text-gray-900">How do I get noticed by companies?</dt>
                  <dd className="mt-2 text-base text-gray-500">Complete skill challenges, follow personalized roadmaps, and build a comprehensive profile that showcases your abilities. Companies search for candidates based on these demonstrated skills.</dd>
                </div>
                <div>
                  <dt className="text-lg font-medium text-gray-900">Can I use SkillMatch if I'm a student?</dt>
                  <dd className="mt-2 text-base text-gray-500">Absolutely! SkillMatch is perfect for students looking to demonstrate their abilities and connect with internship or entry-level opportunities.</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-700 ">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to showcase your skills?</span>
              <span className="block text-indigo-200">Start your journey with SkillMatch today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signUp"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  to="#features"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="md:mt-24 relative pb-8">
                    {/* Adjusted structure slightly */}
                     <div className="bg-[#f3f2ff] p-6 md:p-8 rounded-t-2xl"> {/* Added rounded-t */}
                         {/* Call to Action Section */}
                        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 md:mb-16 gap-6 md:gap-8">
                            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 md:gap-6">
                                <img
                                     // Slightly smaller logo for footer CTA
                                    className="w-24 h-24 md:w-32 md:h-32 lg:w-[150px] lg:h-[150px] object-cover flex-shrink-0"
                                    alt="SkillMatch Logo"
                                    src="https://c.animaapp.com/ma5cixatPLPI5h/img/whatsapp-image-2025-04-11-at-15-17-07-f1938157-removebg-preview--1.png"
                                />
                                 {/* Adjusted text size and line height */}
                                <h2 className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-bold text-gray-900 text-xl md:text-2xl leading-snug max-w-xl">
                                    Ready to level up your tech career?
                                    <br />
                                    Join <span className="text-indigo-600 font-extrabold">SkillMatch</span> and get matched
                                    with companies based on your real skills.
                                </h2>
                            </div>

                             {/* Consistent button styling */}
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 h-auto w-full sm:w-auto flex-shrink-0">
                                <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-extrabold text-base">
                                    Start Your Journey
                                </span>
                            </button>
                        </div>

                        {/* Footer Links Grid */}
                        {/* Using footerSections data */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 md:mt-12 pt-8 border-t border-indigo-100">
                             {/* Section 1: About */}
                            <div>
                                <h3 className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-bold text-indigo-600 text-lg md:text-xl mb-4">
                                    {footerSections[0].title}
                                </h3>
                                 {/* Adjusted text size and margin */}
                                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                    {footerSections[0].description}
                                </p>
                                 {/* Social Icons - Use actual icons */}
                                <div className="flex items-center gap-4">
                                    {/* Placeholders */}
                                    <a href="#" aria-label="SkillMatch on Twitter" className="text-gray-500 hover:text-indigo-600"> <div className="w-[17px] h-[15px] bg-[url(https://c.animaapp.com/ma5cixatPLPI5h/img/group-4.png)] bg-[100%_100%]" /> </a>
                                    <a href="#" aria-label="SkillMatch on Facebook" className="text-gray-500 hover:text-indigo-600"> <div className="w-2.5 h-[22px] bg-[url(https://c.animaapp.com/ma5cixatPLPI5h/img/group-5.png)] bg-[100%_100%]" /> </a>
                                    <a href="#" aria-label="SkillMatch on LinkedIn" className="text-gray-500 hover:text-indigo-600"> <div className="w-[19px] h-[22px] bg-[url(https://c.animaapp.com/ma5cixatPLPI5h/img/group-6.png)] bg-[100%_100%]" /> </a>
                                    <a href="#" aria-label="SkillMatch on GitHub" className="text-gray-500 hover:text-indigo-600"> <div className="w-[18px] h-[22px] bg-[url(https://c.animaapp.com/ma5cixatPLPI5h/img/group-7.png)] bg-[100%_100%]" /> </a>
                                </div>
                            </div>

                            {/* Section 2: Company */}
                            <div>
                                <h3 className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-bold text-indigo-600 text-lg md:text-xl mb-4">
                                     {footerSections[1].title}
                                </h3>
                                <ul className="space-y-2">
                                     {footerSections[1].links.map(link => (
                                         <li key={link}>
                                             <a href="#" className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-sm text-gray-700 hover:text-indigo-600 hover:underline">
                                                 {link}
                                             </a>
                                         </li>
                                     ))}
                                </ul>
                            </div>

                            {/* Section 3: Platform */}
                             <div>
                                <h3 className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-bold text-indigo-600 text-lg md:text-xl mb-4">
                                     {footerSections[2].title}
                                </h3>
                                <ul className="space-y-2">
                                     {footerSections[2].links.map(link => (
                                         <li key={link}>
                                             <a href="#" className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-sm text-gray-700 hover:text-indigo-600 hover:underline">
                                                 {link}
                                             </a>
                                         </li>
                                     ))}
                                </ul>
                            </div>

                            {/* Section 4: Legal & Help */}
                            <div>
                                <h3 className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-bold text-indigo-600 text-lg md:text-xl mb-4">
                                    {footerSections[3].title}
                                </h3>
                               <ul className="space-y-2">
                                     {footerSections[3].links.map(link => (
                                         <li key={link}>
                                             <a href="#" className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-sm text-gray-700 hover:text-indigo-600 hover:underline">
                                                 {link}
                                             </a>
                                         </li>
                                     ))}
                                </ul>
                            </div>
                        </div>

                         {/* Copyright */}
                        <div className="text-center text-gray-500 text-xs mt-12 pt-8 border-t border-indigo-100">
                            © {new Date().getFullYear()} SkillMatch. All rights reserved.
                        </div>
                    </div>
                </footer>
      </div>
  )
      
}
