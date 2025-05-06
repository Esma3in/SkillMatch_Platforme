import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "../api/api";
import { useNavigate, useParams } from "react-router";

const cn = (...inputs) => twMerge(clsx(inputs));

const Badge = ({ className, ...props }) => (
    <div
        className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
        )}
        {...props}
    />
);

const Button = ({ className, ...props }) => (
    <button
        className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
            className
        )}
        {...props}
    />
);

const Card = ({ className, ...props }) => (
    <div className={cn("rounded-lg border bg-card text-card-foreground", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
    <div className={cn("p-6 pt-0", className)} {...props} />
);

const shuffleArray = (array) =>
    array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

export const CandidateTest = () => {
    const navigate = useNavigate()
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
                console.log(response.data)
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
            console.log(stored)
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
                    completed:false,
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

            navigate(`/candidate/test/${TestInfo.id}/result`)
        } catch (err) {
            console.error("Submission failed:", err);
            setServerMessage("An error occurred during submission.");
        }
    };



    const prerequisites = TestInfo?.prerequisites || 'NAN';
    const objective = TestInfo?.objective || "";
    const firstIncompleteIndex = steps.findIndex((step) => !step.completed);
    const allStepsCompleted = steps.every((step) => step.completed);

    if (Loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );

    if (!TestInfo && !error)
        return (
            <div className="w-full max-w-md mx-auto mt-10 p-6 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-xl shadow-md text-center">
                The Company doesn't have any test for now.
            </div>
        );

    if (error)
        return (
            <div className="w-full max-w-md mx-auto mt-6 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg shadow text-center">
                {error}
            </div>
        );
    return (
        <div className="w-full max-w-[1453px] mx-auto">
            {serverMessage && (
                <div className="mt-4 text-green-600 font-semibold text-center">
                    {serverMessage}
                </div>
            )}

            <div className="w-full">
                <div className="relative w-full">
                    {/* Header Section */}
                    <header className="absolute w-full h-[247px] top-0 left-0 bg-[#f7f8f9]">
                        <div className="flex items-center">
                            {/* Logo */}
                            <div className="relative w-[179px] h-[167px] mt-10 ml-[119px]">
                                <div className="relative w-[177px] h-[167px] bg-[#6c63ff] rounded-[88.62px/83.5px] flex items-center justify-center">
                                    <div className="text-white text-[64px] font-extrabold [font-family:'Inter',Helvetica]">
                                        {TestInfo?.skill?.name.substring(0, 1)}
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="w-[692px] h-16 mt-[92px] ml-[154px] [font-family:'Inter',Helvetica] font-extrabold text-black text-[40px] text-center">
                                {TestInfo?.skill?.name} Test
                            </h1>

                            {/* Difficulty Badge */}
                            <div className="mt-[106px] ml-[224px]">
                                <Badge className="w-[120px] h-9 bg-[#f9debf] text-[#98523f] text-base font-medium rounded-[15px] flex items-center justify-center [font-family:'Inter',Helvetica]">
                                    {TestInfo?.skill?.level}
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

                            <Card className="mt-[21px] w-[1340px] h-auto bg-[#f7f8f9] border-none">
                                <CardContent className="p-8 pt-10">
                                    <div className="flex flex-col gap-3">

                                        <p

                                            className="font-normal text-[#3f3d56] text-2xl leading-8 [font-family:'Inter',Helvetica]"
                                        >
                                            {objective}
                                        </p>

                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Prerequisites Section */}
                        <section className="mt-[60px] ml-[57px]">
                            <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                                Prerequisites
                            </h2>

                            <Card className="mt-[25px] w-[1366px] h-auto bg-indigo-50 rounded-2xl border-none">
                                <CardContent className="p-8 flex items-center justify-center">
                                    <div className="w-[1167px] flex flex-col gap-3">
                                        {prerequisites}
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
                                {steps.map((step, index) => {
                                    const isDisabled = index !== firstIncompleteIndex;

                                    return (
                                        <Card
                                            key={index}
                                            className="w-[1310px] h-auto bg-[#f7f8f9] border-none"
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
                                                        <input
                                                            type="checkbox"
                                                            className="w-[42px] h-10 bg-white rounded border border-solid border-black cursor-pointer"
                                                            disabled={step.completed || isDisabled}
                                                            checked={step.completed}
                                                            onChange={() => handleStepCheck(index)}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Before Answer Section */}
                        <section className="mt-[25px] ml-[90px]">
                            <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                                Before answer !!
                            </h2>

                            <Card className="mt-[25px] w-[1319px] h-auto bg-[#f7f8f9] border-none">
                                <CardContent className="p-9 pt-11">
                                    <div className="flex flex-col gap-3">
                                        <p className="font-normal text-[#3f3d56] text-2xl leading-8 [font-family:'Inter',Helvetica]">
                                            {TestInfo?.before_answer}
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
                        <section
                            className={`mt-[25px] ml-[83px] transition-opacity duration-300 ${allStepsCompleted ? "" : "pointer-events-none opacity-50"
                                }`}
                        >
                            <h2 className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-[18px]">
                                Expected Solution
                            </h2>

                            <div className="mt-[25px] flex flex-col gap-6">
                                {solutionOptions.map((option) => (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (allStepsCompleted && !isSubmitted) SelectOption(option.id);
                                        }}
                                        key={option.id}
                                        className={`w-[1310px] h-[85px] bg-white border border-solid cursor-pointer ${isSubmitted ? "pointer-events-none" : ""} ${option.selected
                                            ? "border-[3px] border-[#6c63ff] bg-[#6c63ff]"
                                            : "border-[#898989] bg-white"
                                            }`}
                                    >
                                        <div className="relative w-full h-[60px] mt-3 ml-[51px] flex items-center">
                                            {/* Option Letter */}
                                            <div className="w-[65px] h-[60px]">
                                                <div
                                                    className={`relative w-[63px] h-[60px] rounded-[31.71px/29.88px] flex items-center justify-center border border-solid ${option.selected
                                                        ? "bg-[#6c63ff] text-white border-[#6c63ff]"
                                                        : "bg-[#f7f8f9] border-[#3f3d56] text-black"
                                                        }`}
                                                >
                                                    <div className="font-extrabold text-[40px] text-center [font-family:'Inter',Helvetica]">
                                                        {option.id}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Option Label */}
                                            <div className="ml-[63px]">
                                                <p
                                                    className={`[font-family:'Inter',Helvetica] font-light text-xl leading-[18px] "text-black"
                                                        }`}
                                                >
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
                            <button
                                onClick={(e) => { e.preventDefault(); window.history.back() }}
                                className="h-[73px] w-[295px] bg-[#f7f8f9] text-[#5856d6] font-extrabold text-base [font-family:'Manrope',Helvetica] border border-[#5856d6] rounded-xl outline outline-2 outline-[#d9d6f7]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); Submit(); }}
                                className={`h-[73px] w-[400px] bg-[#5856d6] text-shadeswhite font-semibold text-base rounded-xl [font-family:'Manrope',Helvetica] ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitted}
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
