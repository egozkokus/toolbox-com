// src/test/helpers.ts

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Helper to wait for async operations with better error messages
export const waitForWithTimeout = async (
  callback: () => void | Promise<void>,
  options: { timeout?: number; interval?: number } = {}
) => {
  const { timeout = 5000, interval = 50 } = options;
  
  try {
    await waitFor(callback, { timeout, interval });
  } catch (error) {
    // Provide better error message with current DOM state
    console.error('Current DOM:', screen.debug());
    throw error;
  }
};

// Helper to test file downloads
export const expectFileDownload = (
  filename: string,
  content: string,
  mimeType: string
) => {
  const createObjectURL = vi.spyOn(URL, 'createObjectURL');
  const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL');
  const createElement = vi.spyOn(document, 'createElement');
  
  let anchorElement: HTMLAnchorElement | null = null;
  createElement.mockImplementation((tagName) => {
    const element = document.createElement(tagName);
    if (tagName === 'a') {
      anchorElement = element as HTMLAnchorElement;
      vi.spyOn(element, 'click');
    }
    return element;
  });
  
  return {
    verify: () => {
      expect(createObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mimeType,
        })
      );
      
      if (anchorElement) {
        expect(anchorElement.download).toBe(filename);
        expect(anchorElement.click).toHaveBeenCalled();
      }
      
      expect(revokeObjectURL).toHaveBeenCalled();
    },
    cleanup: () => {
      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
      createElement.mockRestore();
    },
  };
};

// Helper to test clipboard operations
export const expectClipboardWrite = async (expectedContent: string) => {
  const writeText = vi.spyOn(navigator.clipboard, 'writeText');
  
  return {
    verify: () => {
      expect(writeText).toHaveBeenCalledWith(expectedContent);
    },
    cleanup: () => {
      writeText.mockRestore();
    },
  };
};

// Helper to simulate user typing with realistic delays
export const typeWithDelay = async (
  element: HTMLElement,
  text: string,
  delay: number = 50
) => {
  const user = userEvent.setup({ delay });
  await user.type(element, text);
};

// Helper to test loading states
export const expectLoadingState = async (action: () => void | Promise<void>) => {
  let loadingElementFound = false;
  
  const checkLoading = () => {
    const loadingElements = screen.queryAllByText(/loading|טוען/i);
    const spinners = screen.queryAllByRole('progressbar');
    loadingElementFound = loadingElements.length > 0 || spinners.length > 0;
  };
  
  // Start checking for loading state
  const interval = setInterval(checkLoading, 10);
  
  // Perform the action
  await action();
  
  // Wait a bit more to ensure loading state was captured
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Clean up
  clearInterval(interval);
  
  return {
    wasLoading: () => expect(loadingElementFound).toBe(true),
    wasNotLoading: () => expect(loadingElementFound).toBe(false),
  };
};

// Helper to test form validation
export const testFormValidation = async (
  formElement: HTMLFormElement,
  invalidInputs: Record<string, string>,
  expectedErrors: string[]
) => {
  const user = userEvent.setup();
  
  // Fill form with invalid data
  for (const [name, value] of Object.entries(invalidInputs)) {
    const input = formElement.querySelector(`[name="${name}"]`);
    if (input) {
      await user.clear(input as HTMLElement);
      await user.type(input as HTMLElement, value);
    }
  }
  
  // Submit form
  const submitButton = formElement.querySelector('button[type="submit"]');
  if (submitButton) {
    await user.click(submitButton);
  }
  
  // Check for expected errors
  await waitFor(() => {
    expectedErrors.forEach(error => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });
};

// Helper to test accessibility
export const expectAccessible = (element: HTMLElement) => {
  // Check for basic accessibility attributes
  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  
  return {
    toHaveRole: (expectedRole: string) => {
      expect(role).toBe(expectedRole);
    },
    toHaveLabel: () => {
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
    },
    toHaveDescription: () => {
      expect(ariaDescribedBy).toBeTruthy();
    },
    toBeKeyboardAccessible: () => {
      const tabIndex = element.getAttribute('tabindex');
      expect(
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.tagName === 'SELECT' ||
        tabIndex === '0'
      ).toBe(true);
    },
  };
};

// Helper to test responsive behavior
export const testResponsive = async (
  breakpoints: { mobile?: number; tablet?: number; desktop?: number } = {
    mobile: 375,
    tablet: 768,
    desktop: 1440,
  }
) => {
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  
  const setViewport = (width: number, height: number = 800) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event('resize'));
  };
  
  return {
    mobile: () => setViewport(breakpoints.mobile || 375),
    tablet: () => setViewport(breakpoints.tablet || 768),
    desktop: () => setViewport(breakpoints.desktop || 1440),
    restore: () => setViewport(originalWidth, originalHeight),
  };
};

// Helper to test error boundaries
export const expectErrorBoundary = async (
  triggerError: () => void,
  expectedErrorMessage?: string
) => {
  // Temporarily suppress console.error
  const originalError = console.error;
  console.error = vi.fn();
  
  try {
    triggerError();
    
    await waitFor(() => {
      // Look for common error boundary UI elements
      const errorElements = screen.queryAllByText(/error|שגיאה|something went wrong|משהו השתבש/i);
      expect(errorElements.length).toBeGreaterThan(0);
      
      if (expectedErrorMessage) {
        expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
      }
    });
  } finally {
    console.error = originalError;
  }
};

// Helper to test network requests
export const mockFetch = (responses: Array<{ url: string | RegExp; response: any; status?: number }>) => {
  const fetchMock = vi.spyOn(global, 'fetch');
  
  fetchMock.mockImplementation(async (url: string | URL | Request) => {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    for (const mock of responses) {
      const matches = mock.url instanceof RegExp 
        ? mock.url.test(urlString)
        : urlString.includes(mock.url);
        
      if (matches) {
        return new Response(JSON.stringify(mock.response), {
          status: mock.status || 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new Response('Not found', { status: 404 });
  });
  
  return {
    expectCalled: (url: string | RegExp) => {
      const calls = fetchMock.mock.calls;
      const found = calls.some(([callUrl]) => {
        const urlString = typeof callUrl === 'string' ? callUrl : callUrl.toString();
        return url instanceof RegExp ? url.test(urlString) : urlString.includes(url);
      });
      expect(found).toBe(true);
    },
    restore: () => fetchMock.mockRestore(),
  };
};