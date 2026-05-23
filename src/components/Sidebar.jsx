import React from "react";
import {
  Home,
  CheckSquare,
  Settings,
  X,
  StickyNote,
  User,
  Calendar,
  Flame,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import useUiStore from "../context/uiStore";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: CheckSquare, label: "All Todos", path: "/todos" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: StickyNote, label: "Notes", path: "/notes" },
    { icon: Flame, label: "Productivity", path: "/productivity" },
  ];

  const settingsItems = [
    { icon: Bell, label: "Reminders", path: "/reminders" },
    { icon: User, label: "Profile Settings", path: "/profile-settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white transform transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } overflow-y-auto`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition group"
              >
                <item.icon className="w-5 h-5 group-hover:text-blue-400 transition" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-700 pt-4 space-y-2">
            {settingsItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition group"
              >
                <item.icon className="w-5 h-5 group-hover:text-blue-400 transition" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
