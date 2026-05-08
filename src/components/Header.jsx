import React, { useState } from "react";
import { Menu, LogOut, Moon, Sun, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../context/authStore";
import useUiStore from "../context/uiStore";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUiStore();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">📝 Todo App</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-3 relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-1"
                  title="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      to="/profile-settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Profile Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
