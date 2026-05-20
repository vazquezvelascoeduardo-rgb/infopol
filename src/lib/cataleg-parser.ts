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
  // Codi curt de la llei/reglament (lsv, rgc, rgcond, rgv, seg, vel).
  lawId: string;
  lawShort: string; // "LSV"
  lawFull: string; // "Llei de Seguretat Vial — RDL 6/2015"
  // Títol de la secció dins de la llei (p.ex. "Assegurança obligatòria
  // de Responsabilitat Civil (RDL 8/2004 art. 2.1)"). Pot ser undefined
  // si la fila no té secció.
  sectionTitle?: string;
  // Subgrup dins d'una secció (p.ex. "Conductors generals majors d'edat"
  // dins del barem d'alcoholèmia). Només present a les taules de barems.
  subgroup?: string;
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
  // Text combinat per a la cerca (sense accents, minúscules), inclou
  // sectionTitle i subgroup perquè el filtre els tingui en compte.
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
  vel: {
    short: 'Barems',
    full: "Barems sancionadors (velocitat / alcoholèmia)",
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

// Mapeig dels nous IDs dels tab-panels (rebrand 2026 — `p-XX`) als
// codis interns que conserva l'app (per a getLawColor, agrupació al
// SuperBuscador, etc.). p-cond → rgcond i p-bar → vel mantenen els
// noms històrics; p-res és només resum visual i no s'indexa.
//
// p-vmp (Comunicat 6/2026) s'indexa però les seves filades sovint
// dupliquen continguts d'altres panels (LSV/RGC/RGV/Asseg.). Per
// això al final fem una deduplicació per (lawId, article, concepte).
const PANEL_TO_LAW_ID: Record<string, string> = {
  'p-lsv': 'lsv',
  'p-rgc': 'rgc',
  'p-cond': 'rgcond',
  'p-rgv': 'rgv',
  'p-seg': 'seg',
  'p-vmp': 'rgv', // les infraccions VMP són majoritàriament del RGV (art. 22)
  'p-bar': 'vel',
  'p-cp': 'cp',
};

function detectSeverityFromTr(tr: Element): Severity | undefined {
  // Rebrand 2026: <tr class="row-mg|row-g|row-l"> + <span class="sev sev-mg|sev-g|sev-l">.
  const cls = (tr as HTMLElement).className || '';
  if (/\brow-mg\b/.test(cls)) return 'MG';
  if (/\brow-g\b/.test(cls)) return 'G';
  if (/\brow-l\b/.test(cls)) return 'L';
  if (tr.querySelector('.sev-mg')) return 'MG';
  if (tr.querySelector('.sev-g')) return 'G';
  if (tr.querySelector('.sev-l')) return 'L';
  return undefined;
}

// Extreu un valor "net" (text trim, sense salts de línia múltiples).
function clean(s: string | null | undefined): string {
  return (s ?? '').replace(/\s+/g, ' ').trim();
}

// Indexa una taula `tbl` estàndard. Cada `<tr>` té 6 columnes:
//   [Concepte, Art., N (severity pill), €, DTE, PTS]
function indexStandardTable(
  table: Element,
  ctx: { lawId: string; meta: { short: string; full: string }; sTitle: string; subgroup?: string; rows: CatalegRow[] },
): void {
  const trs = Array.from(table.querySelectorAll('tbody tr'));
  for (const tr of trs) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 2) continue;
    const conceptCell = tds[0] as HTMLElement;
    const concepte = clean(conceptCell.textContent);
    if (!concepte || concepte.length < 4) continue;

    const article = clean(tds[1]?.textContent);
    const severity = detectSeverityFromTr(tr);
    // Multa: cerca .eur-pill dins la cel·la 3 (col-eur), si no, prén
    // el text complet de la cel·la.
    const fineCell = tds[3] as HTMLElement | undefined;
    let fine: string | undefined;
    if (fineCell) {
      const pill = fineCell.querySelector('.eur-pill');
      fine = clean(pill?.textContent ?? fineCell.textContent) || undefined;
    }
    const dte = tds[4] ? clean(tds[4].textContent) : undefined;
    let points: string | undefined;
    if (tds[5]) {
      const ptCell = tds[5] as HTMLElement;
      const ptBox = ptCell.querySelector('.ptbox');
      const t = clean(ptBox?.textContent ?? ptCell.textContent);
      if (t && t !== '—') points = t;
    }
    ctx.rows.push({
      lawId: ctx.lawId,
      lawShort: ctx.meta.short,
      lawFull: ctx.meta.full,
      sectionTitle: ctx.sTitle || undefined,
      subgroup: ctx.subgroup,
      concepte,
      conceptHtml: conceptCell.innerHTML,
      article: article || undefined,
      severity,
      fine: fine && fine !== '—' ? fine : undefined,
      dte: dte && dte !== '—' ? dte : undefined,
      points,
      searchText: normalize(
        `${ctx.sTitle} ${ctx.subgroup ?? ''} ${concepte} ${article ?? ''} ${fine ?? ''} ${ctx.meta.short} ${ctx.meta.full}`,
      ),
    });
  }
}

