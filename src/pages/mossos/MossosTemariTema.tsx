// Pàgina d'un tema concret del temari de Mossos.
// Renderitza el markdown amb el chrome estilitzat (crumbs + page-foot
// prev/next), seguint el mateix patró que CardPage de /leyes.
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AMBIT_META, getTemesByAmbit, getTema, type MossosAmbit } from '../../lib/mossosTemari';
import { Markdown } from '../../lib/markdown';
import { useT } from '../../lib/i18n';

const VALID: MossosAmbit[] = ['A', 'B', 'C'];

export default function MossosTemariTema() {
  const { ambit: rawAmbit = '', slug = '' } = useParams();
  const { t } = useT();
  const ambit = rawAmbit.toUpperCase() as MossosAmbit;

  const tema = useMemo(
    () => (VALID.includes(ambit) ? getTema(ambit, slug) : undefined),
    [ambit, slug],
  );

  if (!tema) {
    return (
      <div className="shell py-6">
        <p className="text-text-2">{t('card.notFound')}</p>
        <Link to="/mossos/temari" className="text-terracotta underline">
          ← {t('mossosTemari.title')}
        </Link>
      </div>
    );
  }

  const meta = AMBIT_META[ambit];
  const siblings = getTemesByAmbit(ambit);
  const idx = siblings.findIndex((x) => x.slug === tema.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <article className="shell" style={{ maxWidth: 760 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/mossos">{t('mossos.title')}</Link>
        <span className="sep">/</span>
        <Link to="/mossos/temari">{t('mossosTemari.title')}</Link>
        <span className="sep">/</span>
        <Link
          to={`/mossos/temari/${ambit.toLowerCase()}`}
          className="inline-flex items-center gap-1.5"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: meta.color }}
          />
          {meta.short}
        </Link>
        <span className="sep">/</span>
        <span className="here truncate">Tema {tema.tema}</span>
      </nav>

      <div className="fitxa mt-3">
        <Markdown source={tema.body} />
      </div>

      <div className="page-foot">
        {prev ? (
          <Link
            to={`/mossos/temari/${ambit.toLowerCase()}/${prev.slug}`}
            className="btn btn-ghost"
          >
            ← Tema {prev.tema}
          </Link>
        ) : (
          <Link
            to={`/mossos/temari/${ambit.toLowerCase()}`}
            className="btn btn-ghost"
          >
            ← {meta.short}
          </Link>
        )}
        {next ? (
          <Link
            to={`/mossos/temari/${ambit.toLowerCase()}/${next.slug}`}
            className="btn btn-primary"
          >
            Tema {next.tema} →
          </Link>
        ) : (
          <Link to="/mossos" className="btn btn-primary">
            {t('home.tests.cta')} →
          </Link>
        )}
      </div>
    </article>
  );
}
