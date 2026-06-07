// Pantalla principal · Home (disseny "Tria el teu mode", Claude Design).
// Hero + dues targetes grans (Operativa / Acadèmia) que porten a cada
// secció. A sota es manté el resum d'actualitat. Es renderitza dins del
// marc de l'app (topbar global).
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useNoticiesAll } from '../lib/noticiesRemote';
import NewsletterBanner from '../components/NewsletterBanner';

const H = {
  ink: '#15151C', inkSoft: '#44444F', inkMuted: '#82828D',
  card: '#FFFFFF', line: 'rgba(21,21,28,0.07)', terracota: '#FF7A1A',
  terraSoft: '#FFE7D2', blue: '#3B6BF5',
  display: '"Poppins", "Manrope", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  sans: '"Manrope", system-ui, sans-serif',
  shadowMd: '0 2px 4px rgba(21,21,28,0.04), 0 14px 36px rgba(21,21,28,0.09)',
  inset: 'inset 0 -4px 0 rgba(0,0,0,0.16)',
};

function HIc({ name, size = 22, color = 'currentColor', sw = 2 }: { name: string; size?: number; color?: string; sw?: number }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'siren': return <svg {...c}><path d="M5 17a7 7 0 0 1 14 0v2H5v-2z" /><path d="M12 6V3M5 9L3 7M19 9l2-2" /></svg>;
    case 'book': return <svg {...c}><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h8M8 11h6" /></svg>;
    case 'check': return <svg {...c}><path d="M5 12l4 4 10-10" /></svg>;
    case 'arrow': return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function ModeCard({ to, dark, bg, accent, kicker, title, desc, features, cta, icon, footnote }: {
  to: string; dark?: boolean; bg: string; accent: string; kicker: string; title: string;
  desc: ReactNode; features: string[]; cta: string; icon: string; footnote: string;
}) {
  const fg = dark ? '#fff' : H.ink;
  const sub = dark ? 'rgba(255,255,255,0.78)' : H.inkSoft;
  return (
    <Link to={to} className="h-mode" style={{
      display: 'flex', flexDirection: 'column', borderRadius: 30, backgroundImage: bg, color: fg,
      padding: 'clamp(26px, 3vw, 40px)', boxShadow: H.shadowMd, position: 'relative', overflow: 'hidden',
      minHeight: 440, border: dark ? 'none' : `1px solid ${H.line}`, textDecoration: 'none',
    }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 60, height: 60, borderRadius: 18, background: dark ? 'rgba(255,255,255,0.16)' : accent, display: 'grid', placeItems: 'center', boxShadow: H.inset }}>
          <HIc name={icon} size={32} color="#fff" sw={2.1} />
        </span>
        <span style={{ fontFamily: H.mono, fontWeight: 600, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.8)' : accent }}>{kicker}</span>
      </div>
      <h2 style={{ position: 'relative', margin: '26px 0 10px', fontFamily: H.display, fontWeight: 700, fontSize: 'clamp(30px, 3.4vw, 40px)', letterSpacing: -1.2, lineHeight: 1.05 }}>{title}</h2>
      <p style={{ position: 'relative', margin: 0, fontFamily: H.sans, fontSize: 16, lineHeight: 1.5, color: sub, maxWidth: 420 }}>{desc}</p>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', margin: '24px 0' }}>
        {features.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: dark ? 'rgba(255,255,255,0.16)' : accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><HIc name="check" size={13} color="#fff" sw={3} /></span>
            <span style={{ fontFamily: H.display, fontWeight: 600, fontSize: 14.5, color: fg }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontFamily: H.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.65)' : H.inkMuted }}>{footnote}</span>
        <span className="h-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: dark ? '#fff' : H.ink, color: dark ? H.ink : '#fff', borderRadius: 14, padding: '14px 24px', fontFamily: H.display, fontWeight: 700, fontSize: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.18)' }}>{cta} <HIc name="arrow" size={18} color={dark ? H.ink : '#fff'} sw={2.4} /></span>
      </div>
    </Link>
  );
}

export default function Home() {
  const recentNoticies = useNoticiesAll().slice(0, 3);
  return (
    <div className="shell pb-10">
      <NewsletterBanner />

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: 'clamp(8px,2vw,20px) 0 clamp(22px,4vw,40px)' }}>
        <span style={{ fontFamily: H.mono, fontWeight: 600, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: H.terracota }}>InfoPol · Tria el teu mode</span>
        <h1 className="h-hero" style={{ margin: '12px 0 0', fontFamily: H.display, fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: -2, lineHeight: 1.05, color: H.ink }}>
          De servei o estudiant.<br /><span style={{ color: H.terracota }}>Tu tries, tot en un sol lloc.</span>
        </h1>
        <p style={{ margin: '16px 0 0', fontFamily: H.sans, fontSize: 17, color: H.inkSoft, lineHeight: 1.5, maxWidth: 620 }}>
          L'<b style={{ color: H.ink }}>Operativa</b> està pensada per usar al carrer: norma, procediment i dreceres.
          L'<b style={{ color: H.ink }}>Acadèmia</b> és per preparar l'oposició: temari, tests i simulacres.
        </p>
      </div>

      {/* Dos modes */}
      <div className="h-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2vw, 22px)' }}>
        <ModeCard to="/operativa" dark bg="linear-gradient(155deg, #2C3658, #15161E)" accent={H.blue} icon="siren"
          kicker="Per a agents en servei" title="Operativa" footnote="Norma · procediment · dreceres"
          desc="Consulta ràpida al carrer. Troba una infracció, obre un protocol o revisa una llei en segons."
          features={['Superbuscador SCT', 'Catàleg de trànsit', 'Protocols pas a pas', 'Lleis i telèfons']}
          cta="Entrar a Operativa" />
        <ModeCard to="/academia" bg={`linear-gradient(155deg, ${H.terraSoft}, #FFF3E6)`} accent={H.terracota} icon="book"
          kicker="Prepara la teva oposició" title="Acadèmia" footnote="Temari · tests · gamificat"
          desc="El teu pla d'estudi gamificat. Temari, tests oficials, flashcards i lliga setmanal."
          features={['Temari per àmbits', 'Tests i simulacres', 'Flashcards i repàs', 'Ratxa, XP i lliga']}
          cta="Entrar a l'Acadèmia" />
      </div>

      {/* Eina destacada: Croquis d'accident */}
      <Link to="/croquis" className="h-mode" style={{
        display: 'flex', alignItems: 'center', gap: 18, marginTop: 'clamp(16px,2vw,22px)', textDecoration: 'none',
        borderRadius: 24, padding: 'clamp(18px,2.4vw,26px)', color: '#fff', boxShadow: H.shadowMd,
        backgroundImage: `linear-gradient(150deg, ${H.terracota}, #C2410C)`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ position: 'relative', width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: H.inset }}>
          <HIc name="siren" size={28} color="#fff" sw={2.1} />
        </span>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: H.mono, fontWeight: 600, fontSize: 10.5, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>Nova eina</span>
          <h2 style={{ margin: '4px 0 2px', fontFamily: H.display, fontWeight: 700, fontSize: 'clamp(20px,2.6vw,26px)', letterSpacing: -0.8, lineHeight: 1.1 }}>Croquis d'accident</h2>
          <p style={{ margin: 0, fontFamily: H.sans, fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.45 }}>Recrea l'accident: via, vehicles, senyals, semàfors i trajectòries. Exporta a PNG per a l'atestat.</p>
        </div>
        <span className="h-btn" style={{ position: 'relative', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: H.terracota, borderRadius: 14, padding: '12px 20px', fontFamily: H.display, fontWeight: 700, fontSize: 15 }}>
          Obrir <HIc name="arrow" size={17} color={H.terracota} sw={2.4} />
        </span>
      </Link>

      {/* Actualitat (es manté) */}
      {recentNoticies.length > 0 && (
        <section className="home-section" style={{ marginTop: 28 }}>
          <div className="hs-head">
            <span className="tag">📰 Actualitat</span>
            <span className="rule" />
            <Link to="/noticies" className="more">Veure-les totes →</Link>
          </div>
          <ul className="grid gap-2.5">
            {recentNoticies.map((n) => (
              <li key={n.slug}>
                <Link to={`/noticies/${encodeURIComponent(n.slug)}`} className="news-row">
                  <span className="news-icon">📄</span>
                  <div className="min-w-0"><h4>{n.title}</h4><p>{n.summary}</p></div>
                  <span className="news-date">{n.publishedAt.slice(5)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
