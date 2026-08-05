// SuperBuscador d'infraccions de Trànsit (rediseny Claude Design 2026).
// Cerca transversal a TOT el catàleg SCT 2026 (LSV, RGC, RGCond, RGV,
// Assegurança i Codi Penal) sense canviar de pestanya.
//
// La lògica de cerca viu a lib/cataleg-parser (parseig de l'HTML del
// catàleg amb DOMParser, cache en memòria + sinònims). Aquí només hi ha
// la presentació amb la paleta compartida (lib/design).
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  searchCataleg,
  getCatalegRows,
  getLawColor,
  getCatalegLaws,
  type CatalegRow,
  type Severity,
} from '../lib/cataleg-parser';
import { findOfficialConcept } from '../lib/cataleg-nomenclator';
import Capcalera from '../components/Capcalera';
import { A, Ic, Mono, Card } from '../lib/design';

export default function Superbuscador() {
  // La cerca pot arribar pre-omplida des d'altres pàgines (Operativa,
  // topbar global) via ?q=… — la llegim un cop per inicialitzar el camp.
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(() => params.get('q') ?? '');
  const dq = useDeferredValue(q);
  const [selected, setSelected] = useState<CatalegRow | null>(null);

  // Mantenim l'URL sincronitzat amb la cerca (sense afegir entrades a
  // l'historial) perquè es pugui compartir/recarregar amb el mateix estat.
  useEffect(() => {
    const cur = params.get('q') ?? '';
    if (q === cur) return;
    const next = new URLSearchParams(params);
    if (q) next.set('q', q);
    else next.delete('q');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const allRows = useMemo(() => getCatalegRows(), []);
  const results = useMemo(() => (dq.length >= 2 ? searchCataleg(dq) : []), [dq]);

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
    <div className="v3-page v3-anim" style={{ maxWidth: 1000, width: '100%' }}>
      <Capcalera
        kicker="Catàleg SCT 2026"
        titol="Superbuscador d'infraccions"
        lead="Cerca per concepte, article, multa o punts a totes les normes alhora."
        xifres={[{ valor: allRows.length.toLocaleString('ca-ES'), label: 'infraccions' }, { valor: String(laws.length), label: 'normes' }]}
      />

      {/* Input gran */}
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={20} color={A.purple} /></span>
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex.: conduir sense permís, mòbil, 0,30 mg/l, 500…"
          style={{ width: '100%', border: `2px solid ${A.purple}`, background: A.card, borderRadius: 18, padding: '16px 44px 16px 50px', fontFamily: A.display, fontWeight: 600, fontSize: 16.5, color: A.ink, outline: 'none', boxShadow: A.shadow, boxSizing: 'border-box' }}
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Esborrar" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: A.bgDeep, cursor: 'pointer', width: 30, height: 30, borderRadius: 999, display: 'grid', placeItems: 'center', color: A.inkSoft }}>
            <Ic name="x" size={16} color={A.inkSoft} />
          </button>
        )}
      </div>

      {/* Resultats */}
      {q.length === 0 && <EmptyState onPick={setQ} />}
      {q.length > 0 && q.length < 2 && (
        <p style={{ fontFamily: A.sans, fontSize: 14, color: A.inkMuted, fontStyle: 'italic' }}>Escriu almenys 2 caràcters…</p>
      )}
      {q.length >= 2 && results.length === 0 && (
        <Card pad={28} style={{ textAlign: 'center', borderStyle: 'dashed' }}>
          <Mono color={A.inkMuted}>Cap resultat per «{q}»</Mono>
        </Card>
      )}

      {results.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: A.display, fontWeight: 800, fontSize: 18, color: A.purple }}>{results.length}</span>
            <Mono color={A.inkSoft}>{results.length === 1 ? 'infracció trobada' : 'infraccions trobades'}</Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
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

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  const tips = ['mòbil', 'alcohol', 'sense permís', 'velocitat', 'assegurança', 'cinturó'];
  return (
    <Card pad={28} style={{ textAlign: 'center', borderStyle: 'dashed', background: A.bgSoft }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: A.purpleSoft, display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}><Ic name="bolt" size={26} color={A.purple} /></div>
      <p style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.ink, margin: '0 0 6px' }}>Comença a escriure per cercar</p>
      <p style={{ fontFamily: A.sans, fontSize: 13.5, color: A.inkMuted, margin: '0 0 16px' }}>Busca per concepte, article (14.1), multa (500) o punts.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {tips.map((tp) => (
          <button key={tp} onClick={() => onPick(tp)} style={{ cursor: 'pointer', border: `1px solid ${A.line2}`, background: A.card, color: A.inkSoft, fontFamily: A.sans, fontWeight: 600, fontSize: 13, padding: '7px 14px', borderRadius: 999 }}>{tp}</button>
        ))}
      </div>
    </Card>
  );
}

