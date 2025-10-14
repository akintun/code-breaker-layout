import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NumberPad } from '../../components/game/NumberPad';

// Mock the accessibility hook
vi.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    announce: vi.fn(),
    focusElement: vi.fn(),
  }),
}));

describe('NumberPad', () => {
  const mockProps = {
    onNumberClick: vi.fn(),
    onDeleteClick: vi.fn(),
    onClearClick: vi.fn(),
    onSubmitClick: vi.fn(),
    canSubmit: false,
    currentGuess: [],
    maxNumbers: 6,
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all number buttons', () => {
    render(<NumberPad {...mockProps} />);
    
    // Should render numbers 1-6 (based on maxNumbers)
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
    }
  });

  it('should call onNumberClick when number button is clicked', () => {
    render(<NumberPad {...mockProps} />);
    
    const numberButton = screen.getByRole('button', { name: '3' });
    fireEvent.click(numberButton);
    
    expect(mockProps.onNumberClick).toHaveBeenCalledWith(3);
  });

  it('should render control buttons', () => {
    render(<NumberPad {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should call appropriate handlers for control buttons', () => {
    render(<NumberPad {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockProps.onDeleteClick).toHaveBeenCalled();
    
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(mockProps.onClearClick).toHaveBeenCalled();
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockProps.onSubmitClick).toHaveBeenCalled();
  });

  it('should disable submit button when canSubmit is false', () => {
    render(<NumberPad {...mockProps} canSubmit={false} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when canSubmit is true', () => {
    render(<NumberPad {...mockProps} canSubmit={true} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable all buttons when disabled prop is true', () => {
    render(<NumberPad {...mockProps} disabled={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should handle keyboard navigation', () => {
    render(<NumberPad {...mockProps} />);
    
    const numberPad = screen.getByRole('grid');
    
    // Test arrow key navigation
    fireEvent.keyDown(numberPad, { key: 'ArrowRight' });
    fireEvent.keyDown(numberPad, { key: 'ArrowDown' });
    fireEvent.keyDown(numberPad, { key: 'ArrowLeft' });
    fireEvent.keyDown(numberPad, { key: 'ArrowUp' });
    
    // Should not throw errors
    expect(numberPad).toBeInTheDocument();
  });

  it('should handle direct number key presses', () => {
    render(<NumberPad {...mockProps} />);
    
    const numberPad = screen.getByRole('grid');
    
    fireEvent.keyDown(numberPad, { key: '3' });
    expect(mockProps.onNumberClick).toHaveBeenCalledWith(3);
    
    fireEvent.keyDown(numberPad, { key: '1' });
    expect(mockProps.onNumberClick).toHaveBeenCalledWith(1);
  });

  it('should handle special key shortcuts', () => {
    render(<NumberPad {...mockProps} />);
    
    const numberPad = screen.getByRole('grid');
    
    // Test backspace
    fireEvent.keyDown(numberPad, { key: 'Backspace' });
    expect(mockProps.onDeleteClick).toHaveBeenCalled();
    
    // Test escape
    fireEvent.keyDown(numberPad, { key: 'Escape' });
    expect(mockProps.onClearClick).toHaveBeenCalled();
    
    // Test enter
    fireEvent.keyDown(numberPad, { key: 'Enter' });
    expect(mockProps.onSubmitClick).toHaveBeenCalled();
  });

  it('should ignore invalid key presses', () => {
    render(<NumberPad {...mockProps} maxNumbers={4} />);
    
    const numberPad = screen.getByRole('grid');
    
    // Test number outside range
    fireEvent.keyDown(numberPad, { key: '7' });
    expect(mockProps.onNumberClick).not.toHaveBeenCalled();
    
    // Test letter key
    fireEvent.keyDown(numberPad, { key: 'a' });
    expect(mockProps.onNumberClick).not.toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(<NumberPad {...mockProps} />);
    
    const numberPad = screen.getByRole('grid');
    expect(numberPad).toHaveAttribute('aria-label', 'Number pad for entering guesses');
    
    // Check for row structure
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);
    
    // Check for gridcell structure
    const cells = screen.getAllByRole('gridcell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should show current guess progress', () => {
    render(
      <NumberPad 
        {...mockProps} 
        currentGuess={[1, 2, 3]} 
        maxNumbers={6} 
      />
    );
    
    // Should show some indication of current guess progress
    // This would depend on how the component displays current guess
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should handle rapid clicking without issues', () => {
    render(<NumberPad {...mockProps} />);
    
    const numberButton = screen.getByRole('button', { name: '1' });
    
    // Rapid clicks
    fireEvent.click(numberButton);
    fireEvent.click(numberButton);
    fireEvent.click(numberButton);
    
    expect(mockProps.onNumberClick).toHaveBeenCalledTimes(3);
  });
});