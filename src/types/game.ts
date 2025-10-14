export type Difficulty = "easy" | "normal" | "hard" | "expert";

export interface GameState {
  secretCode: readonly number[];
  guesses: readonly GameGuess[];
  currentGuess: readonly number[];
  attemptsLeft: number;
  maxAttempts: number;
  difficulty: Difficulty | null;
  isGameOver: boolean;
  isWon: boolean;
  startTime: number | null;
  elapsedTime: number;
}

export interface DifficultySettings {
  readonly maxAttempts: number;
  readonly allowDuplicates: boolean;
  readonly timeLimit: number; // in seconds
}

export interface GameFeedback {
  readonly correct: number;
  readonly partial: number;
}

export interface GameGuess {
  readonly guess: readonly number[];
  readonly feedback: GameFeedback;
}

export interface Activity {
  readonly id: string;
  readonly player: string;
  readonly difficulty: string;
  readonly attempts: number;
  readonly time: number;
  readonly won: boolean;
  readonly timestamp: Date;
}

// Game constraints as const assertions for better type safety
export const GAME_CONSTRAINTS = {
  CODE_LENGTH: 4,
  MIN_DIGIT: 0,
  MAX_DIGIT: 9,
  MAX_TIME_WARNING_THRESHOLD: 60, // seconds
} as const;

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { maxAttempts: 12, allowDuplicates: true, timeLimit: 600 }, // 10 minutes
  normal: { maxAttempts: 10, allowDuplicates: true, timeLimit: 480 }, // 8 minutes
  hard: { maxAttempts: 8, allowDuplicates: false, timeLimit: 360 }, // 6 minutes
  expert: { maxAttempts: 6, allowDuplicates: false, timeLimit: 240 }, // 4 minutes
} as const;

// Type for game actions
export type GameAction = 
  | { type: 'START_GAME'; payload: { difficulty: Difficulty; secretCode: readonly number[] } }
  | { type: 'ADD_NUMBER'; payload: number }
  | { type: 'REMOVE_NUMBER' }
  | { type: 'SUBMIT_GUESS'; payload: GameGuess }
  | { type: 'END_GAME'; payload: { isWon: boolean } }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'RESET_GAME' };

// Error types for better error handling
export class GameError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export const GAME_ERROR_CODES = {
  INVALID_GUESS: 'INVALID_GUESS',
  GAME_OVER: 'GAME_OVER',
  INVALID_DIFFICULTY: 'INVALID_DIFFICULTY',
  TIMER_ERROR: 'TIMER_ERROR',
} as const;