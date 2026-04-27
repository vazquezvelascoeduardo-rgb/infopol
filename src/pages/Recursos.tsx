// Pàgina de recursos ràpids — eines, enllaços externs i informació
// local útil per a una intervenció policial.
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useT } from '../lib/i18n';
import AlcoholCalculator from '../components/AlcoholCalculator';

// Codi alfanumèric (alfabet fonètic NATO/ICAO + Ç + Ñ).
const CODI_ALFANUMERIC: Array<{ letra: string; paraula: string }> = [
  { letra: 'A', paraula: 'Alfa' }, { letra: 'B', paraula: 'Bravo' },
  { letra: 'C', paraula: 'Charlie' }, { letra: 'Ç', paraula: 'Capça' },
  { letra: 'D', paraula: 'Delta' }, { letra: 'E', paraula: 'Echo' },
  { letra: 'F', paraula: 'Foxtrot' }, { letra: 'G', paraula: 'Golf' },
  { letra: 'H', paraula: 'Hotel' }, { letra: 'I', paraula: 'India' },
  { letra: 'J', paraula: 'Juliett' }, { letra: 'K', paraula: 'Kilo' },
  { letra: 'L', paraula: 'Lima' }, { letra: 'M', paraula: 'Mike' },
  { letra: 'N', paraula: 'November' }, { letra: 'Ñ', paraula: 'Ñoño' },
  { letra: 'O', paraula: 'Oscar' }, { letra: 'P', paraula: 'Papa' },
  { letra: 'Q', paraula: 'Quebec' }, { letra: 'R', paraula: 'Romeo' },
  { letra: 'S', paraula: 'Sierra' }, { letra: 'T', paraula: 'Tango' },
  { letra: 'U', paraula: 'Uniform' }, { letra: 'V', paraula: 'Victor' },
  { letra: 'W', paraula: 'Whiskey' }, { letra: 'X', paraula: 'X-Ray' },
  { letra: 'Y', paraula: 'Yankee' }, { letra: 'Z', paraula: 'Zulu' },
];

