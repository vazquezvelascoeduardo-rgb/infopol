// Les dues famílies de paraules: sinònims/antònims i analogies.
//
// AVÍS, i cal que quedi escrit: aquesta és l'única carpeta on la resposta
// NO es calcula. A la resta, la bona surt d'un invariant geomètric o d'un
// compte, i el programa la pot garantir sol. Aquí la bona surt d'una taula
// que he escrit jo, i per tant la garantia és d'una altra mena:
//
//  · El que el programa SÍ comprova: que cap dels tres distractors no
//    compleixi la relació que demana l'enunciat, que les quatre opcions
//    siguin diferents, i que cap paraula no surti dues vegades. Això es
//    comprova contra la taula, i és de debò.
//  · El que NO pot comprovar: que la taula sigui bona. Si hi poso un
//    sinònim discutible, el programa no ho sabrà.
//
// Per això les analogies van amb relacions TANCADES —país i capital, animal
// i pell, instrument i magnitud—, on la parella és un fet i no una opinió.
// I els sinònims porten un sol sinònim i un sol antònim per paraula, amb
// una llista a part de paraules del mateix camp que expressament NO ho són:
// aquestes són les que fan de distractors.
//
// Al simulacre de l'iOpos n'hi ha un que ensenya el parany: TRANSLÚCID amb
// «Diàfan» com a bona i «Transparent» entre els distractors. Totes dues
// valen. Aquí això no pot passar, perquè els distractors surten de la
// llista de les que NO són sinònimes.
import { rng, tria, barreja, posicioBona } from './atzar.mjs';

// ── Sinònims i antònims ──────────────────────────────────────────
// { paraula, sinonim, antonim, propers }
//  · `propers` són del mateix camp però NO són ni sinònimes ni antònimes.
//  · `antonim` pot faltar: aleshores la paraula només serveix per a
//    preguntes de semblança.
export const PARAULES = [
  { p: 'content', s: 'alegre', a: 'trist', propers: ['nerviós', 'sorprès', 'cansat'] },
  { p: 'mullar', s: 'humitejar', a: 'assecar', propers: ['bullir', 'fregir', 'vessar'] },
  { p: 'higiènic', s: 'net', a: 'brut', propers: ['ordenat', 'lluent', 'aspre'] },
  { p: 'ràpid', s: 'veloç', a: 'lent', propers: ['àgil', 'fort', 'lleuger'] },
  { p: 'fosc', s: 'obscur', a: 'clar', propers: ['gris', 'tapat', 'profund'] },
  { p: 'valent', s: 'coratjós', a: 'covard', propers: ['fort', 'dur', 'seriós'] },
  { p: 'antic', s: 'vell', a: 'nou', propers: ['usat', 'clàssic', 'gastat'] },
  { p: 'difícil', s: 'complicat', a: 'fàcil', propers: ['llarg', 'pesat', 'estrany'] },
  { p: 'tranquil', s: 'calmat', a: 'nerviós', propers: ['lent', 'silenciós', 'quiet'] },
  { p: 'buit', s: 'desocupat', a: 'ple', propers: ['ample', 'lleuger', 'obert'] },
  { p: 'barat', s: 'econòmic', a: 'car', propers: ['petit', 'senzill', 'usat'] },
  { p: 'feble', s: 'dèbil', a: 'fort', propers: ['prim', 'petit', 'tou'] },
  { p: 'evident', s: 'clar', a: 'confús', propers: ['senzill', 'obert', 'directe'] },
  { p: 'amagar', s: 'ocultar', a: 'mostrar', propers: ['guardar', 'tancar', 'desar'] },
  { p: 'començar', s: 'iniciar', a: 'acabar', propers: ['seguir', 'provar', 'preparar'] },
  { p: 'pujar', s: 'ascendir', a: 'baixar', propers: ['saltar', 'córrer', 'caminar'] },
  { p: 'permetre', s: 'autoritzar', a: 'prohibir', propers: ['demanar', 'obligar', 'avisar'] },
  { p: 'augmentar', s: 'incrementar', a: 'reduir', propers: ['canviar', 'moure', 'repartir'] },
  { p: 'recordar', s: 'rememorar', a: 'oblidar', propers: ['pensar', 'saber', 'aprendre'] },
  { p: 'ajuntar', s: 'unir', a: 'separar', propers: ['posar', 'acostar', 'ordenar'] },
  { p: 'detenir', s: 'arrestar', a: 'alliberar', propers: ['perseguir', 'identificar', 'escorcollar'] },
  { p: 'il·lès', s: 'indemne', a: 'ferit', propers: ['viu', 'tranquil', 'dret'] },
  { p: 'desventura', s: 'desgràcia', a: 'fortuna', propers: ['despropòsit', 'error', 'tristesa'] },
  { p: 'troc', s: 'intercanvi', a: null, propers: ['comerç', 'mercat', 'regal'] },
  { p: 'malversació', s: 'desfalc', a: null, propers: ['conspiració', 'engany', 'suborn'] },
  { p: 'dèficit', s: 'mancança', a: 'superàvit', propers: ['deute', 'error', 'retard'] },
  { p: 'eximir', s: 'alliberar', a: 'obligar', propers: ['permetre', 'ajudar', 'perdonar'] },
  { p: 'vessant', s: 'pendent', a: null, propers: ['camí', 'cim', 'vall'] },
  { p: 'atzar', s: 'casualitat', a: 'certesa', propers: ['sort', 'destí', 'risc'] },
  { p: 'insòlit', s: 'inusual', a: 'corrent', propers: ['estrany', 'nou', 'curiós'] },
];

