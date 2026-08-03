// El bloc numèric: la segona pregunta de cada cinc. Aritmètica, tants per
// cent, combinatòria, probabilitat i sèries de números.
//
// És l'únic bloc que es pot comprovar del tot, perquè la resposta no és
// una opinió sinó un càlcul. Aquí m'hi he posat dues regles:
//
//  1. Res de comes flotants. Tot va amb enters i fraccions exactes, i si
//     un enunciat no dona un resultat net, es llença i se'n fa un altre.
//     Un 9,000000000000002 al full de respostes seria un ridícul.
//  2. Cada resposta es torna a comprovar per un camí diferent del que
//     l'ha calculada. Si els dos camins no diuen el mateix, l'ítem no surt.
//     A la probabilitat, el segon camí és comptar els 36 casos un per un.
//
// Els distractors no són números a l'atzar: són el resultat d'equivocar-se
// d'una manera concreta —la regla de tres al revés, el tant per cent del
// que queda en comptes del que s'ha fet, multiplicar en comptes de dividir.
// Per això s'assemblen a la bona, que és el que els fa servir de res.

function rng(seed) {
  let s = (seed * 3266489917) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const entre = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const tria = (r, a) => a[Math.floor(r() * a.length)];
function barreja(r, a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// ── Fraccions exactes ────────────────────────────────────────────
const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = mcd(n, d) || 1; return { n: n / g, d: d / g }; };
// Els milers amb punt, sempre igual. `toLocaleString` depèn de com estigui
// muntat el Node, i el que es genera aquí ha de sortir sempre idèntic.
const num = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const frTxt = (f) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);
const frIgual = (a, b) => a.n === b.n && a.d === b.d;

// ── Muntatge d'un ítem ───────────────────────────────────────────
// Rep la bona i una llista de distractors candidats amb el nom de l'error
// que representen. Es queda amb tres que no coincideixin amb la bona ni
// entre ells. Si no n'hi ha tres de bons, l'ítem no val i es repeteix.
function munta(r, enunciat, bona, candidats, extra = {}) {
  const vistos = new Set([bona]);
  const dolents = [];
  for (const c of barreja(r, candidats)) {
    if (c == null || vistos.has(c.text)) continue;
    vistos.add(c.text); dolents.push(c);
    if (dolents.length === 3) break;
  }
  if (dolents.length < 3) return null;
  const correcta = Math.floor(r() * 4);
  const opcions = [];
  let i = 0;
  for (let k = 0; k < 4; k++) opcions.push(k === correcta ? bona : dolents[i++].text);
  return {
    enunciat, opcions, correcta,
    perque: dolents.map((d) => d.error),
    control: { opcionsDiferents: new Set(opcions).size === 4, ...extra },
  };
}

// ── 1. Proporcionalitat inversa ──────────────────────────────────
// Més gent, menys dies. La feina total —gent × dies— no canvia.
function proporcioInversa(r) {
  const ofici = tria(r, [
    ['pintors', 'pintar una escola sencera'],
    ['paletes', 'aixecar un mur'],
    ['operaris', 'asfaltar un carrer'],
    ['jardiners', 'endreçar tot el parc'],
  ]);
  const n1 = entre(r, 2, 6);
  const extra = entre(r, 1, 8);
  const n2 = n1 + extra;
  const d2 = entre(r, 3, 20);
  const feina = n2 * d2;                    // es tria al revés perquè surti net
  if (feina % n1 !== 0) return null;
  const d1 = feina / n1;
  if (d1 <= d2 || d1 > 120) return null;
  // El segon camí: la feina ha de ser la mateixa comptada de les dues maneres.
  if (n1 * d1 !== n2 * d2) return null;

  const dies = (x) => `${x} dies`;
  return munta(r,
    `${n1} ${ofici[0]} triguen ${d1} dies a ${ofici[1]}. Si en contractem ${extra} més, `
    + 'quant de temps trigaran a fer la mateixa feina?',
    dies(d2),
    [
      Number.isInteger(d1 * n1 / n2) && d1 * n1 / n2 !== d2 ? null : null,
      { text: dies(d1 - extra), error: 'restar els que arriben als dies' },
      Number.isInteger(d1 * n2 / n1) ? { text: dies(d1 * n2 / n1), error: 'regla de tres directa: més gent, més dies' } : null,
      Number.isInteger(d1 / extra) ? { text: dies(d1 / extra), error: 'dividir pels que arriben en comptes del total' } : null,
      { text: dies(d2 + extra), error: 'sumar els que arriben al resultat' },
      { text: dies(Math.round(d1 / 2)), error: 'partir els dies per la meitat' },
      { text: dies(d2 + 1), error: 'un dia de més' },
    ].filter(Boolean),
    { feinaQuadra: n1 * d1 === n2 * d2 });
}

