// src/pages/tools/JSONFormatter.tsx

import BaseFormatter from "@/components/tools/BaseFormatter";

const JSONFormatter = () => {
  const formatJSON = (input: string): { formatted: string; error?: string } => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      return { formatted };
    } catch (err) {
      return { formatted: '', error: 'JSON לא תקין - בדוק את התחביר' };
    }
  };

  return (
    <BaseFormatter
      title="מעצב JSON"
      subtitle="עצב ואמת נתוני JSON"
      toolType="json"
      backPath="/categories/developer-tools"
      placeholder="הדבק כאן נתוני JSON..."
      defaultValue='{"name":"John Doe","age":30,"email":"john@example.com","active":true,"roles":["admin","user"],"address":{"street":"123 Main St","city":"New York","zip":"10001"}}'
      formatFunction={formatJSON}
      fileExtension="json"
      mimeType="application/json"
      iconColor="text-purple-600"
    />
  );
};

export default JSONFormatter;