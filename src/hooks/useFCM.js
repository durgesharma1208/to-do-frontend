import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";
import { notificationService } from "../services/services";
import useAuthStore from "../context/authStore";

export const useFCM = () => {
  const { user } = useAuthStore();
  const [fcmToken, setFcmToken] = useState(null);
  const [permission, setPermission] = useState(Notification.permission);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !messaging) return;

    const setupFCM = async () => {
      try {
        // 1. Request Permission
        let currentPermission = Notification.permission;
        if (currentPermission === "default") {
          console.log("Requesting notification permission...");
          currentPermission = await Notification.requestPermission();
        }
        setPermission(currentPermission);

        if (currentPermission === "granted") {
          console.log("Notification permission granted.");

          // 2. Get Token
          // The service worker is now managed by vite-plugin-pwa using injectManifest.
          // We no longer need to manually register it. `getToken` will find the active SW.
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });

          if (token) {
            console.log("FCM Token retrieved:", token);
            setFcmToken(token);

            // 3. Sync Token with Backend
            await notificationService.updateFCMToken({ fcmToken: token });
            console.log("FCM Token successfully synced with backend.");
          } else {
            console.warn(
              "No registration token available. The service worker might not be ready or there's a configuration issue.",
            );
            setError("Could not retrieve FCM token. Please try again shortly.");
          }
        } else {
          console.warn("Notification permission was not granted.");
          setError("Notification permission is required to receive updates.");
        }
      } catch (err) {
        console.error("An error occurred during FCM setup:", err);
        setError("Failed to set up notifications: " + err.message);
      }
    };

    setupFCM();

    // 4. Listen for Foreground Messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      // Display a native browser notification for immediate feedback
      const { title, body, icon } = payload.notification || {};
      new Notification(title || "New Message", {
        body: body || "",
        icon: icon || "/pwa-192x192.png",
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return { fcmToken, permission, error };
};

export default useFCM;
