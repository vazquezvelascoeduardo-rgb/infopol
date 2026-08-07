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
  // ── 07·08·2026 ─────────────────────────────────────────────────
  {
    id: 'n009',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Política',
    title: 'Crisi migratòria a Ceuta — 60.000 entrades des del 30 de juliol',
    desc: 'Desbordament sense precedents a la frontera amb el Marroc. El PP reclama compareixença de quatre ministres al Senat per explicar la situació.',
    url: 'https://www.infobae.com/espana/2026/08/02/la-crisis-de-ceuta-en-cinco-claves-de-las-falsas-promesas-de-asilo-a-la-avalancha-de-60000-personas-y-el-papel-de-marruecos/',
  },
  {
    id: 'n010',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Economia',
    title: 'Espanya supera els 49,8 milions d\'habitants — màxim històric',
    desc: 'La població creix 104.178 persones en el segon trimestre. El PIB s\'expandirà un 2,5% el 2026, liderant la zona euro.',
    url: 'https://www.democrata.es/democrata-pro/comunicados/espana-seguira-creciendo-por-encima-de-la-eurozona-con-una-expansion-del-2-5-en-2026/',
  },
  {
    id: 'n011',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Economia',
    title: 'El lloguer a Espanya baixa per primera vegada en 52 mesos',
    desc: 'El preu del lloguer cau un 1,6% interanual fins als 14,14 €/m² el juliol de 2026, trencant una tendència alcista de més de quatre anys.',
    url: 'https://www.eleconomista.es/economia/',
  },
  {
    id: 'n012',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Esports',
    title: 'El Barça tanca el fitxatge de Rodri per ~50 M€',
    desc: 'El migcampista ha donat llum verda al Barça per negociar amb el Manchester City. S\'espera la seva incorporació el 12 d\'agost, amb el retorn dels mundialistes.',
    url: 'https://www.barcablaugranes.com/barcelona-news/128368/fc-barcelona-news-7-august-2026-gavi-returns-to-training-barca-in-advanced-talks-to-sign-rodri',
  },
  {
    id: 'n013',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Esports',
    title: 'Plata per a l\'equip català de gimnàstica rítmica',
    desc: 'Iris Tió, Meritxell Ferré, Mireia Hernández i Lilou Lluís aconsegueixen la segona posició en la competició per equips.',
    url: 'https://www.elnacional.cat/es/deportes.html',
  },
  {
    id: 'n014',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Internacional',
    title: 'Venezuela reprèn el diàleg de transició set mesos després de la caiguda de Maduro',
    desc: 'El govern interí de Delcy Rodríguez i part de l\'oposició inicien negociacions sota pressió dels EUA. Resten 379 presos polítics en detenció.',
    url: 'https://cnnespanol.cnn.com/2026/08/06/venezuela/chavismo-dialogo-oposicion-presion-ee-uu-orix',
  },
  {
    id: 'n015',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Ciència',
    title: 'El telescopi solar Inouye descobreix vòrtexs de plasma inèdits al Sol',
    desc: 'Les imatges de major resolució fins avui de la fotosfera solar revelen per primera vegada la inestabilitat de Kelvin-Helmholtz. Publicat a Nature.',
    url: 'https://cnnespanol.cnn.com/2026/08/06/ciencia/imagenes-sol-alta-resolucion-misterios-magneticos-trax',
  },
  {
    id: 'n016',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Premis',
    title: 'Premis Nacionals d\'Investigació 2026 — 20 investigadors guardonats',
    desc: 'El Govern premia l\'excel·lència científica amb 30.000 € per categoria. Destaca Ángel Carracedo (medicina forense i genòmica) i Carmen Gutiérrez (musicologia).',
    url: 'https://www.consalud.es/profesionales/espana-premia-la-excelencia-cientifica-de-20-investigadores-y-marca-un-hito-en-el-talento-joven-femenino.html',
  },
  {
    id: 'n017',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Esports / FIFA',
    title: 'Infantino manté el suport intern malgrat la pressió per dimitir',
    desc: 'La UEFA manté el boicot als tornejos de la FIFA. El president conserva el recolzament dels directius tot i la polèmica pel nou format del Mundial.',
    url: 'https://www.ahoramisiones.com.ar/2026/08/internacionales-viernes-7-de-agosto-de.html',
  },
  // ── Normativa vigent ───────────────────────────────────────────
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
