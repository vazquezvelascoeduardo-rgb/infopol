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
    date: '2026-08-09',
    dateLabel: '08·09',
    tag: 'OPE Mossos 46/26',
    title: 'OPE Mossos: termini 13 d\'agost per acreditar el català',
    desc: 'Fins al 13 d\'agost, els aspirants a les 1.587 places (634 reservades a dones) poden presentar documentació per quedar exempts de la prova de llengua catalana.',
    url: 'https://oposicionesmossosesquadra.com/convocatoria-mossos/',
  },
  {
    id: 'n005',
    date: '2026-08-09',
    dateLabel: '08·09',
    tag: 'Ciència · Astronomia',
    title: 'Eclipse solar total el 12 d\'agost — la totalitat passa per Catalunya',
    desc: 'Primer eclipse total visible des de Catalunya des del 1905. La franja travessa les Terres de l\'Ebre, el Camp de Tarragona i el Ponent. La Generalitat activa dispositiu especial de trànsit.',
    url: 'https://www.moncloa.com/2026/07/31/eclipse-solar-cataluna-12-agosto-3408456/',
  },
  {
    id: 'n006',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Policial · Europol',
    title: '78 detinguts en una gran operació contra el tràfic de persones al Mediterrani',
    desc: 'Policia Nacional, Guàrdia Civil i Europol desmantellen la xarxa que va introduir 2.000 migrants il·legalment. 18 embarcacions, 27 en presó provisional i 24 M€ decomissats.',
    url: 'https://www.moncloa.com/2026/08/07/red-trafico-personas-espana-78-detenidos-3412053/',
  },
  {
    id: 'n007',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Judicial · TC',
    title: 'TC: Stc. 54/2026 sobre el recurs de Castella-La Manxa contra la Llei d\'Amnistia',
    desc: 'Recurs d\'inconstitucionalitat 6552-2024 contra la LO 1/2024 de 10 de juny (normalització institucional a Catalunya). El TC resol definitivament el cas.',
    url: 'https://www.tribunalconstitucional.es/es/jurisprudencia/Paginas/Sentencias.aspx',
  },
  {
    id: 'n008',
    date: '2026-08-04',
    dateLabel: '08·04',
    tag: 'Economia · Habitatge',
    title: 'La vivenda a Catalunya arriba a 3.504 €/m², nou rècord històric',
    desc: '+13,1% interanual al juliol a Catalunya (Idealista). A tot l\'Estat puja un 15,8% al segon trimestre, superant el màxim de la bombolla immobiliària del 2007.',
    url: 'https://www.pressdigital.es/articulo/economia/2026-08-04/5974883-vivienda-usada-alcanza-nuevo-maximo-historico-subir-131-julio-segun-idealista',
  },
  {
    id: 'n009',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Esports · Natació',
    title: 'Europeu natació artística: Espanya guanya vuit medalles a París',
    desc: 'El duo Iris Tió / Lilou Lluís, subcampiones en rutina lliure. L\'equip, amb el programa "Berghain" de Rosalía, guanya la plata. Campionat Europeu a París (31 jul – 16 ago).',
    url: 'https://www.olympics.com/es/noticias/nataciona-artistica-espana-berghain-plata-impresion-artistica-europeo-2026-acrobatico',
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
