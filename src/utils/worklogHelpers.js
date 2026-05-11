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
 * Format date to YYYY-MM-DD format
 * @param {Date|string} date
 * @returns {string} Formatted date string
 */
export const formatDateISO = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
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
 * Parse work log export data and convert to CSV
 * @param {Array} data - Array of work log objects
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(",");

  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(","),
  );

  return [csvHeaders, ...csvRows].join("\n");
};

/**
 * Download file with given content and filename
 * @param {string} content - File content
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
export const downloadFile = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
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
