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
  // ── 15 setembre 2026 ──────────────────────────────────────────
  {
    id: 'n0915a',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Tribunal Suprem',
    title: 'El Suprem manté l\'ordre d\'arrest de Puigdemont — rebutja l\'amnistia per malversació',
    desc: 'El jutge Llanera descarta aplicar la Llei d\'Amnistia als càrrecs de malversació. Puigdemont i Comín continuen subjectes a processament i l\'arrest nacional segueix vigent.',
    url: 'https://www.moncloa.com/2026/09/15/supremo-amnistia-puigdemont-3431972',
  },
  {
    id: 'n0915b',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Mossos',
    title: 'Sis detinguts a Badia del Vallès per un tiroteig entre dos clans i tràfic de drogues',
    desc: 'El tiroteig del 17 d\'agost entre dues famílies pel control de cultius acaba amb 6 detinguts. Es decomissen 385 plantes de marihuana i es detecta frau elèctric de +13.000 €.',
    url: 'https://www.moncloa.com/2026/09/15/detenidos-badia-valles-drogas-tiroteo-3431786/',
  },
  {
    id: 'n0915c',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'TSJCat',
    title: 'Judici al TSJC per l\'acomiadament de 2.000 moderadors de Facebook i Instagram a Barcelona',
    desc: 'Comença la vista oral al Tribunal Superior de Justícia de Catalunya. La subcontractada va tancar el centre de la Torre Glòries el 2026, deixant en atur els treballadors.',
    url: null,
  },
  {
    id: 'n0915d',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'IPC · Cat.',
    title: 'L\'IPC a Catalunya puja al 4% a l\'agost — ous i cítrics lideren l\'encariment',
    desc: 'L\'índex de preus al consum augmenta cinc dècimes fins al 4% interanual. Ous +12,5%, llegums +16%, cítrics +17% i peix fresc +8%.',
    url: null,
  },
  {
    id: 'n0915e',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Habitatge',
    title: 'Rècord de compradors estrangers al mercat immobiliari espanyol — 15,98% de les operacions',
    desc: 'El segon trimestre de 2026 registra el màxim històric amb més de 26.800 compravendes per part d\'estrangers. La demanda forana pressiona els preus a les grans capitals.',
    url: null,
  },
  {
    id: 'n0915f',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Indústria',
    title: 'Primer dèficit comercial del sector automobilístic espanyol des del 2008',
    desc: '158 milions d\'euros de dèficit al primer semestre de 2026, trencant 16 anys de superàvit consecutiu. L\'augment de les importacions explica el canvi de tendència.',
    url: null,
  },
  {
    id: 'n0915g',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Comerç Global',
    title: 'EUA imposa un recàrrec del 50% sobre productes canadencs enmig de la guerra comercial',
    desc: 'A partir d\'avui, formatges, mobles, alumini i embarcacions canadencs reben la nova sobretaxa. Ottawa respon amb la primera Cimera d\'Inversió a Toronto.',
    url: null,
  },
  {
    id: 'n0915h',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Bàltic',
    title: 'Dinamarca denuncia que una fragata russa va llançar bengales contra un helicòpter militar danès',
    desc: 'L\'incident es produeix en aigües internacionals del mar Bàltic. Una de les bengales va passar a pocs metres de l\'aparell danès en un nou episodi de tensió militar a la zona.',
    url: null,
  },
  {
    id: 'n0915i',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'LaLiga · J6',
    title: 'Barça, líder invicte amb 15 punts — Lamine Yamal, candidat al Pilota d\'Or amb 7 gols',
    desc: 'Victòria 4-2 davant el Llevant per mantenir 3 punts d\'avantatge sobre el Madrid. El davanter de 19 anys iguala el rècord de Messi en inici de temporada i té el suport del vestidor per al Pilota d\'Or.',
    url: 'https://sports.yahoo.com/articles/fc-barcelona-news-15-september-090000566.html',
  },
  {
    id: 'n0915j',
    date: '2026-09-15',
    dateLabel: '09·15',
    tag: 'Ig Nobel 2026',
    title: 'Premis Ig Nobel 2026: proteïnes de la llet de cuques de llum tripliquen l\'energia de la llet de vaca',
    desc: 'La cerimònia de Zuric premia la recerca científica més inusual. Altres guardonats: estudi aerodinàmic de com mocar-se correctament i un urinari dissenyat per evitar esquitxades.',
    url: 'https://www.que.es/2026/09/05/premios-ig-nobel-2026-ganadores/',
  },
  // ── Anterior ──────────────────────────────────────────────────
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
