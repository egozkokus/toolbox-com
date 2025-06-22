import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Home, Sun, Moon, Languages } from 'lucide-react';

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  // State to track the current theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Effect to apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    // In your setup, you might be using data-theme attribute
    root.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  // This function now replicates your existing theme logic
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6" />
          <span className="font-bold hidden sm:inline-block">Tools4Anything</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {/* Conditional rendering for the theme icon */}
            {theme === 'light' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Change language</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;