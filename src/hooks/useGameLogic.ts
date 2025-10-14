import { useCallback } from "react";
import { useGameState } from "./useGameState";
import { useGameTimer } from "./useGameTimer";
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
  } = useGameState();

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
    startNewGame(difficulty);
  }, [startNewGame]);

  const handleResetGame = useCallback(() => {
    resetGameState();
    timer.clearTimer();
  }, [resetGameState, timer]);

  const canSubmitGuess = gameState.currentGuess.length === 4;
  const isGameActive = !gameState.isGameOver && gameState.difficulty !== null;

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
  };
};