/**
 * Frontend Date Utilities - All functions work with local dates
 * Uses YYYY-MM-DD format for date strings to avoid timezone issues
 */

/**
 * Get today's date as YYYY-MM-DD string (local timezone)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getTodayDateString = () => {
  const today = new Date();
  return formatDateString(today);
};

/**
 * Format a Date object to YYYY-MM-DD string (local timezone)
 * @param {Date|string} date - Date object or date string
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateString = (date) => {
  let d;
  if (typeof date === "string") {
    d = new Date(date + "T00:00:00"); // Assume local time if string
  } else {
    d = new Date(date);
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string (YYYY-MM-DD) and return as Date object
 * Handles timezone safely - interprets as local time
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
export const parseLocalDateString = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date;
};

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  return formatDateString(date1) === formatDateString(date2);
};

/**
 * Get the current date, auto-detecting at midnight
 * @returns {Date} Current date
 */
export const getCurrentLocalDate = () => {
  return new Date();
};

/**
 * Convert 24-hour time format to 12-hour AM/PM format
 * @param {string} time24 - Time in HH:MM format (24-hour)
 * @returns {string} Time in h:MM AM/PM format (12-hour)
 */
export const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
};

/**
 * Convert 12-hour AM/PM format to 24-hour format
 * @param {string} time12 - Time in h:MM AM/PM format
 * @returns {string} Time in HH:MM format (24-hour)
 */
export const convertTo24HourFormat = (time12) => {
  const [time, period] = time12.trim().split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let hours24 = hours;
  if (period === "PM" && hours !== 12) {
    hours24 = hours + 12;
  } else if (period === "AM" && hours === 12) {
    hours24 = 0;
  }

  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/**
 * Generate time slots for a specific day based on wake-up time
 * @param {string} wakeUpTime - Wake-up time in HH:MM format (24-hour), e.g., "05:00"
 * @returns {Array<{time24: string, time12: string, display: string}>} Array of time slots
 */
export const generateDynamicTimeSlots = (wakeUpTime = "05:00") => {
  const [wakeHours, wakeMinutes] = wakeUpTime.split(":").map(Number);
  const slots = [];

  // Generate slots from wake-up time to 11 PM (23:00)
  let currentHours = wakeHours;
  let currentMinutes = wakeMinutes;

  while (currentHours < 23) {
    const time24 = `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;
    const time12 = convertTo12HourFormat(time24);
    const nextTime12 = convertTo12HourFormat(getNextSlotTime(time24));

    slots.push({
      time24,
      time12,
      display: `${time12} - ${nextTime12}`,
    });

    // Add 30 minutes
    currentMinutes += 30;
    if (currentMinutes >= 60) {
      currentMinutes -= 60;
      currentHours += 1;
    }
  }

  return slots;
};

/**
 * Helper: Get next 30-minute slot time
 * @param {string} time24 - Current time in HH:MM format
 * @returns {string} Next slot time in HH:MM format
 */
const getNextSlotTime = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  let nextHours = hours;
  let nextMinutes = minutes + 30;

  if (nextMinutes >= 60) {
    nextMinutes -= 60;
    nextHours += 1;
  }

  return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`;
};

/**
 * Get default wake-up time if not specified
 * @returns {string} Default time "05:00"
 */
export const getDefaultWakeUpTime = () => {
  return "05:00";
};

/**
 * Store wake-up time for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} wakeUpTime - Time in HH:MM format
 */
export const storeWakeUpTime = (dateString, wakeUpTime) => {
  const key = `wakeUpTime_${dateString}`;
  localStorage.setItem(key, wakeUpTime);
};

/**
 * Get stored wake-up time for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string|null} Wake-up time in HH:MM format or null if not set
 */
export const getStoredWakeUpTime = (dateString) => {
  const key = `wakeUpTime_${dateString}`;
  return localStorage.getItem(key);
};

/**
 * Check if wake-up time was already asked for today
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} True if already set
 */
export const hasWakeUpTimeForDate = (dateString) => {
  return getStoredWakeUpTime(dateString) !== null;
};

/**
 * Clear wake-up time for a specific date (for testing)
 * @param {string} dateString - Date in YYYY-MM-DD format
 */
export const clearWakeUpTime = (dateString) => {
  const key = `wakeUpTime_${dateString}`;
  localStorage.removeItem(key);
};

/**
 * Format date for display (e.g., "Monday, May 13, 2026")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date) => {
  let d;
  if (typeof date === "string") {
    d = parseLocalDateString(date);
  } else {
    d = new Date(date);
  }

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
