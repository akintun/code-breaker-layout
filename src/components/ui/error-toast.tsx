import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, AlertCircle, Info, XCircle } from "lucide-react";
import { useErrorHandler, AppError } from "@/contexts/ErrorContext";
import { useEffect, useState } from "react";

interface ErrorToastProps {
  error: AppError;
  autoDismiss?: boolean;
  dismissDelay?: number;
}

export const ErrorToast = ({ 
  error, 
  autoDismiss = true, 
  dismissDelay = 5000 
}: ErrorToastProps) => {
  const { dismissError } = useErrorHandler();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, dismissDelay);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissDelay]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      dismissError(error.id);
    }, 300); // Allow fade-out animation
  };

  const getErrorIcon = () => {
    switch (error.severity) {
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getErrorVariant = () => {
    switch (error.severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 w-full max-w-md
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        mobile-spacing
      `}
      role="alert"
      aria-live="assertive"
    >
      <Alert variant={getErrorVariant() as any} className="relative">
        {getErrorIcon()}
        <AlertTitle className="pr-8">
          {error.severity === 'critical' ? 'Critical Error' :
           error.severity === 'high' ? 'Error' :
           error.severity === 'medium' ? 'Warning' : 'Notice'}
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p>{error.message}</p>
          {error.userAction && (
            <p className="text-xs mt-1 opacity-75">
              Action: {error.userAction}
            </p>
          )}
          {process.env.NODE_ENV === 'development' && error.details && (
            <details className="mt-2 text-xs">
              <summary>Debug Info</summary>
              <pre className="mt-1 text-xs overflow-auto max-h-20 whitespace-pre-wrap">
                {error.details}
              </pre>
            </details>
          )}
        </AlertDescription>
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-transparent"
          onClick={handleDismiss}
          aria-label="Dismiss error"
        >
          <X className="h-3 w-3" />
        </Button>
      </Alert>
    </div>
  );
};

// Container for all error toasts
export const ErrorToastContainer = () => {
  const { errors } = useErrorHandler();

  return (
    <div className="pointer-events-none">
      {errors.map((error, index) => (
        <div
          key={error.id}
          style={{ 
            transform: `translateY(${index * 80}px)`,
            zIndex: 1000 - index 
          }}
        >
          <ErrorToast error={error} />
        </div>
      ))}
    </div>
  );
};