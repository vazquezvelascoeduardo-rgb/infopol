// Pàgina de referència — Matrícules de vehicles.
// Tot el que un agent de PL necessita per identificar i validar
// matrícules: format actual, sistema provincial antic, matrícules
// especials (històriques, remolcs, ciclomotors, VTC, diplomàtiques,
// FCS, FAS), colors de fons, format europeu i actuació davant de
// matrícules irregulars.
import { Link } from 'react-router-dom';
import { useT } from '../../lib/i18n';

type Item = {
  codi: string;
  desc: string;
  base?: string;
};

type Seccio = {
  id: string;
  titol: string;
  icona: string;
  intro?: string;
  items: Item[];
  base_legal?: string[];
};

// Ordre permès al format actual: 20 consonants (sense vocals A E I O U,
// ni Q, Ñ, CH, LL). Sèrie correlativa des del 18-09-2000.
const SISTEMA_ACTUAL: Seccio = {
  id: 'actual',
  titol: 'Sistema actual (des del 18 set. 2000)',
  icona: '🔢',
  intro: "Format únic de matrícula d'àmbit estatal. Substitueix el sistema provincial.",
  items: [
    {
      codi: 'NNNN-LLL',
      desc: '4 dígits (0000-9999) + 3 lletres consonants. Primera matrícula assignada: 0000-BBB. Al 2025 es circula per la sèrie M (M-N).',
    },
    {
      codi: 'Lletres permeses',
      desc: 'Només 20 consonants: B C D F G H J K L M N P R S T V W X Y Z. Excloses vocals (A E I O U), Q, Ñ, CH i LL per evitar confusions.',
    },
    {
      codi: 'Combinacions totals',
      desc: '10.000 × 20³ = 80 milions de matrícules possibles per agotar.',
    },
    {
      codi: 'Banda blava UE',
      desc: 'Banda blava esquerra amb 12 estrelles + lletra "E" (Espanya). Obligatòria des de 2000.',
    },
    {
      codi: 'Material i mides',
      desc: 'Plaques reflectores. Davantera 520×110 mm o 340×110 mm; posterior idem o 220×220 mm (motos i quadricicles).',
    },
  ],
  base_legal: ['RD 2822/1998 (RGV) art. 25-30', 'Ordre INT/3215/2008'],
};

const SISTEMA_PROVINCIAL: Seccio = {
  id: 'provincial',
  titol: 'Sistema provincial antic (vàlid fins 2000)',
  icona: '🗺️',
  intro: 'Encara legítimes i vigents si el vehicle no ha canviat de matrícula.',
  items: [
    {
      codi: 'XX-NNNN-LL',
      desc: 'Codi provincial (1-2 lletres) + 4 dígits + 2 lletres. Ex: B-1234-XY (Barcelona).',
    },
    {
      codi: 'Codis catalans',
      desc: 'B = Barcelona · GI / GE = Girona · L = Lleida · T = Tarragona.',
    },
    {
      codi: 'Codis estatals destacats',
      desc: 'M = Madrid · V = València · SE = Sevilla · BI = Biscaia · MA = Màlaga · Z = Saragossa · CC = Càceres (no confondre amb cos consular).',
    },
    {
      codi: 'Format pre-1971',
      desc: 'Sense lletres finals: només "PROV-NNNNNN" (ex: B-123456). Encara s\'hi pot trobar a vehicles històrics.',
    },
  ],
};

const ESPECIALS: Seccio = {
  id: 'especials',
  titol: 'Matrícules especials (per categoria)',
  icona: '🏷️',
  items: [
    {
      codi: 'H-NNNN-LLL',
      desc: 'Vehicles històrics. Es concedeix per resolució i acredita >30 anys + estat original.',
      base: 'RD 1247/1995',
    },
    {
      codi: 'R-NNNN-LLL',
      desc: 'Remolcs i semiremolcs amb MMA > 750 kg que requereixen matriculació pròpia.',
    },
    {
      codi: 'C-NNNN-LLL',
      desc: 'Ciclomotors (≤ 50 cc / ≤ 45 km/h). Placa quadrada (220×220 mm) al darrere.',
    },
    {
      codi: 'E-NNNN',
      desc: "Vehicles especials (maquinària agrícola, obres, autopropulsats no aptes a la via). Sèrie pròpia per CCAA.",
    },
    {
      codi: 'S-NNNN-LLL',
      desc: 'Vehicles de prova / fabricants. Caduquen i es renoven; permeten circular abans de la matriculació definitiva.',
    },
    {
      codi: 'P-NNNN-LLL',
      desc: 'Provisional (transport de matriculació, importació, etc.). Vermella + blanc, vigència limitada.',
    },
    {
      codi: 'TR-NNNN-LLL',
      desc: 'Turística (vehicle estranger en règim temporal). Roja + blanc, exempció duanera.',
    },
    {
      codi: 'V (a la carrosseria)',
      desc: 'VTC = Vehicle de lloguer amb conductor. Distintiu blau a la part posterior. NO és la matrícula sencera.',
    },
  ],
};

