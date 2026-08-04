// Proves del progrés dels psicotècnics, a les dues capes.
//
//  1. `progres.mjs` — el càlcul, compartit entre la web i l'app. Es prova
//     directament, que és JavaScript pur i no sap on es desa res.
//  2. `psicoStats.ts` — la capa de la web, que hi posa el localStorage. És
//     TypeScript, o sigui que es compila amb esbuild i se li dona un
//     localStorage de mentida. Així es prova el codi que correrà, no una
//     imitació.
//
// Provar les dues no és repetir-se: la primera diu que els números surten
// bé, i la segona que arriben al calaix i en tornen igual.
//
//   node proves-progres.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as P from './progres.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

// ══ Capa 1: el càlcul ═══════════════════════════════════════════
titol('1. Sense res desat, no s\'inventa cap nota');
{
  const s = P.cap();
  cal('cap encert de categoria', P.encertDe(s, 'sinonims') === null);
  cal('cap encert de bloc', P.encertBloc(s, 'verbal') === null);
  cal('cap bloc fluix', P.blocMesFluix(s) === null);
  cal('cap pregunta feta', P.totalFetes(s) === 0);
  cal('«buit» és sempre un objecte nou', P.cap() !== P.cap());
}

titol('2. Una sessió se suma bé');
{
  const s = P.aplicaSessio(P.cap(), { per: { sinonims: { fetes: 10, encerts: 7 } }, segons: 120 }, 1000);
  const c = s.categories.sinonims;
  cal('deu fetes', c.fetes === 10, `${c.fetes}`);
  cal('set encerts', c.encerts === 7, `${c.encerts}`);
  cal('una sessió', c.sessions === 1);
  cal('millor 70%', c.millor === 70, `${c.millor}`);
  cal('el temps hi és', c.segons === 120, `${c.segons}`);
  cal('la data hi és', c.quan === 1000);
  cal('el percentatge quadra', P.encertDe(s, 'sinonims') === 70);
}

titol('3. Dues sessions se sumen, i el millor no baixa');
{
  let s = P.aplicaSessio(P.cap(), { per: { sinonims: { fetes: 10, encerts: 9 } }, segons: 60 });
  s = P.aplicaSessio(s, { per: { sinonims: { fetes: 10, encerts: 3 } }, segons: 60 });
  const c = s.categories.sinonims;
  cal('vint fetes', c.fetes === 20, `${c.fetes}`);
  cal('dotze encerts', c.encerts === 12, `${c.encerts}`);
  cal('dues sessions', c.sessions === 2);
  cal('el millor es queda al 90', c.millor === 90, `${c.millor}`);
  cal('l\'últim és el 30, el de la darrera', c.ultim === 30, `${c.ultim}`);
  cal('el temps se suma', c.segons === 120, `${c.segons}`);
  cal('el percentatge és el global', P.encertDe(s, 'sinonims') === 60, `${P.encertDe(s, 'sinonims')}`);
}

titol('4. Aplicar una sessió no toca les estadístiques d\'abans');
{
  const abans = P.aplicaSessio(P.cap(), { per: { sinonims: { fetes: 10, encerts: 5 } }, segons: 10 });
  const copia = JSON.stringify(abans);
  P.aplicaSessio(abans, { per: { sinonims: { fetes: 10, encerts: 10 } }, segons: 10 });
  cal('les d\'abans es queden igual', JSON.stringify(abans) === copia);
}

titol('5. El bloc suma les seves categories');
{
  const s = P.aplicaSessio(P.cap(), {
    per: { sinonims: { fetes: 10, encerts: 8 }, analogies: { fetes: 10, encerts: 2 } },
    segons: 100,
  });
  cal('el bloc verbal fa la mitjana de les dues', P.encertBloc(s, 'verbal') === 50,
    `${P.encertBloc(s, 'verbal')}`);
  cal('un bloc que no s\'ha tocat no té nota', P.encertBloc(s, 'espacial') === null);
  cal('un bloc que no existeix tampoc', P.encertBloc(s, 'inventat') === null);
  cal('el temps es reparteix entre les dues',
    s.categories.sinonims.segons === 50 && s.categories.analogies.segons === 50);
  cal('vint preguntes en total', P.totalFetes(s) === 20);
}

