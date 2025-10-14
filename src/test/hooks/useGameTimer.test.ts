import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGameTimer } from '../hooks/useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with zero time', () => {
    const { result } = renderHook(() => useGameTimer());
    
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.formattedTime).toBe('00:00');
    expect(result.current.isRunning).toBe(false);
  });

  it('should start timer and increment time', () => {
    const { result } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
    
    // Advance timer by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.elapsedTime).toBe(5);
    expect(result.current.formattedTime).toBe('00:05');
  });

  it('should pause timer', () => {
    const { result } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.elapsedTime).toBe(3);
    
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.isRunning).toBe(false);
    
    // Time should not advance when paused
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.elapsedTime).toBe(3);
  });

  it('should resume timer from paused state', () => {
    const { result } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    act(() => {
      result.current.pause();
    });
    
    act(() => {
      result.current.start(); // Resume
    });
    
    expect(result.current.isRunning).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.elapsedTime).toBe(5);
  });

  it('should stop and reset timer', () => {
    const { result } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.elapsedTime).toBe(5);
    
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.formattedTime).toBe('00:00');
  });

  it('should format time correctly for various durations', () => {
    const { result } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    // Test seconds
    act(() => {
      vi.advanceTimersByTime(30000); // 30 seconds
    });
    expect(result.current.formattedTime).toBe('00:30');
    
    // Test minutes
    act(() => {
      vi.advanceTimersByTime(90000); // Additional 90 seconds (total 2 minutes)
    });
    expect(result.current.formattedTime).toBe('02:00');
    
    // Test minutes and seconds
    act(() => {
      vi.advanceTimersByTime(45000); // Additional 45 seconds
    });
    expect(result.current.formattedTime).toBe('02:45');
  });

  it('should handle time limit with callback', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useGameTimer(60, onTimeUp)); // 60 second limit
    
    act(() => {
      result.current.start();
    });
    
    // Advance to just before time limit
    act(() => {
      vi.advanceTimersByTime(59000);
    });
    
    expect(onTimeUp).not.toHaveBeenCalled();
    expect(result.current.isRunning).toBe(true);
    
    // Cross the time limit
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(onTimeUp).toHaveBeenCalledTimes(1);
    expect(result.current.isRunning).toBe(false);
  });

  it('should not call onTimeUp multiple times', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useGameTimer(5, onTimeUp));
    
    act(() => {
      result.current.start();
    });
    
    // Advance well past the time limit
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    // Should only be called once despite exceeding time limit
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { result, unmount } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('should handle starting timer multiple times', () => {
    const { result } = renderHook(() => useGameTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // Start again - should not reset time
    act(() => {
      result.current.start();
    });
    
    expect(result.current.elapsedTime).toBe(2);
    expect(result.current.isRunning).toBe(true);
  });

  it('should handle pause when not running', () => {
    const { result } = renderHook(() => useGameTimer());
    
    // Should not throw error when pausing stopped timer
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.elapsedTime).toBe(0);
  });

  it('should reset timeUpCalled flag when restarting', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useGameTimer(2, onTimeUp));
    
    act(() => {
      result.current.start();
    });
    
    // Let timer expire
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(onTimeUp).toHaveBeenCalledTimes(1);
    
    // Stop and restart
    act(() => {
      result.current.stop();
      result.current.start();
    });
    
    // Let timer expire again
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(onTimeUp).toHaveBeenCalledTimes(2);
  });
});