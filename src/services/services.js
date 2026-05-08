import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  changePassword: (data) => api.post("/auth/change-password", data),
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
