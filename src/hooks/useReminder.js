/**
 * useReminder Hook
 * Manages reminder state, intervals, and localStorage persistence
 *
 * Features:
 * - Request notification permission
 * - Start/stop reminders
 * - Manage reminder intervals
 * - Persist settings in localStorage
 * - Automatic cleanup on unmount
 * - Prevent duplicate intervals
 */

import { useState, useEffect, useCallback, useRef } from "react";
import notificationService from "../services/notificationService";
import audioService from "../services/audioService";

const STORAGE_KEY = "reminderSettings";
const DEFAULT_INTERVAL = 60; // minutes
const DEFAULT_SOUND = "bell";

export const useReminder = () => {
  // State for reminder settings
  const [isEnabled, setIsEnabled] = useState(false);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  const [selectedSound, setSelectedSound] = useState(DEFAULT_SOUND);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use ref to track the interval ID - prevents multiple intervals
  const intervalIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const shouldAutoStartRef = useRef(false);

  /**
   * Load settings from localStorage on mount
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const loadSettings = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const settings = JSON.parse(saved);
          setIsEnabled(settings.isEnabled || false);
          setInterval(settings.interval || DEFAULT_INTERVAL);
          setSelectedSound(settings.selectedSound || DEFAULT_SOUND);

          // Mark that we should auto-start if reminders were enabled
          if (settings.isEnabled) {
            shouldAutoStartRef.current = true;
          }
        }

        // Check current permission status
        if (notificationService.isSupported()) {
          setPermissionStatus(notificationService.getPermissionStatus());
        }
      } catch (err) {
        console.error("Error loading reminder settings:", err);
        setError("Failed to load settings");
      }
    };

    loadSettings();
  }, []);

  /**
   * Save settings to localStorage
   */
  const saveSettings = useCallback((settings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error("Error saving reminder settings:", err);
      setError("Failed to save settings");
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    if (!notificationService.isSupported()) {
      setError("Notifications not supported in this browser");
      return false;
    }

    try {
      setIsLoading(true);
      const permission = await notificationService.requestPermission();
      setPermissionStatus(permission);
      setError(null);
      return permission === "granted";
    } catch (err) {
      console.error("Error requesting permission:", err);
      setError("Failed to request notification permission");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Trigger a reminder notification and sound
   */
  const triggerReminder = useCallback(async () => {
    try {
      // Show notification
      notificationService.sendReminder(
        `Check your tasks! (${new Date().toLocaleTimeString()})`,
      );

      // Play sound - error is silently caught by audioService
      if (selectedSound) {
        await audioService.play(selectedSound);
      }
    } catch (err) {
      console.error("Error triggering reminder:", err);
    }
  }, [selectedSound]);

  /**
   * Start reminders
   */
  const startReminder = useCallback(
    async (intervalMinutes = interval, soundKey = selectedSound) => {
      // Prevent multiple intervals
      if (intervalIdRef.current) {
        console.warn("Reminder already running. Stop it first.");
        return false;
      }

      // Check permission
      if (permissionStatus !== "granted") {
        const granted = await requestPermission();
        if (!granted) {
          setError("Cannot start reminders without notification permission");
          return false;
        }
      }

      try {
        // Preload sounds for better performance
        if (soundKey) {
          await audioService.preloadAllSounds();
        }

        // Trigger first reminder immediately
        notificationService.sendReminder(
          "Reminder started! Next one in " + intervalMinutes + " minutes.",
        );

        // Set up interval - convert minutes to milliseconds
        const intervalMs = intervalMinutes * 60 * 1000;
        intervalIdRef.current = setInterval(() => {
          triggerReminder();
        }, intervalMs);

        setIsEnabled(true);
        setInterval(intervalMinutes);
        setSelectedSound(soundKey);
        setError(null);

        // Save to localStorage
        saveSettings({
          isEnabled: true,
          interval: intervalMinutes,
          selectedSound: soundKey,
        });

        console.log(
          `Reminder started: ${intervalMinutes} minutes, sound: ${soundKey}`,
        );
        return true;
      } catch (err) {
        console.error("Error starting reminder:", err);
        setError("Failed to start reminders");
        return false;
      }
    },
    [
      interval,
      selectedSound,
      permissionStatus,
      requestPermission,
      triggerReminder,
      saveSettings,
    ],
  );

  /**
   * Stop reminders
   */
  const stopReminder = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIsEnabled(false);
      setError(null);

      // Save to localStorage
      saveSettings({
        isEnabled: false,
        interval,
        selectedSound,
      });

      console.log("Reminder stopped");
      return true;
    }
    return false;
  }, [interval, selectedSound, saveSettings]);

  /**
   * Toggle reminders on/off
   */
  const toggleReminder = useCallback(async () => {
    if (isEnabled) {
      stopReminder();
    } else {
      await startReminder();
    }
  }, [isEnabled, startReminder, stopReminder]);

  /**
   * Test notification
   */
  const testNotification = useCallback(async () => {
    if (permissionStatus !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        setError("Cannot show test notification without permission");
        return false;
      }
    }

    try {
      notificationService.sendReminder("🔔 This is a test notification!");
      if (selectedSound) {
        await audioService.play(selectedSound);
      }
      return true;
    } catch (err) {
      console.error("Error showing test notification:", err);
      setError("Failed to show test notification");
      return false;
    }
  }, [permissionStatus, requestPermission, selectedSound]);

  /**
   * Test sound playback
   */
  const testSound = useCallback(async () => {
    if (!selectedSound) {
      setError("No sound selected");
      return false;
    }

    try {
      await audioService.play(selectedSound);
      return true;
    } catch (err) {
      console.error("Error playing sound:", err);
      setError("Failed to play sound");
      return false;
    }
  }, [selectedSound]);

  /**
   * Update interval and save settings
   */
  const updateInterval = useCallback(
    (newInterval) => {
      // Validate interval
      const validInterval = Math.max(1, Math.min(1440, newInterval)); // 1-1440 minutes (1 day)
      setInterval(validInterval);

      // If reminder is running, restart with new interval
      if (isEnabled) {
        stopReminder();
        startReminder(validInterval, selectedSound);
      } else {
        saveSettings({
          isEnabled,
          interval: validInterval,
          selectedSound,
        });
      }
    },
    [isEnabled, selectedSound, stopReminder, startReminder, saveSettings],
  );

  /**
   * Update sound and save settings
   */
  const updateSound = useCallback(
    (newSound) => {
      setSelectedSound(newSound);
      saveSettings({
        isEnabled,
        interval,
        selectedSound: newSound,
      });
    },
    [isEnabled, interval, saveSettings],
  );

  /**
   * Cleanup on unmount - stop reminder and clear intervals
   */
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      // Optionally clear audio cache to free memory
      // audioService.clearCache();
    };
  }, []);

  /**
   * Auto-start reminders after permission is granted and page loads
   * Happens once after settings are loaded from localStorage
   */
  useEffect(() => {
    if (
      shouldAutoStartRef.current &&
      permissionStatus === "granted" &&
      !isEnabled &&
      interval > 0
    ) {
      shouldAutoStartRef.current = false; // Only run once
      startReminder(interval, selectedSound);
    }
  }, [permissionStatus, isEnabled, interval, selectedSound, startReminder]);

  return {
    // State
    isEnabled,
    interval,
    selectedSound,
    permissionStatus,
    isLoading,
    error,

    // Methods
    requestPermission,
    startReminder,
    stopReminder,
    toggleReminder,
    testNotification,
    testSound,
    updateInterval,
    updateSound,

    // Utils
    sounds: audioService.getSounds(),
    isSupported: notificationService.isSupported(),
  };
};

export default useReminder;
