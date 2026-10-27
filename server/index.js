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
  // ── 27 octubre 2026 ───────────────────────────────────────────
  {
    id: 'n013',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Internacional',
    title: 'Etiòpia bombardeja posicions d\'Eritrea al Tigray — alerta de nova guerra',
    desc: 'Atacs amb drons etíops contra posicions militars eritrees augmenten la tensió a la Banya d\'Àfrica. Risc d\'escalada bèl·lica a la regió.',
    url: null,
  },
  {
    id: 'n012',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Internacional',
    title: 'Houties ataquen instal·lacions petrolíferes saudites i l\'aeroport de Riad',
    desc: 'Nova escalada al Iemen que amenaça rutes estratègiques del comerç energètic mundial. La coalició saudita llança nous atacs en resposta.',
    url: null,
  },
  {
    id: 'n011',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Ucraïna',
    title: 'Alt el foc localitzat a Oleshky entre Moscou i Kíev — vigència des del 27-10',
    desc: 'Acord per un cessament d\'hostilitats temporal a la ciutat d\'Oleshky, ocupada per forces russes. Efectivitat pendent de confirmació sobre el terreny.',
    url: null,
  },
  {
    id: 'n010',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Meteo Cat.',
    title: 'AEMET analitza les pluges torrencials del 3–4 d\'octubre a Catalunya',
    desc: 'Més de 200 l/m² en diverses localitats de la demarcació de Barcelona. Episodi de tempestes d\'alta intensitat amb afectació a infraestructures.',
    url: 'https://aemetblog.es/2026/10/21/analisis-del-episodio-de-lluvias-torrenciales-en-cataluna-del-3-y-4-de-octubre-de-2026/',
  },
  {
    id: 'n009',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Ballon d\'Or',
    title: 'Alexia Putellas, tercer Balló d\'Or — Unai Simón, millor porter',
    desc: 'Gala del 26 d\'octubre a Londres. Luis de la Fuente, millor entrenador. Lamine Yamal guanya el seu tercer premi Kopa.',
    url: 'https://depor.com/futbol-internacional/quien-gano-el-balon-de-oro-2026-en-vivo-hoy-con-harry-kane-mbappe-lionel-messi-y-yamal-resultados-en-directo-online-futbol-libre-video-nnda-nnrt-noticia',
  },
  {
    id: 'n008',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Nobel Química',
    title: 'Nobel de Química per l\'autocatàlisi asimètrica — Kagan i Soai',
    desc: 'Premis per descobrir efectes no lineals en síntesi orgànica asimètrica, que expliquen per què la vida usa una sola "mà" molecular.',
    url: 'https://impactotic.co/ciencia/premios-nobel-2026-de-ciencia-ganadores/',
  },
  {
    id: 'n007',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Nobel Física',
    title: 'Nobel de Física per al detector de neutrins IceCube — Francis Halzen',
    desc: 'Reconeixement al científic de la Univ. de Wisconsin per descobrir neutrins d\'alta energia d\'origen astrofísic amb el detector antàrtic IceCube.',
    url: 'https://impactotic.co/ciencia/premios-nobel-2026-de-ciencia-ganadores/',
  },
  {
    id: 'n006',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Nobel Medicina',
    title: 'Nobel de Medicina per l\'optogenètica — Deisseroth, Hegemann i Nagel',
    desc: 'Premis als descobridors de les canalrodopsines: proteïnes d\'una alga que obren una \'porta\' cel·lular activada per la llum. Clau en neurociència.',
    url: 'https://www.eluniversal.com.mx/ciencia-y-salud/arrancan-los-premios-nobel-2026-el-de-medicina-va-a-investigacion-de-los-canales-ionicos-activados-por-luz-y-la-optogenetica/',
  },
  {
    id: 'n005',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Política',
    title: 'Govern espanyol aprova dos decrets d\'habitatge — PP critica la tramitació d\'urgència',
    desc: 'Sumar se n\'atribueix l\'impuls. El TS ja havia tombat un decret d\'universitats per manca de consulta prèvia. Debat sobre model energètic al Congrés.',
    url: 'https://www.infobae.com/espana/agencias/2026/10/26/temas-del-dia-de-efe-espana-del-martes-27-de-octubre-de-2026/',
  },
  {
    id: 'n004',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Econ. Cat.',
    title: 'Generalitat eleva al 2,6% la previsió de creixement de Catalunya per al 2026',
    desc: 'Nou escenari macroeconòmic d\'octubre. El consum frena i la inversió és el component més afectat per la inestabilitat geopolítica internacional.',
    url: 'https://govern.cat/gov/notes-premsa/881968/la-generalitat-preveu-que-l-economia-catalana-creixi-un-26-percent-el-2026-malgrat-la-crisi-energetica',
  },
  // ── Anteriors ────────────────────────────────────────────────
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
