// SuperBuscador d'infraccions de Trànsit.
// Cerca transversal a TOT el catàleg SCT 2026 (LSV, RGC, RGCond, RGV,
// Asseguranca i Codi Penal) sense haver de canviar de pestanya.
//
// Estratègia: parseig de l'HTML del catàleg amb DOMParser (lazy, una
// sola vegada, cache en memòria). Cerca multi-paraula amb normalització
// d'accents.
//
// En clicar una fila s'obre un drawer amb tota la informació + un text
// pre-format que es pot copiar directament al butlletí.
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  searchCataleg,
  getCatalegRows,
  getLawColor,
  getCatalegLaws,
  type CatalegRow,
  type Severity,
} from '../lib/cataleg-parser';
import { findOfficialConcept } from '../lib/cataleg-nomenclator';
import { useT } from '../lib/i18n';

export default function Superbuscador() {
  const { t } = useT();
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const [selected, setSelected] = useState<CatalegRow | null>(null);

  const allRows = useMemo(() => getCatalegRows(), []);
  const results = useMemo(() => (dq.length >= 2 ? searchCataleg(dq) : []), [dq]);

  // Agrupem els resultats per llei per visualitzar-los amb capçaleres
  // de color.
  const grouped = useMemo(() => {
    const m = new Map<string, CatalegRow[]>();
    for (const r of results) {
      if (!m.has(r.lawId)) m.set(r.lawId, []);
      m.get(r.lawId)!.push(r);
    }
    return [...m.entries()];
  }, [results]);

  const laws = getCatalegLaws();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('superbuscador.title')}</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border p-5 sm:p-6 mb-4
        border-purple-200/70 bg-gradient-to-br from-purple-50/60 via-white to-fuchsia-50/40
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a0f2e] dark:to-[#0a1628]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-700 text-3xl text-white shadow-inner">
            💸
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-purple-700 dark:text-purple-400/90">
              {t('superbuscador.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('superbuscador.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('superbuscador.subtitle')}
            </p>
            {/* Etiquetes de les lleis indexades */}
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {laws.map((l) => (
                <li
                  key={l.id}
                  className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-mono"
                  style={{
                    borderColor: getLawColor(l.id) + '60',
                    color: getLawColor(l.id),
                    backgroundColor: getLawColor(l.id) + '10',
                  }}
                  title={l.full}
                >
                  {l.short}
                </li>
              ))}
              <li className="ml-1 text-[11px] text-slate-500 dark:text-slate-400 self-center">
                · {allRows.length} {t('superbuscador.totalRows')}
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Input gran */}
      <div className="relative mb-4">
        <svg
          aria-hidden
          width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('superbuscador.placeholder')}
          className="w-full rounded-2xl border-2 pl-12 pr-4 py-3.5 text-base outline-none
            border-slate-200 bg-white text-slate-900 placeholder-slate-400
            focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20
            dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500
            dark:focus:border-purple-400/60 dark:focus:ring-purple-400/20"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label={t('superbuscador.clear')}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full
              text-slate-400 hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-white/10 dark:hover:text-slate-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Resultats */}
      {q.length === 0 && (
        <EmptyState />
      )}
      {q.length > 0 && q.length < 2 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          {t('superbuscador.minChars')}
        </p>
      )}
      {q.length >= 2 && results.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm
          border-slate-300 bg-slate-50/50 text-slate-500
          dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
          {t('superbuscador.noResults')} <span className="font-semibold">"{q}"</span>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="mb-4 text-sm">
            <span className="font-bold text-purple-700 dark:text-purple-400">{results.length}</span>
            <span className="text-slate-600 dark:text-slate-400">
              {' '}{t('superbuscador.resultsFound')}
            </span>
          </p>

          <div className="space-y-6">
            {grouped.map(([lawId, items]) => (
              <LawSection key={lawId} lawId={lawId} items={items} q={dq} onSelect={setSelected} />
            ))}
          </div>
        </>
      )}

      <DetailDrawer row={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function EmptyState() {
  const { t } = useT();
  return (
    <div className="rounded-xl border border-dashed p-8 text-center
      border-slate-300 bg-slate-50/50
      dark:border-white/15 dark:bg-white/5">
      <div className="text-4xl mb-2" aria-hidden>💡</div>
      <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
        {t('superbuscador.tipsTitle')}
      </p>
      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 max-w-md mx-auto">
        <li>• <span className="font-mono">{t('superbuscador.tip1.examples')}</span></li>
        <li>• {t('superbuscador.tip2.byArticle')}: <span className="font-mono">14.1</span>, <span className="font-mono">76.l</span>, <span className="font-mono">art. 47</span>...</li>
        <li>• {t('superbuscador.tip3.byFine')}: <span className="font-mono">500</span>, <span className="font-mono">1000</span>...</li>
        <li>• {t('superbuscador.tip4.multiword')}: <span className="font-mono">{t('superbuscador.tip4.examples')}</span></li>
      </ul>
    </div>
  );
}

function LawSection({
  lawId,
  items,
  q,
  onSelect,
}: {
  lawId: string;
  items: CatalegRow[];
  q: string;
  onSelect: (row: CatalegRow) => void;
}) {
  const color = getLawColor(lawId);
  const lawShort = items[0].lawShort;
  const lawFull = items[0].lawFull;

  return (
    <section>
      <div
        className="flex items-center gap-3 mb-2 px-3 py-2 rounded-xl"
        style={{ backgroundColor: color + '14', borderLeft: `4px solid ${color}` }}
      >
        <span className="font-mono font-bold text-sm" style={{ color }}>
          {lawShort}
        </span>
        <span className="text-xs font-medium opacity-80" style={{ color }}>
          {lawFull}
        </span>
        <span className="ml-auto text-xs font-mono opacity-70" style={{ color }}>
          {items.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((r, i) => (
          <ResultRow key={i} row={r} q={q} color={color} onSelect={onSelect} />
        ))}
      </ul>
    </section>
  );
}

function ResultRow({
  row,
  q,
  color,
  onSelect,
}: {
  row: CatalegRow;
  q: string;
  color: string;
  onSelect: (row: CatalegRow) => void;
}) {
  // Compose context: section title + subgroup (when present)
  const ctx = [row.sectionTitle, row.subgroup].filter(Boolean).join(' · ');
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => onSelect(row)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(row);
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-3 items-start
        rounded-xl border p-3 cursor-pointer transition
        border-slate-200/80 bg-white
        hover:border-purple-400 hover:shadow-[0_2px_8px_-2px_rgba(168,85,247,0.18)] active:scale-[0.998]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60
        dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-purple-400/40"
      style={{ borderLeftWidth: '4px', borderLeftColor: color }}
    >
      {/* Concepte amb context al damunt (si en té) */}
      <div className="min-w-0 sm:pr-3">
        {ctx && (
          <div
            className="text-[10px] uppercase tracking-wider font-semibold mb-0.5 truncate"
            style={{ color }}
            title={ctx}
          >
            <HighlightText text={ctx} query={q} />
          </div>
        )}
        <div className="text-sm leading-snug text-slate-900 dark:text-slate-100">
          <HighlightText text={row.concepte} query={q} />
        </div>
      </div>

      {/* Article */}
      {row.article && (
        <span
          className="rounded-md border px-2 py-0.5 text-xs font-mono whitespace-nowrap self-start
            bg-amber-50 text-amber-800 border-amber-200
            dark:bg-amber-400/10 dark:text-amber-200 dark:border-amber-400/30"
        >
          §{row.article}
        </span>
      )}

      {/* Gravetat */}
      {row.severity && <SeverityPill severity={row.severity} />}

      {/* Multa + DTE */}
      {row.fine && (
        <div className="flex flex-col items-start sm:items-end gap-0.5">
          <span className="rounded-md border px-2 py-0.5 text-xs font-mono font-bold whitespace-nowrap
            bg-emerald-50 text-emerald-800 border-emerald-200
            dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/30">
            {row.fine}{isNumericFine(row.fine) ? ' €' : ''}
          </span>
          {row.dte && row.dte !== '—' && isNumericFine(row.dte) && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              DTE: {row.dte} €
            </span>
          )}
        </div>
      )}

      {/* Punts */}
      {row.points && (
        <span className="rounded-md border px-2 py-0.5 text-xs font-mono font-bold whitespace-nowrap self-start
          bg-red-50 text-red-800 border-red-200
          dark:bg-red-400/10 dark:text-red-200 dark:border-red-400/30">
          –{row.points} pts
        </span>
      )}
    </li>
  );
}

