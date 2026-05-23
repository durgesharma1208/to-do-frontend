/**
 * Notification Service
 * Handles browser notifications using the Notification API
 *
 * Features:
 * - Request user permission
 * - Send notifications with custom title and body
 * - Check browser support
 * - Handle notification clicks
 * - Close notifications
 */

export const notificationService = {
  /**
   * Check if browser supports Notification API
   * @returns {boolean} True if notifications are supported
   */
  isSupported() {
    if (!("Notification" in window)) {
      console.warn("Notification API not supported in this browser");
      return false;
    }
    return true;
  },

  /**
   * Check current notification permission status
   * @returns {string} 'granted', 'denied', or 'default'
   */
  getPermissionStatus() {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission;
  },

  /**
   * Request notification permission from user
   * Note: Permission can only be requested after user interaction
   * @returns {Promise<string>} 'granted', 'denied', or 'default'
   */
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error("Notification API not supported");
    }

    try {
      const permission = await Notification.requestPermission();
      console.log(`Notification permission: ${permission}`);
      return permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      throw error;
    }
  },

  /**
   * Send a notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @param {string} options.body - Notification body text
   * @param {string} options.icon - Icon URL
   * @param {string} options.badge - Badge icon URL
   * @param {string} options.tag - Unique identifier for notification
   * @param {boolean} options.requireInteraction - Keep notification visible until user interacts
   * @returns {Notification|null} Notification object or null if not permitted
   */
  show(title, options = {}) {
    if (!this.isSupported()) {
      console.warn("Cannot show notification: Notification API not supported");
      return null;
    }

    // Only show if permission is granted
    if (Notification.permission !== "granted") {
      console.warn("Cannot show notification: Permission not granted");
      return null;
    }

    try {
      const defaultOptions = {
        body: "",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "reminder-notification",
        requireInteraction: false,
        ...options,
      };

      const notification = new Notification(title, defaultOptions);

      // Add click handler
      notification.addEventListener("click", () => {
        notification.close();
        window.focus();
      });

      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  },

  /**
   * Send a reminder notification
   * @param {string} customMessage - Custom message for the notification body
   * @returns {Notification|null} Notification object
   */
  sendReminder(customMessage = "Time to check your tasks!") {
    return this.show("📋 Todo Reminder", {
      body: customMessage,
      icon: "/favicon.ico",
      tag: "todo-reminder",
      requireInteraction: false,
    });
  },

  /**
   * Get a user-friendly permission status message
   * @returns {string} Status message
   */
  getPermissionMessage() {
    const status = this.getPermissionStatus();
    switch (status) {
      case "granted":
        return "Notifications are enabled ✓";
      case "denied":
        return "Notifications are blocked. Enable in browser settings.";
      case "default":
        return "Notifications are not set up yet.";
      default:
        return "Unknown permission status";
    }
  },
};

export default notificationService;
