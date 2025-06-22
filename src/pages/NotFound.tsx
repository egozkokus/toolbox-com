import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // הוספה

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation(); // הוספה

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">{t('not_found_page.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{t('not_found_page.subtitle')}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t('not_found_page.home_link')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;