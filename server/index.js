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
    id: 'n013',
    date: '2026-09-30',
    dateLabel: '09·30',
    tag: 'Economia',
    title: 'L\'IPC de setembre puja al 4,9%, màxim des del 2023',
    desc: 'L\'INE situa la inflació interanual al 4,9% el setembre, sis dècimes més que l\'agost. Els aliments acumulen una pujada del 2,7% en un any i la inflació subjacent supera el 3%.',
    url: 'https://www.que.es/2026/09/29/ipc-septiembre-2026-cesta-compra/',
  },
  {
    id: 'n012',
    date: '2026-09-30',
    dateLabel: '09·30',
    tag: 'Esports',
    title: 'Enric Mas guanya la Vuelta a España 2026, primer espanyol en dotze anys',
    desc: 'El ciclista mallorquí s\'imposa en la classificació general de la Vuelta. Dotze anys sense un triomf espanyol en la cursa, des d\'Alberto Contador el 2014.',
    url: 'https://www.actualidad.es/deportes/2026/09/14/los-triunfos-espanoles-que-marcaron-el-deporte-en-septiembre-de-2026/',
  },
  {
    id: 'n011',
    date: '2026-09-30',
    dateLabel: '09·30',
    tag: 'Policial',
    title: 'Nou segrest exprés a Calella: el 9è cas registrat a Catalunya el 2026',
    desc: 'Els Mossos d\'Esquadra investiguen el novè segrest exprés de l\'any al Maresme. Quatre sospitosos van ficar la víctima al maleter d\'un tot terreny i van fugir.',
    url: 'https://elcaso.elnacional.cat/es/noticias/mossos-investigan-otro-secuestro-expres-ahora-en-calella-cuarto-en-pocos-dias-noveno-este-ano-202_1701421102.html',
  },
  {
    id: 'n010',
    date: '2026-09-29',
    dateLabel: '09·29',
    tag: 'Política',
    title: 'Junqueras condiciona el suport al decret d\'habitatge',
    desc: 'ERC exigeix topalls de preus més amplis i una pròrroga de dos anys als contractes d\'arrendament per donar suport al decret d\'habitatge del Govern central.',
    url: null,
  },
  {
    id: 'n009',
    date: '2026-09-29',
    dateLabel: '09·29',
    tag: 'Internacional',
    title: 'La UE desbloqueja 6.600 M€ d\'ajuda militar per a Ucraïna',
    desc: 'Els estats membres de la Unió Europea arriben a un acord per alliberar el paquet de finançament militar destinat a Ucraïna, pendent d\'aprovació des de l\'estiu.',
    url: null,
  },
  {
    id: 'n008',
    date: '2026-09-29',
    dateLabel: '09·29',
    tag: 'Internacional',
    title: 'Visita d\'Estat de Xi Jinping a Washington: distensió entre EUA i la Xina',
    desc: 'La trobada entre Trump i Xi Jinping acaba amb menys confrontació de l\'esperada, tot i la guerra comercial en curs entre les dues potències.',
    url: null,
  },
  {
    id: 'n007',
    date: '2026-09-26',
    dateLabel: '09·26',
    tag: 'Política',
    title: 'Sumar amenaça d\'abandonar el Consell de Ministres pel decret d\'habitatge',
    desc: 'El soci de govern exigeix l\'aprovació urgent de les mesures de contenció del lloguer i adverteix de conseqüències polítiques si el Govern no actua.',
    url: null,
  },
  {
    id: 'n006',
    date: '2026-09-22',
    dateLabel: '09·22',
    tag: 'Policial',
    title: 'Operació antidroga a Barcelona: 12 detinguts i 61 kg de cocaïna comissats',
    desc: 'La Policia Nacional desmantella una xarxa que feia servir Barcelona com a central logística per distribuir cocaïna a Espanya. 5 armes de foc i 222.880 € en efectiu intervinguts.',
    url: 'https://www.catalunyapress.es/articulo/sucesos/2026-09-22/6023693-golpe-policia-nacional-narcotrafico-barcelona-gran-cantera-cocaina-toda-espana',
  },
  {
    id: 'n005',
    date: '2026-09-22',
    dateLabel: '09·22',
    tag: 'Ciència',
    title: 'Premis Breakthrough 2026: 18,75 milions de dòlars per a teràpies gèniques i física',
    desc: 'La Fundació Breakthrough premia avenços en teràpies gèniques (Luxturna, Casgevy) i mesuraments físics de precisió excepcional. Els Nobel s\'anuncien a l\'octubre.',
    url: 'https://es-us.noticias.yahoo.com/premios-breakthrough-2026-18-75-021354506.html',
  },
  {
    id: 'n004',
    date: '2026-09-18',
    dateLabel: '09·18',
    tag: 'Estadística',
    title: 'La criminalitat baixa un 7,4% a Catalunya però pugen els assassinats i les agressions sexuals',
    desc: 'Les agressions sexuals amb penetració creixen un 9%, amb 108 violacions entre gener i juny. La delinqüència global retrocedeix però augmenta la violència contra les persones.',
    url: 'https://www.catalunyapress.es/articulo/ciencia-e-investigacion/2026-09-18/6019660-criminalidad-baja-74-catalunya-pero-suben-asesinatos-agresiones-sexuales',
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
