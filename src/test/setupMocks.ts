// src/test/setupMocks.ts

import { vi } from 'vitest';

// Import all mocks to ensure they're loaded
import '@/__mocks__/hooks';
import '@/__mocks__/errorHandling';
import '@/__mocks__/navigation';
import '@/__mocks__/contexts';
import '@/__mocks__/tanstack-query';
import '@/__mocks__/components';
import '@/__mocks__/window';
import '@/__mocks__/utils';
import '@/__mocks__/validators';

// Setup global test utilities
global.beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset localStorage
  localStorage.clear();
  
  // Reset sessionStorage
  sessionStorage.clear();
});

// Suppress console errors in tests unless explicitly testing them
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = vi.fn((...args) => {
    // Only log actual errors, not React warnings
    if (typeof args[0] === 'string' && 
        !args[0].includes('Warning:') &&
        !args[0].includes('act(')) {
      originalError(...args);
    }
  });
  
  console.warn = vi.fn((...args) => {
    // Suppress specific warnings
    if (typeof args[0] === 'string' && 
        !args[0].includes('componentWillReceiveProps')) {
      originalWarn(...args);
    }
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test helpers
global.createMockFile = (content: string, name: string = 'test.txt', type: string = 'text/plain') => {
  return new File([content], name, { type });
};

global.createMockBlob = (content: string, type: string = 'text/plain') => {
  return new Blob([content], { type });
};

global.waitForAsync = (ms: number = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Extend global type definitions
declare global {
  function createMockFile(content: string, name?: string, type?: string): File;
  function createMockBlob(content: string, type?: string): Blob;
  function waitForAsync(ms?: number): Promise<void>;
}