import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCea9FBzuvfVfCjN88sp6z8Pir36pPQG9A",
  authDomain: "grabgold-aa760.firebaseapp.com",
  projectId: "grabgold-aa760",
  storageBucket: "grabgold-aa760.firebasestorage.app",
  messagingSenderId: "1066464698850",
  appId: "1:1066464698850:web:41e5a26f3dc5651bf299bb",
  measurementId: "G-W3B3PQCHPH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;