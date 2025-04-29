import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "../api/api";
import { useParams } from "react-router";

const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};

const Badge = ({ className, ...props }) => {
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

const Button = ({ className, ...props }) => {
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

function shuffleArray(array) {
    return [...array]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export const CandidateTest = () => {
    const { companyId } = useParams();
    console.log(companyId)
    const [TestInfo, setTestInfo] = useState();
    const [Loading,setLoading]=useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/candidate/test/company/${companyId}`);
                setTestInfo(response.data[0]);
                console.log(response.data)
                setLoading(false)
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    }, []);

    const prerequisites = TestInfo?.prerequisites;
    const objective = TestInfo?.objective;

    const steps = TestInfo?.steps?.map((step, index) => ({
        stepId: step.id,
        number: index + 1,
        title: step.title,
        description: step.description,
        order: step.order,
        completed: step.completed,
    })) || [];

    const solutionOptions = [];

    if (TestInfo && TestInfo.qcm) {
        const options = [
            TestInfo.qcm.option_a,
            TestInfo.qcm.option_b,
            TestInfo.qcm.option_c,
            TestInfo.qcm.option_d,
            TestInfo.qcm.corrected_option,
        ];

        const optionIds = ['A', 'B', 'C', 'D', 'E'];
        const shuffledOptions = shuffleArray(options);

        optionIds.forEach((id, index) => {
            solutionOptions.push({
                id,
                label: shuffledOptions[index],
            });
        });
    }
if(Loading)  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    </div>
  );

    return (
        <div className="w-full max-w-[1453px] mx-auto">
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

                                        <p

                                            className="font-text-xs-medium text-black text-[length:var(--text-xs-medium-font-size)] leading-[var(--text-xs-medium-line-height)] tracking-[var(--text-xs-medium-letter-spacing)]"
                                        >
                                            {prerequisites ? prerequisites : ''}
                                        </p>

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
                                                    className={`relative w-[63px] h-[60px] rounded-[31.71px/29.88px] flex items-center justify-center
                                                  
                                                    "bg-[#f7f8f9] border border-solid border-[#3f3d56]"`}
                                                >
                                                    <div
                                                        className={`font-extrabold text-[40px] text-center [font-family:'Inter',Helvetica]  "text-white"  "
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
            </div>    </div>
    );
};
