// src/pages/tools/JSMinifier.tsx

import BaseMinifier from "@/components/tools/BaseMinifier";

const JSMinifier = () => {
  const minifyJS = (input: string): string => {
    return input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Replace multiple spaces
      .replace(/\s*([{}()[\],;:=<>+\-*/%&|^!~?])\s*/g, '$1') // Remove spaces around operators
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*\n\s*/g, '') // Remove line breaks
      .trim();
  };

  return (
    <BaseMinifier
      title="מקטין JavaScript"
      subtitle="הקטן את קוד ה-JavaScript שלך לביצועים טובים יותר"
      toolType="js"
      backPath="/categories/developer-tools"
      placeholder="// הדבק את קוד ה-JavaScript שלך כאן
function greetUser(name) {
  // This is a greeting function
  console.log('Hello, ' + name + '!');
  return name;
}"
      minifyFunction={minifyJS}
      fileExtension="js"
      mimeType="application/javascript"
      iconColor="text-yellow-600"
    />
  );
};

export default JSMinifier;