import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
	apiKey: "AIzaSyBLJNDPfo8CKfrgZkUfyqHmOrtMPXOo07s",
	authDomain: "skillmatch-9fdbb.firebaseapp.com",
	projectId: "skillmatch-9fdbb",
	storageBucket: "skillmatch-9fdbb.appspot.com",
	messagingSenderId: "497622958692",
	appId: "1:497622958692:web:8d9e9af956ee81bc281571",
	measurementId: "G-SYWK5FHVKC"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
const firestore = getFirestore(app);
const auth = getAuth(app);
export { firestore, app, auth };
