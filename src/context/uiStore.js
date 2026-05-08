import { create } from "zustand";

const useUiStore = create((set) => ({
  darkMode: localStorage.getItem("darkMode") === "true" || false,
  sidebarOpen: window.innerWidth > 768,
  toast: null,

  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.darkMode;
      localStorage.setItem("darkMode", newDarkMode);
      return { darkMode: newDarkMode };
    }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  showToast: (message, type = "info") =>
    set({
      toast: {
        id: Date.now(),
        message,
        type,
      },
    }),

  hideToast: () => set({ toast: null }),
}));

export default useUiStore;
