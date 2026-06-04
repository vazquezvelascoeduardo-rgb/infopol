// Acadèmia — disseny "dashboard amb sidebar" (Claude Design).
// Shell complet (sidebar + topbar + bottomnav + drawer) i 7 seccions
// (Inici, Temari, Tests, Flashcards, Esquemes, Lliga, Estadístiques)
// amb conmutador de curs Mossos ↔ Policia Local. Adaptat a les dades
// i rutes reals de l'app. El chrome global de l'app s'amaga a /academia
// (vegeu Layout.tsx).
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOPICS, getTopicsByCategory, getMossosByAmbit, getMunicipiGroups } from '../data/tests';
import type { TestTopic } from '../data/tests/types';
import { MODULES } from '../lib/content';
import { useGlobalStats, getTopicStats, type GlobalStats } from '../lib/testStats';
import { useFailuresCounts } from '../lib/failures';
import { getAnsweredIds } from '../lib/testProgress';
import { useAuth } from '../lib/auth';
import { getLeaderboard, type LeaderboardEntry } from '../lib/db';

/* ════════════════════════════ TOKENS ════════════════════════════ */
const A = {
  bg: '#F4F1EA', bgDeep: '#ECE7DC', bgSoft: '#FBF9F4', card: '#FFFFFF',
  ink: '#15151C', inkSoft: '#44444F', inkMuted: '#82828D', inkFaint: '#B4B4BC',
  line: 'rgba(21,21,28,0.07)', line2: 'rgba(21,21,28,0.12)', night: '#15161E',
  terracota: '#FF7A1A', terraSoft: '#FFE7D2', terraInk: '#7A2E04',
  blue: '#3B6BF5', blueSoft: '#E2E9FE', blueInk: '#0E2B7A', navy: '#222C4A',
  green: '#1FB286', greenSoft: '#D2F0E2', greenInk: '#0B5A3D',
  red: '#E0455A', redSoft: '#FBDCE0', redInk: '#7A1B22',
  purple: '#9C4FE0', purpleSoft: '#EEE0FB', purpleInk: '#4A1B7A',
  amber: '#E89421', amberSoft: '#FBE7C2', pink: '#E8519B', pinkSoft: '#FCDDEC',
  teal: '#0BB4C2', tealSoft: '#CCEEF1', gold: '#F0B400',
  display: '"Poppins", "Manrope", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  sans: '"Manrope", system-ui, sans-serif',
  rmd: 16, rlg: 22, rxl: 28,
  shadow: '0 1px 0 rgba(21,21,28,0.03), 0 6px 18px rgba(21,21,28,0.05)',
  shadowMd: '0 2px 4px rgba(21,21,28,0.04), 0 14px 36px rgba(21,21,28,0.09)',
  shadowLg: '0 30px 70px rgba(21,21,28,0.16)',
  inset: 'inset 0 -4px 0 rgba(0,0,0,0.16)',
};
type Cat = { solid: string; soft: string; ink: string };
const CAT: Record<string, Cat> = {
  terracota: { solid: A.terracota, soft: A.terraSoft, ink: A.terraInk },
  blue: { solid: A.blue, soft: A.blueSoft, ink: A.blueInk },
  green: { solid: A.green, soft: A.greenSoft, ink: A.greenInk },
  red: { solid: A.red, soft: A.redSoft, ink: A.redInk },
  purple: { solid: A.purple, soft: A.purpleSoft, ink: A.purpleInk },
  amber: { solid: A.amber, soft: A.amberSoft, ink: '#6B3F08' },
  pink: { solid: A.pink, soft: A.pinkSoft, ink: '#7A1B53' },
  teal: { solid: A.teal, soft: A.tealSoft, ink: '#0A4F56' },
};

