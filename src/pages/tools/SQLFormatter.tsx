// src/pages/tools/SQLFormatter.tsx

import BaseFormatter from "@/components/tools/BaseFormatter";

const SQLFormatter = () => {
  const formatSQL = (input: string): { formatted: string; error?: string } => {
    try {
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
        'INNER JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'AND', 'OR', 
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 
        'ALTER', 'DROP', 'TABLE', 'INDEX', 'AS', 'ON', 'LIMIT', 
        'OFFSET', 'UNION', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 
        'END', 'WITH', 'ASC', 'DESC'
      ];

      let formatted = input;

      // Replace keywords with uppercase
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      });

      // Add new lines after major keywords
      formatted = formatted
        .replace(/\b(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET)\b/g, '\n$1')
        .replace(/\b(AND|OR)\b/g, '\n  $1')
        .replace(/,/g, ',\n  ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Indent subqueries
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentedLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.includes('(')) indentLevel++;
        if (trimmed.includes(')')) indentLevel--;
        
        const indent = '  '.repeat(Math.max(0, indentLevel));
        return indent + trimmed;
      });

      formatted = indentedLines.join('\n');

      return { formatted };
    } catch (err) {
      return { formatted: '', error: 'שגיאה בעיצוב SQL' };
    }
  };

  return (
    <BaseFormatter
      title="מעצב SQL"
      subtitle="עצב שאילתות SQL בצורה אוטומטית"
      toolType="sql"
      backPath="/categories/developer-tools"
      placeholder="הדבק כאן שאילתת SQL..."
      defaultValue="SELECT users.name, users.email, orders.order_date, orders.total FROM users JOIN orders ON users.id = orders.user_id WHERE orders.total > 100 ORDER BY orders.order_date DESC LIMIT 10"
      formatFunction={formatSQL}
      fileExtension="sql"
      mimeType="text/plain"
      iconColor="text-blue-600"
    />
  );
};

export default SQLFormatter;