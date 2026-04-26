// Pàgina de recursos ràpids — eines, enllaços externs, telèfons útils
// i taules de referència per a una intervenció policial.
//
// Les eines interactives (validador DNI, llibreta…) viuen en components
// propis a sota perquè el fitxer principal sigui llegible.
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useT } from '../lib/i18n';

// ════════════════════════════════════════════════════════════════════
// DADES DE REFERÈNCIA
// ════════════════════════════════════════════════════════════════════

// Codi alfanumèric (alfabet fonètic policial espanyol + Ñ + Ç).
const CODI_ALFANUMERIC: Array<{ letra: string; paraula: string }> = [
  { letra: 'A', paraula: 'Antonio' }, { letra: 'B', paraula: 'Barcelona' },
  { letra: 'C', paraula: 'Carmen' }, { letra: 'Ç', paraula: 'Capça' },
  { letra: 'D', paraula: 'Daniel' }, { letra: 'E', paraula: 'Enrique' },
  { letra: 'F', paraula: 'Francia' }, { letra: 'G', paraula: 'Granada' },
  { letra: 'H', paraula: 'Historia' }, { letra: 'I', paraula: 'Inés' },
  { letra: 'J', paraula: 'José' }, { letra: 'K', paraula: 'Kilo' },
  { letra: 'L', paraula: 'Lorenzo' }, { letra: 'M', paraula: 'Madrid' },
  { letra: 'N', paraula: 'Navarra' }, { letra: 'Ñ', paraula: 'Ñoño' },
  { letra: 'O', paraula: 'Oviedo' }, { letra: 'P', paraula: 'París' },
  { letra: 'Q', paraula: 'Querido' }, { letra: 'R', paraula: 'Ramón' },
  { letra: 'S', paraula: 'Sábado' }, { letra: 'T', paraula: 'Toledo' },
  { letra: 'U', paraula: 'Ulises' }, { letra: 'V', paraula: 'Valencia' },
  { letra: 'W', paraula: 'Washington' }, { letra: 'X', paraula: 'Xilófono' },
  { letra: 'Y', paraula: 'Yegua' }, { letra: 'Z', paraula: 'Zaragoza' },
];

// Telèfons útils. Genèrics + locals (Viladecans). Edita els
// 'TODO' amb les dades reals quan els tinguis.
type Telefon = {
  num: string;
  nom: string;
  desc: string;
  cat: 'emergencia' | 'policial' | 'salut' | 'social' | 'local';
};
const TELEFONS: Telefon[] = [
  { num: '112', nom: 'Emergències', desc: 'Telèfon únic emergències (24h)', cat: 'emergencia' },
  { num: '061', nom: 'Emergències sanitàries', desc: 'SEM (24h)', cat: 'salut' },
  { num: '080', nom: 'Bombers', desc: 'Bombers de la Generalitat (24h)', cat: 'emergencia' },
  { num: '088', nom: "Mossos d'Esquadra", desc: 'Policia de Catalunya (24h)', cat: 'policial' },
  { num: '091', nom: 'Policia Nacional', desc: 'CNP (24h)', cat: 'policial' },
  { num: '092', nom: 'Policia Local', desc: 'Policia Local (24h)', cat: 'policial' },
  { num: '062', nom: 'Guàrdia Civil', desc: 'Guàrdia Civil (24h)', cat: 'policial' },
  { num: '016', nom: 'Atenció violència gènere', desc: '24h · NO deixa rastre · sms 600 000 016', cat: 'social' },
  { num: '024', nom: 'Conducta suïcida', desc: 'Línia atenció suïcidi (24h)', cat: 'salut' },
  { num: '900 20 20 10', nom: 'Fundació ANAR', desc: "Ajuda a infància i adolescència (24h)", cat: 'social' },
];