/* ════════════════════════════ ICONS ════════════════════════════ */
function Ic({ name, size = 22, color = 'currentColor', sw = 2, fill = false }:
  { name: string; size?: number; color?: string; sw?: number; fill?: boolean }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'home': return <svg {...c}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case 'book': return <svg {...c}><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h8M8 11h6" /></svg>;
    case 'target': return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill={color} stroke="none" /></svg>;
    case 'cards': return <svg {...c}><rect x="3" y="7" width="13" height="14" rx="2.5" /><path d="M7 4h11a2 2 0 0 1 2 2v11" /></svg>;
    case 'sketch': return <svg {...c}><path d="M5 3h9l5 5v13H5z" /><path d="M14 3v5h5" /><path d="M8 13h7M8 17h5" /></svg>;
    case 'trophy': return <svg {...c}><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M4 5h3M17 5h3M10 14v3h4v-3M8 21h8M12 17v4" /></svg>;
    case 'chart': return <svg {...c}><path d="M5 21V9M12 21V4M19 21v-8" /></svg>;
    case 'user': return <svg {...c}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" /></svg>;
    case 'search': return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>;
    case 'menu': return <svg {...c}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'grid': return <svg {...c}><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>;
    case 'chevR': return <svg {...c}><path d="M9 6l6 6-6 6" /></svg>;
    case 'chevD': return <svg {...c}><path d="M6 9l6 6 6-6" /></svg>;
    case 'arrow': return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'play': return <svg {...c}><path d="M7 5l12 7-12 7V5z" fill={color} stroke="none" /></svg>;
    case 'check': return <svg {...c}><path d="M5 12l4 4 10-10" /></svg>;
    case 'lock': return <svg {...c}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case 'clock': return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'news': return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h6M7 13h6M16 9h2M16 13h2" /></svg>;
    case 'scale': return <svg {...c}><path d="M12 4v17M6 21h12M5 7h14" /><path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 7l-2.5 6a3 3 0 0 0 5 0L19 7z" /></svg>;
    case 'shield': return <svg {...c}><path d="M12 3l8 3v6c0 4.6-3.4 8.6-8 9.8C7.4 20.6 4 16.6 4 12V6l8-3z" /></svg>;
    case 'car': return <svg {...c}><path d="M5 16l1.2-5a3 3 0 0 1 2.9-2.2h5.8A3 3 0 0 1 17.8 11L19 16" /><rect x="3" y="16" width="18" height="4" rx="1.6" /><path d="M7 20v1.5M17 20v1.5" /></svg>;
    case 'bolt': return <svg {...c} fill={fill ? color : 'none'} stroke={fill ? 'none' : color}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>;
    case 'flame': return <svg {...c} fill={fill ? color : 'none'} stroke={fill ? 'none' : color}><path d="M12 3c2.5 3 4.5 5 4.5 8.5A4.5 4.5 0 0 1 12 21a4.5 4.5 0 0 1-4.5-9.5C7.5 9.5 8.5 8.5 9.5 8c-.5 2.5 1 3.5 2 3.5 0-2.5-1-4 .5-8.5z" /></svg>;
    case 'gem': return <svg {...c} fill={fill ? color : 'none'} stroke={fill ? 'none' : color}><path d="M5 9l3-5h8l3 5-7 11L5 9z" /><path d="M5 9h14M9 4l3 5 3-5M9 9l3 11 3-11" /></svg>;
    case 'swords': return <svg {...c}><path d="M14 4l6 0 0 6M20 4l-9 9M4 14l6 6M4 20l3 0 0-3M14 20l6 0 0-6M10 4L4 4l0 6M4 4l9 9" /></svg>;
    case 'crown': return <svg {...c}><path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8z" /></svg>;
    case 'spark': return <svg {...c}><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></svg>;
    case 'pin': return <svg {...c}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>;
    case 'x': return <svg {...c}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

/* ════════════════════════════ ATOMS ════════════════════════════ */
function Mono({ children, color, size = 11, style = {} }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return <span style={{ fontFamily: A.mono, fontWeight: 600, fontSize: size, letterSpacing: 1.2, textTransform: 'uppercase', color: color || A.inkMuted, ...style }}>{children}</span>;
}
function Card({ children, pad = 20, radius = A.rlg, style = {}, onClick, hover = false }:
  { children: ReactNode; pad?: number; radius?: number; style?: CSSProperties; onClick?: () => void; hover?: boolean }) {
  return <div onClick={onClick} className={hover ? 'a-hover' : ''} style={{ background: A.card, borderRadius: radius, padding: pad, boxShadow: A.shadow, border: `1px solid ${A.line}`, cursor: onClick ? 'pointer' : 'default', ...style }}>{children}</div>;
}
function Bar({ pct = 0, color = A.terracota, h = 8, track = 'rgba(21,21,28,0.08)' }: { pct?: number; color?: string; h?: number; track?: string }) {
  return <div style={{ width: '100%', height: h, borderRadius: 999, background: track, overflow: 'hidden' }}>
    <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', borderRadius: 999, background: color, transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} /></div>;
}
function StatChip({ icon, value, label, color, fillIcon = true }: { icon: string; value: ReactNode; label: string; color: string; fillIcon?: boolean }) {
  return <div style={{ background: A.card, borderRadius: A.rmd, border: `1px solid ${A.line}`, boxShadow: A.shadow, padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Ic name={icon} size={15} color={color} fill={fillIcon} sw={2.2} /><Mono size={10}>{label}</Mono></div>
    <span style={{ fontFamily: A.display, fontWeight: 700, fontSize: 26, color: A.ink, lineHeight: 1 }}>{value}</span>
  </div>;
}
function Btn({ children, color = A.terracota, fg = '#fff', onClick, full, iconR, size = 'md', variant = 'solid', style = {} }:
  { children: ReactNode; color?: string; fg?: string; onClick?: () => void; full?: boolean; iconR?: string; size?: 'sm' | 'md' | 'lg'; variant?: 'solid' | 'ghost'; style?: CSSProperties }) {
  const pad = size === 'sm' ? '9px 16px' : size === 'lg' ? '15px 26px' : '12px 20px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;
  const base: CSSProperties = variant === 'solid'
    ? { background: color, color: fg, boxShadow: A.inset }
    : { background: A.card, color: A.ink, border: `1px solid ${A.line2}`, boxShadow: A.shadow };
  return <button onClick={onClick} className="a-btn" style={{ border: 'none', cursor: 'pointer', width: full ? '100%' : undefined, padding: pad, borderRadius: 14, fontFamily: A.display, fontWeight: 700, fontSize: fs, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, ...base, ...style }}>
    {children}{iconR && <Ic name={iconR} size={fs + 2} color={(base.color as string) || fg} sw={2.4} />}</button>;
}

/* ════════════════════════════ DADES REALS ════════════════════════════ */
type Course = 'pl' | 'mossos';
function courseTopics(course: Course): TestTopic[] {
  if (course === 'mossos') return getTopicsByCategory('mossos');
  return TOPICS.filter((t) => (t.category ?? 'temari') !== 'mossos');
}
function answeredFor(topics: TestTopic[]): number {
  return topics.reduce((acc, t) => acc + getAnsweredIds(t.slug).size, 0);
}
function questionsFor(topics: TestTopic[]): number {
  return topics.reduce((acc, t) => acc + t.questions.length, 0);
}
const CAT_ORDER: { id: TestTopic['category']; cat: string; label: string }[] = [
  { id: 'temari', cat: 'blue', label: 'Lleis i normativa' },
  { id: 'cultura', cat: 'purple', label: 'Cultura general' },
  { id: 'actualitat', cat: 'terracota', label: 'Actualitat' },
  { id: 'municipi', cat: 'teal', label: 'Municipis' },
];
const AMBIT_CAT: Record<string, string> = { A: 'amber', B: 'blue', C: 'teal', D: 'green', E: 'purple' };

type Group = { id: string; cat: string; title: string; sub: string; topics: TestTopic[] };
function buildGroups(course: Course): Group[] {
  if (course === 'mossos') {
    return getMossosByAmbit().map((g) => ({
      id: g.ambit, cat: AMBIT_CAT[g.ambit] || 'blue',
      title: `Àmbit ${g.ambit}`, sub: `${g.topics.length} temes`, topics: g.topics,
    }));
  }
  return CAT_ORDER
    .map((c) => ({ id: c.id || 'temari', cat: c.cat, title: c.label, sub: '', topics: getTopicsByCategory(c.id || 'temari') }))
    .filter((g) => g.topics.length > 0);
}
function pctOf(t: TestTopic): number {
  const total = t.questions.length;
  if (!total) return 0;
  return Math.round((getAnsweredIds(t.slug).size / total) * 100);
}
function pickContinue(topics: TestTopic[]): TestTopic | null {
  let best: { t: TestTopic; pct: number } | null = null;
  for (const t of topics) {
    const p = pctOf(t);
    if (p > 0 && p < 100 && (!best || p > best.pct)) best = { t, pct: p };
  }
  if (best) return best.t;
  return topics[0] ?? null;
}

/* ════════════════════════════ CHROME ════════════════════════════ */
const NAV = [
  { id: 'inici', label: 'Inici', icon: 'home' },
  { id: 'temari', label: 'Temari', icon: 'book', kicker: 'Estudiar' },
  { id: 'tests', label: 'Tests', icon: 'target', kicker: 'Practicar' },
  { id: 'flashcards', label: 'Flashcards', icon: 'cards' },
  { id: 'esquemes', label: 'Esquemes', icon: 'sketch' },
  { id: 'lliga', label: 'Lliga', icon: 'trophy' },
  { id: 'stats', label: 'Estadístiques', icon: 'chart' },
] as const;
type Section = typeof NAV[number]['id'];
const MOBILE_NAV: Section[] = ['inici', 'temari', 'tests', 'flashcards', 'lliga'];

function Logo({ size = 26, onClick }: { size?: number; onClick?: () => void }) {
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, border: 'none', background: 'transparent', cursor: onClick ? 'pointer' : 'default', padding: 0 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill={A.ink} />
      <circle cx="32" cy="22" r="4.2" fill={A.terracota} />
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill={A.terracota} />
    </svg>
    <span style={{ fontFamily: A.sans, fontWeight: 800, fontSize: size * 0.72, letterSpacing: -0.6, color: A.ink }}>info<span style={{ color: A.terracota }}>pol</span></span>
  </button>;
}

function CourseSwitcher({ course, onChange, meta }: { course: Course; onChange: (c: Course) => void; meta: Record<Course, { name: string; accent: string; icon: string; tag: string }> }) {
  const [open, setOpen] = useState(false);
  const c = meta[course];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: A.shadow }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: c.accent, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: A.inset }}><Ic name={c.icon} size={19} color="#fff" sw={2.2} /></span>
        <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          <Mono size={9} style={{ letterSpacing: 0.8 }}>{c.tag}</Mono>
        </span>
        <Ic name="chevD" size={16} color={A.inkMuted} />
      </button>
      {open && (<>
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 140 }} />
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 141, background: A.card, borderRadius: 14, border: `1px solid ${A.line2}`, boxShadow: A.shadowMd, padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(['mossos', 'pl'] as Course[]).map((id) => {
            const o = meta[id];
            return <button key={id} onClick={() => { onChange(id); setOpen(false); }} style={{ border: 'none', background: id === course ? A.bg : 'transparent', cursor: 'pointer', borderRadius: 10, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: o.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic name={o.icon} size={17} color="#fff" sw={2.2} /></span>
              <span style={{ flex: 1 }}><span style={{ display: 'block', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink }}>{o.name}</span><Mono size={9}>{o.tag}</Mono></span>
              {id === course && <Ic name="check" size={16} color={o.accent} sw={3} />}
            </button>;
          })}
        </div>
      </>)}
    </div>
  );
}

