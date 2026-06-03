import axios from "axios";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD-PU9ADO2neLOfcje5Elh_yd7NP8hOsJY",
  authDomain: "mern-project-e54de.firebaseapp.com",
  projectId: "mern-project-e54de",
  storageBucket: "mern-project-e54de.firebasestorage.app",
  messagingSenderId: "220399124851",
  appId: "1:220399124851:web:e3030e389f8f793792c506",
  measurementId: "G-0YSZEG3PB4",
};

const VAPID_KEY =
  "BJBmruFVysGVdePlU5QsIu6FeLnzLRPqS0ZIKQHDEoukIaYeUJmnSu_aH7p8WWYbEkduyutqsfd7GG4vPMGws20";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const isBrowser =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  typeof Notification !== "undefined";

let messaging = null;

if (isBrowser && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(firebaseApp);
  } catch (error) {
    console.warn("Firebase messaging not available:", error);
    messaging = null;
  }
}

let tokenRequestInFlight = null;
let lastSyncedToken = null;

const getAuthToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.warn("Unable to read auth token from storage:", error);
    return null;
  }
};

const getStoredSyncedToken = () => {
  try {
    return localStorage.getItem("fcmTokenSynced");
  } catch (error) {
    console.warn("Unable to read synced token from storage:", error);
    return null;
  }
};

const setStoredSyncedToken = (token) => {
  try {
    localStorage.setItem("fcmTokenSynced", token);
  } catch (error) {
    console.warn("Unable to persist synced token:", error);
  }
};

const resolveServiceWorkerRegistration = async () => {
  if (!isBrowser || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const existingRegistration =
      await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      return existingRegistration;
    }

    return await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch (error) {
    console.warn("Service worker registration unavailable:", error);
    return null;
  }
};

const syncTokenToBackend = async (token, authToken) => {
  if (!authToken) {
    console.warn("JWT token missing. Skipping FCM token sync.");
    return false;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/notifications/save-token`,
      { fcmToken: token },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("FCM token synced:", response.data?.message || "success");
    return true;
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;

    if (status === 401) {
      console.warn("Unauthorized while syncing FCM token.");
      return false;
    }

    console.error("Failed to sync FCM token:", message);
    return false;
  }
};

export const generateToken = async ({ force = false } = {}) => {
  if (!isBrowser) {
    console.warn("Notifications are not supported in this environment.");
    return null;
  }

  if (!messaging) {
    console.warn("Firebase messaging is not initialized.");
    return null;
  }

  if (tokenRequestInFlight && !force) {
    return tokenRequestInFlight;
  }

  tokenRequestInFlight = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn("Firebase messaging is not supported in this browser.");
        return null;
      }

      if (Notification.permission === "denied") {
        console.warn("Notification permission denied by user.");
        return null;
      }

      let permission = Notification.permission;
      if (permission === "default") {
        console.log("Requesting notification permission...");
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        console.warn("Notification permission not granted.");
        return null;
      }

      const serviceWorkerRegistration =
        await resolveServiceWorkerRegistration();

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: serviceWorkerRegistration || undefined,
      });

      if (!token) {
        console.warn("FCM token not available. Check service worker setup.");
        return null;
      }

      const storedToken = getStoredSyncedToken();
      const shouldSync =
        force || token !== storedToken || token !== lastSyncedToken;

      if (shouldSync) {
        const authToken = getAuthToken();
        const synced = await syncTokenToBackend(token, authToken);
        if (synced) {
          lastSyncedToken = token;
          setStoredSyncedToken(token);
        }
      } else {
        console.log("FCM token already synced. Skipping update.");
      }

     console.log("FCM token ready:", token);
alert(token);
return token;
    } catch (error) {
      console.error("Error generating FCM token:", error);
      return null;
    } finally {
      tokenRequestInFlight = null;
    }
  })();

  return tokenRequestInFlight;
};

export { messaging };
