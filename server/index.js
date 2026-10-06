import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ── Mock data ──────────────────────────────────────────────────

const USER = {
  id: 'u001',
  name: 'Jordi Roca',
  initials: 'JR',
  tip: '18742',
  unit: 'Regió Policial Metropolitana Nord',
  level: 12,
  xp: 14820,
  streak: 23,
  streakRecord: 41,
  gems: 420,
  accuracy: 78,
  questionsAnswered: 412,
  studyHours: 48,
  badges: [
    { id: 'lleis', name: 'Lleis', earned: true },
    { id: 'transit', name: 'Trànsit', earned: true },
    { id: '7dies', name: '7 dies', earned: true },
    { id: '100ok', name: '100 OK', earned: true },
    { id: 'fisic', name: 'Físic', earned: false },
    { id: 'psico', name: 'Psico', earned: false },
    { id: 'tox', name: 'Tox', earned: false },
    { id: 'or', name: 'Or', earned: false },
  ],
  mode: 'operativa',
};

const NEWS = [
  {
    id: 'n013',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Judicial',
    title: 'Fiscalia demana 22 anys per l\'assassinat de Natalia S. a Vallecas',
    desc: 'El Ministeri Fiscal sol·licita 22 anys de presó per a cada acusat en el judici per l\'assassinat de Natalia S. al barri de Puente de Vallecas, Madrid.',
    url: 'https://www.que.madrid/2026/10/06/asesinato-puente-vallecas-juicio-fiscalia-599167/',
  },
  {
    id: 'n012',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Judicial',
    title: 'Absolts 11 activistes de Greenpeace al Port de Sagunt',
    desc: 'El tribunal conclou que el bloqueig al vaixell de gas no va constituir violència ni intimidació que pertorbés greument l\'ordre públic.',
    url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/',
  },
  {
    id: 'n011',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Internacional',
    title: 'L\'últim partit de Messi amb l\'Argentina al Monumental',
    desc: 'La selecció argentina rep Benín en un amistós al Monumental de Buenos Aires en el que serà el comiat oficial del capità Messi amb l\'Albiceleste.',
    url: 'https://www.infobae.com/america/agencias/2026/10/06/martes-6-de-octubre-de-2026-0800-gmt/',
  },
  {
    id: 'n010',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Esports · Futbol',
    title: 'Espanya – Croàcia a la Lliga de Nacions a Split',
    desc: 'La Roja, líder amb ple de victòries, debuta la samarreta blanca amb dues estrelles al Poljud de Split. Croàcia arriba molt debilitada (0-7 davant Anglaterra).',
    url: 'https://www.infobae.com/espana/agencias/2026/10/05/martes-6-de-octubre-de-2026/',
  },
  {
    id: 'n009',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Esports · Tennis',
    title: 'Alcaraz, final de l\'Obert de Tòquio davant Lehecka',
    desc: 'El tennista espanyol, primer cap de sèrie i defensor del títol, s\'enfronta al txec Jiri Lehecka en la final del torneig japonès.',
    url: 'https://okdiario.com/deportes/',
  },
  {
    id: 'n008',
    date: '2026-10-05',
    dateLabel: '10·05',
    tag: 'Nobel · Medicina',
    title: 'Nobel de Medicina per l\'optogenètica',
    desc: 'Karl Deisseroth, Peter Hegemann i Georg Nagel premiats per la tècnica que permet controlar neurones amb llum. Clau per comprendre el cervell.',
    url: 'https://cnnespanol.cnn.com/2026/10/05/ciencia/premio-nobel-medicina-2026-trax',
  },
  {
    id: 'n007',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Nobel · Física',
    title: 'Francis Halzen, Nobel de Física per descobrir neutrins còsmics',
    desc: 'Premi per les contribucions a l\'Observatori IceCube al Pol Sud i el descobriment de neutrins d\'alta energia d\'origen astrofísic.',
    url: 'https://www.infobae.com/america/mundo/2026/10/06/la-real-academia-sueca-de-ciencias-anuncia-al-ganador-del-premio-nobel-de-fisica-2026/',
  },
  {
    id: 'n006',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Societat · Cat.',
    title: '120.000 persones a Barcelona per l\'accés a l\'habitatge',
    desc: 'Gran manifestació a Barcelona amb participació dels Mossos d\'Esquadra. Es planteja una vaga general per al novembre davant la crisi d\'habitatge.',
    url: 'https://periodistadigital.com/periodismo/20261006/10-asuntos-clave-espana-martes-6-octubre-2026-elecciones-anticipadas-vivienda-lluvias-intensas-noticia-689405253973',
  },
  {
    id: 'n005',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Política · Cat.',
    title: 'Llarena aixeca l\'ordre de detenció contra Puigdemont',
    desc: 'El Tribunal Suprem arxiva la detenció de l\'expresident després que el TC approvi el recurs de Dolors Bassa. Puigdemont pot retornar a Espanya.',
    url: 'https://www.eluniversal.com.mx/mundo/espana-levanta-orden-de-arresto-contra-carles-puigdemont-el-lider-independentista-celebra-victoria-y-puede-volver-al-pais/',
  },
  {
    id: 'n004',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Política · Esp.',
    title: 'Eleccions generals convocades per al 29 de novembre',
    desc: 'El BOE publica el RD 806/2026 que dissol les Corts i convoca eleccions. La campanya electoral s\'inicia el 13 de novembre.',
    url: 'https://cronista.com/espana/politica-es/elecciones-en-espana-2026-el-boe-confirmo-el-calendario-electoral-y-disolvio-las-cortes',
  },
  {
    id: 'n001',
    date: '2026-04-18',
    dateLabel: '04·18',
    tag: 'LO 1/2026',
    title: 'Multireincidència — enduriment de furts i estafes lleus',
    desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril de 2026. Afecta l\'art. 22.8 CP i els arts. 468-470 LECrim.',
    url: null,
  },
  {
    id: 'n002',
    date: '2026-04-14',
    dateLabel: '04·14',
    tag: 'RD 316/2026',
    title: 'Reforma del Reglament d\'Estrangeria',
    desc: 'Dues figures noves d\'arrelament social. Termini de regularització fins al 30 de juny de 2026.',
    url: null,
  },
  {
    id: 'n003',
    date: '2026-03-28',
    dateLabel: '03·28',
    tag: 'Circ. 2/2026',
    title: 'Instrucció sobre identificació i registre de persones',
    desc: 'Nova circular de la Fiscalia General sobre aplicació de l\'art. 20 LO 4/2015.',
    url: null,
  },
];