function LawSection({ lawId, items, q, onSelect }: { lawId: string; items: CatalegRow[]; q: string; onSelect: (row: CatalegRow) => void }) {
  const color = getLawColor(lawId);
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, padding: '8px 13px', borderRadius: 14, background: color + '14', borderLeft: `4px solid ${color}` }}>
        <span style={{ fontFamily: A.mono, fontWeight: 700, fontSize: 13, color }}>{items[0].lawShort}</span>
        <span style={{ fontFamily: A.sans, fontSize: 12, fontWeight: 500, opacity: 0.85, color }}>{items[0].lawFull}</span>
        <span style={{ marginLeft: 'auto', fontFamily: A.mono, fontSize: 12, opacity: 0.7, color }}>{items.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((r, i) => <ResultRow key={i} row={r} q={q} color={color} onSelect={onSelect} />)}
      </div>
    </section>
  );
}

function ResultRow({ row, q, color, onSelect }: { row: CatalegRow; q: string; color: string; onSelect: (row: CatalegRow) => void }) {
  const ctx = [row.sectionTitle, row.subgroup].filter(Boolean).join(' · ');
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(row)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(row); } }}
      className="a-hover"
      style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', background: A.card, border: `1px solid ${A.line}`, borderLeft: `4px solid ${color}`, borderRadius: 14, padding: '13px 15px', boxShadow: A.shadow }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {ctx && <div style={{ fontFamily: A.mono, fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ctx}><HighlightText text={ctx} query={q} /></div>}
        <div style={{ fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.35, color: A.ink }}><HighlightText text={row.concepte} query={q} /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {row.article && <Pill text={`§${row.article}`} bg={A.amberSoft} fg="#6B3F08" />}
        {row.severity && <SeverityPill severity={row.severity} />}
        {row.fine && <Pill text={`${row.fine}${isNumericFine(row.fine) ? ' €' : ''}`} bg={A.greenSoft} fg={A.greenInk} bold />}
        {row.points && <Pill text={`–${row.points} pts`} bg={A.redSoft} fg={A.redInk} bold />}
      </div>
    </div>
  );
}

function Pill({ text, bg, fg, bold = false }: { text: string; bg: string; fg: string; bold?: boolean }) {
  return <span style={{ fontFamily: A.mono, fontWeight: bold ? 700 : 600, fontSize: 11.5, whiteSpace: 'nowrap', background: bg, color: fg, borderRadius: 10, padding: '4px 8px' }}>{text}</span>;
}

function SeverityPill({ severity }: { severity: Severity }) {
  const meta: Record<Severity, { label: string; bg: string; fg: string; title: string }> = {
    MG: { label: 'MG', bg: A.redSoft, fg: A.redInk, title: 'Molt greu' },
    G: { label: 'G', bg: A.amberSoft, fg: '#6B3F08', title: 'Greu' },
    L: { label: 'L', bg: A.blueSoft, fg: A.blueInk, title: 'Lleu' },
  };
  const m = meta[severity];
  return <span title={m.title} style={{ fontFamily: A.mono, fontWeight: 700, fontSize: 11.5, background: m.bg, color: m.fg, borderRadius: 10, padding: '4px 8px' }}>{m.label}</span>;
}

