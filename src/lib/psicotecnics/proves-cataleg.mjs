// Proves del catàleg.
//
// Aquí no es comprova si les respostes són bones —això ja ho fan les proves
// de cada família—, sinó que TOT surti amb la mateixa forma i que res no es
// trenqui pel camí. És el que ha de garantir que l'app pugui pintar
// qualsevol categoria amb una sola pantalla.
import * as C from './cataleg.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 15) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

titol('1. Les quinze categories, amb cent ítems cadascuna');
{
  cal('n\'hi ha quinze', C.CATEGORIES.length === 16, `${C.CATEGORIES.length}`);
  cal('cap id repetit', new Set(C.CATEGORIES.map((c) => c.id)).size === 16);
  for (const cat of C.CATEGORIES) {
    let grafics = 0, textos = 0;
    for (let seed = 1; seed <= 100; seed++) {
      const it = C.genera(cat.id, seed);
      cal('té id', typeof it.id === 'string' && it.id.includes(':'), cat.id);
      cal('té enunciat', typeof it.enunciat === 'string' && it.enunciat.length > 10, `${cat.id} ${seed}`);
      cal('l\'enunciat no té forats', !/undefined|NaN|\$\{/.test(it.enunciat), `${cat.id} ${seed}`);
      // Sempre quatre. Les instruccions de l'examen ho diuen amb aquestes
      // paraules: «tindreu quatre alternatives de resposta».
      cal('sempre quatre opcions', it.opcions.length === 4,
        `${cat.id} ${seed}: ${it.opcions.length}`);
      cal('la correcta és un índex vàlid',
        Number.isInteger(it.correcta) && it.correcta >= 0 && it.correcta < it.opcions.length,
        `${cat.id} ${seed}`);
      for (const o of it.opcions) {
        const teText = typeof o.text === 'string' && o.text.length > 0;
        const teSvg = typeof o.svg === 'string' && o.svg.startsWith('<svg');
        cal('cada opció porta text o dibuix', teText || teSvg, `${cat.id} ${seed}`);
        if (teSvg) { grafics++; cal('el dibuix de l\'opció està sencer', !/NaN|undefined/.test(o.svg), `${cat.id} ${seed}`); }
        if (teText) textos++;
      }
      if (cat.grafica) {
        cal('les categories gràfiques porten dibuix',
          typeof it.svg === 'string' && it.svg.startsWith('<svg'), `${cat.id} ${seed}`);
        cal('i el dibuix està sencer', !/NaN|undefined/.test(it.svg), `${cat.id} ${seed}`);
        cal('el dibuix té viewBox, perquè s\'ha d\'escalar a la pantalla',
          it.svg.includes('viewBox'), `${cat.id} ${seed}`);
      } else {
        cal('les de text no porten dibuix', it.svg === null, cat.id);
      }
    }
    console.log(`  ${cat.id.padEnd(20)} ${cat.grafica ? 'gràfica' : 'text   '}  `
      + `${grafics ? `${grafics} opcions dibuixades` : `${textos} opcions de text`}`);
  }
}

// ── Que el dibuix càpiga dins del marc ───────────────────────────
// Aquesta prova hi és perquè em va faltar: al cub de les opcions hi havia
// un desplaçament de més i quedava tallat per sota. Jo no ho podia veure;
// l'Eduardo sí. Però això SÍ que es pot comprovar amb números: n'hi ha prou
// de mirar on cauen els punts i comparar-ho amb el viewBox.
//
// Es miren els elements de primer nivell, que són els que fan la silueta.
// El que va dins d'un <g transform> està en coordenades seves i no es pot
// comparar directament, o sigui que es treu abans de mirar. I el que va dins
// d'un <g clip-path> tampoc compta: allà el dibuix ja està retallat i el que
// en sobresurt no es veu —a les escenes del punt de fuga la carretera és una
// barra llarga que se'n va molt més enllà del disc i no passa res.
function extrems(svg) {
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!vb) return null;
  const net = svg
    .replace(/<g transform="[^"]*">.*?<\/g>/gs, '')
    .replace(/<clipPath\b.*?<\/clipPath>/gs, '')
    .replace(/<g clip-path="[^"]*">.*?<\/g>/gs, '');
  const xs = [], ys = [];
  for (const m of net.matchAll(/points="([^"]+)"/g)) {
    for (const p of m[1].trim().split(/\s+/)) {
      const [x, y] = p.split(',').map(Number);
      if (Number.isFinite(x) && Number.isFinite(y)) { xs.push(x); ys.push(y); }
    }
  }
  for (const m of net.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/g)) {
    xs.push(Number(m[1]), Number(m[1]) + Number(m[3]));
    ys.push(Number(m[2]), Number(m[2]) + Number(m[4]));
  }
  for (const m of net.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)"/g)) {
    xs.push(Number(m[1]) - Number(m[3]), Number(m[1]) + Number(m[3]));
    ys.push(Number(m[2]) - Number(m[3]), Number(m[2]) + Number(m[3]));
  }
  for (const m of net.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([-\d.]+)" ry="([-\d.]+)"/g)) {
    xs.push(Number(m[1]) - Number(m[3]), Number(m[1]) + Number(m[3]));
    ys.push(Number(m[2]) - Number(m[4]), Number(m[2]) + Number(m[4]));
  }
  for (const m of net.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"/g)) {
    xs.push(Number(m[1]), Number(m[3]));
    ys.push(Number(m[2]), Number(m[4]));
  }
  if (!xs.length) return null;
  return {
    w: Number(vb[1]), h: Number(vb[2]),
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };
}

