// src/pages/tools/HTMLFormatter.tsx

import BaseFormatter from "@/components/tools/BaseFormatter";

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

  return (
    <BaseFormatter
      title="מעצב HTML"
      subtitle="עצב וניקה קוד HTML בצורה אוטומטית"
      toolType="html"
      backPath="/categories/developer-tools"
      placeholder="הדבק כאן קוד HTML..."
      defaultValue='<html><head><title>Example</title></head><body><div class="container"><h1>Welcome</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>'
      formatFunction={formatHTML}
      fileExtension="html"
      mimeType="text/html"
      iconColor="text-orange-600"
    />
  );
};

export default HTMLFormatter;