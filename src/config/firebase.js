import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigValid = Object.values(firebaseConfig).every(Boolean);

let app = null;
let messaging = null;

if (isFirebaseConfigValid) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    messaging = getMessaging(app);
  }
} else {
  console.warn(
    "Firebase is not initialized because some environment variables are missing.",
    firebaseConfig,
  );
}

export { messaging };
export default app;