titol('1b. El dibuix cap dins del marc, a totes les categories');
for (const cat of C.CATEGORIES) {
  let mirats = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const it = C.genera(cat.id, seed);
    const peces = [['enunciat', it.svg], ...it.opcions.map((o, i) => [`opció ${i}`, o.svg])];
    for (const [nom, svg] of peces) {
      if (!svg) continue;
      const e = extrems(svg);
      if (!e) continue;
      mirats++;
      // Mig punt de marge per als arrodoniments.
      cal(`${cat.id}: el dibuix no es talla per dalt ni per l'esquerra`,
        e.minX >= -0.5 && e.minY >= -0.5,
        `${cat.id} ${seed} ${nom}: comença a (${e.minX.toFixed(1)}, ${e.minY.toFixed(1)})`);
      cal(`${cat.id}: el dibuix no es talla per baix ni per la dreta`,
        e.maxX <= e.w + 0.5 && e.maxY <= e.h + 0.5,
        `${cat.id} ${seed} ${nom}: arriba a (${e.maxX.toFixed(1)}, ${e.maxY.toFixed(1)}) `
        + `i el marc és ${e.w}×${e.h}`);
      // I que no nedi: si ocupa menys de mig marc, hi ha massa buit.
      cal(`${cat.id}: el dibuix omple el marc`,
        (e.maxX - e.minX) > e.w * 0.4 && (e.maxY - e.minY) > e.h * 0.4,
        `${cat.id} ${seed} ${nom}: ocupa ${(e.maxX - e.minX).toFixed(0)}×${(e.maxY - e.minY).toFixed(0)} `
        + `de ${e.w}×${e.h}`);
    }
  }
  console.log(`  ${cat.id.padEnd(20)} ${mirats} dibuixos mesurats`);
}

titol('1c. Dos-cents ítems diferents de cada categoria, com a mínim');
// L'empremta és estricta a posta: la MATEIXA pregunta amb les respostes en
// un altre ordre NO és un ítem nou. Si no es comparessin ordenades, sortiria
// molta més varietat de la que hi ha de veritat, i seria mentida.
//
// Aquesta prova hi és perquè hi havia una família que no hi arribava. Les
// tretze primeres fabriquen ítems a partir d'una llavor i no s'acaben mai;
// la verbal surt d'una taula escrita a mà, i quan la taula era de trenta
// paraules el sostre era de 216. Ara hi ha 111 paraules i 79 parelles.
{
  const empremta = (it) => `${it.enunciat}|${it.svg || ''}|`
    + it.opcions.map((o) => o.svg || o.text).sort().join('~');
  for (const cat of C.CATEGORIES) {
    const vistes = new Set();
    for (let seed = 1; seed <= 400; seed++) vistes.add(empremta(C.genera(cat.id, seed)));
    cal(`${cat.id}: dos-cents ítems diferents de 400 llavors`, vistes.size >= 200,
      `${cat.id}: només ${vistes.size}`);
    // I que cap ítem no porti dues opcions iguals: seria una pregunta amb
    // dues respostes idèntiques i quedaria en evidència.
    for (let seed = 1; seed <= 120; seed++) {
      const it = C.genera(cat.id, seed);
      const cares = it.opcions.map((o) => o.svg || o.text);
      cal(`${cat.id}: cap opció repetida dins d'un ítem`,
        new Set(cares).size === cares.length, `${cat.id} ${seed}`);
    }
    console.log(`  ${cat.id.padEnd(20)} ${String(vistes.size).padStart(3)} diferents de 400`);
  }
}

