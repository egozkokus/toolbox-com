// src/__mocks__/components.tsx

import { vi } from 'vitest';
import type { JSX } from 'react';

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

type IconComponents = {
  [key: string]: (props: IconProps) => JSX.Element;
};

// Mock heavy components that might slow down tests
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="mock-toaster" />,
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="mock-sonner" />,
}));

// Mock icons to speed up tests
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    // Mock all icons as simple divs
    ...Object.keys(actual).reduce((acc: IconComponents, key) => {
      if (key !== 'default') {
        acc[key] = ({ className, ...props }: IconProps) => (
          <div className={className} data-icon={key} {...props} />
        );
      }
      return acc;
    }, {} as IconComponents),
  };
});
