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
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Successos · Cat',
    title: 'Detingut un agent antidrogues a Barcelona per vendre informació a narcos',
    desc: 'Un agent de la unitat antidroga de la Comissaria Superior de Catalunya ha ingressat a presó preventiva acusat d\'acumular gairebé 900 consultes injustificades a bases de dades policials i filtrar informació a narcotraficants. L\'alerta va arribar de la policia britànica i sueca.',
    url: 'https://www.moncloa.com/2026/08/17/topo-policia-narcotrafico-barcelona-3416537',
  },
  {
    id: 'n010',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Successos · Cat',
    title: 'Detingut al centre de Barcelona un fugitiu cercat per assassinat a Islàndia',
    desc: 'La Policia Nacional ha detingut un perillós fugitiu allotjat en un hotel del centre de Barcelona que tenia una ordre de recerca i captura de la justícia islandesa per suposat assassinat amb substàncies corrosives i armes tallants.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-08-14/5984107-detenido-pleno-centro-barcelona-peligroso-fugitivo-enfrenta-cadena-perpetua',
  },
  {
    id: 'n009',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Política · Cat',
    title: 'Junts reclama dimissions per les 93 famílies desallotjades al Putxet',
    desc: 'El socavó obert al barri del Putxet de Barcelona ha obligat a desallotjar 93 habitatges. Junts exigeix la dimissió del conseller Paneque i de Nadal, responsabilitzant el Govern de negligència en el manteniment d\'infraestructures.',
    url: 'https://www.pressdigital.es/articulo/economia/2026-08-18/5986706-principals-titulars-periodicos-martes-18-agosto',
  },
  {
    id: 'n008',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Política · Esp',
    title: 'El Govern i el PP s\'enfronten pel model d\'acollida de migrants',
    desc: 'El pols entre el Govern central i el Partit Popular sobre la gestió dels migrants aguditza el conflicte polític estatal. El Govern anuncia que s\'encarregarà dels migrants després de 18 dies de crisi no resoltes, en plena remodelació dels acords d\'acollida.',
    url: 'https://www.pressdigital.es/articulo/economia/2026-08-18/5986706-principales-titulares-periodicos-martes-18-agosto',
  },
  {
    id: 'n007',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Economia · Cat',
    title: 'La DO Catalunya amplia la zona de producció vitivinícola amb 60 nous municipis',
    desc: 'La Denominació d\'Origen Catalunya incorpora 44 nous termes municipals en exclusiva i 16 en coexistència amb altres DO. La mesura reforça el sector del vi català i consolida Catalunya com a referent vitivinícola d\'Europa.',
    url: 'https://www.elnacional.cat/oneconomia/es/tipos-interes/tipos-interes-este-martes-18-agosto_1682650_102.html',
  },
  {
    id: 'n006',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Economia · Esp',
    title: 'La CNMC tanca cinc anys de vigilància sobre CaixaBank',
    desc: 'La Comissió Nacional dels Mercats i la Competència ha posat fi a la supervisió iniciada el 2021 per garantir la competència bancària arran dels compromisos adquirits per CaixaBank, dirigit per Gonzalo Gortázar. Espanya es consolida com a única gran economia que trenca la tendència europea.',
    url: 'https://www.elnacional.cat/es',
  },
  {
    id: 'n005',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Esports · Cat',
    title: 'Rodri arriba a Barcelona per signar el seu contracte amb el FC Barcelona',
    desc: 'El migcampista guanyador de la Pilota d\'Or ha aterrat a Barcelona amb gran entusiasme per formalitzar el seu traspàs al FC Barcelona. La seva incorporació és considerada el fitxatge estel·lar de la temporada 2026-27.',
    url: 'https://www.elnacional.cat/es/deportes.html',
  },
  {
    id: 'n004',
    date: '2026-08-18',
    dateLabel: '08·18',
    tag: 'Internacional',
    title: 'La DEA celebra a Buenos Aires la 40a Conferència Internacional sobre Drogues',
    desc: 'Buenos Aires acull del 18 al 20 d\'agost la 40a Conferència Internacional per al Control de Drogues, organitzada per la DEA amb participació de cossos policials i fiscalies de tot el món. La crisi de narcotràfic a Amèrica Llatina centrarà el debat.',
    url: 'https://www.swissinfo.ch/spa/temas-del-d%c3%ada-de-internacional-del-martes%2c-18-de-agosto-2026-%2807%3a30-horas%29/91912648',
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
