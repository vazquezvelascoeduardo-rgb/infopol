// Parser del nomenclàtor SCT 2026 (PDF → JSON estructurat).
//
// Entrada: text pla extret amb `pdftotext -layout` del PDF oficial
//          "SCT Nomenclator 022026.pdf".
// Sortida: src/data/sct-nomenclator.json amb totes les infraccions
//          estructurades, agrupades per llei i secció.

import fs from 'node:fs';
import path from 'node:path';

const RAW_TXT = '_tmp_pdf/sct_nomenclator_raw.txt';
const OUT_JSON = 'src/data/sct-nomenclator.json';

const lines = fs.readFileSync(RAW_TXT, 'utf8').split(/\r?\n/);

// ─── Fronteres de llei ────────────────────────────────────────────
const LAW_MARKERS = [
  { regex: /Reial Decret Legislatiu 6\/2015/, lawId: 'lsv', short: 'TRLSV', full: 'Llei de Seguretat Vial (RDL 6/2015)' },
  { regex: /Reial decret 1428\/2003/, lawId: 'rgc', short: 'RGC', full: 'Reglament General de Circulació (RD 1428/2003)' },
  { regex: /Reial decret 818\/2009/, lawId: 'rgcond', short: 'RGCond', full: 'Reglament General de Conductors (RD 818/2009)' },
  { regex: /Reial decret 2822\/1998/, lawId: 'rgv', short: 'RGV', full: 'Reglament General de Vehicles (RD 2822/1998)' },
  { regex: /RDL 8\/2004|Llei sobre Responsabilitat Civil i Assegurança/, lawId: 'seg', short: 'Asseg.', full: 'RDL 8/2004 · Assegurança obligatòria' },
  { regex: /Reial decret 1295\/2003/, lawId: 'repc', short: 'REPC', full: 'Reglament Escoles de Conductors (RD 1295/2003)' },
];

// Article: dígits + ([.,\-\s] + [dígits|lletra])+ parèntesi tancat opcional.
// Permet "76.G)", "76.Z3)", "129.2 b)" (amb espai), "143. 1-B" (espai + guió),
// "143.1-A", "117.1", "5.4", "10.1"...
const ART = String.raw`(?<art>\d+(?:[\.\s\-][\dA-Za-z]+)*\)?)`;

// Naturalesa
const NAT = String.raw`(?<nat>L|G|MG)`;

// Quantia: número (amb punts/decimals) | "Veure barem" | "NO"
const QTY = String.raw`(?<fine>\d[\d.]*|Veure\s+barem|NO|—)`;

// DTE: número | "NO" | "—" | (buit)
const DTE = String.raw`(?<dte>\d[\d.]*|NO|—)?`;

// Punts: número possiblement amb asterisc ("4*" = excepcional). Buit ok.
const PTS = String.raw`(?<pts>\d+\*?)?`;

// Regex completa: prefix concept + article + N + quantia + dte? + pts?
//
// CRÍTIC: el PDF "menja" els espais entre concepte i article a moltes
// línies (només 1 espai en alguns casos). Per això usem \s+ (1 o més).
// El requeriment fort és que després de l'article hi hagi obligatòriament
// L|G|MG + quantia — això filtra falsos positius (no és casualitat trobar
// un número seguit de L/G/MG seguit d'un altre número).
const ROW_RE = new RegExp(
  `^(?<concept>.+?)\\s+${ART}\\s+${NAT}\\s+${QTY}\\s*${DTE}\\s*${PTS}\\s*$`,
);

// Variant SEG (RDL 8/2004): aquesta llei NO té lletra de naturalesa,
// totes les infraccions són MG implícitament. Format: concept + article + €multa + €dte
const SEG_ROW_RE = new RegExp(
  `^(?<concept>.+?)\\s+${ART}\\s+(?<fine>\\d[\\d.]+)\\s+(?<dte>\\d[\\d.]+)\\s*$`,
);

// Variant "continuació": el concepte ja s'ha emés a la línia anterior amb
// el mateix article, i la línia actual només té N+quantia+dte+pts (variant
// del mateix article). Ex.:
//   "Parar el vehicle"        G   200   100
//   (línia continuació)       G   200   100   4
// Detectem: concept opcional buit/curt + N + quantia. Reutilitzem
// l'article més recent.
const CONT_ROW_RE = new RegExp(
  `^(?<concept>.*?)\\s{3,}${NAT}\\s+${QTY}\\s*${DTE}\\s*${PTS}\\s*$`,
);

