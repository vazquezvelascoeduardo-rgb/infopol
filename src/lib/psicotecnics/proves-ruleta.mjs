// Proves de la ruleta.
//
// Aquí el que pot sortir malament no és la geometria —no n'hi ha— sinó el
// raonament: que l'ítem tingui més d'una resposta defensable. Per això les
// comprovacions van per dos camins que no es toquen:
//
//  1. Es LLEGEIX el dibuix. Del SVG en surten les figures i els colors de la
//     volta, es dedueix el patró des de zero i es mira què hauria d'anar al
//     forat. Si el dibuix i el que diu el programa no coincidissin, aquí es
//     veuria: passa pel dibuix, que és l'únic que veu qui fa l'examen.
//
//  2. La unicitat es comprova al revés. El programa dedueix la resposta
//     mirant el que es veu; la prova, en canvi, prova TOTES les respostes
//     possibles: tapa el forat amb cadascuna i mira si queda una volta que
//     algun període expliqui sencera. Si més d'una candidata s'aguanta,
//     l'ítem té dues respostes i no pot sortir.
import * as R from './ruleta.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

// ── Llegir el dibuix ─────────────────────────────────────────────
// Cada forma té un nombre de vèrtexs que només té ella, o sigui que del SVG
// se sap quina és sense haver de fiar-se de cap etiqueta.
const PER_VERTEXS = { 3: 'triangle', 4: 'rombe', 6: 'hexagon', 10: 'estrella', 12: 'creu' };
const PER_PINTA = Object.fromEntries(R.COLORS.map((c) => [c.pinta, c.id]));

function llegeixVolta(svg) {
  const vb = svg.match(/viewBox="0 0 ([\d.]+) /);
  const c = Number(vb[1]) / 2;
  const peces = [];

  for (const m of svg.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="[-\d.]+" fill="([^"]+)"/g)) {
    if (PER_PINTA[m[3]]) peces.push({ x: +m[1], y: +m[2], forma: 'cercle', color: PER_PINTA[m[3]] });
  }
  for (const m of svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="[-\d.]+" fill="([^"]+)"/g)) {
    if (PER_PINTA[m[4]]) {
      peces.push({ x: +m[1] + +m[3] / 2, y: +m[2] + +m[3] / 2, forma: 'quadrat', color: PER_PINTA[m[4]] });
    }
  }
  for (const m of svg.matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)) {
    const punts = m[1].trim().split(/\s+/).map((p) => p.split(',').map(Number));
    const forma = PER_VERTEXS[punts.length];
    if (!forma || !PER_PINTA[m[2]]) continue;
    peces.push({
      x: punts.reduce((s, p) => s + p[0], 0) / punts.length,
      y: punts.reduce((s, p) => s + p[1], 0) / punts.length,
      forma, color: PER_PINTA[m[2]],
    });
  }
  // El forat: el rodonet blanc de ratlles.
  const buit = svg.match(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="[-\d.]+" fill="#fff"/);
  if (buit) peces.push({ x: +buit[1], y: +buit[2], forma: null, color: null });

  // Ordenades com es llegeixen: des de dalt de tot i cap a la dreta.
  //
  // Es mira a quin SECTOR cau cada figura, no l'angle pelat, i per això se
  // n'hi suma mig abans de donar la volta. La de dalt de tot té l'angle just
  // a zero, i com que les coordenades del dibuix van escrites amb un decimal,
  // el seu centre pot quedar cinc centèsimes a l'esquerra de l'eix: llavors
  // l'angle no és zero sinó una mica menys, i en donar la volta se'n va a
  // 2π, o sigui al final de la llista, i tota la volta queda desplaçada una
  // posició. Amb mig sector de coixí això no pot passar: el marge és de
  // quinze graus i l'error, de mil·lèsimes.
  const sector = (2 * Math.PI) / peces.length;
  const angle = (p) => {
    const a = Math.atan2(p.y - c, p.x - c) + Math.PI / 2 + sector / 2;
    return (a + 2 * Math.PI) % (2 * Math.PI);
  };
  return peces.sort((a, b) => angle(a) - angle(b));
}

