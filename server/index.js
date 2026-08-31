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

const DAILY_NEWS = [
  {
    id: 'dn001',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Política · Cat',
    title: 'Junts bloqueja la financiació: exigeix la sortida de la LOFCA',
    desc: 'Puigdemont condiciona el suport al govern a una reforma que exclogui Catalunya del règim comú de finançament autonòmic.',
    url: 'https://www.que.es/2026/08/31/financiacion-autonomica-junts-bloqueo/',
  },
  {
    id: 'dn002',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Política · Esp',
    title: 'Sánchez eximeix el Marroc i apunta a Rússia en la crisi de Ceuta',
    desc: 'El president va defensar a la SER la gestió migratòria a Ceuta i va negar responsabilitat marroquina en l\'onada d\'entrades il·legals.',
    url: 'https://theobjective.com/espana/2026-08-31/sumario-tarde-tension-ceuta-sanchez-hamlyn-pnv/',
  },
  {
    id: 'dn003',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Internacional',
    title: 'Iran-EUA: primer intercanvi d\'atacs des de juliol al Golf Pèrsic',
    desc: 'Bombardejos dels EUA a l\'illa iraniana de Larak amb víctimes. Teheran respon amb míssils contra Jordània i els Emirats Àrabs Units.',
    url: 'https://www.infobae.com/america/agencias/2026/08/31/temas-del-dia-de-efe-internacional-del-lunes-31-de-agosto-de-2026-12gmt-horas/',
  },
  {
    id: 'dn004',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Internacional',
    title: 'Supertanquero en flames a l\'estret d\'Ormuz per mines iranianes',
    desc: 'La Guàrdia Revolucionària iraniana confirma que el vaixell va ser impactat per dos artefactes al pas clau del comerç petrolier mundial.',
    url: 'https://es.euronews.com/2026/08/31/euronews-hoy-las-noticias-del-lunes-31-de-agosto-de-2026-espana-e-italia-prorrogan-su-cont',
  },
  {
    id: 'dn005',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Tecnologia',
    title: 'Tim Cook deixa Apple: John Ternus assumeix la direcció executiva',
    desc: 'Ternus, enginyer de hardware i arquitecte del xip Apple Silicon, pren el relleu de Cook. Gran event de productes el 9 de setembre.',
    url: 'https://www.infobae.com/america/agencias/2026/08/31/lunes-31-de-agosto-de-2026-0700-gmt/',
  },
  {
    id: 'dn006',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Esports · Cat',
    title: 'Gabriel Jesús fitxa pel FC Barcelona',
    desc: 'L\'atacant brasiler aterra a Barcelona per signar el contracte, la nit en que el Barça rep el Rayo Vallecano al seu estadi.',
    url: 'https://www.cope.es/emisoras/catalunya/podcast/episodios/15-05-h-31-agosto-2026-esports-cope-20260831_3427603.html',
  },
  {
    id: 'dn007',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Esports · Mot',
    title: 'Álex Palou, pentacampió de l\'IndyCar',
    desc: 'El pilot de Mollet del Vallès es corona per cinquena vegada campió de la Fórmula IndyCar nord-americana, referent mundial del motor.',
    url: 'https://www.periodistadigital.com/periodismo/20260831/10-temas-clave-lunes-31-agosto-2026-espana-calor-luz-futbol-ceuta-noticia-689405242294/',
  },
  {
    id: 'dn008',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Esports · Ciclisme',
    title: 'Vuelta a Espanya: 7a etapa amb sortida a Vall d\'Alba',
    desc: 'El pelotó pren la sortida a la localitat castellonenca en una etapa de muntanya que promet canvis importants a la classificació general.',
    url: 'https://www.cope.es/emisoras/comunidad-valenciana/castellon-provincia/castellon/podcast/episodios/15-25h-31-agosto-2026-deportes-cope-castellon-20260831_3427763.html',
  },
  {
    id: 'dn009',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Ciència',
    title: 'La Xina llança la Chang\'e-7 cap al pol sud de la Lluna',
    desc: 'La sonda espacial xinesa busca confirmar l\'existència de gel d\'aigua en zones permanentment ombrejades del pol lunar sud, clau per a futures missions habitades.',
    url: 'https://www.cooperativaciencia.cl/ciencia/2025/12/30/ciencia-en-2026-los-hitos-que-transformaran-la-investigacion-segun-la-revista-nature/',
  },
  {
    id: 'dn010',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Judicial',
    title: 'El TS: el canvi de sexe registral no esborra condemnes per violència de gènere',
    desc: 'El Tribunal Suprem fixa doctrina i estableix que la modificació del sexe al registre civil no té efecte retroactiu sobre condemnes per violència masclista.',
    url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/',
  },
  {
    id: 'dn011',
    date: '2026-08-31',
    dateLabel: '08·31',
    tag: 'Cultura',
    title: '60è Carnaval de Notting Hill: mig milió de persones al carrer a Londres',
    desc: 'El barri londinenc celebra sis dècades del major festival multicultural d\'Europa amb la seva desfilada caribenya, convertida en símbol de diversitat i resistència.',
    url: 'https://www.infobae.com/america/agencias/2026/08/31/lunes-31-de-agosto-de-2026-0700-gmt/',
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

app.get('/api/daily-news', (req, res) => {
  res.json(DAILY_NEWS);
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
