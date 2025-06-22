// src/hooks/useErrorHandler.ts

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  ErrorHandler, 
  AppError, 
  ErrorSeverity, 
  createError,
  ERROR_CODES,
  ERROR_MESSAGES 
} from '@/lib/errorHandling';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  context?: string;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { showToast = true, context } = options;
  const [errors, setErrors] = useState<AppError[]>([]);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  const errorHandler = ErrorHandler.getInstance();

  useEffect(() => {
    const handleError = (error: AppError) => {
      setErrors(prev => [...prev, error]);
      setIsError(true);

      if (showToast) {
        toast({
          title: getToastTitle(error.severity),
          description: error.message,
          variant: getToastVariant(error.severity),
        });
      }
    };

    errorHandler.addErrorListener(handleError);
    return () => errorHandler.removeErrorListener(handleError);
  }, [showToast, toast, errorHandler]);

  const logError = useCallback((
    code: string,
    customMessage?: string,
    severity: ErrorSeverity = 'error',
    details?: Error | Record<string, unknown>
  ) => {
    const errorDetails = details instanceof Error 
      ? { message: details.message, stack: details.stack, name: details.name }
      : details;
    const error = createError(code, customMessage, severity, errorDetails, context);
    errorHandler.logError(error);
  }, [context, errorHandler]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsError(false);
  }, []);

  const handleAsyncError = useCallback(async <T,>(
    asyncFunction: () => Promise<T>,
    errorCode: string = ERROR_CODES.PROCESSING_FAILED
  ): Promise<T | null> => {
    try {
      return await asyncFunction();
    } catch (error) {
      logError(
        errorCode,
        error instanceof Error ? error.message : 'שגיאה לא ידועה',
        'error',
        error
      );
      return null;
    }
  }, [logError]);

  const validateAndHandle = useCallback(<T,>(
    value: T,
    validator: (value: T) => boolean,
    errorCode: string,
    customMessage?: string
  ): value is T => {
    if (!validator(value)) {
      logError(errorCode, customMessage, 'warning');
      return false;
    }
    return true;
  }, [logError]);

  return {
    errors,
    isError,
    logError,
    clearErrors,
    handleAsyncError,
    validateAndHandle
  };
};

// Helper functions
function getToastTitle(severity: ErrorSeverity): string {
  switch (severity) {
    case 'critical':
      return 'שגיאה קריטית';
    case 'error':
      return 'שגיאה';
    case 'warning':
      return 'אזהרה';
    case 'info':
      return 'הודעה';
    default:
      return 'שגיאה';
  }
}

function getToastVariant(severity: ErrorSeverity): 'default' | 'destructive' {
  return severity === 'error' || severity === 'critical' ? 'destructive' : 'default';
}