const OFICIALS_FCS: Seccio = {
  id: 'oficials',
  titol: 'Vehicles oficials i Forces Armades / FCS',
  icona: '🛡️',
  intro: 'Sèries reservades. Identificació imprescindible per a coordinació en intervencions.',
  items: [
    { codi: 'PGC', desc: 'Guàrdia Civil. Placa amb fons vermell i lletres blanques.' },
    { codi: 'CNP', desc: 'Cos Nacional de Policia. Placa blau institucional.' },
    { codi: 'CME', desc: "Cos de Mossos d'Esquadra. Placa amb fons blanc i logotip CME." },
    { codi: 'ET', desc: 'Exèrcit de Terra (FAS). Format ET-NNNNNN.' },
    { codi: 'FN', desc: 'Armada (FAS). Format FN-NNNNNN.' },
    { codi: 'EA', desc: "Exèrcit de l'Aire i de l'Espai (FAS). Format EA-NNNNNN." },
    { codi: 'MT / MTA', desc: 'Ministeri de Defensa — vehicles administratius civils.' },
    { codi: 'PMM', desc: "Parc Mòbil de l'Estat — vehicles oficials civils." },
  ],
};

const DIPLOMATIQUES: Seccio = {
  id: 'diplomatiques',
  titol: 'Cos diplomàtic i organismes internacionals',
  icona: '🌐',
  intro: 'Fons blau marí, lletres blanques. Atenció: gaudeixen de privilegis i immunitats segons la Convenció de Viena.',
  items: [
    {
      codi: 'CD',
      desc: "Cos Diplomàtic (ambaixadors, agents diplomàtics). Inviolabilitat personal i immunitat de jurisdicció.",
    },
    {
      codi: 'CC',
      desc: 'Cos Consular. Immunitat funcional (només pels actes propis del càrrec).',
    },
    {
      codi: 'OI',
      desc: 'Organismes Internacionals (UE, ONU, OCDE...). Privilegis segons acord seu.',
    },
    {
      codi: 'TA',
      desc: 'Personal Tècnic Administratiu d\'ambaixades / consolats. Privilegi limitat.',
    },
    {
      codi: 'E',
      desc: "Personal de servei estranger (xofers, etc.). Sense immunitat però amb règim duaner especial.",
    },
  ],
  base_legal: ['Convenció de Viena 1961 (diplomàtics)', 'Convenció de Viena 1963 (consolats)'],
};

const COLORS: Seccio = {
  id: 'colors',
  titol: 'Colors de fons (significat)',
  icona: '🎨',
  items: [
    { codi: 'Blanc · negre', desc: 'Vehicles ordinaris (turismes, motocicletes, camions, autobusos privats).' },
    { codi: 'Groc · negre', desc: 'Servei públic (taxi, autobús urbà, ambulància, vehicles de lloguer sense conductor — antic).' },
    { codi: 'Vermell · blanc', desc: 'Provisional (P), proves (S) i turística (TR). Vigència limitada.' },
    { codi: 'Verd · blanc', desc: 'Vehicles oficials (Estat, CCAA, ens locals) i agents de l\'autoritat.' },
    { codi: 'Blau · blanc', desc: 'Cos diplomàtic / consular / OI.' },
    { codi: 'Negre · groc', desc: 'Format antic (anterior al 1971). Encara legítim si no s\'ha rematriculat.' },
  ],
};

const ESTRANGERES: Seccio = {
  id: 'estrangeres',
  titol: 'Identificació de matrícules estrangeres',
  icona: '🌍',
  items: [
    {
      codi: 'Format UE',
      desc: 'Banda blava esquerra amb 12 estrelles + codi país (E, F, D, P, IT, NL, DE, BE, GB-no des Brexit...). Mida estandarditzada.',
    },
    {
      codi: 'Fora UE / EEE',
      desc: 'Sense banda blava, format propi. Generalment + adhesiu oval blanc amb lletres negres del país (CH, NO, MA, AND, RUS...).',
    },
    {
      codi: 'Andorra (AND)',
      desc: 'Format actual NNNN-LL (4 dígits + 2 lletres) + adhesiu oval AND. NO és UE; règim duaner i fiscal específic.',
    },
    {
      codi: 'Marroc (MA)',
      desc: 'Format actual NNNNN-X-NN (caràcters àrabs i llatins). Atenció a vehicles amb permís importació temporal a Espanya.',
    },
    {
      codi: 'Regne Unit (UK)',
      desc: 'Post-Brexit: codi UK (no GB) + bandera anglesa. Banda blava amb estrelles ja no obligatòria a les noves.',
    },
  ],
};