/* ════════════════════════════ PÀGINA ════════════════════════════ */
const LS = 'infopol-academia-nav';

export default function Academia() {
  const nav = useNavigate();
  const auth = useAuth();
  const stats = useGlobalStats();
  const failures = useFailuresCounts();

  const init = (() => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; } })();
  const [course, setCourse] = useState<Course>(init.course === 'mossos' ? 'mossos' : 'pl');
  const [section, setSection] = useState<Section>((NAV.some((n) => n.id === init.section) ? init.section : 'inici'));
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ course, section })); } catch { /* */ }
    document.getElementById('a-scroll')?.scrollTo(0, 0);
  }, [course, section]);

  const topics = useMemo(() => courseTopics(course), [course]);
  const base = course === 'mossos' ? '/mossos' : '/policia-local';
  const meta: Record<Course, { name: string; accent: string; icon: string; tag: string; preguntes: number; temes: number }> = {
    mossos: { name: "Mossos d'Esquadra", accent: A.blue, icon: 'shield', tag: 'Temari oposició', temes: getTopicsByCategory('mossos').length, preguntes: questionsFor(getTopicsByCategory('mossos')) },
    pl: { name: 'Policia Local', accent: '#2563EB', icon: 'car', tag: `${getMunicipiGroups().length} municipis`, temes: courseTopics('pl').length, preguntes: questionsFor(courseTopics('pl')) },
  };
  const accent = meta[course].accent;

  // Estadístiques reals
  const answered = answeredFor(topics);
  const xp = answered * 12;
  const level = Math.max(1, Math.floor(xp / 200) + 1);
  const gems = answered * 5;
  const streak = answered > 0 ? Math.min(99, Math.max(1, Math.floor(answered / 4))) : 0;
  const acc = (() => { let cr = 0, q = 0; for (const k in stats.topics) { cr += stats.topics[k].totalCorrect; q += stats.topics[k].totalQuestions; } return q > 0 ? Math.round((cr / q) * 100) : 0; })();
  const liveStats = { streak, xp, level, gems, due: failures.due, acc, answered };

  const go = (s: Section) => setSection(s);
  const ctx = { course, base, accent, meta: meta[course], topics, nav, go, stats: liveStats, gstats: stats, userName: auth.profile?.name || auth.user?.email?.split('@')[0] || 'opositor/a', userId: auth.user?.id };

  const screens: Record<Section, ReactNode> = {
    inici: <SecInici ctx={ctx} />,
    tests: <SecTests ctx={ctx} />,
    temari: <SecTemari ctx={ctx} />,
    flashcards: <SecFlashcards ctx={ctx} />,
    esquemes: <SecEsquemes ctx={ctx} />,
    lliga: <SecLliga ctx={ctx} />,
    stats: <SecStats ctx={ctx} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: A.bg }}>
      {/* Sidebar (desktop) */}
      <aside className="a-sidebar" style={{ width: 256, flexShrink: 0, height: '100vh', position: 'sticky', top: 0, background: A.bgSoft, borderRight: `1px solid ${A.line}`, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        <div style={{ padding: '2px 6px 0' }}><Logo onClick={() => nav('/')} /></div>
        <CourseSwitcher course={course} onChange={setCourse} meta={meta} />
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((n) => <NavItem key={n.id} n={n} on={section === n.id} accent={accent} onClick={() => go(n.id)} />)}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ background: A.terraSoft, borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset, flexShrink: 0 }}><Ic name="flame" size={22} color="#fff" fill sw={0} /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.terraInk }}>{streak} dies de ratxa</div>
              <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.terraInk, opacity: 0.8 }}>No la perdis avui!</div>
            </div>
          </div>
        </div>
      </aside>

      <div id="a-scroll" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Top bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(244,241,234,0.82)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderBottom: `1px solid ${A.line}`, padding: '12px clamp(16px, 3vw, 34px)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => setDrawer(true)} className="a-only-mobile" style={{ border: 'none', background: A.card, width: 42, height: 42, borderRadius: 12, boxShadow: A.shadow, cursor: 'pointer', placeItems: 'center', flexShrink: 0 }}><Ic name="menu" size={20} color={A.inkSoft} /></button>
          <div style={{ flex: 1, maxWidth: 560, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={17} color={A.inkMuted} /></span>
            <input placeholder="Cerca per article, norma, paraula clau…"
              onKeyDown={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) nav(`/cerca?q=${encodeURIComponent(v)}`); } }}
              style={{ width: '100%', border: `1px solid ${A.line2}`, background: A.card, borderRadius: 999, padding: '11px 16px 11px 40px', fontFamily: A.sans, fontSize: 14, color: A.ink, outline: 'none', boxShadow: A.shadow, boxSizing: 'border-box' }} />
          </div>
          <div className="a-hide-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MiniStat icon="flame" value={streak} color={A.terracota} />
            <MiniStat icon="bolt" value={xp} color={A.gold} />
            <MiniStat icon="gem" value={gems} color={A.blue} />
          </div>
          <button onClick={() => nav('/perfil')} style={{ width: 42, height: 42, borderRadius: 999, border: 'none', cursor: 'pointer', background: A.ink, color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{(ctx.userName[0] || 'E').toUpperCase()}</button>
        </header>

        <main className="a-main-pad" style={{ flex: 1, padding: 'clamp(20px, 3vw, 38px)', maxWidth: 1240, width: '100%', margin: '0 auto' }}>{screens[section]}</main>

        <footer style={{ padding: '24px clamp(20px,3vw,38px)', borderTop: `1px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, color: A.inkMuted }}>© 2026 Infopol · Informació no oficial</span>
        </footer>
      </div>

      {/* Drawer (mobile) */}
      {drawer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 160 }}>
          <div onClick={() => setDrawer(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,28,0.4)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, background: A.bgSoft, padding: 18, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: A.shadowLg, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Logo onClick={() => nav('/')} />
              <button onClick={() => setDrawer(false)} style={{ border: 'none', background: A.card, width: 36, height: 36, borderRadius: 10, boxShadow: A.shadow, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Ic name="x" size={18} color={A.inkSoft} /></button>
            </div>
            <CourseSwitcher course={course} onChange={setCourse} meta={meta} />
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {NAV.map((n) => <NavItem key={n.id} n={n} on={section === n.id} accent={accent} onClick={() => { go(n.id); setDrawer(false); }} />)}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom nav (mobile) */}
      <nav className="a-bottomnav" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 35, background: 'rgba(251,249,244,0.94)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderTop: `1px solid ${A.line2}`, padding: '8px 6px calc(8px + env(safe-area-inset-bottom))', justifyContent: 'space-around' }}>
        {MOBILE_NAV.map((id) => {
          const n = NAV.find((x) => x.id === id)!; const on = section === id;
          return <button key={id} onClick={() => go(id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
            <span style={{ width: 40, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: on ? `${accent}22` : 'transparent' }}><Ic name={n.icon} size={21} color={on ? accent : A.inkMuted} sw={2.2} /></span>
            <span style={{ fontFamily: A.sans, fontWeight: on ? 800 : 600, fontSize: 10.5, color: on ? A.ink : A.inkMuted }}>{n.label}</span>
          </button>;
        })}
      </nav>
    </div>
  );
}

function NavItem({ n, on, accent, onClick }: { n: typeof NAV[number]; on: boolean; accent: string; onClick: () => void }) {
  return <button onClick={onClick} className="a-navitem" style={{ cursor: 'pointer', textAlign: 'left', background: on ? A.card : 'transparent', boxShadow: on ? A.shadow : 'none', border: on ? `1px solid ${A.line}` : '1px solid transparent', borderRadius: 13, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', transition: 'background .12s' }}>
    <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: on ? accent : A.bgDeep, display: 'grid', placeItems: 'center', boxShadow: on ? A.inset : 'none' }}><Ic name={n.icon} size={17} color={on ? '#fff' : A.inkSoft} sw={2.2} /></span>
    <span style={{ flex: 1, minWidth: 0 }}>
      <span style={{ display: 'block', fontFamily: A.display, fontWeight: on ? 700 : 600, fontSize: 14.5, color: on ? A.ink : A.inkSoft }}>{n.label}</span>
      {'kicker' in n && n.kicker && <Mono size={9} color={on ? accent : A.inkFaint} style={{ letterSpacing: 0.6 }}>{n.kicker}</Mono>}
    </span>
  </button>;
}
function MiniStat({ icon, value, color }: { icon: string; value: ReactNode; color: string }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: A.card, border: `1px solid ${A.line}`, borderRadius: 999, padding: '7px 12px', boxShadow: A.shadow }}>
    <Ic name={icon} size={15} color={color} fill sw={0} /><span style={{ fontFamily: A.mono, fontWeight: 700, fontSize: 13, color: A.ink }}>{value}</span></div>;
}

/* ════════════════════════════ CONTEXT TYPE ════════════════════════════ */
type Ctx = {
  course: Course; base: string; accent: string;
  meta: { name: string; accent: string; icon: string; tag: string; preguntes: number; temes: number };
  topics: TestTopic[]; nav: ReturnType<typeof useNavigate>; go: (s: Section) => void;
  stats: { streak: number; xp: number; level: number; gems: number; due: number; acc: number; answered: number };
  gstats: GlobalStats; userName: string; userId?: string;
};

const PageHead = ({ kicker, title, accent, desc }: { kicker: string; title: string; accent: string; desc?: string }) => (
  <div style={{ marginBottom: 22 }}>
    <Mono color={accent} style={{ letterSpacing: 1.4 }}>{kicker}</Mono>
    <h1 style={{ margin: '8px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,38px)', letterSpacing: -1, color: A.ink, lineHeight: 1.1 }}>{title}</h1>
    {desc && <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 15, color: A.inkSoft, maxWidth: 560, lineHeight: 1.5 }}>{desc}</p>}
  </div>
);

/* ════════════════════════════ INICI ════════════════════════════ */
function SecInici({ ctx }: { ctx: Ctx }) {
  const cont = pickContinue(ctx.topics);
  const contPct = cont ? pctOf(cont) : 0;
  const recents = useMemo(() => Object.entries(ctx.gstats.topics)
    .map(([slug, s]) => ({ slug, ...s }))
    .filter((x) => x.lastAt > 0)
    .sort((a, b) => b.lastAt - a.lastAt).slice(0, 3), [ctx.gstats]);
  const startTopic = (slug: string) => ctx.nav(`${ctx.base}/${slug}`);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <Mono color={A.terracota} style={{ letterSpacing: 1.4 }}>Hola, {ctx.userName} · Continua la preparació</Mono>
        <h1 style={{ margin: '8px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.2vw,34px)', letterSpacing: -1, color: A.ink, lineHeight: 1.12 }}>
          {cont ? <>Avui et toca <span style={{ color: A.terracota }}>{cont.title}</span></> : 'Comença la teva preparació'}
        </h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="a-grid-stats">
        <StatChip icon="flame" value={`${ctx.stats.streak}`} label="Ratxa · dies" color={A.terracota} />
        <StatChip icon="bolt" value={ctx.stats.xp} label={`XP · Nivell ${ctx.stats.level}`} color={A.gold} />
        <StatChip icon="gem" value={ctx.stats.gems} label="Gemmes" color={A.blue} />
        <StatChip icon="target" value={`${ctx.stats.acc}%`} label="Encerts" color={A.green} fillIcon={false} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="a-grid-fork">
        <ForkCard accent={A.terracota} soft={A.terraSoft} kicker="Estudiar" icon="book" title="Continua el temari"
          desc={cont ? cont.title : 'Tria un tema per començar.'} meta={`${contPct}% completat`} pct={contPct}
          cta="Continuar tema" onClick={() => ctx.go('temari')} />
        <ForkCard accent={A.blue} soft={A.blueSoft} kicker="Practicar" icon="target" title="Llança un test"
          desc="Test ràpid de tot el temari o tria un tema concret." meta={`${ctx.meta.preguntes.toLocaleString('ca-ES')} preguntes · ${ctx.meta.temes} temes`}
          cta="Començar test" onClick={() => ctx.go('tests')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }} className="a-grid-2col">
        <Card pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Ic name="flame" size={16} color={A.terracota} fill sw={0} /><Mono color={A.inkSoft}>Què fer avui</Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Mission icon="target" cat="blue" title="Test ràpid · Tots els temes" sub={`${ctx.meta.preguntes.toLocaleString('ca-ES')} preguntes`} onClick={() => ctx.nav(`${ctx.base}/tot`)} />
            <Mission icon="cards" cat="terracota" title="Flashcards d'avui" sub="Repàs espaiat" onClick={() => ctx.go('flashcards')} />
            <Mission icon="book" cat="purple" title={ctx.stats.due > 0 ? `Repassa ${ctx.stats.due} fallades` : 'Repàs intel·ligent'} sub={ctx.stats.due > 0 ? 'Pendents per avui' : 'Al dia ✓'} state={ctx.stats.due > 0 ? 'active' : 'done'} onClick={() => ctx.nav(`${ctx.base}/repas`)} />
          </div>
        </Card>
        <div style={{ background: `linear-gradient(160deg, ${A.terraSoft}, #FFF3E6)`, borderRadius: A.rlg, padding: 20, border: `1px solid ${A.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><Ic name="crown" size={16} color={A.terracota} sw={2.2} /><Mono color={A.terraInk}>Accés ràpid</Mono></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ icon: 'sketch', t: 'Esquemes ràpids', s: () => ctx.go('esquemes') }, { icon: 'trophy', t: 'Lliga setmanal', s: () => ctx.go('lliga') }, { icon: 'chart', t: 'Les meves estadístiques', s: () => ctx.go('stats') }].map((u, i) => (
              <button key={i} onClick={u.s} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '10px 12px', textAlign: 'left' }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic name={u.icon} size={16} color={A.terracota} sw={2.2} /></span>
                <span style={{ flex: 1, fontFamily: A.display, fontWeight: 600, fontSize: 13.5, color: A.ink }}>{u.t}</span>
                <Ic name="chevR" size={16} color={A.inkFaint} />
              </button>
            ))}
          </div>
        </div>
      </div>
      {recents.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><Ic name="clock" size={15} color={A.inkMuted} sw={2.2} /><Mono color={A.inkSoft}>Els teus últims tests</Mono></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {recents.map((r) => {
              const topic = TOPICS.find((tp) => tp.slug === r.slug);
              const mark = (r.last || r.best).toFixed(1);
              return <Card key={r.slug} pad={14} hover onClick={() => startTopic(r.slug)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 42, height: 42, borderRadius: 12, background: (r.best >= 5 ? A.green : A.red), flexShrink: 0, display: 'grid', placeItems: 'center', fontFamily: A.display, fontWeight: 700, fontSize: 15, color: '#fff', boxShadow: A.inset }}>{mark}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topic?.title || r.slug}</div>
                  <Mono size={10}>{r.attempts} intent{r.attempts === 1 ? '' : 's'} · millor {r.best.toFixed(1)}</Mono>
                </div>
                <Btn size="sm" variant="ghost">Repetir</Btn>
              </Card>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
function ForkCard({ accent, soft, kicker, icon, title, desc, meta, pct, cta, onClick }: { accent: string; soft: string; kicker: string; icon: string; title: string; desc: string; meta: string; pct?: number; cta: string; onClick: () => void }) {
  return <div onClick={onClick} className="a-hover" style={{ cursor: 'pointer', background: A.card, borderRadius: A.rxl, border: `1px solid ${A.line}`, boxShadow: A.shadowMd, padding: 24, display: 'flex', flexDirection: 'column', minHeight: 200, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: soft, opacity: 0.6 }} />
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ width: 48, height: 48, borderRadius: 14, background: accent, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name={icon} size={26} color="#fff" sw={2.2} /></span>
      <Mono color={accent} style={{ letterSpacing: 1.4 }}>{kicker}</Mono>
    </div>
    <h3 style={{ position: 'relative', margin: 0, fontFamily: A.display, fontWeight: 700, fontSize: 23, letterSpacing: -0.6, color: A.ink }}>{title}</h3>
    <p style={{ position: 'relative', margin: '6px 0 0', fontFamily: A.sans, fontSize: 14, color: A.inkSoft, lineHeight: 1.45 }}>{desc}</p>
    <div style={{ marginTop: 'auto', position: 'relative', paddingTop: 18 }}>
      {pct != null && <div style={{ marginBottom: 12 }}><Bar pct={pct} color={accent} /></div>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Mono size={10}>{meta}</Mono><Btn size="sm" color={accent} iconR="arrow">{cta}</Btn>
      </div>
    </div>
  </div>;
}
function Mission({ icon, cat, title, sub, state = 'active', onClick }: { icon: string; cat: string; title: string; sub: string; state?: 'done' | 'active' | 'locked'; onClick?: () => void }) {
  const k = CAT[cat] || CAT.blue; const done = state === 'done', locked = state === 'locked';
  return <div onClick={locked ? undefined : onClick} className={locked ? '' : 'a-hover'} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px', borderRadius: 14, background: done ? A.greenSoft : A.bgSoft, border: `1px solid ${A.line}`, cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.6 : 1 }}>
    <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: done ? A.green : locked ? A.bgDeep : k.solid, boxShadow: locked ? 'none' : A.inset }}><Ic name={done ? 'check' : locked ? 'lock' : icon} size={20} color={locked ? A.inkMuted : '#fff'} sw={done ? 3 : 2.2} /></span>
    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14.5, color: A.ink }}>{title}</div><Mono size={10}>{sub}</Mono></div>
    {!locked && !done && <Ic name="chevR" size={18} color={A.inkFaint} />}{done && <Mono size={10} color={A.greenInk}>AL DIA</Mono>}
  </div>;
}

