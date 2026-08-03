// Proves de les sèries de figures.
//
// El que ha de sortir d'aquí és que la sèrie tingui UNA sola continuació.
// No que la regla sigui bonica: que sigui l'única. Per això a cada ítem es
// torna a passar el catàleg sencer de regles contra els quadres que es
// veuen, i totes les que hi encaixin han de coincidir en el cinquè.
//
// Això és el que fallava abans: amb un pas de dos, la marca torna al punt
// de partida cada quatre quadres, i llavors "avança dos" i "retrocedeix
// dos" expliquen exactament el mateix.
import * as S from './series.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

// Els catàlegs, escrits aquí a part dels del generador.
const mod = (n, m) => ((n % m) + m) % m;
const CATALEG = {
  graella: (q) => {
    const out = [];
    for (const a of [1, -1, 2, -2, 3, -3]) for (const b of [1, -1, 2, -2, 3, -3]) {
      if (!q.every((x, i) => x.estrella === mod(q[0].estrella + a * i, 8))) continue;
      if (!q.every((x, i) => x.cercle === mod(q[0].cercle + b * i, 8))) continue;
      out.push(`${mod(q[0].estrella + a * 4, 8)}|${mod(q[0].cercle + b * 4, 8)}`);
    }
    return out;
  },
  rellotge: (q) => {
    const out = [];
    for (const a of [1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) for (const b of [1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) {
      if (!q.every((x, i) => x.gran === mod(q[0].gran + a * i, 12))) continue;
      if (!q.every((x, i) => x.petita === mod(q[0].petita + b * i, 12))) continue;
      out.push(`${mod(q[0].gran + a * 4, 12)}|${mod(q[0].petita + b * 4, 12)}`);
    }
    return out;
  },
  comptatge: (q) => {
    const out = [];
    const v = (b, c, d, i) => b + Math.floor((i + d) / c);
    for (let ba = 0; ba <= 3; ba++) for (const ca of [1, 2, 3]) for (const da of [0, 1, 2]) {
      if (!q.every((x, i) => x.dalt === v(ba, ca, da, i))) continue;
      for (let bb = 0; bb <= 3; bb++) for (const cb of [1, 2, 3]) for (const db of [0, 1, 2]) {
        if (!q.every((x, i) => x.baix === v(bb, cb, db, i))) continue;
        out.push(`${v(ba, ca, da, 4)}-${v(bb, cb, db, 4)}`);
      }
    }
    return out;
  },
  sectors: (q) => {
    const out = [];
    for (let ini = 0; ini <= 4; ini++) for (const cr of [1, 2, 3]) for (const gr of [0, 1, -1, 2, -2]) {
      if (!q.every((x, i) => x.plens === ini + cr * i && x.desde === mod(q[0].desde + gr * i, 12))) continue;
      out.push(`${ini + cr * 4}@${mod(q[0].desde + gr * 4, 12)}`);
    }
    return out;
  },
};
const CLAU = {
  graella: (o) => `${o.estrella}|${o.cercle}`,
  rellotge: (o) => `${o.gran}|${o.petita}`,
  comptatge: (o) => `${o.dalt}-${o.baix}`,
  sectors: (o) => `${o.plens}@${o.desde}`,
};

const N = 200;
for (const mena of Object.keys(S.MENES)) {
  titol(`${mena} — ${N} ítems`);
  const lletres = [0, 0, 0, 0];
  for (let seed = 1; seed <= N; seed++) {
    const it = S.MENES[mena](seed);
    lletres[it.correcta]++;
    for (const [nom, v] of Object.entries(it.control)) {
      if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
    }
    cal('quatre quadres a la sèrie', it.quadres.length === 4, `llavor ${seed}`);
    cal('quatre opcions', it.opcions.length === 4, `llavor ${seed}`);

    // El control que compta: totes les regles que expliquen els quadres han
    // de dir el mateix cinquè, i ha de ser el marcat.
    const continuacions = new Set(CATALEG[mena](it.quadres));
    cal('la sèrie té continuació', continuacions.size >= 1, `llavor ${seed}`);
    cal('i només una', continuacions.size === 1,
      `llavor ${seed}: ${[...continuacions].join(' / ')}`);
    cal('la marcada és la que surt de la regla',
      continuacions.has(CLAU[mena](it.opcions[it.correcta])),
      `llavor ${seed}: diu ${CLAU[mena](it.opcions[it.correcta])}, en surt ${[...continuacions][0]}`);
    cal('cap altra opció no hi coincideix',
      it.opcions.filter((o) => continuacions.has(CLAU[mena](o))).length === 1, `llavor ${seed}`);

    // Que la sèrie es mogui: si els quatre quadres fossin iguals no hi
    // hauria res a deduir.
    cal('els quadres no són tots iguals',
      new Set(it.quadres.map(CLAU[mena])).size > 1, `llavor ${seed}`);

    if (mena === 'graella') {
      cal('l\'estrella i el cercle no es trepitgen mai',
        [...it.quadres, ...it.opcions].every((q) => q.estrella !== q.cercle), `llavor ${seed}`);
      cal('les posicions són de la vora',
        [...it.quadres, ...it.opcions].every((q) => q.estrella >= 0 && q.estrella < 8
          && q.cercle >= 0 && q.cercle < 8), `llavor ${seed}`);
    }
    if (mena === 'rellotge') {
      cal('les agulles no se superposen',
        [...it.quadres, ...it.opcions].every((q) => q.gran !== q.petita), `llavor ${seed}`);
    }
    if (mena === 'comptatge') {
      cal('no hi ha comptes negatius',
        [...it.quadres, ...it.opcions].every((q) => q.dalt >= 0 && q.baix >= 0), `llavor ${seed}`);
      cal('ni comptes que no càpiguen',
        [...it.quadres, ...it.opcions].every((q) => q.dalt <= 5 && q.baix <= 5), `llavor ${seed}`);
    }
    if (mena === 'sectors') {
      cal('els trossos plens tenen sentit',
        [...it.quadres, ...it.opcions].every((q) => q.plens >= 1 && q.plens <= 12), `llavor ${seed}`);
    }
  }
  console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
  cal(`${mena}: la lletra bona va repartida`,
    lletres.every((l) => Math.abs(l - N / 4) < N / 7), lletres.join('/'));
}

titol('El repartidor de menes i el dibuix');
{
  const comptes = {};
  for (let s = 1; s <= 200; s++) {
    const it = S.generaItem(s);
    comptes[it.mena] = (comptes[it.mena] || 0) + 1;
  }
  console.log(`  menes: ${Object.entries(comptes).map(([k, v]) => `${k} ${v}`).join('   ')}`);
  cal('surten les quatre menes', Object.keys(comptes).length === 4);
  cal('cap mena no s\'esbomba', Object.values(comptes).every((v) => v > 30), JSON.stringify(comptes));

  const svg = S.svgFull(Object.keys(S.MENES).map((m, i) => S.MENES[m](i + 1)));
  cal('cap número espatllat', !/NaN|Infinity|undefined/.test(svg));
  cal('hi ha els quatre enunciats', (svg.match(/completa millor la sèrie/g) || []).length === 4);
  cal('hi ha la incògnita a cada sèrie', (svg.match(/>\?</g) || []).length === 4);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
