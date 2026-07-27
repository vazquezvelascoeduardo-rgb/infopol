// InfoPol Assistent — xat amb IA en 3 modes sobre el contingut carregat (RAG).
// El "cervell" viu a la Edge Function `infopol-assistent` (Supabase + Claude
// per generar, Gemini per als embeddings). Mode admin per carregar coneixement.
// Els adjunts s'envien amb la pregunta i NO es desen enlloc.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useSeo } from '../lib/seo';
import { A, Ic, Mono, Card, PageHead, Chip } from '../lib/design';

const ADMINS = ['vazquezvelascoeduardo@gmail.com', 'eduguapo98@gmail.com'];

type Mode = 'operativa' | 'diligencia' | 'servei';
type Src = { source?: string; title?: string; kind?: string };
type Msg = { role: 'user' | 'assistant'; text: string; sources?: Src[] };
type Att = { name: string; media_type: string; data: string };

const MODES: { key: Mode; emoji: string; title: string; sub: string; intro: string; exemples: string[] }[] = [
  {
    key: 'operativa',
    emoji: '🔎',
    title: 'Consultes operatives',
    sub: 'NORMA · PROCEDIMENT · BUTLLETA',
    intro: 'Explica la situació i et dic la norma aplicable, el procediment, la infracció que correspon i el text per a la butlleta.',
    exemples: [
      '🛴 Quina multa té circular amb un patinet per la vorera?',
      '🍺 Alcoholèmia de 0,68 mg/l: quins passos i quines actes?',
      '🚗 Permís colombià sense canviar després d\'1 any de residència: què faig?',
      '🚔 Detenim per un robatori: quines actes fem a Viladecans?',
    ],
  },
  {
    key: 'diligencia',
    emoji: '📝',
    title: 'Diligenciador',
    sub: 'MINUTES · ACTES · ATESTATS',
    intro: 'Explica\'m els fets com els diries de paraula i t\'ho passo a redacció policial: minuta, acta, denúncia o atestat.',
    exemples: [
      '📄 Minuta d\'una baralla a la via pública',
      '📋 Acta d\'intervenció per una identificació',
      '🚙 Atestat d\'un accident sense ferits',
    ],
  },
  {
    key: 'servei',
    emoji: '🗂️',
    title: 'Redacció de servei',
    sub: 'PER AL SISTEMA · SENSE TEMA LEGAL',
    intro: 'Passa\'m les notes del servei i te les deixo ben redactades per introduir-les al sistema. Aquí no es tracta res legal.',
    exemples: [
      '🔊 Requeriment per sorolls, avisem veí, cessa la molèstia',
      '🚦 Control de trànsit al carrer Major de 8 a 10 h',
      '🚑 Suport a ambulància, es regula el trànsit fins que marxa',
    ],
  },
];

const MAX_ATT = 3;
const MAX_BYTES = 4 * 1024 * 1024;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callAssistent(body: Record<string, unknown>): Promise<Record<string, any>> {
  if (!supabase) return { error: 'Backend no disponible.' };
  const { data, error } = await supabase.functions.invoke('infopol-assistent', { body });
  if (error) {
    let msg = error.message;
    try { const ctx = await (error as { context?: Response }).context?.json?.(); if (ctx?.error) msg = ctx.error; } catch { /* */ }
    return { error: msg };
  }
  return (data as Record<string, unknown>) ?? {};
}

/** Llegeix un File del navegador com a base64 sense el prefix data:. */
function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] ?? '');
    r.onerror = () => rej(new Error('No s\'ha pogut llegir el fitxer.'));
    r.readAsDataURL(file);
  });
}

