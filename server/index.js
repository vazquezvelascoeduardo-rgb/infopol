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
    id: 'n010',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Ciència · Tech',
    title: 'IA agentiva i computació quàntica: els avanços que marquen 2026',
    desc: 'Nous sistemes d\'IA autònoms capaços de planificar seqüències d\'accions. Correcció d\'errors quàntics en xips de nova generació. Teràpies CRISPR ja operatives en hospitals europeus.',
    url: 'https://potosinoticias.com/2026/08/29/los-grandes-avances-cientificos-y-tecnologicos-que-marcan-la-pauta-global-en-2026/',
  },
  {
    id: 'n009',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Cultura · Premis',
    title: 'Shakira, Aitana i Karol G brillen als Premios Juventud 2026 a Marbella',
    desc: 'Primera edició europea dels premis, celebrada a Starlite Marbella. Karol G guanya millor àlbum amb "Tropicoqueta". Shakira i Aitana s\'enduen tres guardons cadascuna.',
    url: 'https://es-us.noticias.yahoo.com/ganadores-premios-juventud-2026-shakira-144724047.html',
  },
  {
    id: 'n008',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Esports · LaLiga',
    title: 'Arrenca la LaLiga EA Sports 2026/27 — Getafe-Celta i Elche-R. Sociedad avui',
    desc: 'Jornada de temporada amb doble cartell. El Reial Madrid rep el Rayo Vallecano el 13 de setembre. La temporada de Liga Femenina va del 29 d\'agost al 23 de maig de 2027.',
    url: 'https://www.laliga.com/en-GB/laliga-easports',
  },
  {
    id: 'n007',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Economia · CAT',
    title: 'L\'Estat distribueix 27,3 M€ d\'ajuts als pagesos catalans per fertilitzants',
    desc: 'El Ministeri d\'Agricultura activa la línia d\'ajuts estatals. El sector agrícola català n\'és un dels principals beneficiaris en el marc dels plans de transició ecològica.',
    url: 'https://www.elnacional.cat/es',
  },
  {
    id: 'n006',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Policial · Penal',
    title: 'L\'Audiència de Gipuzkoa redueix condemnes per coaccions a dos agents de policia',
    desc: 'Estimació parcial dels recursos de nou condemnats. Dos absolts totalment; els altres set, reconduïts a temptativa. Resolució amb impacte en la protecció del personal policial.',
    url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/',
  },
  {
    id: 'n005',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Judicial · AN',
    title: 'L\'Audiència Nacional assumeix la investigació de la crisi de Ceuta',
    desc: 'Més de 70.000 persones van entrar per Ceuta el 30 i 31 de juliol. La Fiscalia avala la causa i demana secret parcial. Informes policials apunten a una acció planificada des del Marroc.',
    url: 'https://www.moncloa.com/2026/09/04/audiencia-nacional-crisis-ceuta-3425753',
  },
  {
    id: 'n004',
    date: '2026-09-07',
    dateLabel: '09·07',
    tag: 'Política · CAT',
    title: 'Junts reta el PSC: el concert econòmic és possible si els seus diputats ho defensen',
    desc: 'Escalada en el debat sobre el finançament singular. Junts insisteix que la fórmula del concert, similar al model basc, té majoria parlamentària si el PSC s\'implica a Madrid.',
    url: 'https://www.moncloa.com/2026/09/07/junts-psc-concierto-economico-cataluna-3427326/',
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
