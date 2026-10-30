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
  // ── 30 octubre 2026 ──────────────────────────────────────────────
  {
    id: 'n010',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Policial · Catalunya',
    cat: 'policial',
    title: 'Assassinat a l\'Hospital Joan XXIII de Tarragona',
    desc: 'Un home armat va entrar al centre durant la matinada i va matar a trets un pacient en la seva habitació. Els Mossos investiguen vincles amb el crim organitzat i un tiroteig previ de mitjan octubre. Els sindicats reclamen presència policial als centres sanitaris.',
    url: 'https://www.cope.es/emisoras/catalunya/tarragona-provincia/tarragona/noticias/asesinato-hospital-joan-xxiii-tarragona-destapa-creciente-inseguridad-sindicatos-exigen-policia-centros-20261030_3466199.html',
  },
  {
    id: 'n011',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Economia · Espanya',
    cat: 'economia',
    title: 'La Cambra d\'Espanya preveu creixement del 2,5% i inflació del 3,2%',
    desc: 'La Cambra de Comerç d\'Espanya eleva la previsió de creixement al 2,5% per al 2026 i adverteix que la inflació podria mantenir-se prop del 4% els propers mesos. El PIB del tercer trimestre es publica avui.',
    url: 'https://www.infobae.com/espana/agencias/2026/10/30/la-camara-de-espana-preve-un-crecimiento-del-25-para-2026-y-una-inflacion-del-32/',
  },
  {
    id: 'n012',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Internacional',
    cat: 'internacional',
    title: 'EEUU i Japó acorden producció conjunta de míssils per als F-35',
    desc: 'Hegseth i Koizumi han signat l\'acord a Cebú per reforçar la defensa al Pacífic. L\'aliança preveu la producció conjunta de míssils de llarg abast per als caces de cinquena generació.',
    url: 'https://www.infobae.com/america/mundo/',
  },
  {
    id: 'n013',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Internacional · Salut',
    cat: 'internacional',
    title: 'Indonèsia: 300.000 afectats per infecció respiratòria als incendis de Borneo',
    desc: 'El fum dels incendis forestals ha causat una crisi sanitària amb més de 300.000 casos d\'infecció respiratòria. Les autoritats han declarat l\'emergència a diverses províncies de Kalimantan.',
    url: 'https://www.infobae.com/america/mundo/',
  },
  // ── 29 octubre 2026 ──────────────────────────────────────────────
  {
    id: 'n009',
    date: '2026-10-29',
    dateLabel: '10·29',
    tag: 'Policial · Catalunya',
    cat: 'policial',
    title: 'Disturbis Blocus a Barcelona: 133 detinguts, 85 menors',
    desc: 'Els Mossos anticipen nous aldarulls el 31 d\'octubre. La darrera onada va deixar 133 detinguts —85 d\'ells menors— i 23 comerços danyats. Al novembre s\'activarà el Pla Proa contra bandes juvenils violentes.',
    url: 'https://www.moncloa.com/2026/10/29/disturbios-blocus-barcelona-31-octubre-3457427/',
  },
  // ── 28 octubre 2026 ──────────────────────────────────────────────
  {
    id: 'n008',
    date: '2026-10-28',
    dateLabel: '10·28',
    tag: 'Succés · Espanya',
    cat: 'successos',
    title: 'Xoc de trens a Urda (Toledo): 69 morts i desenes de ferits',
    desc: 'Col·lisió frontal entre un AVE de Renfe i un Iryo. 69 morts confirmats, més de 50 ferits i 15 en UCI. L\'alta velocitat Madrid–Andalusia va quedar suspesa. La investigació dels cossos policials cerca les causes de l\'accident.',
    url: 'https://www.cope.es/programas/herrera-en-cope/al-minuto/ultima-hora-accidente-ferroviario-urda-toledo-decenas-victimas-heridos-investigacion-marcha-20261029_3464690.html',
  },
  {
    id: 'n007',
    date: '2026-10-28',
    dateLabel: '10·28',
    tag: 'Ciència · Espanya',
    cat: 'cultura',
    title: 'Premis Nacionals de Recerca 2026 a Vitòria-Gasteiz',
    desc: 'El Rei Felip VI va lliurar 20 guardons de 30.000 euros. El Premi Santiago Ramón y Cajal de Biologia va recaure en Crisanto Gutiérrez Armenta. Primera vegada que la cerimònia se celebra al País Basc.',
    url: 'https://www.moncloa.com/2026/10/28/premios-nacionales-investigacion-vitoria-3456767',
  },
  // ── 27 octubre 2026 ──────────────────────────────────────────────
  {
    id: 'n006',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Economia · Catalunya',
    cat: 'economia',
    title: 'Catalunya creixerà un 2,6% el 2026 impulsada pel turisme',
    desc: 'La Generalitat eleva la previsió tres dècimes respecte a la primavera. El turisme compensa l\'estancament de les exportacions. La inflació s\'estima en el 3,7%, per sobre de l\'objectiu del BCE.',
    url: 'https://www.cronicaglobal.cat/negocis/20261027/catalunya-creix-ritme-turisme-exportacions-sestanquen/1003742806608_0.html',
  },
  // ── 25 octubre 2026 ──────────────────────────────────────────────
  {
    id: 'n005',
    date: '2026-10-25',
    dateLabel: '10·25',
    tag: 'Esports · LaLiga',
    cat: 'esports',
    title: 'Barça 1-2 Reial Madrid: el Clàssic trenca l\'imbatibilitat blaugrana',
    desc: 'Mbappé va marcar dos gols al Camp Nou. El Reial Madrid s\'apodera del liderat provisional de LaLiga. El Madrid tanca octubre amb cinc victòries consecutives entre lliga i Champions League.',
    url: 'https://www.clarosports.com/futbol/laliga/barcelona-vs-real-madrid-en-vivo-laliga-2026-resultado-y-goles-de-la-jornada-10/',
  },
  // ── 23 octubre 2026 ──────────────────────────────────────────────
  {
    id: 'n004',
    date: '2026-10-23',
    dateLabel: '10·23',
    tag: 'Premis · Cultura',
    cat: 'cultura',
    title: 'Premis Princesa d\'Astúries 2026: Premi de Recerca per la seqüenciació de l\'ADN',
    desc: 'Klenerman, Balasubramanian i Mayer han rebut el premi pel seu treball pioner en seqüenciació del genoma. Christina Koch ha obtingut el Premi de la Concòrdia. Cerimònia a Oviedo presidida pels reis.',
    url: 'https://www.vozpopuli.com/altavoz/cultura/estos-son-todos-los-ganadores-de-los-premios-princesa-de-asturias-2026.html',
  },
  // ── Normativa policial (arxiu permanent) ─────────────────────────
  {
    id: 'n001',
    date: '2026-04-18',
    dateLabel: '04·18',
    tag: 'LO 1/2026',
    cat: 'policial',
    title: 'Multireincidència — enduriment de furts i estafes lleus',
    desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril de 2026. Afecta l\'art. 22.8 CP i els arts. 468-470 LECrim.',
    url: null,
  },
  {
    id: 'n002',
    date: '2026-04-14',
    dateLabel: '04·14',
    tag: 'RD 316/2026',
    cat: 'policial',
    title: 'Reforma del Reglament d\'Estrangeria',
    desc: 'Dues figures noves d\'arrelament social. Termini de regularització fins al 30 de juny de 2026.',
    url: null,
  },
  {
    id: 'n003',
    date: '2026-03-28',
    dateLabel: '03·28',
    tag: 'Circ. 2/2026',
    cat: 'policial',
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
