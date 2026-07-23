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
    id: 'n011',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Emergències',
    title: 'Tres incendis forestals — ola de calor a Madrid i Toledo',
    desc: 'Més de 600 ha calcinades al suroest de Madrid. Evacuació de 700 veïns a Villa del Prado. L\'incendi d\'Almorox baixa a nivell 1 un cop perimetrat.',
    url: 'https://www.infobae.com/espana/2026/07/23/tres-incendios-activos-en-la-comunidad-de-madrid-dejan-26-viviendas-afectadas-mas-de-600-hectareas-calcinadas-y-decenas-de-vecinos-evacuados-o-confinados-en-plena-ola-de-calor/',
  },
  {
    id: 'n012',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Economia',
    title: 'BCE — manté els tipus d\'interès al 2,25%',
    desc: 'El Consell de Govern del BCE decideix no modificar els tipus en la reunió de juliol. La propera revisió s\'espera per al setembre de 2026.',
    url: 'https://www.rankia.com/blog/mejores-hipotecas/7413040-reunion-bce-hoy-23-julio-2026',
  },
  {
    id: 'n013',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Política',
    title: 'Condonació del deute autonòmic — 83.000 M€ al Congrés',
    desc: 'El Govern porta al Congrés la condonació de deute de les CCAA de règim comú. PP i governs autonòmics populars mostren rebuig al pla.',
    url: 'https://www.periodistadigital.com/periodismo/20260723/10-claves-jueves-23-julio-2026-espana-zapatero-ferran-ola-calor-luz-rojo-noticia-689405232000/',
  },
  {
    id: 'n014',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Catalunya',
    title: 'ATC — 333 M€ de frau fiscal aflorats el 2025',
    desc: 'L\'Agència Tributària de Catalunya detectà 333 milions d\'euros de frau fiscal l\'any 2025, un 13% més que l\'exercici anterior.',
    url: 'https://metropoliabierta.elespanol.com/vivir-en-barcelona/20260723/debes-saber-hoy-julio-barcelona/1003742781656_0.html',
  },
  {
    id: 'n015',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Economia',
    title: 'BOE — ajudes directes a la compra de vehicle elèctric',
    desc: 'Publicat el reial decret del Programa Auto+ per a la concessió directa de subvencions a vehicles elèctrics i electrificats.',
    url: 'https://www.democrata.es/boe/boe-hoy-23-julio-2026-ayudas-coche-electrico-combustibles-renovables-cambios-empresas-familiares/',
  },
  {
    id: 'n016',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Internacional',
    title: 'Filipines i Xina — enfrontament al Mar de la Xina Meridional',
    desc: 'La Guàrdia Costanera de Filipines difon vídeos de l\'incident amb naus xineses al Baixos de Masinloc. Tensió creixent a la zona.',
    url: 'https://cnnespanol.cnn.com/2026/07/23/mundo/5-cosas-23-julio-2026-orix',
  },
  {
    id: 'n017',
    date: '2026-07-19',
    dateLabel: '07·19',
    tag: 'Esports',
    title: 'Espanya, campiona del Mundial de futbol 2026',
    desc: 'La selecció espanyola derrota l\'Argentina (1-0) a la final disputada a Nova York. Segon títol mundial per a la Roja.',
    url: 'https://cnnespanol.cnn.com/2026/07/19/deportes/live-news/espana-argentina-final-mundial-2026-en-vivo-resultado-goles-orix',
  },
  {
    id: 'n018',
    date: '2026-07-01',
    dateLabel: '07·01',
    tag: 'Premis',
    title: 'Premis Nacionals Innovació 2026 — Almirall, gran empresa innovadora',
    desc: 'El Ministeri de Ciència atorga el Premi Nacional d\'Innovació 2026 a Almirall, referent global en dermatologia mèdica present a més de 100 països.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
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