// Codis provincials de matrícules antigues (abans del 2000). Encara
// és habitual veure'n a la via pública.
const MATRICULES_PROV: Array<{ codi: string; provincia: string }> = [
  { codi: 'A', provincia: 'Alacant' }, { codi: 'AB', provincia: 'Albacete' },
  { codi: 'AL', provincia: 'Almeria' }, { codi: 'AV', provincia: 'Àvila' },
  { codi: 'B', provincia: 'Barcelona' }, { codi: 'BA', provincia: 'Badajoz' },
  { codi: 'BI', provincia: 'Bizkaia' }, { codi: 'BU', provincia: 'Burgos' },
  { codi: 'C', provincia: 'A Coruña' }, { codi: 'CA', provincia: 'Cadis' },
  { codi: 'CC', provincia: 'Càceres' }, { codi: 'CO', provincia: 'Còrdova' },
  { codi: 'CR', provincia: 'Ciudad Real' }, { codi: 'CS', provincia: 'Castelló' },
  { codi: 'CU', provincia: 'Conca' }, { codi: 'GC', provincia: 'Gran Canària' },
  { codi: 'GI', provincia: 'Girona' }, { codi: 'GR', provincia: 'Granada' },
  { codi: 'GU', provincia: 'Guadalajara' }, { codi: 'H', provincia: 'Huelva' },
  { codi: 'HU', provincia: 'Osca' }, { codi: 'J', provincia: 'Jaén' },
  { codi: 'L', provincia: 'Lleida' }, { codi: 'LE', provincia: 'Lleó' },
  { codi: 'LO', provincia: 'La Rioja' }, { codi: 'LU', provincia: 'Lugo' },
  { codi: 'M', provincia: 'Madrid' }, { codi: 'MA', provincia: 'Màlaga' },
  { codi: 'MU', provincia: 'Múrcia' }, { codi: 'NA', provincia: 'Navarra' },
  { codi: 'O', provincia: 'Astúries' }, { codi: 'OR', provincia: 'Ourense' },
  { codi: 'P', provincia: 'Palència' }, { codi: 'PM', provincia: 'Mallorca' },
  { codi: 'PO', provincia: 'Pontevedra' }, { codi: 'S', provincia: 'Cantàbria' },
  { codi: 'SA', provincia: 'Salamanca' }, { codi: 'SE', provincia: 'Sevilla' },
  { codi: 'SG', provincia: 'Segòvia' }, { codi: 'SO', provincia: 'Sòria' },
  { codi: 'SS', provincia: 'Gipuzkoa' }, { codi: 'T', provincia: 'Tarragona' },
  { codi: 'TE', provincia: 'Terol' }, { codi: 'TF', provincia: 'Tenerife' },
  { codi: 'TO', provincia: 'Toledo' }, { codi: 'V', provincia: 'València' },
  { codi: 'VA', provincia: 'Valladolid' }, { codi: 'VI', provincia: 'Àlaba' },
  { codi: 'Z', provincia: 'Saragossa' }, { codi: 'ZA', provincia: 'Zamora' },
  { codi: 'CE', provincia: 'Ceuta' }, { codi: 'ML', provincia: 'Melilla' },
];

// ════════════════════════════════════════════════════════════════════
// UI
// ════════════════════════════════════════════════════════════════════

