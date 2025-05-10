import React, { useEffect, useState, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/api";
import { Footer } from "../components/common/footer";
import NavbarCandidate from "../components/common/navbarCandidate";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white shadow-md hover:bg-indigo-700",
        destructive: "bg-red-600 text-white shadow-md hover:bg-red-700",
        outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        secondary: "bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300",
        ghost: "hover:bg-gray-100 hover:text-indigo-600",
        link: "text-indigo-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10",
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
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
CustomButton.displayName = "CustomButton";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    ref={ref}
    className={cn(
      "rounded-2xl border bg-white text-gray-800 shadow-lg",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const ResultTest = () => {
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState({});
  const [result, setResultInfo] = useState({});
  const [candidate, setCandidate] = useState({});
  const { TestId } = useParams();
  const candidate_id = localStorage.getItem("candidate_id");

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await api.get(
          `api/candidate/${candidate_id}/result/test/${TestId}`
        );
        setResultInfo(response.data.result);
        setCandidate(response.data.candidate);
        setTestInfo(response.data.test);
      } catch (err) {
        if (
          err.response &&
          err.response.status === 401 &&
          err.response.data.message === "result not found"
        ) {
          setResultInfo(null);
        } else {
          console.error("Failed to fetch test result:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [TestId, candidate_id]);

  const userInfo = useMemo(
    () => ({
      name: candidate?.name ?? "N/A",
      email: candidate?.email ?? "N/A",
      date: candidate?.created_at
        ? new Date(candidate.created_at).toLocaleDateString()
        : "N/A",
    }),
    [candidate]
  );

  const testResults = useMemo(
    () => ({
      score: result?.score ?? 0,
      correct: `${result?.score ?? 0}/100`,
      status: result?.score === 100 ? "Excellent" : "Needs Improvement",
      feedback:
        result?.score === 100
          ? "Great job! You've successfully passed the test."
          : "Unfortunately, you did not pass the test.",
      description:
        result?.score === 100
          ? "Your results demonstrate a strong understanding of the subject matter."
          : "Consider reviewing the material to improve your understanding.",
    }),
    [result]
  );

  const questions = useMemo(
    () => [
      {
        id: 1,
        test: testInfo?.objective ?? "N/A",
        userAnswer: result?.candidateAnswer ?? "N/A",
        correctAnswer: result?.correctAnswer ?? "N/A",
        isCorrect: result?.score === 100,
        icon:
          result?.score === 100
            ? "https://c.animaapp.com/mabjl2fqtswclr/img/icons8-correct-48-1.png"
            : "https://c.animaapp.com/mabjl2fqtswclr/img/icons8-annuler-48-1.png",
        alt: result?.score === 100 ? "Correct" : "Incorrect",
      },
    ],
    [testInfo, result]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-t-4 border-indigo-600"
        />
      </div>
    );
  }

  if (result === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 px-4"
      >
        <h2 className="text-4xl font-bold text-red-600 mb-6">
          Result Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          You haven't completed the test yet. Click below to take it now.
        </p>
        <CustomButton
          variant="default"
          className="text-lg px-8 py-3"
          onClick={() => {
            window.location.href = `/candidate/test/${TestId}`;
          }}
        >
          Start Test
        </CustomButton>
      </motion.div>
    );
  }

  return (
    <>
    <NavbarCandidate />
    <div className="w-full max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-indigo-800"
      >
        Your Test Results
      </motion.h1>

      <Card className="mb-12 bg-gradient-to-br from-white to-gray-50">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            User Information
          </h2>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="text-lg text-gray-600">
              <p>
                <span className="font-medium">Name:</span> {userInfo.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {userInfo.email}
              </p>
            </div>
            <div className="text-lg text-gray-600">
              <p>
                <span className="font-medium">Date:</span> {userInfo.date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-12 border-indigo-200">
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-40 h-40 bg-white rounded-full border-4 border-indigo-600 flex flex-col items-center justify-center shadow-lg">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-4xl font-bold text-indigo-800"
                >
                  {testResults.score}
                </motion.span>
                <span className="text-lg text-gray-600">
                  {testResults.correct}
                </span>
              </div>
              <img
                className="absolute w-56 h-56 top-0 left-0 -z-10 -translate-x-8 -translate-y-8 opacity-20"
                alt="Ellipse"
                src="https://c.animaapp.com/mabjl2fqtswclr/img/ellipse-27.svg"
              />
            </motion.div>
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "px-4 py-2 rounded-full text-lg font-semibold",
                  testResults.score === 100
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                )}
              >
                {testResults.status}
              </motion.div>
              <p className="text-lg font-medium text-gray-800 mt-4">
                {testResults.feedback}
              </p>
              <p className="text-base text-gray-600 mt-2 max-w-md">
                {testResults.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">
          Detailed Results
        </h2>
        <AnimatePresence>
          {questions.map((q) => (
            <Card key={q.id} className="mb-8 border-indigo-200">
              <CardContent>
                <h3 className="text-xl font-medium mb-4 text-gray-800">
                  {q.test}
                </h3>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-lg text-gray-600">
                    <p>
                      <span className="font-medium">Your Answer:</span>{" "}
                      {q.userAnswer}
                    </p>
                    <p>
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {q.correctAnswer}
                    </p>
                  </div>
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-16 h-16 object-contain"
                    src={q.icon}
                    alt={q.alt}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-center gap-6 mt-12 mb-6"
      >
        <CustomButton
          variant="default"
          className="w-full md:w-64 h-12 text-lg"
          onClick={() => window.history.back()}
        >
          Back
        </CustomButton>
        <CustomButton
          variant="outline"
          className="w-full md:w-64 h-12 text-lg border-indigo-600 text-indigo-600"
        >
          Download PDF
        </CustomButton>
      </motion.div>
    </div>
    <Footer />
    </>
  );
};

export default React.memo(ResultTest);