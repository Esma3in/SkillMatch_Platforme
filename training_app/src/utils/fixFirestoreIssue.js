// This script will directly modify the local ProblemsTable component to work without Firestore
// This is a temporary fix until your Firestore database is properly set up

const fs = require('fs');
const path = require('path');

// Get the problems data
const problemsData = [
  {
    id: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    category: "Array",
    order: 1,
    likes: 0,
    dislikes: 0
  },
  {
    id: "reverse-linked-list",
    title: "2. Reverse Linked List",
    difficulty: "Medium",
    category: "Linked List",
    order: 2,
    likes: 0,
    dislikes: 0
  },
  {
    id: "jump-game",
    title: "3. Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    order: 3,
    likes: 0,
    dislikes: 0
  },
  {
    id: "valid-parentheses",
    title: "4. Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    order: 4,
    likes: 0,
    dislikes: 0
  },
  {
    id: "search-a-2d-matrix",
    title: "5. Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    order: 5,
    likes: 0,
    dislikes: 0
  }
];

// Path to ProblemsTable component
const problemsTablePath = path.join(__dirname, '..', 'components', 'ProblemsTable', 'ProblemsTable.tsx');

// Read the file
fs.readFile(problemsTablePath, 'utf8', function(err, data) {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Modify the useGetProblems function to return local data
  const localProblemsCode = `function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
	const [problems, setProblems] = useState<DBProblem[]>([]);

	useEffect(() => {
		// Local data instead of fetching from Firestore
		setLoadingProblems(true);
		// Using local problem data
		const localProblems = ${JSON.stringify(problemsData, null, 2)};
		setProblems(localProblems);
		setLoadingProblems(false);
	}, [setLoadingProblems]);
	return problems;
}`;

  // Regular expression to find the useGetProblems function
  const useGetProblemsRegex = /function useGetProblems[\s\S]*?return problems;\s*\}/;

  // Replace the function
  const updatedData = data.replace(useGetProblemsRegex, localProblemsCode);

  // Write the updated content back to the file
  fs.writeFile(problemsTablePath, updatedData, 'utf8', function(err) {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("ProblemsTable.tsx has been updated to use local data instead of Firestore.");
  });
});

console.log("Attempting to fix ProblemsTable component..."); 