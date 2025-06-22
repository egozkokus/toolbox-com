// src/__mocks__/utils.ts

import { vi } from 'vitest';

// Mock commonly used utilities
export const mockDebounce = vi.fn((fn) => fn);
export const mockThrottle = vi.fn((fn) => fn);

vi.mock('lodash/debounce', () => ({
  default: mockDebounce,
}));

vi.mock('lodash/throttle', () => ({
  default: mockThrottle,
}));

// Mock file system utilities
export const mockReadFile = vi.fn();
export const mockWriteFile = vi.fn();

vi.mock('@/lib/fileUtils', () => ({
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  downloadFile: vi.fn((content: string, filename: string) => {
    const blob = new Blob([content]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }),
}));
