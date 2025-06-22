// src/__mocks__/tanstack-query.ts

import { vi } from 'vitest';

export const mockUseQuery = vi.fn();
export const mockUseMutation = vi.fn();
export const mockUseQueryClient = vi.fn();

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
    useQueryClient: mockUseQueryClient,
  };
});
