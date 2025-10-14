import { useEffect, useRef, useCallback } from "react";
import { GameState, Difficulty, DIFFICULTY_SETTINGS } from "@/types/game";

interface UseGameTimerProps {
  gameState: GameState;
  onTimeUp: () => void;
  updateElapsedTime: (time: number) => void;
}

export const useGameTimer = ({ gameState, onTimeUp, updateElapsedTime }: UseGameTimerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getRemainingTime = useCallback((): number => {
    if (!gameState.difficulty) return 0;
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    return Math.max(0, settings.timeLimit - gameState.elapsedTime);
  }, [gameState.difficulty, gameState.elapsedTime]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (!gameState.startTime || !gameState.difficulty) return;

    clearTimer();
    
    intervalRef.current = setInterval(() => {
      const settings = DIFFICULTY_SETTINGS[gameState.difficulty!];
      const elapsed = Math.floor((Date.now() - gameState.startTime!) / 1000);
      const remaining = settings.timeLimit - elapsed;
      
      if (remaining <= 0) {
        updateElapsedTime(settings.timeLimit);
        clearTimer();
        onTimeUp();
      } else {
        updateElapsedTime(elapsed);
      }
    }, 1000);
  }, [gameState.startTime, gameState.difficulty, clearTimer, updateElapsedTime, onTimeUp]);

  // Start/stop timer based on game state
  useEffect(() => {
    if (gameState.startTime && !gameState.isGameOver && gameState.difficulty) {
      startTimer();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [gameState.startTime, gameState.isGameOver, gameState.difficulty, startTimer, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    formatTime,
    getRemainingTime,
    clearTimer,
  };
};