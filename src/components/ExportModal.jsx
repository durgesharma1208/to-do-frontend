import React, { useEffect, useState } from "react";
import Button from "./Button";
import {
  formatDateISO,
  getWeekStart,
  getWeekEnd,
} from "../utils/worklogHelpers";

const rangeOptions = [
  { value: "currentWeek", label: "Current Week" },
  { value: "currentMonth", label: "Current Month" },
  { value: "custom", label: "Custom Range" },
];

const ExportModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentDate,
  exportFormat = "xlsx",
}) => {
  const [rangeType, setRangeType] = useState("currentWeek");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setRangeType("currentWeek");
      const today = currentDate || new Date();
      setCustomStartDate(formatDateISO(getWeekStart(today)));
      setCustomEndDate(formatDateISO(getWeekEnd(today)));
    }
  }, [isOpen, currentDate]);

  if (!isOpen) {
    return null;
  }

  const today = currentDate || new Date();
  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const getRangeValues = () => {
    if (rangeType === "currentMonth") {
      return {
        startDate: formatDateISO(monthStart),
        endDate: formatDateISO(monthEnd),
      };
    }

    if (rangeType === "custom") {
      return {
        startDate: customStartDate,
        endDate: customEndDate,
      };
    }

    return {
      startDate: formatDateISO(weekStart),
      endDate: formatDateISO(weekEnd),
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const { startDate, endDate } = getRangeValues();

    if (!startDate || !endDate) {
      setError("Please choose a valid date range.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date must be before or equal to end date.");
      return;
    }

    onSubmit({ startDate, endDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Export Work Logs
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Choose the date range for your{" "}
              {exportFormat === "csv" ? "CSV" : "Excel"} export.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            aria-label="Close export modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="grid gap-3 sm:grid-cols-3">
              {rangeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm transition ${
                    rangeType === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-200"
                      : "border-transparent bg-white text-gray-700 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="rangeType"
                    value={option.value}
                    checked={rangeType === option.value}
                    onChange={() => setRangeType(option.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            {rangeType !== "custom" && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                <div className="font-medium text-gray-900 dark:text-gray-50">
                  {rangeType === "currentMonth"
                    ? "Current Month"
                    : "Current Week"}
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {rangeType === "currentMonth"
                    ? `${formatDateISO(monthStart)} → ${formatDateISO(monthEnd)}`
                    : `${formatDateISO(weekStart)} → ${formatDateISO(weekEnd)}`}
                </div>
              </div>
            )}

            {rangeType === "custom" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  Start Date
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:focus:ring-blue-900"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  End Date
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:focus:ring-blue-900"
                  />
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="flex-1" variant="primary">
              Export {exportFormat === "csv" ? "CSV" : "Excel"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1"
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;
