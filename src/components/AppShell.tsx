// Marc de l'àrea privada — disseny v3 "InfoPol Web App", tal qual.
//
// Barra lateral de tinta (246 px) amb la marca a dalt, quatre seccions
// amb el seu comptador, el botó del xat, la ratxa i la fitxa d'usuari a
// baix. A la dreta, capçalera de 66 px amb cercador, els dos indicadors
// (ratxa i experiència) i la campana.
//
// Afegit sobre el disseny: en clicar una secció es desplega el seu
// submenú, perquè des de la barra es pugui saltar directament a Test,
// Estudia per tema, Catàleg SCT… sense passar per la pantalla de la
// secció.
//
// A mòbil la lateral es plega en un calaix i apareix la pastilla
// flotant de sota, com a l'app.
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Enrere from './Enrere';
import TriaPerfilUs from './TriaPerfilUs';
import { useAuth } from '../lib/auth';
import { TEMES } from '../content/temari-pl';
import { getUserProgress, type PerfilUs, type UserProgress } from '../lib/db';
import { PENAL_ALL_ENTRIES } from '../lib/operativa-penal';
import { applyInitialTheme, applyTheme, getInitialTheme, type Theme } from '../lib/theme';
import { I, Mono, RV, V, type NomIc } from '../lib/v3';

const AMPLE_SIDEBAR = 246;

/**
 * Les pantalles de primer nivell: hi arribes des de la barra lateral o de
 * la pastilla del mòbil, així que no hi ha "enrere" que valgui.
 */
const ARRELS = new Set(['/app', '/academia', '/operativa', '/perfil', '/chat']);

/**
 * Pantalles que ja porten la seva pròpia sortida i que, a més, tenen una
 * columna que ha d'arribar fins a dalt de tot. El lector del temari en té
 * una de blanca amb l'índex dels apartats: si li posem una barra a sobre,
 * la banda comença a mitja pantalla i queda tallada.
 */
