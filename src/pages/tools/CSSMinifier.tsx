// src/pages/tools/CSSMinifier.tsx

import BaseMinifier from "@/components/tools/BaseMinifier";

const CSSMinifier = () => {
  const minifyCSS = (input: string): string => {
    return input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolon
      .replace(/,\s*/g, ',') // Remove spaces after comma
      .replace(/:\s*/g, ':') // Remove spaces after colon
      .trim();
  };

  return (
    <BaseMinifier
      title="מקטין CSS"
      subtitle="הקטן את קוד ה-CSS שלך לביצועים טובים יותר"
      toolType="css"
      backPath="/categories/developer-tools"
      placeholder="/* הדבק את קוד ה-CSS שלך כאן */
.button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
}"
      minifyFunction={minifyCSS}
      fileExtension="css"
      mimeType="text/css"
      iconColor="text-blue-600"
    />
  );
};

export default CSSMinifier;