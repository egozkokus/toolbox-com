// src/pages/tools/HTMLFormatter.tsx

import BaseFormatter from "@/components/tools/BaseFormatter";
import { useTranslation } from "react-i18next";

const HTMLFormatter = () => {
  const formatHTML = (input: string): { formatted: string; error?: string } => {
    try {
      const formatted = input
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/gm, '')
        .split('\n')
        .map((line, index, array) => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          
          let indent = 0;
          for (let i = 0; i < index; i++) {
            const prevLine = array[i].trim();
            if (prevLine.match(/<[^/][^>]*[^/]>$/)) {
              indent++;
            }
            if (prevLine.match(/<\/[^>]+>$/)) {
              indent--;
            }
          }
          
          if (trimmed.match(/^<\/[^>]+>$/)) {
            indent--;
          }
          
          return '  '.repeat(Math.max(0, indent)) + trimmed;
        })
        .filter(line => line.trim())
        .join('\n');

      return { formatted };
    } catch (err) {
      return { formatted: '', error: 'שגיאה בעיצוב HTML' };
    }
  };

  const { t } = useTranslation();

  return (
    <BaseFormatter
      title={t('html_formatter_page.title')}
      subtitle={t('html_formatter_page.subtitle')}
      toolType="html"
      backPath="/categories/developer-tools"
      placeholder={t('html_formatter_page.placeholder')}
      defaultValue='<html><head><title>Example</title></head><body><div class="container"><h1>Welcome</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>'
      formatFunction={formatHTML}
      fileExtension="html"
      mimeType="text/html"
      iconColor="text-orange-600"
    />
  );
};

export default HTMLFormatter;