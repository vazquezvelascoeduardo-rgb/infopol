// Parser i índex del catàleg d'infraccions de trànsit (SCT 2026).
//
// El catàleg viu com a HTML dins de
//   /content/transit/cataleg-d-infraccions-de-transit-sct-2026.ca.html
// i organitza cents de filades en pestanyes (LSV, RGC, RGCond, RGV,
// Asseguranca, Velocitat, CP). El SuperBuscador necessita cercar
// transversalment per totes les pestanyes alhora.
//
// Estratègia: parseig amb DOMParser a la primera consulta (lazy) i
// cache. Cada filada es transforma en un objecte estructurat amb
// concepte, article, gravetat, multa, DTE i punts.

import catalegRaw from '../../content/transit/cataleg-d-infraccions-de-transit-sct-2026.ca.html?raw';

export type Severity = 'MG' | 'G' | 'L';

export type CatalegRow = {
  // Codi curt de la llei/reglament (lsv, rgc, rgcond, rgv, seg).
  lawId: string;
  lawShort: string; // "LSV"
  lawFull: string; // "Llei de Seguretat Vial — RDL 6/2015"
  // Concepte sancionat (text pla, sense HTML).
  concepte: string;
  // Mateix concepte amb HTML original (per a renderitzar amb <strong>).
  conceptHtml: string;
  // Article concret ("14.1", "47.A", "76.l"…).
  article?: string;
  // Gravetat: MG (Molt greu), G (Greu), L (Lleu).
  severity?: Severity;
  // Multa expressada (sol ser un número en euros, p.ex. "500", "1.000",
  // "Veure barem"…).
  fine?: string;
  // Pagament voluntari descomptat ("DTE" — generalment 50% de la multa).
  dte?: string;
  // Punts retirats (p.ex. "-4", "-6", o buit si no n'hi ha).
  points?: string;
  // Text combinat per a la cerca (sense accents, minúscules).
  searchText: string;
};

// Etiquetes humanes per a cada pestanya.
const LAW_META: Record<string, { short: string; full: string }> = {
  lsv: {
    short: 'LSV',
    full: 'Llei de Seguretat Vial (RDL 6/2015)',
  },
  rgc: {
    short: 'RGC',
    full: 'Reglament General de Circulació (RD 1428/2003)',
  },
  rgcond: {
    short: 'RG Cond.',
    full: 'Reglament General de Conductors (RD 818/2009)',
  },
  rgv: {
    short: 'RGV',
    full: 'Reglament General de Vehicles (RD 2822/1998)',
  },
  seg: {
    short: 'Asseg.',
    full: "Assegurança obligatòria — RDL 8/2004",
  },
  cp: {
    short: 'CP',
    full: 'Codi Penal (delictes contra la seguretat viària)',
  },
};

