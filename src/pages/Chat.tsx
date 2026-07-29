// InfoPol Chat — assistent amb IA en 3 mòduls (disseny fosc 2026).
// El "cervell" viu a la Edge Function `infopol-assistent` (Claude per generar,
// Gemini per als embeddings del corpus). Mode admin per carregar coneixement.
// Els adjunts s'envien amb la pregunta i NO es desen enlloc.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useSeo } from '../lib/seo';
import { anonimitzaLlista, desanonimitza } from '../lib/anonimitza';

const ADMINS = ['vazquezvelascoeduardo@gmail.com', 'eduguapo98@gmail.com'];

type Mode = 'diligencia' | 'operativa' | 'servei';
type Src = { source?: string; title?: string; kind?: string };
type Msg = { role: 'user' | 'assistant'; text: string; sources?: Src[] };
type Att = { name: string; media_type: string; data: string };

/* ── Paleta fosca del disseny ─────────────────────────────────── */
const D = {
  bg: '#07070C',
  panel: 'rgba(10,10,16,.72)',
  ink: '#F2EFEA',
  mut: '#9691A0',
  mut2: '#8B8796',
  faint: '#5E5A68',
  line: 'rgba(255,255,255,.09)',
  line2: 'rgba(255,255,255,.11)',
  glass: 'linear-gradient(168deg,rgba(255,255,255,.055),rgba(255,255,255,.015))',
  mono: "'JetBrains Mono',ui-monospace,monospace",
  sans: "'Plus Jakarta Sans',system-ui,sans-serif",
};

type Cat = {
  key: Mode; icon: string; num: string; title: string; kicker: string;
  accent: string; glow: string; tint: string; border: string;
  desc: string; tags: string[]; placeholder: string; chips: string[]; typingLabel: string;
};

const CATS: Cat[] = [
  {
    key: 'diligencia', icon: '📝', num: '01', title: 'Diligenciador', kicker: 'MINUTES I ATESTATS',
    accent: '#FF7A1A', glow: 'rgba(255,122,26,.22)', tint: 'rgba(255,122,26,.14)', border: 'rgba(255,122,26,.32)',
    desc: 'Converteix les teves notes de servei en una minuta ben estructurada, amb els fets ordenats i el llenguatge jurídic correcte.',
    tags: ['MINUTES', 'ATESTATS', 'COMPAREIXENCES'],
    placeholder: 'Dicta els fets: hora, lloc, persones, indicis…',
    chips: ['Minuta de danys', 'Compareixença de detingut', 'Acta de denúncia'],
    typingLabel: 'REDACTANT MINUTA',
  },
  {
    key: 'operativa', icon: '⚖️', num: '02', title: 'Consultes operatives', kicker: 'NORMATIVA I ACTUACIÓ',
    accent: '#6FB6EE', glow: 'rgba(46,139,212,.22)', tint: 'rgba(46,139,212,.14)', border: 'rgba(46,139,212,.34)',
    desc: 'Quina infracció correspon, quin import, com actuar en un escenari concret i què diu exactament l\'article aplicable.',
    tags: ['INFRACCIONS', 'PROCEDIMENT', 'BASE LEGAL'],
    placeholder: 'Descriu la situació o pregunta per un article…',
    chips: ['Quina multa correspon?', 'Puc immobilitzar el vehicle?', 'Drets del detingut'],
    typingLabel: 'CONSULTANT NORMATIVA',
  },
  {
    key: 'servei', icon: '🗂️', num: '03', title: 'Redacció de serveis', kicker: 'INFORMES DE SERVEI',
    accent: '#3FCF95', glow: 'rgba(47,179,122,.2)', tint: 'rgba(47,179,122,.13)', border: 'rgba(47,179,122,.32)',
    desc: 'Informes de servei, novetats de torn i comunicats interns redactats amb el to institucional que toca.',
    tags: ['INFORMES', 'NOVETATS', 'COMUNICATS'],
    placeholder: 'Explica el servei: torn, incidències, actuacions…',
    chips: ['Informe de novetats', 'Servei de dispositiu', 'Comunicat intern'],
    typingLabel: 'REDACTANT SERVEI',
  },
];
const catOf = (m: Mode) => CATS.find((c) => c.key === m)!;

/**
 * Mòduls oberts al públic. La resta es veuen però no s'hi pot entrar: així
 * s'entén que existeixen i que arriben, sense fer-los servir encara.
 *
 * De moment només el Diligenciador, que és el que gasta menys i el que
 * anunciem com a gratuït a la portada.
 */
const MODES_OBERTS: Mode[] = ['diligencia'];
const esObert = (m: Mode) => MODES_OBERTS.includes(m);
/** Mode on cau qui escriu sense triar mòdul. */
const MODE_PER_DEFECTE: Mode = MODES_OBERTS[0];

const ROLES = ['Víctima', 'Perjudicat', 'Assistit', 'Agressor', 'Denunciant', 'Denunciat', 'Implicat', 'Testimoni'];
const MAX_ATT = 3;
const MAX_BYTES = 4 * 1024 * 1024;

/** Converteix errors tècnics del proveïdor en missatges útils per a l'agent.
 *  Els usuaris no han de veure mai JSON ni codis d'error en cru. */
