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

describe('dateHelpers', () => {
  describe('formatDate', () => {
    it('should format a Date object to a readable string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('Jan 15, 2024');
    });

    it('should format a date string to a readable string', () => {
      const formatted = formatDate('2024-03-20T15:45:00Z');
      expect(formatted).toBe('Mar 20, 2024');
    });

    it('should throw an error for invalid date', () => {
      expect(() => formatDate('invalid')).toThrow('Invalid date');
    });

    it('should handle dates at the start of the year', () => {
      const formatted = formatDate('2024-01-01T00:00:00Z');
      expect(formatted).toBe('Jan 1, 2024');
    });

    it('should handle dates at the end of the year', () => {
      const formatted = formatDate('2024-12-31T23:59:59Z');
      expect(formatted).toBe('Dec 31, 2024');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock the current time to Jan 15, 2024 12:00:00 UTC
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "just now" for very recent dates (< 30 seconds)', () => {
      const date = new Date('2024-01-15T11:59:50Z');
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('should return seconds ago for dates < 1 minute', () => {
      const date = new Date('2024-01-15T11:59:30Z');
      expect(formatRelativeTime(date)).toBe('30 seconds ago');
    });

    it('should return "1 minute ago" for exactly 1 minute', () => {
      const date = new Date('2024-01-15T11:59:00Z');
      expect(formatRelativeTime(date)).toBe('1 minute ago');
    });

    it('should return minutes ago for dates < 1 hour', () => {
      const date = new Date('2024-01-15T11:45:00Z');
      expect(formatRelativeTime(date)).toBe('15 minutes ago');
    });

    it('should return "1 hour ago" for exactly 1 hour', () => {
      const date = new Date('2024-01-15T11:00:00Z');
      expect(formatRelativeTime(date)).toBe('1 hour ago');
    });

    it('should return hours ago for dates < 24 hours', () => {
      const date = new Date('2024-01-15T08:00:00Z');
      expect(formatRelativeTime(date)).toBe('4 hours ago');
    });

    it('should return "1 day ago" for exactly 1 day', () => {
      const date = new Date('2024-01-14T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('1 day ago');
    });

    it('should return days ago for dates < 30 days', () => {
      const date = new Date('2024-01-10T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('5 days ago');
    });

    it('should return "1 month ago" for approximately 1 month', () => {
      const date = new Date('2023-12-15T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('1 month ago');
    });

    it('should return months ago for dates < 12 months', () => {
      const date = new Date('2023-10-15T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('3 months ago');
    });

    it('should return "1 year ago" for approximately 1 year', () => {
      const date = new Date('2023-01-15T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('1 year ago');
    });

    it('should return years ago for dates >= 2 years', () => {
      const date = new Date('2022-01-15T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('2 years ago');
    });

    it('should throw an error for invalid date', () => {
      expect(() => formatRelativeTime('invalid')).toThrow('Invalid date');
    });
  });

  describe('formatISO', () => {
    it('should format a Date object to ISO 8601 format', () => {
      const date = new Date('2024-01-15T10:30:45.123Z');
      const formatted = formatISO(date);
      expect(formatted).toBe('2024-01-15T10:30:45.123Z');
    });

    it('should format a date string to ISO 8601 format', () => {
      const formatted = formatISO('2024-03-20T15:45:30Z');
      expect(formatted).toBe('2024-03-20T15:45:30.000Z');
    });

    it('should throw an error for invalid date', () => {
      expect(() => formatISO('invalid')).toThrow('Invalid date');
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      // Mock the current time to Jan 15, 2024 12:00:00 UTC
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for today\'s date', () => {
      const today = new Date('2024-01-15T08:30:00Z');
      expect(isToday(today)).toBe(true);
    });

    it('should return true for today at different times', () => {
      const morning = new Date('2024-01-15T00:00:00Z');
      const evening = new Date('2024-01-15T23:59:59Z');
      expect(isToday(morning)).toBe(true);
      expect(isToday(evening)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date('2024-01-14T12:00:00Z');
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date('2024-01-16T12:00:00Z');
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should throw an error for invalid date', () => {
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
      const pastDate = new Date('2024-01-14T12:00:00Z');
      expect(isPast(pastDate)).toBe(true);
    });

    it('should return true for dates just a second ago', () => {
      const pastDate = new Date('2024-01-15T11:59:59Z');
      expect(isPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2024-01-16T12:00:00Z');
      expect(isPast(futureDate)).toBe(false);
    });

    it('should throw an error for invalid date', () => {
      expect(() => isPast('invalid')).toThrow('Invalid date');
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
      const futureDate = new Date('2024-01-16T12:00:00Z');
      expect(isFuture(futureDate)).toBe(true);
    });

    it('should return true for dates just a second in the future', () => {
      const futureDate = new Date('2024-01-15T12:00:01Z');
      expect(isFuture(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2024-01-14T12:00:00Z');
      expect(isFuture(pastDate)).toBe(false);
    });

    it('should throw an error for invalid date', () => {
      expect(() => isFuture('invalid')).toThrow('Invalid date');
    });
  });

  describe('addDays', () => {
    it('should add positive days to a date', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = addDays(date, 5);
      expect(result.toISOString()).toBe('2024-01-20T12:00:00.000Z');
    });

    it('should subtract days when given negative value', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = addDays(date, -5);
      expect(result.toISOString()).toBe('2024-01-10T12:00:00.000Z');
    });

    it('should handle adding zero days', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = addDays(date, 0);
      expect(result.toISOString()).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should handle month boundaries', () => {
      const date = new Date('2024-01-30T12:00:00Z');
      const result = addDays(date, 5);
      expect(result.toISOString()).toBe('2024-02-04T12:00:00.000Z');
    });

    it('should handle year boundaries', () => {
      const date = new Date('2023-12-30T12:00:00Z');
      const result = addDays(date, 5);
      expect(result.toISOString()).toBe('2024-01-04T12:00:00.000Z');
    });

    it('should accept date strings', () => {
      const result = addDays('2024-01-15T12:00:00Z', 3);
      expect(result.toISOString()).toBe('2024-01-18T12:00:00.000Z');
    });

    it('should throw an error for invalid date', () => {
      expect(() => addDays('invalid', 5)).toThrow('Invalid date');
    });
  });

  describe('daysBetween', () => {
    it('should return positive days when date1 is after date2', () => {
      const date1 = new Date('2024-01-20T12:00:00Z');
      const date2 = new Date('2024-01-15T12:00:00Z');
      expect(daysBetween(date1, date2)).toBe(5);
    });

    it('should return negative days when date1 is before date2', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-20T12:00:00Z');
      expect(daysBetween(date1, date2)).toBe(-5);
    });

    it('should return 0 for the same date', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-15T18:00:00Z');
      expect(daysBetween(date1, date2)).toBe(0);
    });

    it('should handle date strings', () => {
      const days = daysBetween('2024-01-20T00:00:00Z', '2024-01-15T00:00:00Z');
      expect(days).toBe(5);
    });

    it('should handle month boundaries', () => {
      const date1 = new Date('2024-02-05T12:00:00Z');
      const date2 = new Date('2024-01-25T12:00:00Z');
      expect(daysBetween(date1, date2)).toBe(11);
    });

    it('should handle year boundaries', () => {
      const date1 = new Date('2024-01-05T12:00:00Z');
      const date2 = new Date('2023-12-25T12:00:00Z');
      expect(daysBetween(date1, date2)).toBe(11);
    });

    it('should throw an error for invalid first date', () => {
      expect(() => daysBetween('invalid', '2024-01-15T12:00:00Z')).toThrow('Invalid date');
    });

    it('should throw an error for invalid second date', () => {
      expect(() => daysBetween('2024-01-15T12:00:00Z', 'invalid')).toThrow('Invalid date');
    });
  });

  describe('formatTime', () => {
    it('should format time in 24-hour format', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/14:30/);
    });

    it('should format midnight correctly', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/00:00/);
    });

    it('should format time with single digit hours and minutes with leading zeros', () => {
      const date = new Date('2024-01-15T09:05:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/09:05/);
    });

    it('should accept date strings', () => {
      const formatted = formatTime('2024-01-15T16:45:00Z');
      expect(formatted).toMatch(/16:45/);
    });

    it('should throw an error for invalid date', () => {
      expect(() => formatTime('invalid')).toThrow('Invalid date');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('Jan 15, 2024');
      expect(formatted).toContain('at');
      expect(formatted).toMatch(/14:30/);
    });

    it('should handle different dates correctly', () => {
      const date = new Date('2024-03-20T09:15:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('Mar 20, 2024');
      expect(formatted).toMatch(/09:15/);
    });

    it('should accept date strings', () => {
      const formatted = formatDateTime('2024-12-31T23:59:00Z');
      expect(formatted).toContain('Dec 31, 2024');
      expect(formatted).toMatch(/23:59/);
    });

    it('should throw an error for invalid date', () => {
      expect(() => formatDateTime('invalid')).toThrow('Invalid date');
    });
  });

  describe('edge cases and special scenarios', () => {
    it('should handle leap year dates', () => {
      const leapDay = new Date('2024-02-29T12:00:00Z');
      expect(formatDate(leapDay)).toBe('Feb 29, 2024');
    });

    it('should handle daylight saving time transitions', () => {
      const beforeDST = new Date('2024-03-10T01:00:00Z');
      const afterDST = new Date('2024-03-10T03:00:00Z');
      const days = daysBetween(afterDST, beforeDST);
      expect(days).toBe(0);
    });

    it('should handle dates far in the past', () => {
      const oldDate = new Date('1900-01-01T00:00:00Z');
      expect(formatDate(oldDate)).toBe('Jan 1, 1900');
    });

    it('should handle dates far in the future', () => {
      const futureDate = new Date('2100-12-31T23:59:59Z');
      expect(formatDate(futureDate)).toBe('Dec 31, 2100');
    });
  });
});
