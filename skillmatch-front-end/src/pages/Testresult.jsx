import React, { useEffect, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useParams } from "react-router";
import { api } from "../api/api";
import Candidate from "../Espaces/Candidate";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
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
  }
);

const CustomButton = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
CustomButton.displayName = "CustomButton";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const ResultTest = () => {
  const [Loading, setLoading] = useState(true);
  const [TestInfo, setTestInfo] = useState({});
  const [Result, setResultInfo] = useState({});
  const [candidate, setCandidate] = useState({});
  const { TestId } = useParams();
  const candidate_id = localStorage.getItem("candidate_id");

  useEffect(() => {
    const TestData = async () => {
      try {
        const response = await api.get(`api/candidate/${candidate_id}/result/test/${TestId}`);
        setResultInfo(response.data.result);
        setCandidate(response.data.candidate);
        setTestInfo(response.data.test);
      } catch (err) {
        if (err.response && err.response.status === 401 && err.response.data.message === "result not found") {
          setResultInfo(null); // explicitly indicate no result
        } else {
          console.error("Failed to fetch test result:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    TestData();
  }, [TestId]);
  
  if (!Loading && Result === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 px-4">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Result Not Found</h2>
        <p className="text-lg text-gray-700 mb-6">
          You haven't completed the test yet. Click below to take it now.
        </p>
        <CustomButton
          variant="default"
          className="text-lg px-6 py-3"
          onClick={() => {
            window.location.href = `/candidate/test/${TestId}`;
          }}
        >
          Start Test
        </CustomButton>
      </div>
    );
  }
    
  if (Loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-700"></div>
      </div>
    );
  }

  const userInfo = {
    name: candidate?.name ?? "N/A",
    email: candidate?.email ?? "N/A",
    date: candidate?.created_at ? new Date(candidate.created_at).toLocaleDateString() : "N/A",
  };

  const testResults = {
    score: Result?.score ?? 0,
    correct: `${Result?.score ?? 0}/100`,
    status: Result?.score === 100 ? "Excellent" : "Needs Improvement",
    feedback:
      Result?.score === 100
        ? "Great job! You've successfully passed the test."
        : "Unfortunately, you did not pass the test.",
    description:
      Result?.score === 100
        ? "Your results demonstrate a strong understanding of the subject matter."
        : "Consider reviewing the material to improve your understanding.",
  };

  const questions = [
    {
      id: 1,
      test: TestInfo?.objective ?? "N/A",
      userAnswer: Result?.candidateAnswer ?? "N/A",
      correctAnswer: Result?.correctAnswer ?? "N/A",
      isCorrect: Result?.score === 100,
      icon:
        Result?.score === 100
          ? "https://c.animaapp.com/mabjl2fqtswclr/img/icons8-correct-48-1.png"
          : "https://c.animaapp.com/mabjl2fqtswclr/img/icons8-annuler-48-1.png",
      alt: Result?.score === 100 ? "Correct" : "Incorrect",
    },
  ];

  return (
    <div className="w-full max-w-[1193px] mx-auto p-6 bg-white shadow-md">
      <h1 className="text-4xl font-bold text-center mb-12">Your Test Results</h1>

      <Card className="mb-12 bg-[#f7f8f9] border-white">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-8">User Information</h2>
          <div className="flex justify-between flex-wrap">
            <div className="text-xl font-light">
              Name: {userInfo.name} <br /> Email: {userInfo.email}
            </div>
            <div className="text-xl font-light">Date: {userInfo.date}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-12 border-[#6c63ff] shadow-md">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between">
            <div className="relative">
              <div className="w-[169px] h-[171px] bg-white rounded-full border border-black flex flex-col items-center justify-center">
                <span className="text-[44px] font-bold">{testResults.score}</span>
                <span className="text-xl">{testResults.correct}</span>
              </div>
              <img
                className="absolute w-[210px] h-[212px] top-0 left-0 -z-10 -translate-x-12 -translate-y-4"
                alt="Ellipse"
                src="https://c.animaapp.com/mabjl2fqtswclr/img/ellipse-27.svg"
              />
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`${
                  testResults.score === 100 ? "bg-[#0f9f27] text-white" : "bg-gray-200 text-black"
                } rounded-2xl w-auto h-auto flex items-center justify-center mb-4 text-lg`}
              >
                {testResults.status}
              </div>

              <p className="text-lg font-medium text-center mb-2">{testResults.feedback}</p>
              <p className="text-base font-light text-center">{testResults.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-8">Detailed Results</h2>
        {questions.map((q) => (
          <Card key={q.id} className="mb-8 border-[#6c63ff]">
            <CardContent>
              <h3 className="text-xl font-medium mb-4">{q.test}</h3>
              <div className="flex justify-between items-center">
                <div className="text-xl font-light">
                  Your Answer: {q.userAnswer} <br />
                  Correct Answer: {q.correctAnswer}
                </div>
                <img className="w-[71px] h-[71px] object-cover" src={q.icon} alt={q.alt} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-12 mb-6">
        <button onClick={(e)=>{e.preventDefault();window.history.back()}}  className="w-[260px] h-[59px] bg-[#5856d6] text-xl font-extrabold">
            Back
        </button>
        <CustomButton
          variant="outline"
          className="w-[262px] h-[61px] border-[#5856d6] text-[#5856d6] text-xl font-extrabold"
        >
          Download PDF
        </CustomButton>
      </div>
    </div>
  );
};