function missatgeAmable(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('credit balance') || m.includes('billing'))
    return 'L\'assistent està temporalment fora de servei. Ho estem solucionant; torna-ho a provar més tard.';
  if (m.includes('rate limit') || m.includes('429'))
    return 'Hi ha molta demanda ara mateix. Espera uns segons i torna-ho a provar.';
  if (m.includes('overloaded') || m.includes('529'))
    return 'El servei està saturat en aquest moment. Torna-ho a provar d\'aquí a un minut.';
  // Missatges ja pensats per a l'usuari, o d'administració: es mostren tal qual.
  if (m.includes('límit diari') || m.includes('cal iniciar sessió') || m.includes('només administradors')
    || m.includes('falta') || m.includes('no configurada') || m.includes('sense documents')) return raw;
  if (m.includes('anthropic') || m.includes('gemini') || m.includes('api key'))
    return 'L\'assistent no ha pogut respondre ara mateix. Torna-ho a provar en un moment.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Sense connexió. Revisa la xarxa i torna-ho a provar.';
  return raw;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callAssistent(body: Record<string, unknown>): Promise<Record<string, any>> {
  if (!supabase) return { error: 'Backend no disponible.' };
  const { data, error } = await supabase.functions.invoke('infopol-assistent', { body });
  if (error) {
    let msg = error.message;
    try { const ctx = await (error as { context?: Response }).context?.json?.(); if (ctx?.error) msg = ctx.error; } catch { /* */ }
    return { error: missatgeAmable(msg) };
  }
  const d = (data as Record<string, unknown>) ?? {};
  if (d.error) return { ...d, error: missatgeAmable(String(d.error)) };
  return d;
}

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] ?? '');
    r.onerror = () => rej(new Error('No s\'ha pogut llegir el fitxer.'));
    r.readAsDataURL(file);
  });
}

type Person = { name: string; dni: string; role: string };

