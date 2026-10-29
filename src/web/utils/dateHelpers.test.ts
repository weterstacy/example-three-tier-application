import {
  formatDate,
  formatRelativeTime,
  formatISO,
  isToday,
  isPast,
  isFuture,
  addDays,
  daysBetween,
  formatTime,
  formatDateTime,
} from './dateHelpers';

describe('formatDate', () => {
  it('should format a Date object correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });

  it('should format a date string correctly', () => {
    expect(formatDate('2024-12-25T00:00:00Z')).toBe('Dec 25, 2024');
  });

  it('should handle different months', () => {
    expect(formatDate('2024-03-01T00:00:00Z')).toBe('Mar 1, 2024');
    expect(formatDate('2024-06-15T00:00:00Z')).toBe('Jun 15, 2024');
    expect(formatDate('2024-09-30T00:00:00Z')).toBe('Sep 30, 2024');
  });

  it('should throw an error for invalid dates', () => {
    expect(() => formatDate('invalid-date')).toThrow('Invalid date');
    expect(() => formatDate('not a date')).toThrow('Invalid date');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Mock the current time to 2024-01-15 12:00:00
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "just now" for recent dates', () => {
    const date = new Date('2024-01-15T11:59:45Z'); // 15 seconds ago
    expect(formatRelativeTime(date)).toBe('just now');
  });

  it('should return seconds ago', () => {
    const date = new Date('2024-01-15T11:59:15Z'); // 45 seconds ago
    expect(formatRelativeTime(date)).toBe('45 seconds ago');
  });

  it('should return "1 minute ago"', () => {
    const date = new Date('2024-01-15T11:59:00Z'); // 1 minute ago
    expect(formatRelativeTime(date)).toBe('1 minute ago');
  });

  it('should return minutes ago', () => {
    const date = new Date('2024-01-15T11:45:00Z'); // 15 minutes ago
    expect(formatRelativeTime(date)).toBe('15 minutes ago');
  });

  it('should return "1 hour ago"', () => {
    const date = new Date('2024-01-15T11:00:00Z'); // 1 hour ago
    expect(formatRelativeTime(date)).toBe('1 hour ago');
  });

  it('should return hours ago', () => {
    const date = new Date('2024-01-15T07:00:00Z'); // 5 hours ago
    expect(formatRelativeTime(date)).toBe('5 hours ago');
  });

  it('should return "1 day ago"', () => {
    const date = new Date('2024-01-14T12:00:00Z'); // 1 day ago
    expect(formatRelativeTime(date)).toBe('1 day ago');
  });

  it('should return days ago', () => {
    const date = new Date('2024-01-10T12:00:00Z'); // 5 days ago
    expect(formatRelativeTime(date)).toBe('5 days ago');
  });

  it('should return "1 month ago"', () => {
    const date = new Date('2023-12-15T12:00:00Z'); // ~1 month ago
    expect(formatRelativeTime(date)).toBe('1 month ago');
  });

  it('should return months ago', () => {
    const date = new Date('2023-10-15T12:00:00Z'); // ~3 months ago
    expect(formatRelativeTime(date)).toBe('3 months ago');
  });

  it('should return "1 year ago"', () => {
    const date = new Date('2023-01-15T12:00:00Z'); // 1 year ago
    expect(formatRelativeTime(date)).toBe('1 year ago');
  });

  it('should return years ago', () => {
    const date = new Date('2021-01-15T12:00:00Z'); // 3 years ago
    expect(formatRelativeTime(date)).toBe('3 years ago');
  });

  it('should throw an error for invalid dates', () => {
    expect(() => formatRelativeTime('invalid')).toThrow('Invalid date');
  });
});

describe('formatISO', () => {
  it('should format a Date object to ISO 8601', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    expect(formatISO(date)).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should format a date string to ISO 8601', () => {
    const result = formatISO('2024-12-25T15:45:30.000Z');
    expect(result).toBe('2024-12-25T15:45:30.000Z');
  });

  it('should throw an error for invalid dates', () => {
    expect(() => formatISO('not-a-date')).toThrow('Invalid date');
  });
});

describe('isToday', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return true for today\'s date', () => {
    const date = new Date('2024-01-15T08:00:00Z');
    expect(isToday(date)).toBe(true);
  });

  it('should return true for the current moment', () => {
    const date = new Date();
    expect(isToday(date)).toBe(true);
  });

  it('should return false for yesterday', () => {
    const date = new Date('2024-01-14T12:00:00Z');
    expect(isToday(date)).toBe(false);
  });

  it('should return false for tomorrow', () => {
    const date = new Date('2024-01-16T12:00:00Z');
    expect(isToday(date)).toBe(false);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => isToday('invalid')).toThrow('Invalid date');
  });
});

