/**
 * Date helper utilities for formatting and manipulating dates
 */

/**
 * Formats a date string or Date object to a human-readable format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date to a relative time string (e.g., "2 days ago", "just now")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 30) {
    return 'just now';
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes === 1) {
    return '1 minute ago';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours === 1) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInMonths === 1) {
    return '1 month ago';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else if (diffInYears === 1) {
    return '1 year ago';
  } else {
    return `${diffInYears} years ago`;
  }
}

/**
 * Formats a date to ISO 8601 format
 * @param date - Date string or Date object
 * @returns ISO 8601 formatted string
 */
export function formatISO(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return d.toISOString();
}

/**
 * Checks if a date is today
 * @param date - Date string or Date object
 * @returns True if the date is today
 */
export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the past
 * @param date - Date string or Date object
 * @returns True if the date is in the past
 */
export function isPast(date: string | Date): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return d.getTime() < new Date().getTime();
}

/**
 * Checks if a date is in the future
 * @param date - Date string or Date object
 * @returns True if the date is in the future
 */
export function isFuture(date: string | Date): boolean {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return d.getTime() > new Date().getTime();
}

/**
 * Adds days to a date
 * @param date - Date string or Date object
 * @param days - Number of days to add (can be negative)
 * @returns New Date object
 */
export function addDays(date: string | Date, days: number): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Gets the difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between the dates (positive if date1 is after date2)
 */
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date');
  }
  
  const diffInMs = d1.getTime() - d2.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats time in HH:MM format
 * @param date - Date string or Date object
 * @returns Time string (e.g., "14:30")
 */
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Formats date and time together
 * @param date - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 1, 2024 at 14:30")
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return `${formatDate(d)} at ${formatTime(d)}`;
}
