import {
  generateDynamicTimeSlots as generateDynamicSlotsFromDateUtils,
  convertTo12HourFormat as convert12HourFromDateUtils,
  convertTo24HourFormat,
  formatDateString,
  getTodayDateString,
} from "./dateUtils";

/**
 * Generate all 30-minute time slots for a day
 * @returns {string[]} Array of time slots in HH:MM format
 */
export const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 48; i++) {
    const hours = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const timeSlot = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    slots.push(timeSlot);
  }
  return slots;
};

/**
 * Generate dynamic time slots based on wake-up time
 * @param {string} wakeUpTime - Time in HH:MM format (24-hour)
 * @returns {Array<{time24: string, time12: string, display: string}>} Array of time slots
 */
export const generateDynamicTimeSlots = (wakeUpTime = "05:00") => {
  return generateDynamicSlotsFromDateUtils(wakeUpTime);
};

/**
 * Convert time to 12-hour AM/PM format
 * @param {string} time24 - Time in HH:MM format (24-hour)
 * @returns {string} Time in h:MM AM/PM format
 */
export const formatTimeTo12Hour = (time24) => {
  return convert12HourFromDateUtils(time24);
};

/**
 * Format date for display
 * @param {Date|string} date
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date to YYYY-MM-DD format (local timezone)
 * @param {Date|string} date
 * @returns {string} Formatted date string
 */
export const formatDateISO = (date) => {
  return formatDateString(date);
};

/**
 * Get start of week date
 * @param {Date} date
 * @returns {Date} Start of week date
 */
export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

/**
 * Get end of week date
 * @param {Date} date
 * @returns {Date} End of week date
 */
export const getWeekEnd = (date) => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

/**
 * Get start of month date
 * @param {Date} date
 * @returns {Date}
 */
export const getMonthStart = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

/**
 * Get end of month date
 * @param {Date} date
 * @returns {Date}
 */
export const getMonthEnd = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

/**
 * Check if dates are the same day
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Download file with given content and filename
 * @param {string|Blob} content - File content or Blob
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
export const downloadFile = (content, filename, mimeType = "text/plain") => {
  const fileBlob =
    content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(fileBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get productivity percentage for a list of logs
 * @param {Array} logs - Array of work logs
 * @returns {number} Productivity percentage
 */
export const calculateProductivity = (logs) => {
  if (!logs || logs.length === 0) return 0;
  const filledSlots = logs.filter((log) => log.text && log.text.trim()).length;
  const totalSlots = 48;
  return Math.round((filledSlots / totalSlots) * 100);
};
