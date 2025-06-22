// src/pages/tools/HTMLMinifier.tsx

import BaseMinifier from "@/components/tools/BaseMinifier";

const HTMLMinifier = () => {
  const minifyHTML = (input: string): string => {
    return input
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s+/g, ' ') // Replace multiple spaces
      .replace(/>\s/g, '>') // Remove spaces after tags
      .replace(/\s</g, '<') // Remove spaces before tags
      .replace(/\s+\/>/g, '/>') // Clean self-closing tags
      .trim();
  };

  return (
    <BaseMinifier
      title="מקטין HTML"
      subtitle="הקטן את קוד ה-HTML שלך לביצועים טובים יותר"
      toolType="html"
      backPath="/categories/developer-tools"
      placeholder="<!-- הדבק את קוד ה-HTML שלך כאן -->
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </body>
</html>"
      minifyFunction={minifyHTML}
      fileExtension="html"
      mimeType="text/html"
      iconColor="text-red-600"
    />
  );
};

export default HTMLMinifier;