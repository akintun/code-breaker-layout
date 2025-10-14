import { useState, useCallback, useMemo } from "react";
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

  // Memoize expensive calculations
  const canSubmitGuess = useMemo(() => {
    return gameState.currentGuess.length === 4 && !gameState.isGameOver;
  }, [gameState.currentGuess.length, gameState.isGameOver]);

  const isGameActive = useMemo(() => {
    return !gameState.isGameOver && gameState.difficulty !== null;
  }, [gameState.isGameOver, gameState.difficulty]);

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

  const calculateFeedback = useCallback((guess: readonly number[], secret: readonly number[]): GameFeedback => {
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
    setGameState(prev => {
      if (prev.currentGuess.length < 4 && !prev.isGameOver) {
        return {
          ...prev,
          currentGuess: [...prev.currentGuess, num],
        };
      }
      return prev;
    });
  }, []);

  const removeLastNumber = useCallback(() => {
    setGameState(prev => {
      if (prev.currentGuess.length > 0) {
        return {
          ...prev,
          currentGuess: prev.currentGuess.slice(0, -1),
        };
      }
      return prev;
    });
  }, []);

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== 4) return false;

    const feedback = calculateFeedback(gameState.currentGuess, gameState.secretCode);
    const newGuess = { guess: gameState.currentGuess, feedback };
    const newGuesses = [...gameState.guesses, newGuess];
    const isWon = feedback.correct === 4;
    const newAttemptsLeft = gameState.attemptsLeft - 1;
    const isGameOver = isWon || newAttemptsLeft === 0;

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: [],
      attemptsLeft: newAttemptsLeft,
      isGameOver,
      isWon,
    }));

    return isGameOver;
  }, [gameState.currentGuess, gameState.secretCode, gameState.guesses, gameState.attemptsLeft, calculateFeedback]);

  return {
    gameState,
    updateGameState,
    resetGameState,
    startNewGame,
    addNumberToGuess,
    removeLastNumber,
    submitGuess,
    calculateFeedback,
    // Memoized computed values
    canSubmitGuess,
    isGameActive,
  };
};