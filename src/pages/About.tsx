import { useTranslation, Trans } from 'react-i18next';
// אם יש לך רכיב כותרת משותף, תוכל לייבא אותו
// import { PageHeader } from '@/components/common/PageHeader';

export default function About() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            {/* כותרת העמוד */}
            <h1 className="text-3xl font-bold mb-4">{t('about_page.title')}</h1>

            <div className="prose dark:prose-invert max-w-none space-y-4">
                <p className="text-lg">
                    {t('about_page.welcome')}
                </p>
                <p>
                    {t('about_page.intro')}
                </p>
                <p>
                    {t('about_page.philosophy')}
                </p>

                {/* קטע יצירת הקשר */}
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                    <h2 className="text-2xl font-semibold">{t('about_page.contact_title')}</h2>
                    <p>
                        <Trans i18nKey="about_page.contact_intro">
                            {/* The text with the link will be injected here from the JSON file */}
                            <a href="mailto:your-email@example.com" className="text-blue-600 hover:underline"></a>
                        </Trans>
                    </p>
                </div>
            </div>
        </div>
    );
}