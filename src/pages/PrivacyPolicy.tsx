import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
    const { t } = useTranslation();
    const siteName = t('site.title'); // Load siteName from translations

    return (
        <>
            <Helmet>
                <title>{t('privacy_policy_page.meta_title')} | {siteName}</title>
                <meta name="description" content={t('privacy_policy_page.meta_description', { siteName })} />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">{t('privacy_policy_page.title', { siteName })}</h1>

                <div className="prose dark:prose-invert max-w-none space-y-4">
                    <p>
                        <strong>{t('privacy_policy_page.effective_date_label')}</strong> {t('privacy_policy_page.effective_date_value')}
                    </p>
                    <p>
                        {t('privacy_policy_page.intro_p1', { siteName })}
                    </p>
                    <ul>
                        <li>
                            <Trans i18nKey="privacy_policy_page.principles_li1">
                                <strong/>
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey="privacy_policy_page.principles_li2">
                                <strong/>
                            </Trans>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-6">{t('privacy_policy_page.data_tools_title')}</h2>
                    <p>
                        <Trans i18nKey="privacy_policy_page.data_tools_p1">
                            <strong/>
                        </Trans>
                    </p>

                    <h2 className="text-2xl font-semibold mt-6">{t('privacy_policy_page.analytics_title')}</h2>
                    <p>
                        {t('privacy_policy_page.analytics_p1')}
                    </p>

                    <h2 className="text-2xl font-semibold mt-6">{t('privacy_policy_page.cookies_title')}</h2>
                    <p>
                        {t('privacy_policy_page.cookies_p1')}
                    </p>
                    <p>
                        <Trans i18nKey="privacy_policy_page.cookies_p2">
                            <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"></a>
                        </Trans>
                    </p>

                    <h2 className="text-2xl font-semibold mt-6">{t('privacy_policy_page.changes_title')}</h2>
                    <p>
                        {t('privacy_policy_page.changes_p1', { siteName })}
                    </p>
                     <h2 className="text-2xl font-semibold mt-6">{t('privacy_policy_page.contact_title')}</h2>
                     <p>
                        <Trans i18nKey="privacy_policy_page.contact_p1">
                            <a href="/contact" className="text-blue-600 hover:underline"></a>
                        </Trans>
                    </p>
                </div>
            </div>
        </>
    );
}