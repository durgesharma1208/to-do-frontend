import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true, // Start with loading true
      isInitialized: false, // To check if we have checked localStorage

      // Action to initialize the store from localStorage
      initialize: () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (token && user) {
          set({ user, token, isInitialized: true, isLoading: false });
        } else {
          set({ isInitialized: true, isLoading: false });
        }
      },

      // Action to set user and token
      login: (user, token) => {
        set({ user, token });
      },

      // Alias for login - used by RegisterPage
      setUser: (user, token) => {
        set({ user, token });
      },

      // Action to log out
      logout: () => {
        set({ user: null, token: null });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage", // unique name
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              isInitialized: false, // Don't persist initialization status
              isLoading: true, // Always start in a loading state on refresh
            },
          };
        },
        setItem: (name, newValue) => {
          // Omit non-persistent state
          const { state } = newValue;
          const toPersist = {
            user: state.user,
            token: state.token,
          };
          localStorage.setItem(
            name,
            JSON.stringify({
              state: toPersist,
              version: newValue.version,
            }),
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

// Initialize the store on application load
useAuthStore.getState().initialize();

export default useAuthStore;
