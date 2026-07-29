// Pàgina d'inici · landing pública (disseny Claude Design, juliol 2026).
//
// A diferència de la resta de pàgines, la portada NO va dins del chrome
// global: porta la seva pròpia barra de navegació i el seu peu. És la
// primera cosa que veu algú que no ens coneix, i el topbar de l'app (amb
// cercador i sidebar) només té sentit un cop hi ets a dins.
//
// Els estils viuen a `home.css` amb prefix `lp-` per no xocar amb les
// classes del rebranding 2026.
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NewsletterBanner from '../components/NewsletterBanner';
import { useAuth } from '../lib/auth';
import { useNoticiesAll } from '../lib/noticiesRemote';
import './home.css';

const C = {
  terra: '#FF7A1A', terraSoft: '#FFE7D2', terraDark: '#E8590C', terraTint: '#FFEEDC',
  navy: '#222C4A', navySoft: '#E3E7F2', ink: '#15151C', inkSoft: '#44444F',
  green: '#1FB286',
};

function Ic({ n, s = 22, c = 'currentColor', w = 2 }: { n: string; s?: number; c?: string; w?: number }) {
  const p = {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: c,
    strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (n) {
    case 'book': return <svg {...p}><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h8M8 11h6" /></svg>;
    case 'siren': return <svg {...p}><path d="M5 18a7 7 0 0 1 14 0v2H5v-2z" /><path d="M12 7V3M5.5 9.5L3 7M18.5 9.5L21 7" /></svg>;
    case 'car': return <svg {...p}><path d="M4 15l1-4a3 3 0 0 1 2.9-2.2h5.6A3 3 0 0 1 16.4 11l1 4" /><rect x="2.5" y="15" width="16" height="3.6" rx="1.5" /><path d="M20 4c-3 3-3 8 0 12" /></svg>;
    case 'chat': return <svg {...p}><path d="M21 12a8 8 0 0 1-8 8H8l-4 3v-6.5A8 8 0 0 1 13 4a8 8 0 0 1 8 8z" /></svg>;
    case 'pen': return <svg {...p}><path d="M16 3l5 5L8 21H3v-5L16 3z" /></svg>;
    case 'scale': return <svg {...p}><path d="M12 4v17M6 21h12M5 7h14" /><path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 7l-2.5 6a3 3 0 0 0 5 0L19 7z" /></svg>;
    case 'folder': return <svg {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>;
    case 'cap': return <svg {...p}><path d="M2 9l10-4 10 4-10 4L2 9z" /><path d="M6 11v5c0 1 3 2 6 2s6-1 6-2v-5" /></svg>;
    case 'shield': return <svg {...p}><path d="M12 3l8 3v6c0 4.6-3.4 8.6-8 9.8C7.4 20.6 4 16.6 4 12V6l8-3z" /></svg>;
    case 'eye': return <svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'phone': return <svg {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M11 19h2" /></svg>;
    case 'news': return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h6M7 13h6M16 9h2M16 13h2" /></svg>;
    case 'check': return <svg {...p}><path d="M5 12l4 4 10-10" /></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function Logo({ size = 27 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill="#15151C" />
      <circle cx="32" cy="22" r="4.2" fill={C.terra} />
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill={C.terra} />
    </svg>
  );
}

/** Punt d'una llista de característiques. */
function Pt({ tint, color, children }: { tint: string; color: string; children: ReactNode }) {
  return (
    <li>
      <span className="lp-tick" style={{ background: tint }}>
        <Ic n="check" s={12} c={color} w={3.4} />
      </span>
      {children}
    </li>
  );
}

const NAV = [
  { to: '/academia', label: 'Acadèmia' },
  { to: '/operativa', label: 'Operativa' },
  { to: '/croquis', label: 'Croquis' },
  { to: '/chat', label: 'Chat', dot: true },
  { to: '/noticies', label: 'Notícies' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const noticies = useNoticiesAll().slice(0, 3);
  const [menu, setMenu] = useState(false);

  // Si arribes amb sessió oberta, la portada no t'ha de vendre res: et porta
  // directament on treballes.
  const ctaPrincipal = user ? { to: '/academia', label: "Entrar a l'Acadèmia" } : { to: '/login', label: 'Començar gratis' };

  useEffect(() => {
    if (!menu) return;
    const tanca = () => setMenu(false);
    window.addEventListener('resize', tanca);
    return () => window.removeEventListener('resize', tanca);
  }, [menu]);

  const dataCurta = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : `${String(d.getDate()).padStart(2, '0')}·${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="lp">
      {/* Navegació */}
      <nav className="lp-nav">
        <div className="lp-wrap">
          <Link className="lp-logo" to="/" onClick={() => setMenu(false)}>
            <Logo />
            <b>info<span style={{ color: C.terra }}>pol</span></b>
          </Link>
          <div className="lp-links">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to}>
                {n.label}
                {n.dot && <span className="lp-dot" />}
              </Link>
            ))}
          </div>
          <div className="lp-navcta">
            {user ? (
              <Link className="lp-btn lp-btn-g lp-btn-sm" to="/perfil">El meu perfil</Link>
            ) : (
              <Link className="lp-btn lp-btn-g lp-btn-sm" to="/login">Entrar</Link>
            )}
            <Link className="lp-btn lp-btn-p lp-btn-sm" to={ctaPrincipal.to}>
              {user ? 'Continuar' : 'Crear compte'}
            </Link>
            <button className="lp-burger" onClick={() => setMenu((v) => !v)} aria-label="Menú" aria-expanded={menu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#44444F" strokeWidth="2.2" strokeLinecap="round">
                <path d={menu ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <div className={`lp-mnav${menu ? ' on' : ''}`}>
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} onClick={() => setMenu(false)}>
            {n.label}
            {n.dot && <span className="lp-dot" />}
          </Link>
        ))}
        <div className="lp-mrow">
          <Link className="lp-btn lp-btn-g lp-btn-sm" to={user ? '/perfil' : '/login'} onClick={() => setMenu(false)}>
            {user ? 'El meu perfil' : 'Entrar'}
          </Link>
          <Link className="lp-btn lp-btn-p lp-btn-sm" to={ctaPrincipal.to} onClick={() => setMenu(false)}>
            {user ? 'Continuar' : 'Crear compte'}
          </Link>
        </div>
      </div>

      {/* 1 · Hero */}
      <header className="lp-hero">
        <div className="lp-gridbg" />
        <div className="lp-wrap">
          <div className="lp-heroin">
            <NewsletterBanner />
            <div className="lp-mono" style={{ color: C.terra, marginTop: 18 }}>Policia Local de Catalunya</div>
            <h1>
              Tot el que necessites al carrer
              <br />
              <span className="t">i per aprovar l'oposició.</span>
            </h1>
            <p className="lp-lede">
              InfoPol és l'eina feta per un agent en actiu per a la policia local de Catalunya.
              Consulta la norma en segons quan estàs de servei, prepara't l'oposició amb el
              temari sencer i redacta les minutes amb ajuda de la intel·ligència artificial.
            </p>
            <div className="lp-herobtns">
              <Link className="lp-btn lp-btn-p" to={ctaPrincipal.to}>{ctaPrincipal.label}</Link>
              <a className="lp-btn lp-btn-g" href="#apartats">Veure què inclou</a>
            </div>
            <p className="lp-note">Sense targeta. El Diligenciador és gratuït.</p>
          </div>
        </div>
      </header>

      {/* 2 · Xifres */}
      <section className="lp-stats">
        <div className="lp-wrap">
          <div className="lp-statsin">
            {[
              ['48', 'Temes de temari'],
              ['5.500+', 'Preguntes de test'],
              ['701', 'Infraccions al catàleg'],
              ['100%', 'Normativa catalana'],
            ].map(([n, l]) => (
              <div className="lp-stat" key={l}>
                <div className="n">{n}</div>
                <div className="lp-mono l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Els quatre apartats */}
      <section className="lp-sec" id="apartats">
        <div className="lp-wrap">
          <div className="lp-sechead">
            <div className="lp-mono" style={{ color: C.terra }}>Què inclou</div>
            <h2>Quatre eines, un sol lloc.</h2>
          </div>

          <div className="lp-cards">
            {/* Acadèmia */}
            <article className="lp-c" style={{ background: '#FDFBF7' }}>
              <div className="lp-ctop">
                <div className="lp-ico" style={{ background: C.terraSoft }}><Ic n="book" s={27} c={C.terra} /></div>
                <div className="lp-mono" style={{ color: C.terra }}>Per a opositors</div>
              </div>
              <h3>Acadèmia</h3>
              <p className="lp-ph">
                El temari sencer, tests il·limitats i repàs intel·ligent. Per a Policia Local
                i per a Mossos d'Esquadra.
              </p>
              <ul className="lp-pts">
                <Pt tint={C.terraSoft} color={C.terra}>Temari complet amb l'articulat vigent</Pt>
                <Pt tint={C.terraSoft} color={C.terra}>Tests i simulacres d'examen</Pt>
                <Pt tint={C.terraSoft} color={C.terra}>Flashcards i repàs espaiat</Pt>
                <Pt tint={C.terraSoft} color={C.terra}>Ratxa, punts i lliga setmanal</Pt>
              </ul>
              <div className="lp-cfoot">
                <p className="fn">Si et prepares una oposició, comença aquí.</p>
                <Link className="lp-btn lp-btn-p lp-btn-sm" to="/academia">Entrar a l'Acadèmia</Link>
              </div>
            </article>

            {/* Operativa */}
            <article className="lp-c">
              <div className="lp-ctop">
                <div className="lp-ico" style={{ background: C.navySoft }}><Ic n="siren" s={27} c={C.navy} /></div>
                <div className="lp-mono" style={{ color: C.navy }}>Per a agents de servei</div>
              </div>
              <h3>Operativa</h3>
              <p className="lp-ph">
                Consulta ràpida al carrer. Quina infracció és, quin import, quins punts
                i què diu exactament l'article.
              </p>
              <ul className="lp-pts">
                <Pt tint={C.navySoft} color={C.navy}>Superbuscador de 701 infraccions</Pt>
                <Pt tint={C.navySoft} color={C.navy}>Protocols pas a pas</Pt>
                <Pt tint={C.navySoft} color={C.navy}>Drets del detingut i taules penals</Pt>
                <Pt tint={C.navySoft} color={C.navy}>Calculadora d'alcoholèmia</Pt>
              </ul>
              <div className="lp-cfoot">
                <p className="fn">Pensat per fer servir amb una mà, dins del cotxe.</p>
                <Link
                  className="lp-btn lp-btn-sm"
                  style={{ background: C.navy, color: '#fff', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.2)' }}
                  to="/operativa">
                  Entrar a Operativa
                </Link>
              </div>
            </article>

            {/* Croquis */}
            <article className="lp-c">
              <div className="lp-ctop">
                <div className="lp-ico" style={{ background: C.terraTint }}><Ic n="car" s={27} c={C.terraDark} /></div>
                <div className="lp-mono" style={{ color: C.terraDark }}>Eina</div>
              </div>
              <h3>Croquis d'accident</h3>
              <p className="lp-ph">
                Recrea l'accident sobre el plànol: via, vehicles, senyals, semàfors i
                trajectòries. Exporta'l a PNG i adjunta'l a l'atestat.
              </p>
              <ul className="lp-pts">
                <Pt tint={C.terraTint} color={C.terraDark}>Vehicles, vianants i mobiliari urbà</Pt>
                <Pt tint={C.terraTint} color={C.terraDark}>Senyals i semàfors</Pt>
                <Pt tint={C.terraTint} color={C.terraDark}>Trajectòries i punt de col·lisió</Pt>
                <Pt tint={C.terraTint} color={C.terraDark}>Exportació a PNG</Pt>
              </ul>
              <div className="lp-cfoot">
                <p className="fn">Deixa de dibuixar croquis a mà.</p>
                <Link
                  className="lp-btn lp-btn-sm"
                  style={{ background: C.terraDark, color: '#fff', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.18)' }}
                  to="/croquis">
                  Obrir el croquis
                </Link>
              </div>
            </article>

            {/* Chat · la destacada */}
            <article className="lp-c lp-chat" id="chat">
              <div className="lp-glow" />
              <div className="lp-glow2" />
              <div className="lp-lines" />
              <div className="lp-ctop">
                <div
                  className="lp-ico"
                  style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)', position: 'relative' }}>
                  <Ic n="chat" s={27} c="#fff" />
                  <span style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: 99, background: C.terra }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="lp-mono" style={{ color: 'rgba(255,255,255,.7)' }}>Intel·ligència artificial</div>
                  <span className="lp-badge" style={{ background: C.terra, color: '#fff' }}>NOU</span>
                </div>
              </div>
              <h3>InfoPol Chat</h3>
              <p className="lp-ph">
                Un assistent que coneix la normativa catalana i les ordenances del teu municipi.
                No busca a internet: respon des dels textos oficials.
              </p>

              <div className="lp-subs">
                <div className="lp-sub">
                  <div className="lp-subh">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Ic n="pen" s={17} c="#fff" />
                      <span className="lp-subt">Diligenciador</span>
                    </div>
                    <span className="lp-badge" style={{ background: '#D2F0E2', color: '#0B5A3D' }}>GRATIS</span>
                  </div>
                  <p>
                    Dicta-li els fets i te'ls torna en una minuta ben estructurada, amb els fets
                    ordenats i el llenguatge jurídic correcte.
                  </p>
                </div>
                <div className="lp-sub">
                  <div className="lp-subh">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Ic n="scale" s={17} c="rgba(255,255,255,.75)" />
                      <span className="lp-subt" style={{ color: 'rgba(255,255,255,.82)' }}>Consultes operatives</span>
                    </div>
                    <span className="lp-badge" style={{ background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.65)' }}>AVIAT</span>
                  </div>
                  <p>Quina infracció correspon, quin import i com actuar en un cas concret.</p>
                </div>
                <div className="lp-sub">
                  <div className="lp-subh">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Ic n="folder" s={17} c="rgba(255,255,255,.75)" />
                      <span className="lp-subt" style={{ color: 'rgba(255,255,255,.82)' }}>Redacció de serveis</span>
                    </div>
                    <span className="lp-badge" style={{ background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.65)' }}>AVIAT</span>
                  </div>
                  <p>Informes de servei, novetats de torn i comunicats interns.</p>
                </div>
              </div>

              <div className="lp-cfoot">
                <p className="fn" style={{ color: 'rgba(255,255,255,.55)', maxWidth: 320 }}>
                  El Diligenciador és obert i gratuït. La resta arriben aviat.
                </p>
                <Link className="lp-btn lp-btn-p lp-btn-sm" to="/chat">Provar el Diligenciador</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4 · On has d'anar */}
      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <div className="lp-sechead">
            <div className="lp-mono">Orientació ràpida</div>
            <h2>On has d'anar</h2>
          </div>
          <div className="lp-three">
            {[
              { i: 'cap', c: C.terra, t: "Estic estudiant l'oposició", d: "Vés a l'Acadèmia: hi tens el temari sencer, els tests i el repàs.", to: '/academia' },
              { i: 'siren', c: C.navy, t: 'Estic de servei ara mateix', d: 'Vés a Operativa: infraccions, protocols i taules, en dos tocs.', to: '/operativa' },
              { i: 'pen', c: C.terraDark, t: 'He de redactar una minuta', d: 'Obre el Chat: dicta-li els fets i te la torna redactada.', to: '/chat' },
            ].map((x) => (
              <Link key={x.t} to={x.to} style={{ color: 'inherit' }}>
                <div className="lp-icosm"><Ic n={x.i} s={20} c={x.c} /></div>
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Confiança */}
      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <div className="lp-trust">
            <div className="lp-mono" style={{ color: C.terra }}>Qui hi ha darrere</div>
            <h2 style={{ marginTop: 10 }}>Fet per algú que hi treballa</h2>
            <p>
              InfoPol el manté un agent de policia local en actiu. El contingut surt dels textos
              oficials consolidats —BOE, DOGC i les ordenances municipals— i s'actualitza quan
              canvia la norma. No és una font oficial: davant d'un dubte, consulta sempre el
              text vigent.
            </p>
            <div className="lp-seals">
              {[
                { i: 'shield', c: C.terra, t: 'Normativa catalana' },
                { i: 'eye', c: C.green, t: 'Funciona sense cobertura' },
                { i: 'phone', c: C.navy, t: "S'instal·la al mòbil" },
              ].map((s) => (
                <div className="lp-seal" key={s.t}>
                  <Ic n={s.i} s={15} c={s.c} w={2.2} />
                  <span>{s.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Notícies */}
      {noticies.length > 0 && (
        <section className="lp-sec" id="noticies" style={{ paddingTop: 0 }}>
          <div className="lp-wrap">
            <div
              className="lp-sechead"
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', maxWidth: 'none', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div className="lp-mono">Actualitat</div>
                <h2 style={{ marginTop: 10 }}>Últimes novetats</h2>
              </div>
              <Link to="/noticies" style={{ fontFamily: 'Poppins, Manrope, sans-serif', fontWeight: 700, fontSize: 14.5 }}>
                Veure-les totes →
              </Link>
            </div>
            <div className="lp-news">
              {noticies.map((n) => (
                <Link className="lp-nw" key={n.slug} to={`/noticies/${n.slug}`}>
                  <span className="lp-ico" style={{ width: 40, height: 40, borderRadius: 11, background: C.navySoft }}>
                    <Ic n="news" s={19} c={C.navy} />
                  </span>
                  <span className="t">{n.title}</span>
                  <span className="d">{dataCurta(n.publishedAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7 · Tancament */}
      <section className="lp-close">
        <div className="lp-wrap">
          <h2>{user ? 'Continua on ho vas deixar.' : 'Comença avui. És gratis.'}</h2>
          <p>
            {user
              ? 'Tens el temari, els tests i el Diligenciador esperant-te.'
              : 'Crea el compte i tindràs el temari, els tests i el Diligenciador des del primer minut.'}
          </p>
          <button className="lp-btn lp-btn-w" onClick={() => navigate(ctaPrincipal.to)}>
            {user ? "Entrar a l'Acadèmia" : 'Crear compte'}
          </button>
          {!user && (
            <p className="sm">
              Ja tens compte? <Link to="/login">Entra</Link>
            </p>
          )}
        </div>
      </section>

      {/* 8 · Peu */}
      <footer className="lp-foot">
        <div className="lp-wrap">
          <div className="lp-fgrid">
            <div className="lp-fcol">
              <Link className="lp-logo" to="/" style={{ marginBottom: 14 }}>
                <Logo size={24} />
                <b style={{ fontSize: 18 }}>info<span style={{ color: C.terra }}>pol</span></b>
              </Link>
              <Link to="/academia">Acadèmia</Link>
              <Link to="/operativa">Operativa</Link>
              <Link to="/croquis">Croquis</Link>
              <Link to="/chat">Chat</Link>
            </div>
            <div className="lp-fcol">
              <h4>Recursos</h4>
              <Link to="/noticies">Notícies</Link>
              <Link to="/cultura-general">Cultura general</Link>
              <Link to="/superbuscador">Superbuscador</Link>
            </div>
            <div className="lp-fcol">
              <h4>Legal</h4>
              <Link to="/avis-legal">Avís legal</Link>
              <Link to="/privacitat">Privacitat</Link>
            </div>
          </div>
          <div className="lp-fbot">
            <p>
              Eina d'estudi i consulta per a opositors i per a policies de Catalunya en actiu.
              Basada en normativa vigent i actualitzada: textos consolidats del BOE i del DOGC
              i ordenances municipals.
            </p>
            <p style={{ marginTop: 8 }}>
              <b>InfoPol no és una font oficial.</b> El contingut té finalitat informativa i de
              suport a l'estudi; davant de qualsevol actuació, contrasta sempre amb el text
              vigent publicat als butlletins oficials.
            </p>
            <p style={{ marginTop: 12 }}>© {new Date().getFullYear()} InfoPol · Tots els drets reservats</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