titol('6. El bloc més fluix és el que toca entrenar');
{
  const s = P.aplicaSessio(P.cap(), {
    per: {
      sinonims: { fetes: 10, encerts: 9 },          // verbal, 90%
      'cubs-desplegat': { fetes: 10, encerts: 3 },  // espacial, 30%
      abstracte: { fetes: 10, encerts: 6 },         // abstracte, 60%
    },
    segons: 90,
  });
  const f = P.blocMesFluix(s);
  cal('el més fluix és l\'espacial', f && f.id === 'espacial', JSON.stringify(f));
  cal('i diu el percentatge', f && f.pct === 30, JSON.stringify(f));
}

titol('7. Coses que no haurien de trencar res');
{
  cal('una sessió buida no suma', P.totalFetes(P.aplicaSessio(P.cap(), { per: {}, segons: 0 })) === 0);
  const s = P.aplicaSessio(P.cap(), { per: { sinonims: { fetes: 0, encerts: 0 } }, segons: 30 });
  cal('una categoria sense preguntes no es desa', !s.categories.sinonims);
  cal('un text espatllat torna buit', P.totalFetes(P.desDeText('això no és json')) === 0);
  cal('un text buit torna buit', P.totalFetes(P.desDeText(null)) === 0);
  cal('un json sense categories torna buit', P.totalFetes(P.desDeText('{"altra":1}')) === 0);
  cal('el que es desa es torna a llegir igual',
    P.totalFetes(P.desDeText(JSON.stringify(
      P.aplicaSessio(P.cap(), { per: { disc: { fetes: 7, encerts: 4 } }, segons: 5 })))) === 7);
}

// ══ Capa 2: el desat de la web ══════════════════════════════════
const aqui = path.dirname(fileURLToPath(import.meta.url));
const arrel = path.resolve(aqui, '..', '..', '..');
const bundle = path.join(aqui, '.progres-bundle.mjs');
execFileSync('npx', ['esbuild', 'src/lib/psicoStats.ts', '--bundle', '--format=esm',
  '--platform=node', `--outfile=${bundle}`, '--log-level=error'],
{ cwd: arrel, shell: true, stdio: 'inherit' });

const magatzem = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (magatzem.has(k) ? magatzem.get(k) : null),
    setItem: (k, v) => magatzem.set(k, String(v)),
    removeItem: (k) => magatzem.delete(k),
  },
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
};
globalThis.Event = class { constructor(t) { this.type = t; } };
const W = await import(`file://${bundle.replace(/\\/g, '/')}`);
const net = () => magatzem.clear();

titol('8. La capa de la web: desa, llegeix i esborra');
{
  net();
  W.desaSessio({ per: { sinonims: { fetes: 10, encerts: 7 } }, segons: 120 });
  const s = P.desDeText(magatzem.get('infopol-psico-stats'));
  cal('la sessió arriba al calaix', P.encertDe(s, 'sinonims') === 70);

  W.desaSessio({ per: { sinonims: { fetes: 10, encerts: 3 } }, segons: 60 });
  cal('la segona se suma a la primera',
    P.totalFetes(P.desDeText(magatzem.get('infopol-psico-stats'))) === 20);

  W.esborraTot();
  cal('esborrar deixa el calaix buit', !magatzem.has('infopol-psico-stats'));

  // El parany que ja ens va mossegar: si el «buit» fos una constant
  // compartida, després d'esborrar tornarien a sortir els números d'abans.
  W.desaSessio({ per: { sinonims: { fetes: 5, encerts: 5 } }, segons: 10 });
  cal('després d\'esborrar es comença de zero',
    P.totalFetes(P.desDeText(magatzem.get('infopol-psico-stats'))) === 5,
    `${P.totalFetes(P.desDeText(magatzem.get('infopol-psico-stats')))}`);

  net();
  magatzem.set('infopol-psico-stats', 'això no és json');
  W.desaSessio({ per: { disc: { fetes: 5, encerts: 5 } }, segons: 10 });
  cal('un desat espatllat no impedeix continuar',
    P.totalFetes(P.desDeText(magatzem.get('infopol-psico-stats'))) === 5);
}

titol('9. El progrés dels psicos no toca el dels tests de temari');
{
  net();
  const temari = '{"topics":{"ce78":{"attempts":3}},"achievements":[]}';
  magatzem.set('infopol-test-stats', temari);
  W.desaSessio({ per: { sinonims: { fetes: 5, encerts: 4 } }, segons: 20 });
  cal('el dels tests segueix igual', magatzem.get('infopol-test-stats') === temari);
  cal('i el dels psicos va al seu calaix',
    magatzem.get('infopol-psico-stats').includes('sinonims'));
  W.esborraTot();
  cal('esborrar els psicos no toca els tests', magatzem.get('infopol-test-stats') === temari);
}

fs.rmSync(bundle, { force: true });
console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
