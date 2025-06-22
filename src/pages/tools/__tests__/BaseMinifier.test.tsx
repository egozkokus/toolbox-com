// src/components/tools/__tests__/BaseMinifier.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import BaseMinifier from '../BaseMinifier';
import { mockToast } from '@/__mocks__/hooks';

describe('BaseMinifier', () => {
  const mockMinifyFunction = vi.fn((input: string) => input.replace(/\s+/g, ' ').trim());
  
  const defaultProps = {
    title: 'Test Minifier',
    subtitle: 'Test subtitle',
    toolType: 'css' as const,
    backPath: '/test',
    placeholder: 'Enter code here',
    minifyFunction: mockMinifyFunction,
    fileExtension: 'css',
    mimeType: 'text/css',
    iconColor: 'text-blue-600'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<BaseMinifier {...defaultProps} />);
    
    expect(screen.getByText('Test Minifier')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.getByText('קוד CSS מקורי')).toBeInTheDocument();
    expect(screen.getByText('CSS מוקטן')).toBeInTheDocument();
  });

  it('shows error when trying to minify empty input', async () => {
    render(<BaseMinifier {...defaultProps} />);
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הושלם!'
        })
      );
    });
  });

  it('successfully minifies input', async () => {
    render(<BaseMinifier {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(textarea, { target: { value: '  .test  {  color:  red;  }  ' } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockMinifyFunction).toHaveBeenCalledWith('  .test  {  color:  red;  }  ');
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הושלם!',
          description: expect.stringContaining('CSS הוקטן ב-')
        })
      );
    });
  });

  it('copies minified code to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });
    
    render(<BaseMinifier {...defaultProps} />);
    
    // First minify some code
    const textarea = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(textarea, { target: { value: 'test code' } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockMinifyFunction).toHaveBeenCalled();
    });
    
    // Then copy
    const copyButton = screen.getByText('העתק');
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('test code');
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הועתק!',
          description: 'הקוד המוקטן הועתק ללוח'
        })
      );
    });
  });

  it('downloads minified file', async () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('mock-url');
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();
    
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    
    // Mock createElement to return an anchor with click method
    const createElementSpy = vi.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tagName) => {
      if (tagName === 'a') {
        const anchor = document.createElement(tagName);
        anchor.click = mockClick;
        return anchor;
      }
      return document.createElement(tagName);
    });
    
    render(<BaseMinifier {...defaultProps} />);
    
    // First minify some code
    const textarea = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(textarea, { target: { value: 'test code' } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(mockMinifyFunction).toHaveBeenCalled();
    });
    
    // Then download
    const downloadButton = screen.getByText('הורד');
    fireEvent.click(downloadButton);
    
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הורד בהצלחה!',
          description: 'הקובץ נשמר'
        })
      );
    });
    
    createElementSpy.mockRestore();
  });

  it('handles minification errors gracefully', async () => {
    const errorMinifyFunction = vi.fn(() => {
      throw new Error('Minification failed');
    });
    
    render(
      <BaseMinifier
        {...defaultProps}
        minifyFunction={errorMinifyFunction}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(textarea, { target: { value: 'test code' } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      expect(errorMinifyFunction).toHaveBeenCalled();
      expect(mockToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'הושלם!'
        })
      );
    });
  });

  it('disables copy and download buttons when no minified content', () => {
    render(<BaseMinifier {...defaultProps} />);
    
    const copyButton = screen.getByText('העתק');
    const downloadButton = screen.getByText('הורד');
    
    expect(copyButton).toBeDisabled();
    expect(downloadButton).toBeDisabled();
  });
});