// ── 2. El tant per cent gastat dona el total ─────────────────────
function capacitatPerPercentatge(r) {
  const litres = tria(r, [100, 150, 200, 250, 300, 400, 500]);
  const serveis = entre(r, 2, 6);
  const pct = tria(r, [5, 10, 20, 25, 40, 50]);
  const gastat = litres * serveis;
  if (gastat * 100 % pct !== 0) return null;
  const total = gastat * 100 / pct;
  if (total > 200000) return null;
  if (total * pct / 100 !== gastat) return null;      // segon camí

  const L = (x) => `${num(x)} L`;
  return munta(r,
    `Un camió de bombers gasta ${litres} litres d'aigua a cada servei. Si avui fan `
    + `${serveis} serveis i només han gastat un ${pct}% del dipòsit, quina és la capacitat total?`,
    L(total),
    [
      { text: L(gastat), error: 'donar el que s\'ha gastat, no el total' },
      { text: L(gastat * pct / 100), error: 'aplicar el tant per cent al gastat' },
      { text: L(total / 2), error: 'la meitat del total' },
      { text: L(litres * 100 / pct), error: 'oblidar-se del nombre de serveis' },
      { text: L(gastat + pct * 100), error: 'sumar en comptes de proporcionar' },
      { text: L(total - gastat), error: 'donar el que queda' },
    ],
    { totalQuadra: total * pct / 100 === gastat });
}

// ── 3. Quin tant per cent queda ──────────────────────────────────
function percentatgeRestant(r) {
  const total = tria(r, [50, 60, 80, 100, 120, 150, 200, 250, 300, 400]);
  const fet = tria(r, [2, 4, 5, 6, 10, 12, 15, 20, 25, 30]);
  if (fet >= total) return null;
  if ((total - fet) * 100 % total !== 0) return null;
  const queda = (total - fet) * 100 / total;
  const portat = fet * 100 / total;
  if (queda + portat !== 100) return null;              // segon camí

  const cosa = tria(r, [
    ['L\'actuació d\'un còmic', 'actuant', 'actuació'],
    ['Una guàrdia', 'de servei', 'guàrdia'],
    ['Un curs de tir', 'de pràctiques', 'curs'],
  ]);
  const p = (x) => `${x}%`;
  return munta(r,
    `${cosa[0]} dura ${total} minuts. Si ara en porta ${fet} ${cosa[1]}, quin és el `
    + `percentatge de ${cosa[2]} que resta encara?`,
    p(queda),
    [
      { text: p(portat), error: 'donar el que ja s\'ha fet' },
      { text: p(100 - fet), error: 'restar els minuts com si fossin tants per cent' },
      { text: p(fet), error: 'donar els minuts com a tant per cent' },
      queda !== 80 ? { text: p(80), error: 'un valor rodó qualsevol' } : null,
      { text: p(Math.round(queda / 2)), error: 'la meitat' },
    ].filter(Boolean),
    { sumen100: queda + portat === 100 });
}

