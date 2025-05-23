// This script verifies we can read problems from Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

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

// Check if we can read problems
async function checkProblems() {
  try {
    console.log("Attempting to read problems from Firestore...");
    const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No problems found in the Firestore database!");
      return;
    }
    
    console.log(`Found ${querySnapshot.size} problems:`);
    querySnapshot.forEach((doc) => {
      console.log(`- ${doc.id}: ${doc.data().title}`);
    });
    
  } catch (error) {
    console.error("Error reading problems from Firestore: ", error);
  }
}

// Execute the check function
checkProblems(); 