function isNumericFine(s: string): boolean {
  return /^\d/.test(s.replace(/\./g, ''));
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const tokens = query.trim().split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return <>{text}</>;
  const re = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'ig');
  const parts = text.split(re);
  const lower = new Set(tokens.map((tk) => tk.toLowerCase()));
  return (
    <>
      {parts.map((part, i) =>
        lower.has(part.toLowerCase()) ? (
          <mark key={i} style={{ borderRadius: 3, padding: '0 2px', background: A.purpleSoft, color: A.purpleInk }}>{part}</mark>
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
function pickOfficialConcept(row: CatalegRow): { text: string; official: boolean } {
  const found = findOfficialConcept(row.lawId, row.article, row.concepte);
  if (found) return { text: found.concept, official: true };
  return { text: row.concepte, official: false };
}

function buildBoletinText(row: CatalegRow): string {
  const parts: string[] = [];
  parts.push(pickOfficialConcept(row).text);
  const lawRef = row.article && row.article !== '—' ? `${row.lawShort} art. ${row.article}` : row.lawShort;
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!row) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [row, onClose]);

  useEffect(() => { setCopied(false); }, [row]);

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
    } catch { /* clipboard pot fallar a iframes/insecure */ }
  }

  const attrs: Array<{ label: string; value: string; tone: string }> = [];
  if (row.article) attrs.push({ label: 'Article', value: `§ ${row.article}`, tone: 'amber' });
  if (row.severity) attrs.push({ label: 'Gravetat', value: row.severity === 'MG' ? 'Molt greu' : row.severity === 'G' ? 'Greu' : 'Lleu', tone: row.severity === 'MG' ? 'red' : row.severity === 'G' ? 'amber' : 'blue' });
  if (row.fine) attrs.push({ label: 'Multa', value: isNumericFine(row.fine) ? `${row.fine} €` : row.fine, tone: 'green' });
  if (row.dte && row.dte !== '—' && isNumericFine(row.dte)) attrs.push({ label: 'DTE (50%)', value: `${row.dte} €`, tone: 'green' });
  if (row.points) attrs.push({ label: 'Punts', value: `– ${row.points}`, tone: 'red' });

  return (
    <div role="dialog" aria-modal="true" aria-label={row.concepte} style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} className="sb-dialog">
      <button aria-label="Tancar" onClick={onClose} style={{ position: 'absolute', inset: 0, border: 'none', background: 'rgba(21,21,28,0.5)', backdropFilter: 'blur(3px)', cursor: 'pointer' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', background: A.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: A.shadowLg, borderTop: `4px solid ${color}` }} className="sb-sheet">
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: `1px solid ${A.line}`, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
          <span style={{ fontFamily: A.mono, fontWeight: 700, fontSize: 13, borderRadius: 10, padding: '3px 9px', background: color + '18', color }}>{row.lawShort}</span>
          <span style={{ fontFamily: A.sans, fontSize: 12, opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: A.inkSoft }}>{row.lawFull}</span>
          <button onClick={onClose} aria-label="Tancar" style={{ marginLeft: 'auto', border: 'none', background: A.bgDeep, cursor: 'pointer', width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center' }}><Ic name="x" size={17} color={A.inkSoft} /></button>
        </div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ctx && <Mono size={11} color={color}>{ctx}</Mono>}
          <h2 style={{ margin: 0, fontFamily: A.display, fontWeight: 700, fontSize: 20, lineHeight: 1.25, color: A.ink }}>{official.text}</h2>
          {official.official && (
            <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: A.sans, fontSize: 12, fontWeight: 600, borderRadius: 10, padding: '5px 10px', background: A.greenSoft, color: A.greenInk }}>
              <Ic name="check" size={13} color={A.greenInk} sw={3} /> Concepte oficial del nomenclàtor
            </span>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {attrs.map((at) => { const k = at.tone === 'amber' ? { soft: A.amberSoft, ink: '#6B3F08' } : at.tone === 'red' ? { soft: A.redSoft, ink: A.redInk } : at.tone === 'green' ? { soft: A.greenSoft, ink: A.greenInk } : { soft: A.blueSoft, ink: A.blueInk };
              return <div key={at.label} style={{ borderRadius: 14, padding: '10px 13px', background: k.soft }}>
                <Mono size={10} color={k.ink} style={{ opacity: 0.85 }}>{at.label}</Mono>
                <div style={{ marginTop: 3, fontFamily: A.display, fontWeight: 700, fontSize: 15, color: k.ink }}>{at.value}</div>
              </div>; })}
          </div>
          <section style={{ borderRadius: 14, padding: 16, background: A.purpleSoft }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
              <Mono size={11} color={A.purpleInk}>Text per al butlletí</Mono>
              <button onClick={copyText} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', borderRadius: 10, padding: '6px 12px', background: A.card, color: A.purpleInk, fontFamily: A.display, fontWeight: 700, fontSize: 12.5 }}>
                {copied ? <><Ic name="check" size={14} color={A.purpleInk} sw={3} /> Copiat</> : <><Ic name="doc" size={14} color={A.purpleInk} /> Copiar</>}
              </button>
            </div>
            <p style={{ margin: 0, fontFamily: A.mono, fontSize: 13, lineHeight: 1.55, color: A.ink }}>{boletinText}</p>
          </section>
          <p style={{ margin: 0, fontFamily: A.sans, fontSize: 11.5, color: A.inkMuted }}>Informació orientativa. Verifica sempre la norma vigent abans de tramitar.</p>
        </div>
      </div>
    </div>
  );
}
