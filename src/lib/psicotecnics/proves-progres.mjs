// Proves del progrés dels psicotècnics.
//
// El progrés és el mòdul de `src/lib/psicoStats.ts`, que és TypeScript i
// parla amb el localStorage del navegador. Per provar-lo de debò —el codi
// que correrà, no una còpia— es compila amb esbuild i se li dona un
// localStorage de mentida. Així no es prova una imitació.
//
//   node proves-progres.mjs
//
// Es compila sol si cal.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const arrel = path.resolve(aqui, '..', '..', '..');
const bundle = path.join(aqui, '.progres-bundle.mjs');

execFileSync('npx', ['esbuild', 'src/lib/psicoStats.ts', '--bundle', '--format=esm',
  '--platform=node', `--outfile=${bundle}`, '--log-level=error'],
{ cwd: arrel, shell: true, stdio: 'inherit' });

// Un localStorage de mentida, per poder provar sense navegador.
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

const S = await import('file://' + bundle.replace(/\\/g, '/'));

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);
const net = () => { magatzem.clear(); };

titol('1. Sense res desat, no s\'inventa cap nota');
{
  net();
  const s = { categories: {} };
  cal('cap encert de categoria', S.encertDe(s, 'sinonims') === null);
  cal('cap encert de bloc', S.encertBloc(s, 'verbal') === null);
  cal('cap bloc fluix', S.blocMesFluix(s) === null);
  cal('cap pregunta feta', S.totalFetes(s) === 0);
}

titol('2. Una sessió es desa i es llegeix igual');
{
  net();
  S.desaSessio({ per: { sinonims: { fetes: 10, encerts: 7 } }, segons: 120 });
  const s = JSON.parse(magatzem.get('infopol-psico-stats'));
  cal('hi ha la categoria', !!s.categories.sinonims);
  const c = s.categories.sinonims;
  cal('deu fetes', c.fetes === 10, `${c.fetes}`);
  cal('set encerts', c.encerts === 7, `${c.encerts}`);
  cal('una sessió', c.sessions === 1);
  cal('millor 70%', c.millor === 70, `${c.millor}`);
  cal('últim 70%', c.ultim === 70);
  cal('el temps hi és', c.segons === 120, `${c.segons}`);
  cal('la data hi és', c.quan > 0);
  cal('el percentatge quadra', S.encertDe(s, 'sinonims') === 70);
}

titol('3. Dues sessions se sumen, i el millor no baixa');
{
  net();
  S.desaSessio({ per: { sinonims: { fetes: 10, encerts: 9 } }, segons: 60 });
  S.desaSessio({ per: { sinonims: { fetes: 10, encerts: 3 } }, segons: 60 });
  const s = JSON.parse(magatzem.get('infopol-psico-stats'));
  const c = s.categories.sinonims;
  cal('vint fetes', c.fetes === 20, `${c.fetes}`);
  cal('dotze encerts', c.encerts === 12, `${c.encerts}`);
  cal('dues sessions', c.sessions === 2);
  cal('el millor es queda al 90', c.millor === 90, `${c.millor}`);
  cal('l\'últim és el 30, el de la darrera', c.ultim === 30, `${c.ultim}`);
  cal('el temps se suma', c.segons === 120, `${c.segons}`);
  cal('el percentatge és el global, no el de l\'última',
    S.encertDe(s, 'sinonims') === 60, `${S.encertDe(s, 'sinonims')}`);
}

titol('4. El bloc suma les seves categories');
{
  net();
  // Verbal són sinònims i analogies.
  S.desaSessio({
    per: { sinonims: { fetes: 10, encerts: 8 }, analogies: { fetes: 10, encerts: 2 } },
    segons: 100,
  });
  const s = JSON.parse(magatzem.get('infopol-psico-stats'));
  cal('el bloc verbal fa la mitjana de les dues', S.encertBloc(s, 'verbal') === 50,
    `${S.encertBloc(s, 'verbal')}`);
  cal('un bloc que no s\'ha tocat no té nota', S.encertBloc(s, 'espacial') === null);
  cal('un bloc que no existeix tampoc', S.encertBloc(s, 'inventat') === null);
  cal('el temps es reparteix entre les dues',
    s.categories.sinonims.segons === 50 && s.categories.analogies.segons === 50,
    `${s.categories.sinonims.segons} i ${s.categories.analogies.segons}`);
  cal('vint preguntes en total', S.totalFetes(s) === 20);
}

titol('5. El bloc més fluix és el que toca entrenar');
{
  net();
  S.desaSessio({
    per: {
      sinonims: { fetes: 10, encerts: 9 },         // verbal, 90%
      'cubs-desplegat': { fetes: 10, encerts: 3 }, // espacial, 30%
      abstracte: { fetes: 10, encerts: 6 },        // abstracte, 60%
    },
    segons: 90,
  });
  const s = JSON.parse(magatzem.get('infopol-psico-stats'));
  const f = S.blocMesFluix(s);
  cal('el més fluix és l\'espacial', f && f.id === 'espacial', JSON.stringify(f));
  cal('i diu el percentatge', f && f.pct === 30, JSON.stringify(f));
}

titol('6. Coses que no haurien de trencar res');
{
  net();
  S.desaSessio({ per: {}, segons: 0 });
  cal('una sessió buida no desa res', S.totalFetes(JSON.parse(magatzem.get('infopol-psico-stats') || '{"categories":{}}')) === 0);

  net();
  S.desaSessio({ per: { sinonims: { fetes: 0, encerts: 0 } }, segons: 30 });
  const buit = JSON.parse(magatzem.get('infopol-psico-stats') || '{"categories":{}}');
  cal('una categoria sense preguntes no es desa', !buit.categories.sinonims);

  // Si algú toca el localStorage a mà i el deixa fet un nyap.
  net();
  magatzem.set('infopol-psico-stats', 'això no és json');
  S.desaSessio({ per: { sinonims: { fetes: 5, encerts: 5 } }, segons: 10 });
  const rec = JSON.parse(magatzem.get('infopol-psico-stats'));
  cal('un desat espatllat no impedeix continuar', rec.categories.sinonims.fetes === 5);

  net();
  S.desaSessio({ per: { sinonims: { fetes: 3, encerts: 3 } }, segons: 10 });
  S.esborraTot();
  cal('esborrar deixa el calaix buit', magatzem.get('infopol-psico-stats') === undefined);
}

titol('7. El progrés dels psicos no toca el dels tests de temari');
{
  net();
  magatzem.set('infopol-test-stats', '{"topics":{"ce78":{"attempts":3}},"achievements":[]}');
  S.desaSessio({ per: { sinonims: { fetes: 5, encerts: 4 } }, segons: 20 });
  cal('el dels tests segueix igual',
    magatzem.get('infopol-test-stats') === '{"topics":{"ce78":{"attempts":3}},"achievements":[]}');
  cal('i el dels psicos va al seu calaix',
    magatzem.has('infopol-psico-stats') && magatzem.get('infopol-psico-stats').includes('sinonims'));
  S.esborraTot();
  cal('esborrar els psicos no toca els tests', magatzem.has('infopol-test-stats'));
}

fs.rmSync(bundle, { force: true });
console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
