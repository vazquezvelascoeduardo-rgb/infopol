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
    id: 'n004',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Internacional',
    title: 'Netanyahu rebutja el pla de pau de Trump per a Gaza',
    desc: 'Israel rebutja el document de 15 punts i exigeix el desarmament total de Hamas abans de qualsevol retirada. Tensió diplomàtica entre Jerusalem i Washington a menys de tres mesos de les eleccions israelianes.',
    url: 'https://www.aljazeera.com/news/2026/8/9/israel-rejects-trumps-15-point-plan-for-gaza',
  },
  {
    id: 'n005',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Internacional',
    title: 'Inundacions a l\'Assam (Índia): 100 morts i 700.000 desplaçats',
    desc: 'Les pluges del monsó han desbordat el riu Brahmaputra. Prop de 300.000 persones han evacuat a camps governamentals mentre els rius segueixen per sobre del nivell de perill.',
    url: 'https://www.npr.org/2026/08/10/g-s1-138015/flood-death-toll-in-indias-assam-reaches-100-as-thousands-lose-their-homes',
  },
  {
    id: 'n006',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Política',
    title: 'Junts exigeix excloure Catalunya del repartiment de menors de Ceuta',
    desc: 'La formació avisa que retirarà el suport legislatiu al Govern si s\'imposen quotes. Nogueras acusa Illa d\'anteponer els interessos de Sánchez als de Catalunya.',
    url: 'https://www.moncloa.com/2026/08/10/junts-excluir-catalunya-reparto-menores-ceuta-3413490/',
  },
  {
    id: 'n007',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Medi Ambient',
    title: 'Impugnen el pla català de renovables malgrat el retard de l\'autonomia',
    desc: 'Una coalició porta als tribunals el pla energètic de la Generalitat, posant en risc els objectius de transició energètica de Catalunya per als propers anys.',
    url: 'https://cronicaglobal.elespanol.com/politica/20260810/coalicion-impugna-plan-catalan-renovables-retraso-autonomia/1003742785787_0.html',
  },
  {
    id: 'n008',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Astronomia',
    title: 'Eclipse solar total: dimecres el primer visible a Espanya en més d\'un segle',
    desc: 'El 12 d\'agost la franja de totalitat creuarà la meitat nord de la Península, passant per Burgos, Saragossa i Castelló. El proper eclipsi total visible des d\'Espanya no serà fins al 2180.',
    url: 'https://eclipses.ign.es/eclipse-total-sol-de-12-de-agosto-2026.html',
  },
  {
    id: 'n009',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Ciència',
    title: 'Espanya atorga els Premis Nacionals d\'Investigació 2026',
    desc: 'Ángel Carracedo (medicina forense i genòmica) i Carmen Gutiérrez (musicologia) entre els guardonats. Per primera vegada, els premis joves en biologia i transferència de coneixement recauen en dones.',
    url: 'https://www.infosalus.com/salud-investigacion/noticia-ciencia-concede-premios-nacionales-investigacion-2026-reconocen-excelencia-investigadores-20260730172439.html',
  },
  {
    id: 'n010',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Esports',
    title: 'El Barça prioritza Julián Álvarez com a davanter en l\'últim mes de mercat',
    desc: 'Deco i Flick acorden tres fitxatges més per tancar la plantilla 2026-27. El club ja ha incorporat Cancelo, Bisiwu, Adeyemi i Gordon durant l\'estiu.',
    url: 'https://www.elnacional.cat/ca/esports/deco-acorda-flick-arribada-tres-fitxatges-mes-barca-en-mercat-estiu_1678891_102.html',
  },
  {
    id: 'n011',
    date: '2026-08-10',
    dateLabel: '08·10',
    tag: 'Economia',
    title: 'Espanya creix un 2,5% el 2026 i lidera la zona euro',
    desc: 'Les previsions consoliden el diferencial positiu de l\'economia espanyola respecte a la resta de la zona euro, impulsada pel consum, el turisme i els fons NextGenerationEU.',
    url: 'https://www.democrata.es/democrata-pro/comunicados/espana-seguira-creciendo-por-encima-de-la-eurozona-con-una-expansion-del-2-5-en-2026/',
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
