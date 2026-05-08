import { useEffect } from "react";

export const usePWA = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.log("SW registration failed:", error);
      });
    }
  }, []);
};
