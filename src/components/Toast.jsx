import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import useUiStore from "../context/uiStore";

const Toast = () => {
  const { toast, hideToast } = useUiStore();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-md flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${getColors()} animate-fade-in z-50`}
    >
      {getIcon()}
      <span className="flex-1">{toast.message}</span>
      <button onClick={hideToast} className="hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