export const SEMBLANT = 'semblant';
export const OPOSAT = 'oposat';

export function generaParaula(seed, mena = null) {
  const r = rng(seed, 23);
  // Les que no tenen antònim només serveixen per a la de semblança.
  const quina = mena || (r() < 0.5 ? SEMBLANT : OPOSAT);
  const pool = quina === OPOSAT ? PARAULES.filter((x) => x.a) : PARAULES;
  const e = pool[posicioBona(seed, pool.length, `paraula-${quina}`)];

  const bona = quina === SEMBLANT ? e.s : e.a;
  // Els distractors: la del sentit contrari al demanat, i les del mateix
  // camp que expressament no són ni una cosa ni l'altra.
  const altres = [quina === SEMBLANT ? e.a : e.s, ...e.propers].filter(Boolean);
  const dolents = barreja(r, altres).slice(0, 3);
  if (dolents.length < 3) return null;

  const correcta = posicioBona(seed, 4, `verbal-${quina}`);
  const opcions = [];
  let i = 0;
  for (let k = 0; k < 4; k++) opcions.push(k === correcta ? bona : dolents[i++]);

  return {
    seed, mena: quina, paraula: e.p, opcions, correcta,
    enunciat: `Quina és la paraula que té un significat més ${quina} a ${e.p.toUpperCase()}?`,
    control: {
      opcionsDiferents: new Set(opcions).size === 4,
      // Cap distractor no és el que demana l'enunciat.
      capDistractorCompleix: opcions.every((o, k) => (k === correcta) === (o === bona)),
      // La paraula de l'enunciat no surt entre les opcions.
      laParaulaNoHiEs: !opcions.includes(e.p),
      // El sinònim i l'antònim no es confonen.
      sinonimIAntonimDiferents: e.s !== e.a,
      // Cap «proper» no és el sinònim ni l'antònim.
      propersNetejats: !e.propers.includes(e.s) && !e.propers.includes(e.a),
    },
  };
}