/** Un període que expliqui la llista sencera, sense forats. */
const teMenaDePeriode = (llista, p) =>
  llista.every((v, i) => v === llista[i % p]);

titol('1. El dibuix diu el mateix que el programa');
{
  for (let seed = 1; seed <= 120; seed++) {
    const it = R.generaItem(seed);
    cal('surt ítem', it !== null, `llavor ${seed}`);
    if (!it) continue;
    const volta = llegeixVolta(R.svgEnunciat(it));
    cal('al dibuix hi ha totes les posicions', volta.length === it.n,
      `llavor ${seed}: ${volta.length} de ${it.n}`);
    if (volta.length !== it.n) continue;
    cal('i un sol forat', volta.filter((p) => p.forma === null).length === 1, `llavor ${seed}`);
    cal('el forat és on toca', volta.findIndex((p) => p.forma === null) === it.forat,
      `llavor ${seed}: dibuixat a ${volta.findIndex((p) => p.forma === null)}, `
      + `el programa diu ${it.forat}`);
    for (let i = 0; i < it.n; i++) {
      if (i === it.forat) continue;
      cal('cada figura dibuixada és la que toca', volta[i].forma === it.formes[i],
        `llavor ${seed}, posició ${i}`);
      cal('i del color que toca', volta[i].color === it.colors[i],
        `llavor ${seed}, posició ${i}`);
    }
  }
}

titol('2. Resolt des del dibuix, sense mirar què diu el programa');
{
  for (let seed = 1; seed <= 200; seed++) {
    const it = R.generaItem(seed);
    if (!it) continue;
    const volta = llegeixVolta(R.svgEnunciat(it));
    const forat = volta.findIndex((p) => p.forma === null);
    const formes = volta.map((p) => p.forma);
    const colors = volta.map((p) => p.color);

    // El període més petit que expliqui tot el que es veu. Es dedueix aquí,
    // de zero, sense fer servir res del programa.
    const menor = (llista) => {
      for (let p = 1; p <= Math.floor(llista.length / 2); p++) {
        let va = true;
        for (let i = 0; i < llista.length && va; i++) {
          if (i === forat) continue;
          const j = i % p;
          // Busca una altra posició del mateix residu per comparar.
          for (let k = j; k < llista.length; k += p) {
            if (k === forat || k === i) continue;
            if (llista[k] !== llista[i]) va = false;
          }
        }
        if (va) return p;
      }
      return null;
    };
    const pf = menor(formes), pc = menor(colors);
    cal('es troba un període de formes', pf !== null, `llavor ${seed}`);
    cal('i un de colors', pc !== null, `llavor ${seed}`);
    if (pf === null || pc === null) continue;

    // Amb el període a la mà, què hi ha d'anar al forat.
    const del = (llista, p) => {
      for (let k = forat % p; k < llista.length; k += p) if (k !== forat) return llista[k];
      return null;
    };
    const formaToca = del(formes, pf), colorToca = del(colors, pc);
    const bona = it.opcions[it.correcta];
    cal('la figura marcada és la que demana el patró',
      bona.forma === formaToca && bona.color === colorToca,
      `llavor ${seed}: el dibuix demana ${formaToca}/${colorToca} `
      + `i està marcada ${bona.forma}/${bona.color}`);
    cal('i cap altra opció no la demana',
      it.opcions.filter((o) => o.forma === formaToca && o.color === colorToca).length === 1,
      `llavor ${seed}`);
  }
}

titol('3. Una sola resposta s\'aguanta, tapant el forat amb cadascuna');
{
  for (let seed = 1; seed <= 200; seed++) {
    const it = R.generaItem(seed);
    if (!it) continue;
    // Totes les figures i colors que surten a la volta són candidats, no
    // només els de les opcions: si algun altre s'aguantés, l'ítem seria
    // discutible encara que aquell no aparegués a sota.
    const formesVistes = [...new Set(it.formes.filter((_, i) => i !== it.forat))];
    const colorsVistos = [...new Set(it.colors.filter((_, i) => i !== it.forat))];

    const aguanten = (llista, vistos) => vistos.filter((v) => {
      const ple = [...llista]; ple[it.forat] = v;
      for (let p = 1; p <= Math.floor(ple.length / 2); p++) {
        if (teMenaDePeriode(ple, p)) return true;
      }
      return false;
    });

    const f = aguanten(it.formes, formesVistes);
    const c = aguanten(it.colors, colorsVistos);
    cal('només una figura s\'aguanta', f.length === 1, `llavor ${seed}: ${f.join('/')}`);
    cal('només un color s\'aguanta', c.length === 1, `llavor ${seed}: ${c.join('/')}`);
    const bona = it.opcions[it.correcta];
    cal('i són les marcades', f[0] === bona.forma && c[0] === bona.color, `llavor ${seed}`);
  }
}

