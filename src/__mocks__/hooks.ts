// src/__mocks__/hooks.ts

import { vi } from 'vitest';

export const mockToast = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));