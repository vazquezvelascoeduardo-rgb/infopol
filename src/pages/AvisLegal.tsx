// Avis legal — pàgina informativa sobre la titularitat i condicions d'ús.
import { useT } from '../lib/i18n';

export default function AvisLegal() {
  const { t, locale } = useT();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 prose-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">
          {t('legal.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('legal.updated')}: 27/04/2026
        </p>
      </header>

      <Section title={t('legal.s1.title')}>
        <p>{t('legal.s1.p1')}</p>
        <ul>
          <li><strong>{t('legal.s1.url')}:</strong> infopol.app</li>
          <li><strong>{t('legal.s1.purpose')}:</strong> {t('legal.s1.purposeDesc')}</li>
          <li><strong>{t('legal.s1.contact')}:</strong> infopol.app@proton.me</li>
        </ul>
      </Section>

      <Section title={t('legal.s2.title')}>
        <p>{t('legal.s2.p1')}</p>
        <p>{t('legal.s2.p2')}</p>
      </Section>

      <Section title={t('legal.s3.title')}>
        <p>{t('legal.s3.p1')}</p>
      </Section>

      <Section title={t('legal.s4.title')}>
        <p>{t('legal.s4.p1')}</p>
      </Section>

      <Section title={t('legal.s5.title')}>
        <p>{t('legal.s5.p1')}</p>
      </Section>

      <Section title={t('legal.s6.title')}>
        <p>{t('legal.s6.p1')}</p>
      </Section>

      <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
        {locale === 'ca'
          ? 'Aquest avís legal pot modificar-se en qualsevol moment. La versió vigent és la publicada en aquesta pàgina.'
          : 'Este aviso legal puede modificarse en cualquier momento. La versión vigente es la publicada en esta página.'}
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
