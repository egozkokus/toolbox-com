// src/test/matchers.ts

import { expect, Mock } from 'vitest';

interface ToastArgs {
  title: string;
  description?: string;
}

// Custom matchers for better testing experience

interface CustomMatchers<R = unknown> {
  toBeValidJSON(): R;
  toBeValidXML(): R;
  toBeValidHTML(): R;
  toBeValidCSS(): R;
  toBeValidSQL(): R;
  toBeMinified(): R;
  toBeFormatted(): R;
  toHaveSizeReduction(minPercentage: number): R;
  toCompleteWithin(ms: number): Promise<R>;
  toHaveBeenCalledWithToast(title: string, description?: string): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeValidJSON(received: string) {
    try {
      JSON.parse(received);
      return {
        pass: true,
        message: () => `expected ${received} not to be valid JSON`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `expected ${received} to be valid JSON, but parsing failed: ${error}`,
      };
    }
  },

  toBeValidXML(received: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(received, 'text/xml');
    const parseError = doc.querySelector('parsererror');
    
    if (parseError) {
      return {
        pass: false,
        message: () => `expected valid XML but got parsing error: ${parseError.textContent}`,
      };
    }
    
    return {
      pass: true,
      message: () => `expected invalid XML`,
    };
  },

  toBeValidHTML(received: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(received, 'text/html');
    
    // Check for basic HTML structure
    const hasHtml = doc.querySelector('html') !== null;
    const hasBody = doc.querySelector('body') !== null;
    
    if (!hasHtml || !hasBody) {
      return {
        pass: false,
        message: () => `expected valid HTML with <html> and <body> tags`,
      };
    }
    
    return {
      pass: true,
      message: () => `expected invalid HTML`,
    };
  },

  toBeValidCSS(received: string) {
    // Basic CSS validation - check for balanced braces and basic syntax
    const openBraces = (received.match(/{/g) || []).length;
    const closeBraces = (received.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      return {
        pass: false,
        message: () => `expected valid CSS but found unbalanced braces: ${openBraces} open, ${closeBraces} close`,
      };
    }
    
    // Check for basic CSS pattern
    const cssPattern = /[a-zA-Z-#.[\]:]+\s*{[^}]*}/;
    const cleanCSS = received.replace(/\/\*[\s\S]*?\*\//g, '');
    
    if (!cssPattern.test(cleanCSS)) {
      return {
        pass: false,
        message: () => `expected valid CSS syntax`,
      };
    }
    
    return {
      pass: true,
      message: () => `expected invalid CSS`,
    };
  },

  toBeValidSQL(received: string) {
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
    const upperReceived = received.toUpperCase();
    const hasKeyword = sqlKeywords.some(keyword => upperReceived.includes(keyword));
    
    if (!hasKeyword) {
      return {
        pass: false,
        message: () => `expected valid SQL with at least one keyword: ${sqlKeywords.join(', ')}`,
      };
    }
    
    return {
      pass: true,
      message: () => `expected invalid SQL`,
    };
  },

  toBeMinified(received: string) {
    // Check if string appears to be minified (no unnecessary whitespace)
    const hasMultipleSpaces = /\s{2,}/.test(received);
    const hasNewlines = /\n/.test(received);
    const hasIndentation = /^\s+/m.test(received);
    
    if (hasMultipleSpaces || hasNewlines || hasIndentation) {
      return {
        pass: false,
        message: () => `expected minified code but found unnecessary whitespace`,
      };
    }
    
    return {
      pass: true,
      message: () => `expected non-minified code`,
    };
  },

  toBeFormatted(received: string) {
    // Check if string appears to be formatted (has proper indentation and line breaks)
    const hasNewlines = /\n/.test(received);
    const hasIndentation = /^\s+/m.test(received);
    
    if (!hasNewlines || !hasIndentation) {
      return {
        pass: false,
        message: () => `expected formatted code with line breaks and indentation`,
      };
    }
    
    return {
      pass: true,
      message: () => `expected unformatted code`,
    };
  },

  toHaveSizeReduction(received: { original: string; minified: string }, minPercentage: number) {
    const originalSize = new Blob([received.original]).size;
    const minifiedSize = new Blob([received.minified]).size;
    const reduction = ((originalSize - minifiedSize) / originalSize) * 100;
    
    if (reduction < minPercentage) {
      return {
        pass: false,
        message: () => 
          `expected size reduction of at least ${minPercentage}% but got ${reduction.toFixed(1)}% ` +
          `(${originalSize} bytes → ${minifiedSize} bytes)`,
      };
    }
    
    return {
      pass: true,
      message: () => 
        `expected size reduction less than ${minPercentage}% but got ${reduction.toFixed(1)}%`,
    };
  },

  async toCompleteWithin(received: () => Promise<unknown>, ms: number) {
    const start = performance.now();
    
    try {
      await received();
      const duration = performance.now() - start;
      
      if (duration > ms) {
        return {
          pass: false,
          message: () => `expected to complete within ${ms}ms but took ${duration.toFixed(1)}ms`,
        };
      }
      
      return {
        pass: true,
        message: () => `expected to take longer than ${ms}ms but completed in ${duration.toFixed(1)}ms`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `expected to complete but threw error: ${error}`,
      };
    }
  },

  toHaveBeenCalledWithToast(received: Mock, title: string, description?: string) {
    if (!received || typeof received.mock === 'undefined') {
      return {
        pass: false,
        message: () => `expected a mock function but received ${typeof received}`,
      };
    }
    
    const calls = received.mock.calls;
    const matchingCall = calls.find((call: ToastArgs[]) => {
      const arg = call[0];
      return arg && 
             arg.title === title && 
             (description === undefined || arg.description === description);
    });
    
    if (!matchingCall) {
      return {
        pass: false,
        message: () => 
          `expected to be called with toast { title: "${title}"${description ? `, description: "${description}"` : ''} } ` +
          `but was called with: ${JSON.stringify(calls.map((c: ToastArgs[]) => c[0]), null, 2)}`,
      };
    }
    
    return {
      pass: true,
      message: () => 
        `expected not to be called with toast { title: "${title}"${description ? `, description: "${description}"` : ''} }`,
    };
  },
});

// Export for use in tests
export {};