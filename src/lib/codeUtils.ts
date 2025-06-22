// src/lib/codeUtils.ts

export interface ProcessingResult {
    result: string;
    originalSize: number;
    processedSize: number;
    savedPercentage: number;
  }
  
  export const calculateSizeReduction = (original: string, processed: string): ProcessingResult => {
    const originalSize = new Blob([original]).size;
    const processedSize = new Blob([processed]).size;
    const savedPercentage = ((originalSize - processedSize) / originalSize * 100);
    
    return {
      result: processed,
      originalSize,
      processedSize,
      savedPercentage: Math.max(0, savedPercentage)
    };
  };
  
  export const validateInput = (input: string, type: string): { isValid: boolean; error?: string } => {
    if (!input.trim()) {
      return { isValid: false, error: `אנא הכנס קוד ${type}` };
    }
    
    // Add specific validation for different types
    switch (type.toLowerCase()) {
      case 'json':
        try {
          JSON.parse(input);
          return { isValid: true };
        } catch {
          return { isValid: false, error: 'JSON לא תקין' };
        }
      
      case 'xml':
        const openTags = (input.match(/<[^/][^>]*>/g) || []).length;
        const closeTags = (input.match(/<\/[^>]+>/g) || []).length;
        if (openTags !== closeTags) {
          return { isValid: false, error: 'XML לא תקין - תגיות לא מאוזנות' };
        }
        return { isValid: true };
      
      default:
        return { isValid: true };
    }
  };
  
  // Common minification functions
  export const minificationStrategies = {
    removeComments: (input: string, commentPattern: RegExp): string => {
      return input.replace(commentPattern, '');
    },
    
    removeWhitespace: (input: string): string => {
      return input.replace(/\s+/g, ' ').trim();
    },
    
    removeLineBreaks: (input: string): string => {
      return input.replace(/\n\s*/g, '');
    }
  };
  
  // Common formatting functions
  export const formattingStrategies = {
    addLineBreaks: (input: string, pattern: RegExp, replacement: string): string => {
      return input.replace(pattern, replacement);
    },
    
    indentCode: (lines: string[], getIndentLevel: (line: string, index: number, array: string[]) => number): string[] => {
      return lines.map((line, index, array) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        const indentLevel = getIndentLevel(trimmed, index, array);
        return '  '.repeat(Math.max(0, indentLevel)) + trimmed;
      });
    }
  };