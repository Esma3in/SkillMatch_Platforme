import Logo from "../../assets/Logoo.png" 
 export const Footer = ()=>{ 
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
    
  return( 
    <>
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
                  src={Logo}
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
</>
  )
}