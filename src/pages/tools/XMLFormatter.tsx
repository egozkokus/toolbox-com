// src/pages/tools/XMLFormatter.tsx

import BaseFormatter from "@/components/tools/BaseFormatter";

const XMLFormatter = () => {
  const formatXML = (input: string): { formatted: string; error?: string } => {
    try {
      // Basic XML validation
      const openTags = (input.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (input.match(/<\/[^>]+>/g) || []).length;
      
      if (openTags !== closeTags) {
        return { formatted: '', error: 'XML לא תקין - מספר תגיות פתיחה וסגירה לא תואם' };
      }

      let formatted = input
        .replace(/>\s*</g, '>\n<')
        .replace(/^\s+|\s+$/gm, '');

      const lines = formatted.split('\n');
      let indentLevel = 0;
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        // Self-closing tags don't affect indentation
        if (trimmed.match(/^<[^>]+\/>/)) {
          return '  '.repeat(indentLevel) + trimmed;
        }

        // Closing tags decrease indent before the line
        if (trimmed.match(/^<\/[^>]+>/)) {
          indentLevel = Math.max(0, indentLevel - 1);
          return '  '.repeat(indentLevel) + trimmed;
        }

        // Opening tags increase indent after the line
        const result = '  '.repeat(indentLevel) + trimmed;
        if (trimmed.match(/^<[^/][^>]*>/) && !trimmed.match(/<\/[^>]+>$/)) {
          indentLevel++;
        }

        return result;
      });

      formatted = formattedLines.filter(line => line.trim()).join('\n');

      return { formatted };
    } catch (err) {
      return { formatted: '', error: 'שגיאה בעיצוב XML' };
    }
  };

  return (
    <BaseFormatter
      title="מעצב XML"
      subtitle="עצב ואמת קוד XML בצורה אוטומטית"
      toolType="xml"
      backPath="/categories/developer-tools"
      placeholder="הדבק כאן קוד XML..."
      defaultValue='<?xml version="1.0" encoding="UTF-8"?><users><user id="1"><name>John Doe</name><email>john@example.com</email><roles><role>admin</role><role>user</role></roles></user><user id="2"><name>Jane Smith</name><email>jane@example.com</email><roles><role>user</role></roles></user></users>'
      formatFunction={formatXML}
      fileExtension="xml"
      mimeType="application/xml"
      iconColor="text-green-600"
    />
  );
};

export default XMLFormatter;