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
    id: 'n010',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'POLÍTICA',
    title: 'Enquesta: PSC guanyaria a la baixa i Aliança Catalana seria la 2a força a Catalunya',
    desc: 'Sondeig del 16-22 juliol: PSC al 25% (34-37 escons). Erosió del Govern d\'Illa per Rodalies i vagues en educació i sanitat.',
    url: 'https://www.elcorreogallego.es/espana/2026/07/27/encuesta-elecciones-cataluna-psc-ganaria-132836657.html',
  },
  {
    id: 'n009',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'ECONOMIA',
    title: 'L\'Euríbor escala fins al 2,827% al juliol, màxim des del 2023',
    desc: 'Pujada que encareix les hipoteques variables. Una hipoteca mitjana de 150.000€ a 30 anys paga 482,46€/mes, tot i que estalvien 104€ respecte a l\'any passat.',
    url: 'https://www.euribor.com.es/2026/07/27/analisis-de-mercados-27-de-julio-de-2026-27-julio-2026/',
  },
  {
    id: 'n008',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'ECONOMIA',
    title: 'Apple supera Nvidia com l\'empresa amb major capitalització borsatil del món',
    desc: 'El gegant de Cupertino desplaça Nvidia del primer lloc en capitalització borsatil global. Espanya consolida el seu rol com a pol d\'entrada de fabricants de cotxes elèctrics xinesos a Europa.',
    url: null,
  },
  {
    id: 'n007',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'SUCCESSOS',
    title: 'Màlaga: cinc dones mortes de manera violenta en un mes; repunt de criminalitat estival',
    desc: 'Vuit morts violentes en poques setmanes, cinc al juliol. Les FFCS alerten del patró estacional de violència que es repeteix cada estiu.',
    url: 'https://www.elespanol.com/malaga/20260725/verano-negro-mujeres-malaga-asesinatos-mes-violencia-dispara/1003744333349_0.amp.html',
  },
  {
    id: 'n006',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'CULTURA',
    title: 'Carlos Folgoso guanya el Premi Descobriments de PHotoEspaña 2026 amb \'Alén do Lago\'',
    desc: 'El fotògraf gallec s\'imposa en una edició centrada en narratives de territori, memòria i gènere. El premi reconeix el talent emergent de la fotografia en castellà.',
    url: 'https://www.galiciapress.es/articulo/cultura/2026-07-24/5964853-fotografo-gallego-carlos-folgoso-gana-premio-descubrimientos-photoespana-alen-do-lago',
  },
  {
    id: 'n005',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'INTERNACIONAL',
    title: 'Incendis forestals: 300.000 evacuats a França i Espanya; la Gironda arriba a 42.000 hectàrees',
    desc: 'L\'incendi de la Gironda es manté imprevisible. S\'esperen temperatures de fins a 40°C a partir de dimarts, cosa que complica les tasques d\'extinció.',
    url: 'https://es.euronews.com/video/2026/07/27/ultimas-noticias-27-julio-2026-manana',
  },
  {
    id: 'n004',
    date: '2026-07-27',
    dateLabel: '07·27',
    tag: 'INTERNACIONAL',
    title: 'AIDS 2026: la 26a Conferència Internacional sobre la Sida obre a Rio de Janeiro en crisi de finançament',
    desc: 'La conferència (27-31 juliol) afronta retallades sense precedents en programes globals de lluita contra el VIH. La crisi de finançament és la major des de la pandèmia.',
    url: 'https://es.euronews.com/video/2026/07/27/ultimas-noticias-27-julio-2026-manana',
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