/* ════════════════════════════ TESTS ════════════════════════════ */
function SecTests({ ctx }: { ctx: Ctx }) {
  const groups = useMemo(() => buildGroups(ctx.course), [ctx.course]);
  const [open, setOpen] = useState<string | null>(groups[0]?.id ?? null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHead kicker="Practicar · Banc de tests" title="Posa't a prova" accent={A.blue} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }} className="a-grid-fork">
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: `linear-gradient(150deg, ${A.terracota}, #E8590C)`, padding: 26, color: '#fff', boxShadow: A.shadowMd }}>
          <Mono color="rgba(255,255,255,0.85)" style={{ letterSpacing: 1.4 }}>Test ràpid · Destacat</Mono>
          <h3 style={{ margin: '12px 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 26, letterSpacing: -0.6 }}>Tots els temes</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92, maxWidth: 360 }}>Test mixt amb preguntes de TOT el temari. Mesura el teu nivell global.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
            <Mono color="rgba(255,255,255,0.85)">{ctx.meta.preguntes.toLocaleString('ca-ES')} preguntes</Mono>
            <button onClick={() => ctx.nav(`${ctx.base}/tot`)} className="a-btn" style={{ border: 'none', cursor: 'pointer', background: '#fff', color: A.terracota, borderRadius: 13, padding: '12px 22px', fontFamily: A.display, fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}><Ic name="play" size={15} color={A.terracota} /> Començar</button>
          </div>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, backgroundImage: `linear-gradient(150deg, #14946F, ${A.greenInk})`, padding: 26, color: '#fff', boxShadow: A.shadowMd }}>
          <Mono color="rgba(255,255,255,0.85)" style={{ letterSpacing: 1.4 }}>Repàs intel·ligent</Mono>
          <h3 style={{ margin: '12px 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 24, letterSpacing: -0.6 }}>Les teves fallades</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92 }}>{ctx.stats.due > 0 ? `Tens ${ctx.stats.due} preguntes a punt per repassar.` : 'Estàs al dia amb el repàs.'}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
            <Mono color="rgba(255,255,255,0.85)">{ctx.stats.due} pendents</Mono>
            <button onClick={() => ctx.nav(`${ctx.base}/repas`)} className="a-btn" style={{ border: 'none', cursor: 'pointer', background: '#fff', color: A.greenInk, borderRadius: 13, padding: '12px 22px', fontFamily: A.display, fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}>Repassar <Ic name="arrow" size={15} color={A.greenInk} /></button>
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 14px' }}><Ic name="grid" size={15} color={A.inkMuted} sw={2.2} /><Mono color={A.inkSoft}>Tria un {ctx.course === 'mossos' ? 'àmbit' : 'bloc'} concret</Mono></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {groups.map((g) => <GroupAccordion key={g.id} g={g} open={open === g.id} onToggle={() => setOpen(open === g.id ? null : g.id)} onTopic={(slug) => ctx.nav(`${ctx.base}/${slug}`)} />)}
        </div>
      </div>
    </div>
  );
}
function GroupAccordion({ g, open, onToggle, onTopic }: { g: Group; open: boolean; onToggle: () => void; onTopic: (slug: string) => void }) {
  const k = CAT[g.cat] || CAT.blue;
  const totalQ = questionsFor(g.topics);
  return (
    <div style={{ background: A.card, borderRadius: A.rlg, border: `1px solid ${open ? k.solid : A.line}`, boxShadow: A.shadow, overflow: 'hidden', transition: 'border-color .2s' }}>
      <button onClick={onToggle} style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
        <span style={{ width: 46, height: 46, borderRadius: 13, background: k.solid, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: A.inset, fontFamily: A.display, fontWeight: 700, fontSize: 16, color: '#fff' }}>{g.id.length <= 2 ? g.id : g.title[0]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16.5, color: A.ink, letterSpacing: -0.3 }}>{g.title}</div>
          <Mono size={10} style={{ marginTop: 2 }}>{g.topics.length} temes · {totalQ.toLocaleString('ca-ES')} preguntes</Mono>
        </div>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: open ? k.soft : A.bgSoft, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}><Ic name="chevD" size={18} color={open ? k.solid : A.inkMuted} /></span>
      </button>
      {open && (
        <div style={{ padding: '4px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {g.topics.map((t) => {
            const p = pctOf(t);
            return <div key={t.slug} className="a-hover" onClick={() => onTopic(t.slug)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 13, padding: '11px 12px', borderRadius: 13, background: A.bgSoft }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: A.card, border: `1px solid ${A.line}`, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 18 }}>{t.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14.5, color: A.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                {t.description && <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.inkMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</div>}
                {p > 0 && <div style={{ marginTop: 7, maxWidth: 200 }}><Bar pct={p} color={k.solid} h={5} /></div>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <Mono size={10} style={{ display: 'block', marginBottom: 4 }}>{t.questions.length} preg.</Mono>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: A.display, fontWeight: 700, fontSize: 13, color: p > 0 ? A.green : k.solid }}>{p > 0 ? 'Continuar' : 'Començar'} <Ic name="arrow" size={14} color={p > 0 ? A.green : k.solid} /></span>
              </div>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════ TEMARI ════════════════════════════ */
function SecTemari({ ctx }: { ctx: Ctx }) {
  if (ctx.course === 'mossos') {
    const groups = getMossosByAmbit();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <PageHead kicker="Estudiar · Temari" title="El teu camí d'estudi" accent={A.terracota} desc="Avança àmbit a àmbit. Cada tema amb el seu temari i tests." />
        {groups.map((g) => {
          const k = CAT[AMBIT_CAT[g.ambit] || 'blue'];
          return <div key={g.ambit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 12px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: k.solid, display: 'grid', placeItems: 'center', fontFamily: A.display, fontWeight: 700, fontSize: 14, color: '#fff' }}>{g.ambit}</span>
              <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: A.ink }}>Àmbit {g.ambit}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {g.topics.map((t) => <TemaNode key={t.slug} t={t} k={k} onClick={() => ctx.nav(`/mossos/temari/${g.ambit}`)} />)}
            </div>
          </div>;
        })}
      </div>
    );
  }
  // Policia Local → mòduls de lleis (Leyes)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHead kicker="Estudiar · Temari" title="Lleis i temari" accent={A.terracota} desc="Fitxes per matèria amb el contingut per estudiar. Toca per obrir." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {MODULES.map((m) => (
          <Card key={m.slug} pad={16} hover onClick={() => ctx.nav(`/leyes/s/${m.slug}`)} style={{ display: 'flex', alignItems: 'center', gap: 13, borderLeft: `3px solid ${A.terracota}` }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: A.terraSoft, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 22 }}>{m.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14.5, color: A.ink }}>{m.title}</div>
              {m.description && <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.inkMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.description}</div>}
            </div>
            <Ic name="chevR" size={18} color={A.inkFaint} />
          </Card>
        ))}
      </div>
    </div>
  );
}
function TemaNode({ t, k, onClick }: { t: TestTopic; k: Cat; onClick: () => void }) {
  const p = pctOf(t); const done = p >= 100; const active = p > 0 && p < 100;
  return <div className="a-hover" onClick={onClick} style={{ cursor: 'pointer', background: active ? k.soft : A.card, borderRadius: A.rlg, border: `1px solid ${active ? k.solid : A.line}`, boxShadow: A.shadow, padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
    <span style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: done ? A.green : k.solid, boxShadow: A.inset, fontSize: 20 }}>{done ? <Ic name="check" size={22} color="#fff" sw={3} /> : t.icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Mono size={10} color={done ? A.green : k.solid}>{done ? 'Completat' : active ? 'En curs' : `${t.questions.length} preguntes`}</Mono>
      <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15, color: A.ink, margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
      {active && <div style={{ marginTop: 5 }}><Bar pct={p} color={k.solid} h={6} /></div>}
    </div>
    <Ic name="chevR" size={18} color={A.inkFaint} />
  </div>;
}

/* ════════════════════════════ FLASHCARDS ════════════════════════════ */
function SecFlashcards({ ctx }: { ctx: Ctx }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHead kicker="Repàs espaiat · Flashcards" title="Memoritza sense esforç" accent={A.terracota} desc="Repassa amb repetició espaiada: les cartes que falles tornen abans." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'stretch' }} className="a-grid-2col">
        <div onClick={() => setFlipped((f) => !f)} style={{ cursor: 'pointer', minHeight: 260, borderRadius: A.rxl, background: flipped ? A.night : A.card, border: `1px solid ${A.line}`, boxShadow: A.shadowMd, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', transition: 'background .25s' }}>
          <Mono color={flipped ? 'rgba(255,255,255,0.6)' : A.inkMuted}>{flipped ? 'Resposta' : 'Pregunta · toca per girar'}</Mono>
          <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.3, color: flipped ? '#fff' : A.ink, marginTop: 14, maxWidth: 460 }}>
            {flipped ? "L'article 15 CE reconeix el dret a la vida i a la integritat física i moral, i prohibeix la tortura." : 'Quin article de la CE reconeix el dret a la integritat física i moral?'}
          </div>
        </div>
        <Card pad={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: A.terraSoft, display: 'grid', placeItems: 'center', margin: '0 auto' }}><Ic name="cards" size={28} color={A.terracota} sw={2.2} /></span>
          <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: A.ink }}>Sessió de repàs</div>
          <p style={{ margin: 0, fontFamily: A.sans, fontSize: 13, color: A.inkSoft }}>Repassa les flashcards del teu temari amb el sistema SRS.</p>
          <Btn full color={A.terracota} iconR="arrow" onClick={() => ctx.nav(`${ctx.base}/flashcards`)}>Obrir flashcards</Btn>
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════ ESQUEMES ════════════════════════════ */
function SecEsquemes({ ctx }: { ctx: Ctx }) {
  const route = ctx.course === 'mossos' ? '/mossos/esquemes' : '/policia-local/esquemes';
  const items = ctx.topics.slice(0, 9);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHead kicker="Format nou · Esquemes ràpids" title="Repassa en 5 minuts" accent={A.pink} desc="Cada llei, resumida visualment: línia temporal, conceptes clau i fets d'examen." />
      <Btn color={A.pink} iconR="arrow" onClick={() => ctx.nav(route)} style={{ alignSelf: 'flex-start' }}>Veure tots els esquemes</Btn>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {items.map((t) => (
          <Card key={t.slug} pad={18} hover onClick={() => ctx.nav(route)} style={{ borderTop: `3px solid ${A.pink}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: A.pinkSoft, display: 'grid', placeItems: 'center', fontSize: 18 }}>{t.icon}</span>
            </div>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.3 }}>{t.title}</div>
            <Mono size={10} style={{ marginTop: 4 }}>Esquema ràpid · 5 min</Mono>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════ LLIGA ════════════════════════════ */
function SecLliga({ ctx }: { ctx: Ctx }) {
  const [board, setBoard] = useState<LeaderboardEntry[] | null>(null);
  useEffect(() => { let alive = true; getLeaderboard(20).then((d) => { if (alive) setBoard(d); }).catch(() => setBoard([])); return () => { alive = false; }; }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHead kicker="Competeix · Lliga" title="Lliga d'opositors" accent={A.purple} desc="Guanya XP estudiant i puja al rànquing global d'usuaris." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }} className="a-grid-2col">
        <Card pad={10}>
          {board === null && <div style={{ padding: 24, textAlign: 'center' }}><Mono>Carregant…</Mono></div>}
          {board !== null && board.length === 0 && <div style={{ padding: 24, textAlign: 'center' }}><Mono>Encara no hi ha classificació. Fes tests per puntuar!</Mono></div>}
          {board?.map((p, i) => {
            const rank = i + 1; const promo = rank <= 3; const you = !!ctx.userId && p.id === ctx.userId;
            return <div key={p.id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: you ? A.purpleSoft : 'transparent', border: you ? `1px solid ${A.purple}` : '1px solid transparent' }}>
              <span style={{ width: 30, textAlign: 'center', fontFamily: A.display, fontWeight: 700, fontSize: 16, color: promo ? A.purple : A.inkMuted }}>{rank}</span>
              <span style={{ width: 40, height: 40, borderRadius: 999, background: you ? A.purple : A.bgDeep, color: you ? '#fff' : A.inkSoft, display: 'grid', placeItems: 'center', fontFamily: A.display, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{(p.display_name || '?')[0].toUpperCase()}</span>
              <span style={{ flex: 1, fontFamily: A.display, fontWeight: 600, fontSize: 15, color: A.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.display_name || 'Anònim'}{you ? ' · tu' : ''}</span>
              {promo && <Ic name="arrow" size={16} color={A.green} sw={2.5} />}
              <Mono size={11} color={A.inkSoft}>{(p.total_xp ?? 0).toLocaleString('ca-ES')} XP</Mono>
            </div>;
          })}
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: `linear-gradient(160deg, ${A.purpleSoft}, #F6ECFD)`, borderRadius: A.rlg, padding: 20, border: `1px solid ${A.line}`, textAlign: 'center' }}>
            <span style={{ width: 64, height: 64, borderRadius: 18, background: A.purple, display: 'grid', placeItems: 'center', margin: '0 auto 12px', boxShadow: A.inset }}><Ic name="bolt" size={32} color="#fff" fill sw={0} /></span>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 22, color: A.purpleInk }}>{ctx.stats.xp.toLocaleString('ca-ES')} XP</div>
            <Mono size={10} style={{ marginTop: 2 }}>El teu XP · Nivell {ctx.stats.level}</Mono>
          </div>
          <Card pad={16}>
            <Mono>Reptes diaris</Mono>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.ink, margin: '6px 0 4px' }}>Missions i ratxa</div>
            <p style={{ margin: '0 0 12px', fontFamily: A.sans, fontSize: 13, color: A.inkSoft }}>Completa reptes diaris i mantén la teva ratxa.</p>
            <Btn full color={A.purple} iconR="arrow" onClick={() => ctx.nav('/retos')}>Anar a Reptes</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════ STATS ════════════════════════════ */
function SecStats({ ctx }: { ctx: Ctx }) {
  const byTopic = useMemo(() => ctx.topics.map((t) => ({ t, st: getTopicStats(t.slug) }))
    .filter((x) => x.st && x.st.attempts > 0)
    .sort((a, b) => (b.st!.best) - (a.st!.best)).slice(0, 6), [ctx.topics]);
  const palette = ['green', 'blue', 'purple', 'amber', 'teal', 'red'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHead kicker="El teu progrés" title="Estadístiques" accent={A.green} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }} className="a-grid-stats">
        <StatBig big={`${ctx.stats.acc}%`} label="Encerts globals" sub="mitjana" color={A.green} />
        <StatBig big={ctx.stats.answered.toLocaleString('ca-ES')} label="Preguntes fetes" sub={ctx.meta.name} color={A.blue} />
        <StatBig big={`${ctx.stats.xp.toLocaleString('ca-ES')}`} label="XP acumulada" sub={`Nivell ${ctx.stats.level}`} color={A.purple} />
        <StatBig big={`${ctx.stats.streak}`} label="Dies seguits" sub="ratxa" color={A.terracota} />
      </div>
      <Card pad={22}>
        <Mono>Rendiment per tema</Mono>
        {byTopic.length === 0 ? (
          <p style={{ margin: '14px 0 0', fontFamily: A.sans, fontSize: 14, color: A.inkMuted }}>Encara no has fet cap test. Comença per veure el teu rendiment aquí.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            {byTopic.map((b, i) => {
              const k = CAT[palette[i % palette.length]]; const pct = Math.round((b.st!.best / 10) * 100);
              return <div key={b.t.slug}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: A.display, fontWeight: 600, fontSize: 14, color: A.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 10 }}>{b.t.title}</span>
                  <Mono size={11} color={k.solid}>{b.st!.best.toFixed(1)}/10</Mono>
                </div>
                <Bar pct={pct} color={k.solid} h={8} />
              </div>;
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
function StatBig({ big, label, sub, color }: { big: ReactNode; label: string; sub: string; color: string }) {
  return <Card pad={16}><Mono size={10}>{label}</Mono><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 28, color, lineHeight: 1, margin: '8px 0 4px' }}>{big}</div><Mono size={10}>{sub}</Mono></Card>;
}
