// Pàgina de resultats de cerca.
// Cerca a 2 corpus diferents:
//   1) LLEIS — fitxes HTML/MD del temari (mòdul Lleis)
//   2) OPERATIVA — checklists interactius de Trànsit i Penal
// Els resultats es mostren en seccions separades, amb Operativa
// primer (sol ser el que un agent vol trobar abans).
import { Link, useSearchParams } from 'react-router-dom';
import { MODULES, searchCards } from '../lib/content';
import { searchOperativa, type OpSearchResult } from '../lib/operativa-search';
import { useT } from '../lib/i18n';
import { A, Ic, Mono, Card, Shell } from '../lib/design';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const leyesResults = q ? searchCards(q) : [];
  const opResults = q ? searchOperativa(q) : [];
  const totalResults = leyesResults.length + opResults.length;
  const { t } = useT();

  return (
    <Shell max={920}>
      <div style={{ marginBottom: 22 }}>
        <Mono color={A.terracota} style={{ letterSpacing: 1.4 }}>Resultats de cerca</Mono>
        <h1 style={{ margin: '8px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.2vw,34px)', letterSpacing: -1, color: A.ink, lineHeight: 1.1 }}>
          «{q}»
        </h1>
        <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 14.5, color: A.inkSoft }}>
          {totalResults === 0 ? 'Cap resultat' : `${totalResults} ${totalResults === 1 ? 'resultat' : 'resultats'}`}
        </p>
      </div>

      {totalResults === 0 && q && (
        <Card pad={28} style={{ textAlign: 'center', borderStyle: 'dashed', background: A.bgSoft }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: A.bgDeep, display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}><Ic name="search" size={24} color={A.inkMuted} /></div>
          <Mono color={A.inkMuted}>Prova amb altres paraules clau</Mono>
        </Card>
      )}

      {/* OPERATIVA — checklists interactius (Tràfic + Penal) */}
      {opResults.length > 0 && (
        <section style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 12px' }}>
            <Ic name="siren" size={15} color={A.blue} sw={2.2} />
            <Mono color={A.blue}>Operativa</Mono>
            <Mono size={10} color={A.inkFaint}>({opResults.length})</Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {opResults.map((r) => (
              <OperativaResultCard key={`${r.module}/${r.scenarioId}`} result={r} q={q} />
            ))}
          </div>
        </section>
      )}

      {/* LLEIS — fitxes del temari */}
      {leyesResults.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 12px' }}>
            <Ic name="scale" size={15} color={A.amber} sw={2.2} />
            <Mono color={A.amber}>Lleis i temari</Mono>
            <Mono size={10} color={A.inkFaint}>({leyesResults.length})</Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leyesResults.map((c) => {
              const mod = MODULES.find((m) => m.slug === c.moduleSlug);
              const modTitle = mod ? t(`module.${mod.slug}.title`) : c.moduleSlug;
              return (
                <Link key={`${c.moduleSlug}/${c.slug}`} to={`/leyes/s/${c.moduleSlug}/${c.slug}`} style={{ textDecoration: 'none' }}>
                  <Card pad={16} hover style={{ display: 'flex', alignItems: 'flex-start', gap: 14, borderLeft: `4px solid ${A.amber}` }}>
                    <span style={{ width: 40, height: 40, borderRadius: 11, background: A.amberSoft, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 20 }}>{c.icon}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Mono size={10} color={A.amber}>{modTitle}</Mono>
                      <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, margin: '2px 0 4px', letterSpacing: -0.2 }}>{c.title}</div>
                      <div style={{ fontFamily: A.sans, fontSize: 13, color: A.inkMuted, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: snippet(c.searchText, q) }} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </Shell>
  );
}

// ── Card per a un resultat de l'Operativa (Trànsit o Penal) ─────────

