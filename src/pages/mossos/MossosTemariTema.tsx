// Pàgina d'un tema concret del temari de Mossos · disseny modern.
// Extreu del Markdown el bloc "Síntesi del tema" i les seccions
// numerades "## N. Títol", i les renderitza amb un layout de hero +
// índex (TOC) + seccions amb capçalera de color, igual que les fitxes
// HTML del rebranding 2026.
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AMBIT_META, getTemesByAmbit, getTema, type MossosAmbit } from '../../lib/mossosTemari';
import { Markdown } from '../../lib/markdown';
import { useT } from '../../lib/i18n';

const VALID: MossosAmbit[] = ['A', 'B', 'C'];

// Estructura derivada del Markdown.
type TemaParts = {
  syntesi: string | null;       // contingut del "## Síntesi del tema"
  sections: TemaSection[];      // seccions "## N. Títol"
};

type TemaSection = {
  num: number;
  title: string;
  id: string;
  body: string;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Talla el cos del Markdown en (a) síntesi i (b) seccions numerades.
// Tot el que no encaixa en seccions numerades queda a "extra" i es
// concatena a la primera secció (cas remot, però evita pèrdues).
function parseTema(body: string): TemaParts {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  // Saltar el primer H1 i el blockquote inicial > **Àmbit**: ...
  let i = 0;
  while (i < lines.length && /^\s*$/.test(lines[i])) i++;
  if (i < lines.length && /^#\s+/.test(lines[i])) i++;
  while (i < lines.length && /^\s*$/.test(lines[i])) i++;
  while (i < lines.length && /^>/.test(lines[i])) i++;
  while (i < lines.length && /^\s*$/.test(lines[i])) i++;

  let syntesi: string | null = null;
  const sections: TemaSection[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const hSyn = line.match(/^##\s+S[ií]ntesi(?:\s+del\s+tema)?\s*$/i);
    const hNum = line.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (hSyn) {
      i++;
      const buf: string[] = [];
      while (i < lines.length && !/^##\s+/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      syntesi = buf.join('\n').trim();
      continue;
    }
    if (hNum) {
      const num = parseInt(hNum[1], 10);
      const title = hNum[2].trim();
      i++;
      const buf: string[] = [];
      while (i < lines.length && !/^##\s+/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      sections.push({
        num,
        title,
        id: `s-${num}-${slugify(title)}`,
        body: buf.join('\n').trim(),
      });
      continue;
    }
    // Línia que no encaixa: la posem com a "intro" abans de la primera secció.
    // Si ja hi ha seccions, la concatenem a la darrera. Altrament, a syntesi.
    const stray: string[] = [];
    while (i < lines.length && !/^##\s+/.test(lines[i])) {
      stray.push(lines[i]);
      i++;
    }
    const text = stray.join('\n').trim();
    if (text) {
      if (sections.length > 0) {
        sections[sections.length - 1].body += '\n\n' + text;
      } else if (syntesi) {
        syntesi += '\n\n' + text;
      } else {
        syntesi = text;
      }
    }
  }
  return { syntesi, sections };
}

// Hook molt simple per resaltar la secció activa al TOC en fer scroll.
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    if (ids.length === 0) return;
    function onScroll() {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - 120 <= 0) current = id;
        else break;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);
  return active;
}

export default function MossosTemariTema() {
  const { ambit: rawAmbit = '', slug = '' } = useParams();
  const { t } = useT();
  const ambit = rawAmbit.toUpperCase() as MossosAmbit;

  const tema = useMemo(
    () => (VALID.includes(ambit) ? getTema(ambit, slug) : undefined),
    [ambit, slug],
  );

  const parts = useMemo<TemaParts>(
    () => (tema ? parseTema(tema.body) : { syntesi: null, sections: [] }),
    [tema],
  );

  const sectionIds = useMemo(() => parts.sections.map((s) => s.id), [parts]);
  const active = useActiveSection(sectionIds);

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
    <article
      className="shell temari-doc"
      style={{
        ['--accent' as never]: meta.color,
        ['--accent-bg' as never]: meta.bg,
        maxWidth: 1100,
      } as React.CSSProperties}
    >
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

      {/* HERO */}
      <header
        className="temari-hero"
        style={{
          ['--accent' as never]: meta.color,
          ['--accent-bg' as never]: meta.bg,
        } as React.CSSProperties}
      >
        <div className="temari-hero-meta">
          <span className="temari-hero-tag">
            <span aria-hidden>{meta.icon}</span>
            {meta.short.toUpperCase()} · TEMA {tema.tema}
          </span>
        </div>
        <h1 className="temari-hero-title">{tema.shortTitle}</h1>
        {parts.syntesi && (
          <div className="temari-syntesi">
            <span className="temari-syntesi-tag">🧭 Síntesi</span>
            <div className="temari-syntesi-body">
              <Markdown source={parts.syntesi} />
            </div>
          </div>
        )}
      </header>

      {/* TOC chips (mobile) */}
      {parts.sections.length > 0 && (
        <nav className="temari-toc-mobile" aria-label="Índex del tema">
          {parts.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="temari-toc-chip">
              <span className="n">{s.num}</span>
              <span className="t">{s.title}</span>
            </a>
          ))}
        </nav>
      )}

      <div className="temari-layout">
        {/* SECCIONS */}
        <div className="temari-main">
          {parts.sections.length === 0 ? (
            <div className="temari-section">
              <Markdown source={tema.body} />
            </div>
          ) : (
            parts.sections.map((s) => (
              <section key={s.id} id={s.id} className="temari-section">
                <header className="temari-section-head">
                  <span className="temari-section-num">{s.num}</span>
                  <h2 className="temari-section-title">{s.title}</h2>
                </header>
                <div className="temari-section-body">
                  <Markdown source={s.body} />
                </div>
              </section>
            ))
          )}
        </div>

        {/* TOC desktop sticky */}
        {parts.sections.length > 0 && (
          <aside className="temari-toc" aria-label="Índex del tema">
            <div className="temari-toc-head">
              <span className="eyebrow">📑 Índex</span>
            </div>
            <ol className="temari-toc-list">
              {parts.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={
                      'temari-toc-link' + (active === s.id ? ' active' : '')
                    }
                  >
                    <span className="n">{s.num}</span>
                    <span className="t">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        )}
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
