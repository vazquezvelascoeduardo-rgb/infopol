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

  // ── Ampliació ──────────────────────────────────────────────────
  // La taula era de trenta paraules i donava un sostre de 216 ítems
  // diferents: no arribava als dos-cents de marge. Amb aquestes hi arriba
  // de sobres. Cada entrada segueix la mateixa regla: un sol sinònim, un
  // sol antònim, i els «propers» del mateix camp que expressament no són
  // ni una cosa ni l'altra.
  { p: 'ampli', s: 'espaiós', a: 'estret', propers: ['llarg', 'alt', 'obert'] },
  { p: 'escàs', s: 'insuficient', a: 'abundant', propers: ['petit', 'just', 'car'] },
  { p: 'temor', s: 'por', a: 'valor', propers: ['dubte', 'respecte', 'nervi'] },
  { p: 'dubte', s: 'incertesa', a: 'certesa', propers: ['pregunta', 'error', 'calma'] },
  { p: 'permís', s: 'autorització', a: 'prohibició', propers: ['document', 'sol·licitud', 'targeta'] },
  { p: 'càstig', s: 'sanció', a: 'premi', propers: ['avís', 'judici', 'denúncia'] },
  { p: 'ordre', s: 'manament', a: 'desordre', propers: ['avís', 'consell', 'petició'] },
  { p: 'veritat', s: 'certesa', a: 'mentida', propers: ['dubte', 'prova', 'secret'] },
  { p: 'culpable', s: 'responsable', a: 'innocent', propers: ['acusat', 'sospitós', 'detingut'] },
  { p: 'pesat', s: 'feixuc', a: 'lleuger', propers: ['gros', 'dens', 'gran'] },
  { p: 'ple', s: 'complet', a: 'buit', propers: ['gran', 'ample', 'tancat'] },
  { p: 'proper', s: 'pròxim', a: 'llunyà', propers: ['veí', 'davant', 'seguit'] },
  { p: 'freqüent', s: 'habitual', a: 'rar', propers: ['conegut', 'previst', 'ràpid'] },
  { p: 'sencer', s: 'íntegre', a: 'partit', propers: ['gran', 'únic', 'sòlid'] },
  { p: 'tancar', s: 'cloure', a: 'obrir', propers: ['empènyer', 'girar', 'prémer'] },
  { p: 'avançar', s: 'progressar', a: 'retrocedir', propers: ['córrer', 'moure', 'arrencar'] },
  { p: 'guanyar', s: 'vèncer', a: 'perdre', propers: ['jugar', 'lluitar', 'competir'] },
  { p: 'acceptar', s: 'admetre', a: 'rebutjar', propers: ['rebre', 'escoltar', 'pensar'] },
  { p: 'ajudar', s: 'auxiliar', a: 'perjudicar', propers: ['acompanyar', 'mirar', 'avisar'] },
  { p: 'callar', s: 'emmudir', a: 'parlar', propers: ['escoltar', 'pensar', 'esperar'] },
  { p: 'entrar', s: 'accedir', a: 'sortir', propers: ['passar', 'obrir', 'arribar'] },
  { p: 'aparèixer', s: 'sorgir', a: 'desaparèixer', propers: ['venir', 'créixer', 'moure'] },
  { p: 'construir', s: 'edificar', a: 'enderrocar', propers: ['dissenyar', 'pintar', 'reparar'] },
  { p: 'encendre', s: 'engegar', a: 'apagar', propers: ['cremar', 'escalfar', 'il·luminar'] },
  { p: 'omplir', s: 'emplenar', a: 'buidar', propers: ['posar', 'tancar', 'cobrir'] },
  { p: 'aturar', s: 'parar', a: 'arrencar', propers: ['girar', 'mirar', 'esperar'] },
  { p: 'lligar', s: 'nuar', a: 'deslligar', propers: ['estirar', 'penjar', 'tapar'] },
  { p: 'amagat', s: 'ocult', a: 'visible', propers: ['fosc', 'tancat', 'lluny'] },
  { p: 'cansat', s: 'fatigat', a: 'descansat', propers: ['adormit', 'lent', 'dèbil'] },
  { p: 'alegria', s: 'joia', a: 'tristesa', propers: ['rialla', 'festa', 'sorpresa'] },
  { p: 'calma', s: 'tranquil·litat', a: 'nerviosisme', propers: ['silenci', 'pausa', 'descans'] },
  { p: 'pressa', s: 'urgència', a: 'lentitud', propers: ['nervi', 'retard', 'hora'] },
  { p: 'perill', s: 'risc', a: 'seguretat', propers: ['por', 'avís', 'dany'] },
  { p: 'auxili', s: 'socors', a: 'abandó', propers: ['crida', 'atenció', 'cura'] },
  { p: 'multa', s: 'penalització', a: 'recompensa', propers: ['avís', 'denúncia', 'rebut'] },
  { p: 'prova', s: 'evidència', a: null, propers: ['indici', 'sospita', 'rumor'] },
  { p: 'indici', s: 'senyal', a: null, propers: ['prova', 'sospita', 'dubte'] },
  { p: 'delicte', s: 'crim', a: null, propers: ['multa', 'judici', 'denúncia'] },
  { p: 'greu', s: 'seriós', a: 'lleu', propers: ['gran', 'llarg', 'urgent'] },
  { p: 'urgent', s: 'immediat', a: 'ajornable', propers: ['ràpid', 'important', 'greu'] },
  { p: 'costum', s: 'hàbit', a: null, propers: ['norma', 'regla', 'moda'] },
  { p: 'norma', s: 'regla', a: null, propers: ['consell', 'costum', 'ordre'] },
  { p: 'impedir', s: 'evitar', a: 'permetre', propers: ['avisar', 'retardar', 'vigilar'] },
  { p: 'vigilar', s: 'controlar', a: 'desatendre', propers: ['mirar', 'seguir', 'protegir'] },
  { p: 'protegir', s: 'emparar', a: 'desemparar', propers: ['vigilar', 'acompanyar', 'tapar'] },
  { p: 'avisar', s: 'advertir', a: 'callar', propers: ['cridar', 'escriure', 'esperar'] },
  { p: 'descobrir', s: 'trobar', a: 'ocultar', propers: ['buscar', 'mirar', 'obrir'] },
  { p: 'buscar', s: 'cercar', a: null, propers: ['trobar', 'mirar', 'seguir'] },
  { p: 'repartir', s: 'distribuir', a: 'acumular', propers: ['donar', 'portar', 'ordenar'] },
  { p: 'escollir', s: 'triar', a: null, propers: ['pensar', 'dubtar', 'buscar'] },
  { p: 'decidir', s: 'resoldre', a: 'dubtar', propers: ['pensar', 'provar', 'acordar'] },
  { p: 'fàcil', s: 'senzill', a: 'difícil', propers: ['curt', 'clar', 'ràpid'] },
  { p: 'curt', s: 'breu', a: 'llarg', propers: ['petit', 'ràpid', 'estret'] },
  { p: 'alt', s: 'elevat', a: 'baix', propers: ['gran', 'llarg', 'prim'] },
  { p: 'gruixut', s: 'gros', a: 'prim', propers: ['ample', 'pesat', 'dens'] },
  { p: 'dur', s: 'resistent', a: 'tou', propers: ['fort', 'sec', 'fred'] },
  { p: 'sec', s: 'eixut', a: 'humit', propers: ['dur', 'calent', 'aspre'] },
  { p: 'calent', s: 'càlid', a: 'fred', propers: ['tebi', 'sec', 'viu'] },
  { p: 'lluminós', s: 'brillant', a: 'apagat', propers: ['clar', 'blanc', 'viu'] },
  { p: 'sorollós', s: 'estrident', a: 'silenciós', propers: ['fort', 'molest', 'viu'] },
  { p: 'suau', s: 'delicat', a: 'aspre', propers: ['tou', 'fi', 'lleuger'] },
  { p: 'ric', s: 'adinerat', a: 'pobre', propers: ['gran', 'generós', 'afortunat'] },
  { p: 'car', s: 'costós', a: 'barat', propers: ['alt', 'nou', 'bo'] },
  { p: 'útil', s: 'profitós', a: 'inútil', propers: ['bo', 'nou', 'senzill'] },
  { p: 'necessari', s: 'imprescindible', a: 'prescindible', propers: ['útil', 'urgent', 'important'] },
  { p: 'important', s: 'rellevant', a: 'insignificant', propers: ['gran', 'greu', 'urgent'] },
  { p: 'cert', s: 'veritable', a: 'fals', propers: ['clar', 'segur', 'provat'] },
  { p: 'segur', s: 'fiable', a: 'insegur', propers: ['cert', 'ferm', 'tranquil'] },
  { p: 'possible', s: 'factible', a: 'impossible', propers: ['fàcil', 'probable', 'previst'] },
  { p: 'probable', s: 'versemblant', a: 'improbable', propers: ['possible', 'segur', 'previst'] },
  { p: 'modern', s: 'actual', a: 'antiquat', propers: ['nou', 'jove', 'recent'] },
  { p: 'jove', s: 'juvenil', a: 'ancià', propers: ['nou', 'petit', 'fort'] },
  { p: 'lent', s: 'pausat', a: 'ràpid', propers: ['tranquil', 'pesat', 'llarg'] },
  { p: 'sovint', s: 'freqüentment', a: 'rarament', propers: ['sempre', 'aviat', 'ara'] },
  { p: 'aviat', s: 'prompte', a: 'tard', propers: ['ara', 'ràpid', 'abans'] },
  { p: 'abans', s: 'prèviament', a: 'després', propers: ['aviat', 'ara', 'ja'] },
  { p: 'sempre', s: 'contínuament', a: 'mai', propers: ['sovint', 'ara', 'encara'] },
  { p: 'obligar', s: 'forçar', a: 'dispensar', propers: ['demanar', 'manar', 'insistir'] },
  { p: 'trencar', s: 'partir', a: 'reparar', propers: ['tallar', 'doblegar', 'obrir'] },
  { p: 'guardar', s: 'desar', a: 'llençar', propers: ['tancar', 'ordenar', 'portar'] },
  { p: 'saltar', s: 'botar', a: null, propers: ['córrer', 'caminar', 'pujar'] },
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
      ['Menorca', 'illa'], ['Banyoles', 'llac'], ['Garraf', 'massís']],
  },
  unitat: {
    nom: 'magnitud i la unitat amb què es mesura',
    parelles: [['longitud', 'metre'], ['pes', 'quilo'], ['volum', 'litre'],
      ['temps', 'segon'], ['temperatura', 'grau'], ['potència', 'watt']],
  },
  lloc: {
    nom: 'ofici i on treballa',
    parelles: [['metge', 'hospital'], ['mestre', 'escola'], ['jutge', 'jutjat'],
      ['bomber', 'parc'], ['cuiner', 'cuina'], ['forner', 'forn']],
  },
  fruit: {
    nom: 'arbre i el seu fruit',
    parelles: [['pomera', 'poma'], ['olivera', 'oliva'], ['taronger', 'taronja'],
      ['cirerer', 'cirera'], ['perera', 'pera'], ['ametller', 'ametlla']],
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
