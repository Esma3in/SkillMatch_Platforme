// This script seeds problems data into Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLJNDPfo8CKfrgZkUfyqHmOrtMPXOo07s",
  authDomain: "skillmatch-9fdbb.firebaseapp.com",
  projectId: "skillmatch-9fdbb",
  storageBucket: "skillmatch-9fdbb.appspot.com",
  messagingSenderId: "497622958692",
  appId: "1:497622958692:web:8d9e9af956ee81bc281571",
  measurementId: "G-SYWK5FHVKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Problem data to seed
const problems = [
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
  },
  
];

// Seed the problems
async function seedProblems() {
  try {
    for (const problem of problems) {
      await setDoc(doc(firestore, "problems", problem.id), {
        ...problem
      });
      console.log(`Problem ${problem.id} added successfully!`);
    }
    console.log("All problems have been added to Firestore!");
  } catch (error) {
    console.error("Error adding problems to Firestore: ", error);
  }
}

// Execute the seed function
seedProblems(); 