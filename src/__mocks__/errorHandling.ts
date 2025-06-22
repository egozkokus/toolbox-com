// src/__mocks__/errorHandling.ts

import { vi } from 'vitest';

export const mockLogError = vi.fn();
export const mockHandleAsyncError = vi.fn().mockImplementation(async (fn) => {
  try {
    return await fn();
  } catch (error) {
    return null;
  }
});
export const mockValidateAndHandle = vi.fn().mockReturnValue(true);

vi.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    logError: mockLogError,
    handleAsyncError: mockHandleAsyncError,
    validateAndHandle: mockValidateAndHandle,
    errors: [],
    isError: false,
    clearErrors: vi.fn(),
  }),
}));
