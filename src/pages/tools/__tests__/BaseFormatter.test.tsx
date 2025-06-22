// src/components/tools/__tests__/BaseFormatter.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../../test/test-utils';
import BaseFormatter from '../BaseFormatter';
import { mockToast } from '@/__mocks__/hooks';

describe('BaseFormatter', () => {
  const mockFormatFunction = vi.fn((input: string) => ({
    formatted: input.split(' ').join('\n'),
    error: undefined
  }));
  
  const defaultProps = {
    title: 'Test Formatter',
    subtitle: 'Test subtitle',
    toolType: 'html' as const,
    backPath: '/test',
    placeholder: 'Enter code here',
    defaultValue: 'default code',
    formatFunction: mockFormatFunction,
    fileExtension: 'html',
    mimeType: 'text/html',
    iconColor: 'text-orange-600'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default value', () => {
    render(<BaseFormatter {...defaultProps} />);
    
    expect(screen.getByText('Test Formatter')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.getByDisplayValue('default code')).toBeInTheDocument();
  });

  it('formats code successfully', async () => {
    render(<BaseFormatter {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(input, { target: { value: 'test html code' } });
    
    const formatButton = screen.getByText('עצב HTML');
    fireEvent.click(formatButton);
    
    await waitFor(() => {
      expect(mockFormatFunction).toHaveBeenCalledWith('test html code');
      expect(screen.getByDisplayValue('test\nhtml\ncode')).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'הצלחה!',
        description: 'קוד HTML עוצב בהצלחה'
      });
    });
  });

  it('handles format errors properly', async () => {
    const errorFormatFunction = vi.fn(() => ({
      formatted: '',
      error: 'Invalid HTML syntax'
    }));
    
    render(
      <BaseFormatter
        {...defaultProps}
        formatFunction={errorFormatFunction}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(input, { target: { value: 'invalid code' } });
    
    const formatButton = screen.getByText('עצב HTML');
    fireEvent.click(formatButton);
    
    await waitFor(() => {
      expect(errorFormatFunction).toHaveBeenCalled();
      expect(screen.getByText('שגיאה בעיצוב HTML')).toBeInTheDocument();
    });
  });

  it('resets all fields when reset button is clicked', async () => {
    render(<BaseFormatter {...defaultProps} />);
    
    // First format some code
    const input = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(input, { target: { value: 'test code' } });
    
    const formatButton = screen.getByText('עצב HTML');
    fireEvent.click(formatButton);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('test\ncode')).toBeInTheDocument();
    });
    
    // Then reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(input).toHaveValue('');
    expect(screen.queryByDisplayValue('test\ncode')).not.toBeInTheDocument();
  });

  it('copies formatted code to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });
    
    render(<BaseFormatter {...defaultProps} />);
    
    // Format code first
    const input = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(input, { target: { value: 'test code' } });
    
    const formatButton = screen.getByText('עצב HTML');
    fireEvent.click(formatButton);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('test\ncode')).toBeInTheDocument();
    });
    
    // Copy formatted code
    const copyButton = screen.getByText('העתק');
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('test\ncode');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'הועתק!',
        description: 'הקוד הועתק ללוח'
      });
    });
  });

  it('downloads formatted file', async () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('mock-url');
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();
    
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
    
    render(<BaseFormatter {...defaultProps} />);
    
    // Format code first
    const input = screen.getByPlaceholderText('Enter code here');
    fireEvent.change(input, { target: { value: 'test code' } });
    
    const formatButton = screen.getByText('עצב HTML');
    fireEvent.click(formatButton);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('test\ncode')).toBeInTheDocument();
    });
    
    // Download
    const downloadButton = screen.getByText('הורד');
    fireEvent.click(downloadButton);
    
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      );
      expect(mockClick).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'הורד!',
        description: 'קובץ HTML הורד בהצלחה'
      });
    });
    
    createElementSpy.mockRestore();
  });

  it('handles empty input validation', async () => {
    render(<BaseFormatter {...defaultProps} defaultValue="" />);
    
    const formatButton = screen.getByText('עצב HTML');
    fireEvent.click(formatButton);
    
    await waitFor(() => {
      expect(mockFormatFunction).not.toHaveBeenCalled();
    });
  });

  it('disables action buttons when no output', () => {
    render(<BaseFormatter {...defaultProps} defaultValue="" />);
    
    const copyButton = screen.getByText('העתק');
    const downloadButton = screen.getByText('הורד');
    
    expect(copyButton).toBeDisabled();
    expect(downloadButton).toBeDisabled();
  });
});