import React from "react";
import {
  Home,
  CheckSquare,
  Calendar,
  StickyNote,
  Flame,
  Bell,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: CheckSquare, label: "Todos", path: "/todos" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: StickyNote, label: "Notes", path: "/notes" },
    { icon: Flame, label: "Productivity", path: "/productivity" },
    { icon: Bell, label: "Reminders", path: "/reminders" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition min-w-fit ${
              isActive(item.path)
                ? "text-blue-600 border-t-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
