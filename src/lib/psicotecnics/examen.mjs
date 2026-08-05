// Fa un examen sencer en HTML, per imprimir-lo en paper.
//
// Segueix la forma dels quaderns: cada vegada que comença un model nou
// d'exercici hi ha una pàgina d'explicació —què s'ha de fer, com es resol i
// un truc— i tot seguit les preguntes d'aquell model. Al final, el
// full de respostes.
//
// Surt HTML i no PDF perquè el PDF el fa el Chrome, que ja sap partir
// pàgines, numerar-les i no tallar un dibuix per la meitat. El que hi ha
// aquí és la feina de decidir QUÈ va a cada pàgina; el com es pinta, ho fa
// el navegador.
import { BLOCS, CATEGORIES, genera, repartimentBloc } from './cataleg.mjs';
import { GUIA } from './guia.mjs';

const cat = (id) => CATEGORIES.find((c) => c.id === id);
const escapa = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Les opcions d'un ítem, com a llista A B C D. */
function opcions(it) {
  return `<ol class="op">${it.opcions.map((o) => `<li>${o.svg
    ? `<span class="fig">${o.svg}</span>` : escapa(o.text)}</li>`).join('')}</ol>`;
}

/** Una pregunta amb el seu número. */
function pregunta(it, num) {
  const grafic = it.svg ? `<div class="dib">${it.svg}</div>` : '';
  const objectiu = it.svgObjectiu ? `<div class="obj">${it.svgObjectiu}</div>` : '';
  return `<li class="q" value="${num}">`
    + `<div class="en">${escapa(it.enunciat)}</div>${objectiu}${grafic}${opcions(it)}</li>`;
}

/** La pàgina d'explicació que va davant de cada model. */
function portadaModel(id, exemple) {
  const g = GUIA[id];
  if (!g) return '';
  const c = cat(id);
  return `<section class="model">
  <h2>${escapa(g.titol)}</h2>
  <p class="sub">${escapa(g.pregunta)}</p>
  <h3>Explicació</h3>
  <p>${escapa(g.explicacio)}</p>
  <h3>Com es resol</h3>
  <ol class="passos">${g.resolucio.map((p) => `<li>${escapa(p)}</li>`).join('')}</ol>
  <div class="exemple">
    <h3>Exemple resolt</h3>
    <div class="en">${escapa(exemple.enunciat)}</div>
    ${exemple.svgObjectiu ? `<div class="obj">${exemple.svgObjectiu}</div>` : ''}
    ${exemple.svg ? `<div class="dib">${exemple.svg}</div>` : ''}
    <ol class="op mostra">${exemple.opcions.map((o, i) =>
    `<li class="${i === exemple.correcta ? 'bona' : ''}">${o.svg
      ? `<span class="fig">${o.svg}</span>` : escapa(o.text)}</li>`).join('')}</ol>
    <p class="resp">La resposta és la <strong>${'ABCD'[exemple.correcta]}</strong>.</p>
  </div>
  <div class="truc"><h3>Trucs i consells</h3><p>${escapa(g.truc)}</p></div>
  <p class="peu">${escapa(c ? c.descripcio : '')}</p>
</section>`;
}

/**
 * Munta l'examen: quines preguntes hi ha, en quin ordre i quina és la bona.
 *
 * Va a part de pintar-lo perquè les respostes del final han de sortir
 * d'AQUÍ, no de tornar a generar res pel seu compte. Si el full de respostes
 * es fes a banda, n'hi hauria prou que una llavor no quadrés perquè tot el
 * full anés desplaçat, i això no es veu mirant el PDF: es veu quan algú es
 * corregeix i li surt un 3.
 *
 * `perBloc` és quantes preguntes vol cada aptitud. Es reparteixen entre les
 * famílies del bloc i s'agrupen per família, no barrejades: així cada model
 * va precedit de la seva explicació, com als quaderns. Un simulacre de debò
 * va barrejat, però això no és un simulacre, és per treballar.
 */
