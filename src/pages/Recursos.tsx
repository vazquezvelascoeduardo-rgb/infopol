// Pàgina de recursos ràpids · rebranding 2026.
// Hero card tintat verd + seccions: enllaços externs, eines col·lapsables,
// referència ràpida (NATO + telèfons), informació local (Maps).
import { useEffect, useState, type ReactNode } from 'react';
import { useT } from '../lib/i18n';
import AlcoholCalculator from '../components/AlcoholCalculator';
import { A, Ic, Mono } from '../lib/design';

// Telèfons d'emergència i atenció (abans a la secció "Telèfons" d'Operativa).
const PHONES = [
  { num: '112', show: '112', label: 'Emergències', color: A.red },
  { num: '016', show: '016', label: 'Violència masclista', color: A.pink },
  { num: '024', show: '024', label: 'Conducta suïcida', color: A.blue },
  { num: '900202010', show: '900…', label: 'ANAR · Menors', color: A.green },
];

// Codi alfanumèric (alfabet fonètic NATO/ICAO + Ç + Ñ).
const CODI_ALFANUMERIC: Array<{ letra: string; paraula: string; special?: boolean }> = [
  { letra: 'A', paraula: 'Alfa' }, { letra: 'B', paraula: 'Bravo' },
  { letra: 'C', paraula: 'Charlie' }, { letra: 'D', paraula: 'Delta' },
  { letra: 'E', paraula: 'Echo' }, { letra: 'F', paraula: 'Foxtrot' },
  { letra: 'G', paraula: 'Golf' }, { letra: 'H', paraula: 'Hotel' },
  { letra: 'I', paraula: 'India' }, { letra: 'J', paraula: 'Juliett' },
  { letra: 'K', paraula: 'Kilo' }, { letra: 'L', paraula: 'Lima' },
  { letra: 'M', paraula: 'Mike' }, { letra: 'N', paraula: 'November' },
  { letra: 'O', paraula: 'Oscar' }, { letra: 'P', paraula: 'Papa' },
  { letra: 'Q', paraula: 'Quebec' }, { letra: 'R', paraula: 'Romeo' },
  { letra: 'S', paraula: 'Sierra' }, { letra: 'T', paraula: 'Tango' },
  { letra: 'U', paraula: 'Uniform' }, { letra: 'V', paraula: 'Victor' },
  { letra: 'W', paraula: 'Whiskey' }, { letra: 'X', paraula: 'X-ray' },
  { letra: 'Y', paraula: 'Yankee' }, { letra: 'Z', paraula: 'Zulu' },
  { letra: 'Ç', paraula: 'Capçà', special: true },
  { letra: 'Ñ', paraula: 'Ñoño', special: true },
];

