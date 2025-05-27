import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ArrowRightIcon } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "../api/api";
import NavbarCompany from "../components/common/navbarCompany";
import { useNavigate } from "react-router";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className,
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

const Separator = React.forwardRef(
    (
        { className, orientation = "horizontal", decorative = true, ...props },
        ref,
    ) => (
        <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className,
            )}
            {...props}
        />
    ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

const GroupByAnima = ({ services }) => {
    return (
        <section className="w-full py-8 flex-grow">
            <Card className="w-full bg-[#f7f8f9] rounded-[25px] p-6 relative">
                <h2 className="text-4xl font-bold mb-8 ml-6">Services</h2>

                <div className="flex">
                    {/* Timeline */}
                    <div className="relative mt-20 mr-10 ml-6">
                        {/* Vertical timeline line */}
                        <div
                            className="absolute w-[3px] bg-indigo-600 left-5"
                            style={{
                                top: '0',
                                height: `${services.length > 1 ? ((services.length - 1) * 160) + 10 : 0}px`
                            }}
                        ></div>

                        {/* Timeline nodes with labels */}
                        {services.map((service, index) => (
                            <div key={service.id || index} className="relative" style={{ marginTop: index > 0 ? '120px' : '0' }}>
                                {/* Timeline node */}
                                <div className="flex items-center">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-white rounded-full border-[3px] border-solid border-indigo-600 flex items-center justify-center">
                                            <div className="w-[30px] h-[30px] bg-indigo-600 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Service Cards */}
                    <div className="flex-1 space-y-8">
                        {services.map((service, index) => (
                            <Card
                                key={service.id || index}
                                className="border border-solid border-[#6c63ff] bg-[#f3f0fe] rounded-[25px]"
                            >
                                <CardContent className="p-6 flex">
                                    <div className="mr-4">
                                        <img
                                            className="w-10 h-10 object-cover"
                                            alt={service.iconAlt || `Service icon ${index + 1}`}
                                            src={service.icon}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[22px] leading-8 mb-2">
                                            {service.title}
                                        </h3>
                                        <div className="font-medium text-[15px] leading-6">
                                            {service.description && service.description.map((item, i) => (
                                                <React.Fragment key={i}>
                                                    {item}
                                                    {i < service.description.length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        className="w-[46px] h-[46px] p-0 rounded-full bg-[#a592ff] hover:bg-[#8a7ae0]"
                                        aria-label={`Learn more about ${service.title}`}
                                    >
                                        <ArrowRightIcon className="h-6 w-6" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </Card>
        </section>
    );
};




const OverlapGroupWrapperByAnima = ({ Bio }) => {
    const navigate = useNavigate();
    const idCompany = localStorage.getItem("idCompany") || localStorage.getItem("company_id");

    const handleAddSkillClick = () => {
        navigate(`/company/${idCompany}/add-skill`);
    };

    const actionButtons = [
        { id: 1, text: "Add skills", onClick: handleAddSkillClick },
        { id: 2, text: "Add Test", onClick: () => { /* Handle Add Test click */ } },
    ];

    return (
        // Added h-full here - this section needs a parent with defined height for h-full to work
        <section className="w-full h-full">
            {/* Added flex, flex-col, and h-full to make this container a flex column and give it height */}
            <div className="space-y-6 flex flex-col h-full">
                {/* Actions Card - This card will take its necessary height */}
                <Card className="rounded-[25px] bg-[#f7f8f9] border-none">
                    <CardContent className="p-6">
                        <h2 className="font-bold text-4xl font-['Inter',Helvetica] mb-6">
                            Actions
                        </h2>

                        {/* Timeline with buttons */}
                        <div className="flex">
                            {/* Timeline dots and line */}
                            <div className="relative mr-6 flex flex-col items-center">
                                {/* Vertical line */}
                                <div className="absolute top-0 bottom-0 w-[3px] bg-indigo-600 left-1/2 -translate-x-1/2 z-0" />

                                {actionButtons.map((button, index) => (
                                    <div
                                        key={button.id}
                                        className={`relative w-[25px] h-[25px] rounded-full border-[3px] border-indigo-600 bg-white z-10
                                            ${index !== 0 ? "mt-[105px]" : ""}`}
                                    >
                                        {/* Inner dot */}
                                        <div className="absolute top-1/2 left-1/2 w-[19px] h-[18px] bg-indigo-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                ))}
                            </div>

                            {/* Buttons column */}
                            <div className="flex flex-col space-y-10">
                                {actionButtons.map((button) => (
                                    <Button
                                        key={button.id}
                                        onClick={button.onClick}
                                        className="w-[223px] h-[55px] rounded-[9px] bg-indigo-600 border border-white flex items-center justify-center"
                                    >
                                        <span className="font-poppins font-semibold text-white text-2xl tracking-[-0.20px]">
                                            {button.text}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bio Card - Added flex-grow to make it fill remaining space */}
                <Card className="rounded-[25px] bg-[#f7f8f9] border-none flex-grow"> {/* <-- Added flex-grow here */}
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-4xl font-['Inter',Helvetica]">
                                Bio
                            </h2>
                            <img
                                className="w-11 h-11 object-cover"
                                alt="Profile"
                                src="https://c.animaapp.com/manu7kxgcmYZMO/img/e8f1e2c420b463d58afb4c92a8abaaf6-removebg-preview-1-1.png"
                            />
                        </div>

                        <p className="mt-6 font-normal text-xl leading-8">
                            {Bio}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};


const OverlapWrapperByAnima = ({ companyData, techBadges }) => {
    return (
        <div className="w-full mx-auto">
            <Card className="w-full bg-[#f7f8f9] rounded-[25px] p-6 relative">
                <CardContent className="p-0 flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                        <img
                            className="w-[157px] h-[157px] object-cover"
                            alt={`${companyData.name || 'Company'} logo`}
                            src={companyData.logo || '/placeholder-logo.png'}
                        />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="font-bold text-[40px] text-black font-sans mb-6">
                            {companyData.name || 'Company Name'}
                        </h1>

                        <div className="text-xl leading-8 text-black">
                            <p className="font-light mb-2">Creation date: {companyData.creationDate || 'N/A'}</p>
                            <p className="font-light mb-2">Email: {companyData.email || 'N/A'}</p>
                            <p className="mb-2">
                                <span className="font-light">CEO of the company: </span>
                                <span className="font-bold">{companyData.ceo || 'N/A'}</span>
                            </p>
                            <p className="font-light">Address: {companyData.address || 'N/A'}</p>
                        </div>
                    </div>
                </CardContent>

                {/* Bottom Right Badges */}
                <div className="absolute bottom-6 right-6 flex gap-2">
                    {techBadges && techBadges.map((badge, index) => (
                        <Badge
                            key={index}
                            className={`h-[33px] px-3 py-1.5 rounded-full ${badge.color} font-bold text-[10px]`}
                            variant="outline"
                        >
                            {badge.name}
                        </Badge>
                    ))}

                    <div className="flex w-[31px] h-[29px] items-center justify-center p-1 bg-[#5bffa587] rounded-full">
                        <PlusIcon className="w-3 h-3" />
                    </div>
                </div>
            </Card>
        </div>
    );
};



export const CompanyProfile = () => {
    const companyId = localStorage.getItem('company_id');
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fixed useEffect with proper API call structure
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/company/profile/${companyId}`);
                setCompanyInfo(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
                setLoading(false);
            }
        };

        // Execute the fetchData function
        fetchData();
    }, [companyId]); // Properly depend on companyId
    // Default icons for services
    const servicesIcons = [
        "https://c.animaapp.com/manu7kxgcmYZMO/img/icons8-licence-100.png",
        "https://c.animaapp.com/manu7kxgcmYZMO/img/icons8-cdi-100.png",
        "https://c.animaapp.com/manu7kxgcmYZMO/img/icons8-comp-tences-de-r-flexion-48.png"
    ];

    // Fixed service mapping
    const services = companyInfo?.services?.map((service, index) => ({
        id: service.id || `service-${index}`,
        title: service.title || `Service ${index + 1}`,
        description: service.descriptions || [],
        icon: servicesIcons[Math.floor(Math.random() * servicesIcons.length)],
        iconAlt: `${service.title} icon`
    })) || [];

    // Fixed company data with fallbacks
    const companyData = {
        name: companyInfo?.name || 'Company Name',
        logo: companyInfo?.logo // Check if logo exists
            ? (companyInfo.logo.startsWith('http://') || companyInfo.logo.startsWith('https://') // Check if it's already a full URL
                ? companyInfo.logo // If it is, use it as is
                : `http://localhost:8000/storage/${companyInfo.logo}` // If not (and exists), prepend the storage base URL
            )
            : null,
        creationDate: companyInfo?.profile?.DateCreation || 'N/A',
        email: companyInfo?.user?.email || 'N/A',
        ceo: companyInfo?.ceo?.name || 'N/A',
        address: companyInfo?.profile?.address || 'N/A',
    };

    // Style badges for tech skills
    const styleBadges = [
        "bg-[#09969e1a] text-[#09969e]",
        "bg-[#1b56fd33] text-[#1b56fd]",
        "bg-[#a31d1d33] text-[#a31d1d]"
    ];

    // Fixed tech badges mapping
    const techBadges = companyInfo?.skills?.map((skill, index) => ({
        name: skill.name || `Skill ${index + 1}`,
        color: styleBadges[Math.floor(Math.random() * styleBadges.length)]
    })) || [];

    // Fixed legal documents array structure and mapping
    const legalDocuments = companyInfo?.legaldocuments
        ? [companyInfo.legaldocuments.map((doc, index) => ({
            title: doc.title || `Document ${index + 1}`,
            descriptions: doc.descriptions || []
        }))]
        : [];

    // Show loading state
    if (loading) {
        return <div className="w-full text-center py-8">Loading company profile...</div>;
    }

    // Show error state if there's an error
    if (error) {
        return <div className="w-full text-center py-8 text-red-500">Error loading profile: {error}</div>;
    }
    if (companyInfo && !companyInfo?.profile) return (
        <>
            <NavbarCompany />
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-md mx-auto max-w-2xl mt-8">
                <p className="text-base font-medium text-gray-700 mb-2">
                    You dont have a profile
                </p>
                <button
                    onClick={(e) => { e.preventDefault(); window.location.href = '/company/create/profile' }}
                    className="text-indigo-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                    create one
                </button>
            </div>
        </>
    )

    return (
        <>
            <NavbarCompany />
            <div className="relative w-full max-w-full mx-auto bg-white">
                <main className="flex flex-col w-full p-8">
                    {/* Main Content with Two Columns */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Left Section */}
                        <section className="w-full lg:w-2/3 flex-grow">
                            <div className="relative mb-8">
                                <OverlapWrapperByAnima companyData={companyData} techBadges={techBadges} />
                                <img
                                    className="absolute w-11 h-11 top-6 right-6 object-cover"
                                    alt="Company logo"
                                    src="https://c.animaapp.com/manu7kxgcmYZMO/img/e8f1e2c420b463d58afb4c92a8abaaf6-removebg-preview-1-1.png"
                                />
                            </div>
                            <GroupByAnima services={services} />
                        </section>

                        {/* Right Section */}
                        <section className="w-full lg:w-1/3 flex-grow">

                            <OverlapGroupWrapperByAnima Bio={companyInfo?.profile?.Bio || 'Add A Bio'} />
                        </section>
                    </div>

                    {/* Legal Documents Section */}
                    {legalDocuments.length > 0 && (
                        <Card className="mt-8 p-6 bg-[#f7f8f9] rounded-[25px] border-none">
                            <CardContent className="p-0">
                                <div className="flex justify-between items-start mb-8">
                                    <h2 className="text-4xl font-bold">Legal Documents</h2>
                                    <img
                                        className="w-11 h-11 object-cover"
                                        alt="Company logo"
                                        src="https://c.animaapp.com/manu7kxgcmYZMO/img/e8f1e2c420b463d58afb4c92a8abaaf6-removebg-preview-1-1.png"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {legalDocuments.map((documents, colIdx) => (
                                        <div key={colIdx} className="relative">
                                            {/* Timeline bar and dots */}
                                            <div className="absolute left-[10px] top-0 w-10">
                                                {/* Timeline line from first to last dot */}
                                                <div
                                                    className="absolute left-5 w-1 bg-indigo-600"
                                                    style={{
                                                        top: '20px',
                                                        height: `${(documents?.length - 1) * 200}px`,
                                                    }}
                                                />

                                                {/* Timeline dots */}
                                                {documents.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="absolute left-0 w-10 h-10 bg-white rounded-full border-[3px] border-indigo-600"
                                                        style={{ top: `${index * 200}px` }}
                                                    >
                                                        <div className="relative w-[30px] h-[30px] top-0.5 left-0.5 bg-indigo-600 rounded-full border-[3px] border-solid" />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Document Content */}
                                            <div className="ml-16">
                                                {documents.map((doc, index) => (
                                                    <div key={index} className="mb-16">
                                                        <div className="relative w-full h-[45px] bg-[url(https://c.animaapp.com/manu7kxgcmYZMO/img/rectangle-49.svg)] bg-cover mb-6">
                                                            <h3 className="absolute top-[10px] left-[20px] font-semibold text-xl leading-6">
                                                                {doc.title}
                                                            </h3>
                                                        </div>

                                                        {doc.descriptions && doc.descriptions.map((desc, descIndex) => (
                                                            <div key={descIndex} className="relative ml-8 mb-4">
                                                                <div className="absolute -left-[15px] top-2 w-[10px] h-[10px] bg-[#f7f8f9] rounded-full border border-[#8989898c]" />
                                                                <p className="text-[#5d5d5d] text-base leading-7 font-medium">
                                                                    {desc}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </>
    );
};