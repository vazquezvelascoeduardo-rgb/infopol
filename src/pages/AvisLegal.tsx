// Avis legal — pàgina informativa sobre la titularitat i condicions d'ús.
import { useT } from '../lib/i18n';
import { A } from '../lib/design';

export default function AvisLegal() {
  const { t, locale } = useT();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 style={{ fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,34px)', letterSpacing: -1, color: A.ink, margin: 0 }}>
          {t('legal.title')}
        </h1>
        <p style={{ marginTop: 6, fontFamily: A.mono, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', color: A.inkMuted }}>
          {t('legal.updated')}: 27/04/2026
        </p>
      </header>

      <Section title={t('legal.s1.title')}>
        <p>{t('legal.s1.p1')}</p>
        <ul>
          <li><strong>{t('legal.s1.url')}:</strong> infopol.app</li>
          <li><strong>{t('legal.s1.purpose')}:</strong> {t('legal.s1.purposeDesc')}</li>
          <li><strong>{t('legal.s1.contact')}:</strong> info@infopol.app</li>
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

      <p className="mt-8 text-xs text-text-3">
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
      <h2 style={{ fontFamily: A.display, fontWeight: 700, fontSize: 18, letterSpacing: -0.4, color: A.terracota, marginBottom: 8 }}>{title}</h2>
      <div className="space-y-2 leading-relaxed" style={{ fontSize: 15, color: A.inkSoft }}>
        {children}
      </div>
    </section>
  );
}
