import React, { useState, useEffect } from "react";
import { AlertCircle, Clock } from "lucide-react";
import Button from "./Button";

/**
 * Modal to ask user for wake-up time
 * Shows only once per day when first opening productivity page
 */
const WakeUpTimeModal = ({ isOpen, onClose, onSubmit, currentDate }) => {
  const [wakeUpHour, setWakeUpHour] = useState("5");
  const [wakeUpMinute, setWakeUpMinute] = useState("00");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      // Reset to default
      setWakeUpHour("5");
      setWakeUpMinute("00");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const hour = parseInt(wakeUpHour);
    const minute = parseInt(wakeUpMinute);

    // Validate
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      setError("Please enter a valid time");
      return;
    }

    // Format as HH:MM (24-hour)
    const wakeUpTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    onSubmit(wakeUpTime);
    onClose();
  };

  if (!isOpen) return null;

  // Convert to 12-hour format for display
  const hour12 = parseInt(wakeUpHour) % 12 || 12;
  const period = parseInt(wakeUpHour) >= 12 ? "PM" : "AM";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Clock className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Wake-Up Time
          </h2>
        </div>

        {/* Info message */}
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          When did you wake up today? Productivity slots will be generated from
          this time until 11:00 PM.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Time Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Time
            </label>

            <div className="flex items-center gap-4">
              {/* Hour Input */}
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Hour (0-23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={wakeUpHour}
                  onChange={(e) => {
                    setWakeUpHour(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:ring-blue-900"
                />
              </div>

              {/* Colon */}
              <div className="flex items-end pb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  :
                </span>
              </div>

              {/* Minute Input */}
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Minute (0-59)
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={wakeUpMinute}
                  onChange={(e) => {
                    setWakeUpMinute(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:ring-blue-900"
                />
              </div>

              {/* 12-hour display */}
              <div className="flex-1 text-right">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  12-Hour
                </div>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {String(hour12).padStart(2, "0")}:
                  {String(wakeUpMinute).padStart(2, "0")} {period}
                </div>
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { hour: "5", label: "5:00 AM" },
                { hour: "6", label: "6:00 AM" },
                { hour: "7", label: "7:00 AM" },
                { hour: "8", label: "8:00 AM" },
                { hour: "9", label: "9:00 AM" },
                { hour: "10", label: "10:00 AM" },
              ].map(({ hour, label }) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => {
                    setWakeUpHour(hour);
                    setWakeUpMinute("00");
                    setError("");
                  }}
                  className={`rounded py-2 text-sm font-medium transition ${
                    wakeUpHour === hour && wakeUpMinute === "00"
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" variant="primary">
              Set Wake-Up Time
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1"
              variant="secondary"
            >
              Skip
            </Button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can change this anytime from your settings.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WakeUpTimeModal;
