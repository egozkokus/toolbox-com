import { useTranslation, Trans } from 'react-i18next';

export default function Contact() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{t('contact_page.title')}</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p>
                    <Trans i18nKey="contact_page.intro">
                        {/* The text with the link will be injected here from the JSON file */}
                        <a href="mailto:tools4anything@google.com" className="text-blue-600 hover:underline"></a>
                    </Trans>
                </p>
            </div>
        </div>
    );
}