const SENSE_FLETXA = [/^\/estudi\/tema\//, /^\/mossos\/estudi\//];

type Subseccio = { label: string; to: string };
type Seccio = {
  id: string;
  label: string;
  icona: NomIc;
  to: string;
  /** Quantes coses hi ha a dins. Es calcula del contingut real. */
  compte?: number;
  sub?: Subseccio[];
};

/** Temes del temari de Policia Local. El comptador de la barra els diu. */
const TEMES_PL = TEMES.length;
const ESCENARIS_PENAL = PENAL_ALL_ENTRIES.length;

const NAV: Seccio[] = [
  { id: 'inici', label: 'Inici', icona: 'home', to: '/app' },
  {
    id: 'academia', label: 'Acadèmia', icona: 'cap', to: '/academia', compte: TEMES_PL,
    sub: [
      { label: 'Estudia per tema', to: '/estudi' },
      { label: 'Test', to: '/policia-local' },
      { label: 'Repàs intel·ligent', to: '/repas' },
      { label: 'Esquemes', to: '/policia-local/esquemes' },
      { label: 'Diagnòstic', to: '/diagnostic' },
      { label: 'Flashcards', to: '/policia-local/flashcards' },
      { label: 'Mossos', to: '/mossos' },
      { label: 'Reptes', to: '/retos' },
    ],
  },
  {
    id: 'operativa', label: 'Operativa', icona: 'siren', to: '/operativa', compte: ESCENARIS_PENAL,
    sub: [
      { label: 'Catàleg SCT', to: '/operativa?sec=cataleg' },
      { label: 'Superbuscador', to: '/superbuscador' },
      { label: 'Lleis', to: '/leyes' },
      { label: 'SC i Penal', to: '/operativa/penal' },
      { label: 'Trànsit', to: '/operativa/trafico' },
      { label: 'Alcoholèmia', to: '/calculadora-alcohol' },
      { label: "Croquis d'accident", to: '/croquis' },
      { label: 'Recursos', to: '/recursos' },
    ],
  },
  {
    id: 'perfil', label: 'Perfil', icona: 'person', to: '/perfil',
    sub: [
      { label: 'Els meus logros', to: '/policia-local/logros' },
      { label: 'Notícies', to: '/noticies' },
    ],
  },
];

/**
 * On ets exactament, dins de la secció.
 *
 * La barra deia només la secció ("Acadèmia"), i un cop dins de tres
 * nivells ja no sabies on eres. Això mira la ruta i en treu el nom del
 * lloc concret, que es pinta sota la secció activa i a la capçalera.
 *
 * Es fa per prefix i de més llarg a més curt: la primera que casa mana.
 */
const ON_ETS: { prefix: string; nom: string }[] = [
  { prefix: '/estudi/tema', nom: 'Tema' },
  { prefix: '/estudi', nom: 'Estudia per tema' },
  { prefix: '/repas', nom: 'Repàs intel·ligent' },
  { prefix: '/diagnostic', nom: 'Diagnòstic' },
  { prefix: '/policia-local/esquemes', nom: 'Esquemes' },
  { prefix: '/policia-local/flashcards', nom: 'Flashcards' },
  { prefix: '/policia-local/debilitats', nom: 'Debilitats' },
  { prefix: '/policia-local/logros', nom: 'Logros' },
  { prefix: '/policia-local', nom: 'Test' },
  { prefix: '/mossos/esquemes', nom: 'Esquemes · Mossos' },
  { prefix: '/mossos/temari', nom: 'Temari Mossos' },
  { prefix: '/mossos/flashcards', nom: 'Flashcards · Mossos' },
  { prefix: '/mossos', nom: 'Test · Mossos' },
  { prefix: '/cultura-general', nom: 'Cultura general' },
  { prefix: '/actualitat', nom: 'Actualitat' },
  { prefix: '/retos', nom: 'Reptes' },
  { prefix: '/academia', nom: 'Portada' },

  { prefix: '/operativa/penal', nom: 'SC i Penal' },
  { prefix: '/operativa/trafico', nom: 'Trànsit' },
  { prefix: '/superbuscador', nom: 'Superbuscador' },
  { prefix: '/calculadora-alcohol', nom: 'Alcoholèmia' },
  { prefix: '/croquis', nom: "Croquis d'accident" },
  { prefix: '/recursos', nom: 'Recursos' },
  { prefix: '/leyes', nom: 'Lleis' },
  { prefix: '/operativa', nom: 'Portada' },

  { prefix: '/quadrant', nom: 'El meu quadrant' },
  { prefix: '/noticies', nom: 'Notícies' },
  { prefix: '/perfil', nom: 'Portada' },
  { prefix: '/cerca', nom: 'Cerca' },
];

export function onEts(pathname: string): string | null {
  const trobat = [...ON_ETS]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((x) => pathname === x.prefix || pathname.startsWith(`${x.prefix}/`));
  return trobat?.nom ?? null;
}

/** Quina secció de la barra s'ha de marcar segons la ruta actual. */
export function seccioActiva(pathname: string): string {
  const p = pathname;
  if (p.startsWith('/academia') || p.startsWith('/policia-local') || p.startsWith('/mossos')
    || p.startsWith('/cultura-general') || p.startsWith('/actualitat') || p.startsWith('/retos')
    || p.startsWith('/estudi') || p.startsWith('/repas') || p.startsWith('/diagnostic')) return 'academia';
  if (p.startsWith('/operativa') || p.startsWith('/leyes') || p.startsWith('/recursos')
    || p.startsWith('/superbuscador') || p.startsWith('/calculadora-alcohol') || p.startsWith('/croquis')) return 'operativa';
  if (p.startsWith('/perfil') || p.startsWith('/noticies')) return 'perfil';
  if (p.startsWith('/chat')) return 'chat';
  return 'inici';
}

function Escut({ mida = 20 }: { mida?: number }) {
  return (
    <svg viewBox="0 0 100 118" style={{ width: mida, height: mida * 1.2 }} aria-hidden>
      <circle cx="50" cy="30" r="13" fill="#FFFFFF" />
      <path d="M40 52 H60 V94 C60 98 56.6 101 52.4 101 H47.6 C43.4 101 40 98 40 94 Z" fill="#FFFFFF" />
    </svg>
  );
}

/** Cercle d'ones del botó del xat, tal com el dibuixa el disseny. */
function OnesXat({ mida = 38 }: { mida?: number }) {
  const ona = (rot: number, op: number) => ({
    position: 'absolute' as const, width: mida * 0.58, height: mida * 0.24,
    borderRadius: '50%', border: `1.4px solid rgba(255,255,255,${op})`,
    transform: `rotate(${rot}deg)`,
  });
  return (
    <span style={{
      width: mida, height: mida, flexShrink: 0, borderRadius: '50%', background: V.terra,
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <span style={ona(32, 0.9)} />
      <span style={ona(-32, 0.9)} />
      <span style={ona(90, 0.4)} />
      <span style={{ position: 'relative', width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
    </span>
  );
}

/** Pestanya de la pastilla flotant (mòbil): només icona. */
function PestanyaMobil({ s, on, onClick }: { s: Seccio; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={s.label}
      aria-current={on ? 'page' : undefined}
      style={{
        flex: 1, height: 50, border: 'none', background: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
      }}>
      <span style={{
        width: 44, height: 44, borderRadius: 22,
        background: on ? V.terra : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={s.icona} size={21} sw={on ? 2.1 : 1.8} color={on ? '#fff' : 'rgba(255,255,255,.55)'} />
      </span>
    </button>
  );
}

function BotoNav({
  s, on, obert, lloc, onNavega, onDesplega,
}: {
  s: Seccio;
  on: boolean;
  obert: boolean;
  /** On ets dins d'aquesta secció, si hi ets. */
  lloc: string | null;
  onNavega: (to: string) => void;
  onDesplega: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => { onNavega(s.to); if (s.sub) onDesplega(); }}
        aria-current={on ? 'page' : undefined}
        aria-expanded={s.sub ? obert : undefined}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
          borderRadius: 13, padding: '11px 12px',
          background: on ? V.terra : 'transparent',
          color: on ? '#fff' : 'rgba(255,255,255,.6)',
          display: 'flex', alignItems: 'center', gap: 12, transition: 'background .18s ease',
        }}>
        <I n={s.icona} size={19} sw={on ? 2.1 : 1.8} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: on ? 800 : 600, letterSpacing: -0.2 }}>
            {s.label}
          </span>
          {/* On ets de debò dins de la secció. */}
          {on && lloc && lloc !== 'Portada' && (
            <span style={{
              display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.75)',
              marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {lloc}
            </span>
          )}
        </span>
        {s.compte !== undefined && (
          <span style={{
            fontFamily: V.mono, fontSize: 9.5, fontWeight: 700, flexShrink: 0,
            color: on ? '#fff' : 'rgba(255,255,255,.5)',
            background: on ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.08)',
            borderRadius: 7, padding: '4px 7px',
          }}>
            {s.compte}
          </span>
        )}
      </button>

      {/* Submenú: apareix en clicar la secció. */}
      {s.sub && obert && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '4px 0 6px 22px' }}>
          {s.sub.map((x) => (
            <button
              key={x.to + x.label}
              type="button"
              onClick={() => onNavega(x.to)}
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
                background: 'transparent', color: 'rgba(255,255,255,.5)',
                borderLeft: '1px solid rgba(255,255,255,.12)',
                borderRadius: 0, padding: '7px 12px', fontSize: 12.5, fontWeight: 600,
              }}>
              {x.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/** Barra lateral de tinta. És la mateixa a l'escriptori i dins del calaix. */
function Lateral({
  activa, lloc, desplegada, onDesplega, onNavega, progres, nom, inicial, tema, onTema,
}: {
  activa: string;
  /** On ets dins de la secció activa. */
  lloc: string | null;
  desplegada: string | null;
  onDesplega: (id: string) => void;
  onNavega: (to: string) => void;
  progres: UserProgress | null;
  nom: string;
  inicial: string;
  tema: Theme;
  onTema: () => void;
}) {
  // Els set dies de la ratxa: només s'encenen els que realment té.
  const dies = useMemo(() => {
    const n = Math.min(7, progres?.streak_count ?? 0);
    return Array.from({ length: 7 }, (_, i) => i < n);
  }, [progres?.streak_count]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 6px 22px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 13, background: V.terra,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Escut />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4, color: '#fff', lineHeight: 1 }}>infopol</div>
          <Mono size={8} color="rgba(255,255,255,.45)" style={{ letterSpacing: 2, display: 'block', marginTop: 4 }}>
            POLICIA LOCAL · CAT
          </Mono>
        </div>
      </div>

      {/* Cerca. Va a la lateral perquè és on hi ha la navegació: a dalt
          hi havia una barra sencera només per a això. */}
      <button
        type="button"
        onClick={() => onNavega('/cerca')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
          borderRadius: RV.md, padding: '11px 13px', marginBottom: 14,
          background: 'rgba(255,255,255,.08)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
        <I n="search" size={16} sw={2} color="rgba(255,255,255,.6)" />
        <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Cerca…</span>
        <Mono size={8.5} color="rgba(255,255,255,.35)" style={{ letterSpacing: 0.5 }}>⌘K</Mono>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map((s) => (
          <BotoNav
            key={s.id}
            s={s}
            on={activa === s.id}
            obert={desplegada === s.id}
            lloc={activa === s.id ? lloc : null}
            onNavega={onNavega}
            onDesplega={() => onDesplega(s.id)}
          />
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '18px 6px' }} />

      <button
        type="button"
        onClick={() => onNavega('/chat')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: RV.md,
          padding: 14, background: activa === 'chat' ? 'rgba(255,255,255,.1)' : 'transparent',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
        <OnesXat />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>Chat IA</span>
          <Mono size={8.5} color="rgba(255,255,255,.5)" style={{ display: 'block', marginTop: 3, letterSpacing: 1.4 }}>
            3 EINES
          </Mono>
        </span>
      </button>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: RV.md, padding: 15, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Mono size={8.5} color="rgba(255,255,255,.5)">RATXA</Mono>
            <span style={{ fontSize: 15, fontWeight: 800, color: V.terra }}>{progres?.streak_count ?? 0}</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 11 }}>
            {dies.map((ple, i) => (
              <span key={i} style={{
                flex: 1, height: 5, borderRadius: RV.pill,
                background: ple ? V.terra : 'rgba(255,255,255,.14)',
              }} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 6px' }}>
          <button
            type="button"
            onClick={() => onNavega('/perfil')}
            style={{
              width: 36, height: 36, flexShrink: 0, borderRadius: 12, background: V.terra, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer',
            }}>
            {inicial}
          </button>
          <button
            type="button"
            onClick={() => onNavega('/perfil')}
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
            <span style={{
              display: 'block', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: -0.2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{nom}</span>
            <span style={{ display: 'block', fontSize: 10.5, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>
              Nivell {progres?.level ?? 1}
            </span>
          </button>
          <button
            type="button"
            onClick={onTema}
            aria-label={tema === 'dark' ? 'Mode clar' : 'Mode fosc'}
            title={tema === 'dark' ? 'Mode clar' : 'Mode fosc'}
            style={{
              width: 32, height: 32, flexShrink: 0, border: 'none', borderRadius: 10,
              background: 'rgba(255,255,255,.09)', color: 'rgba(255,255,255,.7)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <I n={tema === 'dark' ? 'sun' : 'moon'} size={16} sw={1.8} />
          </button>
        </div>
      </div>
    </>
  );
}

/** Indicador de la capçalera: icona plena + xifra, sobre pastilla tenyida. */
function ContentFallback() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: '80px 0' }}>
      <div style={{
        width: 26, height: 26, border: `2px solid ${V.border}`, borderTopColor: V.ink,
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

export default function AppShell() {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const { user, profile } = useAuth();
  const [calaix, setCalaix] = useState(false);
  const [q, setQ] = useState('');
  const [progres, setProgres] = useState<UserProgress | null>(null);
  const [tema, setTema] = useState<Theme>(() => getInitialTheme());
  const [desplegada, setDesplegada] = useState<string | null>(null);
  // Si ja ha triat en aquesta sessió no li tornem a preguntar encara que
  // el perfil del servidor trigui a refrescar-se.
  const [triaFeta, setTriaFeta] = useState<PerfilUs | null>(null);

  const activa = seccioActiva(pathname);
  const lloc = onEts(pathname);
  // La fletxa d'enrere només té sentit si no ets a la portada d'una
  // secció: allà no hi ha res darrere dins de l'app.
  const ruta = pathname.replace(/\/$/, '') || '/';
  // Operativa fa les seves seccions amb ?sec=…: la portada és arrel, però
  // el catàleg o el cercador ja són pantalles de dins i han de poder tornar.
  const dinsDeSeccio = new URLSearchParams(search).has('sec');
  const mostraEnrere = (!ARRELS.has(ruta) || dinsDeSeccio) && !SENSE_FLETXA.some((r) => r.test(ruta));

  useEffect(() => { applyInitialTheme(); }, []);
  useEffect(() => { setCalaix(false); }, [pathname]);
  // En canviar de secció, obre el submenú de la nova.
  useEffect(() => { setDesplegada((d) => (d === activa ? d : activa)); }, [activa]);

  useEffect(() => {
    let viu = true;
    if (!user) { setProgres(null); return; }
    getUserProgress(user.id).then((p) => { if (viu) setProgres(p); }).catch(() => {});
    return () => { viu = false; };
  }, [user]);

  function canviaTema() {
    const seguent: Theme = tema === 'dark' ? 'light' : 'dark';
    setTema(seguent);
    applyTheme(seguent);
  }

  function anar(to: string) {
    setCalaix(false);
    nav(to);
  }

  function cerca(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (v) nav(`/cerca?q=${encodeURIComponent(v)}`);
  }

  const nom = profile?.name
    || (user?.user_metadata?.name as string | undefined)
    || user?.email?.split('@')[0]
    || 'El meu compte';
  const inicial = nom.charAt(0).toUpperCase();

  // La pregunta d'entrada: només a qui té sessió i encara no l'ha
  // contestada. Sense backend (mode local) no es pregunta res.
  const perfilUs = triaFeta ?? profile?.perfil_us ?? null;
  if (user && profile && !perfilUs) {
    return <TriaPerfilUs onFet={setTriaFeta} />;
  }

  const lateral = (
    <Lateral
      activa={activa}
      lloc={lloc}
      desplegada={desplegada}
      onDesplega={(id) => setDesplegada((d) => (d === id ? null : id))}
      onNavega={anar}
      progres={progres}
      nom={nom}
      inicial={inicial}
      tema={tema}
      onTema={canviaTema}
    />
  );

  return (
    <div className="v3-shell" style={{ display: 'flex', minHeight: '100dvh', background: V.paper, color: V.ink }}>
      <aside
        className="v3-aside"
        style={{
          width: AMPLE_SIDEBAR, flexShrink: 0, background: V.inkFixed,
          display: 'flex', flexDirection: 'column', padding: '20px 14px',
          height: '100dvh', position: 'sticky', top: 0, boxSizing: 'border-box',
          overflowY: 'auto',
        }}>
        {lateral}
      </aside>

      {/* L'àrea de la dreta té l'alçada del viewport i el que scrolleja és
          <main>. Ho necessita el xat, que és una pantalla d'alçada fixa amb
          la llista de missatges scrollant per dins. */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        {/* La capçalera només existeix a mòbil, on cal alguna manera
            d'obrir el calaix. A l'escriptori la navegació i la cerca ja
            són a la barra lateral: tenir-hi també una barra a dalt
            duplicava la fletxa d'enrere i menjava alçada al contingut. */}
        <header
          className="v3-topbar v3-nomes-mobil-flex"
          style={{
            flexShrink: 0, minHeight: 62, borderBottom: `1px solid ${V.hair}`,
            alignItems: 'center', gap: 12, padding: '0 14px',
            background: V.surface,
          }}>
          <button
            type="button"
            className="v3-nomes-mobil"
            onClick={() => setCalaix(true)}
            aria-label="Obre el menú"
            style={{
              width: 40, height: 40, flexShrink: 0, border: `1px solid ${V.border}`, borderRadius: 12,
              background: V.surface, color: V.ink, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <I n="menu" size={19} sw={2.2} />
          </button>

          <form onSubmit={cerca} style={{ flex: 1, maxWidth: 460, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, background: V.paper,
              borderRadius: 12, padding: '10px 14px',
            }}>
              <I n="search" size={16} sw={2} color={V.muted} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca temes, articles, infraccions…"
                aria-label="Cerca"
                style={{
                  flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none',
                  color: V.ink, fontSize: 13.5, fontFamily: 'inherit',
                }}
              />
              <Mono size={10} color={V.faint} style={{
                fontWeight: 700, background: V.surface, borderRadius: 6, padding: '4px 7px',
                letterSpacing: 0, flexShrink: 0,
              }}>⌘K</Mono>
            </div>
          </form>

        </header>

        <main
          className="v3-main"
          style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* La fletxa d'enrere viu aquí i no a cada pàgina: així hi és
              sempre, al mateix lloc, i cap pantalla interior queda sense
              sortida. A les seccions de primer nivell no cal —la barra
              lateral ja hi porta— i per això no s'hi pinta. */}
          {mostraEnrere && (
            // Enganxada a dalt: a les pàgines llargues d'Operativa la
            // fletxa se n'anava amunt amb el text i, a mitja pàgina, ja no
            // hi havia manera de tornar sense el botó del navegador.
            <div style={{
              position: 'sticky', top: 0, zIndex: 5,
              padding: 'clamp(12px,2vw,18px) clamp(18px,2.6vw,28px) 10px',
              background: V.paper,
            }}>
              <Enrere a="/app" titol="Enrere" />
            </div>
          )}
          <Suspense fallback={<ContentFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Pastilla flotant de navegació (mòbil) — igual que a l'app.
          El xat va al mig, en cercle taronja; la secció activa es marca
          només amb el cercle, sense text. */}
      <nav className="v3-tabbar" aria-label="Navegació principal">
        {NAV.slice(0, 2).map((s) => <PestanyaMobil key={s.id} s={s} on={activa === s.id} onClick={() => anar(s.to)} />)}
        <button
          type="button"
          onClick={() => anar('/chat')}
          aria-label="Chat IA"
          style={{
            width: 56, height: 56, flexShrink: 0, borderRadius: 28, margin: '0 4px', border: 'none',
            background: V.terra, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 12px rgba(255,122,26,.5)',
          }}>
          <OnesXat mida={30} />
        </button>
        {NAV.slice(2, 4).map((s) => <PestanyaMobil key={s.id} s={s} on={activa === s.id} onClick={() => anar(s.to)} />)}
      </nav>

      {/* Calaix a mòbil */}
      {calaix && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 160 }}>
          <button
            type="button"
            aria-label="Tanca el menú"
            onClick={() => setCalaix(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,28,.45)', border: 'none', cursor: 'pointer' }}
          />
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: AMPLE_SIDEBAR,
            background: V.inkFixed, padding: '20px 14px', display: 'flex', flexDirection: 'column',
            boxSizing: 'border-box', overflowY: 'auto',
          }}>
            {lateral}
          </div>
        </div>
      )}
    </div>
  );
}
