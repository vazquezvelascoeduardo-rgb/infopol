// Proves de taules i gràfics.
//
// La comprovació que compta: es refà el càlcul a partir de les DADES de
// l'ítem —la taula, els trossos del sector, les barres—, que és el mateix
// que té davant qui el resol, i no a partir dels números que les han
// generat. Si el generador hagués calculat amb una cosa i n'hagués dibuixat
// una altra, aquí es veuria.
import * as D from './dades.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const n = (s) => Number(String(s).replace(/\./g, '').replace(/[^\d-]/g, ''));

// Torna a resoldre l'ítac llegint l'enunciat i les dades. Torna null si no
// sap llegir-lo —i aleshores la prova salta, que és el que ha de passar.
function resolDeNou(it) {
  const e = it.enunciat;
  let m;
  if (it.mena === 'taula') {
    const val = Object.fromEntries(it.files.map((f) => [f.nom, f]));
    // Ull amb \w: no agafa la ç ni els accents, i «Març» es quedava fora.
    m = e.match(/«([^»]+)» al total de ([^\s,]+) i ([^\s,]+), i quants com a «([^»]+)» al total de ([^\s,]+) i ([^\s,?]+)/);
    if (m) {
      const colA = m[1] === it.taula.a ? 'a' : 'b';
      const colB = m[4] === it.taula.a ? 'a' : 'b';
      if (!val[m[2]] || !val[m[3]] || !val[m[5]] || !val[m[6]]) return null;
      return `${D.formatNum(val[m[2]][colA] + val[m[3]][colA])} i ${D.formatNum(val[m[5]][colB] + val[m[6]][colB])}`;
    }
    m = e.match(/quina és la diferència entre ([^\s,]+) i ([^\s,?]+)\?/);
    if (m) {
      const di = val[m[1]].a - val[m[1]].b;
      const dj = val[m[2]].a - val[m[2]].b;
      return D.formatNum(Math.abs(di - dj));
    }
    if (/encara no com a/.test(e)) {
      const ta = it.files.reduce((s, f) => s + f.a, 0);
      const tb = it.files.reduce((s, f) => s + f.b, 0);
      return D.formatNum(ta - tb);
    }
    return null;
  }
  if (it.mena === 'sectors') {
    m = e.match(/com a màxim (\d+)/);
    if (m) {
      const fins = Number(m[1]);
      return `${it.dades.slice(0, fins).reduce((a, d) => a + d.pct, 0)}%`;
    }
    m = e.match(/exactament (.+?) o (.+?) al dia/);
    if (m) {
      const i = it.dades.findIndex((d) => d.etiqueta === m[1]);
      const j = it.dades.findIndex((d) => d.etiqueta === m[2]);
      if (i < 0 || j < 0) return null;
      return `${100 - it.dades[i].pct - it.dades[j].pct}%`;
    }
    return null;
  }
  // barres
  m = e.match(/més alta en «([^»]+)» i la més baixa en «([^»]+)»/);
  if (m) {
    const s1 = m[1] === it.series[0] ? 'a' : 'b';
    const s2 = m[2] === it.series[0] ? 'a' : 'b';
    return `${Math.max(...it.gent.map((g) => g[s1])) - Math.min(...it.gent.map((g) => g[s2]))}`;
  }
  m = e.match(/mitjana obtinguda per (.+?) respecte/);
  if (m) {
    const noms = m[1].split(/, | i /).map((x) => x.trim());
    const tria = it.gent.filter((g) => noms.includes(g.nom));
    if (tria.length !== noms.length) return null;
    const m3 = tria.reduce((s, g) => s + g.b, 0) / tria.length;
    const mt = it.gent.reduce((s, g) => s + g.b, 0) / it.gent.length;
    const d = m3 - mt;
    if (d === 0) return '0';
    return `${d > 0 ? '+' : '−'}${String(Math.abs(d)).replace('.', ',')}`;
  }
  return null;
}

const N = 300;
const perMena = {};
const lletres = [0, 0, 0, 0];
let rellegits = 0;

