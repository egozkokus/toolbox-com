// src/test/factories.ts

import { AppError, ErrorSeverity } from '@/lib/errorHandling';

// Factory functions for creating test data

export const createMockError = (overrides?: Partial<AppError>): AppError => ({
  code: 'TEST_ERROR',
  message: 'Test error message',
  severity: 'error' as ErrorSeverity,
  timestamp: new Date(),
  context: 'test-context',
  ...overrides,
});

export const createMockValidationResult = (isValid: boolean = true) => ({
  isValid,
  error: isValid ? undefined : 'Validation failed',
  errorCode: isValid ? undefined : 'VALIDATION_ERROR',
  details: {},
});

export const createMockToastCall = (title: string, description?: string) => ({
  title,
  description,
  variant: 'default' as const,
});

export const createMockFile = (
  content: string = 'test content',
  name: string = 'test.txt',
  type: string = 'text/plain'
): File => {
  return new File([content], name, { type });
};

export const createMockFormData = (fields: Record<string, string | File>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export const createMockResponse = <T = unknown>(
  data: T,
  options: ResponseInit = {}
): Response => {
  const body = JSON.stringify(data);
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};

export const createMockCSS = (sizeKB: number = 10): string => {
  const rules = Math.floor(sizeKB * 10); // Approximate rules for size
  let css = '';
  
  for (let i = 0; i < rules; i++) {
    css += `
.class-${i} {
  color: #${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')};
  margin: ${Math.floor(Math.random() * 100)}px;
  padding: ${Math.floor(Math.random() * 50)}px;
  background-color: rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random().toFixed(2)});
}
`;
  }
  
  return css;
};

export const createMockHTML = (elements: number = 10): string => {
  let html = '<!DOCTYPE html><html><head><title>Test</title></head><body>';
  
  for (let i = 0; i < elements; i++) {
    const tag = ['div', 'p', 'span', 'section'][i % 4];
    html += `<${tag} id="element-${i}" class="class-${i}">Content ${i}</${tag}>`;
  }
  
  html += '</body></html>';
  return html;
};

type MockJSON = string | number | MockJSON[] | { [key: string]: MockJSON };

export const createMockJSON = (depth: number = 3, breadth: number = 3): MockJSON => {
  if (depth === 0) {
    return Math.random() > 0.5 ? Math.random() * 100 : `value-${Math.random()}`;
  }
  
  const obj: { [key: string]: MockJSON } = {};
  for (let i = 0; i < breadth; i++) {
    obj[`key-${i}`] = createMockJSON(depth - 1, breadth);
  }
  
  return Math.random() > 0.7 ? Object.values(obj) : obj;
};

export const createMockSQL = (complexity: 'simple' | 'medium' | 'complex' = 'simple'): string => {
  const tables = ['users', 'orders', 'products', 'categories'];
  const columns = ['id', 'name', 'email', 'created_at', 'updated_at', 'status'];
  
  switch (complexity) {
    case 'simple':
      return `SELECT * FROM ${tables[0]} WHERE id = 1`;
      
    case 'medium':
      return `
SELECT u.name, u.email, COUNT(o.id) as order_count
FROM ${tables[0]} u
LEFT JOIN ${tables[1]} o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC
LIMIT 10`;
      
    case 'complex':
      return `
WITH user_orders AS (
  SELECT 
    u.id,
    u.name,
    COUNT(o.id) as total_orders,
    SUM(o.total) as total_spent
  FROM ${tables[0]} u
  JOIN ${tables[1]} o ON u.id = o.user_id
  WHERE o.status = 'completed'
  GROUP BY u.id, u.name
),
product_stats AS (
  SELECT 
    p.category_id,
    COUNT(DISTINCT p.id) as product_count,
    AVG(p.price) as avg_price
  FROM ${tables[2]} p
  GROUP BY p.category_id
)
SELECT 
  uo.*,
  ps.product_count,
  ps.avg_price
FROM user_orders uo
CROSS JOIN product_stats ps
WHERE uo.total_orders > 5
ORDER BY uo.total_spent DESC`;
  }
};

export const createMockXML = (depth: number = 3): string => {
  const generateElement = (level: number): string => {
    if (level >= depth) {
      return `<item>Value ${Math.random()}</item>`;
    }
    
    let xml = `<level${level}>`;
    for (let i = 0; i < 3; i++) {
      xml += generateElement(level + 1);
    }
    xml += `</level${level}>`;
    
    return xml;
  };
  
  return `<?xml version="1.0" encoding="UTF-8"?><root>${generateElement(0)}</root>`;
};

interface JWTHeader {
  alg?: string;
  typ?: string;
  [key: string]: unknown;
}

interface JWTPayload {
  sub?: string;
  name?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export const createMockJWT = (payload: JWTPayload = {}, header: JWTHeader = {}): string => {
  const defaultHeader = { alg: 'HS256', typ: 'JWT', ...header };
  const defaultPayload = {
    sub: '1234567890',
    name: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...payload,
  };
  
  const encodedHeader = btoa(JSON.stringify(defaultHeader));
  const encodedPayload = btoa(JSON.stringify(defaultPayload));
  const signature = 'mock_signature_' + Math.random().toString(36).substr(2);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};