// ── Analogies ────────────────────────────────────────────────────
// Relacions TANCADES: cada parella és un fet comprovable, no una opinió.
export const RELACIONS = {
  capital: {
    nom: 'país i capital',
    parelles: [['Espanya', 'Madrid'], ['França', 'París'], ['Itàlia', 'Roma'],
      ['Portugal', 'Lisboa'], ['Alemanya', 'Berlín'], ['Grècia', 'Atenes'],
      ['Àustria', 'Viena'], ['Anglaterra', 'Londres']],
  },
  pell: {
    nom: 'animal i el que el cobreix',
    parelles: [['ocell', 'ploma'], ['peix', 'escata'], ['ovella', 'llana'],
      ['tortuga', 'closca'], ['porc espí', 'pua'], ['cranc', 'closca']],
  },
  mesura: {
    nom: 'instrument i el que mesura',
    parelles: [['rellotge', 'hora'], ['baròmetre', 'pressió'], ['termòmetre', 'temperatura'],
      ['balança', 'pes'], ['velocímetre', 'velocitat'], ['comptador', 'consum']],
  },
  conducte: {
    nom: 'el que circula i per on',
    parelles: [['electricitat', 'cable'], ['sang', 'vena'], ['aigua', 'canonada'],
      ['gas', 'tub'], ['tren', 'via'], ['fum', 'xemeneia']],
  },
  membre: {
    nom: 'ésser viu i una extremitat',
    parelles: [['humà', 'braç'], ['pop', 'tentacle'], ['ocell', 'ala'],
      ['arbre', 'branca'], ['cavall', 'pota']],
  },
  cria: {
    nom: 'animal i la seva cria',
    parelles: [['gos', 'cadell'], ['cavall', 'poltre'], ['vaca', 'vedell'],
      ['ovella', 'xai'], ['gat', 'gatet'], ['gallina', 'pollet']],
  },
  eina: {
    nom: 'ofici i la seva eina',
    parelles: [['fuster', 'martell'], ['pintor', 'pinzell'], ['sastre', 'agulla'],
      ['cuiner', 'ganivet'], ['pagès', 'aixada'], ['barber', 'tisores']],
  },
  casa: {
    nom: 'animal i on viu',
    parelles: [['ocell', 'niu'], ['abella', 'rusc'], ['conill', 'cau'],
      ['cavall', 'estable'], ['porc', 'cort']],
  },
  contrari: {
    nom: 'una cosa i la contrària',
    parelles: [['dalt', 'baix'], ['dur', 'tou'], ['negre', 'blanc'],
      ['calor', 'fred'], ['dia', 'nit'], ['sumar', 'restar'], ['entrar', 'sortir']],
  },
  riu: {
    nom: 'accident geogràfic i la seva mena',
    parelles: [['Ebre', 'riu'], ['Mediterrani', 'mar'], ['Montseny', 'muntanya'],
      ['Menorca', 'illa'], ['Banyoles', 'llac']],
  },
};

/** Si (a, b) és una parella d'aquesta relació. Es comprova, no s'endevina. */
export const compleix = (rel, a, b) => RELACIONS[rel].parelles.some(([x, y]) => x === a && y === b);

export function generaAnalogia(seed) {
  const r = rng(seed, 29);
  const noms = Object.keys(RELACIONS);
  for (let intent = 0; intent < 200; intent++) {
    const rel = tria(r, noms);
    const ps = barreja(r, RELACIONS[rel].parelles);
    const [a, b] = ps[0];
    const [c, bona] = ps[1];
    if (b === bona || a === c) continue;

    // Distractors: paraules del mateix tipus que la bona, però que NO
    // completen la relació amb `c`. Es comprova una per una.
    const mateixTipus = RELACIONS[rel].parelles.map(([, y]) => y).filter((y) => y !== bona);
    const altresRel = noms.filter((n) => n !== rel)
      .flatMap((n) => RELACIONS[n].parelles.map(([, y]) => y));
    const cands = [...barreja(r, mateixTipus), ...barreja(r, altresRel)];
    const dolents = [];
    for (const x of cands) {
      if (x === bona || x === a || x === b || x === c) continue;
      if (compleix(rel, c, x)) continue;                 // seria una altra bona
      if (dolents.includes(x)) continue;
      dolents.push(x);
      if (dolents.length === 3) break;
    }
    if (dolents.length < 3) continue;

    const correcta = posicioBona(seed, 4, 'analogia');
    const opcions = [];
    let i = 0;
    for (let k = 0; k < 4; k++) opcions.push(k === correcta ? bona : dolents[i++]);

    return {
      seed, mena: 'analogia', relacio: rel, a, b, c, opcions, correcta,
      enunciat: `Escolliu la paraula que millor completi l'analogia: `
        + `${a.toUpperCase()} és a ${b.toUpperCase()} el que ${c.toUpperCase()} és a…`,
      control: {
        opcionsDiferents: new Set(opcions).size === 4,
        laParelladaEsReal: compleix(rel, a, b) && compleix(rel, c, bona),
        // Cap distractor no completa la relació amb c.
        capDistractorCompleix: opcions.every((o, k) => compleix(rel, c, o) === (k === correcta)),
        capParaulaDeLEnunciat: !opcions.some((o) => [a, b, c].includes(o)),
        nomesUnaBona: opcions.filter((o) => compleix(rel, c, o)).length === 1,
      },
    };
  }
  throw new Error(`no s'ha pogut generar l'analogia ${seed}`);
}

export function generaItem(seed) {
  return posicioBona(seed, 2, 'menaVerbal') === 0 ? generaParaula(seed) : generaAnalogia(seed);
}

/** Un full de text per repassar-lo. Aquesta família no porta dibuix. */
export function textFull(items) {
  return items.map((it, i) => `${i + 1}. ${it.enunciat}\n`
    + it.opcions.map((o, k) => `    ${'abcd'[k]}) ${o}`).join('')).join('\n\n');
}
