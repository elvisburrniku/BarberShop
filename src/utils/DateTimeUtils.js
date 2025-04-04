/**
 * Format a date for display in the app
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatAppointmentDate = (date) => {
  if (!date || !(date instanceof Date)) {
    return 'Invalid date';
  }
  
  // Format: "Tuesday, July 15"
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a time for display in the app
 * @param {Date} date - The date with time to format
 * @returns {string} - Formatted time string
 */
export const formatAppointmentTime = (date) => {
  if (!date || !(date instanceof Date)) {
    return 'Invalid time';
  }
  
  // Format: "3:30 PM"
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format a currency amount
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Get the next 30 days as an array of Date objects
 * @returns {Array<Date>} - Array of dates
 */
export const getNext30Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} - Whether the date is today
 */
export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Add minutes to a date
 * @param {Date} date - The starting date
 * @param {number} minutes - Minutes to add
 * @returns {Date} - New date with minutes added
 */
export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

/**
 * Generate time slots for a given day
 * @param {Date} date - The date to generate time slots for
 * @param {number} intervalMinutes - Interval between slots in minutes
 * @param {number} startHour - Starting hour (24h format)
 * @param {number} endHour - Ending hour (24h format)
 * @returns {Array<Object>} - Array of time slot objects
 */
export const generateTimeSlots = (date, intervalMinutes = 30, startHour = 9, endHour = 18) => {
  const slots = [];
  const startDate = new Date(date);
  startDate.setHours(startHour, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(endHour, 0, 0, 0);
  
  let currentSlot = new Date(startDate);
  
  while (currentSlot < endDate) {
    slots.push({
      time: formatAppointmentTime(currentSlot),
      date: new Date(currentSlot),
      available: Math.random() > 0.3 // Randomly mark some as unavailable for demo
    });
    
    currentSlot = addMinutes(currentSlot, intervalMinutes);
  }
  
  return slots;
};
