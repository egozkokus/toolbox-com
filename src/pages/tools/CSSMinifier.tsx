// src/pages/tools/CSSMinifier.tsx

import BaseMinifier from "@/components/tools/BaseMinifier";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  return (
    <BaseMinifier
      title={t('css_minifier_page.title')}
      subtitle={t('css_minifier_page.subtitle')}
      toolType="css"
      backPath="/categories/developer-tools"
      placeholder={t('css_minifier_page.placeholder')}
      minifyFunction={minifyCSS}
      fileExtension="css"
      mimeType="text/css"
      iconColor="text-blue-600"
    />
  );
};

export default CSSMinifier;