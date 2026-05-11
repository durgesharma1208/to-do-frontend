import { create } from "zustand";

const worklogStore = (set, get) => ({
  workLogs: [],
  workLogsMap: {}, // Map of dates to their logs
  isLoading: false,
  selectedDate: null,
  stats: null,
  weeklyStats: null,

  // Set all work logs
  setWorkLogs: (workLogs) => {
    set({ workLogs });
    // Create a map for quick access
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

  // Set selected date
  setSelectedDate: (selectedDate) => set({ selectedDate }),

  // Set stats
  setStats: (stats) => set({ stats }),

  // Set weekly stats
  setWeeklyStats: (weeklyStats) => set({ weeklyStats }),

  // Get work logs for a specific date
  getLogsForDate: (date) => {
    const state = get();
    if (!date) return [];
    const dateStr = new Date(date).toISOString().split("T")[0];
    return state.workLogs.filter((log) => {
      const logDateStr = new Date(log.date).toISOString().split("T")[0];
      return logDateStr === dateStr;
    });
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
      selectedDate: null,
    }),
});

const useWorkLogStore = create(worklogStore);

export default useWorkLogStore;
