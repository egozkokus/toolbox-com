// src/lib/errorHandling.ts

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  details?: Record<string, unknown>;
  timestamp: Date;
  context?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: AppError[] = [];
  private errorListeners: ((error: AppError) => void)[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: AppError): void {
    this.errors.push(error);
    this.notifyListeners(error);
    
    // Log to console based on severity
    switch (error.severity) {
      case 'critical':
        console.error(`[CRITICAL] ${error.code}: ${error.message}`, error.details);
        break;
      case 'error':
        console.error(`[ERROR] ${error.code}: ${error.message}`, error.details);
        break;
      case 'warning':
        console.warn(`[WARNING] ${error.code}: ${error.message}`, error.details);
        break;
      case 'info':
        console.info(`[INFO] ${error.code}: ${error.message}`, error.details);
        break;
    }
  }

  addErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener);
  }

  removeErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => listener(error));
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Error codes for different tools
export const ERROR_CODES = {
  // Validation errors
  EMPTY_INPUT: 'EMPTY_INPUT',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_JSON: 'INVALID_JSON',
  INVALID_XML: 'INVALID_XML',
  INVALID_HTML: 'INVALID_HTML',
  INVALID_SQL: 'INVALID_SQL',
  INVALID_CSS: 'INVALID_CSS',
  INVALID_JS: 'INVALID_JS',
  
  // Processing errors
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  MINIFICATION_FAILED: 'MINIFICATION_FAILED',
  FORMATTING_FAILED: 'FORMATTING_FAILED',
  CONVERSION_FAILED: 'CONVERSION_FAILED',
  
  // File errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Security errors
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  UNSAFE_CONTENT: 'UNSAFE_CONTENT',
  
  // System errors
  BROWSER_NOT_SUPPORTED: 'BROWSER_NOT_SUPPORTED',
  CLIPBOARD_ACCESS_DENIED: 'CLIPBOARD_ACCESS_DENIED',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED'
} as const;

// Error messages in Hebrew
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.EMPTY_INPUT]: 'אנא הכנס קלט',
  [ERROR_CODES.INVALID_FORMAT]: 'פורמט לא תקין',
  [ERROR_CODES.INVALID_JSON]: 'JSON לא תקין - בדוק את התחביר',
  [ERROR_CODES.INVALID_XML]: 'XML לא תקין - בדוק את התגיות',
  [ERROR_CODES.INVALID_HTML]: 'HTML לא תקין',
  [ERROR_CODES.INVALID_SQL]: 'שאילתת SQL לא תקינה',
  [ERROR_CODES.INVALID_CSS]: 'קוד CSS לא תקין',
  [ERROR_CODES.INVALID_JS]: 'קוד JavaScript לא תקין',
  [ERROR_CODES.PROCESSING_FAILED]: 'שגיאה בעיבוד הנתונים',
  [ERROR_CODES.MINIFICATION_FAILED]: 'שגיאה בהקטנת הקוד',
  [ERROR_CODES.FORMATTING_FAILED]: 'שגיאה בעיצוב הקוד',
  [ERROR_CODES.CONVERSION_FAILED]: 'שגיאה בהמרת הקוד',
  [ERROR_CODES.FILE_TOO_LARGE]: 'הקובץ גדול מדי',
  [ERROR_CODES.FILE_READ_ERROR]: 'שגיאה בקריאת הקובץ',
  [ERROR_CODES.FILE_WRITE_ERROR]: 'שגיאה בשמירת הקובץ',
  [ERROR_CODES.UNSUPPORTED_FORMAT]: 'פורמט קובץ לא נתמך',
  [ERROR_CODES.NETWORK_ERROR]: 'שגיאת רשת',
  [ERROR_CODES.TIMEOUT_ERROR]: 'הפעולה לקחה יותר מדי זמן',
  [ERROR_CODES.SECURITY_VIOLATION]: 'הפרת אבטחה',
  [ERROR_CODES.UNSAFE_CONTENT]: 'תוכן לא בטוח זוהה',
  [ERROR_CODES.BROWSER_NOT_SUPPORTED]: 'הדפדפן אינו נתמך',
  [ERROR_CODES.CLIPBOARD_ACCESS_DENIED]: 'אין גישה ללוח',
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]: 'חריגה ממכסת האחסון'
};

// Helper function to create standardized errors
export function createError(
  code: string,
  customMessage?: string,
  severity: ErrorSeverity = 'error',
  details?: Record<string, unknown>,
  context?: string
): AppError {
  return {
    code,
    message: customMessage || ERROR_MESSAGES[code] || 'שגיאה לא ידועה',
    severity,
    details,
    timestamp: new Date(),
    context
  };
}

// Error boundary component props
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: Record<string, unknown>;
}