export function munta({ perBloc = 80, llavor = 1 } = {}) {
  let n = 0;
  let seed = llavor;
  const blocs = BLOCS.map((b) => {
    const parts = repartimentBloc(b.id, perBloc).map(({ id, n: quantes }) => {
      // Un ítem a part per a l'exemple resolt, que no compta com a pregunta.
      const exemple = genera(id, seed + 9973);
      const items = [];
      // Les llavors seguides NO donen sempre preguntes diferents. A les
      // famílies que surten d'una taula —les verbals— o que tenen poques
      // combinacions, dues llavors poden caure a la mateixa pregunta, i en
      // un examen de paper això és un error de debò: la mateixa pregunta
      // dues vegades. Per això es va provant i es salten les repetides.
      //
      // També es descarta la de l'exemple resolt: seria regalada.
      const vistes = new Set([empremta(exemple)]);
      for (let provada = 0; items.length < quantes && provada < quantes * 60; provada++) {
        const it = genera(id, seed + provada);
        const e = empremta(it);
        if (vistes.has(e)) continue;
        vistes.add(e);
        n += 1;
        items.push({ num: n, llavor: seed + provada, item: it });
      }
      seed += quantes * 60 + 1;
      return { id, quantes: items.length, exemple, items };
    });
    return { bloc: b, parts };
  });
  return { blocs, total: n };
}

/**
 * Com es veu una pregunta. Dues preguntes són la mateixa si això coincideix.
 *
 * NOMÉS l'enunciat i el dibuix, sense les opcions. Al principi hi posava
 * també les opcions i era massa tou: el mateix problema de càlcul amb les
 * respostes canviades de lloc passava per pregunta nova, i a l'examen sortia
 * dues vegades. Qui la llegeix no mira si les opcions estan en un altre
 * ordre; veu la mateixa pregunta.
 */
const empremta = (it) => `${it.enunciat}|${it.svg || ''}|${it.svgObjectiu || ''}`;

/** Les respostes, per corregir. Surten del mateix muntatge que les preguntes. */
function fullRespostes(blocs) {
  return blocs.flatMap(({ bloc, parts }) => parts.map((p) => {
    const caselles = p.items.map(({ num, item }) =>
      `<span class="r"><b>${num}</b>${'ABCD'[item.correcta]}</span>`);
    return `<div class="grupR"><h4>${escapa(bloc.nom)} — `
      + `${escapa(GUIA[p.id] ? GUIA[p.id].titol : p.id)}</h4>`
      + `<div class="caselles">${caselles.join('')}</div></div>`;
  })).join('');
}

