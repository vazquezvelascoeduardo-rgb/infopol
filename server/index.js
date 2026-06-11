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
  // ── 11 juny 2026 ──────────────────────────────────────────────
  {
    id: 'n010',
    date: '2026-06-11',
    dateLabel: '06·11',
    tag: 'MUNDIAL 2026',
    title: 'Copa del Món: Mèxic inaugura el torneig contra Sud-àfrica a l\'Estadi Azteca',
    desc: 'Julián Quiñones marcà el primer gol del torneig de 48 seleccions. Shakira i Salma Hayek encapçalaren la cerimònia d\'apertura a la Ciutat de Mèxic.',
    url: 'https://www.mediotiempo.com/futbol/copa-mundial/inauguracion-mundial-2026-en-vivo-a-que-hora-donde-ver-ceremonia-hoy-mexico',
  },
  {
    id: 'n009',
    date: '2026-06-11',
    dateLabel: '06·11',
    tag: 'INT · CONFLICTE',
    title: 'EUA bombardeja l\'Iran per segon dia consecutiu — Trump avisa de represàlies',
    desc: 'Trump va declarar que l\'Iran "ha trigat massa" per arribar a un acord i "haurà de pagar el preu". La crisi nuclear s\'intensifica sense resolució a la vista.',
    url: 'https://www.riotimesonline.com/global-economy-briefing-june-11-2026/',
  },
  {
    id: 'n008',
    date: '2026-06-11',
    dateLabel: '06·11',
    tag: 'ECO · INT',
    title: 'Inflació als EUA al 4,2% anual al maig, màxim des del 2023; el Dow cau 953 punts',
    desc: 'L\'energia puja un 3,9% en un mes i explica el 60% de l\'increment. La inflació subjacent es manté moderada però els mercats reaccionen clarament a la baixa.',
    url: 'https://www.riotimesonline.com/global-economy-briefing-june-11-2026/',
  },
  {
    id: 'n007',
    date: '2026-06-11',
    dateLabel: '06·11',
    tag: 'ECO · ESP',
    title: 'El Govern presentarà el marc macroeconòmic dels PGE 2027 el 23 de juny',
    desc: 'El ministre Cuerpo ho va anunciar al Congrés. Espanya apunta a un dèficit del 2,1% del PIB amb un creixement previst del 2,2% per al 2026.',
    url: 'https://www.lamoncloa.gob.es/',
  },
  {
    id: 'n006',
    date: '2026-06-11',
    dateLabel: '06·11',
    tag: 'SUCCÉS',
    title: 'Mossos i Guàrdia Urbana desmantellen cinc xarxes criminals al primer trimestre',
    desc: '136 persones investigades per furts especialitzats a Barcelona en operacions conjuntes entre Mossos d\'Esquadra i la Guàrdia Urbana.',
    url: 'https://www.totbarcelona.cat/es/sucesos/',
  },
  // ── 5 juny 2026 ───────────────────────────────────────────────
  {
    id: 'n005',
    date: '2026-06-05',
    dateLabel: '06·05',
    tag: 'CIÈNCIA',
    title: 'El X-59 de la NASA trenca per primer cop la barrera del so en vol experimental',
    desc: 'El vol del 5 de juny obre la porta a l\'aviació supersònica civil silenciosa. El X-59 és dissenyat per eliminar el "boom" sònic tradicional.',
    url: 'https://noticiasdelaciencia.com/',
  },
  // ── 30 maig 2026 ──────────────────────────────────────────────
  {
    id: 'n004',
    date: '2026-05-30',
    dateLabel: '05·30',
    tag: 'UCL 2025-26',
    title: 'PSG campió de la Champions per segon any consecutiu al Puskás Aréna de Budapest',
    desc: 'El Paris Saint-Germain iguala el Real Madrid com a únic club a repetir títol en el nou format de lliga de la Champions League.',
    url: 'https://es.wikipedia.org/wiki/Liga_de_Campeones_de_la_UEFA_2025-26',
  },
  // ── Notícies anteriors ─────────────────────────────────────────
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
