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
  // ── 01·08·2026 — Actualització diària ─────────────────────────
  {
    id: 'n010',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Policial · Ceuta',
    title: 'Crisis migratòria a Ceuta: 67 morts i 50.000 entrades des del Marroc',
    desc: 'Uns 50.000 migrants han creuat la frontera marroquina en pocs dies causant 67 morts. La UE convoca una reunió d\'emergència de ministres mentre Itàlia imposa controls fronterers als passatgers procedents d\'Espanya. Es construeix una barrera de boies de 500 m al port.',
    url: 'https://es.euronews.com/video/2026/08/01/ultimas-noticias-01-agosto-2026-mediodia',
  },
  {
    id: 'n011',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Política · Catalunya',
    title: 'Illa exigeix explicacions a Niubó pels resultats PISA a Catalunya',
    desc: 'El president Salvador Illa ha ratificat la confiança en la consellera Niubó tot demanant aclariments sobre la gestió dels resultats de l\'informe PISA. Els Comuns amenacen amb exigir la dimissió si no hi ha canvis a l\'inici de curs.',
    url: 'https://www.elnacional.cat/es',
  },
  {
    id: 'n012',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Clima · Catalunya',
    title: 'Juliol 2026: el mes més calorós mai registrat a Catalunya',
    desc: 'Catalunya ha tancat el mes de juliol amb temperatures rècord absolutes, consolidant-lo com el mes més càlid de la seva història meteorològica. S\'activen alertes per tempestes fortes al Pirineu i a les Terres de l\'Ebre de cara a l\'inici d\'agost.',
    url: 'https://www.elnacional.cat/es',
  },
  {
    id: 'n013',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Esports',
    title: 'Espanya, campiona del Món 2026 davant Argentina (1-0)',
    desc: 'La Roja va guanyar la Copa del Món al MetLife Stadium el 19 de juliol amb un gol de Ferran Torres en la pròrroga. Rodri va ser escollit Millor Jugador del torneig. Celebracions multitudinàries recorren tot el país.',
    url: 'https://cnnespanol.cnn.com/2026/07/19/deportes/live-news/espana-argentina-final-mundial-2026-en-vivo-resultado-goles-orix',
  },
  {
    id: 'n014',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Internacional',
    title: 'Acord històric a Gaza: Hamàs accepta el desarmament',
    desc: 'Trump anuncia un pacte on Hamàs accepta el desarmament complet a canvi de la retirada israeliana de Gaza. La comunitat internacional el qualifica de «fita diplomàtica sense precedents» tot i que grups crítics adverteixen de la seva fragilitat.',
    url: 'https://www.infobae.com/america/agencias/2026/08/01/sabado-1-de-agosto-de-2026-0200-gmt/',
  },
  {
    id: 'n015',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Internacional · Seguretat',
    title: 'Hamburg reforça el dispositiu policial al CSD per l\'atac de Berlín',
    desc: 'Un mes després de l\'atemptat letal al desfilament de l\'Orgull LGBT de Berlín (25 de juliol), Hamburg ha celebrat el seu Christopher Street Day amb un desplegament de seguretat sense precedents. Vigílies de solidaritat es multipliquen per tota Europa.',
    url: 'https://es.euronews.com/video/2026/08/01/ultimas-noticias-01-agosto-2026-mediodia',
  },
  {
    id: 'n016',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Internacional',
    title: 'Terratrèmol de 7,1 a Kumamoto (Japó): 35 morts i desenes de desapareguts',
    desc: 'Un sisme de magnitud 7,1 ha sacsejat la prefectura de Kumamoto al Japó, causant almenys 35 morts i desenes de desapareguts. Els equips de rescat treballen per localitzar víctimes entre les runes i s\'han activat alertes de tsunami.',
    url: 'https://www.infobae.com/america/agencias/2026/08/01/sabado-1-de-agosto-de-2026-0200-gmt/',
  },
  {
    id: 'n017',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Cultura',
    title: 'Rosalía enceta la gira LUX Tour 2026 amb quatre concerts a Buenos Aires',
    desc: 'La cantant catalana inicia la seva gira mundial LUX Tour 2026 al Movistar Arena de Buenos Aires, primera parada d\'una tournée que recorrerà Amèrica Llatina abans d\'arribar a Europa a la tardor.',
    url: 'https://lapatilla.com/2026/07/31/portadas-de-la-prensa-internacional-de-este-sabado-1-de-agosto-de-2026/',
  },
  {
    id: 'n018',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Patrimoni',
    title: 'Descoberta a Mèrida una làpida sepulcral intacta del 519 dC',
    desc: 'Arqueòlegs han localitzat en una residència particular de Mèrida una làpida funerària d\'un infant datada el 519 dC en perfecte estat de conservació. La peça és considerada única a tota la Hispania tardoromana i passarà al Museu Nacional d\'Art Romà.',
    url: 'https://www.infobae.com/america/agencias/2026/07/31/sabado-1-domingo-2-y-lunes-3-de-agosto-de-2026-1930-gmt/',
  },
  {
    id: 'n019',
    date: '2026-08-01',
    dateLabel: '08·01',
    tag: 'Premis · Espanya',
    title: 'Ministeri de Ciència atorga els Premis Nacionals d\'Innovació i Disseny 2026',
    desc: 'La ministra Morant ha presentat els guanyadors dels Premis Nacionals d\'Innovació i de Disseny 2026, reconeixent iniciatives destacades en transferència tecnològica, model de negoci i disseny industrial a l\'Estat.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  // ── Arxiu normatiu ────────────────────────────────────────────
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
