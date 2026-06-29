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
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Política',
    title: 'El PSC demana al PP retirar els 15 recursos contra la llei d\'amnistia',
    desc: 'La portaveu del PSC, Lluïsa Moret, ha reptat el PP a demostrar que vol passar pàgina del procés del 2017. El PP manté quinze recursos davant el TC contra la llei d\'amnistia.',
    url: 'https://www.elespanol.com/espana/politica/20260629/ultima-hora-politica-directo-juez-interroga-caso-leire-carmen-pano-empresaria-llevo-euros-ferraz/1003744303126_10.html',
  },
  {
    id: 'n005',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Judicial',
    title: 'El jutge interroga al Cas Leire l\'empresària que va portar diners a Ferraz',
    desc: 'La comissió d\'investigació de la SEPI al Senat rep l\'excomissari Jesús María Gómez. El cas avança en l\'esclariment del presumpte finançament irregular del PSOE.',
    url: 'https://www.elespanol.com/espana/politica/20260629/ultima-hora-politica-directo-juez-interroga-caso-leire-carmen-pano-empresaria-llevo-euros-ferraz/1003744303126_10.html',
  },
  {
    id: 'n006',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Política',
    title: 'El PP registra al Congrés un paquet de mesures fiscals de 3.200 milions',
    desc: 'El Partit Popular ha registrat una proposició no de llei amb mesures fiscals valorades en 3.200 milions d\'euros, com a proposta alternativa al marc pressupostari del 2027.',
    url: 'https://theobjective.com/actualidad/2026-06-29/29-de-junio-de-2026-lo-que-tienes-que-saber-de-espana/',
  },
  {
    id: 'n007',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Economia',
    title: 'El Govern millora en quatre dècimes la previsió de creixement econòmic del 2026',
    desc: 'El ministre Carlos Cuerpo ha presentat l\'actualització macroeconòmica que servirà de base als pressupostos del 2027, incorporant els efectes del conflicte armat a l\'Iran.',
    url: 'https://www.infobae.com/espana/agencias/2026/06/28/temas-del-dia-de-efe-espana-del-lunes-29-de-junio-de-2026/',
  },
  {
    id: 'n008',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Economia',
    title: 'La inflació de juny es manté al 3,2% per tercer mes consecutiu',
    desc: 'L\'avanç de l\'IPC de juny confirma l\'estabilitat al 3,2%. La rebaixa fiscal sobre carburants s\'anirà reduint a partir de juliol fins a desaparèixer a l\'octubre.',
    url: 'https://www.infobae.com/espana/agencias/2026/06/28/temas-del-dia-de-efe-espana-del-lunes-29-de-junio-de-2026/',
  },
  {
    id: 'n009',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Internacional',
    title: 'Iran i els EUA obren sis dies de negociació per acabar el conflicte',
    desc: 'El cap de la diplomàcia iraniana destaca "progressos majors" gràcies a la mediació de Pakistan i Qatar. Les negociacions busquen un alto el foc i posar fi a l\'ofensiva a la zona.',
    url: 'https://cnnespanol.cnn.com/mundo',
  },
  {
    id: 'n010',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Internacional',
    title: 'Onada de calor a Europa: París activa alertes per temperatures extremes',
    desc: 'França viu una de les onades de calor més intenses de l\'estiu. Les autoritats de París han activat protocols d\'emergència i recomanen evitar l\'exposició solar durant les hores centrals.',
    url: 'https://cnnespanol.cnn.com/mundo',
  },
  {
    id: 'n011',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Esports',
    title: 'Mundial 2026: Brasil - Japó i Alemanya - Paraguai, partits de la jornada',
    desc: 'La fase de grups del Mundial 2026 continua avui als grups G i H. Espanya té programat el seu pròxim partit contra Àustria el 2 de juliol.',
    url: 'https://www.flashscore.es/futbol/mundial/campeonato-del-mundo/',
  },
  {
    id: 'n012',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Successos',
    title: 'Desarticulada una xarxa amb 12 plantacions de marihuana indoor a Tarragona',
    desc: 'Més de 350 agents de la Policia Nacional i els Mossos d\'Esquadra han desmantellat dotze plantacions en quinze entrades i registres a l\'entorn de Cabra del Camp.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-06-24/5931236-desmontada-red-12-plantaciones-marihuana-indoor-tarragona',
  },
  {
    id: 'n013',
    date: '2026-06-29',
    dateLabel: '06·29',
    tag: 'Ciència',
    title: 'La COSCE atorga els Premis de Difusió de la Ciència 2026 en dues categories',
    desc: 'La Confederació de Societats Científiques d\'Espanya estrena les categories sènior (5.000 €) i jove (3.000 €) en la 19a edició dels seus premis anuals de divulgació científica.',
    url: 'https://cosce.org/cosce-convoca-los-premios-a-la-difusion-de-la-ciencia-2026-por-primera-vez-en-dos-categorias/',
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