const ACTUACIO: Seccio = {
  id: 'actuacio',
  titol: 'Actuació davant matrícules irregulars',
  icona: '🚨',
  items: [
    {
      codi: 'No portar matrícula',
      desc: 'Infracció molt greu. Immobilització i denúncia. Si circula intencionalment per ocultar identitat → escorcoll i possible delicte.',
      base: 'Art. 76.h LSV; art. 18 RGV',
    },
    {
      codi: 'Matrícula no llegible / coberta',
      desc: 'Brutícia, fang, adhesiu, suport de bicicletes... Infracció greu (200 €). Si és dolosa: molt greu (500 €) + retirada de punts.',
      base: 'Art. 76.h LSV',
    },
    {
      codi: 'Placa falsa o suplantada',
      desc: 'DELICTE. No es queda en sanció administrativa. Detenció + atestat. Si la placa està oficialment registrada a un altre vehicle → coordinació amb DGT i el seu titular.',
      base: 'Art. 399 CP (placa oficial falsa) · Art. 392 CP (falsedat documental)',
    },
    {
      codi: 'Doble matriculació (cloning)',
      desc: 'Vehicle que duplica matrícula d\'un altre vehicle existent. Verificar bastidor (VIN), número de motor i documentació. Diligències per delicte.',
      base: 'Art. 392 / 399 CP',
    },
    {
      codi: 'Matrícula vençuda (P, S, TR)',
      desc: 'Comprovar data de vigència a la pròpia placa o documentació. Si està caducada → infracció + immobilització.',
    },
    {
      codi: 'Vehicle estranger > 6 mesos a Espanya',
      desc: 'Obligació de matricular a Espanya si el resident hi té domicili habitual. Coordinació amb Hisenda (IEDMT).',
      base: 'Llei 38/1992, art. 65',
    },
  ],
};

const SECCIONS: Seccio[] = [
  SISTEMA_ACTUAL,
  SISTEMA_PROVINCIAL,
  ESPECIALS,
  OFICIALS_FCS,
  DIPLOMATIQUES,
  COLORS,
  ESTRANGERES,
  ACTUACIO,
];

export default function Matricules() {
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          {t('operativa.matricules.title')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5 mb-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">🔢</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400">
              {t('operativa.title')}
            </div>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {t('operativa.matricules.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('operativa.matricules.desc')}
            </p>
          </div>
        </div>
      </header>

      {/* Índex ràpid amb anchors */}
      <nav className="rounded-xl border p-3 mb-5 text-sm
        border-slate-200 bg-slate-50/60
        dark:border-white/10 dark:bg-white/5">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          {t('operativa.matricules.indexLabel')}
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {SECCIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-slate-700 dark:text-slate-200 hover:underline">
                <span aria-hidden className="mr-1">{s.icona}</span>
                {s.titol}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-5">
        {SECCIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="rounded-2xl border overflow-hidden scroll-mt-20
              border-slate-200 bg-white
              dark:border-white/10 dark:bg-[#0f1d34]"
          >
            <header className="flex items-start gap-3 px-5 py-4 border-b border-slate-200/70 dark:border-white/10">
              <span aria-hidden className="text-2xl shrink-0">{s.icona}</span>
              <div className="min-w-0">
                <h2 className="font-bold text-base sm:text-lg leading-tight">{s.titol}</h2>
                {s.intro && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {s.intro}
                  </p>
                )}
              </div>
            </header>
            <ul className="divide-y divide-slate-200/70 dark:divide-white/10">
              {s.items.map((it, i) => (
                <li key={i} className="px-5 py-3">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <code className="rounded-md border px-1.5 py-0.5 text-xs font-mono font-bold
                      border-amber-200 bg-amber-50 text-amber-900
                      dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200">
                      {it.codi}
                    </code>
                    {it.base && (
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {it.base}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    {it.desc}
                  </p>
                </li>
              ))}
            </ul>
            {s.base_legal && s.base_legal.length > 0 && (
              <div className="px-5 py-2.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
                <span className="uppercase tracking-wider mr-2">Base:</span>
                {s.base_legal.join(' · ')}
              </div>
            )}
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center">
        {t('operativa.matricules.disclaimer')}
      </p>
    </div>
  );
}