const N = 250;
titol(`4. ${N} ítems: forma de l'ítem i repartiment`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = R.generaItem(seed);
  cal('surt ítem', it !== null, `llavor ${seed}`);
  if (!it) continue;
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }
  cal('una sola opció coincideix', it.control.quantesCoincideixen === 1,
    `llavor ${seed}: ${it.control.quantesCoincideixen}`);
  cal('quatre opcions', it.opcions.length === 4, `llavor ${seed}`);
  cal('cap opció repetida',
    new Set(it.opcions.map((o) => `${o.forma}/${o.color}`)).size === 4, `llavor ${seed}`);
  // Ni la figura ni el color de cap opció es poden descartar de bones a
  // primeres per no sortir a la volta.
  cal('totes les figures de les opcions surten a la volta',
    it.opcions.every((o) => it.formes.includes(o.forma)), `llavor ${seed}`);
  cal('i tots els colors també',
    it.opcions.every((o) => it.colors.includes(o.color)), `llavor ${seed}`);
  // Les tres dolentes ho són cadascuna pel seu motiu.
  const bona = it.opcions[it.correcta];
  const dolentes = it.opcions.filter((_, i) => i !== it.correcta);
  cal('n\'hi ha una amb la figura bona i el color canviat',
    dolentes.some((o) => o.forma === bona.forma && o.color !== bona.color), `llavor ${seed}`);
  cal('una amb el color bo i la figura canviada',
    dolentes.some((o) => o.color === bona.color && o.forma !== bona.forma), `llavor ${seed}`);
  cal('i una que falla en tots dos',
    dolentes.some((o) => o.color !== bona.color && o.forma !== bona.forma), `llavor ${seed}`);
  cal('el forat no és de les dues primeres posicions', it.forat >= 2, `llavor ${seed}`);
  cal('la volta té entre dotze i vint-i-quatre figures',
    it.n >= 12 && it.n <= 24, `llavor ${seed}: ${it.n}`);
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('5. Varietat i dibuix');
{
  const vistes = new Set();
  for (let seed = 1; seed <= 400; seed++) {
    const it = R.generaItem(seed);
    if (it) vistes.add(it.formes.join(',') + '|' + it.colors.join(',') + '|' + it.forat);
  }
  cal('dos-cents ítems diferents com a mínim', vistes.size >= 200, `${vistes.size}`);
  console.log(`  ${vistes.size} ruletes diferents de 400 llavors`);

  const it = R.generaItem(1);
  const e = R.svgEnunciat(it), o = R.svgOpcio(it, 0);
  cal('l\'enunciat és un SVG sencer', e.startsWith('<svg') && !/NaN|undefined/.test(e));
  cal('l\'opció també', o.startsWith('<svg') && !/NaN|undefined/.test(o));
  cal('porten viewBox', e.includes('viewBox') && o.includes('viewBox'));
  cal('el full surt sencer', !/NaN|undefined/.test(R.svgFull([1, 2, 3].map((s) => R.generaItem(s)))));

  // Les figures de la volta no s'han de tocar entre elles: si es toquessin,
  // la ruleta es llegiria malament. Es mira la distància entre veïnes.
  for (let seed = 1; seed <= 60; seed++) {
    const item = R.generaItem(seed);
    const volta = llegeixVolta(R.svgEnunciat(item));
    for (let i = 0; i < volta.length; i++) {
      const a = volta[i], b = volta[(i + 1) % volta.length];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      cal('les figures veïnes no es toquen', d > 12,
        `llavor ${seed}, entre ${i} i ${i + 1}: ${d.toFixed(1)}`);
    }
  }
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
