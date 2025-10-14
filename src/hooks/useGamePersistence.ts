import { useEffect, useCallback } from "react";
import { GameState } from "@/types/game";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/type-utils";

const STORAGE_KEY = "chainbreaker-game-state";
const STORAGE_VERSION = "1.0";

interface StoredGameState extends GameState {
  version: string;
  savedAt: number;
}

export const useGamePersistence = (
  gameState: GameState,
  setGameState: (state: GameState) => void
) => {
  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    if (gameState.difficulty && !gameState.isGameOver) {
      const stateToSave: StoredGameState = {
        ...gameState,
        version: STORAGE_VERSION,
        savedAt: Date.now(),
      };
      
      const success = saveToLocalStorage(STORAGE_KEY, stateToSave);
      if (success) {
        console.log("Game state saved successfully");
      } else {
        console.warn("Failed to save game state");
      }
    }
  }, [gameState]);

  // Load game state from localStorage
  const loadGameState = useCallback((): boolean => {
    try {
      const savedState = getFromLocalStorage<StoredGameState | null>(STORAGE_KEY, null);
      
      if (!savedState) {
        return false;
      }

      // Check version compatibility
      if (savedState.version !== STORAGE_VERSION) {
        console.log("Incompatible game state version, starting fresh");
        clearSavedState();
        return false;
      }

      // Check if saved state is not too old (max 24 hours)
      const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const age = Date.now() - savedState.savedAt;
      
      if (age > MAX_AGE) {
        console.log("Saved game state is too old, starting fresh");
        clearSavedState();
        return false;
      }

      // Validate the saved state
      if (!isValidGameState(savedState)) {
        console.log("Invalid saved game state, starting fresh");
        clearSavedState();
        return false;
      }

      // Remove persistence-specific properties
      const { version, savedAt, ...gameState } = savedState;
      
      // Restore the game state
      setGameState(gameState);
      return true;
      
    } catch (error) {
      console.error("Error loading game state:", error);
      clearSavedState();
      return false;
    }
  }, [setGameState]);

  // Clear saved state
  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Saved game state cleared");
    } catch (error) {
      console.error("Error clearing saved state:", error);
    }
  }, []);

  // Auto-save when game state changes
  useEffect(() => {
    // Don't save on initial load or when game is over
    if (gameState.difficulty && !gameState.isGameOver) {
      const timeoutId = setTimeout(() => {
        saveGameState();
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [gameState, saveGameState]);

  // Clear saved state when game ends
  useEffect(() => {
    if (gameState.isGameOver) {
      clearSavedState();
    }
  }, [gameState.isGameOver, clearSavedState]);

  return {
    saveGameState,
    loadGameState,
    clearSavedState,
  };
};

// Validate that a loaded state is actually a valid game state
function isValidGameState(state: any): state is GameState {
  return (
    state &&
    typeof state === "object" &&
    Array.isArray(state.secretCode) &&
    Array.isArray(state.guesses) &&
    Array.isArray(state.currentGuess) &&
    typeof state.attemptsLeft === "number" &&
    typeof state.maxAttempts === "number" &&
    (state.difficulty === null || typeof state.difficulty === "string") &&
    typeof state.isGameOver === "boolean" &&
    typeof state.isWon === "boolean" &&
    (state.startTime === null || typeof state.startTime === "number") &&
    typeof state.elapsedTime === "number" &&
    // Validate secret code format
    state.secretCode.length === 4 &&
    state.secretCode.every((n: any) => typeof n === "number" && n >= 0 && n <= 9) &&
    // Validate current guess format
    state.currentGuess.length <= 4 &&
    state.currentGuess.every((n: any) => typeof n === "number" && n >= 0 && n <= 9) &&
    // Validate guesses format
    state.guesses.every((guess: any) => 
      guess &&
      Array.isArray(guess.guess) &&
      guess.guess.length === 4 &&
      guess.guess.every((n: any) => typeof n === "number" && n >= 0 && n <= 9) &&
      guess.feedback &&
      typeof guess.feedback.correct === "number" &&
      typeof guess.feedback.partial === "number"
    )
  );
}