// Línies que cal saltar com a soroll/headers tècnics
function isNoiseLine(line) {
  const t = line.trim();
  if (!t) return true;
  if (/^Pàgina \d+ de \d+$/i.test(t)) return true;
  if (/^Barcelona,?\s+\d/i.test(t)) return true;
  if (/^CATÀLEG D[''']INFRACCIONS$/i.test(t)) return true;
  if (/^Concepte de la infracció.*Art\./i.test(t)) return true;
  if (/^50%\s+punts/i.test(t)) return true;
  if (/^Atenció:/i.test(t)) return true;
  if (/^ÍNDEX/i.test(t)) return true;
  return false;
}

// Headers de secció en majúscules (ex: "NORMES SOBRE DROGUES")
function isSectionHeader(line) {
  const t = line.trim();
  if (!t) return false;
  if (/\d/.test(t)) return false;
  const words = t.split(/\s+/);
  if (words.length < 2 || words.length > 12) return false;
  const upper = words.filter((w) => w.length > 1 && w === w.toUpperCase());
  return upper.length >= Math.max(2, Math.floor(words.length * 0.7));
}

// Normalitza l'article: minúscules, sense parèntesi tancat.
function normArticle(art) {
  return art.replace(/\)$/, '').toLowerCase();
}

function clean(s) {
  return s.replace(/\s+/g, ' ').trim();
}

// Verbs d'acció amb què comencen tots els conceptes del nomenclàtor.
// Els fem servir per "trobar el principi real" del concepte quan el
// buffer ha acumulat brossa anterior.
const ACTION_VERBS = [
  'Conduir', 'Circular', 'No ', 'Comportar-se', 'Llençar', 'Dipositar',
  'Crear', 'Parar', 'Estacionar', 'Reali[tz]ar', 'Utilitzar', 'Tenir',
  'Obtenir', 'Portar', 'Transportar', 'Emprar', 'Permetre', 'Incomplir',
  'Negar', 'Posseir', 'Manipular', 'Modificar', 'Reformar', 'Falsificar',
  'Sotmetre', 'Submin', 'Fugir', 'Ocupar', 'Avançar', 'Reincid',
  'Detenir', 'Aturar', 'Atorgar', 'Atribuir', 'Provocar', 'Demanar',
  'Sostre[uo]re', 'Donar', 'Disposar', 'Mostrar', 'Acompanyar',
  'Aban[dt]onar', 'Entrar', 'Sortir', 'Pujar', 'Baixar', 'Iniciar',
  'Comen[çc]ar', 'Acabar', 'Continuar', 'Repetir', 'Mantenir',
  'Anar', 'Travessar', 'Encreuar', 'Ag[au]far', 'Exhibir',
  'Sobrepassar', 'Superar', 'Forçar', 'Vulnerar', 'Trencar', 'Trencar',
  'Pintar', 'Marcar', 'Senyalitzar',
  'Efectuar', 'Realitzar', 'Verificar', 'Atendre', 'Respectar',
  'Subscriure', 'Re[bn]utjar',
];

// Neteja postprocés del concepte: treu números aïllats, prefixos de
// barems escapats al text, i restes de la introducció de la llei.
function cleanConcept(c) {
  let s = c;
  // Treu numerals "1500 750 ", "1000 500 ", etc. (residus de barems)
  s = s.replace(/^(?:\d{2,4}\s+){1,5}/, '');
  // Treu prefixos amb header de la llei.
  s = s.replace(/^(de Motor i Seguretat Viària\.\s*|pel qual s[''']aprova[^.]*\.\s*)/, '');
  // Treu prefixos en majúscules (headers de secció acumulats al buffer).
  s = s.replace(/^([A-ZÀ-ÚÇ·'’]{4,}(?:\s+[A-ZÀ-ÚÇ·'’]+){0,10})\s+/, '');
  // Treu números/lletres aïllats al començament.
  s = s.replace(/^(?:\d+(?:[.,]\d+)*\s+){1,3}/, '');
  // Si el text encara conté brossa abans d'un verb d'acció, talla a l'inici
  // del primer verb conegut. Així "danys als béns 100 Conduir de forma..."
  // → "Conduir de forma...".
  const re = new RegExp(`\\b(${ACTION_VERBS.join('|')})\\b`);
  const idx = s.search(re);
  if (idx > 0) {
    // Si abans del verb hi ha pocs caràcters o sembla brossa numèrica, talla.
    const prefix = s.slice(0, idx).trim();
    if (prefix.length < 60 || /^[\d.,\s\-—()]+$/.test(prefix)) {
      s = s.slice(idx);
    }
  }
  return clean(s);
}

