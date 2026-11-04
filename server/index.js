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
  // ── 04·11·2026 ─────────────────────────────────────────────────
  {
    id: 'n011',
    date: '2026-11-04',
    dateLabel: '11·04',
    tag: 'Successos · Barcelona',
    title: 'Narcopís a l\'Eixample — Dos detinguts i mig quilo de drogues sintètiques',
    desc: 'Mossos d\'Esquadra i Guàrdia Urbana desarticulen un punt de venda de droga al carrer Casanova. Un home de 38 anys detingut al registre de les 6h; mig kg de drogues sintètiques intervingudes.',
    url: 'https://metropoliabierta.elespanol.com/sucesos/20261104/detenidos-desmantelamiento-narcopiso-eixample-medio-kilo-drogas-sinteticas-incautadas/1003742809233_0.html',
  },
  {
    id: 'n010',
    date: '2026-11-04',
    dateLabel: '11·04',
    tag: 'Política · Catalunya',
    title: 'Vaga general 11-N — CGT ultima piquets a Catalunya davant el 29-N',
    desc: 'El sindicat CGT i altres convocants preparen la vaga del 11 de novembre, centrada en l\'habitatge, a 18 dies de les eleccions generals del 29 de novembre.',
    url: 'https://www.moncloa.com/2026/11/03/huelga-general-cataluna-11n-3460893/',
  },
  {
    id: 'n009',
    date: '2026-11-04',
    dateLabel: '11·04',
    tag: 'Economia · Espanya',
    title: 'Màxim històric d\'afiliació — 22,6 milions de treballadors a la Seguretat Social',
    desc: 'El mercat laboral obre la tardor de 2026 amb un rècord d\'afiliació. La CNMC presenta un nou codi de bon govern per a les cotitzades de l\'Ibex 35.',
    url: 'https://www.eleconomista.es/economia/',
  },
  {
    id: 'n008',
    date: '2026-11-03',
    dateLabel: '11·03',
    tag: 'Cultura · Premi',
    title: 'Cristina Fernández Cubas, Premi Cervantes 2026',
    desc: 'El ministre de Cultura Ernest Urtasun anuncia el Premi Cervantes 2026 per a l\'escriptora catalana, reconeguda per haver «transformat la literatura fantàstica» en castellà. Premi dotat amb 125.000 €.',
    url: 'https://eldiario.es/cultura/cristina-fernandez-cubas-gana-premio-cervantes-2026_1_13634616.html',
  },
  {
    id: 'n007',
    date: '2026-11-03',
    dateLabel: '11·03',
    tag: 'Esports · Tennis',
    title: 'Alcaraz a la final de l\'ATP 500 de Viena — Busca el 4t títol de la temporada',
    desc: 'Carlos Alcaraz s\'enfronta a Alex de Miñaur a la final de l\'ATP 500 de Viena. En cas de guanyar, seria el seu quart títol de 2026.',
    url: 'https://www.infobae.com/espana/agencias/2026/11/03/miercoles-4-de-noviembre-de-2026/',
  },
  {
    id: 'n006',
    date: '2026-11-04',
    dateLabel: '11·04',
    tag: 'Esports · Futbol',
    title: 'Champions — Barça-Aston Villa i Atlètic-Bayern, 4a jornada avui',
    desc: 'FC Barcelona rep l\'Aston Villa i l\'Atlètic de Madrid el Bayern Múnic en la quarta jornada de la Champions League 2025-26. El Villarreal acull el PSG.',
    url: 'https://www.infobae.com/espana/agencias/2026/11/03/miercoles-4-de-noviembre-de-2026/',
  },
  {
    id: 'n005',
    date: '2026-10-28',
    dateLabel: '10·28',
    tag: 'Ciència · Nobel',
    title: 'Nobel de Medicina 2026 — Premi a la optogenètica',
    desc: 'Karl Deisseroth, Peter Hegemann i Georg Nagel reben el Nobel de Fisiologia o Medicina per descobriments sobre canals iònics activats per llum i optogenètica.',
    url: 'https://es-us.noticias.yahoo.com/nobel-ciencia-2026-qui%C3%A9nes-ganadores-091446335.html',
  },
  {
    id: 'n004',
    date: '2026-10-28',
    dateLabel: '10·28',
    tag: 'Internacional',
    title: 'Xina insta els EUA i l\'Iran a prioritzar el diàleg a l\'Orient Mitjà',
    desc: 'El ministre d\'Exteriors xinès declara que el diàleg és «l\'única solució» per al conflicte actual. El primer ministre de Bèlgica dimiteix per l\'impàs pressupostari.',
    url: 'https://theobjective.com/internacional/',
  },
  // ── 04·2026 ────────────────────────────────────────────────────
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
