// Pàgina d'Actualitat · rebranding 2026.
// Hero card amb stripe blau + 4 tabs de categoria + (per a 'noticies')
// pills de mes + cerca + cards de notícia agrupats per mes. Per a les
// altres categories (personalitats, premis, esports) renderitzem el
// directori correponent en seccions amb capçalera coloreada.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Capcalera from '../components/Capcalera';
import { useT } from '../lib/i18n';
import {
  type Noticia, type NoticiaCategoria, groupByMonth, getMonthLabel,
  getMonthBuckets, getMonthKey, getCategory, markNoticiesSeen,
} from '../lib/noticies';
import { useNoticiesAll } from '../lib/noticiesRemote';
import {
  type LeaderSection,
} from '../lib/personalitats';
import { useDirectory } from '../lib/directoriesRemote';

// Metadades visuals de cada categoria — color sòlid (rebranding 2026)
// + emoji + soft background per a estats no-actius.
const CATEGORIES: {
  id: NoticiaCategoria;
  icon: string;
  color: string;
  bg: string;
}[] = [
  { id: 'noticies',      icon: '📰', color: '#2F6BD8', bg: '#EAF1FE' },
  { id: 'personalitats', icon: '👤', color: '#9747D6', bg: '#F5E9FF' },
  { id: 'premis',        icon: '🏆', color: '#E89A1C', bg: '#FFF1D2' },
  { id: 'esports',       icon: '⚽', color: '#1f8a4d', bg: '#DFF7E9' },
];

