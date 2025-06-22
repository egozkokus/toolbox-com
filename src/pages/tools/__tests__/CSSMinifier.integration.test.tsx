// src/pages/tools/__tests__/CSSMinifier.integration.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import CSSMinifier from '../CSSMinifier';
import { mockToast } from '@/__mocks__/hooks';

describe('CSSMinifier Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('complete user flow: input -> minify -> copy -> download', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    const mockCreateObjectURL = vi.fn().mockReturnValue('mock-url');
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();
    
    Object.assign(navigator.clipboard, { writeText: mockWriteText });
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    
    const createElementSpy = vi.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tagName) => {
      if (tagName === 'a') {
        const anchor = document.createElement(tagName);
        anchor.click = mockClick;
        return anchor;
      }
      return document.createElement(tagName);
    });
    
    render(<CSSMinifier />);
    
    // Step 1: Enter CSS code
    const cssInput = `.button {
      background-color: #007bff;
      border: none;
      color: white;
      padding: 10px 20px;
      font-size: 16px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }`;
    
    const textarea = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(textarea, { target: { value: cssInput } });
    
    // Step 2: Click minify
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הושלם!',
          description: expect.stringContaining('CSS הוקטן ב-')
        })
      );
    });
    
    // Verify minified output is displayed
    const minifiedOutput = '.button{background-color:#007bff;border:none;color:white;padding:10px 20px;font-size:16px}.container{max-width:1200px;margin:0 auto;padding:20px}';
    const outputTextarea = screen.getAllByRole('textbox')[1];
    expect(outputTextarea).toHaveValue(minifiedOutput);
    
    // Step 3: Copy to clipboard
    const copyButton = screen.getByText('העתק');
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(minifiedOutput);
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הועתק!',
          description: 'הקוד המוקטן הועתק ללוח'
        })
      );
    });
    
    // Step 4: Download file
    const downloadButton = screen.getByText('הורד');
    fireEvent.click(downloadButton);
    
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      
      // Verify the blob was created with correct content and type
      const blobCall = mockCreateObjectURL.mock.calls[0][0];
      expect(blobCall).toBeInstanceOf(Blob);
      expect(blobCall.type).toBe('text/css');
      
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הורד בהצלחה!',
          description: 'הקובץ נשמר'
        })
      );
    });
    
    createElementSpy.mockRestore();
  });

  it('handles real-world CSS with comments and media queries', async () => {
    render(<CSSMinifier />);
    
    const complexCSS = `/* Main styles */
    .header {
      background: linear-gradient(45deg, #007bff, #6610f2);
      padding: 20px;
      /* Navigation styles */
      nav {
        display: flex;
        justify-content: space-between;
      }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .header {
        padding: 10px;
      }
      
      .container {
        width: 100%;
        padding: 0 15px;
      }
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }`;
    
    const textarea = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(textarea, { target: { value: complexCSS } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      const outputTextarea = screen.getAllByRole('textbox')[1];
      const minifiedValue = outputTextarea.value;
      
      // Check that comments are removed
      expect(minifiedValue).not.toContain('/*');
      expect(minifiedValue).not.toContain('*/');
      
      // Check that spaces are minimized
      expect(minifiedValue).not.toContain('  ');
      expect(minifiedValue).not.toContain('\n');
      
      // Check that CSS structure is preserved
      expect(minifiedValue).toContain('@media');
      expect(minifiedValue).toContain('@keyframes');
      expect(minifiedValue).toContain('.header{');
    });
  });

  it('shows size reduction statistics', async () => {
    render(<CSSMinifier />);
    
    const largeCSS = `
      .very-long-class-name-for-testing-purposes {
        background-color: #ffffff;
        border: 1px solid #cccccc;
        margin-top: 10px;
        margin-right: 20px;
        margin-bottom: 10px;
        margin-left: 20px;
        padding-top: 5px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-left: 10px;
      }
    `;
    
    const textarea = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(textarea, { target: { value: largeCSS } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הושלם!',
          description: expect.stringMatching(/CSS הוקטן ב-\d+\.\d%/)
        })
      );
      
      // Extract percentage from toast call
      const toastCall = mockToast.mock.calls[0][0];
      const percentMatch = toastCall.description.match(/(\d+\.\d)%/);
      const savedPercentage = parseFloat(percentMatch[1]);
      
      // Should have significant size reduction
      expect(savedPercentage).toBeGreaterThan(50);
    });
  });

  it('validates CSS before minification', async () => {
    render(<CSSMinifier />);
    
    // Test with valid CSS first
    const validCSS = '.test { color: red; }';
    const textarea = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(textarea, { target: { value: validCSS } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הושלם!'
        })
      );
    });
  });
});