export default function Chat() {
  useSeo({
    title: 'Assistent InfoPol · consultes, minutes i serveis · InfoPol',
    description: 'Assistent amb IA per a policia local: consultes operatives, redacció de minutes i actes, i redacció de serveis.',
  });
  const { user } = useAuth();
  const isAdmin = ADMINS.includes(user?.email ?? '');

  const [mode, setMode] = useState<Mode | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [atts, setAtts] = useState<Att[]>([]);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [quota, setQuota] = useState<{ count: number; limit: number } | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    callAssistent({ action: 'stats' }).then((d) => setCount(typeof d.total === 'number' ? d.total : null));
  }, []);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  const info = MODES.find((m) => m.key === mode);

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    const nous: Att[] = [];
    for (const f of Array.from(list).slice(0, MAX_ATT - atts.length)) {
      if (f.size > MAX_BYTES) { alert(`"${f.name}" supera els 4 MB.`); continue; }
      const ok = f.type.startsWith('image/') || f.type === 'application/pdf';
      if (!ok) { alert(`"${f.name}": només imatges o PDF.`); continue; }
      nous.push({ name: f.name, media_type: f.type, data: await toBase64(f) });
    }
    if (nous.length) setAtts((p) => [...p, ...nous]);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function ask() {
    const question = q.trim();
    if ((!question && !atts.length) || busy || !mode) return;
    const contingut = question || '(adjunt sense text)';
    const historial: Msg[] = [...msgs, { role: 'user', text: contingut }];
    setMsgs(historial);
    setQ('');
    const enviats = atts;
    setAtts([]);
    setBusy(true);

    const d = await callAssistent({
      action: 'ask',
      mode,
      messages: historial.map((m) => ({ role: m.role, content: m.text })),
      attachments: enviats.map((a) => ({ media_type: a.media_type, data: a.data })),
    });
    setBusy(false);
    if (d.error) setMsgs((m) => [...m, { role: 'assistant', text: '⚠️ ' + d.error }]);
    else {
      setMsgs((m) => [...m, { role: 'assistant', text: String(d.text ?? ''), sources: (d.sources as Src[]) ?? [] }]);
      if (d.used) setQuota({ count: d.used.count, limit: d.used.limit });
    }
  }

  const inp: CSSProperties = {
    width: '100%', border: `1px solid ${A.line2}`, borderRadius: 12, padding: '12px 14px',
    fontFamily: A.sans, fontSize: 15, color: A.ink, background: A.bgSoft, outline: 'none',
  };

  /* ── Tria de mode ───────────────────────────────────────────── */
  if (!mode) {
    return (
      <div className="shell" style={{ maxWidth: 820, paddingBottom: 40 }}>
        <PageHead
          kicker="InfoPol · assistent IA"
          title="En què t'ajudo?"
          desc="Tria l'eina. Cada una està preparada per a una feina concreta: consultar, redactar documents o deixar el servei ben escrit."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                textAlign: 'left', cursor: 'pointer', border: `1px solid ${A.line}`,
                borderLeft: `5px solid ${A.terracota}`, background: A.card, borderRadius: 16, padding: 17,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{ fontSize: 27 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: A.display, fontWeight: 800, fontSize: 17, color: A.ink }}>{m.title}</div>
                  <Mono size={9} color={A.inkMuted} style={{ marginTop: 3 }}>{m.sub}</Mono>
                </div>
                <Ic name="arrow" size={18} color={A.terracota} sw={2.4} />
              </div>
              <p style={{ margin: '10px 0 0', fontFamily: A.sans, fontSize: 13, color: A.inkSoft }}>{m.intro}</p>
            </button>
          ))}
        </div>

        <Card pad={14} style={{ marginTop: 16, background: A.bgSoft }}>
          <Mono size={9} color={A.inkMuted}>PRIVADESA</Mono>
          <p style={{ margin: '5px 0 0', fontFamily: A.sans, fontSize: 12.5, color: A.inkSoft }}>
            Les fotos i documents que adjuntis s'envien per respondre't i no es desen als nostres
            servidors. Evita adjuntar dades personals que no siguin necessàries.
          </p>
        </Card>

        {count === 0 && isAdmin && (
          <Card pad={16} style={{ marginTop: 16, background: A.amberSoft, border: `1px solid ${A.amber}` }}>
            <Mono size={10} color="#6B3F08">Encara no hi ha contingut carregat</Mono>
            <p style={{ margin: '6px 0 0', fontFamily: A.sans, fontSize: 14, color: A.ink }}>
              Entra en un mode i obre "Carregar contingut (admin)" per afegir-ne.
            </p>
          </Card>
        )}
      </div>
    );
  }

  /* ── Conversa ───────────────────────────────────────────────── */
  return (
    <div className="shell" style={{ maxWidth: 820, paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button
          onClick={() => { setMode(null); setMsgs([]); setAtts([]); }}
          style={{ border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 999, padding: '7px 13px', fontFamily: A.display, fontWeight: 700, fontSize: 13, color: A.ink }}>
          ‹ Modes
        </button>
        <span style={{ fontSize: 22 }}>{info?.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: A.display, fontWeight: 800, fontSize: 16, color: A.ink }}>{info?.title}</div>
          <Mono size={8.5} color={A.inkMuted}>{info?.sub}</Mono>
        </div>
        {quota && <Mono size={9} color={A.inkMuted}>{quota.count}/{quota.limit}</Mono>}
      </div>

      <div ref={scroller} style={{ minHeight: 280, maxHeight: '52vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: 4 }}>
        {msgs.length === 0 && (
          <div style={{ color: A.inkMuted, fontFamily: A.sans, fontSize: 14, padding: '8px 0' }}>
            <p style={{ marginTop: 0 }}>{info?.intro}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {info?.exemples.map((s) => (
                <button key={s} onClick={() => setQ(s.replace(/^\S+\s/, ''))}
                  style={{ border: `1px solid ${A.line2}`, background: A.card, color: A.inkSoft, cursor: 'pointer', borderRadius: 999, padding: '8px 14px', fontFamily: A.sans, fontSize: 12.5, textAlign: 'left' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
            <div style={{
              background: m.role === 'user' ? A.ink : A.card, color: m.role === 'user' ? '#fff' : A.ink,
              border: m.role === 'user' ? 'none' : `1px solid ${A.line}`, borderRadius: 16, padding: '11px 14px',
              fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', boxShadow: A.shadow,
            }}>{m.role === 'assistant' ? renderLite(m.text) : m.text}</div>
            {m.role === 'assistant' && m.text && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, alignItems: 'center' }}>
                <button onClick={() => navigator.clipboard.writeText(m.text)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                  <Mono size={9} color={A.terracota}>📋 COPIAR</Mono>
                </button>
                {dedupeSources(m.sources ?? []).slice(0, 4).map((s, j) => (
                  <Chip key={j} tone="blue">{s.source || s.title || 'font'}</Chip>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && <div style={{ alignSelf: 'flex-start', color: A.inkMuted, fontFamily: A.sans, fontSize: 14 }}>Pensant… 🔎</div>}
      </div>

      {/* Adjunts pendents */}
      {atts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {atts.map((a, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: A.bgSoft, border: `1px solid ${A.line2}`, borderRadius: 999, padding: '5px 10px', fontFamily: A.sans, fontSize: 12, color: A.inkSoft }}>
              {a.media_type === 'application/pdf' ? '📄' : '🖼️'} {a.name.slice(0, 24)}
              <button onClick={() => setAtts((p) => p.filter((_, k) => k !== i))}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: A.inkMuted, fontSize: 14, padding: 0 }}>✕</button>
            </span>
          ))}
        </div>
      )}

      {/* Entrada */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple hidden
          onChange={(e) => void onFiles(e.target.files)} />
        <button onClick={() => fileRef.current?.click()} disabled={busy || atts.length >= MAX_ATT}
          title="Adjuntar foto o PDF"
          style={{ border: `1px solid ${A.line2}`, background: A.card, borderRadius: 12, padding: '0 14px', fontSize: 17, cursor: 'pointer', opacity: busy || atts.length >= MAX_ATT ? 0.5 : 1 }}>
          📎
        </button>
        <input style={inp} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={mode === 'servei' ? 'Notes del servei…' : 'Explica la situació…'}
          onKeyDown={(e) => { if (e.key === 'Enter') ask(); }} disabled={busy} />
        <button onClick={ask} disabled={busy || (!q.trim() && !atts.length)}
          style={{ border: 'none', background: A.terracota, color: '#fff', borderRadius: 12, padding: '0 18px', fontFamily: A.display, fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: busy || (!q.trim() && !atts.length) ? 0.5 : 1 }}>
          <Ic name="arrow" size={18} color="#fff" sw={2.4} />
        </button>
      </div>
      <Mono size={9} color={A.inkMuted} style={{ display: 'block', marginTop: 8 }}>
        {count != null ? `${count} fragments de coneixement` : ''} · verifica-ho abans de signar; no és consell jurídic
      </Mono>

      {/* Admin: carregar contingut */}
      {isAdmin && (
        <div style={{ marginTop: 22, borderTop: `1px solid ${A.line}`, paddingTop: 18 }}>
          <button onClick={() => setShowAdmin((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 11, padding: '9px 13px', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink }}>
            <Ic name="doc" size={15} color={A.inkSoft} /> {showAdmin ? 'Amagar' : 'Carregar contingut'} (admin)
          </button>
          {showAdmin && <AdminIngest onDone={(total) => setCount(total)} />}
        </div>
      )}
    </div>
  );
}

// Render lleuger de markdown: **negreta**, llistes "- " i títols "### ".
function renderLite(text: string) {
  const lines = text.split('\n');
  return lines.map((ln, i) => {
    const parts = ln.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
      seg.startsWith('**') && seg.endsWith('**') ? <b key={j}>{seg.slice(2, -2)}</b> : seg,
    );
    if (/^#{2,4}\s/.test(ln)) return <div key={i} style={{ fontWeight: 800, marginTop: i ? 8 : 0 }}>{ln.replace(/^#{2,4}\s/, '')}</div>;
    if (/^\s*[-•]\s/.test(ln)) return <div key={i} style={{ paddingLeft: 14 }}>• {ln.replace(/^\s*[-•]\s/, '').split(/(\*\*[^*]+\*\*)/g).map((seg, j) => seg.startsWith('**') && seg.endsWith('**') ? <b key={j}>{seg.slice(2, -2)}</b> : seg)}</div>;
    return <div key={i} style={{ minHeight: ln.trim() ? undefined : 8 }}>{parts}</div>;
  });
}

function dedupeSources(s: Src[]): Src[] {
  const seen = new Set<string>(); const out: Src[] = [];
  for (const x of s) { const k = x.source || x.title || ''; if (k && !seen.has(k)) { seen.add(k); out.push(x); } }
  return out;
}

type CorpusDoc = { title: string; source: string; kind: string; content: string };

function AdminIngest({ onDone }: { onDone: (total: number) => void }) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('ordenança');
  const [modes, setModes] = useState<Mode[]>(['operativa', 'diligencia', 'servei']);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [corpus, setCorpus] = useState<CorpusDoc[] | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMsg, setBulkMsg] = useState('');
  const [bulkPct, setBulkPct] = useState(0);
  const inp: CSSProperties = { width: '100%', border: `1px solid ${A.line2}`, borderRadius: 10, padding: '9px 12px', fontFamily: A.sans, fontSize: 14, color: A.ink, background: A.bgSoft, outline: 'none' };

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'chat-corpus.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d)) setCorpus(d as CorpusDoc[]); })
      .catch(() => {});
  }, []);

  function toggleMode(m: Mode) {
    setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function load() {
    if (!content.trim() || busy) return;
    if (!modes.length) { setMsg('⚠️ Tria com a mínim un mode.'); return; }
    setBusy(true); setMsg('Carregant i indexant…');
    const d = await callAssistent({
      action: 'ingest',
      documents: [{ title, source: title, kind, content, modes }],
      replace: true,
    });
    setBusy(false);
    if (d.error) setMsg('⚠️ ' + d.error);
    else { setMsg(`✅ ${d.inserted} fragments afegits (total ${d.total}).`); setContent(''); if (typeof d.total === 'number') onDone(d.total); }
  }

  async function bulkIngest() {
    if (!corpus || bulkBusy) return;
    if (!confirm(`S'indexaran ${corpus.length} documents del corpus InfoPol. Cada font substitueix la versió anterior. Pot trigar uns minuts. Continuar?`)) return;
    setBulkBusy(true); setBulkPct(0); setBulkMsg('Indexant…');
    const BATCH = 6;
    let done = 0, errors = 0, lastTotal: number | null = null;
    for (let i = 0; i < corpus.length; i += BATCH) {
      const batch = corpus.slice(i, i + BATCH);
      const d = await callAssistent({ action: 'ingest', documents: batch, replace: true });
      if (d.error) {
        errors++;
        if (errors >= 2) { setBulkMsg(`⚠️ Aturat per errors: ${d.error} (${done}/${corpus.length} fets)`); setBulkBusy(false); return; }
      } else {
        errors = 0;
        if (typeof d.total === 'number') lastTotal = d.total;
      }
      done += batch.length;
      setBulkPct(Math.round((done / corpus.length) * 100));
      setBulkMsg(`Indexant… ${done}/${corpus.length} documents`);
    }
    setBulkBusy(false);
    setBulkMsg(`✅ Corpus indexat: ${corpus.length} documents.`);
    if (lastTotal != null) onDone(lastTotal);
  }

  return (
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Card pad={14} style={{ border: `1.5px solid ${A.terracota}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20 }}>📥</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14.5, color: A.ink }}>Corpus InfoPol complet</div>
            <Mono size={9} color={A.inkMuted}>
              {corpus ? `${corpus.length} documents (visibles a tots els modes)` : 'Carregant corpus…'}
            </Mono>
          </div>
          <button onClick={bulkIngest} disabled={!corpus || bulkBusy}
            style={{ border: 'none', background: A.terracota, color: '#fff', borderRadius: 11, padding: '10px 16px', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', opacity: !corpus || bulkBusy ? 0.5 : 1 }}>
            {bulkBusy ? `${bulkPct}%…` : 'Indexar-ho tot'}
          </button>
        </div>
        {bulkBusy && (
          <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: A.bgDeep, overflow: 'hidden' }}>
            <div style={{ width: `${bulkPct}%`, height: '100%', background: A.terracota, transition: 'width .3s' }} />
          </div>
        )}
        {bulkMsg && <div style={{ marginTop: 8, fontFamily: A.sans, fontSize: 13, color: A.inkSoft }}>{bulkMsg}</div>}
      </Card>

      <Mono size={9} color={A.inkMuted}>O carrega un document solt (plantilles de minutes, pautes internes, ordenances noves…):</Mono>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
        <input style={inp} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Títol / font (p. ex. Plantilla minuta Viladecans)" />
        <select style={{ ...inp, cursor: 'pointer' }} value={kind} onChange={(e) => setKind(e.target.value)}>
          {['ordenança', 'llei', 'acta', 'procediment', 'plantilla'].map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Modes que veuran aquest document */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Mono size={9} color={A.inkMuted}>VISIBLE A:</Mono>
        {MODES.map((m) => {
          const on = modes.includes(m.key);
          return (
            <button key={m.key} onClick={() => toggleMode(m.key)}
              style={{
                border: `1px solid ${on ? A.terracota : A.line2}`, background: on ? A.terracota : A.card,
                color: on ? '#fff' : A.inkSoft, cursor: 'pointer', borderRadius: 999, padding: '6px 12px',
                fontFamily: A.sans, fontSize: 12.5,
              }}>
              {m.emoji} {m.title}
            </button>
          );
        })}
      </div>

      <textarea style={{ ...inp, minHeight: 160, resize: 'vertical', fontFamily: A.mono, fontSize: 12.5 }} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enganxa aquí el text del document…" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={load} disabled={busy || !content.trim()} style={{ border: 'none', background: A.ink, color: '#fff', borderRadius: 11, padding: '10px 18px', fontFamily: A.display, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: busy || !content.trim() ? 0.5 : 1 }}>Carregar i indexar</button>
        {msg && <span style={{ fontFamily: A.sans, fontSize: 13, color: A.inkSoft }}>{msg}</span>}
      </div>
    </div>
  );
}
