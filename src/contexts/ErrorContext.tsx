import { createContext, useContext, useCallback, useState, ReactNode } from "react";

export interface AppError {
  id: string;
  message: string;
  details?: string;
  code?: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
  userAction?: string;
}

interface ErrorContextType {
  errors: AppError[];
  reportError: (error: Error | string, context?: Record<string, unknown>) => void;
  dismissError: (id: string) => void;
  clearAllErrors: () => void;
  getErrorById: (id: string) => AppError | undefined;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
  onError?: (error: AppError) => void;
  maxErrors?: number;
}

export const ErrorProvider = ({ 
  children, 
  onError,
  maxErrors = 10 
}: ErrorProviderProps) => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const generateErrorId = useCallback(() => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getUserFriendlyMessage = useCallback((error: Error | string): string => {
    const message = typeof error === 'string' ? error : error.message;
    
    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'NetworkError': 'Network connection problem. Please check your internet connection.',
      'QuotaExceededError': 'Storage is full. Please clear some space and try again.',
      'TypeError': 'A technical error occurred. Please refresh the page.',
      'ReferenceError': 'A technical error occurred. Please refresh the page.',
      'SyntaxError': 'A technical error occurred. Please refresh the page.',
      'ChunkLoadError': 'Failed to load application resources. Please refresh the page.',
      'Loading CSS chunk': 'Failed to load styles. Please refresh the page.',
      'Loading chunk': 'Failed to load application. Please refresh the page.',
    };

    // Check for specific error patterns
    for (const [pattern, friendlyMessage] of Object.entries(errorMap)) {
      if (message.includes(pattern)) {
        return friendlyMessage;
      }
    }

    // Default user-friendly message
    return 'Something went wrong. Please try again or refresh the page.';
  }, []);

  const getErrorSeverity = useCallback((error: Error | string): AppError['severity'] => {
    const message = typeof error === 'string' ? error : error.message;
    
    if (message.includes('Network') || message.includes('fetch')) {
      return 'medium';
    }
    
    if (message.includes('QuotaExceeded') || message.includes('Storage')) {
      return 'high';
    }
    
    if (message.includes('ChunkLoad') || message.includes('Loading')) {
      return 'critical';
    }
    
    return 'low';
  }, []);

  const reportError = useCallback((
    error: Error | string, 
    context?: Record<string, unknown>
  ) => {
    const appError: AppError = {
      id: generateErrorId(),
      message: getUserFriendlyMessage(error),
      details: typeof error === 'string' ? error : error.stack,
      code: typeof error === 'object' ? error.name : 'UNKNOWN_ERROR',
      timestamp: Date.now(),
      severity: getErrorSeverity(error),
      context,
      userAction: context?.userAction as string,
    };

    setErrors(prev => {
      const newErrors = [appError, ...prev];
      // Keep only the most recent errors
      return newErrors.slice(0, maxErrors);
    });

    // Call external error handler if provided
    onError?.(appError);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', appError);
    }

    // Report to external services in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would typically send to Sentry, LogRocket, etc.
      try {
        // Example: window.gtag?.('event', 'exception', { description: appError.message });
      } catch (e) {
        console.warn('Failed to report error to external service:', e);
      }
    }
  }, [generateErrorId, getUserFriendlyMessage, getErrorSeverity, maxErrors, onError]);

  const dismissError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorById = useCallback((id: string) => {
    return errors.find(error => error.id === id);
  }, [errors]);

  const contextValue: ErrorContextType = {
    errors,
    reportError,
    dismissError,
    clearAllErrors,
    getErrorById,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

// Global error handler hook
export const useGlobalErrorHandler = () => {
  const { reportError } = useErrorHandler();

  // Handle unhandled promise rejections
  const handleUnhandledRejection = useCallback((event: PromiseRejectionEvent) => {
    reportError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { userAction: 'Unhandled promise rejection', url: window.location.href }
    );
  }, [reportError]);

  // Handle JavaScript errors
  const handleError = useCallback((event: ErrorEvent) => {
    reportError(
      new Error(event.message),
      { 
        userAction: 'JavaScript error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        url: window.location.href
      }
    );
  }, [reportError]);

  // Set up global error listeners
  const setupGlobalHandlers = useCallback(() => {
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [handleUnhandledRejection, handleError]);

  return { setupGlobalHandlers };
};