let cachedRows: CatalegRow[] | null = null;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // Apòstrofs i altres signes que parteixen paraules: els convertim
    // en espai per a què "d'assegurança" coincideixi amb "assegurança".
    .replace(/['''`·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectSeverity(tr: Element): Severity | undefined {
  if (tr.querySelector('.pill-MG')) return 'MG';
  if (tr.querySelector('.pill-G')) return 'G';
  if (tr.querySelector('.pill-L')) return 'L';
  return undefined;
}

// Extreu un valor "net" (text trim, sense salts de línia múltiples).
function clean(s: string | null | undefined): string {
  return (s ?? '').replace(/\s+/g, ' ').trim();
}

export function getCatalegRows(): CatalegRow[] {
  if (cachedRows) return cachedRows;
  if (typeof DOMParser === 'undefined') return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(catalegRaw, 'text/html');
  const rows: CatalegRow[] = [];

  // Iterem totes les pestanyes que tinguin id="tab-XX".
  const tabs = doc.querySelectorAll('[id^="tab-"]');
  for (const tab of Array.from(tabs)) {
    const id = (tab as HTMLElement).id.replace(/^tab-/, '');
    const meta = LAW_META[id];
    if (!meta) continue; // saltem 'rec', 'vel' (no taula estandarditzada)

    // Cerquem totes les taules d'infraccions dins de la pestanya
    // (poden ser-ne diverses per agrupacions temàtiques).
    const tables = tab.querySelectorAll('table');
    for (const table of Array.from(tables)) {
      const trs = table.querySelectorAll('tbody tr');
      for (const tr of Array.from(trs)) {
        const tds = tr.querySelectorAll('td');
        if (tds.length < 2) continue;

        // Concepte (1a cel·la — pot tenir <strong> dintre)
        const conceptCell = tds[0] as HTMLElement;
        const concepte = clean(conceptCell.textContent);
        if (!concepte || concepte.length < 4) continue;

        // Article (2a cel·la)
        const article = clean(tds[1]?.textContent);

        // Gravetat (.pill-XX dins de la fila)
        const severity = detectSeverity(tr);

        // Multa: 4a cel·la — pot ser un nombre, "Veure barem", colspan, etc.
        const fineCell = tds[3];
        let fine: string | undefined;
        if (fineCell) {
          // Si té colspan i diu "veure barem" o similar, agafem el text sencer.
          const f = clean(fineCell.textContent);
          if (f) fine = f;
        }

        // DTE (5a cel·la)
        const dteCell = tds[4];
        const dte = dteCell ? clean(dteCell.textContent) : undefined;

        // Punts (6a cel·la)
        const ptsCell = tds[5];
        let points: string | undefined;
        if (ptsCell) {
          const t = clean(ptsCell.textContent);
          if (t && t !== '—') points = t;
        }

        rows.push({
          lawId: id,
          lawShort: meta.short,
          lawFull: meta.full,
          concepte,
          conceptHtml: conceptCell.innerHTML,
          article: article || undefined,
          severity,
          fine,
          dte,
          points,
          searchText: normalize(`${concepte} ${article ?? ''} ${fine ?? ''} ${meta.short}`),
        });
      }
    }
  }

  cachedRows = rows;
  return rows;
}

// Cerca al catàleg. Match per concepte, article, llei o multa.
// La consulta es normalitza (sense accents, minúscules, sense apòstrofs)
// i s'expandeix amb sinònims abans de filtrar.
export function searchCataleg(query: string): CatalegRow[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const tokens = normalize(q).split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return [];

  // Per cada token, l'expandim al seu grup de sinònims (si en té).
  const expanded = tokens.map(expandToken);

  const all = getCatalegRows();
  return all.filter((r) =>
    // Cada grup ha de tenir AL MENYS un sinònim al text de la fila.
    expanded.every((group) => group.some((syn) => r.searchText.includes(syn))),
  );
}

// ── Sinònims i variacions habituals ──────────────────────────────
//
// Mapeig per a què el buscador entengui paraules quotidianes encara
// que el catàleg les tingui escrites d'una altra manera. Cada grup és
// un conjunt de paraules considerades equivalents per a la cerca.
//
// Exemple: si l'usuari escriu "seguro", buscarem qualsevol fila que
// contingui "assegurança", "asseguranca", "soa", "responsabilitat
// civil", etc.
const SYNONYM_GROUPS: string[][] = [
  // Assegurança
  ['assegurança', 'asseguranca', 'seguro', 'soa', 'responsabilitat civil',
   'responsabilidad civil', 'rc obligatori', 'rc obligatoria'],
  // Mòbil / Telèfon
  ['mòbil', 'mobil', 'movil', 'telèfon', 'telefon', 'telefono',
   'smartphone', 'auricular', 'mans lliures', 'manos libres',
   'pantalla', 'dispositiu manual'],
  // Alcohol
  ['alcohol', 'alcoholèmia', 'alcoholemia', 'alcoholémia',
   'etilòmetre', 'etilometre', 'etilometria', 'beguda',
   'bebida alcoholica', 'bevent', 'borracho', 'borratxo'],
  // Drogues
  ['drogues', 'drogas', 'droga', 'estupefaents', 'estupefacientes',
   'narcòtics', 'narcoticos', 'cocaïna', 'cocaina', 'marihuana',
   'haixix', 'hachis', 'mdma', 'amfetamines', 'amfetaminas',
   'substància', 'substancia', 'tòxic', 'toxic'],
  // Cinturó
  ['cinturó', 'cinturon', 'cinturó de seguretat',
   'cinturon de seguridad', 'retenció', 'retencion'],
  // Casc
  ['casc', 'casco', 'casc moto', 'casco moto'],
  // Velocitat
  ['velocitat', 'velocidad', 'velocitat excessiva',
   'velocidad excesiva', 'excés velocitat', 'exceso velocidad',
   'km/h', 'kmh', 'radar', 'cinemòmetre', 'cinemometre',
   'rapid', 'rapido', 'molt ràpid'],
  // ITV
  ['itv', 'inspecció tècnica', 'inspeccion tecnica',
   'inspecció vehicle', 'fitxa tècnica', 'ficha tecnica'],
  // Permís de conduir
  ['permís', 'permiso', 'permis', 'llicència', 'licencia', 'carnet',
   'carné', 'carne', 'permis conduir', 'permiso conducir',
   'permís de conduir', 'permis a', 'permis b', 'permis am'],
  // VMP / Patinet
  ['vmp', 'patinet', 'patinete', 'patinet electric',
   'patinete electrico', 'scooter', 'segway',
   'vehicle de mobilitat personal'],
  // Bicicleta
  ['bicicleta', 'bici', 'ciclisme', 'ciclista'],
  // Ciclomotor / motocicleta
  ['ciclomotor', 'cyclomotor', 'moto', 'motocicleta', 'motorista'],
  // Documentació
  ['documentació', 'documentacion', 'documents', 'documentos',
   'dni', 'nie', 'passaport', 'pasaporte', 'identificació',
   'identificacion'],
  // Detenció / citació
  ['detenció', 'detencion', 'detingut', 'detenido',
   'citació', 'citacion', 'citar', 'judici ràpid', 'juicio rapido',
   'procediment ràpid'],
  // Multa / sanció
  ['multa', 'sanció', 'sancion', 'denúncia', 'denuncia',
   'butlleta', 'boletin', 'boleta'],
  // Negativa a proves
  ['negativa', 'negar-se', 'negarse', 'no sotmetre',
   'no someter', 'rebutjar', 'rechazar', 'no bufar', 'no soplar'],
  // Llums / tintats
  ['llums', 'luces', 'llum', 'luz', 'fars', 'faros',
   'tintats', 'tintados', 'vidres', 'cristalls', 'cristales'],
  // Vehicle abandonat
  ['abandonat', 'abandonado', 'abandó', 'abandono', 'immobilitzat',
   'inmovilizado', 'grua', 'depòsit', 'deposito'],
  // Accident
  ['accident', 'accidente', 'col·lisió', 'colision', 'topada',
   'choque', 'sinistre', 'siniestro', 'fuga', 'omissió socors',
   'omision socorro'],
  // Documents falsos
  ['fals', 'falso', 'falsa', 'falsificació', 'falsificacion',
   'documentació falsa', 'documentacion falsa', 'doctored',
   'manipulat', 'manipulado'],
  // Temerària / negligent
  ['temerari', 'temerari', 'temerario', 'temeraria',
   'negligent', 'negligente', 'imprudent', 'imprudente',
   'imprudència', 'imprudencia'],
];

// Expandeix un token a tots els seus sinònims (com a substrings
// normalitzats). Si el token no pertany a cap grup, retorna només
// el token mateix.
function expandToken(token: string): string[] {
  const tn = normalize(token);
  const matched = new Set<string>();
  for (const group of SYNONYM_GROUPS) {
    const groupHasMatch = group.some((s) => {
      const sn = normalize(s);
      return sn === tn || sn.includes(tn) || tn.includes(sn);
    });
    if (groupHasMatch) {
      for (const s of group) matched.add(normalize(s));
    }
  }
  matched.add(tn);
  return [...matched];
}

export function getLawColor(lawId: string): string {
  // Colors per llei (per badges/seccions).
  switch (lawId) {
    case 'lsv':
      return '#2563eb'; // blau
    case 'rgc':
      return '#a16207'; // or
    case 'rgcond':
      return '#0891b2'; // cyan
    case 'rgv':
      return '#7c3aed'; // violet
    case 'seg':
      return '#15803d'; // verd
    case 'cp':
      return '#dc2626'; // vermell
    default:
      return '#64748b';
  }
}

export function getCatalegLaws(): Array<{ id: string; short: string; full: string }> {
  return Object.entries(LAW_META).map(([id, m]) => ({ id, ...m }));
}
