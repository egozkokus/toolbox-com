# Testing Guide

## Overview

This project uses a comprehensive testing strategy including unit tests, integration tests, E2E tests, and performance tests.

## Testing Stack

- **Vitest** - Test runner (Jest-compatible)
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@vitest/coverage-v8** - Code coverage
- **jsdom** - DOM environment for tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:run

# Run integration tests
npm run test:integration

# Run all tests (unit + integration)
npm run test:all

# Validate code (type-check + lint + test)
npm run validate
```

## Test Structure

```
src/
├── __tests__/                    # Global tests
│   └── e2e/                     # End-to-end tests
├── components/
│   └── tools/
│       └── __tests__/           # Component unit tests
├── lib/
│   └── __tests__/               # Utility function tests
├── pages/
│   └── tools/
│       └── __tests__/           # Page component tests
└── test/                        # Test utilities and setup
    ├── setup.ts                 # Test environment setup
    └── test-utils.tsx           # Custom render functions
```

## Writing Tests

### Unit Tests

Test individual components or functions in isolation:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test multiple components working together:

```typescript
describe('Feature Integration', () => {
  it('completes user flow', async () => {
    render(<App />);
    
    // User interactions
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    // Assertions
    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

Test complete user journeys:

```typescript
describe('User Journey', () => {
  it('navigates through app features', async () => {
    render(<App />);
    
    // Navigate to feature
    const link = screen.getByText('Feature');
    await userEvent.click(link);
    
    // Use feature
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test data');
    
    // Verify results
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

### Performance Tests

Test performance characteristics:

```typescript
describe('Performance', () => {
  it('processes large files quickly', () => {
    const largeFile = generateLargeFile();
    
    const startTime = performance.now();
    processFile(largeFile);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## Test Utilities

### Custom Render

Use the custom render function that includes all providers:

```typescript
import { render } from '@/test/test-utils';

// Includes all providers automatically
render(<Component />);

// With options
render(<Component />, {
  initialRoute: '/specific-route',
  queryClient: customQueryClient
});
```

### Mock Utilities

Common mocks are available:

```typescript
import { mockToast } from '@/__mocks__/hooks';
import { mockNavigate } from '@/__mocks__/navigation';

// Toast is automatically mocked
expect(mockToast).toHaveBeenCalledWith({
  title: 'Success!'
});

// Navigation is automatically mocked
expect(mockNavigate).toHaveBeenCalledWith('/new-route');
```

### Test Helpers

```typescript
// Wait for loading to finish
await waitForLoadingToFinish();

// Mock clipboard
const { writeText, readText } = mockClipboard();

// Create mock files
const file = mockFile('content', 'text/plain');
const blob = mockBlob('content', 'application/json');
```

## Coverage Requirements

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

View coverage report: `npm run test:coverage`

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state

2. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText`
   - Avoid `getByTestId` unless necessary

3. **Write descriptive test names**
   ```typescript
   it('displays error message when form is submitted with invalid email')
   ```

4. **Keep tests independent**
   - Each test should run in isolation
   - Use `beforeEach` for setup

5. **Mock external dependencies**
   - Mock API calls, timers, etc.
   - Use real implementations when possible

6. **Test error cases**
   - Test both success and failure paths
   - Ensure graceful error handling

7. **Test accessibility**
   - Verify ARIA labels and roles
   - Test keyboard navigation

## Debugging Tests

### Visual Debugging

```typescript
// Print DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));
```

### Run specific tests

```bash
# Run tests matching pattern
npm test -- MyComponent

# Run single file
npm test -- src/components/MyComponent.test.tsx
```

### VS Code Integration

Install the Vitest extension for:
- Run tests from editor
- See test results inline
- Debug tests with breakpoints

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Pre-commit hooks (optional)

Add to GitHub Actions:

```yaml
- name: Run tests
  run: npm run test:all

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```