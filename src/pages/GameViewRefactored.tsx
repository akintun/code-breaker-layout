import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Game components
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { GameStatusBar } from "@/components/game/GameStatusBar";
import { GuessHistory } from "@/components/game/GuessHistory";
import { NumberPad } from "@/components/game/NumberPad";
import { TreasuryPool } from "@/components/game/TreasuryPool";
import { RecentActivities } from "@/components/game/RecentActivities";

// Modals
import { DifficultyModal } from "@/components/modals/DifficultyModal";
import { GameResultModal } from "@/components/modals/GameResultModal";

// Hooks
import { useGameLogic } from "@/hooks/useGameLogic";
import { Activity } from "@/types/game";

export default function GameView() {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [treasuryAmount] = useState(1247.5);
  
  const [recentActivities] = useState<Activity[]>([
    {
      id: "1",
      player: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      difficulty: "Hard",
      attempts: 7,
      time: 245,
      won: true,
      timestamp: new Date(),
    },
    {
      id: "2",
      player: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
      difficulty: "Normal",
      attempts: 10,
      time: 412,
      won: false,
      timestamp: new Date(),
    },
    {
      id: "3",
      player: "0x1aD91ee08f21bE3dE0BA2ba6918E714dA6B45836",
      difficulty: "Expert",
      attempts: 8,
      time: 189,
      won: true,
      timestamp: new Date(),
    },
  ]);

  const {
    gameState,
    handleNumberClick,
    handleDelete,
    handleSubmit,
    formatTime,
    getRemainingTime,
    canSubmitGuess,
    startNewGame,
  } = useGameLogic();

  // Handle game result modal display
  const handleGameEnd = (gameOver: boolean) => {
    if (gameOver) {
      setTimeout(() => setShowResultModal(true), 500);
    }
  };

  const handleSubmitGuess = () => {
    const gameOver = handleSubmit();
    handleGameEnd(gameOver);
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setShowDifficultyModal(true);
  };

  const handleStartNewGame = () => {
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = (difficulty: any) => {
    startNewGame(difficulty);
    setShowDifficultyModal(false);
  };

  // Show welcome screen if no difficulty selected
  if (!gameState.difficulty) {
    return (
      <>
        <WelcomeScreen 
          treasuryAmount={treasuryAmount}
          onStartGame={handleStartNewGame}
        />
        
        <DifficultyModal
          isOpen={showDifficultyModal}
          onClose={() => setShowDifficultyModal(false)}
          onSelect={handleDifficultySelect}
        />
      </>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      {/* Treasury Pool */}
      <div className="mb-6">
        <TreasuryPool amount={treasuryAmount} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Game Section */}
        <div className="space-y-4">
          {/* Game Status Bar */}
          <GameStatusBar
            attempts={gameState.guesses.length}
            maxAttempts={gameState.maxAttempts}
            remainingTime={getRemainingTime()}
            difficulty={gameState.difficulty}
            formatTime={formatTime}
          />

          {/* Guess History */}
          <GuessHistory
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            isGameOver={gameState.isGameOver}
          />

          {/* Number Pad */}
          {!gameState.isGameOver && (
            <NumberPad
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onSubmit={handleSubmitGuess}
              canSubmit={canSubmitGuess}
            />
          )}

          {/* Play Again Button (shown when game is over) */}
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
        </div>

        {/* Recent Activities Section */}
        <div className="space-y-4">
          <RecentActivities activities={recentActivities} />
        </div>
      </div>

      {/* Modals */}
      <DifficultyModal
        isOpen={showDifficultyModal}
        onClose={() => setShowDifficultyModal(false)}
        onSelect={handleDifficultySelect}
      />

      <GameResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        isWon={gameState.isWon}
        attempts={gameState.guesses.length}
        secretCode={gameState.secretCode}
        elapsedTime={gameState.elapsedTime}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}