// Publica els directoris d'Actualitat a partir de dades.mjs.
//
//   node scripts/directoris/publica.mjs
//
// Escriu:
//   - src/lib/{personalitats,premis,esports}.ts      (reserva de la web)
//   - <app>/src/content/actualitat-{...}.ts           (fitxes Markdown de l'app)
//   - scripts/directoris/sortida/<categoria>.json     (files de la taula
//     `directories` de Supabase; es carreguen a part, vegeu LLEGEIX-ME.md)
//
// Els tipus dels fitxers de la web no es toquen: es conserva tot el que hi
// ha abans de la constant *_UPDATED_AT i només es reescriuen les dades.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ACTUALITZAT, ESPORTS, PERSONALITATS, PREMIS } from './dades.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(AQUI, '..', '..');

function trobaApp() {
  const candidats = [
    process.env.INFOPOL_APP,
    path.resolve(WEB, '..', 'infopol-app'),
    path.join(os.homedir(), 'Projectes', 'infopol-app'),
  ].filter(Boolean);
  const app = candidats.find((c) => fs.existsSync(path.join(c, 'src', 'content', 'actualitat.ts')));
  if (!app) throw new Error(`No trobo infopol-app. Provats: ${candidats.join(', ')}`);
  return app;
}

const CATEGORIES = [
  { id: 'personalitats', fitxer: 'personalitats', constant: 'PERSONALITATS', dades: PERSONALITATS, exportApp: 'FITXES_PERSONALITATS' },
  { id: 'premis', fitxer: 'premis', constant: 'PREMIS', dades: PREMIS, exportApp: 'FITXES_PREMIS' },
  { id: 'esports', fitxer: 'esports', constant: 'ESPORTS', dades: ESPORTS, exportApp: 'FITXES_ESPORTS' },
];

// D'on surt cada fitxa. A l'app es mostra al peu.
const FONTS = {
  'espanya-govern': 'lamoncloa.gob.es',
  'espanya-estat': 'casareal.es · congreso.es · senado.es · poderjudicial.es · fiscal.es · interior.gob.es',
  'espanya-comunitats': 'Webs oficials autonòmiques · resultats electorals 2025-2026',
  'espanya-alcaldes': 'Webs municipals · premsa local (setembre 2026)',
  catalunya: 'govern.cat · parlament.cat · mossos.gencat.cat · premsa',
  'unio-europea': 'european-union.europa.eu · consilium.europa.eu · europol.europa.eu',
  organismes: 'un.org · nato.int · unesco.org · unhcr.org · coe.int · osce.org · icc-cpi.int',
  europa: 'Webs de govern de cada país · agències internacionals',
  america: 'whitehouse.gov · federalreserve.gov · agències internacionals',
  'asia-africa': 'Webs de govern · agències internacionals',
  religio: 'vatican.va · conferenciaepiscopal.es',
  'fets-clau': 'Agències internacionals · premsa',
  'nobel-2025': 'nobelprize.org',
  'princesa-asturies': 'fpa.es',
  cinema: 'oscars.org · premiosgoya.com · academiadelcinema.cat · festival-cannes.com · labiennale.org · berlinale.de',
  lletres: 'cultura.gob.es · omnium.cat · planeta.es',
  musica: 'grammy.com · latingrammy.com · eurovision.com',
  'ciencia-societat': 'pritzkerprize.com · abelprize.no · mathunion.org · europarl.europa.eu · govern.cat',
  'premis-esportius': 'ballondor.com · fifa.com · laureus.com',
  'futbol-seleccions': 'fifa.com · uefa.com',
  'futbol-clubs': 'uefa.com · laliga.com · fcbarcelona.com',
  tennis: 'ausopen.com · rolandgarros.com · wimbledon.com · usopen.org · atptour.com',
  basquet: 'nba.com · euroleaguebasketball.net · acb.com · fiba.basketball',
  motor: 'formula1.com · motogp.com · dakar.com',
  ciclisme: 'letour.fr · giroditalia.it · lavuelta.es · uci.org',
  'altres-esports': 'olympics.com · european-athletics.com · eurohandball.com · masters.com · nfl.com',
};

const MESOS = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
const [ANY, MES] = ACTUALITZAT.split('-').map(Number);
const MES_ANY = `${MESOS[MES - 1]} de ${ANY}`;
const MES_ANY_MAJ = MES_ANY[0].toUpperCase() + MES_ANY.slice(1);

/* ─── Comprovacions: millor petar aquí que publicar dades trencades ─── */

function valida() {
  const ids = new Set();
  for (const cat of CATEGORIES) {
    for (const sec of cat.dades) {
      if (ids.has(sec.id)) throw new Error(`id repetit: ${sec.id}`);
      ids.add(sec.id);
      if (!FONTS[sec.id]) throw new Error(`falta la font de ${sec.id}`);
      for (const sub of sec.subsections) {
        if (!sub.entries.length) throw new Error(`subsecció buida a ${sec.id}`);
        for (const e of sub.entries) {
          if (!e.position?.trim() || !e.name?.trim()) {
            throw new Error(`entrada incompleta a ${sec.id}: ${JSON.stringify(e)}`);
          }
        }
      }
    }
  }
}

