import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameState } from '../hooks/useGameState';
import { GameDifficulty } from '../types/game';

// Mock the storage utilities
vi.mock('../lib/storage-utils', () => ({
  StorageManager: {
    getInstance: () => ({
      saveGame: vi.fn(),
      loadGame: vi.fn(() => null),
      clearGame: vi.fn(),
    }),
  },
}));

describe('useGameState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.currentGuess).toEqual([]);
    expect(result.current.guesses).toEqual([]);
    expect(result.current.feedback).toEqual([]);
    expect(result.current.gameStatus).toBe('playing');
    expect(result.current.difficulty).toBe('medium');
    expect(result.current.maxGuesses).toBe(10);
    expect(result.current.codeLength).toBe(4);
    expect(result.current.secretCode).toHaveLength(4);
    expect(result.current.guessesRemaining).toBe(10);
    expect(result.current.isGameOver).toBe(false);
  });

  it('should add numbers to current guess', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
    });
    
    expect(result.current.currentGuess).toEqual([1, 2]);
  });

  it('should not add more numbers than code length', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
      result.current.addToGuess(3);
      result.current.addToGuess(4);
      result.current.addToGuess(5); // Should not be added
    });
    
    expect(result.current.currentGuess).toHaveLength(4);
    expect(result.current.currentGuess).toEqual([1, 2, 3, 4]);
  });

  it('should remove last number from current guess', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
      result.current.addToGuess(3);
    });
    
    expect(result.current.currentGuess).toEqual([1, 2, 3]);
    
    act(() => {
      result.current.removeFromGuess();
    });
    
    expect(result.current.currentGuess).toEqual([1, 2]);
  });

  it('should clear current guess', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
      result.current.clearGuess();
    });
    
    expect(result.current.currentGuess).toEqual([]);
  });

  it('should submit guess when complete', () => {
    const { result } = renderHook(() => useGameState());
    
    // Fill current guess
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
      result.current.addToGuess(3);
      result.current.addToGuess(4);
    });
    
    expect(result.current.canSubmitGuess).toBe(true);
    
    act(() => {
      result.current.submitGuess();
    });
    
    expect(result.current.guesses).toHaveLength(1);
    expect(result.current.feedback).toHaveLength(1);
    expect(result.current.currentGuess).toEqual([]);
    expect(result.current.guessesRemaining).toBe(9);
  });

  it('should not submit incomplete guess', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
    });
    
    expect(result.current.canSubmitGuess).toBe(false);
    
    act(() => {
      result.current.submitGuess();
    });
    
    expect(result.current.guesses).toHaveLength(0);
  });

  it('should calculate correct feedback for exact matches', () => {
    const { result } = renderHook(() => useGameState());
    
    // Mock the secret code for predictable testing
    act(() => {
      result.current.startNewGame('easy');
    });
    
    // Get the secret code and submit it as a guess
    const secretCode = result.current.secretCode;
    
    act(() => {
      secretCode.forEach(num => result.current.addToGuess(num));
      result.current.submitGuess();
    });
    
    const feedback = result.current.feedback[0];
    expect(feedback.correct).toBe(secretCode.length);
    expect(feedback.wrongPosition).toBe(0);
    expect(result.current.gameStatus).toBe('won');
  });

  it('should handle difficulty changes', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.startNewGame('easy');
    });
    
    expect(result.current.difficulty).toBe('easy');
    expect(result.current.maxGuesses).toBe(12);
    expect(result.current.codeLength).toBe(3);
    
    act(() => {
      result.current.startNewGame('hard');
    });
    
    expect(result.current.difficulty).toBe('hard');
    expect(result.current.maxGuesses).toBe(8);
    expect(result.current.codeLength).toBe(5);
  });

  it('should end game when max guesses reached', () => {
    const { result } = renderHook(() => useGameState());
    
    // Start with easy difficulty (12 guesses)
    act(() => {
      result.current.startNewGame('easy');
    });
    
    // Submit 12 wrong guesses
    for (let i = 0; i < 12; i++) {
      act(() => {
        result.current.addToGuess(1);
        result.current.addToGuess(1);
        result.current.addToGuess(1); // Easy mode has 3-digit code
        result.current.submitGuess();
      });
    }
    
    expect(result.current.gameStatus).toBe('lost');
    expect(result.current.isGameOver).toBe(true);
    expect(result.current.guessesRemaining).toBe(0);
  });

  it('should reset game state when starting new game', () => {
    const { result } = renderHook(() => useGameState());
    
    // Make some guesses first
    act(() => {
      result.current.addToGuess(1);
      result.current.addToGuess(2);
      result.current.addToGuess(3);
      result.current.addToGuess(4);
      result.current.submitGuess();
    });
    
    expect(result.current.guesses).toHaveLength(1);
    
    // Start new game
    act(() => {
      result.current.startNewGame('medium');
    });
    
    expect(result.current.guesses).toEqual([]);
    expect(result.current.feedback).toEqual([]);
    expect(result.current.currentGuess).toEqual([]);
    expect(result.current.gameStatus).toBe('playing');
    expect(result.current.guessesRemaining).toBe(10);
  });

  it('should generate secret code within valid range', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.startNewGame('hard'); // 1-8 range
    });
    
    const secretCode = result.current.secretCode;
    expect(secretCode).toHaveLength(5);
    secretCode.forEach(num => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(8);
    });
  });

  it('should calculate score correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.startNewGame('medium');
    });
    
    // Mock a winning scenario with few guesses
    const secretCode = result.current.secretCode;
    
    act(() => {
      // Submit one wrong guess first
      result.current.addToGuess(1);
      result.current.addToGuess(1);
      result.current.addToGuess(1);
      result.current.addToGuess(1);
      result.current.submitGuess();
      
      // Then submit the correct guess
      secretCode.forEach(num => result.current.addToGuess(num));
      result.current.submitGuess();
    });
    
    expect(result.current.gameStatus).toBe('won');
    expect(result.current.score).toBeGreaterThan(0);
  });
});