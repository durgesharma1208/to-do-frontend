// Firebase Messaging Service Worker
// This file handles push notifications when the app is in the background
// (tab minimized, browser closed, or user on a different tab)

importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// NOTE: Service Workers cannot access import.meta.env or process.env.
// The Firebase web config below is safe to include here — these are
// public client-side identifiers, NOT secret keys.
const firebaseConfig = {
  apiKey: "AIzaSyD-PU9ADO2neLOfcje5Elh_yd7NP8hOsJY",
  authDomain: "mern-project-e54de.firebaseapp.com",
  projectId: "mern-project-e54de",
  storageBucket: "mern-project-e54de.firebasestorage.app",
  messagingSenderId: "220399124851",
  appId: "1:220399124851:web:e3030e389f8f793792c506",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages (when the tab/browser is not focused)
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/pwa-192x192.png",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
