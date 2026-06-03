import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Toast from "./components/Toast";
import Router from "./routes/Router";
import { usePWA } from "./hooks/usePWA";
import useFCM from "./hooks/useFCM";
import useUiStore from "./context/uiStore";

function App() {
  usePWA();
  // Initialize FCM - handles requesting permissions, token generation, and backend syncing
  useFCM();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useUiStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 overflow-y-auto">
            <Router />
          </main>
        </div>

        <MobileNav />
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
