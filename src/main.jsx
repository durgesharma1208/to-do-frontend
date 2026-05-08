import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        console.log("New content available; please refresh.");
      },
      onOfflineReady() {
        console.log("App is ready to work offline.");
      },
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
