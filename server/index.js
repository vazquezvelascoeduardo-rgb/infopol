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
  // ── 2026-10-10 ──────────────────────────────────────────────
  {
    id: 'n010',
    date: '2026-10-10',
    dateLabel: '10·10',
    tag: 'Successos',
    title: 'Barcelona: 11 dels 13 detinguts a la protesta per l\'habitatge, en llibertat',
    desc: 'Onze dels tretze detinguts durant els disturbis posteriors a la manifestació per l\'habitatge a Barcelona han quedat en llibertat. Dos romanen als calabossos pendents de judici ràpid.',
    url: 'https://metropoliabierta.elespanol.com/sucesos/',
  },
  {
    id: 'n011',
    date: '2026-10-10',
    dateLabel: '10·10',
    tag: 'Internacional',
    title: 'Terratrèmol de 7,7 sacseja Panamà i activa alerta de tsunami',
    desc: 'Un sisme de magnitud 7,7 ha sacsejat Panamà i activat una alerta per risc de tsunami a la costa del Pacífic. Les autoritats han evacuat zones costaneres com a mesura de precaució.',
    url: 'https://es.euronews.com/video/2026/10/10/ultimas-noticias-10-octubre-2026-tarde',
  },
  {
    id: 'n012',
    date: '2026-10-10',
    dateLabel: '10·10',
    tag: 'Conflicte',
    title: 'Ucraïna: atac rus destrueix un edifici residencial a Zaporíjia',
    desc: 'Un atac aeri rus ha destruït un edifici residencial a Zaporíjia. Les autoritats ucraïneses han informat de víctimes i danys materials greus al barri afectat.',
    url: 'https://es.euronews.com/video/2026/10/10/ultimas-noticias-10-octubre-2026-tarde',
  },
  {
    id: 'n013',
    date: '2026-10-10',
    dateLabel: '10·10',
    tag: 'Economia',
    title: 'Banc d\'Espanya: PIB 2,6% però inflació puja al 3,9% i l\'ocupació frena',
    desc: 'El Banc d\'Espanya eleva la previsió de creixement del PIB al 2,6% per al 2026, però revisa a l\'alça la inflació fins al 3,9% i rebaixa el ritme de creació d\'ocupació al 2%.',
    url: 'https://que.es/2026/10/10/empleo-ralentiza-banco-espana-previsiones',
  },
  {
    id: 'n014',
    date: '2026-10-10',
    dateLabel: '10·10',
    tag: 'Esports',
    title: 'LaLiga J8: Barça-Getafe, R.Madrid-Villarreal i Alavès-Atlètic',
    desc: 'La jornada 8 de LaLiga porta tres partits destacats: el Barça rep el Getafe al Camp Nou, el Madrid afronta el Villarreal al Bernabéu, i l\'Atlètic visita l\'Alavès a Mendizorroza.',
    url: 'https://www.clarosports.com/futbol/partidos-de-hoy-10-de-octubre-de-2026-y-donde-ver-en-vivo-todo-el-futbol-de-este-sabado/',
  },
  // ── 2026-10-09 ──────────────────────────────────────────────
  {
    id: 'n009',
    date: '2026-10-09',
    dateLabel: '10·09',
    tag: 'Nobel Pau',
    title: 'Navi Pillay, Nobel de la Pau 2026 per defensar el dret internacional',
    desc: 'El Comitè Noruec ha concedit el Nobel de la Pau 2026 a la jurista sud-africana Navanethem "Navi" Pillay pels seus esforços per promoure la pau i el dret internacional humanitari.',
    url: 'https://www.infobae.com/america/mundo/2026/10/09/en-vivo-el-comite-noruego-del-nobel-anuncia-al-ganador-del-premio-nobel-de-la-paz-2026/',
  },
  // ── 2026-10-08 ──────────────────────────────────────────────
  {
    id: 'n008',
    date: '2026-10-08',
    dateLabel: '10·08',
    tag: 'Nobel Lit.',
    title: 'Anne Carson, Nobel de Literatura 2026',
    desc: 'L\'Acadèmia Sueca ha guardonat la poeta canadenca Anne Carson amb el Nobel de Literatura 2026. Reconeguda per la seva obra experimental que fusiona poesia clàssica i contemporània.',
    url: 'https://es.wikipedia.org/wiki/Premio_Nobel_de_Literatura_2026',
  },
  // ── 2026-10-07 ──────────────────────────────────────────────
  {
    id: 'n007',
    date: '2026-10-07',
    dateLabel: '10·07',
    tag: 'Laboral',
    title: 'CCOO i UGT convoquen vaga general per al 11 de novembre',
    desc: 'Els dos principals sindicats espanyols convoquen un paro de 24 hores per al dimecres 11N, dues setmanes i mitja abans de les eleccions generals del 29N. La reivindicació central: crisi de l\'habitatge i millora salarial.',
    url: 'https://es.euronews.com/2026/10/07/huelga-general-vivienda-espana-11-noviembre-ccoo-ugt',
  },
  // ── Normativa anterior ───────────────────────────────────────
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
