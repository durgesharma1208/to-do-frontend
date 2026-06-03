/* eslint-disable no-restricted-globals */

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// --- Workbox Configuration ---
// This is injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Allow the service worker to take control of the page immediately
self.skipWaiting();
clientsClaim();

// --- Firebase Configuration ---
// It's safe to expose this configuration to the client
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// --- Background Message Handler ---
onBackgroundMessage(messaging, (payload) => {
  console.log("[sw.js] Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: payload.notification?.icon || "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: {
      url: payload.data?.link || "/", // Pass link from data payload
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- Notification Click Handler ---
self.addEventListener("notificationclick", (event) => {
  console.log("[sw.js] Notification click received.", event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // If a window for this app is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
