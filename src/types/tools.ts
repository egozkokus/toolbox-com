// src/types/tools.ts

export type ToolType = 'css' | 'js' | 'html' | 'sql' | 'xml' | 'json';

export interface ToolConfig {
  title: string;
  subtitle: string;
  type: ToolType;
  backPath: string;
  placeholder: string;
  defaultValue?: string;
  fileExtension: string;
  mimeType: string;
  iconColor: string;
}

export interface ProcessingFunction {
  (input: string): string;
}

export interface FormattingFunction {
  (input: string): { formatted: string; error?: string };
}

export interface ToolMetrics {
  originalSize: number;
  processedSize: number;
  savedPercentage: number;
  processingTime?: number;
}

export const TOOL_CONFIGS: Record<ToolType, Partial<ToolConfig>> = {
  css: {
    fileExtension: 'css',
    mimeType: 'text/css',
    iconColor: 'text-blue-600'
  },
  js: {
    fileExtension: 'js',
    mimeType: 'application/javascript',
    iconColor: 'text-yellow-600'
  },
  html: {
    fileExtension: 'html',
    mimeType: 'text/html',
    iconColor: 'text-orange-600'
  },
  sql: {
    fileExtension: 'sql',
    mimeType: 'text/plain',
    iconColor: 'text-green-600'
  },
  xml: {
    fileExtension: 'xml',
    mimeType: 'application/xml',
    iconColor: 'text-purple-600'
  },
  json: {
    fileExtension: 'json',
    mimeType: 'application/json',
    iconColor: 'text-indigo-600'
  }
};