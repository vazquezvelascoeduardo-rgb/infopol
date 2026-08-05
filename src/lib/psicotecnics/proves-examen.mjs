// Proves de l'examen imprès.
//
// Aquí el que pot sortir malament no és si una resposta és bona —d'això ja
// se n'ocupen les proves de cada família— sinó si el PAPER diu el que ha de
// dir. I la cosa que fa més mal és la que menys es veu: que el full de
// respostes del final no correspongui amb les preguntes. Un desplaçament
// d'una sola posició no es nota mirant el PDF; es nota quan algú es
// corregeix i li surt un 3 sense saber per què.
//
// Per això la comprovació principal no llegeix la llista de solucions que
// hagi guardat ningú: torna a generar cada ítem a partir de la seva llavor i
// mira si la lletra que hi ha escrita al full és la seva.
import { html, munta } from './examen.mjs';
import { BLOCS, genera } from './cataleg.mjs';
import { GUIA } from './guia.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

titol('1. El repartiment: vuitanta de cada aptitud');
const mapa = munta({ perBloc: 80 });
{
  cal('hi ha els cinc blocs', mapa.blocs.length === BLOCS.length, `${mapa.blocs.length}`);
  cal('quatre-centes preguntes en total', mapa.total === 400, `${mapa.total}`);
  for (const { bloc, parts } of mapa.blocs) {
    const n = parts.reduce((s, p) => s + p.quantes, 0);
    cal(`${bloc.id}: vuitanta preguntes`, n === 80, `${bloc.id}: ${n}`);
    cal(`${bloc.id}: hi són totes les famílies del bloc`,
      parts.length === bloc.categories.length, `${bloc.id}: ${parts.length}`);
    // Cap família no pot quedar-se sense preguntes ni endur-se-les totes.
    for (const p of parts) {
      cal(`${bloc.id}/${p.id}: en té alguna`, p.quantes > 0, p.id);
      cal(`${bloc.id}/${p.id}: no se les queda totes`,
        parts.length === 1 || p.quantes < 80, p.id);
    }
    console.log(`  ${bloc.id.padEnd(11)} ${parts.map((p) => `${p.id} ${p.quantes}`).join(' · ')}`);
  }
}

titol('2. La numeració va seguida, de l\'1 al 400');
{
  const nums = mapa.blocs.flatMap(({ parts }) => parts.flatMap((p) => p.items.map((x) => x.num)));
  cal('n\'hi ha quatre-cents', nums.length === 400, `${nums.length}`);
  cal('van de l\'1 al 400 sense saltar-se cap',
    nums.every((v, i) => v === i + 1), 'hi ha un salt');
}

titol('3. Cada ítem és el que diu la seva llavor');
{
  // El camí independent: es torna a generar cada pregunta des de la llavor
  // que té apuntada i s'ha de veure exactament igual.
  for (const { parts } of mapa.blocs) {
    for (const p of parts) {
      for (const { llavor, item } of p.items) {
        const altre = genera(p.id, llavor);
        cal('el mateix enunciat', altre.enunciat === item.enunciat, `${p.id} ${llavor}`);
        cal('la mateixa correcta', altre.correcta === item.correcta, `${p.id} ${llavor}`);
        cal('el mateix dibuix', (altre.svg || '') === (item.svg || ''), `${p.id} ${llavor}`);
      }
    }
  }
}

titol('4. Cap pregunta repetida dins d\'una mateixa família');
{
  for (const { bloc, parts } of mapa.blocs) {
    for (const p of parts) {
      // L'enunciat i el dibuix, sense les opcions: el mateix problema amb
      // les respostes en un altre ordre no és una pregunta nova.
      const empremtes = p.items.map(({ item }) =>
        `${item.enunciat}|${item.svg || ''}|${item.svgObjectiu || ''}`);
      cal(`${bloc.id}/${p.id}: cap repetida`,
        new Set(empremtes).size === empremtes.length,
        `${p.id}: ${empremtes.length - new Set(empremtes).size} repetides`);
    }
  }
}

