import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function
const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};

// Badge component
const Badge = ({ variant = "default", className, ...props }) => {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                className
            )}
            {...props}
        />
    );
};

// Button component
const Button = ({ variant = "default", className, ...props }) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                className
            )}
            {...props}
        />
    );
};

// Card components
const Card = ({ className, ...props }) => {
    return (
        <div
            className={cn("rounded-lg border bg-card text-card-foreground", className)}
            {...props}
        />
    );
};

const CardContent = ({ className, ...props }) => {
    return <div className={cn("p-6 pt-0", className)} {...props} />;
};

// Checkbox component
const Checkbox = ({ className, ...props }) => {
    return (
        <input
            type="checkbox"
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
};

// Data for the prerequisites section
const prerequisites = [
    "These are the essential skills you'll need to complete this test successfully:",
    "Java (8+) Solid understanding of Java syntax, OOP, and exception handling.",
    "Spring Boot Familiarity with building REST APIs using Spring Boot and Spring Web.",
    "JWT Authentication Understanding of JSON Web Tokens and how to implement token-based authentication.",
    "CRUD Operations & Database Access Ability to create, read, update, and delete data using JPA or JDBC.",
    "API Input Validation Use of annotations like @Valid, @NotNull, etc. to validate incoming requests.",
    "",
    "🛠 Tools Required",
    "Make sure you have the following tools installed and ready:",
    "Java Development Kit (JDK 8 or above) Required to compile and run your Java project.",
    "Maven or Gradle Dependency management and project build tool.",
    "Spring Boot CLI or IDE with Spring support (e.g., IntelliJ, VS Code) To develop and run your Spring Boot application.",
    "Postman or similar API client To test your API endpoints.",
    "Git + GitHub account For submitting your code repository.",
];

// Data for the objectives section
const objectives = [
    "This test is designed to evaluate your backend development skills in a real-world scenario that reflects challenges you might face on the job. It will help you:",
    "Showcase your ability to build secure REST APIs.",
    "Prove your understanding of authentication, error handling, and database operations.",
    "Gain confidence and prepare for technical interviews.",
];

// Data for the steps section
const steps = [
    {
        number: "1",
        title: "Download the starter code",
        description:
            "Clone the repository containing the base project structure and dependencies.",
    },
    {
        number: "2",
        title: "Implement user authentication",
        description:
            "Create JWT-based authentication with login and registration endpoints.",
    },
    {
        number: "3",
        title: "Create CRUD operations",
        description:
            "Implement endponts for creating, reading, updating, and deleting user data.",
    },
    {
        number: "4",
        title: "Add request validation",
        description:
            "Implement proper input validation and error handling for all endpoints.",
    },
];

// Data for the solution options
const solutionOptions = [
    {
        id: "A",
        label: "Basic Authentication with username and password",
        selected: false,
    },
    {
        id: "B",
        label: "JWT-based authentication with proper expiration and refresh tokens",
        selected: true,
    },
    {
        id: "C",
        label: "API key-based authentication in URL parameters",
        selected: false,
    },
];

export const CandidateTest = () => {
    return (
        <div
            className="w-full max-w-[1453px] mx-auto"
            data-model-id="321:1671-frame"
        >
            <div className="w-full">
                <div className="relative w-full">
                    {/* Header Section */}
                    <header className="absolute w-full h-[247px] top-0 left-0 bg-[#f7f8f9]">
                        <div className="flex items-center">
                            {/* Logo */}
                            <div className="relative w-[179px] h-[167px] mt-10 ml-[119px]">
                                <div className="relative w-[177px] h-[167px] bg-[#6c63ff] rounded-[88.62px/83.5px] flex items-center justify-center">
                                    <div className="text-white text-[64px] font-extrabold [font-family:'Inter',Helvetica]">
                                        J
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="w-[692px] h-16 mt-[92px] ml-[154px] [font-family:'Inter',Helvetica] font-extrabold text-black text-[40px] text-center">
                                Java Backend Development Test
                            </h1>

                            {/* Difficulty Badge */}
                            <div className="mt-[106px] ml-[224px]">
                                <Badge className="w-[120px] h-9 bg-[#f9debf] text-[#98523f] text-base font-medium rounded-[15px] flex items-center justify-center [font-family:'Inter',Helvetica]">
                                    Medium
                                </Badge>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Wrapper with Header Offset */}
                    <div className="pt-[260px]">

                        {/* Objective Section */}
                        <section className="ml-[53px]">
                            <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                                Objective !!
                            </h2>

                            <Card className="mt-[21px] w-[1340px] h-72 bg-[#f7f8f9] border-none">
                                <CardContent className="p-8 pt-10">
                                    <div className="flex flex-col gap-3">
                                        {objectives.map((objective, index) => (
                                            <p
                                                key={index}
                                                className="font-normal text-[#3f3d56] text-2xl leading-8 [font-family:'Inter',Helvetica]"
                                            >
                                                {objective}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Prerequisites Section */}
                        <section className="mt-[60px] ml-[57px]">
                            <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                                Prerequisites
                            </h2>

                            <Card className="mt-[25px] w-[1366px] h-[604px] bg-indigo-50 rounded-2xl border-none">
                                <CardContent className="p-8 flex items-center justify-center">
                                    <div className="w-[1167px] flex flex-col gap-3">
                                        {prerequisites.map((prerequisite, index) => (
                                            <p
                                                key={index}
                                                className="font-text-xs-medium text-black text-[length:var(--text-xs-medium-font-size)] leading-[var(--text-xs-medium-line-height)] tracking-[var(--text-xs-medium-letter-spacing)]"
                                            >
                                                {prerequisite}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>


                    {/* Steps Section */}
                    <section className="mt-[25px] ml-[83px]">
                        <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                            Steps
                        </h2>

                        <div className="mt-[25px] flex flex-col gap-6">
                            {steps.map((step, index) => (
                                <Card
                                    key={index}
                                    className="w-[1310px] h-[115px] bg-[#f7f8f9] border-none"
                                >
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-[74px] mt-[21px] ml-[52px] flex items-center">
                                            {/* Step Number */}
                                            <div className="w-[65px] h-[60px]">
                                                <div className="relative w-[63px] h-[60px] bg-[#6c63ff] rounded-[31.71px/29.88px] flex items-center justify-center">
                                                    <div className="font-extrabold text-white text-[40px] text-center [font-family:'Inter',Helvetica]">
                                                        {step.number}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Step Details */}
                                            <div className="ml-[62px]">
                                                <h3 className="[font-family:'Inter',Helvetica] font-medium text-black text-base leading-[18px]">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-[10px] [font-family:'Inter',Helvetica] font-light text-black text-xs leading-[18px]">
                                                    {step.description}
                                                </p>
                                            </div>

                                            {/* Checkbox */}
                                            <div className="ml-auto mr-[46px]">
                                                <Checkbox className="w-[42px] h-10 bg-white rounded border border-solid border-black" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Before Answer Section */}
                    <section className="mt-[25px] ml-[90px]">
                        <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                            Before answer !!
                        </h2>

                        <Card className="mt-[25px] w-[1319px] h-48 bg-[#f7f8f9] border-none">
                            <CardContent className="p-9 pt-11">
                                <div className="flex flex-col gap-3">
                                    <p className="font-normal text-[#3f3d56] text-2xl leading-8 [font-family:'Inter',Helvetica]">
                                        Your solution should include a fully functional API with
                                        secure authentication, proper error handling, and complete
                                        documentation. The code should follow best practices and
                                        include appropriate unit tests.
                                    </p>
                                    <p className="font-normal text-[#3f3d56] text-2xl leading-8 [font-family:'Inter',Helvetica]">
                                        Submit your code as a Git repository with a README.md file
                                        explaining your implementation.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Expected Solution Section */}
                    <section className="mt-[25px] ml-[83px]">
                        <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                            Expected Solution
                        </h2>

                        <div className="mt-[25px] flex flex-col gap-6">
                            {solutionOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`w-[1310px] h-[85px] bg-white border border-solid ${option.selected
                                        ? "border-[3px] border-[#6c63ff]"
                                        : "border-[#898989]"
                                        }`}
                                >
                                    <div className="relative w-full h-[60px] mt-3 ml-[51px] flex items-center">
                                        {/* Option Letter */}
                                        <div className="w-[65px] h-[60px]">
                                            <div
                                                className={`relative w-[63px] h-[60px] rounded-[31.71px/29.88px] flex items-center justify-center ${option.selected
                                                    ? "bg-[#6c63ff]"
                                                    : "bg-[#f7f8f9] border border-solid border-[#3f3d56]"
                                                    }`}
                                            >
                                                <div
                                                    className={`font-extrabold text-[40px] text-center [font-family:'Inter',Helvetica] ${option.selected ? "text-white" : "text-[#3f3d56]"
                                                        }`}
                                                >
                                                    {option.id}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Option Label */}
                                        <div className="ml-[63px]">
                                            <p className="[font-family:'Inter',Helvetica] font-light text-black text-xl leading-[18px]">
                                                {option.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center mt-[50px] mb-6">
                            <Button
                                variant="outline"
                                className="h-[73px] w-[295px] bg-[#f7f8f9] text-[#5856d6] font-extrabold text-base [font-family:'Manrope',Helvetica]"
                            >
                                Save For Later
                            </Button>

                            <Button className="h-[73px] w-[400px] bg-[#5856d6] text-shadeswhite font-semibold text-base [font-family:'Manrope',Helvetica]">
                                Submit Response
                            </Button>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    );
};
