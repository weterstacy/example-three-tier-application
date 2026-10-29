# Date Helpers

Utility functions for formatting and manipulating dates in the application.

## Installation

The date helpers are included in the project and require no additional dependencies beyond the standard JavaScript Date API.

## Functions

### `formatDate(date: string | Date): string`

Formats a date to a human-readable format.

```typescript
formatDate(new Date('2024-01-15'));
// Returns: "Jan 15, 2024"
```

### `formatRelativeTime(date: string | Date): string`

Formats a date to a relative time string (e.g., "2 days ago", "just now").

```typescript
formatRelativeTime(new Date(Date.now() - 1000 * 60 * 5));
// Returns: "5 minutes ago"
```

### `formatISO(date: string | Date): string`

Formats a date to ISO 8601 format.

```typescript
formatISO(new Date('2024-01-15'));
// Returns: "2024-01-15T00:00:00.000Z"
```

### `isToday(date: string | Date): boolean`

Checks if a date is today.

```typescript
isToday(new Date());
// Returns: true
```

### `isPast(date: string | Date): boolean`

Checks if a date is in the past.

```typescript
isPast(new Date('2023-01-01'));
// Returns: true
```

### `isFuture(date: string | Date): boolean`

Checks if a date is in the future.

```typescript
isFuture(new Date('2025-01-01'));
// Returns: true
```

### `addDays(date: string | Date, days: number): Date`

Adds days to a date (can be negative to subtract).

```typescript
addDays(new Date('2024-01-15'), 5);
// Returns: Date object for 2024-01-20
```

### `daysBetween(date1: string | Date, date2: string | Date): number`

Gets the difference between two dates in days.

```typescript
daysBetween(new Date('2024-01-20'), new Date('2024-01-15'));
// Returns: 5
```

### `formatTime(date: string | Date): string`

Formats time in 24-hour format (HH:MM).

```typescript
formatTime(new Date('2024-01-15T14:30:00'));
// Returns: "14:30"
```

### `formatDateTime(date: string | Date): string`

Formats date and time together.

```typescript
formatDateTime(new Date('2024-01-15T14:30:00'));
// Returns: "Jan 15, 2024 at 14:30"
```

## Error Handling

All functions validate input dates and throw an `Error` with the message "Invalid date" if the input cannot be parsed as a valid date.

```typescript
try {
  formatDate('invalid-date');
} catch (error) {
  console.error(error.message); // "Invalid date"
}
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

The date helpers have 100% test coverage across all statements, branches, functions, and lines.
