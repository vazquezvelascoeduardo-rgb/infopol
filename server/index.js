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
  // — 12 agost 2026 —
  {
    id: 'n004',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Astronomia',
    title: 'Eclipse solar total — primer a la Península Ibèrica des de 1905',
    desc: 'El camí de totalitat cobreix Galícia, Aragó, Lleida, Tarragona, el País Valencià i Balears. Entre 1 i 2 minuts de foscor total a la posta de sol.',
    url: 'https://cnnespanol.cnn.com/2026/08/12/espana/live-news/eclipse-solar-total-en-vivo-imagenes-videos-orix',
  },
  {
    id: 'n005',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Seguretat',
    title: 'Catalunya: 30 tiroteus en 2026 vinculats al crim organitzat',
    desc: "Els Mossos registren un augment significatiu respecte al 2025. L'últim incident, al carrer Balmes de Barcelona. La Fiscalia investiga xarxes de narcotràfic.",
    url: 'https://prensaygente.com/cataluna-registra-30-tiroteos-en-2026-es-una-ejecucion-y-un-nivel-de-profesionalidad-dificil-de-ver/',
  },
  {
    id: 'n006',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Esport',
    title: "La Vuelta a Espanya 2026 comença el 22 d'agost des de Mònaco",
    desc: '81a edició amb 3.275 km, 21 etapes i nou finals en alt. La cursa passa per Andorra i conclou a Granada, substituint Madrid com a meta final.',
    url: 'https://www.eurosport.es/ciclismo/vuelta-a-espana/2026/fechas-perfiles-recorrido-etapas-favoritos-horarios-donde-ver-por-television-online-streaming_sto23327107/story.shtml',
  },
  {
    id: 'n007',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Ciència',
    title: 'Premis Breakthrough 2026: sis guardons de 3 M$ per a la ciència',
    desc: 'Els "Òscar de la ciència" reconeixen investigadors en biociències, física fonamental i matemàtiques. Cerimònia a Santa Mònica amb presència de Hollywood.',
    url: 'https://www.porlalinea.com.do/premios-breakthrough-2026-hollywood-ciencia/',
  },
  {
    id: 'n008',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Economia',
    title: 'Espanya lidera el creixement de la eurozona el 2026 (+2,1% PIB)',
    desc: "La inversió en fons europeus i la creació d'ocupació (+2%) impulsen l'economia espanyola per sobre Alemanya i França.",
    url: 'https://www.caixabank.com/es/esfera/content/perspectivas-crecimiento-economia-espana-2026',
  },
  {
    id: 'n009',
    date: '2026-08-11',
    dateLabel: '08·11',
    tag: 'Emergències',
    title: 'Incendis a Espanya: 800 evacuats i 20.000 ha cremades a Huelva',
    desc: "Quatre focus actius a Huelva, Castelló, Segòvia i Lleó. L'incendi de Niebla, fora de capacitat d'extinció, mobilitza 600 bombers i 26 aeronaus.",
    url: 'https://es.euronews.com/my-europe/2026/08/11/incendios-espana-fuego-avanza-huelva-huesca-tregua-segovia',
  },
  {
    id: 'n010',
    date: '2026-08-05',
    dateLabel: '08·05',
    tag: 'Internacional',
    title: 'Terratremol de 7,4 a Colòmbia: 181 morts i 2.500 ferits',
    desc: "Sisme de gran magnitud amb 195 desapareguts i milers d'habitatges danyats. L'emergència humanitària s'estén per diverses regions del país.",
    url: 'https://havanatimesenespanol.org/noticias/las-noticias-internacionales-en-breve-del-miercoles-5-de-agosto-de-2026/',
  },
  {
    id: 'n011',
    date: '2026-08-04',
    dateLabel: '08·04',
    tag: 'Geopolítica',
    title: "Trump suspèn atacs a l'Iran enmig de negociacions nuclears",
    desc: "EUA atura les operacions militars mentre continuen les converses sobre el programa nuclear i la reobertura de l'Estret d'Ormuz, bloquejat per la Guàrdia Revolucionària iraniana.",
    url: 'https://havanatimesenespanol.org/noticias/las-noticias-internacionales-en-breve-del-lunes-3-de-agosto-de-2026/',
  },
  // — normativa vigent —
  {
    id: 'n001',
    date: '2026-04-18',
    dateLabel: '04·18',
    tag: 'LO 1/2026',
    title: 'Multireincidència — enduriment de furts i estafes lleus',
    desc: "Reforma del CP i la LECrim. Vigent des del 10 d'abril de 2026. Afecta l'art. 22.8 CP i els arts. 468-470 LECrim.",
    url: null,
  },
  {
    id: 'n002',
    date: '2026-04-14',
    dateLabel: '04·14',
    tag: 'RD 316/2026',
    title: "Reforma del Reglament d'Estrangeria",
    desc: "Dues figures noves d'arrelament social. Termini de regularització fins al 30 de juny de 2026.",
    url: null,
  },
  {
    id: 'n003',
    date: '2026-03-28',
    dateLabel: '03·28',
    tag: 'Circ. 2/2026',
    title: 'Instrucció sobre identificació i registre de persones',
    desc: "Nova circular de la Fiscalia General sobre aplicació de l'art. 20 LO 4/2015.",
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
