// Prepara el cos d'una fitxa per al mode estudi.
//
// Les fitxes de `content/` són documents HTML sencers: porten <meta>,
// <style> i tot el text embolicat dins d'un únic <div class="wrapper">.
// Si això es fica al lector tal qual, el document té sis "blocs" i un
// d'ells té 29.000 caràcters — o sigui que subratllar-hi és inservible:
// els offsets són enormes i qualsevol retoc del text els desancora tots.
//
// Aquí es deixa el cos amb blocs de mida raonable: fora el capçal, i si
// tot penja d'un sol contenidor, se'n pugen els fills.
//
// IMPORTANT: aquest fitxer és bessó del de l'app
// (`infopol-app/src/lib/estudi-cos.ts`). Els subratllats s'ancoren per
// índex de bloc, així que web i app han de partir el text EXACTAMENT
// igual. Si es canvia aquí, s'ha de canviar allà el mateix dia.

/** Etiquetes que no són text llegible i no han de comptar com a bloc. */
const FORA = new Set(['META', 'LINK', 'TITLE', 'STYLE', 'SCRIPT', 'BASE', 'HEAD', 'NOSCRIPT']);

/** Contenidors que no aporten res si només embolcallen la resta. */
const EMBOLCALLS = new Set(['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'BODY']);

/**
 * Torna l'HTML llest per al lector: cada fill de primer nivell del
 * resultat és un bloc ancorable.
 */
export function normalitzaCos(html: string): string {
  if (typeof document === 'undefined') return html;

  const caixa = document.createElement('div');
  caixa.innerHTML = html;

  // 1. Fora el capçal i tot el que no es llegeix.
  caixa.querySelectorAll([...FORA].join(',')).forEach((n) => n.remove());

  // 2. Mentre tot pengi d'un sol embolcall, pujar-ne els fills. Es fa en
  //    bucle perquè sovint n'hi ha més d'un de niat.
  let voltes = 0;
  while (voltes++ < 10) {
    const fills = Array.from(caixa.children);
    if (fills.length !== 1) break;
    const unic = fills[0];
    if (!EMBOLCALLS.has(unic.tagName) || unic.children.length === 0) break;
    caixa.innerHTML = unic.innerHTML;
  }

  // 3. Un bloc de més de 4.000 caràcters segueix sent massa gros per
  //    ancorar-hi res amb cara i ulls: si a dins hi ha fills, s'obre.
  //    Es repeteix fins que no en queda cap d'obribleiment gran.
  for (let ronda = 0; ronda < 4; ronda++) {
    let obert = false;
    for (const fill of Array.from(caixa.children)) {
      const llarg = (fill.textContent ?? '').length;
      if (llarg > 4000 && fill.children.length > 1 && EMBOLCALLS.has(fill.tagName)) {
        fill.replaceWith(...Array.from(fill.childNodes));
        obert = true;
      }
    }
    if (!obert) break;
  }

  // 4. Fora els blocs buits: sumarien índexs sense contenir res.
  for (const fill of Array.from(caixa.children)) {
    if (!(fill.textContent ?? '').trim() && fill.children.length === 0) fill.remove();
  }

  return caixa.innerHTML;
}
