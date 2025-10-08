import { useState } from "react";
import { GuessRow } from "@/components/game/GuessRow";
import { NumberPad } from "@/components/game/NumberPad";
import { Button } from "@/components/ui/button";
import { DifficultyModal } from "@/components/modals/DifficultyModal";
import { GameResultModal } from "@/components/modals/GameResultModal";
import { Play } from "lucide-react";

type Difficulty = "easy" | "normal" | "hard" | "expert";

interface GameState {
  secretCode: number[];
  guesses: { guess: number[]; feedback: { correct: number; partial: number } }[];
  currentGuess: number[];
  attemptsLeft: number;
  maxAttempts: number;
  difficulty: Difficulty | null;
  isGameOver: boolean;
  isWon: boolean;
}

const DIFFICULTY_SETTINGS = {
  easy: { maxAttempts: 12, allowDuplicates: true },
  normal: { maxAttempts: 10, allowDuplicates: true },
  hard: { maxAttempts: 8, allowDuplicates: false },
  expert: { maxAttempts: 6, allowDuplicates: false },
};

export default function GameView() {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    secretCode: [],
    guesses: [],
    currentGuess: [],
    attemptsLeft: 10,
    maxAttempts: 10,
    difficulty: null,
    isGameOver: false,
    isWon: false,
  });

  const generateSecretCode = (allowDuplicates: boolean): number[] => {
    const code: number[] = [];
    while (code.length < 4) {
      const num = Math.floor(Math.random() * 10);
      if (allowDuplicates || !code.includes(num)) {
        code.push(num);
      }
    }
    return code;
  };

  const startNewGame = (difficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    setGameState({
      secretCode: generateSecretCode(settings.allowDuplicates),
      guesses: [],
      currentGuess: [],
      attemptsLeft: settings.maxAttempts,
      maxAttempts: settings.maxAttempts,
      difficulty,
      isGameOver: false,
      isWon: false,
    });
    setShowDifficultyModal(false);
  };

  const calculateFeedback = (guess: number[], secret: number[]) => {
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
  };

  const handleNumberClick = (num: number) => {
    if (gameState.currentGuess.length < 4 && !gameState.isGameOver) {
      setGameState({
        ...gameState,
        currentGuess: [...gameState.currentGuess, num],
      });
    }
  };

  const handleDelete = () => {
    if (gameState.currentGuess.length > 0) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1),
      });
    }
  };

  const handleSubmit = () => {
    if (gameState.currentGuess.length === 4) {
      const feedback = calculateFeedback(gameState.currentGuess, gameState.secretCode);
      const newGuesses = [
        ...gameState.guesses,
        { guess: gameState.currentGuess, feedback },
      ];
      const isWon = feedback.correct === 4;
      const newAttemptsLeft = gameState.attemptsLeft - 1;
      const isGameOver = isWon || newAttemptsLeft === 0;

      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: [],
        attemptsLeft: newAttemptsLeft,
        isGameOver,
        isWon,
      });

      if (isGameOver) {
        setTimeout(() => setShowResultModal(true), 500);
      }
    }
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setShowDifficultyModal(true);
  };

  if (!gameState.difficulty) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChainBreaker
            </h1>
            <p className="text-muted-foreground">
              Crack the code. Prove your skills on-chain.
            </p>
          </div>

          <Button
            onClick={() => setShowDifficultyModal(true)}
            size="lg"
            className="gradient-primary glow-primary w-full h-14 text-lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Start New Game
          </Button>
        </div>

        <DifficultyModal
          isOpen={showDifficultyModal}
          onClose={() => setShowDifficultyModal(false)}
          onSelect={startNewGame}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Game Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
        <div className="text-sm">
          <span className="text-muted-foreground">Tries: </span>
          <span className="font-bold text-primary">
            {gameState.guesses.length}/{gameState.maxAttempts}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Mode: </span>
          <span className="font-bold text-secondary capitalize">
            {gameState.difficulty}
          </span>
        </div>
      </div>

      {/* Guess History */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">History</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {gameState.guesses.map((item, index) => (
            <GuessRow
              key={index}
              guess={item.guess}
              feedback={item.feedback}
            />
          ))}
        </div>
      </div>

      {/* Active Guess Row */}
      {!gameState.isGameOver && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Current Guess
          </h2>
          <GuessRow guess={gameState.currentGuess} isActive />
        </div>
      )}

      {/* Number Pad */}
      {!gameState.isGameOver && (
        <NumberPad
          onNumberClick={handleNumberClick}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          canSubmit={gameState.currentGuess.length === 4}
        />
      )}

      {/* New Game Button (shown when game is over) */}
      {gameState.isGameOver && (
        <Button
          onClick={handlePlayAgain}
          size="lg"
          className="gradient-primary glow-primary w-full h-14"
        >
          <Play className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      )}

      {/* Modals */}
      <DifficultyModal
        isOpen={showDifficultyModal}
        onClose={() => setShowDifficultyModal(false)}
        onSelect={startNewGame}
      />

      <GameResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        isWon={gameState.isWon}
        attempts={gameState.guesses.length}
        secretCode={gameState.secretCode}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
