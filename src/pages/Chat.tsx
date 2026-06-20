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
          <div style={{ textAlign: 'center', color: A.inkMuted, fontFamily: A.sans, fontSize: 14, padding: '24px 0' }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>💬</div>
            Prova: <i>"Quina multa té circular amb VMP per la vorera?"</i> · <i>"Redacta'm un esborrany d'acta D-10 per consum d'alcohol a la via pública"</i>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
            <div style={{
              background: m.role === 'user' ? A.ink : A.card, color: m.role === 'user' ? '#fff' : A.ink,
              border: m.role === 'user' ? 'none' : `1px solid ${A.line}`, borderRadius: 16, padding: '11px 14px',
              fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.5, whiteSpace: 'pre-wrap', boxShadow: A.shadow,
            }}>{m.text}</div>
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

function dedupeSources(s: Src[]): Src[] {
  const seen = new Set<string>(); const out: Src[] = [];
  for (const x of s) { const k = x.source || x.title || ''; if (k && !seen.has(k)) { seen.add(k); out.push(x); } }
  return out;
}

function AdminIngest({ onDone }: { onDone: (total: number) => void }) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('ordenança');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const inp: CSSProperties = { width: '100%', border: `1px solid ${A.line2}`, borderRadius: 10, padding: '9px 12px', fontFamily: A.sans, fontSize: 14, color: A.ink, background: A.bgSoft, outline: 'none' };

  async function load() {
    if (!content.trim() || busy) return;
    setBusy(true); setMsg('Carregant i indexant…');
    const d = await callChat({ action: 'ingest', documents: [{ title, source: title, kind, content }] });
    setBusy(false);
    if (d.error) setMsg('⚠️ ' + d.error);
    else { setMsg(`✅ ${d.inserted} fragments afegits (total ${d.total}).`); setContent(''); if (typeof d.total === 'number') onDone(d.total); }
  }

  return (
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