// ── 4. Un tant per cent d'un acumulat ────────────────────────────
function percentatgeDeTotal(r) {
  const sou = tria(r, [800, 900, 1000, 1200, 1500, 2000]);
  const mesos = entre(r, 3, 10);
  const pct = tria(r, [5, 10, 15, 20, 25, 30, 40]);
  const estalvi = sou * mesos;
  if (estalvi * pct % 100 !== 0) return null;
  const preu = estalvi * pct / 100;
  if (preu * 100 / pct !== estalvi) return null;        // segon camí

  const e = (x) => `${num(x)} €`;
  return munta(r,
    `El meu sou és de ${num(sou)} euros mensuals. Si porto ${mesos} mesos `
    + `estalviant-lo íntegrament i avui compro un rellotge que val un ${pct}% dels meus estalvis, `
    + 'quants diners val el rellotge?',
    e(preu),
    [
      { text: e(sou * pct / 100), error: 'el tant per cent d\'un sol mes' },
      { text: e(estalvi - preu), error: 'el que queda després de comprar' },
      { text: e(estalvi), error: 'donar tot l\'estalvi' },
      { text: e(preu * 2), error: 'el doble' },
      { text: e(preu / 2 % 1 === 0 ? preu / 2 : preu + 100), error: 'la meitat' },
    ],
    { preuQuadra: preu * 100 / pct === estalvi });
}

// ── 5. Parelles ──────────────────────────────────────────────────
// Cada parella són dues persones i l'ordre no compta: n(n−1)/2.
function parelles(r) {
  const n = entre(r, 6, 16);
  const bona = n * (n - 1) / 2;
  // Segon camí: comptar-les una per una.
  let compte = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) compte++;
  if (compte !== bona) return null;

  const esport = tria(r, ['pàdel', 'tennis', 'dobles de bàdminton']);
  return munta(r,
    `L'organització d'un torneig de ${esport} ens ha demanat ajuda per fer les parelles `
    + `participants. Si tenim un total de ${n} jugadors, quantes parelles diferents podrem fer?`,
    `${bona}`,
    [
      { text: `${n * (n - 1)}`, error: 'comptar l\'ordre: A-B i B-A com a dues' },
      { text: `${n / 2 % 1 === 0 ? n / 2 : n - 1}`, error: 'repartir-los en parelles i prou' },
      { text: `${bona + n}`, error: 'sumar-hi els jugadors' },
      { text: `${n * n}`, error: 'cadascú amb tothom, ell inclòs' },
      { text: `${bona - 1}`, error: 'una de menys' },
    ],
    { comptadesUnaAUna: compte === bona });
}

// ── 6. Probabilitat amb un dau ───────────────────────────────────
// Es compten els casos: sis, un per un. No hi ha fórmula que es pugui
// aplicar malament.
function probabilitatUnDau(r) {
  const k = entre(r, 2, 5);
  const mena = tria(r, ['inferior', 'superior']);
  let favorables = 0;
  for (let c = 1; c <= 6; c++) if (mena === 'inferior' ? c <= k : c >= k) favorables++;
  const bona = fr(favorables, 6);

  const dolents = [];
  for (let f = 0; f <= 6; f++) if (f !== favorables) dolents.push({
    text: frTxt(fr(f, 6)),
    error: `comptar ${f} casos favorables en comptes de ${favorables}`,
  });
  dolents.push({ text: `${favorables}/${6 - favorables || 1}`, error: 'favorables contra contraris' });

  return munta(r,
    `Llancem un dau a l'aire. Quina és la probabilitat de treure un número igual a ${k} o ${mena}?`,
    frTxt(bona), dolents,
    { casosComptats: 6, favorables });
}