// Indexa una `.alc-card` (barem alcoholèmia o cards similars). Cada
// `.alc-row` té 3 spans: [concepte, eur-pill (multa), ptbox/text (pts)].
function indexAlcCard(
  card: Element,
  ctx: { lawId: string; meta: { short: string; full: string }; sTitle: string; rows: CatalegRow[] },
): void {
  const subgroup = clean(card.querySelector('.alc-title')?.textContent);
  for (const row of Array.from(card.querySelectorAll('.alc-row'))) {
    const spans = row.querySelectorAll(':scope > span');
    if (spans.length < 2) continue;
    const concepte = clean(spans[0].textContent);
    if (!concepte || concepte.length < 3) continue;
    const fineEl = spans[1] as HTMLElement;
    const fine = clean(fineEl.textContent);
    let points: string | undefined;
    if (spans[2]) {
      const t = clean(spans[2].textContent);
      if (t && t !== '—') points = t;
    }
    // Severity inferida per la classe `heavy` del `.eur-pill` (multa alta).
    let severity: Severity | undefined;
    if (fineEl.classList.contains('heavy')) severity = 'MG';
    else if (fineEl.classList.contains('eur-pill')) severity = 'G';
    ctx.rows.push({
      lawId: ctx.lawId,
      lawShort: ctx.meta.short,
      lawFull: ctx.meta.full,
      sectionTitle: ctx.sTitle || undefined,
      subgroup: subgroup || undefined,
      concepte,
      conceptHtml: concepte,
      severity,
      fine: fine || undefined,
      points,
      searchText: normalize(
        `${ctx.sTitle} ${subgroup} ${concepte} ${fine ?? ''} ${ctx.meta.short} ${ctx.meta.full}`,
      ),
    });
  }
}

// Indexa el bloc `.ass-list` d'Assegurança Obligatòria (RDL 8/2004).
// Cada `.ass-row` té un `<strong>` amb el concepte i `.ass-meta` amb
// dos `.eur-pill` (multa + DTE).
function indexAssList(
  list: Element,
  ctx: { lawId: string; meta: { short: string; full: string }; sTitle: string; rows: CatalegRow[] },
): void {
  // Article comú a la secció ("2.1") deduït del títol.
  const artMatch = ctx.sTitle.match(/art\.?\s*([\d.]+)/i);
  const sectionArticle = artMatch ? artMatch[1] : undefined;
  for (const row of Array.from(list.querySelectorAll('.ass-row'))) {
    const strong = row.querySelector('strong');
    const concepte = clean(strong?.textContent ?? row.textContent);
    if (!concepte) continue;
    const pills = row.querySelectorAll('.ass-meta .eur-pill');
    const fineEl = pills[0] as HTMLElement | undefined;
    const dteEl = pills[1] as HTMLElement | undefined;
    const fine = fineEl ? clean(fineEl.textContent) : undefined;
    const dte = dteEl ? clean(dteEl.textContent) : undefined;
    let severity: Severity | undefined;
    if (fineEl?.classList.contains('heavy') || row.classList.contains('heavy')) severity = 'MG';
    else if (fine) severity = 'G';
    ctx.rows.push({
      lawId: ctx.lawId,
      lawShort: ctx.meta.short,
      lawFull: ctx.meta.full,
      sectionTitle: ctx.sTitle || undefined,
      concepte,
      conceptHtml: strong?.innerHTML ?? concepte,
      article: sectionArticle,
      severity,
      fine,
      dte,
      searchText: normalize(
        `${ctx.sTitle} ${concepte} ${sectionArticle ?? ''} ${fine ?? ''} ${ctx.meta.short} ${ctx.meta.full}`,
      ),
    });
  }
}

