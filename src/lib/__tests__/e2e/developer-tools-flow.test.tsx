// src/__tests__/e2e/developer-tools-flow.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import App from '@/App';
import { mockNavigate } from '@/__mocks__/navigation';

describe('Developer Tools E2E Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('complete flow: navigate to dev tools -> select CSS minifier -> use tool', async () => {
    render(<App />);
    
    // Step 1: From home page, find and click on Developer Tools category
    const devToolsCard = screen.getByText('כלי מפתחים');
    expect(devToolsCard).toBeInTheDocument();
    
    const exploreButton = devToolsCard.closest('.group')?.querySelector('button');
    expect(exploreButton).toBeInTheDocument();
    fireEvent.click(exploreButton!);
    
    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/categories/developer-tools');
    
    // Step 2: In Developer Tools page, search for CSS Minifier
    // Since we're mocking navigation, we need to render the DeveloperTools page
    const { rerender } = render(<App />, { initialRoute: '/categories/developer-tools' });
    
    // Find search input
    const searchInput = screen.getByPlaceholderText(/חפש כלי/);
    fireEvent.change(searchInput, { target: { value: 'CSS' } });
    
    // Find CSS Minifier card
    const cssMinifierCard = screen.getByText('CSS Minifier');
    expect(cssMinifierCard).toBeInTheDocument();
    
    // Click on the tool
    const useToolButton = cssMinifierCard.closest('.bg-white')?.querySelector('button');
    fireEvent.click(useToolButton!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/tools/css-minifier');
    
    // Step 3: Use the CSS Minifier
    rerender(<App />, { initialRoute: '/tools/css-minifier' });
    
    // Enter CSS
    const cssInput = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(cssInput, { 
      target: { 
        value: '.test { color: red; margin: 10px; }' 
      } 
    });
    
    // Minify
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    // Verify output
    await waitFor(() => {
      const outputAreas = screen.getAllByRole('textbox');
      const outputArea = outputAreas[1];
      expect(outputArea.value).toBe('.test{color:red;margin:10px}');
    });
    
    // Go back to developer tools
    const backButton = screen.getByText('חזרה לכלי מפתחים');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/categories/developer-tools');
  });

  it('language switching persists across navigation', async () => {
    render(<App />);
    
    // Start in Hebrew (default)
    expect(screen.getByText('כלי רשת הכל-בכל')).toBeInTheDocument();
    
    // Switch to English
    const languageSelector = screen.getByRole('button', { name: /he/i });
    fireEvent.click(languageSelector);
    
    const englishOption = screen.getByText('English');
    fireEvent.click(englishOption);
    
    // Verify language changed
    await waitFor(() => {
      expect(screen.getByText('All-in-One Web Tools')).toBeInTheDocument();
    });
    
    // Navigate to a tool
    const devToolsCard = screen.getByText('Developer Tools');
    const exploreButton = devToolsCard.closest('.group')?.querySelector('button');
    fireEvent.click(exploreButton!);
    
    // Verify language persists
    expect(screen.queryByText('כלי מפתחים')).not.toBeInTheDocument();
    expect(screen.getByText('Developer Tools')).toBeInTheDocument();
  });

  it('handles errors gracefully throughout the flow', async () => {
    // Mock clipboard API to fail
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard access denied'));
    Object.assign(navigator.clipboard, { writeText: mockWriteText });
    
    render(<App />, { initialRoute: '/tools/css-minifier' });
    
    // Enter and minify CSS
    const cssInput = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(cssInput, { target: { value: '.test { color: red; }' } });
    
    const minifyButton = screen.getByText('הקטן CSS');
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      const outputAreas = screen.getAllByRole('textbox');
      expect(outputAreas[1].value).toBe('.test{color:red}');
    });
    
    // Try to copy - should handle error gracefully
    const copyButton = screen.getByText('העתק');
    fireEvent.click(copyButton);
    
    // Should not crash, app should remain functional
    await waitFor(() => {
      expect(screen.getByText('העתק')).toBeInTheDocument();
    });
    
    // Can still use other features
    const cssInput2 = screen.getByPlaceholderText(/הדבק את קוד ה-CSS/);
    fireEvent.change(cssInput2, { target: { value: '.new { color: blue; }' } });
    fireEvent.click(minifyButton);
    
    await waitFor(() => {
      const outputAreas = screen.getAllByRole('textbox');
      expect(outputAreas[1].value).toBe('.new{color:blue}');
    });
  });
});