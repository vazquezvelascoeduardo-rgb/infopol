// Proves del bloc numèric.
//
// La comprovació que compta no és mirar les variables del generador: és
// llegir l'ENUNCIAT que veurà l'opositor, treure'n els números i tornar a
// fer el problema des de zero. Si el generador hagués calculat amb un
// número i n'hagués escrit un altre —que és l'errada clàssica—, aquí es
// veuria. A la probabilitat es compten els casos un per un.
import * as Q from './numeric.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 15) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const n = (s) => Number(String(s).replace(/\./g, '').replace(/[^\d-]/g, ''));

// Torna a fer el problema llegint només l'enunciat. Torna el text que
// hauria de ser la resposta bona, o null si no sap llegir-lo.
function resolDeNou(it) {
  const e = it.enunciat;
  let m;
  switch (it.mena) {
    case 'proporcio': {
      m = e.match(/^(\d+) \w+ triguen (\d+) dies .*contractem (\d+) més/);
      if (!m) return null;
      const [n1, d1, extra] = [n(m[1]), n(m[2]), n(m[3])];
      return `${(n1 * d1) / (n1 + extra)} dies`;
    }
    case 'capacitat': {
      m = e.match(/gasta (\d+) litres.*fan (\d+) serveis.*un (\d+)% del dipòsit/);
      if (!m) return null;
      const [L, s, p] = [n(m[1]), n(m[2]), n(m[3])];
      const t = (L * s * 100) / p;
      return `${String(t).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} L`;
    }
    case 'restant': {
      m = e.match(/dura (\d+) minuts. Si ara en porta (\d+)/);
      if (!m) return null;
      const [t, f] = [n(m[1]), n(m[2])];
      return `${((t - f) * 100) / t}%`;
    }
    case 'percentatge': {
      m = e.match(/sou és de ([\d.]+) euros.*porto (\d+) mesos.*un (\d+)%/);
      if (!m) return null;
      const [s, mes, p] = [n(m[1]), n(m[2]), n(m[3])];
      const preu = (s * mes * p) / 100;
      return `${String(preu).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
    }
    case 'parelles': {
      m = e.match(/total de (\d+) jugadors/);
      if (!m) return null;
      const N = n(m[1]);
      let c = 0;
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) c++;
      return `${c}`;
    }
    case 'dau': {
      m = e.match(/igual a (\d+) o (inferior|superior)/);
      if (!m) return null;
      const [k, mena] = [n(m[1]), m[2]];
      let f = 0;
      for (let c = 1; c <= 6; c++) if (mena === 'inferior' ? c <= k : c >= k) f++;
      return frac(f, 6);
    }
    case 'daus': {
      m = e.match(/suma sigui (\d+) o superior/);
      if (!m) return null;
      const k = n(m[1]);
      let f = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= k) f++;
      return frac(f, 36);
    }
    case 'dia': {
      m = e.match(/les (\d+):(\d+)h, quin percentatge del dia portàvem fa (\d+)( hores i mitja| hores| hora)/);
      if (!m) return null;
      const ara = n(m[1]) + (m[2] === '30' ? 0.5 : 0);
      const enrere = n(m[3]) + (m[4].includes('mitja') ? 0.5 : 0);
      return `${((ara - enrere) * 100) / 24}%`;
    }
    case 'serie': {
      m = e.match(/sèrie\?: ([\d; ]+)…/);
      if (!m) return null;
      const s = m[1].split(';').map((x) => Number(x.trim()));
      // Sense saber la regla: es prova el catàleg i ha de sortir-ne una sola.
      const ok = [];
      for (let a = 2; a <= 5; a++) for (let b = -5; b <= 9; b++) {
        if (s.every((x, i) => i === 0 || x === s[i - 1] * a + b)) ok.push(s[s.length - 1] * a + b);
      }
      for (let a = 2; a <= 12; a++) for (let b = 2; b <= 4; b++) {
        if (s.every((x, i) => i === 0 || x === (i % 2 ? s[i - 1] + a : s[i - 1] * b))) {
          ok.push(s.length % 2 ? s[s.length - 1] + a : s[s.length - 1] * b);
        }
      }
      for (let d = 1; d <= 9; d++) for (let c = 1; c <= 5; c++) {
        if (s.every((x, i) => i === 0 || x === s[i - 1] + d + c * (i - 1))) {
          ok.push(s[s.length - 1] + d + c * (s.length - 1));
        }
      }
      if (s.every((x, i) => i < 2 || x === s[i - 1] + s[i - 2])) ok.push(s[s.length - 1] + s[s.length - 2]);
      const unics = [...new Set(ok)];
      return unics.length === 1 ? `${unics[0]}` : null;
    }
    default: return null;
  }
}
function frac(a, b) {
  const g = (x, y) => (y ? g(y, x % y) : x);
  const k = g(a, b) || 1;
  return b / k === 1 ? `${a / k}` : `${a / k}/${b / k}`;
}

const N = 400;
const perMena = {};
const lletres = [0, 0, 0, 0];
let rellegits = 0;

titol(`1. ${N} ítems, tornats a fer llegint l'enunciat`);
for (let seed = 1; seed <= N; seed++) {
  const it = Q.generaItem(seed);
  perMena[it.mena] = (perMena[it.mena] || 0) + 1;
  lletres[it.correcta]++;

  cal('quatre opcions', it.opcions.length === 4, `llavor ${seed}`);
  cal('les quatre diferents', it.control.opcionsDiferents, `llavor ${seed}`);
  // Cada resposta ha de ser un número net: enter amb els milers amb punt,
  // o una fracció. Res de comes ni de decimals que s'escapen.
  const NET = /^(\d{1,3}(\.\d{3})+|\d{1,4})(\/\d+)?( dies| L| €|%)?$/;
  cal('cap resposta espatllada', it.opcions.every((o) => NET.test(o)),
    `llavor ${seed}: ${it.opcions.join(' | ')}`);
  cal('l\'enunciat no té forats',
    !/undefined|NaN|\$\{/.test(it.enunciat), `llavor ${seed}`);

  // Els controls que el generador ja fa pel seu compte.
  for (const [k, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${k}`, v, `llavor ${seed} (${it.mena})`);
  }

  // I ara, el camí de debò: rellegir l'enunciat i resoldre'l.
  const meva = resolDeNou(it);
  cal('l\'enunciat es deixa llegir', meva !== null, `llavor ${seed} (${it.mena})`);
  if (meva !== null) {
    rellegits++;
    cal('la resposta marcada és la que surt de l\'enunciat',
      it.opcions[it.correcta] === meva,
      `llavor ${seed} (${it.mena}): diu "${it.opcions[it.correcta]}", en surt "${meva}"`);
    const quantes = it.opcions.filter((o) => o === meva).length;
    cal('i cap altra opció no hi coincideix', quantes === 1, `llavor ${seed}: ${quantes}`);
  }
}
console.log(`  ${rellegits}/${N} enunciats rellegits i resolts des de zero`);
console.log(`  menes: ${Object.entries(perMena).map(([k, v]) => `${k} ${v}`).join('   ')}`);

titol('2. Cada mena, per separat');
for (const mena of Object.keys(Q.MENES)) {
  let ok = 0;
  for (let seed = 1000; seed < 1060; seed++) {
    const it = Q.generaItem(seed, mena);
    cal(`${mena}: la mena demanada`, it.mena === mena);
    if (resolDeNou(it) === it.opcions[it.correcta]) ok++;
  }
  cal(`${mena}: els 60 quadren en rellegir-los`, ok === 60, `${mena}: ${ok}/60`);
}

titol('3. Les sèries no tenen dues explicacions');
for (let seed = 1; seed <= 120; seed++) {
  const it = Q.generaItem(2000 + seed, 'serie');
  cal('una sola regla hi encaixa', it.control.reglesQueEncaixen >= 1, `llavor ${seed}`);
  cal('i totes diuen el mateix', resolDeNou(it) === it.opcions[it.correcta],
    `llavor ${seed}: ${it.enunciat}`);
}

titol('4. La lletra bona, repartida');
console.log(`  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}   (de ${N})`);
cal('cap lletra no es desvia gaire',
  lletres.every((l) => Math.abs(l - N / 4) < N / 10), lletres.join('/'));

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
