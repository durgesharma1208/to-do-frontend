import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  changePassword: (data) => api.post("/auth/change-password", data),
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
  resendVerificationEmail: (data) =>
    api.post("/auth/resend-verification-email", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    api.post(`/auth/reset-password/${token}`, data),
};

export const todoService = {
  getTodos: () => api.get("/todos"),
  createTodo: (data) => api.post("/todos", data),
  updateTodo: (id, data) => api.put(`/todos/${id}`, data),
  toggleTodo: (id) => api.patch(`/todos/${id}/toggle`),
  deleteTodo: (id) => api.delete(`/todos/${id}`),
};

export const notesService = {
  getNotes: () => api.get("/notes"),
  createNote: (data) => api.post("/notes", data),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  toggleImportant: (id) => api.patch(`/notes/${id}/toggle-important`),
};

export const worklogService = {
  // Get work logs for a specific date
  getLogsByDate: (date) => api.get(`/worklogs/date/${date}`),

  // Get work logs for a date range
  getLogsDateRange: (startDate, endDate) =>
    api.get("/worklogs/range", {
      params: { startDate, endDate },
    }),

  // Create or update work log
  upsertWorkLog: (data) => api.post("/worklogs", data),

  // Update work log
  updateWorkLog: (id, data) => api.put(`/worklogs/${id}`, data),

  // Delete work log
  deleteWorkLog: (id) => api.delete(`/worklogs/${id}`),

  // Get productivity stats for a date
  getProductivityStats: (date) => api.get(`/worklogs/stats/daily/${date}`),

  // Get weekly stats
  getWeeklyStats: (date) => api.get(`/worklogs/stats/weekly/${date}`),

  // Export work logs
  exportWorkLogs: (startDate, endDate, format = "xlsx") =>
    api.get("/worklogs/export", {
      params: { startDate, endDate, format },
    }),
};