const STATS = {
  streak: 23,
  streakRecord: 41,
  accuracy: 78,
  questionsAnswered: 412,
  studyHours: 48,
  weeklyActivity: [62, 48, 71, 55, 80, 45, 68, 72, 35, 58, 90, 64],
  topicPerformance: [
    { topic: 'T1 · Constitució', pct: 92 },
    { topic: 'T8 · Drets fonamentals', pct: 78 },
    { topic: 'T3 · Organització Mossos', pct: 70 },
    { topic: 'T12 · Codi penal', pct: 64 },
    { topic: 'T5 · Org. policial', pct: 41 },
    { topic: 'T6 · LECrim', pct: 28 },
  ],
  xpHistory: [
    { date: '2026-05-03', xp: 120, activities: ['test'] },
    { date: '2026-05-02', xp: 240, activities: ['flashcards', 'test'] },
    { date: '2026-05-01', xp: 80, activities: ['test'] },
  ],
};

// ── Routes ─────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.get('/api/user', (req, res) => {
  res.json(USER);
});

app.put('/api/user', (req, res) => {
  Object.assign(USER, req.body);
  res.json(USER);
});

app.get('/api/news', (req, res) => {
  res.json(NEWS);
});

app.get('/api/stats', (req, res) => {
  res.json(STATS);
});

app.get('/api/incidents', (req, res) => {
  res.json([
    { id: 'i001', cat: 'operativa', icon: 'siren', title: 'Aldarull · C/ Indústria 88', distance: '0.3 km', time: '14:02', status: 'En curs', lat: 41.407, lng: 2.192 },
    { id: 'i002', cat: 'alcohol', icon: 'beaker', title: 'Control alcohol · Av. Diagonal', distance: '0.8 km', time: '13:48', status: 'Programat', lat: 41.398, lng: 2.185 },
    { id: 'i003', cat: 'transito', icon: 'car', title: 'Accident lleu · Pl. Catalunya', distance: '1.2 km', time: '13:31', status: 'Tancat', lat: 41.387, lng: 2.170 },
    { id: 'i004', cat: 'psico', icon: 'flag', title: 'Avís veïnal · C/ Gran Via', distance: '1.6 km', time: '12:55', status: 'Pendent', lat: 41.390, lng: 2.160 },
  ]);
});

// ── Academia ──────────────────────────────────────────────────

const PROGRESS = {};

app.get('/api/academia/progress', (req, res) => {
  res.json({
    globalPct: 64,
    doneBlocs: 2,
    totalBlocs: 17,
    currentBloc: 3,
    currentLesson: 7,
    totalLessons: 12,
  });
});

app.get('/api/academia/flashcards/session', (req, res) => {
  const { count = 10 } = req.query;
  res.json({ sessionId: `s_${Date.now()}`, count: parseInt(count) });
});

app.post('/api/academia/flashcards/rate', (req, res) => {
  const { cardId, rating } = req.body;
  const nextReview = {
    'malament': 1,
    'dificil': 2,
    'be': 5,
    'facil': 14,
  }[rating] || 1;
  res.json({ cardId, nextReviewDays: nextReview });
});

app.post('/api/academia/test/submit', (req, res) => {
  const { answers } = req.body;
  const xpEarned = (answers || []).filter(a => a.correct).length * 20;
  res.json({ xpEarned, streakUpdated: true });
});

// ── Static (for production build) ─────────────────────────────

app.use(express.static(join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚓 InfoPol API server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
