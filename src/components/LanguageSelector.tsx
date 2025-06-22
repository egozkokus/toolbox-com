import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

// הגדרת השפות הנתמכות
const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    // הוסף כאן שפות נוספות בעתיד
    // { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const LanguageSelector = () => {
  // שימוש ב-hook החדש לקבלת השפה הנוכחית ופונקציית השינוי
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // עדכון כיוון הכתיבה של הדף
    document.documentElement.dir = i18n.dir(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32 justify-start">
          <Globe className="h-4 w-4 mr-2" />
          <span>{currentLanguage?.name || 'Language'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup 
          value={i18n.language} 
          onValueChange={changeLanguage}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;