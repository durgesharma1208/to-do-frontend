import { create } from "zustand";

const useTodoStore = create((set) => ({
  todos: [],
  isLoading: false,
  filter: "all",
  sortBy: "newest",
  searchQuery: "",

  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
  updateTodo: (id, updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo._id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  getFilteredAndSortedTodos: (state) => {
    let filtered = state.todos;

    if (state.searchQuery) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          (todo.description &&
            todo.description
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase())),
      );
    }

    if (state.filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (state.filter === "pending") {
      filtered = filtered.filter((todo) => !todo.completed);
    }

    if (state.sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (state.sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (state.sortBy === "dueDate") {
      filtered.sort(
        (a, b) =>
          (new Date(a.dueDate) || Infinity) - (new Date(b.dueDate) || Infinity),
      );
    } else if (state.sortBy === "priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      filtered.sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
      );
    }

    return filtered;
  },
}));

export default useTodoStore;