export default function Noticies() {
  const { t, locale } = useT();
  const noticiesAll = useNoticiesAll();
  const [activeCat, setActiveCat] = useState<NoticiaCategoria>('noticies');
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Marca com a llegides 1.5s després d'entrar.
  useEffect(() => {
    const id = setTimeout(() => markNoticiesSeen(), 1500);
    return () => clearTimeout(id);
  }, []);

  // Quan canvia la categoria, descartem el filtre de mes (no apliquen).
  useEffect(() => {
    setActiveMonth(null);
  }, [activeCat]);

  // Articles de la categoria activa (base per a mes/cerca).
  const inCategory = useMemo(
    () => noticiesAll.filter((n) => getCategory(n) === activeCat),
    [activeCat, noticiesAll],
  );

  const monthBuckets = useMemo(() => getMonthBuckets(inCategory), [inCategory]);

  const filtered = useMemo(() => {
    let list: Noticia[] = inCategory;
    if (activeMonth) {
      list = list.filter((n) => getMonthKey(n.publishedAt) === activeMonth);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((n) =>
        n.title.toLowerCase().includes(q)
        || n.summary.toLowerCase().includes(q)
        || n.body.toLowerCase().includes(q)
        || (n.tags ?? []).some((tg) => tg.toLowerCase().includes(q))
      );
    }
    return list;
  }, [inCategory, activeMonth, query]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);
  const activeCatMeta = CATEGORIES.find((c) => c.id === activeCat) ?? CATEGORIES[0];

  return (
    <div className="v3-page v3-anim">
      <Capcalera
        kicker={t(`noticies.badge`)}
        titol={t(`noticies.title`)}
        lead={t(`noticies.subtitle`)}
        accent={activeCatMeta.color}
      />

      {/* TABS DE CATEGORIA — pills amb color de categoria */}
      <nav
        className="noticies-tabs"
        role="tablist"
        aria-label={t('noticies.title')}
      >
        {CATEGORIES.map((c) => {
          const isActive = activeCat === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCat(c.id)}
              className={'noticies-tab' + (isActive ? ' active' : '')}
              style={{
                ['--accent' as never]: c.color,
                ['--accent-bg' as never]: c.bg,
              } as React.CSSProperties}
            >
              <span className="nt-ico" aria-hidden>{c.icon}</span>
              <span className="nt-label">{t(`noticies.cat.${c.id}`)}</span>
            </button>
          );
        })}
      </nav>

      {/* DIRECTORI DE PERSONALITATS — vista pròpia (no cards) */}
      {activeCat === 'personalitats' && (
        <PersonalitatsDirectory query={query} setQuery={setQuery} />
      )}

      {/* DIRECTORI D'ESPORTS — vista pròpia */}
      {activeCat === 'esports' && (
        <EsportsDirectory query={query} setQuery={setQuery} />
      )}

      {/* DIRECTORI DE PREMIS — vista pròpia */}
      {activeCat === 'premis' && (
        <PremisDirectory query={query} setQuery={setQuery} />
      )}

      {/* La resta de categories utilitzen el sistema d'articles + mes + cerca */}
      {activeCat !== 'personalitats' && activeCat !== 'esports' && activeCat !== 'premis' && (
        <>
          {/* SELECTOR DE MES — segon nivell */}
          {monthBuckets.length > 0 && (
            <section
              className="noticies-months"
              style={{ ['--accent' as never]: activeCatMeta.color } as React.CSSProperties}
            >
              <div className="section-head" style={{ ['--accent' as never]: activeCatMeta.color } as React.CSSProperties}>
                <span className="eyebrow">📅 {t('noticies.byMonth')}</span>
                <span className="rule" />
              </div>
              <div className="month-pills">
                <MonthPill
                  label={t('noticies.allMonths')}
                  active={activeMonth === null}
                  onClick={() => setActiveMonth(null)}
                />
                {monthBuckets.map((m) => (
                  <MonthPill
                    key={m.key}
                    label={getMonthLabel(m.key, locale)}
                    active={activeMonth === m.key}
                    onClick={() => setActiveMonth(m.key)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* CERCA */}
          <div className="noticies-search">
            <span className="ns-icon" aria-hidden>🔎</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('noticies.searchPlaceholder')}
            />
          </div>

          {/* RESULTATS — agrupats per mes */}
          {grouped.length === 0 ? (
            <div className="noticies-empty">
              <div className="ne-icon" aria-hidden>🔍</div>
              <p>{t('noticies.empty')}</p>
            </div>
          ) : (
            <div className="noticies-feed">
              {grouped.map(({ key, items }) => (
                <section key={key} className="noticies-month-group">
                  <div
                    className="section-head"
                    style={{ ['--accent' as never]: activeCatMeta.color } as React.CSSProperties}
                  >
                    <span className="eyebrow">
                      📅 {getMonthLabel(key, locale)}
                    </span>
                    <span className="rule" />
                  </div>
                  <ul className="noticies-list">
                    {items.map((n) => (
                      <li key={n.slug}>
                        <NoticiaCard
                          noticia={n}
                          accent={activeCatMeta.color}
                          accentBg={activeCatMeta.bg}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MonthPill({
  label, active, onClick,
}: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={'month-pill' + (active ? ' active' : '')}
    >
      {label}
    </button>
  );
}

function NoticiaCard({
  noticia, accent, accentBg,
}: {
  noticia: Noticia; accent: string; accentBg: string;
}) {
  const { t } = useT();
  return (
    <Link
      to={`/noticies/${encodeURIComponent(noticia.slug)}`}
      className="noticia-card"
      style={{
        ['--accent' as never]: accent,
        ['--accent-bg' as never]: accentBg,
      } as React.CSSProperties}
    >
      <span className="nc-stripe" aria-hidden />
      <div className="nc-body">
        {noticia.image && (
          <div className="nc-thumb">
            <img
              src={noticia.image}
              alt={noticia.imageAlt ?? ''}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="nc-text">
          <div className="nc-meta">
            <time className="nc-date">{formatDate(noticia.publishedAt)}</time>
            {noticia.featured && (
              <span className="nc-badge featured">⭐ {t('noticies.featured')}</span>
            )}
            {noticia.sourceUrl && (
              <span className="nc-badge source">🔗 {t('noticies.hasSource')}</span>
            )}
          </div>
          <h2 className="nc-title">{noticia.title}</h2>
          <p className="nc-summary">{noticia.summary}</p>
          {noticia.tags && noticia.tags.length > 0 && (
            <div className="nc-tags">
              {noticia.tags.slice(0, 5).map((tg) => (
                <span key={tg} className="nc-tag">{tg}</span>
              ))}
            </div>
          )}
        </div>
        <span className="nc-arr" aria-hidden>→</span>
      </div>
    </Link>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

// ════════════════════════════════════════════════════════════════════
// DIRECTORI DE PERSONALITATS
// ════════════════════════════════════════════════════════════════════

function PersonalitatsDirectory({
  query, setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  const { t } = useT();
  const ACCENT = '#9747D6';
  const ACCENT_BG = '#F5E9FF';
  const { sections: PERSONALITATS_DATA, updatedAt: PERSONALITATS_UPDATED_AT } =
    useDirectory<LeaderSection>('personalitats');

  const q = query.trim().toLowerCase();
  const sections = q
    ? PERSONALITATS_DATA.map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          entries: sub.entries.filter(
            (e) =>
              e.name.toLowerCase().includes(q)
              || e.position.toLowerCase().includes(q)
              || (e.detail ?? '').toLowerCase().includes(q),
          ),
        })).filter((sub) => sub.entries.length > 0),
      })).filter((sec) => sec.subsections.length > 0)
    : PERSONALITATS_DATA;

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <DirectoryLayout
      accent={ACCENT}
      accentBg={ACCENT_BG}
      icon="👤"
      title={t('personalitats.title')}
      subtitle={t('personalitats.subtitle').replace('{date}', formatLongDate(PERSONALITATS_UPDATED_AT))}
      quickNavLabel={t('personalitats.quickNav')}
      sections={PERSONALITATS_DATA}
      onScrollTo={scrollToSection}
      query={query}
      setQuery={setQuery}
      searchPlaceholder={t('personalitats.searchPlaceholder')}
      filteredSections={sections}
      emptyMessage={t('personalitats.empty')}
    />
  );
}

// ════════════════════════════════════════════════════════════════════
// DIRECTORI D'ESPORTS
// ════════════════════════════════════════════════════════════════════

function EsportsDirectory({
  query, setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  const { t } = useT();
  const ACCENT = '#1f8a4d';
  const ACCENT_BG = '#DFF7E9';
  const { sections: ESPORTS_DATA, updatedAt: ESPORTS_UPDATED_AT } =
    useDirectory<LeaderSection>('esports');

  const q = query.trim().toLowerCase();
  const sections = q
    ? ESPORTS_DATA.map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          entries: sub.entries.filter(
            (e) =>
              e.name.toLowerCase().includes(q)
              || e.position.toLowerCase().includes(q)
              || (e.detail ?? '').toLowerCase().includes(q),
          ),
        })).filter((sub) => sub.entries.length > 0),
      })).filter((sec) => sec.subsections.length > 0)
    : ESPORTS_DATA;

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <DirectoryLayout
      accent={ACCENT}
      accentBg={ACCENT_BG}
      icon="⚽"
      title={t('esports.title')}
      subtitle={t('esports.subtitle').replace('{date}', formatLongDate(ESPORTS_UPDATED_AT))}
      quickNavLabel={t('esports.quickNav')}
      sections={ESPORTS_DATA as unknown as LeaderSection[]}
      onScrollTo={scrollToSection}
      query={query}
      setQuery={setQuery}
      searchPlaceholder={t('esports.searchPlaceholder')}
      filteredSections={sections as unknown as LeaderSection[]}
      emptyMessage={t('esports.empty')}
    />
  );
}

// ════════════════════════════════════════════════════════════════════
// DIRECTORI DE PREMIS
// ════════════════════════════════════════════════════════════════════

function PremisDirectory({
  query, setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  const { t } = useT();
  const ACCENT = '#E89A1C';
  const ACCENT_BG = '#FFF1D2';
  const { sections: PREMIS_DATA, updatedAt: PREMIS_UPDATED_AT } =
    useDirectory<LeaderSection>('premis');

  const q = query.trim().toLowerCase();
  const sections = q
    ? PREMIS_DATA.map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          entries: sub.entries.filter(
            (e) =>
              e.name.toLowerCase().includes(q)
              || e.position.toLowerCase().includes(q)
              || (e.detail ?? '').toLowerCase().includes(q),
          ),
        })).filter((sub) => sub.entries.length > 0),
      })).filter((sec) => sec.subsections.length > 0)
    : PREMIS_DATA;

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <DirectoryLayout
      accent={ACCENT}
      accentBg={ACCENT_BG}
      icon="🏆"
      title={t('premis.title')}
      subtitle={t('premis.subtitle').replace('{date}', formatLongDate(PREMIS_UPDATED_AT))}
      quickNavLabel={t('premis.quickNav')}
      sections={PREMIS_DATA as unknown as LeaderSection[]}
      onScrollTo={scrollToSection}
      query={query}
      setQuery={setQuery}
      searchPlaceholder={t('premis.searchPlaceholder')}
      filteredSections={sections as unknown as LeaderSection[]}
      emptyMessage={t('premis.empty')}
    />
  );
}

