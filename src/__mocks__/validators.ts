// src/__mocks__/validators.ts

import { vi } from 'vitest';
import { ValidationResult } from '@/lib/validators';

export const mockValidateJSON = vi.fn((): ValidationResult => ({ isValid: true }));
export const mockValidateXML = vi.fn((): ValidationResult => ({ isValid: true }));
export const mockValidateHTML = vi.fn((): ValidationResult => ({ isValid: true }));
export const mockValidateCSS = vi.fn((): ValidationResult => ({ isValid: true }));
export const mockValidateJavaScript = vi.fn((): ValidationResult => ({ isValid: true }));
export const mockValidateSQL = vi.fn((): ValidationResult => ({ isValid: true }));

vi.mock('@/lib/validators', () => ({
  CodeValidator: {
    validateNotEmpty: vi.fn(() => ({ isValid: true })),
    validateJSON: mockValidateJSON,
    validateXML: mockValidateXML,
    validateHTML: mockValidateHTML,
    validateCSS: mockValidateCSS,
    validateJavaScript: mockValidateJavaScript,
    validateSQL: mockValidateSQL,
    validateFileSize: vi.fn(() => ({ isValid: true })),
  },
}));