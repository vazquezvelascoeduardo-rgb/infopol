// Converteix els exàmens oficials de Mossos (PDF) en TestTopics.
//
// Regla de casa: davant del dubte, la pregunta FORA. En una app d'estudi una
// pregunta amb la resposta canviada és pitjor que no tenir-la, perquè algú
// se l'aprendrà malament. Per això tot es valida i el que no quadra es
// descarta amb un avís, en comptes d'endevinar-ho.
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];

/**
 * Línies que són només el peu de pàgina institucional.
 *
 * Es filtren per línia sencera i no dins del text: "Departament d'Interior"
 * i "Direcció General de la Policia" surten TAMBÉ enmig de les respostes
 * —són el temari—, i tallar-hi es menjava mitja opció.
 */
const LINIA_PEU =
  /^(Generalitat de Catalunya|Departament d[’']Interior|Direcció General de la Policia|Institut de Seguretat Pública|Núm\.? DNI.*|Pàgina \d+.*|\d+\s*de\s*\d+)$/i;

/** Neteja el que arrossega l'extracció del PDF. */
function net(s) {
  return (
    s
      .replace(/\s*--\s*\d+\s*of\s*\d+\s*--\s*/g, ' ')
      .replace(/­/g, '') // guionet tou de partició
      .replace(/\s+/g, ' ')
      // Mot partit a final de línia: "Barcelo- na" → "Barcelona". Només si
      // el que segueix va en minúscula: "vint-i- cinc" o "ex- alcalde" també
      // s'uneixen bé, i un guió de debò va enganxat i no en porta, d'espai.
      .replace(/(\p{Ll})-\s+(\p{Ll})/gu, '$1$2')
      .trim()
  );
}

/**
 * Treu les preguntes del text del quadernet.
 *
 * El format és sempre el mateix: "N." i l'enunciat, i després quatre línies
 * "A." "B." "C." "D.". L'enunciat i les opcions poden ocupar més d'una línia
 * —el PDF les parteix on li convé—, així que s'acumula fins a trobar la
 * marca següent.
 */
/**
 * On s'acaben les preguntes i comença la plantilla de respostes.
 *
 * Sense aquest tall, l'última opció de l'últim enunciat s'empassava la
 * taula de respostes sencera, que ve just a continuació al mateix PDF.
 */
function talla(text) {
  const linies = text.split('\n');
  const perTitol = linies.findIndex((l) =>
    /PREGUNTA\s*\t?\s*RESPOSTA|PLANTILLA\b|N[ÚU]M\.?\s*DE REGISTRE DE (LA )?CONVOCAT[ÒO]RIA|FULL DE RESPOSTES/i.test(
      l,
    ),
  );
  // Alguns anys la taula arrenca sense cap títol al davant. Es reconeix
  // igualment: una línia amb dos o més parells "número lletra" seguits no
  // és mai una pregunta ni una opció.
  const perForma = linies.findIndex(
    (l) => (l.replace(/\t/g, ' ').match(/\b\d{1,3}\s+[A-D]\b/g) || []).length >= 2,
  );
  const cands = [perTitol, perForma].filter((i) => i > 0);
  return cands.length ? linies.slice(0, Math.min(...cands)).join('\n') : text;
}

function preguntes(text) {
  const linies = talla(text)
    .split('\n')
    .map((l) => l.replace(/\t/g, ' ').trim());
  const out = [];
  let q = null;
  let camp = null; // 'text' | 0 | 1 | 2 | 3

  const tanca = () => {
    if (q) out.push(q);
    q = null;
    camp = null;
  };

  for (const cru of linies) {
    const l = net(cru);
    if (!l || LINIA_PEU.test(l)) continue;

    const mQ = /^(\d{1,3})\s*\.\s*(.*)$/.exec(l);
    // Una línia que comença per número i punt obre pregunta, però només si
    // el número va en ordre: dins d'un enunciat hi pot haver "1. " d'una
    // enumeració, i partiria la pregunta per la meitat.
    if (mQ && (!q ? true : Number(mQ[1]) === q.num + 1) && !/^[A-D]\s*\./.test(l)) {
      const num = Number(mQ[1]);
      if (!q || num === q.num + 1 || out.length === 0) {
        tanca();
        q = { num, text: mQ[2] || '', opts: ['', '', '', ''] };
        camp = 'text';
        continue;
      }
    }

    // Segons l'any, les opcions van amb punt ("A.") o amb parèntesi ("A)").
    const mO = /^([A-D])\s*[.)]\s*(.*)$/.exec(l);
    if (mO && q) {
      camp = mO[1].charCodeAt(0) - 65;
      q.opts[camp] = mO[2] || '';
      continue;
    }

    // Continuació de la línia anterior.
    if (q && camp !== null) {
      if (camp === 'text') q.text += ' ' + l;
      else q.opts[camp] += ' ' + l;
    }
  }
  tanca();
  return out.map((x) => ({ ...x, text: net(x.text), opts: x.opts.map(net) }));
}

/**
 * Treu la plantilla de respostes.
 *
 * Ve en taula de dues columnes i cada fila pot dur un o dos parells
 * número+lletra. Es tornen totes les columnes per separat, perquè segons
 * l'any la segona columna és la continuació del mateix model (26-50) o bé
 * un model diferent.
 */
function plantilles(text) {
  const colA = new Map();
  const colB = new Map();
  for (const cru of text.split('\n')) {
    const l = cru.replace(/\t/g, ' ').trim();
    // Només lletres A-D majúscules: si el PDF ha llegit una "e" o una "," on
    // hi havia una lletra, aquella fila no compta i ja saltarà a la validació.
    const parells = [...l.matchAll(/\b(\d{1,3})\s+([A-D])\b/g)];
    if (!parells.length) continue;
    if (parells[0]) {
      const [, n, r] = parells[0];
      if (!colA.has(Number(n))) colA.set(Number(n), r);
    }
    if (parells[1]) {
      const [, n, r] = parells[1];
      if (!colB.has(Number(n))) colB.set(Number(n), r);
    }
  }
  return { colA, colB };
}

/**
 * Ajunta les dues columnes de la plantilla quan són el mateix model.
 *
 * Segons l'any, la segona columna és la continuació (26-50) o un model
 * diferent (torna a començar per l'1). Es decideix mirant si els números es
 * trepitgen: si no es trepitgen, és continuació.
 */
function fusiona(colA, colB) {
  const solapa = [...colB.keys()].some((n) => colA.has(n));
  if (solapa) return { model1: colA, model2: colB };
  const junts = new Map(colA);
  for (const [n, r] of colB) junts.set(n, r);
  return { model1: junts, model2: null };
}

export { preguntes, plantilles, fusiona, net, DIR };
