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

const DAILY_NEWS = [
  {
    id: 'd001',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Esports · F1',
    title: 'Hamilton guanya el GP de Barcelona i fa la victòria 106 amb Ferrari',
    desc: 'Lewis Hamilton s\'imposa a Montmeló en el primer triomf per Ferrari. Kimi Antonelli, líder del Mundial, abandona per avaria mecànica.',
    url: 'https://www.formula1.com/en/latest/article/hamilton-claims-stellar-maiden-grand-prix-victory-for-ferrari-in-barcelona-as-antonelli-suffers-shock-retirement.4yCXiPLHUdcnl2BwNpqUIa',
  },
  {
    id: 'd002',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Esports · Mundial',
    title: 'Espanya empata 0-0 amb Cap Verd en el debut al Mundial 2026',
    desc: 'La Roja domina amb el 74% de la possessió però no troba el gol. El porter Vozinho, de 40 anys, para 23 xuts en una exhibició memorable.',
    url: 'https://www.telemundo.com/noticias/noticias-telemundo/internacional/live-blog/mundial-2026-hoy-espana-vs-cabo-verde-resultados-goles-rcna350131',
  },
  {
    id: 'd003',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Internacional',
    title: 'EUA i Iran arriben a un acord per reobrir l\'estret d\'Ormuz',
    desc: 'Alto el foc prolongat 60 dies i reobertura del pas marítim vital per al 20% del petroli mundial. Signatura prevista per divendres.',
    url: 'https://www.aporrea.org/actualidad/n419906.html',
  },
  {
    id: 'd004',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Política · Cat.',
    title: 'El Govern activa el pla forestal d\'emergència i anuncia ajudes al sector agrari',
    desc: 'La Generalitat reforça Bombers i Agents Rurals per a l\'estiu i activa 14 eixos de confinament per frenar els grans incendis forestals.',
    url: 'https://cronicaglobal.elespanol.com/politica/20260615/dalmau-aprecia-demasiado-campana-prevencion-incendios-cataluna/1003742771267_0.html',
  },
  {
    id: 'd005',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Economia · Cat.',
    title: 'Govern, patronals i sindicats signen el Pacte Nacional de la Indústria — 5.000 M€',
    desc: 'Acord tripartit per mobilitzar 5.000 milions, augmentar la productivitat industrial i ampliar el sòl industrial fins al 2030.',
    url: 'https://cronicaglobal.elespanol.com/politica/20260615/govern-patronales-sindicatos-pacto-nacional-industria-millones/1003742771387_0.html',
  },
  {
    id: 'd006',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Policial · Int.',
    title: 'Trump anuncia la mort del cap del Tren de Aragua en operació del SOUTHCOM',
    desc: 'Forces del Comandament Sud dels EUA eliminen Héctor Guerrero Flores, àlies Niño Guerrero, màxim responsable de la banda criminal veneçolana.',
    url: 'https://ksdy50.com/resumen-de-noticias-nacionales-e-internacionales-junio-15-2026/',
  },
  {
    id: 'd007',
    date: '2026-06-15',
    dateLabel: '06·15',
    tag: 'Cultura · BCN',
    title: 'Festival de Literatura Llatinoamericana de Barcelona — del 16 al 22 de juny',
    desc: 'La cinquena edició aplega escriptors de tot Amèrica Llatina amb debats, lectures i tallers oberts al públic en diverses seus de la ciutat.',
    url: 'https://www.barcelona.cat/barcelonacultura/es',
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

app.get('/api/daily-news', (req, res) => {
  res.json(DAILY_NEWS);
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
