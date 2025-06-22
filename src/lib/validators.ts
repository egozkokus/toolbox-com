// src/lib/validators.ts

import { ERROR_CODES } from './errorHandling';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: string;
  details?: Record<string, number | string | string[]>;
}

export class CodeValidator {
  // Basic validation
  static validateNotEmpty(input: string): ValidationResult {
    if (!input || !input.trim()) {
      return {
        isValid: false,
        error: 'הקלט ריק',
        errorCode: ERROR_CODES.EMPTY_INPUT
      };
    }
    return { isValid: true };
  }

  // JSON validation
  static validateJSON(input: string): ValidationResult {
    const emptyCheck = this.validateNotEmpty(input);
    if (!emptyCheck.isValid) return emptyCheck;

    try {
      JSON.parse(input);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'JSON לא תקין: ' + (error as Error).message,
        errorCode: ERROR_CODES.INVALID_JSON,
        details: error
      };
    }
  }

  // XML validation
  static validateXML(input: string): ValidationResult {
    const emptyCheck = this.validateNotEmpty(input);
    if (!emptyCheck.isValid) return emptyCheck;

    // Check for basic XML structure
    const xmlDeclarationRegex = /^<\?xml\s+version=["'][^"']+["']\s*(?:encoding=["'][^"']+["'])?\s*\?>/;
    const hasXmlDeclaration = xmlDeclarationRegex.test(input.trim());

    // Count opening and closing tags
    const openingTags = input.match(/<[^/][^>]*[^/]>/g) || [];
    const closingTags = input.match(/<\/[^>]+>/g) || [];
    const selfClosingTags = input.match(/<[^>]+\/>/g) || [];

    // Basic balance check
    if (openingTags.length !== closingTags.length + selfClosingTags.length) {
      return {
        isValid: false,
        error: 'XML לא תקין: תגיות לא מאוזנות',
        errorCode: ERROR_CODES.INVALID_XML,
        details: {
          openingTags: openingTags.length,
          closingTags: closingTags.length,
          selfClosingTags: selfClosingTags.length
        }
      };
    }

    // Check for common XML errors
    if (input.includes('<<') || input.includes('>>')) {
      return {
        isValid: false,
        error: 'XML לא תקין: תגיות כפולות',
        errorCode: ERROR_CODES.INVALID_XML
      };
    }

    return { isValid: true };
  }

  // HTML validation (more lenient than XML)
  static validateHTML(input: string): ValidationResult {
    const emptyCheck = this.validateNotEmpty(input);
    if (!emptyCheck.isValid) return emptyCheck;

    // Check for basic HTML structure
    const hasHtmlTag = /<html[\s>]/i.test(input);
    const hasBodyTag = /<body[\s>]/i.test(input);
    
    // Check for unclosed tags (basic)
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    const openTags: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    
    let match;
    while ((match = tagRegex.exec(input)) !== null) {
      const tagName = match[1].toLowerCase();
      const isClosing = match[0].startsWith('</');
      
      if (!voidElements.includes(tagName)) {
        if (isClosing) {
          const lastOpen = openTags.pop();
          if (lastOpen !== tagName) {
            return {
              isValid: false,
              error: `HTML לא תקין: תגית ${tagName} נסגרה ללא פתיחה מתאימה`,
              errorCode: ERROR_CODES.INVALID_HTML
            };
          }
        } else if (!match[0].endsWith('/>')) {
          openTags.push(tagName);
        }
      }
    }

    if (openTags.length > 0) {
      return {
        isValid: false,
        error: `HTML לא תקין: תגיות לא סגורות: ${openTags.join(', ')}`,
        errorCode: ERROR_CODES.INVALID_HTML,
        details: { unclosedTags: openTags }
      };
    }

    return { isValid: true };
  }

  // CSS validation
  static validateCSS(input: string): ValidationResult {
    const emptyCheck = this.validateNotEmpty(input);
    if (!emptyCheck.isValid) return emptyCheck;

    // Check for balanced braces
    const openBraces = (input.match(/{/g) || []).length;
    const closeBraces = (input.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      return {
        isValid: false,
        error: 'CSS לא תקין: סוגריים מסולסלים לא מאוזנים',
        errorCode: ERROR_CODES.INVALID_CSS,
        details: { openBraces, closeBraces }
      };
    }

    // Check for basic CSS syntax
    const basicCssPattern = /[a-zA-Z-#.[\]:]+\s*{[^}]*}/;
    if (!basicCssPattern.test(input.replace(/\/\*.*?\*\//gs, ''))) {
      return {
        isValid: false,
        error: 'CSS לא תקין: תחביר לא נכון',
        errorCode: ERROR_CODES.INVALID_CSS
      };
    }

    return { isValid: true };
  }

  // JavaScript validation (basic syntax check)
  static validateJavaScript(input: string): ValidationResult {
    const emptyCheck = this.validateNotEmpty(input);
    if (!emptyCheck.isValid) return emptyCheck;

    // Check for balanced brackets
    const brackets = [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '{', close: '}' }
    ];

    for (const bracket of brackets) {
      const openCount = (input.match(new RegExp('\\' + bracket.open, 'g')) || []).length;
      const closeCount = (input.match(new RegExp('\\' + bracket.close, 'g')) || []).length;
      
      if (openCount !== closeCount) {
        return {
          isValid: false,
          error: `JavaScript לא תקין: ${bracket.open}${bracket.close} לא מאוזנים`,
          errorCode: ERROR_CODES.INVALID_JS,
          details: { bracket: bracket.open + bracket.close, openCount, closeCount }
        };
      }
    }

    // Check for unclosed strings
    const stringPattern = /(['"])(?:(?!\1)[^\\]|\\[\s\S])*\1/g;
    const withoutStrings = input.replace(stringPattern, '');
    
    if (withoutStrings.includes('"') || withoutStrings.includes("'")) {
      return {
        isValid: false,
        error: 'JavaScript לא תקין: מחרוזת לא סגורה',
        errorCode: ERROR_CODES.INVALID_JS
      };
    }

    return { isValid: true };
  }

  // SQL validation
  static validateSQL(input: string): ValidationResult {
    const emptyCheck = this.validateNotEmpty(input);
    if (!emptyCheck.isValid) return emptyCheck;

    const upperInput = input.toUpperCase();

    // Check for basic SQL keywords
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
    const hasValidKeyword = sqlKeywords.some(keyword => upperInput.includes(keyword));
    
    if (!hasValidKeyword) {
      return {
        isValid: false,
        error: 'SQL לא תקין: חסרה פקודת SQL בסיסית',
        errorCode: ERROR_CODES.INVALID_SQL
      };
    }

    // Check for SQL injection attempts (basic)
    const dangerousPatterns = [
      /;\s*DROP\s+/i,
      /;\s*DELETE\s+FROM\s+/i,
      /UNION\s+SELECT.*FROM\s+information_schema/i,
      /OR\s+1\s*=\s*1/i,
      /'\s*OR\s*'1'\s*=\s*'1/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        return {
          isValid: false,
          error: 'SQL לא בטוח: זוהה ניסיון החדרת קוד',
          errorCode: ERROR_CODES.SECURITY_VIOLATION
        };
      }
    }

    return { isValid: true };
  }

  // File size validation
  static validateFileSize(size: number, maxSizeMB: number = 10): ValidationResult {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (size > maxSizeBytes) {
      return {
        isValid: false,
        error: `הקובץ גדול מדי: ${(size / 1024 / 1024).toFixed(2)}MB (מקסימום: ${maxSizeMB}MB)`,
        errorCode: ERROR_CODES.FILE_TOO_LARGE,
        details: { size, maxSize: maxSizeBytes }
      };
    }
    
    return { isValid: true };
  }
}