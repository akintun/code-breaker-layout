export type Difficulty = "easy" | "normal" | "hard" | "expert";

export interface GameState {
  secretCode: number[];
  guesses: { guess: number[]; feedback: { correct: number; partial: number } }[];
  currentGuess: number[];
  attemptsLeft: number;
  maxAttempts: number;
  difficulty: Difficulty | null;
  isGameOver: boolean;
  isWon: boolean;
  startTime: number | null;
  elapsedTime: number;
}

export interface DifficultySettings {
  maxAttempts: number;
  allowDuplicates: boolean;
  timeLimit: number; // in seconds
}

export interface GameFeedback {
  correct: number;
  partial: number;
}

export interface GameGuess {
  guess: number[];
  feedback: GameFeedback;
}

export interface Activity {
  id: string;
  player: string;
  difficulty: string;
  attempts: number;
  time: number;
  won: boolean;
  timestamp: Date;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { maxAttempts: 12, allowDuplicates: true, timeLimit: 600 }, // 10 minutes
  normal: { maxAttempts: 10, allowDuplicates: true, timeLimit: 480 }, // 8 minutes
  hard: { maxAttempts: 8, allowDuplicates: false, timeLimit: 360 }, // 6 minutes
  expert: { maxAttempts: 6, allowDuplicates: false, timeLimit: 240 }, // 4 minutes
};