import { useCallback, useEffect } from "react";
import { useGameState } from "./useGameState";
import { useGameTimer } from "./useGameTimer";
import { useGamePersistence } from "./useGamePersistence";
import { Difficulty } from "@/types/game";

export const useGameLogic = () => {
  const {
    gameState,
    updateGameState,
    resetGameState,
    startNewGame,
    addNumberToGuess,
    removeLastNumber,
    submitGuess,
    canSubmitGuess,
    isGameActive,
  } = useGameState();

  const {
    loadGameState,
    clearSavedState,
  } = useGamePersistence(gameState, (state) => updateGameState(state));

  const handleTimeUp = useCallback(() => {
    updateGameState({
      isGameOver: true,
      isWon: false,
    });
  }, [updateGameState]);

  const updateElapsedTime = useCallback((time: number) => {
    updateGameState({ elapsedTime: time });
  }, [updateGameState]);

  const timer = useGameTimer({
    gameState,
    onTimeUp: handleTimeUp,
    updateElapsedTime,
  });

  const handleNumberClick = useCallback((num: number) => {
    addNumberToGuess(num);
  }, [addNumberToGuess]);

  const handleDelete = useCallback(() => {
    removeLastNumber();
  }, [removeLastNumber]);

  const handleSubmit = useCallback(() => {
    return submitGuess();
  }, [submitGuess]);

  const handlePlayAgain = useCallback((difficulty: Difficulty) => {
    clearSavedState(); // Clear any saved state when starting new game
    startNewGame(difficulty);
  }, [startNewGame, clearSavedState]);

  const handleResetGame = useCallback(() => {
    clearSavedState(); // Clear saved state when resetting
    resetGameState();
    timer.clearTimer();
  }, [resetGameState, timer, clearSavedState]);

  // Try to load saved game state on mount
  useEffect(() => {
    const wasLoaded = loadGameState();
    if (wasLoaded) {
      console.log("Restored saved game state");
    }
  }, [loadGameState]);

  return {
    // Game state
    gameState,
    
    // Game actions
    handleNumberClick,
    handleDelete,
    handleSubmit,
    handlePlayAgain,
    handleResetGame,
    startNewGame,
    
    // Timer utilities
    formatTime: timer.formatTime,
    getRemainingTime: timer.getRemainingTime,
    
    // Computed values
    canSubmitGuess,
    isGameActive,

    // Persistence utilities
    clearSavedState,
  };
};