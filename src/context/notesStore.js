import { create } from "zustand";
import { createSelector } from "reselect";

const notesStore = (set, get) => ({
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
});

const useNotesStore = create(notesStore);

// Selectors
const selectNotes = (state) => state.notes;
const selectFilter = (state) => state.filter;
const selectSearchQuery = (state) => state.searchQuery;

export const selectFilteredNotes = createSelector(
  [selectNotes, selectFilter, selectSearchQuery],
  (notes, filter, searchQuery) => {
    let filtered = [...notes];

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filter === "important") {
      filtered = filtered.filter((note) => note.isImportant);
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },
);

export default useNotesStore;
