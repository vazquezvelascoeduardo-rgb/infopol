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
  // ── 28 juliol 2026 ─────────────────────────────────────────────
  {
    id: 'n012',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Economia Cat.',
    title: 'La gasolina baixa a 1,65 €/l i el dièsel a 1,74 €/l',
    desc: 'El preu dels carburants continua baixant el 28 de juliol, reduint el cost del transport per als conductors catalans i espanyols.',
    url: 'https://www.democrata.es/economia/precio-gasolina-hoy-28-julio-2026-baja-hasta-165-euros-litro-diesel-cae-174-euros/',
  },
  {
    id: 'n011',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Emergències Int.',
    title: 'Incendis al sud-oest de França: 98.000 ha cremades i 220.000 persones evacuades',
    desc: 'Un gegantesc incendi avança a 30 km de Bordeus, devastant 40.000 ha a la Gironda. França viu una de les pitjors temporades d\'incendis de la seva història.',
    url: 'https://noticiasargentinas.com/internacionales/incendios-forestales-en-el-suroeste-de-francia--mas-de-220-000-personas-evacuadas-_a6a6731cbc5b51cb7e4dde2b5',
  },
  {
    id: 'n010',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Internacional',
    title: 'Zelenski es reuneix amb Trump a la Casa Blanca per reforçar el suport a Ucraïna',
    desc: 'El president ucraïnès busca suport diplomàtic i militar dels EUA i aconsegueix llicències per fabricar sistemes Patriot, coincidint amb el funeral del senador Lindsey Graham.',
    url: 'https://www.france24.com/es/ee-uu-y-canad%C3%A1/20260728-zelenski-busca-reforzar-el-apoyo-de-trump-en-una-reuni%C3%B3n-en-la-casa-blanca',
  },
  {
    id: 'n009',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Internacional',
    title: 'Keiko Fujimori jura com a presidenta del Perú pel període 2026–2031',
    desc: 'La filla d\'Alberto Fujimori assumeix la presidència del Perú en una cerimònia a Lima, posant fi a 10 anys d\'inestabilitat política. Hi assisteix el rei d\'Espanya.',
    url: 'https://www.proceso.com.mx/internacional/2026/7/28/keiko-fujimori-asume-la-presidencia-de-peru-con-el-desafio-de-lograr-estabilidad-y-frenar-el-crimen-376966.html',
  },
  {
    id: 'n008',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Emergències Esp.',
    title: 'Incendis forestals: 130.000 ha cremades i emergència nacional a Madrid i Àvila',
    desc: 'El Govern declara zones d\'emergència a Madrid, Castella i Lleó, Castella-La Manxa i la C. Valenciana. Primera vegada que s\'activa l\'emergència d\'interès nacional per incendi forestal.',
    url: 'https://es.wikipedia.org/wiki/Incendios_forestales_en_Espa%C3%B1a_de_2026',
  },
  {
    id: 'n007',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Economia',
    title: 'L\'euríbor baixa al 2,943% i redueix la mitjana mensual de juliol',
    desc: 'L\'euríbor a 12 mesos registra un valor diari del 2,943% el 28 de juliol. BlackRock escull Espanya com a país preferit per invertir en renda variable.',
    url: 'https://www.democrata.es/economia/euribor-hoy-28-julio-2026-baja-2943-reduce-media-mensual-julio/',
  },
  {
    id: 'n006',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Política Esp.',
    title: 'Sánchez anuncia els pressupostos del 2027 i defensa la continuïtat de la legislatura',
    desc: 'El president del Govern fa balanç del curs polític i reitera la seva intenció de presentar i aprovar els pressupostos generals del 2027 abans de final d\'any.',
    url: 'https://www.laregion.es/espana/frases-pedro-sanchez-balance-ano_1_20260728-4367099.html',
  },
  {
    id: 'n005',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Política Cat.',
    title: 'Aliança Catalana puja als sondejos i Junts cau al primer baròmetre del CEO del 2026',
    desc: 'El baròmetre del Centre d\'Estudis d\'Opinió mostra que Aliança Catalana viu un ascens meteòric mentre Junts experimenta una caiguda significativa al Parlament.',
    url: null,
  },
  {
    id: 'n004',
    date: '2026-07-28',
    dateLabel: '07·28',
    tag: 'Succés Cat.',
    title: 'Socavó del Putxet: Junts exigeix la dimissió de Paneque i Nadal',
    desc: 'Junts reclama responsabilitats polítiques pel socavó de 8 metres a l\'L9 que va forçar el desallotjament de 93 habitatges al barri del Putxet-Sant Gervasi de Barcelona.',
    url: 'https://www.merca2.es/2026/07/08/socavon-l9-metro-barcelona-putxet-2413680/',
  },
  // ── Normativa anterior ─────────────────────────────────────────
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