/* ─── 1. Reserva de la web ─── */

function escriuWeb(cat) {
  const fitxer = path.join(WEB, 'src', 'lib', `${cat.fitxer}.ts`);
  const actual = fs.readFileSync(fitxer, 'utf8');
  const marca = `export const ${cat.constant}_UPDATED_AT`;
  const tall = actual.indexOf(marca);
  if (tall < 0) throw new Error(`No trobo ${marca} a ${fitxer}`);
  const tipus = actual.slice(0, tall);
  const nomTipus = { personalitats: 'LeaderSection', premis: 'AwardSection', esports: 'SportSection' }[cat.id];
  const cos =
    `${marca} = '${ACTUALITZAT}';\n\n` +
    `// Generat per scripts/directoris/publica.mjs a partir de dades.mjs.\n` +
    `// No ho editis a mà: canvia dades.mjs i torna'l a executar.\n` +
    `export const ${cat.constant}: ${nomTipus}[] = ${JSON.stringify(cat.dades, null, 2)};\n`;
  fs.writeFileSync(fitxer, tipus + cos);
  return fitxer;
}

/* ─── 2. Fitxes de l'app ─── */

const escapaPlantilla = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const escapaCadena = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

function markdownDeSeccio(sec) {
  const linies = [`> Dades verificades el ${MES_ANY}.`, ''];
  for (const sub of sec.subsections) {
    if (sub.title) linies.push(`## ${sub.title}`, '');
    for (const e of sub.entries) {
      const detall = e.detail ? ` — ${e.detail}` : '';
      const nou = e.recent ? ' 🆕' : '';
      linies.push(`- **${e.position}:** ${e.name}${detall}${nou}`);
    }
    linies.push('');
  }
  return linies.join('\n').trimEnd();
}

function subtitol(sec) {
  const t = sec.subsections.map((s) => s.title).filter(Boolean).join(' · ');
  return t.length > 70 ? `${t.slice(0, 67).trimEnd()}…` : t;
}

function escriuApp(cat, app) {
  const fitxer = path.join(app, 'src', 'content', `actualitat-${cat.fitxer}.ts`);
  const fitxes = cat.dades.map((sec) => {
    const md = markdownDeSeccio(sec);
    return [
      '  {',
      `    slug: '${escapaCadena(sec.id)}',`,
      `    categoria: '${cat.id}',`,
      `    title: '${escapaCadena(sec.title)}',`,
      `    subtitle: '${escapaCadena(subtitol(sec))}',`,
      `    emoji: '${sec.icon}',`,
      `    updated: '${MES_ANY_MAJ}',`,
      `    font: '${escapaCadena(FONTS[sec.id])}',`,
      `    md: \`${escapaPlantilla(md)}\`,`,
      '  },',
    ].join('\n');
  });
  const cos =
    `// Fitxes d'actualitat · ${cat.id}.\n` +
    `// Generat per infopol/scripts/directoris/publica.mjs a partir de dades.mjs.\n` +
    `// No ho editis a mà: canvia dades.mjs al repo de la web i torna'l a executar.\n` +
    `import type { ActualitatFitxa } from './actualitat';\n\n` +
    `export const ${cat.exportApp}: ActualitatFitxa[] = [\n${fitxes.join('\n')}\n];\n`;
  fs.writeFileSync(fitxer, cos);
  return fitxer;
}

/* ─── 3. Files per a Supabase ─── */

// Surt en JSON i es puja amb el repo (és públic). Supabase se'l descarga
// amb pg_net i el carrega amb jsonb_to_recordset: així no cal cap clau de
// servei al PC ni copiar centenars de files a mà.
function escriuFiles(cat) {
  const files = [];
  cat.dades.forEach((sec, si) => {
    sec.subsections.forEach((sub, ui) => {
      sub.entries.forEach((e, ei) => {
        files.push({
          category: cat.id,
          section_key: sec.id,
          section_title: sec.title,
          section_short_label: sec.shortLabel,
          section_icon: sec.icon,
          section_accent: sec.accent,
          section_sort: si,
          subsection_title: sub.title ?? null,
          subsection_icon: sub.icon ?? null,
          subsection_compact: !!sub.compact,
          subsection_sort: ui,
          position: e.position,
          name: e.name,
          detail: e.detail ?? null,
          flag: e.flag ?? null,
          url: null,
          recent: !!e.recent,
          entry_sort: ei,
        });
      });
    });
  });
  const dir = path.join(AQUI, 'sortida');
  fs.mkdirSync(dir, { recursive: true });
  const fitxer = path.join(dir, `${cat.id}.json`);
  fs.writeFileSync(fitxer, JSON.stringify(files));
  return { fitxer, files: files.length };
}

valida();
const app = trobaApp();
for (const cat of CATEGORIES) {
  const web = escriuWeb(cat);
  const appFitxer = escriuApp(cat, app);
  const { fitxer, files } = escriuFiles(cat);
  const seccions = cat.dades.length;
  console.log(`${cat.id}: ${seccions} seccions, ${files} entrades`);
  console.log(`  web  ${path.relative(WEB, web)}`);
  console.log(`  app  ${appFitxer}`);
  console.log(`  sql  ${path.relative(WEB, fitxer)}`);
}