// Indexa un `.delicte-block` del Codi Penal. Cada bloc té un títol
// (`.delicte-head .ttl`) i un o més `.delicte-cells` (subdelictes).
function indexDelicteBlock(
  block: Element,
  ctx: { lawId: string; meta: { short: string; full: string }; rows: CatalegRow[] },
): void {
  const ttl = clean(block.querySelector('.delicte-head .ttl')?.textContent);
  // Extreu article (p.ex. "Art. 379 CP" → "379").
  const artMatch = ttl.match(/art\.?\s*(\d+(?:\.\d+)?)/i);
  const article = artMatch ? artMatch[1] : undefined;
  // Severity del badge de la capçalera.
  let severity: Severity | undefined;
  const sevEl = block.querySelector('.delicte-head .sev');
  if (sevEl) {
    if (sevEl.classList.contains('sev-mg')) severity = 'MG';
    else if (sevEl.classList.contains('sev-g')) severity = 'G';
    else if (sevEl.classList.contains('sev-l')) severity = 'L';
  }
  // Cada `.delicte-cells` és un subdelicte amb la seva descripció i penes.
  for (const cell of Array.from(block.querySelectorAll('.delicte-cells'))) {
    const descEl = cell.querySelector('.desc') as HTMLElement | null;
    const concepte = clean(descEl?.textContent);
    if (!concepte || concepte.length < 6) continue;
    const penas = Array.from(cell.querySelectorAll('.penas .pena'))
      .map((p) => clean(p.textContent))
      .filter(Boolean);
    const fine = penas.find((p) => /multa/i.test(p));
    ctx.rows.push({
      lawId: ctx.lawId,
      lawShort: ctx.meta.short,
      lawFull: ctx.meta.full,
      sectionTitle: ttl || undefined,
      concepte,
      conceptHtml: descEl?.innerHTML ?? concepte,
      article,
      severity,
      fine,
      // Per als delictes "punts" no aplica i "DTE" tampoc — només la
      // pena composada queda al subgrup per a context.
      subgroup: penas.length > 0 ? penas.join(' · ') : undefined,
      searchText: normalize(
        `${ttl} ${concepte} ${article ?? ''} ${penas.join(' ')} ${ctx.meta.short} ${ctx.meta.full}`,
      ),
    });
  }
}

export function getCatalegRows(): CatalegRow[] {
  if (cachedRows) return cachedRows;
  if (typeof DOMParser === 'undefined') return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(catalegRaw, 'text/html');
  const rows: CatalegRow[] = [];

  // Iterem cada panel `.cat-panel` (id="p-XX") i dins cada `.sec`.
  // Capturem el `.sec-head` i el propaguem a totes les filades.
  const panels = doc.querySelectorAll('[id^="p-"]');
  for (const panel of Array.from(panels)) {
    const panelId = (panel as HTMLElement).id;
    const lawId = PANEL_TO_LAW_ID[panelId];
    if (!lawId) continue; // p-res o desconegut → no s'indexa
    const meta = LAW_META[lawId];
    if (!meta) continue;

    // (CP) Els delictes són blocs de tipus `.delicte-block`, fora de
    // qualsevol `.sec` formal. Tractem-los a part.
    if (lawId === 'cp') {
      for (const block of Array.from(panel.querySelectorAll('.delicte-block'))) {
        indexDelicteBlock(block, { lawId, meta, rows });
      }
      continue;
    }

    const sections = panel.querySelectorAll('.sec');
    for (const section of Array.from(sections)) {
      const sTitle = clean(section.querySelector('.sec-head')?.textContent);

      // Algunes seccions intercalen `.sec-sub` com a divisor entre
      // taules. Caminem fills directes per propagar el subgrup actual
      // a la taula següent.
      let subgroup: string | undefined;
      for (const child of Array.from(section.children)) {
        if (child.classList.contains('sec-sub')) {
          subgroup = clean(child.textContent) || undefined;
          continue;
        }
        // (a) Taules tbl
        if (child.tagName === 'TABLE' && child.classList.contains('tbl')) {
          indexStandardTable(child, { lawId, meta, sTitle, subgroup, rows });
          continue;
        }
        // Algunes taules van embolcallades en un wrapper (overflow-x).
        // Iterem `.tbl` recursius dins el child.
        for (const t of Array.from(child.querySelectorAll('table.tbl'))) {
          indexStandardTable(t, { lawId, meta, sTitle, subgroup, rows });
        }
        // (b) Cards d'alcoholèmia i similars
        for (const card of Array.from(child.querySelectorAll('.alc-card'))) {
          indexAlcCard(card, { lawId, meta, sTitle, rows });
        }
        if (child.classList.contains('alc-card')) {
          indexAlcCard(child, { lawId, meta, sTitle, rows });
        }
        // (c) Llista d'assegurança obligatòria
        if (child.classList.contains('ass-list')) {
          indexAssList(child, { lawId, meta, sTitle, rows });
        }
      }
    }
  }

  // Deduplicació final: una mateixa infracció pot aparèixer a la pestanya
  // origen (LSV/RGC/RGV/Asseg.) i també al panel resum p-vmp/p-res. Si la
  // clau (lawId, article normalitzat, concepte normalitzat) és la mateixa,
  // ens quedem amb la primera ocurrència — la dels panels canònics. Així
  // el SuperBuscador no mostra duplicats però sí guanya cobertura.
  const seen = new Set<string>();
  const deduped: CatalegRow[] = [];
  for (const r of rows) {
    const key = `${r.lawId}|${normalize(r.article ?? '')}|${normalize(r.concepte).slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(r);
  }

  cachedRows = deduped;
  return deduped;
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