// ── 7. Probabilitat amb dos daus ─────────────────────────────────
// La suma. Es compten els 36 casos un per un: és l'única manera de no
// equivocar-se, i de passada serveix de comprovació.
function probabilitatDosDaus(r) {
  const k = entre(r, 3, 10);
  let favorables = 0;
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= k) favorables++;
  const bona = fr(favorables, 36);
  if (favorables === 0 || favorables === 36) return null;

  const dolents = [
    { text: frTxt(fr(36 - favorables, 36)), error: 'el cas contrari' },
    { text: frTxt(fr(favorables, 12)), error: 'comptar dotze casos en comptes de trenta-sis' },
    { text: frTxt(fr(7 - Math.min(6, k - 1), 6)), error: 'fer-ho com si fos un sol dau' },
    { text: frTxt(fr(favorables - 1, 36)), error: 'un cas de menys' },
    { text: frTxt(fr(favorables + 1, 36)), error: 'un cas de més' },
    { text: '1/2', error: 'la meitat, a ull' },
  ].filter((d) => d.text !== frTxt(bona));

  return munta(r,
    `Llancem dos daus a l'aire. Quina és la probabilitat que la suma sigui ${k} o superior?`,
    frTxt(bona), dolents,
    { casosComptats: 36, favorables });
}

// ── 8. Sèries de números ─────────────────────────────────────────
// El perill d'aquesta família és que la sèrie tingui dues explicacions
// bones que donin números diferents: aleshores l'ítem no té resposta. Per
// evitar-ho es prova TOT el catàleg de regles contra els termes que es
// veuen, i si n'hi ha dues que hi encaixen i no coincideixen, es llença.
const REGLES = [];
for (let a = 2; a <= 5; a++) for (let b = -5; b <= 9; b++) {
  REGLES.push({ nom: `×${a}${b >= 0 ? '+' : ''}${b}`, seg: (s) => s[s.length - 1] * a + b, cal: 1 });
}
for (let a = 2; a <= 12; a++) for (let b = 2; b <= 4; b++) {
  REGLES.push({
    nom: `+${a} i ×${b} alternats`,
    seg: (s) => (s.length % 2 ? s[s.length - 1] + a : s[s.length - 1] * b), cal: 1,
  });
}
for (let d = 1; d <= 9; d++) for (let c = 1; c <= 5; c++) {
  REGLES.push({
    nom: `+${d} amb el pas creixent de ${c}`,
    seg: (s) => s[s.length - 1] + d + c * (s.length - 1), cal: 1,
  });
}
REGLES.push({ nom: 'suma dels dos anteriors', seg: (s) => s[s.length - 2] + s[s.length - 1], cal: 2 });

/** Els termes que segueixen una regla, a partir dels primers. */
function desplega(regla, inici, quants) {
  const s = [...inici];
  while (s.length < quants) s.push(regla.seg(s));
  return s;
}

function serieNumerica(r) {
  const regla = tria(r, REGLES);
  const quants = 5 + Math.floor(r() * 2);
  const inici = regla.cal === 2 ? [entre(r, 1, 6), entre(r, 2, 9)] : [entre(r, 1, 12)];
  const plena = desplega(regla, inici, quants + 1);
  const mostrats = plena.slice(0, quants);
  const bona = plena[quants];
  // Números petits, com als exàmens: allà la sèrie més llarga acaba en 971.
  // Una sèrie que se'n va als sis dígits no es resol de cap, es resol amb
  // calculadora, i no és el que es demana.
  if (plena.some((x) => !Number.isInteger(x) || x < 0 || x > 9999)) return null;
  if (new Set(mostrats).size !== mostrats.length) return null;   // res de repetits

  // Totes les regles que expliquen el que es veu han de dir el mateix.
  const encaixen = REGLES.filter((R) => {
    if (mostrats.length <= R.cal) return false;
    const s = desplega(R, mostrats.slice(0, R.cal), quants + 1);
    return s.slice(0, quants).every((x, i) => x === mostrats[i]);
  });
  const seguents = new Set(encaixen.map((R) => desplega(R, mostrats.slice(0, R.cal), quants + 1)[quants]));
  if (seguents.size !== 1 || !seguents.has(bona)) return null;

  const dolents = [
    { text: `${bona + entre(r, 1, 4)}`, error: 'passar-se una mica' },
    { text: `${bona - entre(r, 1, 4)}`, error: 'quedar-se curt' },
    { text: `${mostrats[quants - 1] + (mostrats[quants - 1] - mostrats[quants - 2])}`, error: 'seguir amb la mateixa diferència' },
    { text: `${mostrats[quants - 1] * 2}`, error: 'doblar l\'últim' },
    { text: `${bona + mostrats[0]}`, error: 'sumar-hi el primer terme' },
  ].filter((d) => Number(d.text) > 0 && d.text !== `${bona}`);

  return munta(r,
    `Quin número continua la sèrie?: ${mostrats.join('; ')}…`,
    `${bona}`, dolents,
    { reglesQueEncaixen: encaixen.length, regla: regla.nom });
}

