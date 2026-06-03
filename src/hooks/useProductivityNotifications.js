import { useEffect, useRef } from "react";

const useProductivityNotifications = (enabled = true) => {
  const intervalRef = useRef(null);
  const permissionRef = useRef(false);

  // Request notification permission
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      permissionRef.current = true;
      return true;
    }

    if (Notification.permission !== "denied") {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          permissionRef.current = true;
          return true;
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }

    return false;
  };

  // Send notification
  const sendNotification = (title, options = {}) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    try {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Start 30-minute notification interval
  const startNotifications = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log("Notification permission not granted");
      return;
    }

    // Send first notification immediately
    sendNotification("Productivity Tracker", {
      body: "What did you work on in the last 30 minutes?",
      tag: "productivity-reminder",
      requireInteraction: true,
    });

    // Set up interval for every 30 minutes
    intervalRef.current = setInterval(
      () => {
        sendNotification("Productivity Tracker", {
          body: "What did you work on in the last 30 minutes?",
          tag: "productivity-reminder",
          requireInteraction: true,
        });
      },
      30 * 60 * 1000,
    ); // 30 minutes in milliseconds
  };

  // Stop notifications
  const stopNotifications = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (enabled) {
      startNotifications();
    }

    return () => {
      stopNotifications();
    };
    // startNotifications and stopNotifications are stable refs defined inside
    // this component; including them would cause the effect to re-run on
    // every render. The intentional dependency here is only `enabled`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    requestPermission,
    sendNotification,
    startNotifications,
    stopNotifications,
    hasPermission: permissionRef.current,
  };
};

export default useProductivityNotifications;
