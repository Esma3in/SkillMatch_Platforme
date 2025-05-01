import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function
const cn = (...inputs) => twMerge(clsx(inputs));

// Component definitions (assuming these are correct and imported/defined elsewhere)
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", // overflow-hidden here is usually intended for avatars
            className
        )}
        {...props}
    />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
    <img
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = "AvatarFallback";

const Button = React.forwardRef(
    ({ className, variant, size, ...props }, ref) => {
        // Added basic variants for context, adjust as needed for your actual Button styles
        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
        // Example variant styles (you might have more complex logic)
        const variantStyles = {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        };
        // Example size styles
        const sizeStyles = {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
        };

        return (
            <button
                className={cn(
                    baseStyles,
                    // variantStyles[variant] || variantStyles.default, // Apply variant styles if defined
                    // sizeStyles[size] || sizeStyles.default, // Apply size styles if defined
                    className // Ensure className prop can override
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";


const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border bg-card text-card-foreground shadow", // Base card styles, no overflow-hidden here by default
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    // Adjusted padding for CardContent based on usage in the code (p-8 in some places)
    // The original 'pt-0' might conflict with how it's used later. Let's make it p-6 default.
    <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";


// Data for team members
const teamMembers = [
    {
        name: "Olivia Rhye",
        role: "Founder & CEO",
        description:
            "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
        avatarUrl: "https://c.animaapp.com/ma5cixatPLPI5h/img/avatar-2.svg",
        avatarBg: "bg-avatar-user-squareolivia-rhye-color-background", // Note: These bg classes seem custom/undefined in standard Tailwind
    },
    {
        name: "John Keer",
        role: "Engineering Manager",
        description: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
        avatarUrl: "https://c.animaapp.com/ma5cixatPLPI5h/img/avatar-1.svg",
        avatarBg: "bg-avatar-user-squarephoenix-baker-color-background", // Note: These bg classes seem custom/undefined in standard Tailwind
    },
    {
        name: "Lana Steiner",
        role: "Product Manager",
        description: "Former PM for Linear, Lambda School, and On Deck.",
        avatarUrl: "https://c.animaapp.com/ma5cixatPLPI5h/img/avatar-3.svg",
        avatarBg: "bg-avatar-user-squarelana-steiner-color-background", // Note: These bg classes seem custom/undefined in standard Tailwind
    },
    {
        name: "Demi Wilkinson",
        role: "Frontend Developer",
        description: "Former frontend dev for Linear, Coinbase, and Postscript.",
        avatarUrl: "https://c.animaapp.com/ma5cixatPLPI5h/img/avatar.svg",
        avatarBg: "bg-avatar-user-squaredemi-wilkinson-color-background", // Note: These bg classes seem custom/undefined in standard Tailwind
    },
];

// Data for navigation items
const navItems = [
    { label: "About us", href: "#" },
    { label: "Services", href: "#" },
    { label: "Team", href: "#" },
    { label: "FAQ", href: "#" },
];

// Data for footer sections (used for consistency, though your original code hardcoded some)
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


export const LandingPage = () => {
    return (
        // Added min-h-screen and flex container for better structure if needed
        <div className="w-full bg-white min-h-screen flex flex-col">
            {/* Added px-4 sm:px-8 md:px-16 for responsive padding */}
            <div className="relative max-w-[1492px] mx-auto px-4 sm:px-8 md:px-16 w-full flex-grow">
                {/* Navigation Bar */}
                {/* Consider making header background white if sticky to avoid content overlap */}
                <header className="sticky top-0 z-50 w-full py-4 bg-white/95 backdrop-blur-sm">
                    {/* Adjusted padding and removed internal max-w as parent handles it */}
                    <nav className="flex items-center justify-between bg-white rounded-3xl border border-[#e3e3e3] p-3 md:p-4 shadow-sm">
                        <div className="flex items-center flex-shrink-0">
                            <img
                                className="w-10 h-10 md:w-[50px] md:h-[50px] object-cover"
                                alt="SkillMatch Logo" // Improved alt text
                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/whatsapp-image-2025-04-11-at-15-17-07-f1938157-removebg-preview--1.png"
                            />
                            {/* Adjusted font size for responsiveness */}
                            <div className="ml-2 md:ml-4 [font-family:'jsMath-cmr10-cmr10',Helvetica] font-normal text-black text-2xl md:text-3xl tracking-[-0.18px]">
                                SkillMatch
                            </div>
                        </div>

                        {/* Navigation Links - centered and responsive */}
                        <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
                            {navItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    // Added hover effect and slightly adjusted padding/font
                                    className="px-3 py-1.5 rounded-md [font-family:'Inter',Helvetica] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-base tracking-[-0.10px] transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Action Buttons & Profile */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Consistent button styling */}
                            <a
                                href="/signIn"
                                className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 rounded-lg h-9 px-3 md:px-4 text-sm md:text-[15px] font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center transition-colors duration-200 whitespace-nowrap"
                            >
                                Sign In
                            </a>
                            <a
                                href="/signUp"
                                // Using Button component might be better here if styles are complex
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 px-3 md:px-4 text-sm md:text-[15px] font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center transition-colors duration-200 whitespace-nowrap"
                            >
                                Sign Up
                            </a>

                            {/* Hidden on smaller screens, maybe replace with a menu icon */}
                            <img
                                className="w-10 h-10 md:w-[50px] md:h-[50px] object-cover rounded-full hidden sm:block" // Added rounded-full
                                alt="Profile"
                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/image-3.png"
                            />
                            {/* Add a mobile menu button here for smaller screens */}
                            <button className="lg:hidden p-2">
                                {/* Add Menu Icon (e.g., from lucide-react) */}
                                {/* <MenuIcon className="w-6 h-6" /> */}
                                <span className="sr-only">Open menu</span>
                            </button>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                {/* Reduced top margin, adjusted padding, text size */}
                <section className="mt-8 md:mt-16 bg-[#1a124a] w-full rounded-lg py-12 md:py-16 px-4 md:px-8">
                    {/* Image scaling */}
                    <img
                        className="w-full max-w-[800px] md:max-w-[1023px] h-auto mx-auto block" // Added block
                        alt="Flip the hiring game - where companies chase your talent" // Improved alt text
                        src="https://c.animaapp.com/ma5cixatPLPI5h/img/flip-the-hiring-game---where-companies.png"
                    />

                    {/* Adjusted text size and margin */}
                    <p className="text-white text-center text-lg md:text-xl lg:text-[32px] [font-family:'Inter',Helvetica] max-w-[1183px] mx-auto mt-8 md:mt-16 leading-relaxed">
                        SkillMatch flips the script—now companies chase your talent.
                        Showcase your skills, solve challenges, and let opportunities come
                        to you.
                    </p>

                    {/* Adjusted button size, gap, and margin */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 mt-8 md:mt-16">
                        {/* Use Button component for consistency? */}
                        <Button className="bg-[#485AFF] border-2 border-[#485aff] hover:bg-[#3a4ee0] rounded-lg px-6 py-3 h-auto w-full sm:w-auto">
                            <span className="[font-family:'Inter',Helvetica] font-extrabold text-white text-lg md:text-xl">
                                Get Started !
                            </span>
                        </Button>

                        <Button
                            variant="outline" // Assuming 'outline' variant exists
                            className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black rounded-lg px-6 py-3 h-auto flex items-center w-full sm:w-auto"
                        >
                            <span className="[font-family:'Inter',Helvetica] font-extrabold text-black text-lg md:text-xl mr-2">
                                Discover
                            </span>
                            <ArrowRightIcon className="w-5 h-5" /> {/* Slightly larger icon */}
                        </Button>
                    </div>
                </section>

                {/* Platform Showcase */}
                <section className="mt-12 md:mt-16">
                    {/* Added block display */}
                    <img
                        className="w-full max-w-[1375px] h-auto mx-auto object-cover block"
                        alt="SkillMatch Platform Showcase" // Improved alt text
                        src="https://c.animaapp.com/ma5cixatPLPI5h/img/-6c945d41-b0c2-42d8-a646-7d1da5f99633--2.png"
                    />
                </section>

                {/* Partner Companies */}
                <section className="mt-12 md:mt-16 text-center px-4">
                    <p className="[font-family:'Kodchasan',Helvetica] font-normal text-[#7f7f7f] text-[15px] mb-6 md:mb-8">
                        Collaborated by multiple companies
                    </p>

                    {/* Responsive gap and max width for container */}
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-12 max-w-5xl mx-auto">
                        {/* Adjusted image heights for consistency */}
                        <img
                            className="h-[60px] md:h-[80px] lg:h-[100px] object-contain" // Use object-contain
                            alt="Alten Logo"
                            src="https://c.animaapp.com/ma5cixatPLPI5h/img/logo-alten-removebg-preview-1.png"
                        />
                        <img
                            className="h-[60px] md:h-[80px] lg:h-[100px] object-contain"
                            alt="OCP Group Logo"
                            src="https://c.animaapp.com/ma5cixatPLPI5h/img/ocp-group-removebg-preview-1.png"
                        />
                        <img
                            className="h-[30px] md:h-[40px] lg:h-[47px] object-contain"
                            alt="Unknown Company Logo 1" // Add descriptive alt text
                            src="https://c.animaapp.com/ma5cixatPLPI5h/img/150-1.png"
                        />
                        <img
                            className="h-[35px] md:h-[45px] lg:h-[57px] object-contain"
                            alt="Unknown Company Logo 2" // Add descriptive alt text
                            src="https://c.animaapp.com/ma5cixatPLPI5h/img/logo-1.png"
                        />
                        <img
                            className="h-[70px] md:h-[90px] lg:h-[110px] object-contain" // Reduced height slightly
                            alt="Capgemini logo"
                            src="https://c.animaapp.com/ma5cixatPLPI5h/img/capgemini-logo-removebg-preview-1.png"
                        />
                        <img
                            className="h-[70px] md:h-[90px] lg:h-[110px] object-contain" // Reduced height, consistent with Capgemini
                            alt="CGI Logo" // Assuming Tlchargement is CGI
                            src="https://c.animaapp.com/ma5cixatPLPI5h/img/t-l-chargement--1--removebg-preview-1.png"
                        />
                         {/* Adjusted text size */}
                        <div className="[font-family:'Krona_One',Helvetica] font-normal text-black text-3xl md:text-4xl lg:text-5xl">
                            CBi
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="mt-12 md:mt-16 px-4">
                    {/* Centered divider/button container */}
                    <div className="relative w-full max-w-[706px] mx-auto py-8 ">
                        {/* Optional: Add a subtle background/border for the divider area */}
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#4f7bea1a] to-transparent"></div>
                         <div className="relative flex justify-center">
                             {/* Adjusted button styling */}
                            <Button
                                variant="outline"
                                className="bg-[#f8fafb] text-[#485aff] border-2 border-[#485aff] hover:bg-indigo-50 rounded-[30px] [font-family:'Inter',Helvetica] font-medium text-lg md:text-xl px-6 py-3 h-auto z-10"
                            >
                                Our Services
                            </Button>
                         </div>
                    </div>

                    {/* Adjusted grid layout and gap */}
                    <div className="mt-8 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Candidate Card */}
                        {/* REMOVED overflow-hidden */}
                        <Card className="rounded-3xl shadow-[2px_4px_4px_#0000001a,0px_4px_30px_#4f46e533] bg-gradient-to-r from-[rgba(88,69,238,0.06)] to-[rgba(79,123,234,0.01)]">
                            {/* Consistent padding */}
                            <CardContent className="p-6 md:p-8">
                                <div className="flex justify-center items-center mb-4">
                                    <img
                                        className="w-16 h-16 md:w-20 md:h-20 object-cover"
                                        alt="Candidate Icon" // Improved alt text
                                        src="https://c.animaapp.com/ma5cixatPLPI5h/img/profile-1.png"
                                    />
                                </div>

                                <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-2xl md:text-[32px] text-center mb-4 md:mb-6">
                                    Candidate
                                </h2>

                                {/* Adjusted text size and margin */}
                                <p className="[font-family:'Inter',Helvetica] font-medium text-[#6b7280] text-sm md:text-base mb-8 md:mb-12 leading-relaxed"> {/* Use Tailwind gray */}
                                    Candidat is the heart of our platform — a personalized space
                                    where each user can build their profile, showcase their
                                    skills, and track their progress through tailored roadmaps.
                                    Whether you're a student or job seeker, Candidat empowers you
                                    to stand out, connect with top opportunities, and grow through
                                    real project validation.
                                </p>

                                {/* Adjusted grid columns and gap for inner cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                                    {/* Inner Card Example 1 */}
                                    <Card className="bg-white rounded-2xl md:rounded-3xl">
                                        {/* Adjusted padding and image size */}
                                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 text-center">
                                            <img
                                                className="w-16 h-16 md:w-[91px] md:h-[91px] object-contain mb-2" // Use contain
                                                alt="Build Profile Icon"
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/hook-1.png"
                                            />
                                            <p className="[font-family:'Inter',Helvetica] font-medium text-black text-xs md:text-sm">
                                                Build profile
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Inner Card Example 2 */}
                                     <Card className="bg-white rounded-2xl md:rounded-3xl">
                                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 text-center">
                                            <img
                                                className="w-16 h-16 md:w-[102px] md:h-[102px] object-contain mb-2" // Use contain
                                                alt="Select Company Icon"
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/choice-1.png"
                                            />
                                            <p className="[font-family:'Inter',Helvetica] font-medium text-black text-xs md:text-sm">
                                                Select Company
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Inner Card Example 3 (No text) */}
                                    <Card className="bg-white rounded-2xl md:rounded-3xl">
                                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4">
                                            <img
                                                className="w-16 h-16 md:w-[91px] md:h-[91px] object-contain" // Use contain
                                                alt="Challenge Icon" // Add alt text
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/image.png"
                                            />
                                             {/* Consider adding text if applicable */}
                                        </CardContent>
                                    </Card>

                                    {/* Inner Card Example 4 (No text) */}
                                     <Card className="bg-white rounded-2xl md:rounded-3xl">
                                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4">
                                            <img
                                                className="w-20 h-20 md:w-[146px] md:h-[136px] object-contain" // Use contain
                                                alt="Roadmap Icon" // Add alt text
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/image-1.png"
                                            />
                                             {/* Consider adding text if applicable */}
                                        </CardContent>
                                    </Card>

                                    {/* Inner Card Example 5 */}
                                    <Card className="bg-white rounded-2xl md:rounded-3xl">
                                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 text-center">
                                            <img
                                                className="w-16 h-16 md:w-[111px] md:h-[111px] object-contain mb-2" // Use contain
                                                alt="Earn Badge Icon"
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/image-4.png"
                                            />
                                            <p className="[font-family:'Inter',Helvetica] font-medium text-black text-xs md:text-sm">
                                                Earn Badge
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Inner Card Example 6 (No text) */}
                                    <Card className="bg-white rounded-2xl md:rounded-3xl">
                                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4">
                                            <img
                                                className="w-20 h-20 md:w-[140px] md:h-[140px] object-contain" // Use contain
                                                alt="Get Hired Icon" // Add alt text
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/image-5.png"
                                            />
                                             {/* Consider adding text if applicable */}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Card */}
                        {/* REMOVED overflow-hidden */}
                        <Card className="rounded-3xl shadow-[2px_4px_4px_#0000001a,0px_4px_30px_#4f46e533] bg-gradient-to-r from-[rgba(231,229,255,0.1)] via-[rgba(0,77,255,0.1)] to-[rgba(0,72,255,0.1)]">
                            {/* Consistent padding */}
                            <CardContent className="p-6 md:p-8">
                                <div className="flex justify-center items-center mb-4">
                                    <img
                                        className="w-16 h-16 md:w-20 md:h-20 object-cover"
                                        alt="Company Icon" // Improved alt text
                                        src="https://c.animaapp.com/ma5cixatPLPI5h/img/image-6.png"
                                    />
                                </div>

                                <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-2xl md:text-[32px] text-center mb-4 md:mb-6">
                                    Company
                                </h2>

                                {/* Adjusted text size and margin. Copied text seems wrong, used placeholder */}
                                <p className="[font-family:'Inter',Helvetica] font-medium text-[#6b7280] text-sm md:text-base mb-8 md:mb-12 leading-relaxed"> {/* Use Tailwind gray */}
                                    Empower your hiring process. Create custom challenges, evaluate candidates based on real-world skills demonstrated through our validated roadmaps, and discover top talent without sifting through stacks of traditional CVs. Find the perfect fit, faster.
                                    {/* Original text below was copied from Candidate section:
                                    Candidat is the heart of our platform — a personalized space
                                    where each user can build their profile, showcase their
                                    skills, and track their progress through tailored roadmaps.
                                    Whether you're a student or job seeker, Candidat empowers you
                                    to stand out, connect with top opportunities, and grow through
                                    real project validation. */}
                                </p>

                                <div className="flex flex-col gap-6 md:gap-8">
                                    <div className="flex items-start gap-3 md:gap-4">
                                         {/* Icon container */}
                                        <div className="flex-shrink-0 w-12 h-12 md:w-[60px] md:h-[60px] bg-white rounded-xl border border-[#0045f2cc] flex items-center justify-center">
                                            <img
                                                className="w-6 h-6 md:w-[30px] md:h-[30px] object-contain" // Use contain
                                                alt="Search Icon"
                                                src="https://c.animaapp.com/ma5cixatPLPI5h/img/search-1.png"
                                            />
                                        </div>
                                        {/* Adjusted text size */}
                                        <p className="[font-family:'Inter',Helvetica] font-semibold text-[#6b7280] text-base md:text-xl leading-snug"> {/* Use Tailwind gray */}
                                            Discover top candidates through your custom tests and our
                                            validated roadmaps — no CVs needed.
                                        </p>
                                    </div>

                                    <img
                                        className="w-full max-w-[425px] h-auto mx-auto object-cover block" // Added block
                                        alt="Company Dashboard Preview" // Improved alt text
                                        src="https://c.animaapp.com/ma5cixatPLPI5h/img/-03ebf6df-9a3e-46d5-bcfc-66cd7c3a08d3-.png"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                 {/* About Us Section */}
                <section className="mt-12 md:mt-16 px-4">
                     {/* REMOVED overflow-hidden */}
                    <Card className="w-full rounded-3xl border border-[#029006] shadow-[2px_4px_4px_#0000001a,0px_4px_30px_#4f46e533] bg-gradient-to-r from-[rgba(11,133,96,0.15)] via-[rgba(11,133,96,0.09)] to-[rgba(11,133,96,0.15)]">
                        {/* Adjusted padding and flex direction */}
                        <CardContent className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
                            {/* Text content takes full width on small screens */}
                            <div className="flex-1 w-full">
                                {/* Adjusted button style and margin */}
                                <Button
                                    variant="outline"
                                    className="bg-[#f8fafb] text-[#485aff] border-2 border-[#485aff] hover:bg-indigo-50 rounded-[30px] [font-family:'Inter',Helvetica] font-medium text-lg md:text-xl px-6 py-3 h-auto mb-6 md:mb-8"
                                >
                                    About Us
                                </Button>
                                {/* Removed unnecessary <br />, adjusted text size and line height */}
                                <p className="[font-family:'Karla',Helvetica] font-medium text-black text-base md:text-xl leading-relaxed md:leading-[30px]">
                                    We're redefining how talent meets opportunity. Our platform
                                    connects motivated candidates with companies looking for real
                                    skills—not just résumés.
                                    <br /> <br /> {/* Use breaks for paragraphs or use <p> tags */}
                                    Candidates grow through personalized roadmaps and
                                    project-based learning, while companies actively search for
                                    and evaluate candidates using custom tests tailored to their
                                    needs.
                                    <br /> <br />
                                    By focusing on proven ability rather than traditional
                                    CVs, we make hiring smarter, faster, and more human.
                                </p>
                            </div>
                            {/* Image container takes full width on small screens */}
                            <div className="flex-1 w-full flex justify-center lg:justify-end">
                                <img
                                     // Added rounded corners, max-width adjustment
                                    className="w-full max-w-md lg:max-w-[451px] h-auto object-cover rounded-lg"
                                    alt="Team working together" // Improved alt text
                                    src="https://c.animaapp.com/ma5cixatPLPI5h/img/pexels-fauxels-3184603-1.png"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Team Section */}
                 <section className="mt-12 md:mt-16 px-4">
                     {/* Centered divider/button container */}
                     <div className="relative w-full max-w-[692px] mx-auto py-8">
                          {/* Optional: Add a subtle background/border for the divider area */}
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#4f7bea1a] to-transparent"></div>
                         <div className="relative flex justify-center">
                             {/* Adjusted button styling */}
                            <Button
                                variant="outline"
                                className="bg-[#f8fafb] text-[#485aff] border-2 border-[#485aff] hover:bg-indigo-50 rounded-[30px] [font-family:'Inter',Helvetica] font-medium text-lg md:text-xl px-6 py-3 h-auto z-10"
                            >
                                Our Team
                            </Button>
                         </div>
                    </div>

                    {/* Adjusted text size, margin, and max-width */}
                    <p className="text-center text-gray-600 text-base md:text-xl mt-8 md:mt-12 max-w-2xl lg:max-w-[768px] mx-auto leading-relaxed">
                        Our philosophy is simple — Improve, you are a talent, and
                        companies will be waiting for you. {/* Slightly rephrased */}
                    </p>

                    {/* Responsive grid columns and gap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8 md:mt-12">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="bg-gray-50 text-center rounded-2xl"> {/* Centered text */}
                                {/* Use CardContent padding */}
                                <CardContent className="p-6 flex flex-col items-center gap-5">
                                     {/* Ensure bg-* classes are defined in tailwind.config.js or use inline styles */}
                                    <Avatar className={`w-20 h-20 ${member.avatarBg || 'bg-indigo-100'}`}> {/* Fallback bg */}
                                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                                         {/* Basic fallback */}
                                        <AvatarFallback className="text-indigo-700 font-semibold">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col items-center gap-2 w-full"> {/* Reduced gap */}
                                        <div>
                                            {/* Using standard Tailwind classes */}
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm text-indigo-600 font-medium">
                                                {member.role}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2 leading-snug"> {/* Added margin-top */}
                                            {member.description}
                                        </p>
                                    </div>

                                     {/* Social Icons - Use actual icons (e.g., lucide-react) for accessibility */}
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        {/* Placeholder for Twitter Icon */}
                                        <a href="#" aria-label={`${member.name} on Twitter`} className="text-gray-400 hover:text-gray-600">
                                           {/* <TwitterIcon className="w-5 h-5" /> */}
                                           <img className="w-5 h-5" alt="Twitter" src="https://c.animaapp.com/ma5cixatPLPI5h/img/social-icon-1.svg"/>
                                        </a>
                                        {/* Placeholder for LinkedIn Icon */}
                                        <a href="#" aria-label={`${member.name} on LinkedIn`} className="text-gray-400 hover:text-gray-600">
                                            {/* <LinkedinIcon className="w-5 h-5" /> */}
                                            <div className="bg-[url(https://c.animaapp.com/ma5cixatPLPI5h/img/group.png)] w-5 h-5 bg-[100%_100%]"></div> {/* Keep if specific image needed */}
                                        </a>
                                         {/* Placeholder for Dribbble Icon */}
                                        <a href="#" aria-label={`${member.name} on Dribbble`} className="text-gray-400 hover:text-gray-600">
                                            {/* <DribbbleIcon className="w-5 h-5" /> */}
                                             <img className="w-5 h-5" alt="Dribbble" src="https://c.animaapp.com/ma5cixatPLPI5h/img/social-icon.svg"/>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                 {/* Added padding-bottom */}
                 <footer className="mt-16 md:mt-24 relative pb-8">
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
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 h-auto w-full sm:w-auto flex-shrink-0">
                                <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-extrabold text-base">
                                    Start Your Journey
                                </span>
                            </Button>
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
        </div>
    );
};
