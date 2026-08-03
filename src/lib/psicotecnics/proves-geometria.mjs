// Proves del motor: geometria pura, sense dibuixos ni atzar.
//
// Jo no puc mirar un SVG i dir si està bé. Això sí que ho puc dir, perquè
// no depèn de cap criteri: o els números quadren o no quadren.
import * as P from './plegat.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

// ── Un dau occidental de veritat ─────────────────────────────────
// Al vèrtex on es troben l'1, el 2 i el 3, un dau occidental es llegeix en
// sentit antihorari. Muntat amb 1 a +Y, 2 a +Z i 3 a +X, això es compleix.
// Les oposades sumen set.
const OPOSADA = { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };
const NUM = { '+Y': 1, '+Z': 2, '+X': 3, '-Y': 6, '-Z': 5, '-X': 4 };
const dau = P.CARES.map((c) => ({
  dibuix: String(NUM[c.nom]), u: c.u, v: c.v, n: c.n,
}));

titol('1. El marc de cada referència és coherent');
for (const ref of [...P.VISTA_CUB, ...P.CARES]) {
  cal(`${ref.nom}: v×u = n`, P.igual(P.creu(ref.v, ref.u), ref.n), ref.nom);
}
for (const ref of P.VISTA_MIRALL) {
  cal(`mirall ${ref.nom}: v×u = −n`, P.igual(P.creu(ref.v, ref.u), P.neg(ref.n)), ref.nom);
}
for (const ref of [...P.VISTA_CUB, ...P.VISTA_MIRALL, ...P.CARES]) {
  cal(`${ref.nom}: l'origen existeix`, P.origen(ref) !== undefined, ref.nom);
  cal(`${ref.nom}: l'origen és el declarat`, P.igual(P.origen(ref), ref.o), ref.nom);
}

titol('2. Les 24 orientacions, i el dau segueix sent un dau');
const totes = P.orientacions(dau);
cal('n\'hi ha 24', totes.length === 24, `n'hi ha ${totes.length}`);
for (const c of totes) {
  cal('sis cares diferents', new Set(c.map((f) => P.clau(f.n))).size === 6);
  for (const f of c) {
    const op = c.find((g) => P.igual(g.n, P.neg(f.n)));
    cal('les oposades sumen set', Number(f.dibuix) + Number(op.dibuix) === 7,
      `${f.dibuix} contra ${op.dibuix}`);
    cal('cap cara del revés', P.igual(P.creu(f.v, f.u), f.n));
  }
}

// ── Quiralitat ───────────────────────────────────────────────────
// La prova que ho tanca. Es mira on cau el centre de cada rodona a la
// pantalla i es mira en quin sentit es llegeixen 1→2→3.
// Amb la y de la pantalla cap avall, antihorari vol dir producte creuat < 0.
const centre = (ref) => {
  const o = ref.o;
  const c = P.suma(P.suma(o, P.escala(ref.u, 0.5)), P.escala(ref.v, 0.5));
  return P.projecta(c);
};
const sentit = (a, b, c) => {
  const z = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
  return z < 0 ? 'antihorari' : 'horari';
};

titol('3. Les rodones cauen on toca a la pantalla');
const pos = Object.fromEntries([...P.VISTA_CUB, ...P.VISTA_MIRALL].map((r) => [r.nom, centre(r)]));
cal('dalt és a dalt', pos.dalt.y < -0.4 && Math.abs(pos.dalt.x) < 1e-9);
cal('esquerra és a l\'esquerra i a baix', pos.esquerra.x < -0.3 && pos.esquerra.y > 0.1);
cal('dreta és a la dreta i a baix', pos.dreta.x > 0.3 && pos.dreta.y > 0.1);
cal('baix és a baix', pos.baix.y > 0.4 && Math.abs(pos.baix.x) < 1e-9);
cal('darrere-d és a dalt a la dreta', pos['darrere-d'].x > 0.3 && pos['darrere-d'].y < -0.1);
cal('darrere-e és a dalt a l\'esquerra', pos['darrere-e'].x < -0.3 && pos['darrere-e'].y < -0.1);
cal('el cub i el mirall omplen el mateix hexàgon',
  Math.abs(pos.dalt.y + pos.baix.y) < 1e-9 && Math.abs(pos.esquerra.x + pos['darrere-d'].x) < 1e-9);

titol('4. Quiralitat: el dau antihorari, el seu reflex horari');
let vistesDirectes = 0, vistesMirall = 0;
for (const c of totes) {
  const directa = P.vista(c, P.VISTA_CUB);
  const mirall = P.vista(c, P.VISTA_MIRALL);

  // Les tres del davant sumen set amb les tres del darrere, posició a posició.
  for (let i = 0; i < 3; i++) {
    cal('davant i darrere sumen set',
      Number(directa[i].dibuix) + Number(mirall[i].dibuix) === 7,
      `${directa[i].dibuix} contra ${mirall[i].dibuix}`);
  }
  // La marca del mirall: cap volteig al davant, sempre volteig al reflex.
  cal('el cub no es volteja', directa.every((f) => !f.volteig));
  cal('el mirall sempre es volteja', mirall.every((f) => f.volteig));

  const on = (llista, refs, num) => {
    const i = llista.findIndex((f) => f.dibuix === String(num));
    return i < 0 ? null : centre(refs[i]);
  };
  const d123 = [1, 2, 3].map((n) => on(directa, P.VISTA_CUB, n));
  if (d123.every(Boolean)) {
    vistesDirectes++;
    cal('l\'1, el 2 i el 3 es llegeixen antihoraris al cub',
      sentit(...d123) === 'antihorari');
  }
  const m123 = [1, 2, 3].map((n) => on(mirall, P.VISTA_MIRALL, n));
  if (m123.every(Boolean)) {
    vistesMirall++;
    cal('l\'1, el 2 i el 3 es llegeixen horaris al mirall',
      sentit(...m123) === 'horari');
  }
}
cal('el vèrtex 1-2-3 surt al davant en alguna orientació', vistesDirectes > 0,
  `${vistesDirectes} vegades`);
