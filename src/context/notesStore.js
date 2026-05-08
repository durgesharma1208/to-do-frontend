import { create } from "zustand";

const useNotesStore = create((set) => ({
  notes: [],
  isLoading: false,
  filter: "all", // all, important
  searchQuery: "",

  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) => (note._id === id ? updatedNote : note)),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  getFilteredNotes: (state) => {
    let filtered = state.notes;

    if (state.searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(state.searchQuery.toLowerCase()),
      );
    }

    if (state.filter === "important") {
      filtered = filtered.filter((note) => note.isImportant);
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },
}));

export default useNotesStore;