titol('5. Totes les famílies tenen la seva explicació');
{
  for (const { parts } of mapa.blocs) {
    for (const p of parts) {
      const g = GUIA[p.id];
      cal(`${p.id}: té guia`, !!g, p.id);
      if (!g) continue;
      cal(`${p.id}: té títol`, typeof g.titol === 'string' && g.titol.length > 3, p.id);
      cal(`${p.id}: té explicació`,
        typeof g.explicacio === 'string' && g.explicacio.length > 60, p.id);
      cal(`${p.id}: té els passos per resoldre`,
        Array.isArray(g.resolucio) && g.resolucio.length >= 3, p.id);
      cal(`${p.id}: té truc`, typeof g.truc === 'string' && g.truc.length > 40, p.id);
      // L'exemple resolt no pot ser una de les preguntes: seria regalar-la.
      const empremta = (x) => `${x.enunciat}|${x.svg || ''}`;
      cal(`${p.id}: l'exemple no és cap de les preguntes`,
        !p.items.some(({ item }) => empremta(item) === empremta(p.exemple)), p.id);
    }
  }
}

titol('6. El full de respostes correspon amb les preguntes');
{
  const doc = html({ perBloc: 80, titol: 'prova' });
  cal('el document surt sencer', !/NaN|undefined/.test(doc));
  cal('hi ha quatre-centes preguntes',
    (doc.match(/class="q"/g) || []).length === 400,
    `${(doc.match(/class="q"/g) || []).length}`);
  cal('hi ha divuit explicacions de model',
    (doc.match(/class="model"/g) || []).length === 18,
    `${(doc.match(/class="model"/g) || []).length}`);

  // Es llegeixen les caselles del full de respostes tal com queden escrites.
  const escrites = [...doc.matchAll(/<span class="r"><b>(\d+)<\/b>([ABCD])<\/span>/g)]
    .map((m) => ({ num: Number(m[1]), lletra: m[2] }));
  cal('el full té quatre-centes caselles', escrites.length === 400, `${escrites.length}`);
  cal('numerades de l\'1 al 400',
    escrites.every((e, i) => e.num === i + 1), 'hi ha un salt');

  // I ara la de debò: cada lletra s'ha de correspondre amb l'ítem que
  // ocupa aquell número, tornat a generar des de la seva llavor.
  const perNumero = new Map();
  for (const { parts } of mapa.blocs) {
    for (const p of parts) for (const x of p.items) perNumero.set(x.num, { id: p.id, ...x });
  }
  let mirades = 0;
  for (const { num, lletra } of escrites) {
    const q = perNumero.get(num);
    cal('la casella té una pregunta al darrere', !!q, `número ${num}`);
    if (!q) continue;
    mirades++;
    const refet = genera(q.id, q.llavor);
    cal('la lletra del full és la de la pregunta',
      'ABCD'[refet.correcta] === lletra,
      `número ${num} (${q.id}, llavor ${q.llavor}): el full diu ${lletra} `
      + `i la bona és la ${'ABCD'[refet.correcta]}`);
  }
  console.log(`  ${mirades} respostes comprovades una a una`);

  // Les lletres han d'anar repartides: si el full sortís gairebé tot A,
  // s'aprovaria marcant-ho tot igual.
  const compte = { A: 0, B: 0, C: 0, D: 0 };
  for (const e of escrites) compte[e.lletra]++;
  console.log(`  repartiment:  A ${compte.A}   B ${compte.B}   C ${compte.C}   D ${compte.D}`);
  cal('cap lletra no domina el full',
    Object.values(compte).every((v) => v > 400 / 8), Object.values(compte).join('/'));
}

titol('7. El paper: que res no quedi tallat');
{
  const doc = html({ perBloc: 10 });
  // Cada pregunta ha d'anar sencera: si el navegador la pot partir, un
  // dibuix pot quedar en una pàgina i les respostes a la següent.
  cal('les preguntes no es poden partir entre pàgines',
    /\.q \{[^}]*page-break-inside: avoid/.test(doc));
  cal('les explicacions tampoc',
    /\.model \{[^}]*page-break-inside: avoid/.test(doc));
  cal('cada aptitud comença a pàgina nova',
    /\.bloc \{[^}]*page-break-before: always/.test(doc));
  cal('i cada model també',
    /\.model \{[^}]*page-break-before: always/.test(doc));
  // Els dibuixos han de tenir un sostre d'alçada: si no, un de gran es
  // menja la pàgina sencera.
  cal('els dibuixos tenen mida màxima', /\.dib svg \{[^}]*max-height/.test(doc));
  cal('i els de les opcions també', /\.fig svg \{[^}]*max-height/.test(doc));
  // I que els SVG hi vagin de veritat, no com a text escapat.
  cal('els dibuixos van com a SVG', doc.includes('<svg') && !doc.includes('&lt;svg'));
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
