// Política de privacitat — explicació de què es desa i per què.
import { useT } from '../lib/i18n';

export default function Privacitat() {
  const { t, locale } = useT();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 prose-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">{t('privacy.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('privacy.updated')}: 27/04/2026
        </p>
      </header>

      <Section title={t('privacy.s1.title')}>
        <p>{t('privacy.s1.p1')}</p>
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
          {t('privacy.s1.highlight')}
        </p>
      </Section>

      <Section title={t('privacy.s2.title')}>
        <p>{t('privacy.s2.intro')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>infopol-theme:</strong> {t('privacy.s2.theme')}</li>
          <li><strong>infopol-locale:</strong> {t('privacy.s2.locale')}</li>
          <li><strong>infopol-rgpd:</strong> {t('privacy.s2.rgpd')}</li>
          <li><strong>{t('privacy.s2.swTitle')}:</strong> {t('privacy.s2.sw')}</li>
        </ul>
        <p className="mt-2">{t('privacy.s2.howClear')}</p>
      </Section>

      <Section title={t('privacy.s3.title')}>
        <p>{t('privacy.s3.p1')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{t('privacy.s3.fonts')}</li>
          <li>{t('privacy.s3.maps')}</li>
          <li>{t('privacy.s3.aiac')}</li>
          <li>{t('privacy.s3.farmacia')}</li>
        </ul>
        <p className="mt-2">{t('privacy.s3.note')}</p>
      </Section>

      <Section title={t('privacy.s4.title')}>
        <p>{t('privacy.s4.p1')}</p>
      </Section>

      <Section title={t('privacy.s5.title')}>
        <p>{t('privacy.s5.p1')}</p>
        <p>{t('privacy.s5.contact')}: infopol.app@proton.me</p>
      </Section>

      <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
        {locale === 'ca'
          ? 'Aquesta política pot modificar-se. La versió vigent és la publicada en aquesta pàgina.'
          : 'Esta política puede modificarse. La versión vigente es la publicada en esta página.'}
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-2">{title}</h2>
      <div className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}
