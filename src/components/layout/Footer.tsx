import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('footer.rights', { year: currentYear })}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-primary hover:underline">
            {t('footer.links.about')}
          </Link>
          <Link to="/contact" className="hover:text-primary hover:underline">
            {t('footer.links.contact')}
          </Link>
          <Link to="/privacy-policy" className="hover:text-primary hover:underline">
            {t('footer.links.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;