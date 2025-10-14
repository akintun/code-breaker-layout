/**
 * Utility functions for better type safety and error handling
 */

// Type assertion helper with runtime checking
export function assertType<T>(value: unknown, typeName: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${typeName}, but received ${value}`);
  }
}

// Safe array access
export function safeArrayAccess<T>(array: T[], index: number): T | undefined {
  if (index < 0 || index >= array.length) {
    return undefined;
  }
  return array[index];
}

// Type-safe object property access
export function safeObjectAccess<T, K extends keyof T>(obj: T, key: K): T[K] | undefined {
  if (obj == null) {
    return undefined;
  }
  return obj[key];
}

// Error wrapper for async operations
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(errorMessage ?? 'An error occurred:', error);
    return null;
  }
}

// Local storage helpers with type safety
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage "${key}":`, error);
    return false;
  }
}

// Debounce function with proper typing
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Type guard functions
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Game-specific type guards
export function isValidGuess(guess: unknown): guess is number[] {
  return isArray(guess) && 
         guess.length === 4 && 
         guess.every(isNumber) &&
         guess.every(n => n >= 0 && n <= 9);
}

export function isValidDifficulty(value: unknown): value is 'easy' | 'normal' | 'hard' | 'expert' {
  return isString(value) && ['easy', 'normal', 'hard', 'expert'].includes(value);
}