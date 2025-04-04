import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in browser and production environment
let analytics = null;
if (typeof window !== "undefined") {
  try {
    // Dynamically import to avoid SSR issues
    import("firebase/analytics")
      .then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
      })
      .catch((err) => {
        console.error("Analytics initialization error:", err);
      });
  } catch (error) {
    console.error("Analytics import error:", error);
  }
}

// Admin email
export const ADMIN_EMAIL = "mithuncy32@gmail.com";

export { app, db, auth, googleProvider, analytics };