export default function Recursos() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('recursos.title')}</span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-emerald-200/70 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-3xl text-white shadow-inner">
            🧰
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-emerald-700 dark:text-emerald-400/90">
              {t('recursos.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('recursos.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('recursos.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* ENLLAÇOS EXTERNS */}
      <Section icon="🌐" label={t('recursos.section.external')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ExternalLink
            href="https://www.farmaguia.net/desktop/municipi/viladecans"
            icon="💊"
            color="#15803d"
            badge={t('recursos.farmacia.badge')}
            title={t('recursos.farmacia.title')}
            desc={t('recursos.farmacia.desc')}
            host="farmaguia.net"
          />
          <ExternalLink
            href="https://aiac.veterinaris.cat/"
            icon="🐾"
            color="#7c3aed"
            badge={t('recursos.aiac.badge')}
            title={t('recursos.aiac.title')}
            desc={t('recursos.aiac.desc')}
            host="aiac.veterinaris.cat"
          />
        </div>
      </Section>

      {/* EINES INTERACTIVES */}
      <Section icon="🛠️" label={t('recursos.section.tools')}>
        <CollapsibleTool icon="🍷" title={t('recursos.alcohol.title')} desc={t('recursos.alcohol.desc')}>
          <AlcoholCalculator />
        </CollapsibleTool>
        <CollapsibleTool icon="🆔" title={t('recursos.dni.title')} desc={t('recursos.dni.desc')}>
          <DniValidator />
        </CollapsibleTool>
        <CollapsibleTool icon="📝" title={t('recursos.notes.title')} desc={t('recursos.notes.desc')}>
          <Notepad />
        </CollapsibleTool>
      </Section>

      {/* REFERÈNCIA RÀPIDA */}
      <Section icon="📋" label={t('recursos.section.reference')}>
        <CollapsibleTool icon="🔤" title={t('recursos.codi.title')} desc={t('recursos.codi.desc')} defaultOpen>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {CODI_ALFANUMERIC.map((item) => (
              <li
                key={item.letra}
                className="flex items-baseline gap-2 rounded-lg px-3 py-2 transition
                  hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span className="font-black text-xl text-blue-700 dark:text-blue-400 w-6 shrink-0 text-center" aria-hidden>
                  {item.letra}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {item.paraula}
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleTool>
      </Section>

      {/* INFORMACIÓ LOCAL · enllaços a Google Maps */}
      <Section icon="🗺️" label={t('recursos.section.local')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MapsLink
            icon="🚛"
            color="#7c3aed"
            badge={t('recursos.grua.badge')}
            title={t('recursos.grua.title')}
            desc={t('recursos.grua.note')}
            mapsUrl="https://share.google/x47lOfnrP53phZagm"
          />
          <MapsLink
            icon="⚖️"
            color="#1e40af"
            badge={t('recursos.jutjats.badge')}
            title={t('recursos.jutjats.title')}
            desc={t('recursos.jutjats.note')}
            mapsUrl="https://share.google/GOtHtw11AabsPfuGz"
          />
          <MapsLink
            icon="🏥"
            color="#10b981"
            badge={t('recursos.hospital.badge')}
            title={t('recursos.hospital.title')}
            desc={t('recursos.hospital.note')}
            mapsUrl="https://share.google/CkxhdodGk1eXNAwNs"
          />
        </div>
      </Section>

      <div className="rounded-xl border border-dashed p-5 text-center text-sm
        border-slate-300 bg-slate-50/50 text-slate-500
        dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
        💡 {t('recursos.moreToCome')}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// COMPONENTS AUXILIARS
// ════════════════════════════════════════════════════════════════════

function Section({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500"></span>
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span aria-hidden>{icon}</span>
          {label}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10"></span>
      </div>
      {children}
    </section>
  );
}

function ExternalLink({
  href, icon, color, badge, title, desc, host,
}: {
  href: string; icon: string; color: string; badge: string;
  title: string; desc: string; host: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl border p-4 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl text-white shadow-inner"
          style={{ background: `linear-gradient(135deg, ${color}, ${color})` }}
        >{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color }}>
            {badge}
          </div>
          <div className="mt-0.5 font-bold leading-tight">{title}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{desc}</div>
          <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span aria-hidden>🔗</span> {host}
          </div>
        </div>
        <span aria-hidden className="text-xl shrink-0" style={{ color }}>↗</span>
      </div>
    </a>
  );
}

function MapsLink({
  icon, color, badge, title, desc, mapsUrl,
}: {
  icon: string; color: string; badge: string;
  title: string; desc: string; mapsUrl: string;
}) {
  const { t } = useT();
  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border p-4 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl text-white shadow-inner"
          style={{ background: `linear-gradient(135deg, ${color}, ${color})` }}
        >{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color }}>
            {badge}
          </div>
          <div className="mt-0.5 font-bold leading-tight">{title}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{desc}</div>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color }}>
            <span aria-hidden>📍</span> {t('recursos.openMaps')}
          </div>
        </div>
        <span aria-hidden className="text-xl shrink-0" style={{ color }}>↗</span>
      </div>
    </a>
  );
}

function CollapsibleTool({
  icon, title, desc, defaultOpen = false, children,
}: {
  icon: string; title: string; desc: string;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border mb-3 overflow-hidden
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
    >
      <summary className="flex items-start gap-3 p-4 cursor-pointer list-none select-none
        hover:bg-slate-50 dark:hover:bg-white/5">
        <span aria-hidden className="text-2xl shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="font-bold">{title}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{desc}</div>
        </div>
        <span aria-hidden className="text-slate-400 group-open:rotate-90 transition-transform text-lg">▶</span>
      </summary>
      <div className="border-t border-slate-200 dark:border-white/10 p-4">
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
        <label htmlFor="dni-input" className="block text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 mb-1">
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
          className="w-full rounded-xl border-2 px-4 py-3 text-base font-mono outline-none
            border-slate-200 bg-white text-slate-900
            focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20
            dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        />
      </div>
      {input.length > 0 && (
        <div
          className={`rounded-xl border-l-4 p-3 text-sm ${
            result.kind === 'valid'
              ? 'border-l-green-500 bg-green-50 text-green-900 dark:border-l-green-400/70 dark:bg-green-400/10 dark:text-green-100'
              : result.kind === 'invalid'
              ? 'border-l-red-500 bg-red-50 text-red-900 dark:border-l-red-400/70 dark:bg-red-400/10 dark:text-red-100'
              : 'border-l-amber-500 bg-amber-50 text-amber-900 dark:border-l-amber-400/70 dark:bg-amber-400/10 dark:text-amber-100'
          }`}
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
      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
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
        className="w-full rounded-xl border-2 px-3 py-2 text-sm outline-none resize-y font-mono
          border-slate-200 bg-white text-slate-900
          focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20
          dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      />
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {savedAt
            ? `💾 ${t('recursos.notes.saved')} ${savedAt.toLocaleTimeString(localeStr, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
            : t('recursos.notes.autosave')}
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border px-3 py-1 transition
            border-red-200 text-red-700 hover:bg-red-50
            dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-400/10"
        >
          🗑️ {t('recursos.notes.clear')}
        </button>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        {t('recursos.notes.privacy')}
      </p>
    </div>
  );
}