// Layout reutilitzable per als 3 directoris (Personalitats / Esports /
// Premis). Capçalera amb accent + nav ràpida (pills) + cerca + seccions.
function DirectoryLayout({
  accent, accentBg, icon, title, subtitle, quickNavLabel,
  sections, onScrollTo, query, setQuery, searchPlaceholder,
  filteredSections, emptyMessage,
}: {
  accent: string;
  accentBg: string;
  icon: string;
  title: string;
  subtitle: string;
  quickNavLabel: string;
  sections: LeaderSection[];
  onScrollTo: (id: string) => void;
  query: string;
  setQuery: (q: string) => void;
  searchPlaceholder: string;
  filteredSections: LeaderSection[];
  emptyMessage: string;
}) {
  return (
    <div
      style={{
        ['--accent' as never]: accent,
        ['--accent-bg' as never]: accentBg,
      } as React.CSSProperties}
    >
      {/* Capçalera explicativa de la categoria */}
      <div className="dir-intro">
        <span className="dir-intro-ico" aria-hidden>{icon}</span>
        <div>
          <h2 className="dir-intro-title">{title}</h2>
          <p className="dir-intro-sub">{subtitle}</p>
        </div>
      </div>

      {/* Nav ràpida — pills per saltar a cada secció */}
      <nav className="dir-quicknav" aria-label={quickNavLabel}>
        <div className="section-head" style={{ ['--accent' as never]: accent } as React.CSSProperties}>
          <span className="eyebrow">🧭 {quickNavLabel}</span>
          <span className="rule" />
        </div>
        <div className="dir-pills">
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => onScrollTo(sec.id)}
              className="dir-pill"
            >
              <span aria-hidden>{sec.icon}</span>
              <span>{sec.shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Cerca */}
      <div className="noticies-search">
        <span className="ns-icon" aria-hidden>🔎</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Seccions */}
      {filteredSections.length === 0 ? (
        <div className="noticies-empty">
          <div className="ne-icon" aria-hidden>🔍</div>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="dir-sections">
          {filteredSections.map((sec) => (
            <SectionView key={sec.id} sec={sec} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionView({ sec }: { sec: LeaderSection }) {
  return (
    <section id={sec.id} className="dir-section">
      <header className="dir-section-head">
        <span className="dir-section-icon" aria-hidden>{sec.icon}</span>
        <h2>{sec.title}</h2>
      </header>
      <div className="dir-section-body">
        {sec.subsections.map((sub, i) => (
          <div key={i} className="dir-sub">
            {(sub.title || sub.icon) && (
              <div className="dir-sub-head">
                {sub.icon && <span aria-hidden>{sub.icon}</span>}
                {sub.title && <span className="dir-sub-title">{sub.title}</span>}
              </div>
            )}
            <ul className={'dir-entries' + (sub.compact ? ' compact' : '')}>
              {sub.entries.map((e, j) => (
                <li key={j} className="dir-entry">
                  {e.flag && (
                    <span className="dir-entry-flag" aria-hidden>{e.flag}</span>
                  )}
                  <div className="dir-entry-text">
                    <div className="dir-entry-pos">{e.position}</div>
                    <div className="dir-entry-name">{e.name}</div>
                    {e.detail && (
                      <div className="dir-entry-detail">{e.detail}</div>
                    )}
                  </div>
                  {e.recent && (
                    <span className="dir-entry-new">🔴 Nou</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatLongDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}
