// src/lib/__tests__/validators.test.ts

import { describe, it, expect } from 'vitest';
import { CodeValidator } from '../validators';
import { ERROR_CODES } from '../errorHandling';

describe('CodeValidator', () => {
  describe('validateNotEmpty', () => {
    it('returns invalid for empty string', () => {
      const result = CodeValidator.validateNotEmpty('');
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.EMPTY_INPUT);
    });

    it('returns invalid for whitespace only', () => {
      const result = CodeValidator.validateNotEmpty('   \n\t  ');
      expect(result.isValid).toBe(false);
    });

    it('returns valid for non-empty string', () => {
      const result = CodeValidator.validateNotEmpty('test');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateJSON', () => {
    it('validates correct JSON', () => {
      const validJSON = '{"name": "test", "value": 123}';
      const result = CodeValidator.validateJSON(validJSON);
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid JSON', () => {
      const invalidJSON = '{name: "test", value: 123}';
      const result = CodeValidator.validateJSON(invalidJSON);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.INVALID_JSON);
    });

    it('validates JSON arrays', () => {
      const jsonArray = '[1, 2, 3, "test"]';
      const result = CodeValidator.validateJSON(jsonArray);
      expect(result.isValid).toBe(true);
    });

    it('rejects incomplete JSON', () => {
      const incompleteJSON = '{"name": "test"';
      const result = CodeValidator.validateJSON(incompleteJSON);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateXML', () => {
    it('validates correct XML', () => {
      const validXML = '<?xml version="1.0"?><root><item>test</item></root>';
      const result = CodeValidator.validateXML(validXML);
      expect(result.isValid).toBe(true);
    });

    it('validates self-closing tags', () => {
      const xmlWithSelfClosing = '<root><item/><item2/></root>';
      const result = CodeValidator.validateXML(xmlWithSelfClosing);
      expect(result.isValid).toBe(true);
    });

    it('rejects unbalanced tags', () => {
      const unbalancedXML = '<root><item>test</root>';
      const result = CodeValidator.validateXML(unbalancedXML);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.INVALID_XML);
    });

    it('rejects double angle brackets', () => {
      const invalidXML = '<root><<item>test</item></root>';
      const result = CodeValidator.validateXML(invalidXML);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateHTML', () => {
    it('validates correct HTML', () => {
      const validHTML = '<html><body><h1>Test</h1></body></html>';
      const result = CodeValidator.validateHTML(validHTML);
      expect(result.isValid).toBe(true);
    });

    it('validates void elements', () => {
      const htmlWithVoid = '<div><img src="test.jpg"><br><input type="text"></div>';
      const result = CodeValidator.validateHTML(htmlWithVoid);
      expect(result.isValid).toBe(true);
    });

    it('rejects unclosed tags', () => {
      const unclosedHTML = '<div><p>Test<div>More</div>';
      const result = CodeValidator.validateHTML(unclosedHTML);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.INVALID_HTML);
    });

    it('rejects mismatched closing tags', () => {
      const mismatchedHTML = '<div><p>Test</div></p>';
      const result = CodeValidator.validateHTML(mismatchedHTML);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCSS', () => {
    it('validates correct CSS', () => {
      const validCSS = '.class { color: red; } #id { margin: 10px; }';
      const result = CodeValidator.validateCSS(validCSS);
      expect(result.isValid).toBe(true);
    });

    it('validates CSS with comments', () => {
      const cssWithComments = '/* Comment */ .class { color: red; }';
      const result = CodeValidator.validateCSS(cssWithComments);
      expect(result.isValid).toBe(true);
    });

    it('rejects unbalanced braces', () => {
      const unbalancedCSS = '.class { color: red; } #id { margin: 10px;';
      const result = CodeValidator.validateCSS(unbalancedCSS);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.INVALID_CSS);
    });

    it('rejects invalid syntax', () => {
      const invalidCSS = 'not valid css at all';
      const result = CodeValidator.validateCSS(invalidCSS);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateJavaScript', () => {
    it('validates correct JavaScript', () => {
      const validJS = 'function test() { return "hello"; }';
      const result = CodeValidator.validateJavaScript(validJS);
      expect(result.isValid).toBe(true);
    });

    it('validates complex bracket combinations', () => {
      const complexJS = 'const arr = [1, 2, {a: "test", b: [3, 4]}];';
      const result = CodeValidator.validateJavaScript(complexJS);
      expect(result.isValid).toBe(true);
    });

    it('rejects unbalanced brackets', () => {
      const unbalancedJS = 'function test() { return [1, 2, 3; }';
      const result = CodeValidator.validateJavaScript(unbalancedJS);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.INVALID_JS);
    });

    it('rejects unclosed strings', () => {
      const unclosedString = 'const str = "hello world;';
      const result = CodeValidator.validateJavaScript(unclosedString);
      expect(result.isValid).toBe(false);
    });

    it('validates escaped quotes in strings', () => {
      const escapedQuotes = 'const str = "He said \\"Hello\\" to me";';
      const result = CodeValidator.validateJavaScript(escapedQuotes);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateSQL', () => {
    it('validates correct SQL', () => {
      const validSQL = 'SELECT * FROM users WHERE id = 1';
      const result = CodeValidator.validateSQL(validSQL);
      expect(result.isValid).toBe(true);
    });

    it('validates case-insensitive keywords', () => {
      const mixedCaseSQL = 'select * FROM Users where ID = 1';
      const result = CodeValidator.validateSQL(mixedCaseSQL);
      expect(result.isValid).toBe(true);
    });

    it('rejects queries without SQL keywords', () => {
      const notSQL = 'This is not a SQL query';
      const result = CodeValidator.validateSQL(notSQL);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.INVALID_SQL);
    });

    it('detects SQL injection attempts', () => {
      const injectionSQL = "SELECT * FROM users WHERE id = 1 OR 1=1";
      const result = CodeValidator.validateSQL(injectionSQL);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.SECURITY_VIOLATION);
    });

    it('detects DROP statements after semicolon', () => {
      const dangerousSQL = "SELECT * FROM users; DROP TABLE users;";
      const result = CodeValidator.validateSQL(dangerousSQL);
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.SECURITY_VIOLATION);
    });
  });

  describe('validateFileSize', () => {
    it('validates file within size limit', () => {
      const result = CodeValidator.validateFileSize(5 * 1024 * 1024, 10); // 5MB, limit 10MB
      expect(result.isValid).toBe(true);
    });

    it('rejects file exceeding size limit', () => {
      const result = CodeValidator.validateFileSize(15 * 1024 * 1024, 10); // 15MB, limit 10MB
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ERROR_CODES.FILE_TOO_LARGE);
    });

    it('uses default size limit when not specified', () => {
      const result = CodeValidator.validateFileSize(11 * 1024 * 1024); // 11MB, default limit 10MB
      expect(result.isValid).toBe(false);
    });
  });
});