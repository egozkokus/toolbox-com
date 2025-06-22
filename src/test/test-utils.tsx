// src/test/test-utils.tsx

import type { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { AllTheProviders } from './providers';
import { vi } from 'vitest';

// Create a custom render function that includes all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  queryClient?: QueryClient;
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialRoute = '/', queryClient, ...renderOptions } = options || {};

  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export commonly used testing utilities
export {
  screen,
  waitFor,
  within,
  fireEvent,
  act,
  renderHook,
  cleanup,
} from '@testing-library/react';
export { customRender as render };

// Utility functions for common test scenarios
export const waitForLoadingToFinish = async () => {
  const { waitFor, screen } = await import('@testing-library/react');
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

export const mockClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const readText = vi.fn().mockResolvedValue('');
  
  Object.assign(navigator, {
    clipboard: {
      writeText,
      readText,
    },
  });
  
  return { writeText, readText };
};

export const mockFile = (content: string, type: string = 'text/plain') => {
  return new File([content], 'test-file.txt', { type });
};

export const mockBlob = (content: string, type: string = 'text/plain') => {
  return new Blob([content], { type });
};