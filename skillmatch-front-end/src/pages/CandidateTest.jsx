import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/api";
import { useNavigate, useParams } from "react-router";
import NavbarCandidate from "../components/common/navbarCandidate";

const cn = (...inputs) => twMerge(clsx(inputs));

// Enhanced Badge Component with Glassmorphism
const Badge = ({ className, ...props }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-100/80 backdrop-blur-sm text-indigo-800 shadow-sm",
            className
        )}
        {...props}
    />
);

// Enhanced Button Component with Gradient
const Button = ({ className, variant = "primary", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        className={cn(
            "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
            variant === "primary" && "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700",
            variant === "outline" && "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50",
            className
        )}
        {...props}
    />
);

// Enhanced Card Component with Subtle Shadow
const Card = ({ className, ...props }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn("rounded-xl border bg-white/95 backdrop-blur-sm shadow-lg", className)}
        {...props}
    />
);

// Enhanced CardContent Component
const CardContent = ({ className, ...props }) => (
    <div className={cn("p-6", className)} {...props} />
);

const shuffleArray = (array) =>
    array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

export const CandidateTest = () => {
    const navigate = useNavigate();
    const [serverMessage, setServerMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [steps, setSteps] = useState([]);
    const [solutionOptions, setSolutionOptions] = useState([]);
    const { TestId } = useParams();
    const candidate_id = localStorage.getItem('candidate_id');
    const [TestInfo, setTestInfo] = useState();
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/candidate/test/${TestId}`);
                setTestInfo(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [TestId]);

    useEffect(() => {
        if (!TestInfo) return;

        try {
            const stored = JSON.parse(localStorage.getItem(`steps_${TestId}_${candidate_id}`));
            console.log(stored);
            const savedResponse = localStorage.getItem(`response_${TestId}_${candidate_id}`);

            if (stored?.TestId === TestId && stored?.steps) {
                setSteps(stored.steps);
            } else {
                const formattedSteps = TestInfo.steps.map((step, index) => ({
                    stepId: step.id,
                    number: index + 1,
                    title: step.title,
                    description: step.description,
                    order: step.order,
                    completed: false,
                }));
                setSteps(formattedSteps);
                localStorage.setItem(`steps_${TestId}_${candidate_id}`, JSON.stringify({ TestId, steps: formattedSteps }));
            }

            if (savedResponse) {
                setIsSubmitted(true);
            }
        } catch (err) {
            console.error("Failed to load steps or response from localStorage", err.message);
        }
    }, [TestInfo]);

    useEffect(() => {
        if (!TestInfo?.qcm) return;

        const options = [
            TestInfo.qcm.option_a,
            TestInfo.qcm.option_b,
            TestInfo.qcm.option_c,
            TestInfo.qcm.option_d,
            TestInfo.qcm.corrected_option,
        ];
        const optionIds = ["A", "B", "C", "D", "E"];
        const shuffledOptions = shuffleArray(options);

        const savedResponse = localStorage.getItem(`response_${TestId}_${candidate_id}`);

        const formattedOptions = optionIds.map((id, index) => ({
            id,
            label: shuffledOptions[index],
            selected: savedResponse === shuffledOptions[index],
        }));

        setSolutionOptions(formattedOptions);
    }, [TestInfo]);

    const handleStepCheck = (index) => {
        const updatedSteps = steps.map((step, i) =>
            i === index ? { ...step, completed: true } : step
        );
        setSteps(updatedSteps);
        localStorage.setItem(`steps_${TestId}_${candidate_id}`, JSON.stringify({ TestId, steps: updatedSteps }));
    };

    const SelectOption = (id) => {
        if (isSubmitted) return;
        setSolutionOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.id === id
                    ? { ...option, selected: !option.selected }
                    : { ...option, selected: false }
            )
        );
    };

    const Submit = async () => {
        try {
            const selectedResponse = solutionOptions.find(option => option.selected);
            if (!selectedResponse) {
                alert("Please select an option before submitting.");
                return;
            }
            const response = await api.post(`api/results/store`, {
                candidate_id: candidate_id,
                test_id: TestId,
                answer: selectedResponse.label
            });

            localStorage.setItem(`response_${TestId}_${candidate_id}`, selectedResponse.label);
            setIsSubmitted(true);

            setServerMessage(response.data?.message || "Submission successful.");

            navigate(`/candidate/test/${TestInfo.id}/result`);
        } catch (err) {
            console.error("Submission failed:", err);
            setServerMessage("An error occurred during submission.");
        }
    };

    const prerequisites = TestInfo?.prerequisites || 'NAN';
    const objective = TestInfo?.objective || "";
    const firstIncompleteIndex = steps.findIndex((step) => !step.completed);
    const allStepsCompleted = steps.every((step) => step.completed);
    const progress = steps.length ? (steps.filter(step => step.completed).length / steps.length) * 100 : 0;

    if (Loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-16 w-16 rounded-full border-t-4 border-indigo-600 shadow-md"
                />
            </div>
        );
    }

    if (!TestInfo && !error) {
        return (
            <Card className="w-full max-w-lg mx-auto mt-12 bg-yellow-50/80 backdrop-blur-sm border-yellow-200 shadow-lg">
                <CardContent className="p-8 text-yellow-800 text-center text-lg font-medium">
                    The Company doesn't have any test for now.
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-lg mx-auto mt-12 bg-red-50/80 backdrop-blur-sm border-red-200 shadow-lg">
                <CardContent className="p-8 text-red-800 text-center text-lg font-medium">
                    {error}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
        <NavbarCandidate />
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
            {/* Sidebar for Progress */}
            <motion.aside
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-1/4 w-full bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg lg:sticky lg:top-8"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Progress</h3>
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute h-full bg-gradient-to-r from-indigo-600 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
                <p className="mt-2 text-sm text-gray-600">{Math.round(progress)}% Complete</p>
                <div className="mt-6 space-y-3">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold",
                                step.completed ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                            )}>
                                {step.number}
                            </span>
                            <span className={cn("text-sm", step.completed ? "text-indigo-600" : "text-gray-600")}>
                                {step.title}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:w-3/4 w-full">
                {/* Server Message */}
                <AnimatePresence>
                    {serverMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-4 bg-green-100/80 backdrop-blur-sm rounded-lg text-green-800 text-center text-lg font-medium shadow-sm"
                        >
                            {serverMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl p-8 mb-8 shadow-lg"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-md"
                            aria-label={`Logo for ${TestInfo?.skill?.name} Test`}
                        >
                            <span className="text-white text-3xl font-extrabold">
                                {TestInfo?.skill?.name?.[0] || 'T'}
                            </span>
                        </motion.div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                {TestInfo?.skill?.name} Test
                            </h1>
                            <Badge className="mt-3">{TestInfo?.skill?.level}</Badge>
                        </div>
                    </div>
                </motion.header>

                {/* Objective Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Objective</h2>
                    <Card>
                        <CardContent>
                            <p className="text-gray-700 text-lg leading-relaxed">{objective}</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Prerequisites Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                    <Card className="bg-indigo-50/80 backdrop-blur-sm">
                        <CardContent>
                            <p className="text-gray-700 text-lg leading-relaxed">{prerequisites}</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Steps Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Steps</h2>
                    <div className="space-y-4">
                        {steps.map((step, index) => {
                            const isDisabled = index !== firstIncompleteIndex;
                            return (
                                <Card key={index} className="flex items-center p-5 transition-all duration-300 hover:shadow-md">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                                            step.completed ? "bg-indigo-600" : "bg-gray-200"
                                        )}
                                    >
                                        <span className={cn("text-lg font-bold", step.completed ? "text-white" : "text-gray-600")}>
                                            {step.number}
                                        </span>
                                    </motion.div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                                        <p className="text-gray-600 text-sm">{step.description}</p>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.1 }} className="relative">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            disabled={step.completed || isDisabled}
                                            checked={step.completed}
                                            onChange={() => handleStepCheck(index)}
                                            aria-label={`Complete step ${step.number}: ${step.title}`}
                                        />
                                        {step.completed && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Before Answer Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Before You Answer</h2>
                    <Card>
                        <CardContent>
                            <p className="text-gray-700 text-lg leading-relaxed">{TestInfo?.before_answer}</p>
                            <p className="text-gray-700 text-lg leading-relaxed mt-3">
                                Submit your code as a Git repository with a README.md file explaining your implementation.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Expected Solution Section */}
                <section className={cn("mb-12", !allStepsCompleted && "opacity-50 pointer-events-none")}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Solution</h2>
                    <div className="space-y-4">
                        {solutionOptions.map((option, index) => (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (allStepsCompleted && !isSubmitted) SelectOption(option.id);
                                }}
                                whileHover={{ scale: allStepsCompleted && !isSubmitted ? 1.02 : 1, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                                className={cn(
                                    "flex items-center p-5 border rounded-lg cursor-pointer transition-all duration-200",
                                    option.selected ? "border-indigo-600 bg-indigo-50/80 backdrop-blur-sm shadow-md" : "border-gray-200 bg-white",
                                    isSubmitted && "pointer-events-none"
                                )}
                                role="button"
                                tabIndex={allStepsCompleted && !isSubmitted ? 0 : -1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && allStepsCompleted && !isSubmitted) SelectOption(option.id);
                                }}
                                aria-label={`Select option ${option.id}: ${option.label}`}
                            >
                                <motion.div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center mr-4 border",
                                        option.selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-100 text-gray-900 border-gray-300"
                                    )}
                                    whileHover={{ rotate: 10 }}
                                >
                                    <span className="text-lg font-bold">{option.id}</span>
                                </motion.div>
                                <p className="text-gray-900 text-lg">{option.label}</p>
                                {option.selected && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => { e.preventDefault(); Submit(); }}
                        disabled={isSubmitted || !allStepsCompleted}
                    >
                        Submit Response
                    </Button>
                </div>
            </div>
        </div>
    </>
    );
};