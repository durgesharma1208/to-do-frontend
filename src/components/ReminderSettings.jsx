/**
 * ReminderSettings Component
 * Beautiful, responsive UI for managing notification reminders
 *
 * Features:
 * - Toggle reminders on/off
 * - Set reminder interval
 * - Choose notification sound
 * - Test notification and sound
 * - Real-time permission status
 * - Error handling and feedback
 */

import React, { useState } from "react";
import useReminder from "../hooks/useReminder";

const ReminderSettings = () => {
  const {
    isEnabled,
    interval,
    selectedSound,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    startReminder,
    stopReminder,
    testNotification,
    testSound,
    updateInterval,
    updateSound,
    sounds,
    isSupported,
  } = useReminder();

  const [localInterval, setLocalInterval] = useState(interval);
  const [testLoading, setTestLoading] = useState(false);

  // Handle permission request
  const handleRequestPermission = async () => {
    await requestPermission();
  };

  // Handle toggle reminder
  const handleToggleReminder = async () => {
    if (isEnabled) {
      stopReminder();
    } else {
      // Check permission first
      if (permissionStatus !== "granted") {
        const granted = await requestPermission();
        if (granted) {
          await startReminder(localInterval, selectedSound);
        }
      } else {
        await startReminder(localInterval, selectedSound);
      }
    }
  };

  // Handle interval change
  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setLocalInterval(newInterval);
    updateInterval(newInterval);
  };

  // Handle sound change
  const handleSoundChange = (e) => {
    const newSound = e.target.value;
    updateSound(newSound);
  };

  // Handle test notification
  const handleTestNotification = async () => {
    setTestLoading(true);
    await testNotification();
    setTestLoading(false);
  };

  // Handle test sound
  const handleTestSound = async () => {
    setTestLoading(true);
    await testSound();
    setTestLoading(false);
  };

  if (!isSupported) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          ⚠️ Not Supported
        </h3>
        <p className="text-red-700 text-sm">
          Browser notifications are not supported in your browser. Please use a
          modern browser like Chrome, Firefox, Safari, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔔</span>
          <h2 className="text-2xl font-bold text-gray-800">
            Reminder Settings
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Set up periodic notifications to keep you on track
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Permission Status Card */}
      <div
        className={`mb-6 p-4 rounded-lg border ${
          permissionStatus === "granted"
            ? "bg-green-50 border-green-200"
            : permissionStatus === "denied"
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">
              Notification Permission
            </p>
            <p
              className={`text-sm mt-1 ${
                permissionStatus === "granted"
                  ? "text-green-700"
                  : permissionStatus === "denied"
                    ? "text-red-700"
                    : "text-yellow-700"
              }`}
            >
              {permissionStatus === "granted" && "✓ Enabled"}
              {permissionStatus === "denied" && "✗ Blocked"}
              {permissionStatus === "default" && "○ Not set up"}
            </p>
          </div>
          {permissionStatus !== "granted" && (
            <button
              onClick={handleRequestPermission}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm rounded transition"
            >
              {isLoading ? "Loading..." : "Enable"}
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {/* Toggle Reminder */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">Reminders</p>
              <p className="text-gray-600 text-sm">
                {isEnabled ? "✓ Active" : "○ Inactive"}
              </p>
            </div>
            <button
              onClick={handleToggleReminder}
              disabled={isLoading || permissionStatus !== "granted"}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isEnabled ? "bg-green-500" : "bg-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Interval Setting */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block font-semibold text-gray-800 mb-3">
            Reminder Interval
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="120"
              value={localInterval}
              onChange={handleIntervalChange}
              disabled={isLoading}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex items-center gap-1 min-w-fit">
              <input
                type="number"
                min="1"
                max="1440"
                value={localInterval}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  handleIntervalChange({ target: { value: val } });
                }}
                disabled={isLoading}
                className="w-16 px-2 py-2 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600 text-sm">min</span>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-2">
            💡 Notifications every {localInterval} minute
            {localInterval !== 1 ? "s" : ""}
            {localInterval >= 60 &&
              ` (${(localInterval / 60).toFixed(1)} hours)`}
          </p>
        </div>

        {/* Sound Selection */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-800 mb-3">
            Notification Sound
          </label>
          <div className="space-y-2">
            <select
              value={selectedSound}
              onChange={handleSoundChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {Object.entries(sounds).map(([key, sound]) => (
                <option key={key} value={key}>
                  🔊 {sound.name} - {sound.description}
                </option>
              ))}
            </select>
            <button
              onClick={handleTestSound}
              disabled={isLoading || testLoading || !selectedSound}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {testLoading ? "🔄 Playing..." : "▶ Test Sound"}
            </button>
          </div>
        </div>

        {/* Test Notification Button */}
        <button
          onClick={handleTestNotification}
          disabled={isLoading || testLoading || permissionStatus !== "granted"}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
        >
          {testLoading ? (
            <>
              <span className="animate-spin">🔄</span>
              Testing...
            </>
          ) : (
            <>
              <span>🔔</span>
              Test Notification
            </>
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900 text-xs font-semibold mb-2">
          💡 How it works:
        </p>
        <ul className="text-blue-800 text-xs space-y-1">
          <li>✓ Enable notifications with the toggle above</li>
          <li>✓ Choose your reminder interval (in minutes)</li>
          <li>✓ Select your preferred notification sound</li>
          <li>✓ Settings are saved automatically</li>
          <li>✓ Reminders continue even after closing this tab</li>
        </ul>
      </div>

      {/* Browser Limitations */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-700 text-xs font-semibold mb-2">
          ℹ️ Browser Notes:
        </p>
        <ul className="text-gray-600 text-xs space-y-1">
          <li>• Notifications work best when the browser is open</li>
          <li>
            • Some sounds may not play on first notification (browser policy)
          </li>
          <li>• Sounds require at least one user interaction to play</li>
          <li>• On PWA installed as app, notifications work in background</li>
        </ul>
      </div>
    </div>
  );
};

export default ReminderSettings;
