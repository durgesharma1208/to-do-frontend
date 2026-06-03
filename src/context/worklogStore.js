import { create } from "zustand";
import { formatDateString } from "../utils/dateUtils";

const worklogStore = (set, get) => ({
  workLogs: [],
  workLogsMap: {}, // Map of log IDs to logs
  isLoading: false,
  selectedDate: null,
  selectedDateStr: null, // YYYY-MM-DD format
  stats: null,
  weeklyStats: null,
  wakeUpTime: null, // Current day's wake-up time
  timeSlots: [], // Dynamic time slots for current day

  // Set all work logs
  setWorkLogs: (workLogs) => {
    set({ workLogs });
    // Create a map for quick access by ID
    const map = {};
    workLogs.forEach((log) => {
      if (!map[log._id]) {
        map[log._id] = log;
      }
    });
    set({ workLogsMap: map });
  },

  // Add a new work log
  addWorkLog: (workLog) =>
    set((state) => ({
      workLogs: [workLog, ...state.workLogs],
      workLogsMap: {
        ...state.workLogsMap,
        [workLog._id]: workLog,
      },
    })),

  // Update existing work log
  updateWorkLog: (id, updatedWorkLog) =>
    set((state) => ({
      workLogs: state.workLogs.map((log) =>
        log._id === id ? updatedWorkLog : log,
      ),
      workLogsMap: {
        ...state.workLogsMap,
        [id]: updatedWorkLog,
      },
    })),

  // Delete work log
  deleteWorkLog: (id) =>
    set((state) => {
      const newMap = { ...state.workLogsMap };
      delete newMap[id];
      return {
        workLogs: state.workLogs.filter((log) => log._id !== id),
        workLogsMap: newMap,
      };
    }),

  // Upsert (create or update) work log
  upsertWorkLog: (workLog) =>
    set((state) => {
      const existingIndex = state.workLogs.findIndex(
        (log) => log._id === workLog._id,
      );
      let updatedWorkLogs;

      if (existingIndex > -1) {
        updatedWorkLogs = state.workLogs.map((log) =>
          log._id === workLog._id ? workLog : log,
        );
      } else {
        updatedWorkLogs = [workLog, ...state.workLogs];
      }

      return {
        workLogs: updatedWorkLogs,
        workLogsMap: {
          ...state.workLogsMap,
          [workLog._id]: workLog,
        },
      };
    }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set selected date (Date object)
  setSelectedDate: (selectedDate) => {
    const dateStr = selectedDate ? formatDateString(selectedDate) : null;
    set({ selectedDate, selectedDateStr: dateStr });
  },

  // Set selected date string directly (YYYY-MM-DD format)
  setSelectedDateStr: (dateStr) => {
    set({ selectedDateStr: dateStr });
  },

  // Set stats
  setStats: (stats) => set({ stats }),

  // Set weekly stats
  setWeeklyStats: (weeklyStats) => set({ weeklyStats }),

  // Set wake-up time for current day
  setWakeUpTime: (wakeUpTime) => set({ wakeUpTime }),

  // Set time slots for current day
  setTimeSlots: (timeSlots) => set({ timeSlots }),

  // Get work logs for a specific date (by dateStr: YYYY-MM-DD)
  getLogsForDate: (dateStr) => {
    const state = get();
    if (!dateStr) return [];
    return state.workLogs.filter((log) => log.dateStr === dateStr);
  },

  // Get work log by ID
  getWorkLogById: (id) => {
    return get().workLogsMap[id] || null;
  },

  // Clear all work logs
  clearWorkLogs: () =>
    set({
      workLogs: [],
      workLogsMap: {},
      stats: null,
      weeklyStats: null,
      selectedDate: null,
      selectedDateStr: null,
      wakeUpTime: null,
      timeSlots: [],
    }),
});

const useWorkLogStore = create(worklogStore);

export default useWorkLogStore;