/** L'HTML sencer, a punt per imprimir. */
export function html({ perBloc = 80, llavor = 1, titol = 'Psicotècnics' } = {}) {
  const { blocs, total } = munta({ perBloc, llavor });

  const cos = blocs.map(({ bloc, parts }) => `
<section class="bloc">
  <div class="capBloc">
    <p class="etiqueta">Aptitud</p>
    <h1>${escapa(bloc.nom)}</h1>
    <p class="sub">${escapa(bloc.descripcio)}</p>
    <p class="compte">${parts.reduce((s, p) => s + p.quantes, 0)} preguntes, `
    + `${parts.length} ${parts.length === 1 ? 'model' : 'models'} d'exercici</p>
  </div>
</section>
${parts.map((p) => portadaModel(p.id, p.exemple) + `<section class="preguntes">
  <h2 class="titolTanda">${escapa(GUIA[p.id] ? GUIA[p.id].titol : p.id)}</h2>
  <ol class="qs">${p.items.map(({ num, item }) => pregunta(item, num)).join('')}</ol>
</section>`).join('')}`).join('');

  return `<!doctype html>
<html lang="ca"><head><meta charset="utf-8"><title>${escapa(titol)}</title>
<style>
  @page { size: A4; margin: 14mm 13mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", system-ui, sans-serif; color: #15151C;
         font-size: 10.5pt; line-height: 1.45; margin: 0; }

  /* La portada de cada aptitud, a pàgina sencera. */
  .bloc { page-break-before: always; height: 245mm;
          display: flex; align-items: center; justify-content: center; }
  .bloc:first-child { page-break-before: avoid; }
  .capBloc { text-align: center; border-top: 3px solid #C2185B;
             border-bottom: 3px solid #C2185B; padding: 26mm 8mm; width: 100%; }
  .capBloc h1 { font-size: 30pt; margin: 6px 0 10px; letter-spacing: -0.5px; }
  .etiqueta { text-transform: uppercase; letter-spacing: 3px; font-size: 9pt;
              color: #C2185B; font-weight: 700; margin: 0; }
  .capBloc .sub { font-size: 12pt; color: #55555F; margin: 0 0 14px; }
  .compte { font-size: 10pt; color: #7A7A85; margin: 0; }

  /* L'explicació de cada model. */
  .model { page-break-before: always; page-break-inside: avoid;
           border: 1.5pt solid #2C3E56; border-radius: 4pt; padding: 7mm 8mm; }
  .model h2 { font-size: 17pt; margin: 0; color: #2C3E56; }
  .model .sub { font-style: italic; color: #55555F; margin: 2px 0 10px; }
  .model h3 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 1.5px;
              color: #C2185B; margin: 11px 0 4px; }
  .passos { margin: 0; padding-left: 18px; }
  .passos li { margin-bottom: 3px; }
  .exemple { background: #F4F6F9; border-radius: 3pt; padding: 5mm; margin-top: 10px; }
  .exemple h3 { margin-top: 0; }
  .truc { border-left: 3pt solid #F2C14E; padding-left: 5mm; margin-top: 10px; }
  .truc h3 { margin-top: 0; }
  .peu { font-size: 8.5pt; color: #9A9AA5; margin: 10px 0 0; }

  .titolTanda { font-size: 12pt; color: #2C3E56; margin: 0 0 6px;
                border-bottom: 1pt solid #D5D8DE; padding-bottom: 3px; }
  .preguntes { page-break-before: always; }

  /* Les preguntes. Cadascuna sencera a la seva pàgina, mai partida. */
  .qs { margin: 0; padding-left: 22px; }
  .q { page-break-inside: avoid; margin-bottom: 7mm; padding-left: 2px; }
  .en { margin-bottom: 3px; }
  .dib { margin: 4px 0; }
  .dib svg { max-width: 108mm; max-height: 52mm; height: auto; }
  .obj svg { max-width: 26mm; max-height: 13mm; }

  .op { list-style: none; margin: 3px 0 0; padding: 0;
        display: flex; flex-wrap: wrap; gap: 3mm 5mm; align-items: center; }
  .op li { counter-increment: opt; display: flex; align-items: center; gap: 2mm;
           min-width: 22mm; }
  .op li::before { content: counter(opt, upper-alpha); font-weight: 700;
                   font-size: 9pt; color: #fff; background: #2C3E56;
                   width: 5.5mm; height: 5.5mm; border-radius: 50%;
                   display: inline-flex; align-items: center; justify-content: center;
                   flex: none; }
  .op { counter-reset: opt; }
  .fig svg { max-height: 17mm; max-width: 32mm; height: auto; vertical-align: middle; }
  .mostra li.bona::before { background: #C2185B; }
  .mostra li.bona { font-weight: 700; }
  .resp { margin: 6px 0 0; font-size: 10pt; }

  /* El full de respostes. */
  .respostes { page-break-before: always; }
  .grupR { page-break-inside: avoid; margin-bottom: 5mm; }
  .grupR h4 { margin: 0 0 3px; font-size: 9.5pt; color: #2C3E56; }
  .caselles { display: flex; flex-wrap: wrap; gap: 1.5mm; }
  .r { font-size: 8.5pt; border: 0.6pt solid #C3C7CE; border-radius: 2pt;
       padding: 0.6mm 1.6mm; }
  .r b { color: #9A9AA5; margin-right: 1.2mm; font-weight: 600; }
</style></head><body>

<section class="bloc">
  <div class="capBloc">
    <p class="etiqueta">InfoPol</p>
    <h1>${escapa(titol)}</h1>
    <p class="sub">${blocs.length} aptituds · ${total} preguntes</p>
    <p class="compte">Cada model d'exercici va precedit de com funciona,
      com es resol i un exemple fet. Les respostes, al final.</p>
  </div>
</section>
${cos}
<section class="respostes">
  <h2 class="titolTanda">Respostes</h2>
  ${fullRespostes(blocs)}
</section>
</body></html>`;
}
