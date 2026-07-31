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
  // ── 31·07·2026 ───────────────────────────────────────────────
  {
    id: 'n011',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Premis',
    title: 'Almirall guanya el Premi Nacional d\'Innovació 2026',
    desc: 'El Ministeri de Ciència distingeix la farmacèutica catalana Almirall com a Gran Empresa Innovadora 2026. Referent mundial en dermatologia present a més de 100 països.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  {
    id: 'n010',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Clima',
    title: 'Comença El Niño: podria ser el més intens en dècades',
    desc: 'L\'OMM confirma l\'inici d\'un episodi El Niño al Pacífic que podria ser dels més potents en dècades. Previsió d\'efectes globals en precipitacions i temperatures.',
    url: 'https://es-us.noticias.yahoo.com/noticias-31-julio-2026-ma%C3%B1ana-050008546.html',
  },
  {
    id: 'n009',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Internacional',
    title: 'Trump anuncia un acord de desarmament de Hamas a Gaza',
    desc: 'EUA i mediadors anuncien un principi d\'acord per al desarmament de Hamas. Persisteix la incertesa mentre continuen els atacs americans a l\'Iran.',
    url: 'https://cnnespanol.cnn.com/2026/07/31/mundo/live-news/guerra-israel-iran-estados-unidos-estrecho-de-ormuz-4-trax',
  },
  {
    id: 'n008',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Judicial',
    title: 'La Fiscalia demana l\'absolució de Begoña Gómez',
    desc: 'El Ministeri Fiscal confirma la petició d\'absolució per a la dona del president Sánchez en el judici en curs. La defensa al·lega manca de proves.',
    url: null,
  },
  {
    id: 'n007',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Crisi Ceuta',
    title: 'Fins a 40.000 persones entren a Ceuta en 48 hores des del Marroc',
    desc: 'Almenys 10 morts per ofegament. L\'Estat declara la fi de l\'emergència nacional. La UE activa el mecanisme de resposta d\'urgència migratòria.',
    url: 'https://www.periodistadigital.com/periodismo/20260731/10-asuntos-agitan-panoramama-politico-mediatico-espanol-31-julio-2026-invasion-ceuta-domina-titulares-noticia-689405234557/',
  },
  {
    id: 'n006',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Economia',
    title: 'L\'Euríbor tanca juliol al 2,964%, en tendència alcista',
    desc: 'L\'índex hipotecari puja lleugerament en la jornada i tanca el mes de juliol amb una mitjana provisional en alça. Afecta les hipoteques variables a revisió.',
    url: 'https://www.democrata.es/economia/euribor-hoy-31-julio-2026-sube-2964-cierra-mes-con-media-provisional-alza/',
  },
  {
    id: 'n005',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Successos BCN',
    title: 'Socavó al Putxet: 93 habitatges desallotjats a Gràcia',
    desc: 'Un enfonsament al barri del Putxet força el desallotjament de 93 habitatges a Barcelona. Junts demana la dimissió dels consellers Paneque i Nadal.',
    url: null,
  },
  {
    id: 'n004',
    date: '2026-07-31',
    dateLabel: '07·31',
    tag: 'Parlament CAT',
    title: 'El Parlament aprova els primers Pressupostos del Govern Illa',
    desc: 'Aprovació dels comptes de la Generalitat per al 2026, els primers del Govern Salvador Illa. El CEO registra l\'ascens d\'Aliança Catalana i la caiguda de Junts.',
    url: 'https://www.elnacional.cat/es',
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
