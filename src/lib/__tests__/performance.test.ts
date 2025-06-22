// src/lib/__tests__/performance.test.ts

import { describe, it, expect} from 'vitest';
import { minificationStrategies } from '../codeUtils';
import { CodeValidator } from '../validators';

describe('Performance Tests', () => {
  describe('Minification Performance', () => {
    it('minifies large CSS files efficiently', () => {
      // Generate large CSS file (100KB+)
      const largeCss = generateLargeCSS(10000);
      
      const startTime = performance.now();
      
      // Apply minification strategies
      let result = largeCss;
      result = minificationStrategies.removeComments(result, /\/\*[\s\S]*?\*\//g);
      result = minificationStrategies.removeWhitespace(result);
      result = minificationStrategies.removeLineBreaks(result);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // Should process in under 100ms
      expect(processingTime).toBeLessThan(100);
      
      // Should achieve significant size reduction
      const originalSize = new Blob([largeCss]).size;
      const minifiedSize = new Blob([result]).size;
      const reduction = ((originalSize - minifiedSize) / originalSize) * 100;
      
      expect(reduction).toBeGreaterThan(30);
    });

    it('handles deeply nested CSS efficiently', () => {
      const deeplyNestedCSS = generateDeeplyNestedCSS(50);
      
      const startTime = performance.now();
      const result = minificationStrategies.removeWhitespace(deeplyNestedCSS);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
      expect(result).not.toContain('  ');
    });
  });

  describe('Validation Performance', () => {
    it('validates large JSON files quickly', () => {
      const largeJSON = generateLargeJSON(1000);
      
      const startTime = performance.now();
      const result = CodeValidator.validateJSON(largeJSON);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
      expect(result.isValid).toBe(true);
    });

    it('validates complex HTML structures efficiently', () => {
      const complexHTML = generateComplexHTML(100);
      
      const startTime = performance.now();
      const result = CodeValidator.validateHTML(complexHTML);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
      expect(result.isValid).toBe(true);
    });

    it('handles malformed input without hanging', () => {
      const malformedInputs = [
        '{"unclosed": "json',
        '<div><div><div>'.repeat(1000),
        'SELECT * FROM users WHERE ' + 'id = 1 OR '.repeat(1000),
      ];

      malformedInputs.forEach(input => {
        const startTime = performance.now();
        
        // Should not hang - set a timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Validation timeout')), 1000)
        );
        
        const validationPromise = Promise.resolve(
          CodeValidator.validateJSON(input) || 
          CodeValidator.validateHTML(input) ||
          CodeValidator.validateSQL(input)
        );
        
        return Promise.race([validationPromise, timeoutPromise])
          .then(() => {
            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(100);
          });
      });
    });
  });

  describe('Memory Usage', () => {
    it('does not leak memory when processing many files', () => {
      const iterations = 100;
      const results: string[] = [];
      
      // Get initial memory usage (if available)
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      for (let i = 0; i < iterations; i++) {
        const css = generateLargeCSS(100);
        const minified = minificationStrategies.removeWhitespace(css);
        results.push(minified);
      }
      
      // Clear results to allow garbage collection
      results.length = 0;
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Get final memory usage
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory increase should be minimal after garbage collection
      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory - initialMemory;
        const increaseMB = memoryIncrease / (1024 * 1024);
        expect(increaseMB).toBeLessThan(10); // Less than 10MB increase
      }
    });
  });
});

// Helper functions to generate test data
function generateLargeCSS(rules: number): string {
  let css = '';
  for (let i = 0; i < rules; i++) {
    css += `
      .class-${i} {
        color: #${Math.floor(Math.random() * 16777215).toString(16)};
        margin: ${Math.random() * 100}px;
        padding: ${Math.random() * 50}px ${Math.random() * 50}px;
        background-color: rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random()});
        border: ${Math.random() * 5}px solid #${Math.floor(Math.random() * 16777215).toString(16)};
        font-size: ${10 + Math.random() * 20}px;
        line-height: ${1 + Math.random()};
      }
    `;
  }
  return css;
}

function generateDeeplyNestedCSS(depth: number): string {
  let css = '';
  let indent = '';
  
  for (let i = 0; i < depth; i++) {
    css += `${indent}.level-${i} {\n`;
    indent += '  ';
    css += `${indent}color: #${i.toString(16).padStart(6, '0')};\n`;
  }
  
  for (let i = depth - 1; i >= 0; i--) {
    indent = '  '.repeat(i);
    css += `${indent}}\n`;
  }
  
  return css;
}

function generateLargeJSON(objects: number): string {
  const data = [];
  for (let i = 0; i < objects; i++) {
    data.push({
      id: i,
      name: `Object ${i}`,
      timestamp: Date.now(),
      data: {
        value: Math.random() * 1000,
        nested: {
          deep: {
            property: `Value ${i}`
          }
        }
      },
      tags: Array.from({ length: 10 }, (_, j) => `tag-${i}-${j}`)
    });
  }
  return JSON.stringify(data);
}

function generateComplexHTML(elements: number): string {
  let html = '<html><body>';
  
  for (let i = 0; i < elements; i++) {
    const tagType = ['div', 'span', 'p', 'section', 'article'][i % 5];
    html += `<${tagType} id="element-${i}" class="class-${i % 10}">`;
    html += `Content ${i}`;
    
    if (i % 3 === 0) {
      html += '<img src="test.jpg" alt="Test">';
    }
    if (i % 5 === 0) {
      html += '<br>';
    }
    
    html += `</${tagType}>`;
  }
  
  html += '</body></html>';
  return html;
}