function SeverityPill({ severity }: { severity: Severity }) {
  const { t } = useT();
  const meta: Record<Severity, { label: string; cls: string }> = {
    MG: {
      label: 'MG',
      cls:
        'bg-red-100 text-red-800 border-red-300 dark:bg-red-400/15 dark:text-red-200 dark:border-red-400/40',
    },
    G: {
      label: 'G',
      cls:
        'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-400/40',
    },
    L: {
      label: 'L',
      cls:
        'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-400/15 dark:text-blue-200 dark:border-blue-400/40',
    },
  };
  const m = meta[severity];
  const title = severity === 'MG'
    ? t('superbuscador.veryGrave')
    : severity === 'G'
    ? t('superbuscador.grave')
    : t('superbuscador.minor');
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-xs font-bold whitespace-nowrap self-start ${m.cls}`}
      title={title}
    >
      {m.label}
    </span>
  );
}

function isNumericFine(s: string): boolean {
  // Si comença per dígit (eventualment amb separador de milers).
  return /^\d/.test(s.replace(/\./g, ''));
}

/**
 * Component que ressalta les coincidencies del query dins el text.
 * Retorna spans React purs (sense innerHTML) per blindar contra XSS:
 * tot el text passa per React i s'escapa automaticament.
 */
function HighlightText({ text, query }: { text: string; query: string }) {
  const tokens = query.trim().split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return <>{text}</>;
  // Construeix un RegExp amb totes les tokens (cap escapada de HTML cal:
  // React s'encarrega d'escapar el text final).
  const re = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'ig');
  const parts = text.split(re);
  // Set en minúscules per identificar quines parts són matches (sense
  // el problema d'estat de regex /g).
  const lower = new Set(tokens.map((tk) => tk.toLowerCase()));
  return (
    <>
      {parts.map((part, i) =>
        lower.has(part.toLowerCase()) ? (
          <mark
            key={i}
            className="rounded px-0.5 bg-purple-200/80 text-purple-900 dark:bg-purple-400/30 dark:text-purple-100"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Drawer de detall ─────────────────────────────────────────────
// S'obre quan l'usuari clica una fila. Mostra tota la informació
// estructurada + un text pre-format per copiar al butlletí.

// Cerca el concepte oficial del nomenclàtor (Operativa › Trànsit) per
// a aquesta fila. Si en troba, retorna el text canònic del butlletí;
// si no, retorna el concepte literal de la fila.
function pickOfficialConcept(row: CatalegRow): { text: string; official: boolean } {
  const found = findOfficialConcept(row.lawId, row.article, row.concepte);
  if (found) return { text: found.concept, official: true };
  return { text: row.concepte, official: false };
}

function buildBoletinText(row: CatalegRow): string {
  // Format orientat a butlletí policial: concepte oficial (nomenclàtor
  // SCT 2026) + article + llei + gravetat + multa (€) + DTE (50%) +
  // punts. Línia única i clara.
  const parts: string[] = [];
  parts.push(pickOfficialConcept(row).text);
  const lawRef =
    row.article && row.article !== '—'
      ? `${row.lawShort} art. ${row.article}`
      : row.lawShort;
  parts.push(`(${lawRef})`);
  if (row.severity) {
    const sev = row.severity === 'MG' ? 'Molt greu' : row.severity === 'G' ? 'Greu' : 'Lleu';
    parts.push(`— ${sev}`);
  }
  if (row.fine) {
    const eur = isNumericFine(row.fine) ? `${row.fine}€` : row.fine;
    parts.push(`— Multa ${eur}`);
  }
  if (row.dte && isNumericFine(row.dte)) parts.push(`(DTE 50% ${row.dte}€)`);
  if (row.points) parts.push(`— ${row.points} punts`);
  return parts.join(' ');
}

function DetailDrawer({ row, onClose }: { row: CatalegRow | null; onClose: () => void }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  // Tanca amb Escape + bloqueja l'scroll del body mentre està oberta.
  useEffect(() => {
    if (!row) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [row, onClose]);

  // Reinicia l'estat "copiat" quan canviem de fila.
  useEffect(() => {
    setCopied(false);
  }, [row]);

  if (!row) return null;
  const color = getLawColor(row.lawId);
  const ctx = [row.sectionTitle, row.subgroup].filter(Boolean).join(' · ');
  const official = pickOfficialConcept(row);
  const boletinText = buildBoletinText(row);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(boletinText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API pot fallar a iframes/insecure: ignorem en silenci.
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={row.concepte}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <button
        aria-label="Tancar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto
          rounded-t-2xl sm:rounded-2xl shadow-2xl
          bg-white text-slate-900
          dark:bg-[#0f1d34] dark:text-slate-100"
        style={{ borderTop: `4px solid ${color}` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 sm:px-5 py-3 border-b
          bg-white/95 backdrop-blur
          border-slate-200
          dark:bg-[#0f1d34]/95 dark:border-white/10">
          <span
            className="font-mono font-bold text-sm rounded-md px-2 py-0.5"
            style={{ backgroundColor: color + '18', color }}
          >
            {row.lawShort}
          </span>
          <span className="text-xs opacity-70 truncate">{row.lawFull}</span>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 -mr-1
              text-slate-500 hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Tancar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Cos */}
        <div className="px-4 sm:px-5 py-4 space-y-4">
          {ctx && (
            <div
              className="text-[11px] uppercase tracking-wider font-semibold"
              style={{ color }}
            >
              {ctx}
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-bold leading-snug">{official.text}</h2>
          {official.official && (
            <p className="text-[11px] inline-flex items-center gap-1.5 rounded-md px-2 py-1
              bg-emerald-50 text-emerald-800 border border-emerald-200
              dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/30">
              <span aria-hidden>✓</span>
              {t('superbuscador.detail.official')}
            </p>
          )}

          {/* Grid d'atributs: article / gravetat / multa / DTE / punts */}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm">
            {row.article && (
              <Attribute
                label={t('superbuscador.detail.article')}
                value={`§ ${row.article}`}
                tone="amber"
              />
            )}
            {row.severity && (
              <Attribute
                label={t('superbuscador.detail.severity')}
                value={
                  row.severity === 'MG'
                    ? t('superbuscador.veryGrave')
                    : row.severity === 'G'
                    ? t('superbuscador.grave')
                    : t('superbuscador.minor')
                }
                tone={row.severity === 'MG' ? 'red' : row.severity === 'G' ? 'amber' : 'blue'}
              />
            )}
            {row.fine && (
              <Attribute
                label={t('superbuscador.detail.fine')}
                value={isNumericFine(row.fine) ? `${row.fine} €` : row.fine}
                tone="emerald"
              />
            )}
            {row.dte && row.dte !== '—' && isNumericFine(row.dte) && (
              <Attribute
                label={t('superbuscador.detail.dte')}
                value={`${row.dte} €`}
                tone="emerald"
              />
            )}
            {row.points && (
              <Attribute
                label={t('superbuscador.detail.points')}
                value={`– ${row.points}`}
                tone="red"
              />
            )}
          </dl>

          {/* Bloc del butlletí */}
          <section
            className="rounded-xl border p-4
              border-purple-200 bg-purple-50/40
              dark:border-purple-400/30 dark:bg-purple-400/10"
          >
            <div className="flex items-center justify-between mb-2 gap-2">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-purple-700 dark:text-purple-300">
                {t('superbuscador.detail.boletinTitle')}
              </h3>
              <button
                onClick={copyText}
                className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold
                  border-purple-300 bg-white text-purple-800 hover:bg-purple-100
                  dark:border-purple-400/40 dark:bg-purple-400/10 dark:text-purple-100 dark:hover:bg-purple-400/20"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {t('superbuscador.detail.copied')}
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                    {t('superbuscador.detail.copy')}
                  </>
                )}
              </button>
            </div>
            <p className="text-sm leading-relaxed font-mono text-slate-800 dark:text-slate-100">
              {boletinText}
            </p>
          </section>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('superbuscador.detail.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}

function Attribute({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'amber' | 'red' | 'emerald' | 'blue';
}) {
  const cls = {
    amber:
      'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:border-amber-400/30',
    red:
      'bg-red-50 text-red-900 border-red-200 dark:bg-red-400/10 dark:text-red-200 dark:border-red-400/30',
    emerald:
      'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/30',
    blue:
      'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-400/10 dark:text-blue-200 dark:border-blue-400/30',
  }[tone];
  return (
    <div className={`rounded-lg border px-3 py-2 ${cls}`}>
      <dt className="text-[10px] uppercase tracking-wider font-semibold opacity-75">{label}</dt>
      <dd className="mt-0.5 font-mono font-bold text-sm">{value}</dd>
    </div>
  );
}
