// L'atzar, en un sol lloc.
//
// Hi ha dos paranys que ja ens han mossegat, i tots dos surten aquí perquè
// no tornin a passar en cap família:
//
//  1. Barrejar amb `sort(() => r() - 0.5)` NO reparteix igual. Sembla que
//     sí, però no: uns ordres surten molt més sovint que altres. És el
//     motiu que la lletra bona sortís desigual. Es fa amb Fisher–Yates.
//
//  2. Triar on va la resposta bona amb el mateix atzar que ha fabricat
//     l'ítem tampoc reparteix igual, i costa més de veure. Els generadors
//     fan intents fins que en surt un de bo, i uns ítems en necessiten més
//     que altres; quan s'arriba a triar la posició, l'atzar ja ha avançat
//     un nombre de passos que depèn de l'ítem. Per això la posició es treu
//     d'un atzar a part, sembrat només amb la llavor.

/** Atzar repetible: la mateixa llavor dona sempre la mateixa sèrie. */
export function rng(seed, sal = 1) {
  let s = ((seed * 2654435761) ^ (sal * 2246822519)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export const tria = (r, a) => a[Math.floor(r() * a.length)];
export const entre = (r, a, b) => a + Math.floor(r() * (b - a + 1));

/** Barreja de debò. */
export function barreja(r, a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/**
 * On va la resposta bona.
 *
 * La `sal` és el nom de la família, i no és opcional per caprici: si la
 * posició depengués només de la llavor, dues famílies generades amb les
 * mateixes llavors donarien la MATEIXA lletra ítem a ítem. Amb tres menes
 * de gràfic i les llavors 1101 a 1104 sortien a, a, d, b a totes tres.
 * En un examen barrejat això es notaria de seguida.
 */
export function posicioBona(seed, quantes, sal = '') {
  let s = ((seed + 1) * 2654435761) >>> 0;
  for (let i = 0; i < sal.length; i++) {
    s = (((s ^ sal.charCodeAt(i)) >>> 0) * 16777619) >>> 0;
  }
  s = (s ^ (s >>> 15)) >>> 0;
  s = (s * 2246822519) >>> 0;
  s = (s ^ (s >>> 13)) >>> 0;
  return s % quantes;
}