describe('isPast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return true for dates in the past', () => {
    const date = new Date('2024-01-14T12:00:00Z');
    expect(isPast(date)).toBe(true);
  });

  it('should return true for dates from last year', () => {
    const date = new Date('2023-01-15T12:00:00Z');
    expect(isPast(date)).toBe(true);
  });

  it('should return false for dates in the future', () => {
    const date = new Date('2024-01-16T12:00:00Z');
    expect(isPast(date)).toBe(false);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => isPast('not-a-date')).toThrow('Invalid date');
  });
});

describe('isFuture', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return true for dates in the future', () => {
    const date = new Date('2024-01-16T12:00:00Z');
    expect(isFuture(date)).toBe(true);
  });

  it('should return true for dates next year', () => {
    const date = new Date('2025-01-15T12:00:00Z');
    expect(isFuture(date)).toBe(true);
  });

  it('should return false for dates in the past', () => {
    const date = new Date('2024-01-14T12:00:00Z');
    expect(isFuture(date)).toBe(false);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => isFuture('invalid-date')).toThrow('Invalid date');
  });
});

describe('addDays', () => {
  it('should add days to a date', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = addDays(date, 5);
    expect(result.getDate()).toBe(20);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2024);
  });

  it('should subtract days when given a negative number', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = addDays(date, -5);
    expect(result.getDate()).toBe(10);
    expect(result.getMonth()).toBe(0);
    expect(result.getFullYear()).toBe(2024);
  });

  it('should handle month transitions', () => {
    const date = new Date('2024-01-30T12:00:00Z');
    const result = addDays(date, 5);
    expect(result.getDate()).toBe(4);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getFullYear()).toBe(2024);
  });

  it('should handle year transitions', () => {
    const date = new Date('2024-12-30T12:00:00Z');
    const result = addDays(date, 5);
    expect(result.getDate()).toBe(4);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2025);
  });

  it('should accept date strings', () => {
    const result = addDays('2024-01-15T12:00:00Z', 10);
    expect(result.getDate()).toBe(25);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => addDays('invalid', 5)).toThrow('Invalid date');
  });
});

describe('daysBetween', () => {
  it('should calculate days between two dates', () => {
    const date1 = new Date('2024-01-20T00:00:00Z');
    const date2 = new Date('2024-01-15T00:00:00Z');
    expect(daysBetween(date1, date2)).toBe(5);
  });

  it('should return negative days when first date is earlier', () => {
    const date1 = new Date('2024-01-15T00:00:00Z');
    const date2 = new Date('2024-01-20T00:00:00Z');
    expect(daysBetween(date1, date2)).toBe(-5);
  });

  it('should return 0 for the same date', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    expect(daysBetween(date, date)).toBe(0);
  });

  it('should handle dates from different months', () => {
    const date1 = new Date('2024-02-15T00:00:00Z');
    const date2 = new Date('2024-01-15T00:00:00Z');
    expect(daysBetween(date1, date2)).toBe(31);
  });

  it('should handle dates from different years', () => {
    const date1 = new Date('2025-01-15T00:00:00Z');
    const date2 = new Date('2024-01-15T00:00:00Z');
    expect(daysBetween(date1, date2)).toBe(366); // 2024 is a leap year
  });

  it('should accept date strings', () => {
    const result = daysBetween('2024-01-20T00:00:00Z', '2024-01-15T00:00:00Z');
    expect(result).toBe(5);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => daysBetween('invalid', '2024-01-15')).toThrow('Invalid date');
    expect(() => daysBetween('2024-01-15', 'invalid')).toThrow('Invalid date');
  });
});

describe('formatTime', () => {
  it('should format time in 24-hour format', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatTime(date);
    // The exact format may vary by locale/environment, but it should contain the time
    expect(result).toMatch(/14:30/);
  });

  it('should format morning time', () => {
    const date = new Date('2024-01-15T09:15:00Z');
    const result = formatTime(date);
    expect(result).toMatch(/09:15/);
  });

  it('should format midnight', () => {
    const date = new Date('2024-01-15T00:00:00Z');
    const result = formatTime(date);
    expect(result).toMatch(/00:00/);
  });

  it('should accept date strings', () => {
    const result = formatTime('2024-01-15T18:45:00Z');
    expect(result).toMatch(/18:45/);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => formatTime('not-a-date')).toThrow('Invalid date');
  });
});

describe('formatDateTime', () => {
  it('should format both date and time', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatDateTime(date);
    expect(result).toContain('Jan 15, 2024');
    expect(result).toContain('at');
    expect(result).toMatch(/14:30/);
  });

  it('should work with date strings', () => {
    const result = formatDateTime('2024-12-25T09:00:00Z');
    expect(result).toContain('Dec 25, 2024');
    expect(result).toContain('at');
    expect(result).toMatch(/09:00/);
  });

  it('should throw an error for invalid dates', () => {
    expect(() => formatDateTime('invalid')).toThrow('Invalid date');
  });
});
