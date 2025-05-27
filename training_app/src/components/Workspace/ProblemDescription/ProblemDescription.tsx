import { Problem } from "@/utils/types/problem";
import { useEffect, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";

type ProblemDescriptionProps = {
	problem: Problem;
	_solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved }) => {
	return (
		<div className='bg-dark-layer-1'>
			{/* TAB */}
			<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
				<div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
					Description
				</div>
			</div>

			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5'>
					{/* Problem heading */}
					<div className='w-full'>
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem?.title}</div>
						</div>
						<div className='flex items-center mt-3'>
							<div
								className={`${getDifficultyClass(problem.id)} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize`}
							>
								{getDifficulty(problem.id)}
							</div>
							{_solved && (
								<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
									<BsCheck2Circle />
								</div>
							)}
						</div>

						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-sm mt-4'>
							<div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />
						</div>

						{/* Examples */}
						<div className='mt-4'>
							{problem.examples.map((example, index) => (
								<div key={example.id}>
									<p className='font-medium text-white '>Example {index + 1}: </p>
									{example.img && <img src={example.img} alt='' className='mt-3' />}
									<div className='example-card'>
										<pre>
											<strong className='text-white'>Input: </strong> {example.inputText}
											<br />
											<strong>Output:</strong>
											{example.outputText} <br />
											{example.explanation && (
												<>
													<strong>Explanation:</strong> {example.explanation}
												</>
											)}
										</pre>
									</div>
								</div>
							))}
						</div>

						{/* Constraints */}
						<div className='my-5'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc'>
								<div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProblemDescription;

// Helper functions to determine difficulty without Firestore
function getDifficulty(problemId: string): string {
	// Hardcoded difficulty based on problem ID
	const difficultyMap: {[key: string]: string} = {
		"two-sum": "Easy",
		"reverse-linked-list": "Medium",
		"jump-game": "Medium",
		"search-a-2d-matrix": "Medium",
		"valid-parentheses": "Easy"
	};
	
	return difficultyMap[problemId] || "Medium";
}

function getDifficultyClass(problemId: string): string {
	const difficulty = getDifficulty(problemId);
	
	return difficulty === "Easy" 
		? "text-dark-green-s" 
		: difficulty === "Medium" 
		? "text-dark-yellow" 
		: "text-dark-pink";
}
