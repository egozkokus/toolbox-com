// src/components/SafeExecutionWrapper.tsx

import * as React from 'react';
import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface SafeExecutionWrapperProps {
  children: ReactNode;
  context: string;
  showErrors?: boolean;
  fallback?: ReactNode;
}

const SafeExecutionWrapper: React.FC<SafeExecutionWrapperProps> = ({
  children,
  context,
  showErrors = true,
  fallback
}) => {
  const { errors, isError, clearErrors } = useErrorHandler({ context, showToast: false });

  if (isError && showErrors) {
    return (
      <div className="space-y-4">
        {errors.map((error, index) => (
          <Alert
            key={`${error.code}-${index}`}
            variant={error.severity === 'error' || error.severity === 'critical' ? 'destructive' : 'default'}
          >
            {error.severity === 'error' || error.severity === 'critical' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <AlertTitle>{error.code}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ))}
        {fallback || children}
      </div>
    );
  }

  return <>{children}</>;
};

export default SafeExecutionWrapper;