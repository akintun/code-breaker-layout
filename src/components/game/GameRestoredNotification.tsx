import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";

interface GameRestoredNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onContinue: () => void;
  onStartNew: () => void;
}

export const GameRestoredNotification = ({
  isVisible,
  onDismiss,
  onContinue,
  onStartNew,
}: GameRestoredNotificationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    }
  }, [isVisible]);

  const handleContinue = () => {
    setShow(false);
    onContinue();
    onDismiss();
  };

  const handleStartNew = () => {
    setShow(false);
    onStartNew();
    onDismiss();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg border shadow-lg max-w-md w-full">
        <Alert className="border-0">
          <Save className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Game Found!
                </h3>
                <p className="text-sm text-muted-foreground">
                  We found a saved game in progress. Would you like to continue where you left off or start a new game?
                </p>
              </div>
              
              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  onClick={handleContinue}
                  className="flex-1"
                  variant="default"
                >
                  Continue Game
                </Button>
                <Button
                  onClick={handleStartNew}
                  className="flex-1"
                  variant="outline"
                >
                  Start New
                </Button>
              </div>
              
              <Button
                onClick={onDismiss}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};