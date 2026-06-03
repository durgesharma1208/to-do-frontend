import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isInitialized: false,

  // Initialize from localStorage
  initialize: () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      set({
        token: token || null,
        user: user || null,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  // Set user and token (from login/register)
  login: (user, token) => {
    set({ user, token });
    // Persist to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Alias for compatibility
  setUser: (user, token) => {
    set({ user, token });
    // Persist to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Logout
  logout: () => {
    set({ user: null, token: null });
    // Clear from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

// Initialize on app load
useAuthStore.getState().initialize();

export default useAuthStore;