titol(`1. ${N} ítems, refets des de les dades`);
for (let seed = 1; seed <= N; seed++) {
  const it = D.generaItem(seed);
  perMena[it.mena] = (perMena[it.mena] || 0) + 1;
  lletres[it.correcta]++;

  cal('quatre opcions diferents', it.control.opcionsDiferents, `llavor ${seed}`);
  cal('l\'enunciat no té forats', !/undefined|NaN|\$\{/.test(it.enunciat), `llavor ${seed}`);
  cal('cap resposta espatllada',
    it.opcions.every((o) => !/NaN|Infinity|undefined/.test(o)),
    `llavor ${seed}: ${it.opcions.join(' | ')}`);

  if (it.mena === 'sectors') {
    cal('els trossos sumen cent', it.dades.reduce((a, d) => a + d.pct, 0) === 100, `llavor ${seed}`);
    cal('i els valors sumen el total',
      it.dades.reduce((a, d) => a + d.valor, 0) === it.total, `llavor ${seed}`);
    cal('tots els valors són enters', it.dades.every((d) => Number.isInteger(d.valor)), `llavor ${seed}`);
    cal('cap tros ridícul', it.dades.every((d) => d.pct >= 5), `llavor ${seed}`);
  }
  if (it.mena === 'barres') {
    cal('les puntuacions van d\'1 a 10',
      it.gent.every((g) => g.a >= 1 && g.a <= 10 && g.b >= 1 && g.b <= 10), `llavor ${seed}`);
    cal('no hi ha noms repetits',
      new Set(it.gent.map((g) => g.nom)).size === it.gent.length, `llavor ${seed}`);
    // Si la resposta és una mitjana, ha de sortir rodona.
    if (/mitjana/.test(it.enunciat)) {
      const v = it.opcions[it.correcta].replace('−', '-').replace(',', '.');
      cal('la mitjana surt rodona', Math.abs(Number(v) * 2 - Math.round(Number(v) * 2)) < 1e-9,
        `llavor ${seed}: ${it.opcions[it.correcta]}`);
    }
  }
  if (it.mena === 'taula') {
    cal('no hi ha files repetides',
      new Set(it.files.map((f) => f.nom)).size === it.files.length, `llavor ${seed}`);
    cal('tots els números són positius',
      it.files.every((f) => f.a > 0 && f.b > 0), `llavor ${seed}`);
  }

  const meva = resolDeNou(it);
  if (meva !== null) {
    rellegits++;
    cal('la resposta marcada és la que surt de les dades',
      it.opcions[it.correcta] === meva,
      `llavor ${seed} (${it.mena}): diu "${it.opcions[it.correcta]}", en surt "${meva}"`);
    cal('cap altra opció no hi coincideix',
      it.opcions.filter((o) => o === meva).length === 1, `llavor ${seed}`);
  }
}
console.log(`  ${rellegits}/${N} refets des de les dades`);
console.log(`  menes: ${Object.entries(perMena).map(([k, v]) => `${k} ${v}`).join('   ')}`);
cal('s\'han pogut refer tots', rellegits === N, `${rellegits} de ${N}`);

titol('2. Cada mena per separat');
for (const mena of Object.keys(D.MENES)) {
  let ok = 0;
  for (let seed = 500; seed < 560; seed++) {
    const it = D.generaItem(seed, mena);
    cal(`${mena}: la mena demanada`, it.mena === mena);
    if (resolDeNou(it) === it.opcions[it.correcta]) ok++;
  }
  cal(`${mena}: els 60 quadren`, ok === 60, `${mena}: ${ok}/60`);
}

titol('3. La lletra bona, repartida');
console.log(`  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}   (de ${N})`);
cal('cap lletra no es desvia gaire',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('4. El dibuix surt sencer');
{
  const svg = D.svgFull([1, 2, 3, 4, 5, 6].map((s) => D.generaItem(s)));
  cal('cap número espatllat', !/NaN|Infinity|undefined/.test(svg));
  cal('hi ha sis blocs d\'opcions', (svg.match(/>a\) /g) || []).length === 6);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
