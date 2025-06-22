// src/__mocks__/contexts.ts

import { vi } from 'vitest';

export const mockT = vi.fn((key: string) => key);
export const mockLanguage = 'he';
export const mockSetLanguage = vi.fn();

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: mockT,
    language: mockLanguage,
    setLanguage: mockSetLanguage,
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));
