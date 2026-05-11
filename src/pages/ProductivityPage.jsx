import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Bell,
  Calendar,
} from "lucide-react";
import TimeSlotCard from "../components/TimeSlotCard";
import ProductivityStats from "../components/ProductivityStats";
import Button from "../components/Button";
import Card from "../components/Card";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import useWorkLogStore from "../context/worklogStore";
import useUiStore from "../context/uiStore";
import useProductivityNotifications from "../hooks/useProductivityNotifications";
import { worklogService } from "../services/services";
import {
  generateTimeSlots,
  formatDate,
  formatDateISO,
  debounce,
  downloadFile,
  convertToCSV,
  getWeekStart,
  getWeekEnd,
  isSameDay,
} from "../utils/worklogHelpers";
// import * as XLSX from "xlsx";

const ProductivityPage = () => {
  const {
    workLogs,
    setWorkLogs,
    updateWorkLog,
    deleteWorkLog,
    setLoading,
    isLoading,
    selectedDate,
    setSelectedDate,
    stats,
    setStats,
    weeklyStats,
    setWeeklyStats,
  } = useWorkLogStore();

  const { showToast } = useUiStore();

  // Notification system
  const {
    requestPermission: requestNotifPermission,
    sendNotification,
    hasPermission: hasNotificationPermission,
  } = useProductivityNotifications(false);

  // Local state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [savingIds, setSavingIds] = useState(new Set());
  const [calendarDates, setCalendarDates] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Refs for time slot scrolling
  const timeSlotRefs = useRef({});

  // Initialize
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    loadWorkLogs(today);
    loadStats(today);
    loadWeeklyStats(today);
    loadCalendarData(currentMonth);
  }, []);

  // Scroll to last filled time slot when work logs load
  useEffect(() => {
    const scrollToLastFilledSlot = () => {
      if (!selectedDate) return;
      const dateKey = formatDateISO(selectedDate);
      const lastFilledTimeSlot = localStorage.getItem(
        `lastFilledTimeSlot_${dateKey}`,
      );

      if (lastFilledTimeSlot && timeSlotRefs.current[lastFilledTimeSlot]) {
        setTimeout(() => {
          timeSlotRefs.current[lastFilledTimeSlot]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    };

    if (!isLoading) {
      scrollToLastFilledSlot();
    }
  }, [isLoading, selectedDate]);

  // Load work logs for selected date
  const loadWorkLogs = async (date) => {
    try {
      setLoading(true);
      const dateStr = formatDateISO(date);
      const { data } = await worklogService.getLogsByDate(dateStr);
      setWorkLogs(data.data);
    } catch (error) {
      console.error("Error loading work logs:", error);
      showToast("Failed to load work logs", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load stats for selected date
  const loadStats = async (date) => {
    try {
      const dateStr = formatDateISO(date);
      const { data } = await worklogService.getProductivityStats(dateStr);
      setStats(data.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Load weekly stats
  const loadWeeklyStats = async (date) => {
    try {
      const dateStr = formatDateISO(date);
      const { data } = await worklogService.getWeeklyStats(dateStr);
      setWeeklyStats(data.data);
    } catch (error) {
      console.error("Error loading weekly stats:", error);
    }
  };

  // Load calendar data for month
  const loadCalendarData = async (date) => {
    try {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const startStr = formatDateISO(start);
      const endStr = formatDateISO(end);

      const { data } = await worklogService.getLogsDateRange(startStr, endStr);
      setCalendarDates(data.data);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    }
  };

  // Save work log
  const handleSaveWorkLog = useCallback(
    debounce(async (timeSlot, text, isDraft) => {
      try {
        const dateStr = formatDateISO(selectedDate);
        setSavingIds((prev) => new Set([...prev, timeSlot]));

        const { data } = await worklogService.upsertWorkLog({
          date: dateStr,
          timeSlot,
          text,
          isDraft,
        });

        updateWorkLog(data.data._id, data.data);

        // Store the last filled time slot for this date
        localStorage.setItem(`lastFilledTimeSlot_${dateStr}`, timeSlot);

        // Auto-scroll to this time slot
        setTimeout(() => {
          timeSlotRefs.current[timeSlot]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);

        showToast("Work log saved successfully", "success");
      } catch (error) {
        console.error("Error saving work log:", error);
        showToast("Failed to save work log", "error");
      } finally {
        setSavingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(timeSlot);
          return newSet;
        });
      }
    }, 800),
    [selectedDate, updateWorkLog, showToast],
  );

  // Delete work log
  const handleDeleteWorkLog = useCallback(
    async (workLogId) => {
      try {
        await worklogService.deleteWorkLog(workLogId);
        deleteWorkLog(workLogId);
        showToast("Work log deleted successfully", "success");
        loadStats(selectedDate);
      } catch (error) {
        console.error("Error deleting work log:", error);
        showToast("Failed to delete work log", "error");
      }
    },
    [selectedDate, deleteWorkLog, showToast],
  );

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadWorkLogs(date);
    loadStats(date);
    loadWeeklyStats(date);
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    loadCalendarData(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    loadCalendarData(newMonth);
  };

  // Handle today button
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
    loadCalendarData(today);
  };

  // Handle notifications
  const handleNotificationsToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotifPermission();
      if (granted) {
        setNotificationsEnabled(true);
        showToast(
          "Notifications enabled - you'll get reminders every 30 minutes",
          "success",
        );
      } else {
        showToast("Notification permission denied", "error");
      }
    } else {
      setNotificationsEnabled(false);
      showToast("Notifications disabled", "info");
    }
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const weekStart = getWeekStart(selectedDate);
      const weekEnd = getWeekEnd(selectedDate);

      const { data } = await worklogService.exportWorkLogs(
        formatDateISO(weekStart),
        formatDateISO(weekEnd),
      );

      // Dynamic import to avoid loading XLSX if not needed
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Work Logs");
      XLSX.writeFile(
        wb,
        `WorkLogs_${formatDateISO(weekStart)}_to_${formatDateISO(weekEnd)}.xlsx`,
      );

      showToast("Exported to Excel successfully", "success");
    } catch (error) {
      console.error("Error exporting:", error);
      showToast("Failed to export to Excel", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const weekStart = getWeekStart(selectedDate);
      const weekEnd = getWeekEnd(selectedDate);

      const { data } = await worklogService.exportWorkLogs(
        formatDateISO(weekStart),
        formatDateISO(weekEnd),
      );

      const csv = convertToCSV(data.data);
      downloadFile(
        csv,
        `WorkLogs_${formatDateISO(weekStart)}_to_${formatDateISO(weekEnd)}.csv`,
        "text/csv",
      );

      showToast("Exported to CSV successfully", "success");
    } catch (error) {
      console.error("Error exporting:", error);
      showToast("Failed to export to CSV", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Generate calendar
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    );
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Daily Productivity Tracker
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Log your 30-minute work sessions and track your productivity
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleNotificationsToggle}
            variant={notificationsEnabled ? "primary" : "secondary"}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            {notificationsEnabled ? "Notifications On" : "Enable Notifications"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && weeklyStats && (
        <ProductivityStats stats={stats} weeklyStats={weeklyStats} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <div className="p-6">
            {/* Month Navigation */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleToday}
                  className="rounded px-2 py-1 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-8" />;
                }

                const dateKey = formatDateISO(date);
                const hasLogs =
                  calendarDates[dateKey] && calendarDates[dateKey].length > 0;
                const isToday = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);

                return (
                  <button
                    key={dateKey}
                    onClick={() => handleDateSelect(date)}
                    className={`h-8 rounded text-sm font-medium transition ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : isToday
                          ? "border-2 border-blue-500 text-gray-900 dark:text-gray-50"
                          : hasLogs
                            ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Export buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export to Excel"}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export to CSV"}
              </button>
            </div>
          </div>
        </Card>

        {/* Time Slots */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              {selectedDate && formatDate(selectedDate)}
            </h2>
            <button
              onClick={handleToday}
              className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
            >
              <Calendar className="h-4 w-4" />
              Go to Today
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {timeSlots.map((timeSlot) => {
                const log = workLogs.find((l) => l.timeSlot === timeSlot);
                return (
                  <div
                    key={timeSlot}
                    ref={(el) => {
                      if (el) timeSlotRefs.current[timeSlot] = el;
                    }}
                  >
                    <TimeSlotCard
                      timeSlot={timeSlot}
                      initialText={log?.text || ""}
                      isDraft={log?.isDraft || false}
                      isSaving={savingIds.has(timeSlot)}
                      onSave={(data) => {
                        handleSaveWorkLog(timeSlot, data.text, data.isDraft);
                      }}
                      onDelete={() => {
                        if (log) {
                          handleDeleteWorkLog(log._id);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductivityPage;