// ── 9. Tant per cent del dia ─────────────────────────────────────
function percentatgeDelDia(r) {
  const objectiu = tria(r, [6, 12, 18, 3, 9, 15, 21]);      // hora del càlcul
  const enrere = tria(r, [1, 1.5, 2, 2.5, 3, 4, 5, 5.5, 6]);
  const ara = objectiu + enrere;
  if (ara >= 24) return null;
  if (objectiu * 100 % 24 !== 0) return null;
  const pct = objectiu * 100 / 24;
  if (pct * 24 / 100 !== objectiu) return null;             // segon camí

  const hm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
  const txtEnrere = enrere % 1
    ? `${Math.floor(enrere)} hores i mitja`
    : `${enrere} ${enrere === 1 ? 'hora' : 'hores'}`;
  const p = (x) => `${x}%`;
  return munta(r,
    `Si ara són les ${hm(ara)}h, quin percentatge del dia portàvem fa ${txtEnrere}?`,
    p(pct),
    [
      { text: p(Math.round(ara * 100 / 24)), error: 'el tant per cent de l\'hora d\'ara' },
      { text: p(100 - pct), error: 'el que quedava de dia' },
      { text: p(objectiu), error: 'donar l\'hora com a tant per cent' },
      { text: p(Math.round(pct / 2)), error: 'la meitat' },
      { text: p(pct === 50 ? 60 : 50), error: 'la meitat del dia, a ull' },
    ],
    { horaQuadra: pct * 24 / 100 === objectiu });
}

// ── Generació ────────────────────────────────────────────────────
export const MENES = {
  proporcio: proporcioInversa,
  capacitat: capacitatPerPercentatge,
  restant: percentatgeRestant,
  percentatge: percentatgeDeTotal,
  parelles,
  dau: probabilitatUnDau,
  daus: probabilitatDosDaus,
  serie: serieNumerica,
  dia: percentatgeDelDia,
};

export function generaItem(seed, mena = null) {
  const r = rng(seed);
  const noms = Object.keys(MENES);
  // La mena es tria una sola vegada i s'insisteix. Si es tornés a triar a
  // cada intent, les menes que fallen més sortirien menys, i el repartiment
  // quedaria tort sense que ningú ho hagués demanat.
  const nom = mena || noms[Math.floor(r() * noms.length)];
  for (let intent = 0; intent < 4000; intent++) {
    const it = MENES[nom](r);
    if (it && it.control.opcionsDiferents) return { seed, mena: nom, ...it };
  }
  throw new Error(`no s'ha pogut generar l'ítem numèric ${seed} (${nom})`);
}

/** Un full per repassar-lo a mà. */
export function textFull(items) {
  return items.map((it, i) => {
    const op = it.opcions.map((o, k) => `   ${'abcd'[k]}) ${o}`).join('');
    return `${i + 1}. ${it.enunciat}\n${op}`;
  }).join('\n\n');
}
