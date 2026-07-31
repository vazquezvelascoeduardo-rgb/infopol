// Marc de l'àrea privada: el disseny v3 "InfoPol Web App".
//
// Substitueix els tres marcs que hi havia abans (Layout global,
// OperativaShellLayout i AcademiaShellLayout). Un cop has entrat, ja no
// se surt d'aquí: barra lateral de tinta a l'esquerra, capçalera amb
// cercador a dalt i el contingut al mig via <Outlet/>.
//
// A mòbil la barra lateral es plega en un calaix i apareix una barra
// inferior amb les quatre seccions i el xat.
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { getUserProgress, type UserProgress } from '../lib/db';
import { applyInitialTheme, applyTheme, getInitialTheme, type Theme } from '../lib/theme';
import { I, Mono, RV, V, type NomIc } from '../lib/v3';

const AMPLE_SIDEBAR = 246;

type Seccio = { id: string; label: string; icona: NomIc; to: string };

const NAV: Seccio[] = [
  { id: 'inici', label: 'Inici', icona: 'home', to: '/app' },
  { id: 'academia', label: 'Acadèmia', icona: 'cap', to: '/academia' },
  { id: 'operativa', label: 'Operativa', icona: 'siren', to: '/operativa' },
  { id: 'croquis', label: 'Croquis', icona: 'crash', to: '/croquis' },
  { id: 'noticies', label: 'Notícies', icona: 'news', to: '/noticies' },
];

/** Quina secció de la barra s'ha de marcar segons la ruta actual. */
export function seccioActiva(pathname: string): string {
  const p = pathname;
  if (p.startsWith('/academia') || p.startsWith('/policia-local') || p.startsWith('/mossos')
    || p.startsWith('/cultura-general') || p.startsWith('/actualitat') || p.startsWith('/retos')) return 'academia';
  if (p.startsWith('/operativa') || p.startsWith('/leyes') || p.startsWith('/recursos')
    || p.startsWith('/superbuscador') || p.startsWith('/calculadora-alcohol')) return 'operativa';
  if (p.startsWith('/croquis')) return 'croquis';
  if (p.startsWith('/noticies')) return 'noticies';
  if (p.startsWith('/perfil')) return 'perfil';
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

function BotoNav({ s, on, onClick }: { s: Seccio; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={on ? 'page' : undefined}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
        borderRadius: 13, padding: '11px 12px',
        background: on ? V.terra : 'transparent',
        color: on ? '#fff' : 'rgba(255,255,255,.6)',
        display: 'flex', alignItems: 'center', gap: 12, transition: 'background .18s ease',
      }}>
      <I n={s.icona} size={19} sw={on ? 2.1 : 1.8} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: on ? 800 : 600, letterSpacing: -0.2 }}>{s.label}</span>
    </button>
  );
}

/** Pestanya de la pastilla flotant: només icona, cercle taronja si és l'activa. */
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

/** Barra lateral de tinta. És la mateixa a l'escriptori i dins del calaix. */
function Lateral({
  activa, onNavega, progres, nom, inicial, tema, onTema,
}: {
  activa: string;
  onNavega: (to: string) => void;
  progres: UserProgress | null;
  nom: string;
  inicial: string;
  tema: Theme;
  onTema: () => void;
}) {
  // Els set dies de la ratxa: només marquem els que realment té.
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map((s) => (
          <BotoNav key={s.id} s={s} on={activa === s.id} onClick={() => onNavega(s.to)} />
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
            DILIGENCIADOR
          </Mono>
        </span>
      </button>

      <div style={{ marginTop: 'auto' }}>
        {progres && (
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: RV.md, padding: 15, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Mono size={8.5} color="rgba(255,255,255,.5)">RATXA</Mono>
              <span style={{ fontSize: 15, fontWeight: 800, color: V.terra }}>{progres.streak_count}</span>
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
        )}

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
              {progres ? `Nivell ${progres.level}` : 'El teu perfil'}
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
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [calaix, setCalaix] = useState(false);
  const [q, setQ] = useState('');
  const [progres, setProgres] = useState<UserProgress | null>(null);
  const [tema, setTema] = useState<Theme>(() => getInitialTheme());

  const activa = seccioActiva(pathname);

  useEffect(() => { applyInitialTheme(); }, []);
  useEffect(() => { setCalaix(false); }, [pathname]);

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

  const nom = (user?.user_metadata?.name as string | undefined)
    || user?.email?.split('@')[0]
    || 'El meu compte';
  const inicial = nom.charAt(0).toUpperCase();

  const lateral = (
    <Lateral
      activa={activa}
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
        }}>
        {lateral}
      </aside>

      {/* L'àrea de la dreta té l'alçada del viewport i el que scrolleja és
          <main>. Ho necessita el xat, que és una pantalla d'alçada fixa amb
          la llista de missatges scrollant per dins. */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        <header
          className="v3-topbar"
          style={{
            flexShrink: 0, minHeight: 66, borderBottom: `1px solid ${V.hair}`,
            display: 'flex', alignItems: 'center', gap: 16, padding: '0 clamp(14px,2.4vw,26px)',
            background: V.surface, position: 'sticky', top: 0, zIndex: 40,
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

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9 }}>
            {progres && (
              <>
                <div className="v3-amaga-mobil" style={{
                  display: 'flex', alignItems: 'center', gap: 7, background: V.terraSoft,
                  borderRadius: RV.pill, padding: '8px 13px',
                }}>
                  <I n="flame" size={14} sw={2} color={V.terraInk} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: V.terraInk, letterSpacing: -0.2 }}>
                    {progres.streak_count}
                  </span>
                </div>
                <div className="v3-amaga-mobil" style={{
                  display: 'flex', alignItems: 'center', gap: 7, background: V.blueSoft,
                  borderRadius: RV.pill, padding: '8px 13px',
                }}>
                  <I n="gem" size={14} sw={2} color={V.blue} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: V.blue, letterSpacing: -0.2 }}>
                    {progres.gems}
                  </span>
                </div>
              </>
            )}
            <Link
              to="/perfil"
              aria-label="El meu perfil"
              style={{
                width: 38, height: 38, border: `1px solid ${V.border}`, borderRadius: 12,
                background: V.surface, color: V.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
              <I n="person" size={17} sw={1.8} />
            </Link>
          </div>
        </header>

        <main
          className="v3-main"
          style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
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
