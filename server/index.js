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
    id: 'n007',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Internacional',
    title: 'EEUU i Israel intensifiquen els atacs a l\'Iran: Trump homenatja els 4 militars morts',
    desc: 'Les forces armades dels EUA van atacar de nou "objectius militars" iranians. L\'Iran va contratacar amb míssils al Bahrain i al golf d\'Ormuz. Trump va presidir la cerimònia de trasllat solemne a la base de Dover.',
    url: 'http://cnnespanol.cnn.com/2026/07/22/mundo/live-news/guerra-ee-uu-israel-iran-en-vivo-ataques-noticias-4-trax',
  },
  {
    id: 'n008',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Política CAT',
    title: 'Illa reivindica la "política útil" davant l\'auge d\'Aliança Catalana',
    desc: 'El president de la Generalitat va apostar per l\'esperança davant el "discurs de la por", després que el CEO donés a Aliança Catalana fins a 23-25 diputats al Parlament.',
    url: 'https://theobjective.com/espana/politica/2026-07-11/illa-politica-util-esperanza-discurso-miedo/',
  },
  {
    id: 'n009',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Esports',
    title: 'El Barça tanca el fitxatge definitiu de Rashford per 35,2 M€',
    desc: 'El Manchester United accepta la venda del davanter anglès. Lewandowski, en canvi, no renovarà i abandona el club en acabar el seu contracte.',
    url: 'https://es-us.noticias.yahoo.com/deportes/mercado-fichajes-barcelona-2026-refuerzos-181500835.html',
  },
  {
    id: 'n010',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Premis',
    title: 'Almirall guanya el Premi Nacional d\'Innovació 2026',
    desc: 'La farmacèutica catalana s\'ha consolidat com a referent mundial en dermatologia mèdica. Porta invertits més de 2.000 M€ en R+D en els últims vint anys i és present en més de 100 països.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  {
    id: 'n011',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Cultura',
    title: 'La 30a Fira del Llibre de Lima obre amb l\'Equador com a convidat',
    desc: 'Una de les fires literàries més importants d\'Amèrica Llatina celebra la seva trentena edició. L\'Equador, país convidat d\'honor, presenta una àmplia delegació d\'autors i editorials.',
    url: 'https://www.infobae.com/america/agencias/2026/07/22/miercoles-22-de-julio-de-2026-0700-gmt/',
  },
  {
    id: 'n012',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Esports INT',
    title: 'Hong Kong acull el Mundial d\'Esgrima per primera vegada (22–30 jul.)',
    desc: 'Més de 1.000 tiradors de tot el món competiran a AsiaWorld-Expo fins al 30 de juliol. És la primera vegada que Hong Kong organitza un Campionat del Món d\'Esgrima.',
    url: 'https://www.infobae.com/america/agencias/2026/07/22/miercoles-22-de-julio-de-2026-0700-gmt/',
  },
  {
    id: 'n013',
    date: '2026-07-22',
    dateLabel: '07·22',
    tag: 'Economia',
    title: 'L\'indicador de conjuntura espanyol remunta lleugerament al juliol fins a 1,52',
    desc: 'L\'Ind-ALdE puja des del 1,30 de juny, però segueix molt per sota del màxim del desembre de 2025 (3,77). La producció industrial va frenar del 4,4 % a l\'abril fins a l\'0,8 % al maig.',
    url: 'https://alde.es/blog/espana/indicador-de-coyuntura-julio-2026/',
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
