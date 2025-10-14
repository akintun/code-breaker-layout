import { Button } from "@/components/ui/button";
import { Delete, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useCallback, useRef } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  currentGuess: readonly number[];
}

export const NumberPad = ({
  onNumberClick,
  onDelete,
  onSubmit,
  canSubmit,
  currentGuess,
}: NumberPadProps) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const numberPadRef = useRef<HTMLDivElement>(null);
  const { announce, handleArrowKeys } = useAccessibility();

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    
    // Number key shortcuts
    if (/^[0-9]$/.test(key)) {
      const num = parseInt(key, 10);
      onNumberClick(num);
      announce(`Number ${num} added to guess`);
      e.preventDefault();
      return;
    }

    // Action shortcuts
    switch (key) {
      case 'Backspace':
      case 'Delete':
        if (currentGuess.length > 0) {
          onDelete();
          announce(`Last number removed. Current guess has ${currentGuess.length - 1} numbers`);
        }
        e.preventDefault();
        break;
      case 'Enter':
        if (canSubmit) {
          onSubmit();
          announce('Guess submitted');
        } else {
          announce('Please complete your 4-digit guess before submitting');
        }
        e.preventDefault();
        break;
      case 'Escape':
        // Clear current guess
        while (currentGuess.length > 0) {
          onDelete();
        }
        announce('Guess cleared');
        e.preventDefault();
        break;
    }
  }, [onNumberClick, onDelete, onSubmit, canSubmit, currentGuess, announce]);

  // Add global keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleNumberClick = useCallback((num: number) => {
    onNumberClick(num);
    announce(`Number ${num} added to guess. ${currentGuess.length + 1} of 4 numbers entered`);
  }, [onNumberClick, announce, currentGuess.length]);

  const handleDeleteClick = useCallback(() => {
    if (currentGuess.length > 0) {
      onDelete();
      announce(`Last number removed. ${currentGuess.length - 1} numbers remaining in guess`);
    } else {
      announce('No numbers to delete');
    }
  }, [onDelete, announce, currentGuess.length]);

  const handleSubmitClick = useCallback(() => {
    if (canSubmit) {
      onSubmit();
      announce('Guess submitted for evaluation');
    } else {
      announce(`Please enter ${4 - currentGuess.length} more numbers to complete your guess`);
    }
  }, [onSubmit, canSubmit, announce, currentGuess.length]);

  return (
    <div 
      ref={numberPadRef}
      className="space-y-3"
      role="group" 
      aria-label="Number pad for entering guesses"
    >
      {/* Keyboard shortcuts info */}
      <div className="sr-only" aria-live="polite">
        Use number keys 0-9 to enter numbers, Backspace to delete, Enter to submit, Escape to clear
      </div>

      {/* Number Grid */}
      <div 
        className="grid grid-cols-5 gap-2"
        role="group"
        aria-label="Number buttons 0 through 9"
      >
        {numbers.map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberClick(num)}
            variant="outline"
            className="h-14 text-base font-semibold hover:bg-primary/20 hover:border-primary transition-smooth touch-target"
            aria-label={`Add number ${num} to guess`}
            aria-keyshortcuts={num.toString()}
            tabIndex={0}
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div 
        className="grid grid-cols-2 gap-2"
        role="group"
        aria-label="Action buttons"
      >
        <Button
          onClick={handleDeleteClick}
          variant="destructive"
          className="h-12 touch-target"
          aria-label={`Delete last number ${currentGuess.length > 0 ? `(${currentGuess[currentGuess.length - 1]})` : ''}`}
          aria-keyshortcuts="Backspace"
          disabled={currentGuess.length === 0}
        >
          <Delete className="mr-2 h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
        <Button
          onClick={handleSubmitClick}
          disabled={!canSubmit}
          className={cn(
            "h-12 touch-target",
            canSubmit && "gradient-primary glow-primary"
          )}
          aria-label={`Submit guess ${canSubmit ? '' : `(${4 - currentGuess.length} more numbers needed)`}`}
          aria-keyshortcuts="Enter"
        >
          <Send className="mr-2 h-4 w-4" aria-hidden="true" />
          Submit
        </Button>
      </div>
    </div>
  );
};