const TIPUS_COLOR: Record<Telefon['cat'], string> = {
  emergencia: '#ef4444',
  policial: '#1e40af',
  salut: '#10b981',
  social: '#a16207',
  local: '#7c3aed',
};

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
            href="https://aiac.veterinaris.cat/ords/ws_ccvc/r/cerques/inicial?session=11290977264299"
            icon="🐾"
            color="#7c3aed"
            badge={t('recursos.aiac.badge')}
            title={t('recursos.aiac.title')}
            desc={t('recursos.aiac.desc')}
            host="aiac.veterinaris.cat"
          />
        </div>
      </Section>

      {/* TELÈFONS ÚTILS */}
      <Section icon="📞" label={t('recursos.section.phones')}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {TELEFONS.map((p) => (
            <PhoneCard key={p.num + p.nom} phone={p} />
          ))}
        </ul>
        {/* Grúa municipal Viladecans (placeholder editable a la mateixa
            constant del fitxer) */}
        <LocalCard
          icon="🚛"
          color="#7c3aed"
          badge={t('recursos.grua.badge')}
          title={t('recursos.grua.title')}
          phone="TODO 93 xxx xx xx"
          address="TODO Carrer ___, Viladecans"
          extra={t('recursos.grua.note')}
        />
      </Section>

      {/* EINES INTERACTIVES */}
      <Section icon="🛠️" label={t('recursos.section.tools')}>
        <CollapsibleTool icon="🆔" title={t('recursos.dni.title')} desc={t('recursos.dni.desc')}>
          <DniValidator />
        </CollapsibleTool>
        <CollapsibleTool icon="📝" title={t('recursos.notes.title')} desc={t('recursos.notes.desc')}>
          <Notepad />
        </CollapsibleTool>
      </Section>

      {/* REFERÈNCIA RÀPIDA */}
      <Section icon="📋" label={t('recursos.section.reference')}>
        {/* Codi alfanumèric */}
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

        {/* Codis provincials matrícules */}
        <CollapsibleTool icon="🅿️" title={t('recursos.matricules.title')} desc={t('recursos.matricules.desc')}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {MATRICULES_PROV.map((m) => (
              <li
                key={m.codi}
                className="flex items-baseline gap-2 rounded-lg px-3 py-2 transition
                  hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-400 min-w-[28px] text-center bg-amber-50 dark:bg-amber-400/10 rounded px-1" aria-hidden>
                  {m.codi}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {m.provincia}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
            {t('recursos.matricules.note')}
          </p>
        </CollapsibleTool>
      </Section>

      {/* INFORMACIÓ LOCAL (placeholders per omplir) */}
      <Section icon="🗺️" label={t('recursos.section.local')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <LocalCard
            icon="⚖️"
            color="#1e40af"
            badge={t('recursos.jutjats.badge')}
            title={t('recursos.jutjats.title')}
            phone="TODO 93 xxx xx xx"
            address="TODO Adreça Jutjats Gavà"
            extra={t('recursos.jutjats.note')}
          />
          <LocalCard
            icon="🏥"
            color="#10b981"
            badge={t('recursos.hospital.badge')}
            title={t('recursos.hospital.title')}
            phone="TODO"
            address="TODO Adreça CAP / Hospital de referència"
            extra={t('recursos.hospital.note')}
          />
          <LocalCard
            icon="🔫"
            color="#dc2626"
            badge={t('recursos.tir.badge')}
            title={t('recursos.tir.title')}
            phone="—"
            address="TODO Llistat camps de tir autoritzats"
            extra={t('recursos.tir.note')}
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
  href,
  icon,
  color,
  badge,
  title,
  desc,
  host,
}: {
  href: string;
  icon: string;
  color: string;
  badge: string;
  title: string;
  desc: string;
  host: string;
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
        >
          {icon}
        </span>
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

function PhoneCard({ phone }: { phone: Telefon }) {
  const color = TIPUS_COLOR[phone.cat];
  const tel = phone.num.replace(/\s+/g, '');
  return (
    <li>
      <a
        href={`tel:${tel}`}
        className="group flex items-start gap-3 rounded-xl border p-3 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md
          border-slate-200 bg-white
          dark:border-white/10 dark:bg-[#0f1d34]"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <span
          className="rounded-md px-2.5 py-1.5 font-mono font-bold text-white text-sm shrink-0"
          style={{ backgroundColor: color }}
        >
          {phone.num}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight">{phone.nom}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{phone.desc}</div>
        </div>
      </a>
    </li>
  );
}

function LocalCard({
  icon,
  color,
  badge,
  title,
  phone,
  address,
  extra,
}: {
  icon: string;
  color: string;
  badge: string;
  title: string;
  phone: string;
  address: string;
  extra?: string;
}) {
  const isTodo = phone.startsWith('TODO') || address.startsWith('TODO');
  return (
    <div
      className="rounded-xl border p-4 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl text-white shadow-inner"
          style={{ background: `linear-gradient(135deg, ${color}, ${color})` }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color }}>
            {badge}
          </div>
          <div className="mt-0.5 font-bold">{title}</div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-start gap-2">
              <span aria-hidden className="opacity-60">📞</span>
              {phone.startsWith('TODO') ? (
                <span className="text-amber-700 dark:text-amber-400 italic">{phone.replace(/^TODO\s*/, '— Per completar: ')}</span>
              ) : (
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-blue-700 dark:text-blue-400 underline">{phone}</a>
              )}
            </div>
            <div className="flex items-start gap-2">
              <span aria-hidden className="opacity-60">📍</span>
              {address.startsWith('TODO') ? (
                <span className="text-amber-700 dark:text-amber-400 italic">{address.replace(/^TODO\s*/, '— Per completar: ')}</span>
              ) : (
                <span className="text-slate-700 dark:text-slate-200">{address}</span>
              )}
            </div>
            {extra && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">
                {extra}
              </div>
            )}
          </div>
          {isTodo && (
            <div className="mt-2 text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
              ⚠️ Pendent d'omplir amb dades reals
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollapsibleTool({
  icon,
  title,
  desc,
  defaultOpen = false,
  children,
}: {
  icon: string;
  title: string;
  desc: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
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

function DniValidator() {
  const [input, setInput] = useState('');
  const result = validateDniNie(input);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="dni-input" className="block text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 mb-1">
          Document
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
            {result.kind === 'valid' && `✅ ${result.type} vàlid`}
            {result.kind === 'invalid' && `❌ ${result.type} INVÀLID`}
            {result.kind === 'incomplete' && '⚠️ Incomplet o format desconegut'}
          </div>
          <div className="text-xs">
            {result.message}
            {result.kind === 'invalid' && result.expected && (
              <div className="mt-1 font-mono">
                Lletra correcta: <strong>{result.expected}</strong>
              </div>
            )}
          </div>
        </div>
      )}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        Calcula la lletra de control segons el càlcul oficial (mòdul 23 sobre 23 lletres).
        Útil per detectar documents amb format incorrecte / falsificacions barates.
      </p>
    </div>
  );
}

// Algoritme oficial DNI/NIE: número mòdul 23 → índex en cadena fixa.
// Per al NIE, X→0, Y→1, Z→2, després mateix algoritme.
const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

function validateDniNie(s: string): {
  kind: 'valid' | 'invalid' | 'incomplete';
  type: string;
  message: string;
  expected?: string;
} {
  const v = s.trim().toUpperCase();
  if (!v) return { kind: 'incomplete', type: '', message: 'Escriu un DNI o NIE.' };

  // DNI: 8 dígits + 1 lletra
  const dniMatch = v.match(/^(\d{8})([A-Z])$/);
  if (dniMatch) {
    const num = parseInt(dniMatch[1], 10);
    const letter = dniMatch[2];
    const expected = DNI_LETTERS[num % 23];
    return letter === expected
      ? { kind: 'valid', type: 'DNI', message: `Número ${dniMatch[1]} amb lletra ${letter}.` }
      : { kind: 'invalid', type: 'DNI', message: `La lletra no correspon al número.`, expected };
  }

  // NIE: X/Y/Z + 7 dígits + 1 lletra
  const nieMatch = v.match(/^([XYZ])(\d{7})([A-Z])$/);
  if (nieMatch) {
    const prefix = nieMatch[1];
    const numStr = (prefix === 'X' ? '0' : prefix === 'Y' ? '1' : '2') + nieMatch[2];
    const num = parseInt(numStr, 10);
    const letter = nieMatch[3];
    const expected = DNI_LETTERS[num % 23];
    return letter === expected
      ? { kind: 'valid', type: 'NIE', message: `${prefix}${nieMatch[2]} amb lletra ${letter}.` }
      : { kind: 'invalid', type: 'NIE', message: `La lletra no correspon al número.`, expected };
  }

  return { kind: 'incomplete', type: '', message: 'Format esperat: 8 dígits + lletra (DNI) o X/Y/Z + 7 dígits + lletra (NIE).' };
}

// ── EINA: Llibreta operativa (notes amb localStorage) ───────────────

const NOTES_KEY = 'infopol-llibreta';

function Notepad() {
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Carrega inicial
  useEffect(() => {
    try {
      const v = localStorage.getItem(NOTES_KEY);
      if (v) setText(v);
    } catch {
      // localStorage podria estar deshabilitat
    }
  }, []);

  // Auto-desa amb debounce de 500ms
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(NOTES_KEY, text);
        setSavedAt(new Date());
      } catch {
        // silent
      }
    }, 500);
    return () => clearTimeout(id);
  }, [text]);

  function clearAll() {
    if (!text.trim()) return;
    if (confirm('Esborrar totes les notes?')) {
      setText('');
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Notes operatives del torn (matrícules, observacions, recordatoris…). Es desa al teu navegador automàticament."
        rows={10}
        className="w-full rounded-xl border-2 px-3 py-2 text-sm outline-none resize-y font-mono
          border-slate-200 bg-white text-slate-900
          focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20
          dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      />
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {savedAt
            ? `💾 Desat ${savedAt.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
            : 'Es desa automàticament al teu dispositiu'}
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border px-3 py-1 transition
            border-red-200 text-red-700 hover:bg-red-50
            dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-400/10"
        >
          🗑️ Esborrar
        </button>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        Privadesa: les notes només es guarden al teu navegador (localStorage), mai s'envien a cap servidor.
      </p>
    </div>
  );
}