export default function Recursos() {
  const { t } = useT();
  return (
    <div className="shell">
      {/* Hero amb degradat (estil Claude Design) */}
      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: `${A.green}`, color: '#fff', padding: 'clamp(22px,3vw,30px)', boxShadow: A.shadow, marginBottom: 8 }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic name="star" size={28} color="#fff" sw={2.2} /></span>
          <div style={{ minWidth: 0 }}>
            <Mono size={11} color="rgba(255,255,255,0.85)">{t('recursos.badge')}</Mono>
            <h1 style={{ margin: '6px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.4vw,34px)', letterSpacing: -1, lineHeight: 1.05 }}>{t('recursos.title')}</h1>
            <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.5, opacity: 0.92, maxWidth: 480 }}>{t('recursos.subtitle')}</p>
          </div>
        </div>
      </header>

      {/* Telèfons útils */}
      <SectionHead accent="var(--c-recursos)">📞 Telèfons útils</SectionHead>
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PHONES.map((p) => (
          <a key={p.num} href={`tel:${p.num}`} className="a-hover" style={{ textDecoration: 'none', background: A.card, border: `1px solid ${A.line}`, borderRadius: 18, boxShadow: A.shadow, padding: 18, textAlign: 'center', display: 'block' }}>
            <span style={{ width: 46, height: 46, borderRadius: 13, background: p.color, display: 'grid', placeItems: 'center', margin: '0 auto 10px' }}><Ic name="phone" size={22} color="#fff" sw={2.1} /></span>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 24, color: A.ink, letterSpacing: -0.5 }}>{p.show}</div>
            <div style={{ fontFamily: A.sans, fontWeight: 600, fontSize: 12.5, color: A.inkSoft, marginTop: 2 }}>{p.label}</div>
          </a>
        ))}
      </section>

      {/* Enllaços externs */}
      <SectionHead accent="var(--c-recursos)">🌐 {t('recursos.section.external')}</SectionHead>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ExternalLink
          href="https://www.farmaguia.net/desktop/municipi/viladecans"
          icon="💊"
          accent="var(--c-recursos)"
          badge={t('recursos.farmacia.badge')}
          title={t('recursos.farmacia.title')}
          desc={t('recursos.farmacia.desc')}
          host="farmaguia.net"
        />
        <ExternalLink
          href="https://aiac.veterinaris.cat/ords/ws_ccvc/r/cerques/login"
          icon="🐾"
          accent="var(--c-superbuscador)"
          badge={t('recursos.aiac.badge')}
          title={t('recursos.aiac.title')}
          desc={t('recursos.aiac.desc')}
          host="aiac.veterinaris.cat"
        />
      </section>

      {/* Herramientas */}
      <SectionHead accent="var(--c-recursos)">🛠️ {t('recursos.section.tools')}</SectionHead>
      <section className="flex flex-col gap-2.5">
        <CollapsibleTool
          icon="🍷"
          tintBg="var(--tint-alcoholemia)"
          accent="var(--c-alcoholemia)"
          title={t('recursos.alcohol.title')}
          desc={t('recursos.alcohol.desc')}
        >
          <AlcoholCalculator />
        </CollapsibleTool>
        <CollapsibleTool
          icon="🆔"
          tintBg="var(--tint-superbuscador)"
          accent="var(--c-superbuscador)"
          title={t('recursos.dni.title')}
          desc={t('recursos.dni.desc')}
        >
          <DniValidator />
        </CollapsibleTool>
        <CollapsibleTool
          icon="📓"
          tintBg="var(--terracotta-soft)"
          accent="var(--terracotta)"
          title={t('recursos.notes.title')}
          desc={t('recursos.notes.desc')}
        >
          <Notepad />
        </CollapsibleTool>
      </section>

      {/* Referència ràpida */}
      <SectionHead accent="var(--c-recursos)">📋 {t('recursos.section.reference')}</SectionHead>
      <section className="flex flex-col gap-2.5">
        <details className="ref" open>
          <summary>
            <span className="tool-icon" style={{ background: 'var(--tint-operativa)' }}>🔤</span>
            <div>
              <h4>{t('recursos.codi.title')}</h4>
              <p>{t('recursos.codi.desc')}</p>
            </div>
            <span className="chev">▼</span>
          </summary>
          <div className="ref-body">
            <div className="nato-grid">
              {CODI_ALFANUMERIC.map((it) => (
                <span
                  key={it.letra}
                  style={it.special ? { color: 'var(--terracotta)' } : undefined}
                >
                  <b>{it.letra}</b> {it.paraula}
                </span>
              ))}
            </div>
          </div>
        </details>
      </section>

      {/* Informació local */}
      <SectionHead accent="var(--c-recursos)">🗺️ {t('recursos.section.local')}</SectionHead>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ExternalLink
          href="https://share.google/x47lOfnrP53phZagm"
          icon="🚛"
          accent="var(--c-superbuscador)"
          badge={t('recursos.grua.badge')}
          title={t('recursos.grua.title')}
          desc={t('recursos.grua.note')}
          host="maps.google.com"
        />
        <ExternalLink
          href="https://share.google/GOtHtw11AabsPfuGz"
          icon="⚖️"
          accent="var(--c-operativa)"
          badge={t('recursos.jutjats.badge')}
          title={t('recursos.jutjats.title')}
          desc={t('recursos.jutjats.note')}
          host="maps.google.com"
        />
        <ExternalLink
          href="https://share.google/CkxhdodGk1eXNAwNs"
          icon="🏥"
          accent="var(--c-recursos)"
          badge={t('recursos.hospital.badge')}
          title={t('recursos.hospital.title')}
          desc={t('recursos.hospital.note')}
          host="maps.google.com"
        />
      </section>

      <div className="mt-6 mb-2 rounded-md border border-dashed border-line p-5 text-center text-sm text-text-3 bg-paper-2">
        💡 {t('recursos.moreToCome')}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// COMPONENTS AUXILIARS
// ════════════════════════════════════════════════════════════════════

function SectionHead({
  accent,
  children,
}: {
  accent: string;
  children: ReactNode;
}) {
  return (
    <div
      className="section-head"
      style={{ ['--accent' as never]: accent } as React.CSSProperties}
    >
      <span className="eyebrow">{children}</span>
      <span className="rule" />
    </div>
  );
}

function ExternalLink({
  href, icon, accent, badge, title, desc, host,
}: {
  href: string; icon: string; accent: string; badge: string;
  title: string; desc: string; host: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ext-card"
      style={{ ['--accent' as never]: accent } as React.CSSProperties}
    >
      <span
        className="appicon"
        style={{ ['--accent' as never]: accent } as React.CSSProperties}
      >
        {icon}
      </span>
      <div>
        <div className="eyebrow" style={{ color: accent }}>
          {badge}
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <span className="link">🔗 {host}</span>
      </div>
      <span className="ext-arr">↗</span>
    </a>
  );
}

function CollapsibleTool({
  icon, title, desc, tintBg, accent, defaultOpen = false, children,
}: {
  icon: string; title: string; desc: string;
  tintBg: string; accent: string;
  defaultOpen?: boolean; children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="ref">
      <summary>
        <span className="tool-icon" style={{ background: tintBg }}>{icon}</span>
        <div>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
        <span
          className="play"
          style={{ ['--accent' as never]: accent } as React.CSSProperties}
        >
          ▶
        </span>
      </summary>
      <div className="ref-body">
        {children}
      </div>
    </details>
  );
}


// ── EINA: Validador DNI/NIE ─────────────────────────────────────────

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