titol('2. Dues llavors iguals donen el mateix ítem, i dues de diferents no');
for (const cat of C.CATEGORIES) {
  const a = C.genera(cat.id, 77), b = C.genera(cat.id, 77), c = C.genera(cat.id, 78);
  cal('la mateixa llavor dona el mateix', JSON.stringify(a) === JSON.stringify(b), cat.id);
  cal('una altra llavor dona una altra cosa', JSON.stringify(a) !== JSON.stringify(c), cat.id);
}

titol('3. La lletra bona, repartida a cada categoria');
for (const cat of C.CATEGORIES) {
  const n = C.genera(cat.id, 1).opcions.length;
  const comptes = Array(n).fill(0);
  for (let seed = 1; seed <= 400; seed++) comptes[C.genera(cat.id, seed).correcta]++;
  const esperat = 400 / n;
  const pitjor = Math.max(...comptes.map((x) => Math.abs(x - esperat) / esperat));
  cal(`${cat.id}: cap lletra no es desvia més d'un terç`, pitjor < 0.34,
    `${cat.id}: ${comptes.join('/')}`);
}

titol('4. Els simulacres');
for (const [perfil, s] of Object.entries(C.SIMULACRES)) {
  for (const q of C.LLARGADES) {
    const plan = C.repartiment(perfil, q);
    const total = plan.reduce((a, b) => a + b.n, 0);
    cal(`${perfil}/${q}: surten les preguntes demanades`, total === q, `${perfil} ${q}: ${total}`);
    cal(`${perfil}/${q}: totes les categories existeixen`,
      plan.every((p) => C.PER_ID[p.id]), perfil);
    const ex = C.simulacre(perfil, q, 5);
    cal(`${perfil}/${q}: l'examen té les preguntes`, ex.length === q, `${ex.length}`);
    cal(`${perfil}/${q}: cap pregunta repetida`, new Set(ex.map((e) => e.id)).size === q, perfil);
    cal(`${perfil}/${q}: totes ben formades`,
      ex.every((e) => e.enunciat && e.opcions.length >= 4
        && e.correcta >= 0 && e.correcta < e.opcions.length), perfil);
    // El mateix examen dues vegades ha de sortir igual.
    cal(`${perfil}/${q}: el mateix examen es repeteix igual`,
      JSON.stringify(C.simulacre(perfil, q, 5).map((e) => e.id)) === JSON.stringify(ex.map((e) => e.id)),
      perfil);
    // I un altre número d'examen ha de ser diferent.
    cal(`${perfil}/${q}: un altre examen és diferent`,
      JSON.stringify(C.simulacre(perfil, q, 6).map((e) => e.id)) !== JSON.stringify(ex.map((e) => e.id)),
      perfil);
  }
  const p80 = C.repartiment(perfil, 80);
  console.log(`  ${s.nom}: ${p80.map((x) => `${x.id} ${x.n}`).join(', ')}`);
}

titol('5. El temps');
{
  cal('80 preguntes són 35 minuts', C.segonsPer(80) === 35 * 60, `${C.segonsPer(80)}`);
  cal('i es manté el ritme', C.tempsText(80) === '35:00', C.tempsText(80));
  for (const q of C.LLARGADES) {
    console.log(`  ${String(q).padStart(2)} preguntes → ${C.tempsText(q)}`);
    cal('el temps creix amb les preguntes', C.segonsPer(q) > 0);
  }
  cal('10 preguntes', C.tempsText(10) === '4:23', C.tempsText(10));
  cal('30 preguntes', C.tempsText(30) === '13:08', C.tempsText(30));
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
