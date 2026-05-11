import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createSelector } from "reselect";

const todoStore = (set, get) => ({
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
});

const useTodoStore = create(devtools(todoStore));

// Selectors
const selectTodos = (state) => state.todos;
const selectFilter = (state) => state.filter;
const selectSortBy = (state) => state.sortBy;
const selectSearchQuery = (state) => state.searchQuery;

export const selectFilteredAndSortedTodos = createSelector(
  [selectTodos, selectFilter, selectSortBy, selectSearchQuery],
  (todos, filter, sortBy, searchQuery) => {
    let filtered = [...todos];

    if (searchQuery) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filter === "pending") {
      filtered = filtered.filter((todo) => !todo.completed);
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "dueDate") {
      filtered.sort(
        (a, b) =>
          (new Date(a.dueDate) || Infinity) - (new Date(b.dueDate) || Infinity),
      );
    } else if (sortBy === "priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      filtered.sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
      );
    }

    return filtered;
  },
);

export default useTodoStore;
