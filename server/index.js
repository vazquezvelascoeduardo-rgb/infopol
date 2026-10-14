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
    id: 'n012',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Política · CAT',
    title: 'El PSC guanyaria les catalanes amb 33-35 escons, segons el CEO',
    desc: 'El Centre d\'Estudis d\'Opinió de la Generalitat situa ERC (24-26) i Aliança Catalana (23-25) en segon i tercer lloc. Junts quedaria quart amb 18-20 escons.',
    url: 'https://infobae.com/espana/agencias/2026/10/14/el-psc-ganaria-las-catalanas-33-35-seguido-de-erc-24-26-y-ac-23-25-segun-el-cis-catalan',
  },
  {
    id: 'n011',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Política · ESP',
    title: 'El PSOE col·loca ministres a les llistes per a les eleccions del 29N',
    desc: 'Margarita Robles figura com a número dos de la llista del PSOE per Madrid. El Suprem rebutja el·liminir nul·litat al cas Koldo i obre la porta al TC.',
    url: 'https://infobae.com/espana/agencias/2026/10/14/temas-del-dia-de-efe-espana-del-miercoles-14-de-octubre-de-2026-1330-horas',
  },
  {
    id: 'n010',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Judicial · CAT',
    title: 'El Tribunal de Comptes aplica l\'amnistia i absol Puigdemont i 34 encausats',
    desc: 'L\'òrgan fiscalitzador ha arxivat les diligències per malversació vinculades al Procés. Puigdemont insta el Suprem a aplicar la llei «sense més demora».',
    url: 'https://www.elplural.com/autonomias/cataluna/puigdemont-insta-supremo-aplique-amnistia-sin-mas-demora-ratificar-normalizacion-cataluna_801408102',
  },
  {
    id: 'n009',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Economia',
    title: 'La inflació s\'enfila al 4,9% per la disparada dels combustibles',
    desc: 'Els carburants han pujat quasi un 28% al setembre i actuen de principal motor de l\'IPC. El lloguer marca màxims amb una actualització del 2,54%.',
    url: 'https://infobae.com/espana/agencias/2026/10/14/temas-del-dia-de-efe-espana-del-miercoles-14-de-octubre-de-2026-1330-horas',
  },
  {
    id: 'n008',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Borsa',
    title: 'L\'IBEX 35 tanca en positiu a 19.230 punts (+0,10%)',
    desc: 'La borsa espanyola registra una lleugera pujada al tancament del dimecres. Els inversors segueixen de prop l\'evolució dels preus energètics i el context electoral.',
    url: 'https://www.elperiodicodeceuta.es/cierre-ibex-35-bolsa-espana-hoy-miercoles-14-de-octubre-de-2026/',
  },
  {
    id: 'n007',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Esports · FCB',
    title: 'El Barça arriba als 10 victories seguides i brilla a Champions davant el Galatasaray',
    desc: 'Lamine Yamal va ser el gran protagonista en una nova victòria europea dels blaugranes. L\'equip de Flick consolida el lideratge a LaLiga i la fase de grups de la Champions.',
    url: 'https://metropoliabierta.elespanol.com/vivir-en-barcelona/20261014/debes-saber-hoy-octubre-barcelona/1003742802324_0.html',
  },
  {
    id: 'n006',
    date: '2026-10-14',
    dateLabel: '10·14',
    tag: 'Mossos',
    title: 'Investigació interna als Mossos per una consigna política durant un curs policial',
    desc: 'Un agent hauria pronunciat una consigna contra el president del Govern davant més de 200 policies i comandaments durant la clausura d\'un curs. El cos ha obert un expedient.',
    url: 'https://elmon.cat/es/sucesos/',
  },
  {
    id: 'n005',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Nobel 2026',
    title: 'Nobel de Medicina per la recerca en optogenètica i canals iònics activats per llum',
    desc: 'Karl Deisseroth, Peter Hegemann i Georg Nagel premiats per descobrir proteïnes algals que obren canals elèctrics en neurones en ser il·luminades. Obre la porta a nous tractaments neurològics.',
    url: 'https://www.eluniversal.com.mx/ciencia-y-salud/arrancan-los-premios-nobel-2026-el-de-medicina-va-a-investigacion-de-los-canales-ionicos-activados-por-luz-y-la-optogenetica/',
  },
  {
    id: 'n004',
    date: '2026-10-06',
    dateLabel: '10·06',
    tag: 'Nobel 2026',
    title: 'Nobel de Física a Halzen per desvelar els secrets dels neutrins amb IceCube',
    desc: 'El físic belga Francis Halzen ha estat distingit pel seu treball amb l\'Observatori de Neutrins IceCube al Pol Sud. La detecció de neutrins còsmics obre una nova finestra per a l\'astronomia.',
    url: 'https://www.elfinanciero.com.mx/ciencia/2026/10/06/nobel-de-fisica-2026-premian-a-cientifico-por-hallar-neutrinos-capaces-de-revelar-secretos-del-universo/',
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