export default function Chat() {
  useSeo({
    title: 'InfoPol Chat · assistent IA policial · InfoPol',
    description: 'Assistent amb IA per a policia local: redacta minutes i atestats, resol consultes operatives amb base legal i escriu informes de servei.',
  });
  const { user } = useAuth();
  const isAdmin = ADMINS.includes(user?.email ?? '');

  const [screen, setScreen] = useState<'home' | 'form' | 'chat'>('home');
  const [cat, setCat] = useState<Mode>('diligencia');
  const [threads, setThreads] = useState<Record<string, Msg[]>>({});
  const [draft, setDraft] = useState('');
  const [atts, setAtts] = useState<Att[]>([]);
  const [typing, setTyping] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [quota, setQuota] = useState<{ count: number; limit: number } | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Full d'inici del Diligenciador
  const today = new Date();
  const [form, setForm] = useState({
    date: today.toISOString().slice(0, 10),
    time: today.toTimeString().slice(0, 5),
    location: '', patrol: '', unit: '', facts: '',
  });
  const [people, setPeople] = useState<Person[]>([{ name: '', dni: '', role: 'Víctima' }]);

  const c = catOf(cat);
  const msgs = threads[cat] ?? [];

  useEffect(() => {
    callAssistent({ action: 'stats' }).then((d) => setCount(typeof d.total === 'number' ? d.total : null));
  }, []);
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length, typing, screen]);

  function pick(m: Mode) {
    if (!esObert(m)) return;
    // El Diligenciador comença amb el full de dades si encara no hi ha conversa.
    if (m === 'diligencia' && !(threads[m] ?? []).length) {
      setCat(m); setScreen('form'); setDraft('');
      return;
    }
    setCat(m); setScreen('chat'); setDraft('');
  }

  const formValid = form.location.trim() !== '' && form.facts.trim() !== '';

  function submitForm() {
    if (!formValid) return;
    const who = people
      .filter((p) => p.name.trim() || p.dni.trim())
      .map((p) => `· ${(p.role || 'Implicat').toUpperCase()}: ${p.name.trim() || '⟨nom⟩'} · DNI ${p.dni.trim() || '⟨pendent⟩'}`)
      .join('\n');
    const body = [
      'DADES DEL SERVEI',
      `Data i hora: ${form.date} · ${form.time} h`,
      `Ubicació: ${form.location.trim()}`,
      `Patrulla: ${form.patrol.trim() || '⟨pendent⟩'} · Indicatiu: ${form.unit.trim() || '⟨pendent⟩'}`,
      '',
      'IMPLICATS',
      who || '· Cap implicat consignat',
      '',
      'FETS',
      form.facts.trim(),
    ].join('\n');
    setScreen('chat');
    void send(body);
  }

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    const nous: Att[] = [];
    for (const f of Array.from(list).slice(0, MAX_ATT - atts.length)) {
      if (f.size > MAX_BYTES) { alert(`"${f.name}" supera els 4 MB.`); continue; }
      if (!(f.type.startsWith('image/') || f.type === 'application/pdf')) {
        alert(`"${f.name}": només imatges o PDF.`); continue;
      }
      nous.push({ name: f.name, media_type: f.type, data: await toBase64(f) });
    }
    if (nous.length) setAtts((p) => [...p, ...nous]);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function send(textOverride?: string) {
    const q = (textOverride ?? draft).trim();
    if ((!q && !atts.length) || typing) return;
    const contingut = q || '(adjunt sense text)';
    const historial: Msg[] = [...(threads[cat] ?? []), { role: 'user', text: contingut }];
    setThreads((t) => ({ ...t, [cat]: historial }));
    setDraft('');
    const enviats = atts;
    setAtts([]);
    setTyping(true);

    // Les dades personals no surten del navegador: viatgen com a [DNI_1] i es
    // tornen a posar en rebre la resposta. El diccionari no s'envia enlloc.
    const { textos, mapa } = anonimitzaLlista(historial.map((m) => m.text));

    const d = await callAssistent({
      action: 'ask',
      mode: cat,
      messages: historial.map((m, i) => ({ role: m.role, content: textos[i] })),
      attachments: enviats.map((a) => ({ media_type: a.media_type, data: a.data })),
    });
    setTyping(false);
    setThreads((t) => {
      const prev = t[cat] ?? [];
      const nou: Msg = d.error
        ? { role: 'assistant', text: '⚠️ ' + d.error }
        : {
            role: 'assistant',
            text: desanonimitza(String(d.text ?? ''), mapa),
            sources: (d.sources as Src[]) ?? [],
          };
      return { ...t, [cat]: [...prev, nou] };
    });
    if (d.used) setQuota({ count: d.used.count, limit: d.used.limit });
  }

  const inicial = (user?.email ?? 'A').charAt(0).toUpperCase();

  /* ── Estils reutilitzats ────────────────────────────────────── */
  const card: CSSProperties = {
    border: `1px solid ${D.line}`, borderRadius: 20, padding: 20, background: D.glass,
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', marginBottom: 14,
    boxShadow: '0 16px 40px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.06)',
  };
  const field: CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,.04)', border: `1px solid ${D.line2}`,
    borderRadius: 12, outline: 'none', color: D.ink, fontFamily: D.sans, fontSize: 14.5, padding: '12px 14px',
  };
  const lbl: CSSProperties = {
    display: 'block', fontFamily: D.mono, fontSize: 8.5, letterSpacing: 1.6, color: D.mut2, marginBottom: 7,
  };
  const secTitle = (n: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
      <span style={{ fontFamily: D.mono, fontSize: 9, letterSpacing: 2.2, color: c.accent }}>{n}</span>
      <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
    </div>
  );

  // Pantalla completa: el chat ocupa tot el viewport, sense el chrome del web.
  const shellStyle: CSSProperties = {
    background: D.bg, color: D.ink, fontFamily: D.sans,
    overflow: 'hidden', position: 'relative', height: '100dvh', display: 'flex',
    width: '100%', WebkitFontSmoothing: 'antialiased',
  };
  const ambient = (
    <>
      <style>{`
        .ipc-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.16) transparent}
        .ipc-scroll::-webkit-scrollbar{width:10px;height:10px}
        .ipc-scroll::-webkit-scrollbar-track{background:transparent}
        .ipc-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:99px;
          border:2px solid transparent;background-clip:padding-box}
        .ipc-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.26);
          border:2px solid transparent;background-clip:padding-box}
        .ipc-scroll::-webkit-scrollbar-corner{background:transparent}
        .ipc-md>:first-child{margin-top:0}
        .ipc-md>:last-child{margin-bottom:0}
        .ipc-md p{margin:0 0 10px}
        .ipc-md h3,.ipc-md h4,.ipc-md h5,.ipc-md h6{margin:15px 0 7px;font-size:14.5px;font-weight:800;
          letter-spacing:-.2px;color:#fff}
        .ipc-md ul,.ipc-md ol{margin:0 0 10px;padding-left:19px}
        .ipc-md li{margin:3px 0}
        .ipc-md strong{font-weight:700;color:#fff}
        .ipc-md em{font-style:italic}
        .ipc-md a{color:#FFB27A}
        .ipc-md hr{border:0;border-top:1px solid rgba(255,255,255,.1);margin:13px 0}
        .ipc-md code{font-family:${D.mono};font-size:12.5px;background:rgba(255,255,255,.08);
          padding:1px 5px;border-radius:5px}
        .ipc-md table{border-collapse:collapse;margin:0 0 10px;font-size:13.5px;display:block;
          overflow-x:auto;max-width:100%}
        .ipc-md th,.ipc-md td{border:1px solid rgba(255,255,255,.13);padding:7px 10px;text-align:left;
          vertical-align:top}
        .ipc-md th{background:rgba(255,255,255,.06);font-weight:700;white-space:nowrap}
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
      <div style={{ position: 'absolute', left: '20%', top: 0, width: 620, height: 620, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle,rgba(255,122,26,.16),transparent 62%)', filter: 'blur(10px)' }} />
      <div style={{ position: 'absolute', right: '-8%', bottom: '-16%', width: 560, height: 560, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle,rgba(46,139,212,.14),transparent 64%)', filter: 'blur(10px)' }} />
    </>
  );

  /* ── HOME ───────────────────────────────────────────────────── */
  if (screen === 'home') {
    return (
      <div style={{ background: D.bg, height: '100dvh', overflow: 'hidden' }}>
        <div style={shellStyle}>
          {ambient}
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 30px' }}>
              <Escut />
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.4, lineHeight: 1 }}>
                  infopol<span style={{ color: '#FF7A1A' }}>·chat</span>
                </div>
                <div style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 2.4, color: '#6E6A78', marginTop: 3 }}>
                  ASSISTENT IA POLICIAL
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                {count != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: D.mono, fontSize: 9.5, letterSpacing: 1.6, color: D.mut2, border: `1px solid ${D.line}`, borderRadius: 99, padding: '7px 13px', background: 'rgba(255,255,255,.03)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2FB37A', boxShadow: '0 0 8px #2FB37A' }} />
                    {count} FRAGMENTS · CORPUS INFOPOL
                  </div>
                )}
                <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(150deg,#FF9A47,#EC5F06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', boxShadow: '0 6px 16px rgba(236,95,6,.4)' }}>
                  {inicial}
                </div>
              </div>
            </header>

            <div className="ipc-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px 30px 34px' }}>
              {/* margin:auto centra verticalment PERÒ sense retallar quan no hi cap. */}
              <div style={{ width: '100%', maxWidth: 1030, margin: 'auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 34 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: D.mono, fontSize: 9.5, letterSpacing: 3, color: '#FFA05C', border: '1px solid rgba(255,122,26,.28)', background: 'rgba(255,122,26,.07)', borderRadius: 99, padding: '7px 15px', marginBottom: 20 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF7A1A', boxShadow: '0 0 8px #FF7A1A' }} />
                    DILIGENCIADOR OBERT · GRATUÏT
                  </div>
                  <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: -2.2, lineHeight: 1.04, margin: 0 }}>
                    Bon torn, agent.<br />
                    <span style={{ background: 'linear-gradient(96deg,#FF7A1A,#FFB27A 45%,#6FB6EE)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      En què treballem avui?
                    </span>
                  </h1>
                  <p style={{ color: D.mut, fontSize: 15, lineHeight: 1.5, margin: '16px auto 0', maxWidth: 540 }}>
                    El Diligenciador et redacta la minuta a partir dels fets que li dictis, sobre
                    el corpus normatiu d&apos;InfoPol i amb la referència sempre a la vista. Els
                    altres dos mòduls arriben aviat.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
                  {CATS.map((k) => {
                    const obert = esObert(k.key);
                    return (
                    <button key={k.key} onClick={() => pick(k.key)} disabled={!obert}
                      title={obert ? undefined : 'Encara no està obert'}
                      style={{
                        position: 'relative', overflow: 'hidden', textAlign: 'left',
                        cursor: obert ? 'pointer' : 'default', opacity: obert ? 1 : 0.5,
                        border: `1px solid ${D.line}`, borderRadius: 22, padding: '24px 22px 22px',
                        background: D.glass, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                        color: D.ink,
                        boxShadow: obert
                          ? '0 20px 50px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.07)'
                          : 'inset 0 1px 0 rgba(255,255,255,.05)',
                      }}>
                      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: `linear-gradient(90deg,transparent,${k.accent},transparent)` }} />
                      <div style={{ position: 'absolute', right: -46, top: -46, width: 170, height: 170, borderRadius: '50%', background: `radial-gradient(circle,${k.glow},transparent 68%)` }} />
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ width: 54, height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, background: k.tint, border: `1px solid ${k.border}` }}>{k.icon}</div>
                        <div style={{ fontFamily: D.mono, fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,.1)', letterSpacing: -1 }}>{k.num}</div>
                      </div>
                      <div style={{ position: 'relative', fontFamily: D.mono, fontSize: 9, letterSpacing: 2.2, color: k.accent, margin: '20px 0 7px' }}>{k.kicker}</div>
                      <div style={{ position: 'relative', fontSize: 23, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>{k.title}</div>
                      <div style={{ position: 'relative', color: '#9994A2', fontSize: 13.5, lineHeight: 1.5, marginTop: 9, minHeight: 60 }}>{k.desc}</div>
                      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                        {k.tags.map((t) => (
                          <span key={t} style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 1.2, color: '#B4AFBC', border: `1px solid ${D.line}`, background: 'rgba(255,255,255,.04)', borderRadius: 7, padding: '5px 8px' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.07)', fontFamily: D.mono, fontSize: 9.5, letterSpacing: 1.6, color: obert ? k.accent : '#7C7788' }}>
                        {obert
                          ? <>OBRE EL MÒDUL <span style={{ fontSize: 14 }}>→</span></>
                          : <>ARRIBA AVIAT</>}
                      </div>
                    </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 13, border: `1px solid ${D.line}`, borderRadius: 18, padding: '7px 8px 7px 20px', background: 'rgba(255,255,255,.035)' }}>
                  <span style={{ fontFamily: D.mono, fontSize: 9, letterSpacing: 1.8, color: '#6E6A78', flexShrink: 0 }}>O DICTA DIRECTE</span>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) { setCat(MODE_PER_DEFECTE); setScreen('chat'); void send(draft); } }}
                    placeholder="Ex.: a les 18.30 h, av. de Roureda, col·lisió per abast…"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: D.ink, fontFamily: D.sans, fontSize: 15, padding: '12px 0' }} />
                  <button onClick={() => { if (draft.trim()) { setCat(MODE_PER_DEFECTE); setScreen('chat'); void send(draft); } }}
                    style={{ flexShrink: 0, border: 'none', cursor: 'pointer', borderRadius: 13, width: 46, height: 46, background: 'linear-gradient(150deg,#FF9A47,#EC5F06)', color: '#fff', fontSize: 18, fontWeight: 800, boxShadow: '0 10px 24px rgba(236,95,6,.42)' }}>↑</button>
                </div>

                {!user && (
                  <div style={{ marginTop: 18, textAlign: 'center', fontFamily: D.mono, fontSize: 9, letterSpacing: 1.4, color: '#FFA05C' }}>
                    CAL INICIAR SESSIÓ PER FER SERVIR L&apos;ASSISTENT
                  </div>
                )}

                {isAdmin && (
                  <div style={{ marginTop: 22 }}>
                    <button onClick={() => setShowAdmin((v) => !v)}
                      style={{ border: `1px solid ${D.line2}`, background: 'rgba(255,255,255,.04)', color: D.ink, cursor: 'pointer', borderRadius: 11, padding: '9px 13px', fontFamily: D.sans, fontWeight: 700, fontSize: 13.5 }}>
                      📚 {showAdmin ? 'Amagar' : 'Carregar coneixement'} (admin)
                    </button>
                    {showAdmin && <AdminIngest onDone={(t) => setCount(t)} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORM (Diligenciador, pas 1) ────────────────────────────── */
  if (screen === 'form') {
    return (
      <div style={{ background: D.bg, height: '100dvh', overflow: 'hidden' }}>
        <div style={{ ...shellStyle, flexDirection: 'column' }}>
          {ambient}
          <header style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, padding: '18px 26px', borderBottom: `1px solid ${D.line}`, background: 'rgba(10,10,16,.5)' }}>
            <button onClick={() => setScreen('home')} style={{ width: 36, height: 36, borderRadius: 11, border: `1px solid ${D.line2}`, background: 'rgba(255,255,255,.05)', color: D.ink, fontSize: 17, fontWeight: 800, cursor: 'pointer' }}>‹</button>
            <div style={{ width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, background: c.tint, border: `1px solid ${c.border}` }}>{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.4 }}>Diligenciador</div>
              <div style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 2, color: c.accent, marginTop: 2 }}>FULL D&apos;INICI · DADES DEL SERVEI</div>
            </div>
            <div style={{ fontFamily: D.mono, fontSize: 9, letterSpacing: 1.5, color: D.mut2, border: `1px solid ${D.line}`, borderRadius: 99, padding: '6px 12px' }}>PAS 1 DE 2</div>
          </header>

          <div className="ipc-scroll" style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '26px 26px 30px' }}>
            <div style={{ maxWidth: 820, margin: '0 auto' }}>
              <p style={{ color: D.mut, fontSize: 14, lineHeight: 1.55, margin: '0 0 22px' }}>
                Omple les dades bàsiques i explica què ha passat. Amb això generaré la minuta estructurada.
              </p>

              <div style={card}>
                {secTitle('01 · DADES DEL SERVEI')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 13 }}>
                  <label><span style={lbl}>DATA</span>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ ...field, fontFamily: D.mono }} /></label>
                  <label><span style={lbl}>HORA</span>
                    <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={{ ...field, fontFamily: D.mono }} /></label>
                </div>
                <label style={{ display: 'block', marginBottom: 13 }}><span style={lbl}>UBICACIÓ *</span>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Carrer, número, població o punt quilomètric" style={field} /></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                  <label><span style={lbl}>PATRULLA</span>
                    <input value={form.patrol} onChange={(e) => setForm({ ...form, patrol: e.target.value })} placeholder="Ex.: TIP 4821 i 4907" style={field} /></label>
                  <label><span style={lbl}>INDICATIU</span>
                    <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Ex.: 21-40" style={{ ...field, fontFamily: D.mono }} /></label>
                </div>
              </div>

              <div style={card}>
                {secTitle('02 · IMPLICATS')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {people.map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '34px 1.1fr 1fr 34px', gap: 10, alignItems: 'end' }}>
                      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 11, background: 'rgba(255,122,26,.1)', border: '1px solid rgba(255,122,26,.24)', fontFamily: D.mono, fontSize: 11, fontWeight: 700, color: '#FFA05C' }}>{i + 1}</div>
                      <label><span style={lbl}>NOM I COGNOMS</span>
                        <input value={p.name} onChange={(e) => setPeople(people.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Nom complet" style={{ ...field, height: 44, padding: '0 13px', fontSize: 14 }} /></label>
                      <label><span style={lbl}>DNI / NIE</span>
                        <input value={p.dni} onChange={(e) => setPeople(people.map((x, j) => j === i ? { ...x, dni: e.target.value } : x))} placeholder="00000000X" style={{ ...field, height: 44, padding: '0 13px', fontFamily: D.mono, fontSize: 13.5 }} /></label>
                      <button onClick={() => setPeople(people.filter((_, j) => j !== i))} disabled={people.length === 1}
                        style={{ height: 44, borderRadius: 11, border: `1px solid ${D.line}`, background: 'rgba(255,255,255,.04)', color: D.mut, fontSize: 16, cursor: 'pointer', opacity: people.length === 1 ? 0.35 : 1 }}>✕</button>
                      <div />
                      <label style={{ gridColumn: 'span 2' }}><span style={lbl}>ROL</span>
                        <select value={p.role} onChange={(e) => setPeople(people.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                          style={{ ...field, height: 42, background: 'rgba(255,122,26,.08)', border: '1px solid rgba(255,122,26,.26)', color: '#FFB27A', fontFamily: D.mono, fontSize: 12, fontWeight: 600, padding: '0 12px', cursor: 'pointer' }}>
                          {ROLES.map((r) => <option key={r} value={r} style={{ background: '#15151C', color: D.ink }}>{r}</option>)}
                        </select></label>
                      <div />
                    </div>
                  ))}
                </div>
                <button onClick={() => setPeople([...people, { name: '', dni: '', role: 'Implicat' }])}
                  style={{ marginTop: 13, width: '100%', cursor: 'pointer', border: '1px dashed rgba(255,122,26,.34)', background: 'rgba(255,122,26,.06)', color: '#FFB27A', borderRadius: 13, padding: 13, fontWeight: 700, fontSize: 13.5 }}>
                  ＋ Afegeix implicat
                </button>
              </div>

              <div style={card}>
                {secTitle('03 · QUÈ HA PASSAT *')}
                <textarea value={form.facts} onChange={(e) => setForm({ ...form, facts: e.target.value })}
                  placeholder="Explica-ho en brut, tal com ho recordes: com hi arribeu, què observeu, què manifesten les persones, indicis recollits, actuacions fetes…"
                  style={{ ...field, minHeight: 150, resize: 'vertical', lineHeight: 1.6, borderRadius: 14 }} />
                <div style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 1.2, color: D.faint, marginTop: 10 }}>
                  NO CAL LLENGUATGE JURÍDIC · JA ME N&apos;ENCARREGO JO
                </div>
              </div>

              <button onClick={submitForm} disabled={!formValid}
                style={{
                  width: '100%', border: 'none', borderRadius: 17, padding: 17, fontWeight: 800, fontSize: 15.5,
                  background: formValid ? 'linear-gradient(150deg,#FF9A47,#EC5F06)' : 'rgba(255,255,255,.06)',
                  color: formValid ? '#fff' : D.faint, cursor: formValid ? 'pointer' : 'not-allowed',
                  boxShadow: formValid ? '0 12px 30px rgba(236,95,6,.35)' : 'none',
                }}>
                Genera la minuta →
              </button>
              <div style={{ textAlign: 'center', fontFamily: D.mono, fontSize: 8.5, letterSpacing: 1.4, color: D.faint, marginTop: 13 }}>
                * CAMPS OBLIGATORIS · ELS BUITS ES MARQUEN AMB ⟨…⟩ A L&apos;ESBORRANY
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── CHAT ───────────────────────────────────────────────────── */
  const recents = Object.entries(threads)
    .flatMap(([k, arr]) => arr.filter((m) => m.role === 'user').map((m) => ({ mode: k as Mode, text: m.text })))
    .slice(-6).reverse();

  return (
    <div style={{ background: D.bg, height: '100dvh', overflow: 'hidden' }}>
      <div style={shellStyle}>
        {ambient}

        <aside style={{ position: 'relative', width: 250, flexShrink: 0, borderRight: `1px solid ${D.line}`, background: D.panel, display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 4px 18px' }}>
            <Escut small />
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.4 }}>infopol<span style={{ color: '#FF7A1A' }}>·chat</span></div>
          </div>

          <button onClick={() => { setThreads((t) => ({ ...t, [cat]: [] })); setScreen('home'); }}
            style={{ width: '100%', cursor: 'pointer', border: '1px solid rgba(255,122,26,.3)', background: 'rgba(255,122,26,.1)', color: '#FFB27A', borderRadius: 13, padding: 12, fontWeight: 700, fontSize: 13.5, marginBottom: 22 }}>
            ＋ Nova conversa
          </button>

          <div style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 2.2, color: D.faint, padding: '0 5px 9px' }}>MÒDULS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 22 }}>
            {CATS.map((k) => {
              const on = k.key === cat;
              const obert = esObert(k.key);
              return (
                <button key={k.key} onClick={() => pick(k.key)} disabled={!obert}
                  title={obert ? undefined : 'Encara no està obert'}
                  style={{ width: '100%', textAlign: 'left', cursor: obert ? 'pointer' : 'default', opacity: obert ? 1 : 0.45, border: `1px solid ${on ? k.border : 'transparent'}`, background: on ? k.tint : 'transparent', borderRadius: 12, padding: '10px 11px', display: 'flex', alignItems: 'center', gap: 10, color: D.ink }}>
                  <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: k.tint, border: `1px solid ${k.border}` }}>{k.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: 12.5, lineHeight: 1.2 }}>{k.title}</span>
                    <span style={{ display: 'block', fontFamily: D.mono, fontSize: 8, letterSpacing: 1.2, color: '#7C7788', marginTop: 2 }}>
                      {obert ? k.kicker : 'ARRIBA AVIAT'}
                    </span>
                  </span>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: on ? k.accent : 'transparent' }} />
                </button>
              );
            })}
          </div>

          {recents.length > 0 && (
            <>
              <div style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 2.2, color: D.faint, padding: '0 5px 9px' }}>D&apos;AQUESTA SESSIÓ</div>
              <div className="ipc-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
                {recents.map((h, i) => (
                  <div key={i} onClick={() => pick(h.mode)}
                    style={{ padding: '9px 11px', borderRadius: 10, cursor: 'pointer', borderLeft: `2px solid ${catOf(h.mode).accent}` }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#C9C4D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.text}</div>
                    <div style={{ fontFamily: D.mono, fontSize: 8, letterSpacing: 1, color: '#615D6C', marginTop: 3 }}>{catOf(h.mode).kicker}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(150deg,#FF9A47,#EC5F06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff' }}>{inicial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email ?? 'Convidat'}</div>
              {quota && <div style={{ fontFamily: D.mono, fontSize: 8, letterSpacing: 1.2, color: '#7C7788' }}>{quota.count}/{quota.limit} CONSULTES AVUI</div>}
            </div>
          </div>
        </aside>

        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: `1px solid ${D.line}`, background: 'rgba(10,10,16,.5)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, background: c.tint, border: `1px solid ${c.border}` }}>{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.4 }}>{c.title}</div>
              <div style={{ fontFamily: D.mono, fontSize: 8.5, letterSpacing: 2, color: c.accent, marginTop: 2 }}>{c.kicker}</div>
            </div>
          </header>

          <div ref={threadRef} className="ipc-scroll" style={{ flex: 1, overflowY: 'auto', padding: '26px 24px 14px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {msgs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0 10px' }}>
                  <div style={{ width: 64, height: 64, margin: '0 auto 18px', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, background: c.tint, border: `1px solid ${c.border}` }}>
                    {c.icon}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, color: D.ink }}>{c.title}</div>
                  <div style={{ color: D.mut, fontSize: 14.5, lineHeight: 1.55, marginTop: 10, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                    {c.desc}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => {
                const meu = m.role === 'user';
                return (
                  <div key={i} style={{ display: 'flex', gap: 13, flexDirection: meu ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, background: meu ? 'linear-gradient(150deg,#FF9A47,#EC5F06)' : c.tint, border: `1px solid ${meu ? 'transparent' : c.border}`, color: '#fff' }}>
                      {meu ? inicial : c.icon}
                    </div>
                    <div style={{ maxWidth: '78%', border: `1px solid ${meu ? 'transparent' : D.line2}`, background: meu ? 'rgba(255,122,26,.16)' : 'rgba(255,255,255,.045)', borderRadius: meu ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '15px 17px', boxShadow: '0 10px 28px rgba(0,0,0,.28)' }}>
                      {meu ? (
                        <div style={{ fontSize: 14.5, lineHeight: 1.62, color: D.ink, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                      ) : (
                        <div className="ipc-md" style={{ fontSize: 14.5, lineHeight: 1.62, color: D.ink }}
                          dangerouslySetInnerHTML={{ __html: mdToHtml(m.text) }} />
                      )}
                      {!meu && (m.sources?.length ?? 0) > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 13, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.08)' }}>
                          {dedupe(m.sources ?? []).slice(0, 4).map((r, j) => (
                            <span key={j} style={{ fontFamily: D.mono, fontSize: 9, fontWeight: 600, letterSpacing: 0.8, color: c.accent, border: `1px solid ${c.border}`, background: c.tint, borderRadius: 7, padding: '5px 9px' }}>
                              📖 {(r.title || r.source || '').slice(0, 40)}
                            </span>
                          ))}
                        </div>
                      )}
                      {!meu && m.text && (
                        <div style={{ display: 'flex', gap: 7, marginTop: 13 }}>
                          <button onClick={() => navigator.clipboard.writeText(m.text)}
                            style={{ cursor: 'pointer', fontFamily: D.mono, fontSize: 9, fontWeight: 600, letterSpacing: 1.2, color: '#C9C4D0', border: `1px solid ${D.line2}`, background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '7px 11px' }}>
                            📋 COPIAR
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: c.tint, border: `1px solid ${c.border}` }}>{c.icon}</div>
                  <div style={{ border: `1px solid ${D.line2}`, background: 'rgba(255,255,255,.045)', borderRadius: '4px 16px 16px 16px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span style={{ fontFamily: D.mono, fontSize: 9, letterSpacing: 1.6, color: D.mut2 }}>{c.typingLabel}…</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ flexShrink: 0, padding: '12px 24px 20px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {atts.length > 0 && (
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
                  {atts.map((a, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.05)', border: `1px solid ${D.line2}`, borderRadius: 99, padding: '5px 10px', fontFamily: D.sans, fontSize: 12, color: '#C9C4D0' }}>
                      {a.media_type === 'application/pdf' ? '📄' : '🖼️'} {a.name.slice(0, 22)}
                      <button onClick={() => setAtts(atts.filter((_, k) => k !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: D.mut, fontSize: 13 }}>✕</button>
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 7, marginBottom: 11, overflowX: 'auto' }}>
                {c.chips.map((ch) => (
                  <button key={ch} onClick={() => setDraft(ch)}
                    style={{ flexShrink: 0, cursor: 'pointer', fontFamily: D.mono, fontSize: 9.5, fontWeight: 600, letterSpacing: 1.1, color: '#B4AFBC', border: `1px solid ${D.line2}`, background: 'rgba(255,255,255,.035)', borderRadius: 9, padding: '8px 12px', whiteSpace: 'nowrap' }}>
                    {ch}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 11, border: `1px solid ${D.line2}`, borderRadius: 20, padding: '9px 9px 9px 14px', background: 'rgba(255,255,255,.045)' }}>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple hidden onChange={(e) => void onFiles(e.target.files)} />
                <button onClick={() => fileRef.current?.click()} disabled={atts.length >= MAX_ATT} title="Adjuntar foto o PDF"
                  style={{ flexShrink: 0, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, opacity: atts.length >= MAX_ATT ? 0.4 : 1 }}>📎</button>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={c.placeholder}
                  onKeyDown={(e) => { if (e.key === 'Enter') void send(); }} disabled={typing}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: D.ink, fontFamily: D.sans, fontSize: 15, padding: '13px 0' }} />
                <button onClick={() => void send()} disabled={typing || (!draft.trim() && !atts.length)}
                  style={{ flexShrink: 0, border: 'none', cursor: 'pointer', borderRadius: 14, width: 48, height: 48, background: `linear-gradient(150deg,${c.accent},${c.accent})`, color: '#fff', fontSize: 19, fontWeight: 800, opacity: typing || (!draft.trim() && !atts.length) ? 0.45 : 1, boxShadow: `0 10px 26px ${c.glow}` }}>↑</button>
              </div>
              <div style={{ textAlign: 'center', fontFamily: D.mono, fontSize: 8.5, letterSpacing: 1.4, color: D.faint, marginTop: 11 }}>
                ⚠️ ORIENTATIU · VERIFICA SEMPRE LA NORMA VIGENT ABANS DE TRAMITAR
              </div>
              <div style={{ textAlign: 'center', fontFamily: D.mono, fontSize: 8.5, letterSpacing: 1.4, color: D.faint, marginTop: 5 }}>
                🔒 DNI, MATRÍCULES I TELÈFONS ES SUBSTITUEIXEN ABANS D&apos;ENVIAR · LES FOTOS NO
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Escut de marca ───────────────────────────────────────────── */
function Escut({ small }: { small?: boolean }) {
  const w = small ? 28 : 34, h = small ? 32 : 39;
  return (
    <div style={{ width: w, height: h, background: '#F2EFEA', borderRadius: small ? '9px 9px 10px 10px' : '10px 10px 12px 12px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,122,26,.2)' }}>
      <div style={{ width: small ? 14 : 17, height: small ? 14 : 17, borderRadius: '50%', background: '#FF7A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: small ? 9 : 11 }}>i</div>
      <div style={{ position: 'absolute', bottom: small ? 5 : 6, width: small ? 12 : 14, height: small ? 2.5 : 3, borderRadius: 2, background: '#FF7A1A' }} />
    </div>
  );
}

function dedupe(s: Src[]): Src[] {
  const seen = new Set<string>(); const out: Src[] = [];
  for (const x of s) { const k = x.source || x.title || ''; if (k && !seen.has(k)) { seen.add(k); out.push(x); } }
  return out;
}

/* ── Markdown mínim → HTML ─────────────────────────────────────
   Escapem el text abans de res, així la resposta del model no pot
   injectar HTML. Només interpretem negreta, cursiva, codi, títols,
   llistes i taules, que és tot el que fa servir l'assistent. */
function mdToHtml(src: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s: string) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  const esItem = (l: string) => /^\s*([-*+]|\d+[.)])\s+/.test(l);
  const esTitol = (l: string) => /^\s{0,3}#{1,4}\s/.test(l);
  const out: string[] = [];
  const ls = src.replace(/\r/g, '').split('\n');
  let i = 0;

  while (i < ls.length) {
    const l = ls[i];

    if (/^\s*\|/.test(l) && /^\s*\|[\s:|-]+\|\s*$/.test(ls[i + 1] ?? '')) {
      const cel = (r: string) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cel(l);
      i += 2;
      const files: string[][] = [];
      while (i < ls.length && /^\s*\|/.test(ls[i])) { files.push(cel(ls[i])); i++; }
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${
          files.map((f) => `<tr>${f.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')
        }</tbody></table>`,
      );
      continue;
    }

    const t = l.match(/^\s{0,3}(#{1,4})\s+(.*)$/);
    if (t) { out.push(`<h${Math.min(t[1].length + 2, 6)}>${inline(t[2])}</h${Math.min(t[1].length + 2, 6)}>`); i++; continue; }

    if (esItem(l)) {
      const ord = /^\s*\d+[.)]\s+/.test(l);
      const items: string[] = [];
      while (i < ls.length && esItem(ls[i])) {
        items.push(`<li>${inline(ls[i].replace(/^\s*([-*+]|\d+[.)])\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<${ord ? 'ol' : 'ul'}>${items.join('')}</${ord ? 'ol' : 'ul'}>`);
      continue;
    }

    if (/^\s*(---+|___+)\s*$/.test(l)) { out.push('<hr/>'); i++; continue; }
    if (!l.trim()) { i++; continue; }

    const buf: string[] = [];
    while (i < ls.length && ls[i].trim() && !esItem(ls[i]) && !esTitol(ls[i]) && !/^\s*\|/.test(ls[i])) {
      buf.push(ls[i]); i++;
    }
    out.push(`<p>${inline(buf.join('\n')).replace(/\n/g, '<br/>')}</p>`);
  }
  return out.join('');
}

/* ── Admin: carregar coneixement ──────────────────────────────── */
type CorpusDoc = { title: string; source: string; kind: string; content: string };

/** Paquets de coneixement. Cadascun s'indexa per separat per no refer-ho tot. */
const PACKS: { file: string; label: string; desc: string }[] = [
  { file: 'chat-corpus.json', label: 'Contingut InfoPol', desc: 'Fitxes, operativa i temari de la web' },
  { file: 'chat-corpus-legal.json', label: 'Documents legals', desc: 'Codi penal, LECrim, LO 4/2015, nomenclàtor SCT…' },
  { file: 'chat-corpus-normativa.json', label: 'Normativa de trànsit i Viladecans', desc: 'LSV, RGC, RGV, RGCond i ordenances municipals' },
];

function AdminIngest({ onDone }: { onDone: (total: number) => void }) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('ordenança');
  const [modes, setModes] = useState<Mode[]>(['operativa', 'diligencia', 'servei']);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [packs, setPacks] = useState<Record<string, CorpusDoc[]>>({});
  const [bulkBusy, setBulkBusy] = useState<string | null>(null);
  const [bulkMsg, setBulkMsg] = useState('');
  const [bulkPct, setBulkPct] = useState(0);

  const inp: CSSProperties = {
    width: '100%', border: `1px solid ${D.line2}`, borderRadius: 10, padding: '9px 12px',
    fontFamily: D.sans, fontSize: 14, color: D.ink, background: 'rgba(255,255,255,.04)', outline: 'none',
  };

  useEffect(() => {
    PACKS.forEach(({ file }) => {
      fetch(import.meta.env.BASE_URL + file)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (Array.isArray(d)) setPacks((p) => ({ ...p, [file]: d as CorpusDoc[] })); })
        .catch(() => {});
    });
  }, []);

  async function load() {
    if (!content.trim() || busy) return;
    if (!modes.length) { setMsg('⚠️ Tria com a mínim un mòdul.'); return; }
    setBusy(true); setMsg('Carregant i indexant…');
    const d = await callAssistent({ action: 'ingest', documents: [{ title, source: title, kind, content, modes }], replace: true });
    setBusy(false);
    if (d.error) setMsg('⚠️ ' + d.error);
    else { setMsg(`✅ ${d.inserted} fragments afegits (total ${d.total}).`); setContent(''); if (typeof d.total === 'number') onDone(d.total); }
  }

  async function bulkIngest(file: string, label: string) {
    const corpus = packs[file];
    if (!corpus || bulkBusy) return;
    if (!confirm(`S'indexaran ${corpus.length} documents de «${label}». Cada font substitueix la versió anterior. Pot trigar uns minuts. Continuar?`)) return;
    setBulkBusy(file); setBulkPct(0); setBulkMsg(`Indexant «${label}»…`);
    const BATCH = 6;
    let done = 0, errors = 0, lastTotal: number | null = null;
    for (let i = 0; i < corpus.length; i += BATCH) {
      const batch = corpus.slice(i, i + BATCH);
      const d = await callAssistent({ action: 'ingest', documents: batch, replace: true });
      if (d.error) {
        errors++;
        if (errors >= 2) { setBulkMsg(`⚠️ Aturat per errors: ${d.error} (${done}/${corpus.length} fets)`); setBulkBusy(null); return; }
      } else { errors = 0; if (typeof d.total === 'number') lastTotal = d.total; }
      done += batch.length;
      setBulkPct(Math.round((done / corpus.length) * 100));
      setBulkMsg(`Indexant «${label}»… ${done}/${corpus.length} documents`);
    }
    setBulkBusy(null);
    setBulkMsg(`✅ «${label}» indexat: ${corpus.length} documents.`);
    if (lastTotal != null) onDone(lastTotal);
  }

  return (
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, background: D.bg, color: D.ink, borderRadius: 18, padding: 18, fontFamily: D.sans }}>
      <div style={{ border: '1.5px solid #FF7A1A', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PACKS.map(({ file, label, desc }) => {
          const corpus = packs[file];
          const actiu = bulkBusy === file;
          return (
            <div key={file} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20 }}>📥</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{label}</div>
                <div style={{ fontFamily: D.mono, fontSize: 9, color: D.mut2 }}>
                  {corpus ? `${corpus.length} documents · ${desc}` : 'Carregant…'}
                </div>
              </div>
              <button onClick={() => bulkIngest(file, label)} disabled={!corpus || bulkBusy !== null}
                style={{ border: 'none', background: '#EC5F06', color: '#fff', borderRadius: 11, padding: '10px 16px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', opacity: !corpus || bulkBusy !== null ? 0.5 : 1 }}>
                {actiu ? `${bulkPct}%…` : 'Indexar'}
              </button>
            </div>
          );
        })}
        {bulkMsg && <div style={{ fontSize: 13, color: D.mut }}>{bulkMsg}</div>}
      </div>

      <div style={{ fontFamily: D.mono, fontSize: 9, color: D.mut2 }}>O carrega un document solt (plantilles de minutes, pautes internes, ordenances noves…):</div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
        <input style={inp} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Títol / font (p. ex. Plantilla minuta Viladecans)" />
        <select style={{ ...inp, cursor: 'pointer' }} value={kind} onChange={(e) => setKind(e.target.value)}>
          {['ordenança', 'llei', 'acta', 'procediment', 'plantilla'].map((k) => <option key={k} value={k} style={{ background: '#15151C' }}>{k}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: D.mono, fontSize: 9, color: D.mut2 }}>VISIBLE A:</span>
        {CATS.map((k) => {
          const on = modes.includes(k.key);
          return (
            <button key={k.key} onClick={() => setModes((p) => p.includes(k.key) ? p.filter((x) => x !== k.key) : [...p, k.key])}
              style={{ border: `1px solid ${on ? k.accent : D.line2}`, background: on ? k.tint : 'transparent', color: on ? k.accent : D.mut, cursor: 'pointer', borderRadius: 99, padding: '6px 12px', fontSize: 12.5 }}>
              {k.icon} {k.title}
            </button>
          );
        })}
      </div>

      <textarea style={{ ...inp, minHeight: 150, resize: 'vertical', fontFamily: D.mono, fontSize: 12.5 }} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enganxa aquí el text del document…" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={load} disabled={busy || !content.trim()}
          style={{ border: 'none', background: '#F2EFEA', color: '#15151C', borderRadius: 11, padding: '10px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: busy || !content.trim() ? 0.5 : 1 }}>
          Carregar i indexar
        </button>
        {msg && <span style={{ fontSize: 13, color: D.mut }}>{msg}</span>}
      </div>
    </div>
  );
}
