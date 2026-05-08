import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const todoService = {
  getTodos: () => api.get("/todos"),
  createTodo: (data) => api.post("/todos", data),
  updateTodo: (id, data) => api.put(`/todos/${id}`, data),
  toggleTodo: (id) => api.patch(`/todos/${id}/toggle`),
  deleteTodo: (id) => api.delete(`/todos/${id}`),
};
