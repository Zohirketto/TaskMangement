import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";


const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});
let analytics;
let auth;
let db;
let firebaseAvailable = false;
try {
  auth = getAuth(app);
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false
  });
  firebaseAvailable = true;
  if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    import("firebase/analytics").then(({ isSupported, getAnalytics }) => {
      isSupported().then((ok) => {
        if (ok) analytics = getAnalytics(app);
      });
    });
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
  firebaseAvailable = false;
}

export { app, auth, db, analytics, firebaseAvailable };