// Estat del parser
let lawId = null;
let lawShort = '';
let lawFull = '';
let sectionTitle = '';
let buffer = []; // text del concepte que s'està acumulant
const rows = [];

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const trimmed = raw.trim();

  // Canvi de llei
  let lawChanged = false;
  for (const m of LAW_MARKERS) {
    if (m.regex.test(trimmed)) {
      lawId = m.lawId;
      lawShort = m.short;
      lawFull = m.full;
      sectionTitle = '';
      buffer = [];
      lawChanged = true;
      break;
    }
  }
  if (lawChanged) continue; // saltem la pròpia línia "Reial decret..."

  if (!lawId) continue;
  if (isNoiseLine(raw)) continue;

  // Línies "frase descriptiva" de la llei (després del canvi): si conté
  // "pel qual s'aprova" o noms llargs de la llei, també les saltem.
  if (/pel qual s[''']aprova|Reglament general de|Llei sobre|Text refós|Catàleg/i.test(trimmed) && trimmed.length > 50) {
    buffer = [];
    continue;
  }

  // Provem regex normal (amb naturalesa L/G/MG)
  let m = ROW_RE.exec(raw);
  let usedSeg = false;
  let usedCont = false;
  if (!m && lawId === 'seg') {
    m = SEG_ROW_RE.exec(raw);
    usedSeg = true;
  }
  // Variant "continuació": només si tenim un article previ disponible.
  if (!m && rows.length > 0 && rows[rows.length - 1].lawId === lawId) {
    m = CONT_ROW_RE.exec(raw);
    if (m) usedCont = true;
  }

  if (m) {
    const g = m.groups;
    const conceptStart = buffer.join(' ').trim();
    const concept = clean(`${conceptStart} ${g.concept || ''}`);
    if (concept.length >= 4 || usedCont) {
      const severity = usedSeg ? 'MG' : g.nat;
      const fine = (g.fine || '').replace(/\s+/g, ' ').trim() || undefined;
      // Per continuacions, reutilitzem l'article de la fila anterior.
      const article = usedCont
        ? rows[rows.length - 1].article
        : normArticle(g.art);
      let finalConcept = concept.length >= 4
        ? cleanConcept(concept)
        : `${rows[rows.length - 1].concepte} · variant`;
      // Si després de netejar queda massa curt, descartem.
      if (finalConcept.length < 8 && !usedCont) {
        buffer = [];
        continue;
      }
      rows.push({
        lawId,
        lawShort,
        lawFull,
        sectionTitle: sectionTitle || undefined,
        concepte: finalConcept,
        article,
        severity,
        fine,
        dte: g.dte || undefined,
        points: g.pts ? g.pts.replace('*', '') : undefined,
      });
    }
    buffer = [];
    continue;
  }

  // Header de secció
  if (isSectionHeader(trimmed)) {
    sectionTitle = trimmed;
    buffer = [];
    continue;
  }

  // Si conté un guió inicial ("- subdivisió de l'article"), és context
  // del concepte previ. Ho acumulem al buffer.
  buffer.push(trimmed);
}

// Estadístiques per llei
const stats = {};
for (const r of rows) {
  stats[r.lawId] = (stats[r.lawId] || 0) + 1;
}

const out = {
  meta: {
    source: 'SCT Nomenclator 022026.pdf',
    importedAt: new Date().toISOString().slice(0, 10),
    totalRows: rows.length,
    perLaw: stats,
  },
  rows,
};

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), 'utf8');

console.log('Total infraccions extretes:', rows.length);
console.log('Per llei:', stats);
console.log('Sortida →', OUT_JSON);