function validateDniNie(s: string, t: (key: string) => string): {
  kind: 'valid' | 'invalid' | 'incomplete';
  type: string;
  message: string;
  expected?: string;
} {
  const v = s.trim().toUpperCase();
  if (!v) return { kind: 'incomplete', type: '', message: t('recursos.dni.empty') };
  const dniMatch = v.match(/^(\d{8})([A-Z])$/);
  if (dniMatch) {
    const num = parseInt(dniMatch[1], 10);
    const letter = dniMatch[2];
    const expected = DNI_LETTERS[num % 23];
    return letter === expected
      ? { kind: 'valid', type: 'DNI', message: t('recursos.dni.validMsg').replace('{n}', dniMatch[1]).replace('{l}', letter) }
      : { kind: 'invalid', type: 'DNI', message: t('recursos.dni.invalidMsg'), expected };
  }
  const nieMatch = v.match(/^([XYZ])(\d{7})([A-Z])$/);
  if (nieMatch) {
    const prefix = nieMatch[1];
    const numStr = (prefix === 'X' ? '0' : prefix === 'Y' ? '1' : '2') + nieMatch[2];
    const num = parseInt(numStr, 10);
    const letter = nieMatch[3];
    const expected = DNI_LETTERS[num % 23];
    return letter === expected
      ? { kind: 'valid', type: 'NIE', message: t('recursos.dni.validMsg').replace('{n}', `${prefix}${nieMatch[2]}`).replace('{l}', letter) }
      : { kind: 'invalid', type: 'NIE', message: t('recursos.dni.invalidMsg'), expected };
  }
  return { kind: 'incomplete', type: '', message: t('recursos.dni.formatHint') };
}

function DniValidator() {
  const { t } = useT();
  const [input, setInput] = useState('');
  const result = validateDniNie(input, t);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="dni-input" className="eyebrow block mb-1.5" style={{ color: 'var(--text-3)' }}>
          {t('recursos.dni.docLabel')}
        </label>
        <input
          id="dni-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, ''))}
          placeholder="12345678A o X1234567L"
          maxLength={9}
          autoCapitalize="characters"
          className="w-full rounded-md border-2 border-line bg-white text-ink px-4 py-3 text-base font-mono outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta-soft"
        />
      </div>
      {input.length > 0 && (
        <div
          className="rounded-md border-l-4 p-3 text-sm"
          style={{
            borderLeftColor:
              result.kind === 'valid' ? 'var(--c-recursos)' :
              result.kind === 'invalid' ? '#b91c1c' :
              '#b8651b',
            background:
              result.kind === 'valid' ? 'var(--tint-recursos)' :
              result.kind === 'invalid' ? '#fde2e7' :
              '#f7e3cf',
            color: 'var(--ink)',
          }}
        >
          <div className="font-bold mb-1">
            {result.kind === 'valid' && `✅ ${result.type} ${t('recursos.dni.valid')}`}
            {result.kind === 'invalid' && `❌ ${result.type} ${t('recursos.dni.invalid')}`}
            {result.kind === 'incomplete' && `⚠️ ${t('recursos.dni.incomplete')}`}
          </div>
          <div className="text-xs">
            {result.message}
            {result.kind === 'invalid' && result.expected && (
              <div className="mt-1 font-mono">{t('recursos.dni.expectedLetter')}: <strong>{result.expected}</strong></div>
            )}
          </div>
        </div>
      )}
      <p className="text-[11px] text-text-3 italic">
        {t('recursos.dni.footer')}
      </p>
    </div>
  );
}

// ── EINA: Llibreta operativa (notes amb localStorage) ───────────────

const NOTES_KEY = 'infopol-llibreta';

function Notepad() {
  const { t, locale } = useT();
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(NOTES_KEY);
      if (v) setText(v);
    } catch { /* localStorage podria estar deshabilitat */ }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(NOTES_KEY, text);
        setSavedAt(new Date());
      } catch { /* silent */ }
    }, 500);
    return () => clearTimeout(id);
  }, [text]);

  function clearAll() {
    if (!text.trim()) return;
    if (confirm(t('recursos.notes.confirmClear'))) setText('');
  }

  const localeStr = locale === 'ca' ? 'ca-ES' : 'es-ES';

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('recursos.notes.placeholder')}
        rows={10}
        className="w-full rounded-md border-2 border-line bg-white text-ink px-3 py-2 text-sm outline-none resize-y font-mono focus:border-terracotta focus:ring-2 focus:ring-terracotta-soft"
      />
      <div className="flex items-center justify-between text-xs text-text-3">
        <span>
          {savedAt
            ? `💾 ${t('recursos.notes.saved')} ${savedAt.toLocaleTimeString(localeStr, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
            : t('recursos.notes.autosave')}
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="btn btn-sm btn-ghost"
          style={{ height: 30, padding: '0 12px', fontSize: 13 }}
        >
          🗑️ {t('recursos.notes.clear')}
        </button>
      </div>
      <p className="text-[11px] text-text-3 italic">
        {t('recursos.notes.privacy')}
      </p>
    </div>
  );
}
