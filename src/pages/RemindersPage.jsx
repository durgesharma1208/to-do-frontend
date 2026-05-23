/**
 * RemindersPage.jsx
 * Dedicated page for reminder settings
 *
 * This is ready to use - just add to your routes!
 */

import React from "react";
import ReminderSettings from "../components/ReminderSettings";

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔔 Notification Reminders
          </h1>
          <p className="text-gray-600 text-lg">
            Set up periodic reminders to keep you productive and on track
          </p>
        </div>

        {/* Main Component */}
        <ReminderSettings />

        {/* Info Card */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-blue-900 font-semibold mb-3">💡 How to Use</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>✓ Enable notifications with the toggle above</li>
            <li>✓ Choose your preferred reminder interval</li>
            <li>✓ Select a notification sound</li>
            <li>✓ Your settings are saved automatically</li>
            <li>✓ Reminders continue as long as the browser is open</li>
          </ul>
        </div>

        {/* Tips Card */}
        <div className="mt-4 p-6 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-purple-900 font-semibold mb-3">🎯 Pro Tips</h3>
          <ul className="text-purple-800 text-sm space-y-2">
            <li>
              <strong>Recommended Interval:</strong> 60 minutes for best
              productivity
            </li>
            <li>
              <strong>Best Sound:</strong> Try "Soft" for less intrusive
              reminders
            </li>
            <li>
              <strong>Testing:</strong> Use 1 minute interval to test before
              using
            </li>
            <li>
              <strong>PWA:</strong> Install as app for background reminders
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
