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
  // ── 21 juliol 2026 ────────────────────────────────────────────
  {
    id: 'n004',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Esports',
    title: 'Espanya, campiona del Món 2026',
    desc: 'La Roja s\'imposa a Argentina (1-0) a la final disputada el 19 de juliol. Quart títol mundial per a la selecció espanyola.',
    url: 'https://espndeportes.espn.com/futbol/mundial/nota/_/id/16038946/mundial-2026-grupos-calendario-fixture-copa-del-mundo',
  },
  {
    id: 'n005',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Catalunya · Economia',
    title: 'La fuga d\'empreses a Catalunya supera la xifra de tot el 2025',
    desc: 'En el primer semestre el saldo net és negatiu en 257 societats, molt per sobre de les 158 que es van perdre durant tot el 2025.',
    url: 'https://www.moncloa.com/2026/07/18/fuga-empresas-cataluna-2026-supera-2025-3402011/',
  },
  {
    id: 'n006',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Catalunya · Política',
    title: 'El Parlament aprova els primers Pressupostos del Govern Illa per al 2026',
    desc: 'Les primeres comptes que aconsegueix tirar endavant el Govern presidit per Salvador Illa superen el ple del Parlament.',
    url: null,
  },
  {
    id: 'n007',
    date: '2026-07-19',
    dateLabel: '07·19',
    tag: 'Successos · Mossos',
    title: 'Operatiu per capturar un home acusat d\'incendiar el domicili de l\'exparella',
    desc: 'Els Mossos d\'Esquadra busquen el sospitós de calar foc a l\'habitatge on vivien la seva exparella i el fill menor d\'edat.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-07-19/5958337-operativo-policial-catalunya-buscan-hombre-incendiar-casa-expareja-hijo',
  },
  {
    id: 'n008',
    date: '2026-07-16',
    dateLabel: '07·16',
    tag: 'Successos · Mossos',
    title: 'Mossos obren foc contra un cotxe que embistia agents a l\'Hospitalet',
    desc: 'Un home amb ordre d\'allunyament va intentar fugir envestint vehicles policials. Un tret li va perforar un pneumàtic i va ser detingut.',
    url: 'https://metropoliabierta.elespanol.com/gran-barcelona/20260716/mossos-abren-fuego-coche-intentaba-huir-lhospitalet-embestir-vehiculos-policiales/1003742780188_0.html',
  },
  {
    id: 'n009',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Espanya · Política',
    title: 'El Consell de Ministres torna a aprovar la senda de dèficit 2027-2029',
    desc: 'Segon intent del Govern Sánchez després que el Congrés rebutgés la primera proposta de senda de dèficit per al trienni.',
    url: 'https://www.infobae.com/espana/agencias/2026/07/20/temas-del-dia-de-efe-espana-del-martes-21-de-julio-de-2026/',
  },
  {
    id: 'n010',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Espanya · Economia',
    title: 'Amazon obre un centre de distribució a Saragossa amb 100 M€ d\'inversió',
    desc: 'Les noves instal·lacions superen els 30.000 m² i generen centenars de nous llocs de treball a la capital aragonesa.',
    url: 'https://www.pressdigital.es/articulo/economia/2026-07-20/5958698-principales-titulares-periodicos-lunes-21-julio',
  },
  {
    id: 'n011',
    date: '2026-07-19',
    dateLabel: '07·19',
    tag: 'Ciència',
    title: 'Espanya bat el rècord de projectes científics d\'alt nivell finançats per la UE',
    desc: 'El Consell Europeu d\'Investigació (ERC) finança un nombre rècord de projectes espanyols d\'excel·lència científica en convocatòries europees.',
    url: 'https://www.que.es/2026/07/19/espana-consejo-europeo-investigacion-pildora/',
  },
  {
    id: 'n012',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Premis',
    title: 'Almirall, Premi Nacional d\'Innovació 2026 com a Gran Empresa Innovadora',
    desc: 'El Ministeri de Ciència distingeix la farmacèutica catalana, referent mundial en dermatologia mèdica amb presència en més de 100 països.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  {
    id: 'n013',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Internacional',
    title: 'Andy Burnham completa el seu primer govern com a primer ministre britànic',
    desc: 'El nou inquilí de Downing Street tanca la composició del seu executiu per encarar les expectatives generades per la seva victòria electoral.',
    url: 'https://www.infobae.com/america/agencias/2026/07/21/martes-21-de-julio-de-2026-0700-gmt/',
  },
  {
    id: 'n014',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Internacional · ONU',
    title: 'L\'ONU publica el SOFI 2026: la gana global segueix sent un repte crític',
    desc: 'La FAO i quatre agències de l\'ONU presenten a Roma l\'informe anual sobre seguretat alimentària i nutrició, analitzant tendències i escenaris futurs.',
    url: 'https://www.infobae.com/america/agencias/2026/07/21/martes-21-de-julio-de-2026-0700-gmt/',
  },
  {
    id: 'n015',
    date: '2026-07-21',
    dateLabel: '07·21',
    tag: 'Internacional',
    title: 'EUA envia 100 milions de dòlars d\'ajuda humanitària a Cuba',
    desc: 'El primer enviament inclou aliments i productes d\'higiene per pal·liar l\'escassetat creixent d\'aliments, medicines i combustible a l\'illa.',
    url: 'https://www.infobae.com/america/agencias/2026/07/21/martes-21-de-julio-de-2026-0700-gmt/',
  },
  // ── Actualitat normativa ────────────────────────────────────────
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
