// InfoPol Chat — assistent amb IA sobre el contingut carregat (RAG).
// Pregunta i respon citant la font; mode admin per carregar documents.
// El "cervell" viu a la Edge Function `infopol-chat` (Supabase + Gemini).
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useSeo } from '../lib/seo';
import { A, Ic, Mono, Card, PageHead, Chip } from '../lib/design';

const ADMINS = ['vazquezvelascoeduardo@gmail.com', 'eduguapo98@gmail.com'];
type Src = { source?: string; title?: string; kind?: string };
type Msg = { role: 'user' | 'bot'; text: string; sources?: Src[]; usage?: { totalTokenCount?: number } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callChat(body: Record<string, unknown>): Promise<Record<string, any>> {
  if (!supabase) return { error: 'Backend no disponible.' };
  const { data, error } = await supabase.functions.invoke('infopol-chat', { body });
  if (error) {
    // Intenta llegir el cos d'error de la funció.
    let msg = error.message;
    try { const ctx = await (error as { context?: Response }).context?.json?.(); if (ctx?.error) msg = ctx.error; } catch { /* */ }
    return { error: msg };
  }
  return (data as Record<string, unknown>) ?? {};
}

export default function Chat() {
  useSeo({ title: 'InfoPol Chat · assistent normatiu · InfoPol', description: 'Assistent amb IA per a policia local: consulta normativa i redacta esborranys d\'actes a partir del teu contingut.' });
  const { user } = useAuth();
  const isAdmin = ADMINS.includes(user?.email ?? '');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { callChat({ action: 'stats' }).then((d) => setCount(typeof d.count === 'number' ? d.count : null)); }, []);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [msgs, busy]);

  async function ask() {
    const question = q.trim(); if (!question || busy) return;
    setMsgs((m) => [...m, { role: 'user', text: question }]); setQ(''); setBusy(true);
    const d = await callChat({ action: 'ask', question });
    setBusy(false);
    if (d.error) setMsgs((m) => [...m, { role: 'bot', text: '⚠️ ' + d.error }]);
    else setMsgs((m) => [...m, { role: 'bot', text: String(d.answer ?? ''), sources: (d.sources as Src[]) ?? [], usage: d.usage as Msg['usage'] }]);
  }

  const inp: CSSProperties = { width: '100%', border: `1px solid ${A.line2}`, borderRadius: 12, padding: '12px 14px', fontFamily: A.sans, fontSize: 15, color: A.ink, background: A.bgSoft, outline: 'none' };

  return (
    <div className="shell" style={{ maxWidth: 820, paddingBottom: 40 }}>
      <PageHead kicker="InfoPol · assistent IA (pilot)" title="InfoPol Chat"
        desc="Pregunta sobre la normativa i els procediments carregats, o demana un esborrany d'acta. Respon citant la font. És un pilot: verifica sempre abans de signar." />

      {count === 0 && (
        <Card pad={16} style={{ marginBottom: 16, background: A.amberSoft, border: `1px solid ${A.amber}` }}>
          <Mono size={10} color="#6B3F08">Encara no hi ha contingut carregat</Mono>
          <p style={{ margin: '6px 0 0', fontFamily: A.sans, fontSize: 14, color: A.ink }}>
            {isAdmin ? 'Obre "Carregar contingut" a sota i afegeix ordenances, lleis o pautes d\'actes.' : 'L\'administrador encara no ha carregat documents.'}
          </p>
        </Card>
      )}

      {/* Conversa */}
      <div ref={scroller} style={{ minHeight: 280, maxHeight: '52vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: 4 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: 'center', color: A.inkMuted, fontFamily: A.sans, fontSize: 14, padding: '18px 0' }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>💬</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 640, margin: '0 auto' }}>
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => { setQ(s); }}
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
            }}>{m.role === 'bot' ? renderLite(m.text) : m.text}</div>
            {m.sources && m.sources.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {dedupeSources(m.sources).slice(0, 5).map((s, j) => <Chip key={j} tone="blue">{s.source || s.title || 'font'}</Chip>)}
              </div>
            )}
          </div>
        ))}
        {busy && <div style={{ alignSelf: 'flex-start', color: A.inkMuted, fontFamily: A.sans, fontSize: 14 }}>Pensant… 🔎</div>}
      </div>

      {/* Entrada */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <input style={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Escriu la teva consulta…"
          onKeyDown={(e) => { if (e.key === 'Enter') ask(); }} disabled={busy} />
        <button onClick={ask} disabled={busy || !q.trim()} style={{ border: 'none', background: A.terracota, color: '#fff', borderRadius: 12, padding: '0 18px', fontFamily: A.display, fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: busy || !q.trim() ? 0.5 : 1 }}>
          <Ic name="arrow" size={18} color="#fff" sw={2.4} />
        </button>
      </div>
      <Mono size={9} color={A.inkMuted} style={{ display: 'block', marginTop: 8 }}>
        {count != null ? `${count} fragments de contingut` : ''} · esborrany orientatiu, no és consell jurídic
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

const SUGGESTED = [
  '🛴 Quina multa té circular amb un patinet per la vorera?',
  '🍺 Alcoholèmia de 0,68 mg/l: quins passos i quines actes?',
  '🚗 Permís colombià sense canjear després d\'1 any de residència: què faig?',
  '🚔 Detenim per un robatori: quines actes fem a Viladecans?',
  '📄 Redacta\'m el concepte de butlleta per un VMP saltant-se un semàfor',
  '🏠 Ocupació d\'un pis sense violència: delicte o via civil?',
];

// Render lleuger de markdown: **negreta**, línies "- " com a llista i
// títols "### ". Sense dependències; suficient per a respostes del bot.
function renderLite(text: string) {
  const lines = text.split('\n');
  return lines.map((ln, i) => {
    const parts = ln.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
      seg.startsWith('**') && seg.endsWith('**')
        ? <b key={j}>{seg.slice(2, -2)}</b>
        : seg,
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
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  // Ingesta massiva del corpus generat del repo (public/chat-corpus.json).
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

  async function load() {
    if (!content.trim() || busy) return;
    setBusy(true); setMsg('Carregant i indexant…');
    const d = await callChat({ action: 'ingest', documents: [{ title, source: title, kind, content }], replace: true });
    setBusy(false);
    if (d.error) setMsg('⚠️ ' + d.error);
    else { setMsg(`✅ ${d.inserted} fragments afegits (total ${d.total}).`); setContent(''); if (typeof d.total === 'number') onDone(d.total); }
  }

  // Envia el corpus sencer en lots petits (evita timeouts de la funció).
  // `replace: true` fa que cada `source` substitueixi la versió anterior
  // (idempotent: es pot re-executar després de cada actualització web).
  async function bulkIngest() {
    if (!corpus || bulkBusy) return;
    if (!confirm(`S'indexaran ${corpus.length} documents del corpus InfoPol (fitxes d'operativa, nomenclàtor SCT, actes de Viladecans i fitxes de lleis). Cada font substitueix la versió anterior. Pot trigar uns minuts. Continuar?`)) return;
    setBulkBusy(true); setBulkPct(0); setBulkMsg('Indexant…');
    const BATCH = 6;
    let done = 0, errors = 0, lastTotal: number | null = null;
    for (let i = 0; i < corpus.length; i += BATCH) {
      const batch = corpus.slice(i, i + BATCH);
      const d = await callChat({ action: 'ingest', documents: batch, replace: true });
      if (d.error) {
        errors++;
        // Un error puntual no atura la ingesta; dos de seguits, sí.
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
      {/* Ingesta massiva del corpus del repo */}
      <Card pad={14} style={{ border: `1.5px solid ${A.terracota}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20 }}>📥</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14.5, color: A.ink }}>Corpus InfoPol complet</div>
            <Mono size={9} color={A.inkMuted}>
              {corpus ? `${corpus.length} documents: fitxes operativa + nomenclàtor SCT + actes Viladecans + fitxes de lleis` : 'Carregant corpus…'}
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

      <Mono size={9} color={A.inkMuted}>O carrega un document solt (ordenances noves, pautes internes…):</Mono>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
        <input style={inp} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Títol / font (p. ex. Ordenança soroll Viladecans)" />
        <select style={{ ...inp, cursor: 'pointer' }} value={kind} onChange={(e) => setKind(e.target.value)}>
          {['ordenança', 'llei', 'acta', 'procediment'].map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <textarea style={{ ...inp, minHeight: 160, resize: 'vertical', fontFamily: A.mono, fontSize: 12.5 }} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enganxa aquí el text del document…" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={load} disabled={busy || !content.trim()} style={{ border: 'none', background: A.ink, color: '#fff', borderRadius: 11, padding: '10px 18px', fontFamily: A.display, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: busy || !content.trim() ? 0.5 : 1 }}>Carregar i indexar</button>
        {msg && <span style={{ fontFamily: A.sans, fontSize: 13, color: A.inkSoft }}>{msg}</span>}
      </div>
    </div>
  );
}