cal('i al mirall en alguna altra', vistesMirall > 0, `${vistesMirall} vegades`);

// ── El dibuix ────────────────────────────────────────────────────
// La prova que no em puc estalviar: que (gir, volteig) dibuixi exactament
// el mateix que la geometria. Es pren un punt qualsevol de la cara, es
// projecta de veritat, i es compara amb on el posaria el dibuix.
titol('5. El que es dibuixa és el que hi ha');
// Aplicar volteig i després gir, dins del quadrat unitat.
const capgira = (p, q, volteig) => {
  let x = volteig ? 1 - p.x : p.x, y = p.y;
  for (let i = 0; i < q; i++) { const nx = 1 - y; y = x; x = nx; }
  return { x, y };
};
let comprovats = 0;
for (const cub of totes) {
  for (const [refs, quins] of [[P.VISTA_CUB, 'cub'], [P.VISTA_MIRALL, 'mirall']]) {
    const llegit = P.vista(cub, refs);
    refs.forEach((ref, i) => {
      const cara = cub.find((f) => P.igual(f.n, ref.n));
      const o = P.origen(cara);
      for (const p of [{ x: 0.2, y: 0.1 }, { x: 0.9, y: 0.35 }, { x: 0.5, y: 0.75 }]) {
        // On va de veritat: al marc real de la cara.
        const real = P.projecta(P.suma(P.suma(o, P.escala(cara.u, p.x)), P.escala(cara.v, p.y)));
        // On el posa el dibuix: al marc de referència, capgirat.
        const t = capgira(p, llegit[i].q, llegit[i].volteig);
        const pin = P.projecta(P.suma(P.suma(ref.o, P.escala(ref.u, t.x)), P.escala(ref.v, t.y)));
        comprovats++;
        cal(`${quins}/${ref.nom}: el dibuix cau on toca`,
          Math.abs(real.x - pin.x) < 1e-9 && Math.abs(real.y - pin.y) < 1e-9,
          `real (${real.x.toFixed(3)},${real.y.toFixed(3)}) vs dibuix (${pin.x.toFixed(3)},${pin.y.toFixed(3)})`);
      }
    });
  }
}

titol('6. El mirall de l\'examen: pla, vertical i darrere');
{
  const eixos = [P.V(1, 0, 0), P.V(0, 1, 0), P.V(0, 0, 1), P.V(-1, 0, 0), P.V(0, -1, 0), P.V(0, 0, -1)];
  cal('reflectir dues vegades no fa res', eixos.every((e) => P.igual(P.reflex(P.reflex(e)), e)));
  const a = P.reflex(P.V(1, 0, 0)), b = P.reflex(P.V(0, 1, 0)), c = P.reflex(P.V(0, 0, 1));
  const det = a.x * (b.y * c.z - b.z * c.y) - a.y * (b.x * c.z - b.z * c.x) + a.z * (b.x * c.y - b.y * c.x);
  cal('el determinant és −1: és un mirall, no un gir', det === -1, `${det}`);
  cal('la vertical no es mou: el mirall és dret', P.igual(P.reflex(P.V(0, 1, 0)), P.V(0, 1, 0)));
  cal('els eixos van a eixos: el reflex es dibuixa en isomètrica normal',
    eixos.every((e) => eixos.some((f) => P.igual(P.reflex(e), f))));

  for (const cub of totes) {
    const r = P.reflecteix(cub);
    const directa = P.vista(cub, P.VISTA_CUB);
    const reflectida = P.vista(r, P.VISTA_CUB);
    cal('al reflex tot va capgirat', reflectida.every((f) => f.volteig));
    cal('la de dalt es repeteix, i és l\'àncora per orientar-se',
      directa[0].dibuix === reflectida[0].dibuix);
    const conegudes = new Set([...directa, ...reflectida].map((f) => f.dibuix));
    cal('se\'n coneixen cinc de sis', conegudes.size === 5, `${conegudes.size}`);
    const baix = cub.find((f) => P.igual(f.n, P.V(0, -1, 0)));
    cal('i la que falta és sempre la de baix', !conegudes.has(baix.dibuix));

    // La quiralitat, al reflex de l'examen: si l'1, el 2 i el 3 hi surten,
    // s'han de llegir a l'inrevés que al cub.
    const on = (llista, num) => {
      const i = llista.findIndex((f) => f.dibuix === String(num));
      return i < 0 ? null : centre(P.VISTA_CUB[i]);
    };
    const d = [1, 2, 3].map((n) => on(directa, n));
    if (d.every(Boolean)) cal('al cub, antihorari', sentit(...d) === 'antihorari');
    const m = [1, 2, 3].map((n) => on(reflectida, n));
    if (m.every(Boolean)) cal('al mirall, horari', sentit(...m) === 'horari');
  }
}

titol('7. Els desenvolupaments segueixen plegant');
for (const [nom, forma] of Object.entries(P.FORMES)) {
  const cares = P.plega(forma.map(([nx, ny], i) => ({ nx, ny, dibuix: 'c' + i })));
  cal(`${nom} plega`, P.valid(cares), nom);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
console.log(`(${comprovats} punts de dibuix comprovats un a un)`);
process.exit(fallats ? 1 : 0);
