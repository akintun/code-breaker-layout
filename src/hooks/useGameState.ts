import { useState, useCallback } from "react";
import { GameState, Difficulty, DIFFICULTY_SETTINGS, GameFeedback } from "@/types/game";

const initialGameState: GameState = {
  secretCode: [],
  guesses: [],
  currentGuess: [],
  attemptsLeft: 10,
  maxAttempts: 10,
  difficulty: null,
  isGameOver: false,
  isWon: false,
  startTime: null,
  elapsedTime: 0,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const generateSecretCode = useCallback((allowDuplicates: boolean): number[] => {
    const code: number[] = [];
    while (code.length < 4) {
      const num = Math.floor(Math.random() * 10);
      if (allowDuplicates || !code.includes(num)) {
        code.push(num);
      }
    }
    return code;
  }, []);

  const calculateFeedback = useCallback((guess: number[], secret: number[]): GameFeedback => {
    let correct = 0;
    let partial = 0;
    const secretCopy = [...secret];
    const guessCopy = [...guess];

    // First pass: count correct positions
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        correct++;
        secretCopy[i] = -1;
        guessCopy[i] = -2;
      }
    }

    // Second pass: count correct numbers in wrong positions
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== -2) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          partial++;
          secretCopy[index] = -1;
        }
      }
    }

    return { correct, partial };
  }, []);

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const newGameState: GameState = {
      secretCode: generateSecretCode(settings.allowDuplicates),
      guesses: [],
      currentGuess: [],
      attemptsLeft: settings.maxAttempts,
      maxAttempts: settings.maxAttempts,
      difficulty,
      isGameOver: false,
      isWon: false,
      startTime: Date.now(),
      elapsedTime: 0,
    };
    setGameState(newGameState);
  }, [generateSecretCode]);

  const addNumberToGuess = useCallback((num: number) => {
    if (gameState.currentGuess.length < 4 && !gameState.isGameOver) {
      updateGameState({
        currentGuess: [...gameState.currentGuess, num],
      });
    }
  }, [gameState.currentGuess, gameState.isGameOver, updateGameState]);

  const removeLastNumber = useCallback(() => {
    if (gameState.currentGuess.length > 0) {
      updateGameState({
        currentGuess: gameState.currentGuess.slice(0, -1),
      });
    }
  }, [gameState.currentGuess, updateGameState]);

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== 4) return false;

    const feedback = calculateFeedback(gameState.currentGuess, gameState.secretCode);
    const newGuesses = [
      ...gameState.guesses,
      { guess: gameState.currentGuess, feedback },
    ];
    const isWon = feedback.correct === 4;
    const newAttemptsLeft = gameState.attemptsLeft - 1;
    const isGameOver = isWon || newAttemptsLeft === 0;

    updateGameState({
      guesses: newGuesses,
      currentGuess: [],
      attemptsLeft: newAttemptsLeft,
      isGameOver,
      isWon,
    });

    return isGameOver;
  }, [gameState, calculateFeedback, updateGameState]);

  return {
    gameState,
    updateGameState,
    resetGameState,
    startNewGame,
    addNumberToGuess,
    removeLastNumber,
    submitGuess,
    calculateFeedback,
  };
};