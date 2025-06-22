import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  return {
    t,
    language: i18n.language,
    setLanguage: (lang: string) => i18n.changeLanguage(lang),
  };
};
