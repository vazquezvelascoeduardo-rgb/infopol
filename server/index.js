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
    date: '2026-07-24',
    dateLabel: '07·24',
    tag: 'Emergència',
    title: 'Emergència nacional per incendis a la Serra Oest de Madrid — +10.000 evacuats',
    desc: 'Tres incendis actius a la Comunitat de Madrid es fusionen en un sol front (#IFSierraOeste). L\'executiu declara emergència d\'interès nacional. Afecta també Castella-La Manxa i Castella i Lleó.',
    url: 'https://www.comunidad.madrid/noticias/2026/07/23/comunidad-madrid-vive-situacion-critica-incendios-forestales-multiples-extrema-gravedad',
  },
  {
    id: 'n005',
    date: '2026-07-24',
    dateLabel: '07·24',
    tag: 'Internacional',
    title: 'Trump amenaça d\'usar actius iranians congelats per indemnitzar danys al Golf Pèrsic',
    desc: 'Els EUA consideren mobilitzar reserves iranianes bloquejades com a represàlia pels atacs a vaixells al Golf Pèrsic. L\'Iran qualifica la mesura de \'precedent incendiari\'.',
    url: 'https://www.infobae.com/america/agencias/2026/07/24/viernes-24-de-julio-de-2026-0700-gmt/',
  },
  {
    id: 'n006',
    date: '2026-07-24',
    dateLabel: '07·24',
    tag: 'Justícia Int.',
    title: 'La CPI vota a Nova York la possible destitució del fiscal Karim Khan',
    desc: 'Els estats membres del Tribunal Penal Internacional es reuneixen per decidir la dimissió forçada del fiscal en cap, acusat de conducta sexual indeguda.',
    url: 'https://es.euronews.com/2026/07/24/euronews-hoy-las-noticias-del-jueves-24-de-julio-los-peores-incendios-de-la-comunidad-de-m',
  },
  {
    id: 'n007',
    date: '2026-07-23',
    dateLabel: '07·23',
    tag: 'Successos',
    title: 'Desarticulat a Catalunya un clan familiar per tràfic d\'armes de guerra',
    desc: 'Operació conjunta dels Mossos d\'Esquadra i la Policia Nacional. Comissats un llançagranades, 45 pistoles i diverses granades. La xarxa proveïa el crim organitzat arreu d\'Europa.',
    url: 'https://www.moncloa.com/2026/07/23/desarticulado-clan-familiar-trafico-armas-cataluna-3404132/',
  },
  {
    id: 'n008',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Successos',
    title: 'Home punxalat al Somorrostro de Barcelona tot trencant una ordre d\'allunyament',
    desc: 'La víctima va ser agredida amb arma blanca per una persona que hauria vulnerat una ordre judicial de distanciament. Els Mossos d\'Esquadra investiguen el cas.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-07-21/5960037-apunalado-hombre-sorromostro-despues-quebrantar-supuestamente-orden-alejamiento',
  },
  {
    id: 'n009',
    date: '2026-07-19',
    dateLabel: '07·19',
    tag: 'Esports',
    title: 'Espanya, campiona del món 2026 — Yamal fa història als 19 anys',
    desc: 'La Roja s\'imposa a l\'Argentina en la final del Mundial (Mèxic-USA-Canadà) amb un gol de Ferran Torres a la pròrroga. Lamine Yamal, el quart campió del món més jove de la història.',
    url: 'https://www.elfinanciero.com.mx/deportes/mundial-2026/2026/07/19/espana-vs-argentina-en-vivo-quien-es-el-campeon-de-la-copa-del-mundo/',
  },
  {
    id: 'n010',
    date: '2026-07-14',
    dateLabel: '07·14',
    tag: 'Ciència',
    title: 'Almirall (Barcelona) rep el Premi Nacional d\'Innovació 2026 a Gran Empresa',
    desc: 'El Ministeri de Ciència distingeix el laboratori farmacèutic barceloní per la seva trajectòria en dermatologia mèdica i per una inversió en R+D de més de 2.000 M€ en 20 anys.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  {
    id: 'n011',
    date: '2026-07-09',
    dateLabel: '07·09',
    tag: 'Política Cat.',
    title: 'Baròmetre CEO juliol: PSC perd escons i Aliança Catalana desbanca Junts',
    desc: 'Primer baròmetre del CEO del 2026: el PSC d\'Illa cedeix terreny, ERC remunta i Aliança Catalana es consolida com a tercera força, desplaçant Junts del tercer lloc al Parlament.',
    url: 'https://www.cope.es/emisoras/catalunya/noticias/ceo-dibuja-nuevo-escenario-politico-psc-pierde-fuelle-alianca-catalana-dispara-hunde-junts-20260709_3401900.html',
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
