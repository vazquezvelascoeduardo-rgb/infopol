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
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'TC · Amnistia',
    title: 'El TC avala l\'amnistia per malversació i obre la porta al retorn de Puigdemont',
    desc: 'Set magistrats contra cinc validen l\'aplicació de la llei d\'amnistia al delicte de malversació, corregint el criteri del Tribunal Suprem. El debat sobre el possible retorn de Puigdemont sense ordre d\'arrest activa es reactiva.',
    url: 'https://www.moncloa.com/2026/09/23/aznar-campus-faes-2026-sanchez-bildu-3436436',
  },
  {
    id: 'n010',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'Mossos · Segrestos',
    title: 'Tercer segrest exprés en un mes a Catalunya — els Mossos obren investigació conjunta',
    desc: 'Tres casos amb modus operandi similar registrats al setembre. El primer va ocórrer el 8 de setembre a Gavà: un home disparat va ser introduït al maleter d\'un cotxe i alliberat a Sabadell.',
    url: 'https://www.cope.es/emisoras/catalunya/noticias/mossos-investigan-tercer-secuestro-expres-perpetrado-mes-cataluna-20260922_3441066.html',
  },
  {
    id: 'n009',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'Rodalies · Incident',
    title: 'Robatori de coure talla la R1 entre Badalona i El Clot — afectació a R3 i R4',
    desc: 'Greus retards i serveis limitats a les línies R1, R3 i R4 de Rodalies. La incidència s\'ha produït en hora punta matinal d\'avui, 23 de setembre.',
    url: 'https://www.moncloa.com/2026/09/23/robo-cobre-rodalies-r1-badalona-clot-3436446/',
  },
  {
    id: 'n008',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'ONU 2026',
    title: 'Zelenski demana a Trump pressió per aturar la guerra d\'Ucraïna abans de l\'hivern',
    desc: 'El president ucraïnès intervé a l\'Assemblea General de l\'ONU a Nova York. Xi Jinping visita Washington per una trobada bilateral amb Trump als marges del fòrum internacional.',
    url: 'https://es-us.noticias.yahoo.com/euronews-noticias-23-septiembre-2026-160024403.html',
  },
  {
    id: 'n007',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'Estadística · Delictes',
    title: 'Els delictes cauen un 8,4% a Catalunya fins a l\'agost — 361.074 fets registrats',
    desc: 'Taxa de 44,32 delictes per 1.000 habitants en els primers vuit mesos de 2026. La reducció afecta especialment els delictes contra el patrimoni.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-09-19/6016129-delitos-caen-84-catalunya-hasta-agosto-361074-casos-registrados',
  },
  {
    id: 'n006',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'Conveni policial',
    title: 'Interior i Barcelona signen el conveni Mossos–Guàrdia Urbana per denúncies conjuntes des del 2027',
    desc: 'El nou marc permet tramitar denúncies per faltes menors a totes les comissaries de la Guàrdia Urbana. La integració operativa serà plena a partir del gener de 2027.',
    url: 'https://www.moncloa.com/2026/09/17/convenio-mossos-guardia-urbana-barcelona-3433162',
  },
  {
    id: 'n005',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'Esport · Bàsquet',
    title: 'Barça estrena l\'Euroliga al Palau Blaugrana contra l\'Anadolu Efes (dijous 24, 20:30h)',
    desc: 'El conjunt blaugrana debuta en la fase de grups de l\'Euroliga 2026-27. La temporada arrenca amb aspiracions de Final Four per al club.',
    url: 'https://hotelarclarambla.com/agenda/eventos-deportivos/mejores-eventos-deportivos-en-barcelona-en-septiembre-2026/',
  },
  {
    id: 'n004',
    date: '2026-09-23',
    dateLabel: '09·23',
    tag: 'Premis Investigació',
    title: 'El MICIU atorga els Premis Nacionals d\'Investigació 2026 — per primera vegada dues investigadores guanyen en ciències',
    desc: 'Deu premis de 30.000 € cadascun. El Premi Margarita Salas (Biologia) i el Premi Ángela Ruiz Robles (Transferència de Coneixement) recauen per primera vegada en dones.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/MICIU-concede-Premios-Nacionales-Investigacion-2026.html',
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