function OperativaResultCard({ result, q }: { result: OpSearchResult; q: string }) {
  const { t } = useT();
  const moduleLabel =
    result.module === 'trafico'
      ? t('operativa.trafico.title')
      : t('operativa.seguretat-ciutadana.title');
  const moduleColor =
    result.module === 'trafico' ? A.terracota : (result.blocColor ?? A.blue);

  return (
    <Link to={result.url} style={{ textDecoration: 'none' }}>
      <Card pad={16} hover style={{ borderLeft: `4px solid ${moduleColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ background: moduleColor, color: '#fff', borderRadius: 7, padding: '3px 9px', fontFamily: A.mono, fontWeight: 700, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' }}>{moduleLabel}</span>
          {result.blocLabel && <Mono size={10} color={A.inkMuted}>{result.blocLabel}</Mono>}
        </div>
        <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.ink, letterSpacing: -0.2 }}>{stripEmoji(result.scenarioTitle)}</div>
        <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.hits.map((h, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ marginTop: 1, flexShrink: 0, background: A.bgDeep, color: A.inkMuted, borderRadius: 5, padding: '2px 6px', fontFamily: A.mono, fontWeight: 600, fontSize: 9, letterSpacing: 0.4, textTransform: 'uppercase' }}>{prettifyField(h.field)}</span>
              <span style={{ flex: 1, fontFamily: A.sans, fontSize: 13, color: A.inkSoft, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: highlight(h.snippet, q) }} />
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 10, fontFamily: A.display, fontWeight: 700, fontSize: 12.5, color: moduleColor, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{t('search.openChecklist')} <Ic name="arrow" size={14} color={moduleColor} /></div>
      </Card>
    </Link>
  );
}

// Etiquetes humanes per al "field" d'origen del hit.
const FIELD_PRETTY: Record<string, string> = {
  titol: 'TÍTOL',
  text: 'PREGUNTA',
  info: 'INFO',
  concepte_butlleta: 'CONCEPTE',
  article_butlleta: 'ARTICLE',
  pena: 'PENA',
  base_legal: 'BASE LEGAL',
  accions_ordenades: 'ACTUACIONS',
  accions_operatives: 'ACTUACIONS',
  accions_ordenades_critiques: 'CRÍTICS',
  drets_informar_conductor: 'DRETS',
  documentacio: 'DOCUMENTACIÓ',
  documentacio_clau: 'DOC CLAU',
  principi_clau: 'PRINCIPI',
  descripcio: 'DESCRIPCIÓ',
  import: 'MULTA',
  punts: 'PUNTS',
};

function prettifyField(field: string): string {
  return (
    FIELD_PRETTY[field] ?? field.toUpperCase().replace(/_/g, ' ').slice(0, 16)
  );
}

const EMOJI_RE = /^([\p{Extended_Pictographic}\u{200D}️]+)\s*/u;
function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, '').trim();
}

// ── Helpers per highlight ───────────────────────────────────────────

function snippet(text: string, q: string): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  const re = new RegExp(escapeRegExp(q), 'i');
  const idx = plain.search(re);
  if (idx < 0) return escapeHtml(plain.slice(0, 140)) + (plain.length > 140 ? '…' : '');
  const start = Math.max(0, idx - 40);
  const end = Math.min(plain.length, idx + q.length + 80);
  const slice = plain.slice(start, end);
  const before = start > 0 ? '…' : '';
  const after = end < plain.length ? '…' : '';
  const highlighted = escapeHtml(slice).replace(
    new RegExp(escapeRegExp(escapeHtml(q)), 'ig'),
    (m) =>
      `<mark style="border-radius:3px;padding:0 2px;background:#FFE7D2;color:#7A2E04">${m}</mark>`,
  );
  return before + highlighted + after;
}

function highlight(text: string, q: string): string {
  if (!q) return escapeHtml(text);
  return escapeHtml(text).replace(
    new RegExp(escapeRegExp(escapeHtml(q)), 'ig'),
    (m) =>
      `<mark style="border-radius:3px;padding:0 2px;background:#FFE7D2;color:#7A2E04">${m}</mark>`,
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
