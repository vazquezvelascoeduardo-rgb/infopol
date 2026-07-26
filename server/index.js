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
  // ── 26 juliol 2026 ──────────────────────────────────────────
  {
    id: 'n013',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Política',
    title: 'PP paralitza el Tractat d\'Amistat amb França',
    desc: 'El Senat, a instàncies del PP, remet el Tractat d\'Amistat amb França al Tribunal Constitucional. Obre un nou front en les relacions exteriors del Govern.',
    url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/',
  },
  {
    id: 'n012',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Internacional',
    title: 'Tifó Noul — s\'apropa a la costa sud-oriental de la Xina',
    desc: 'El tifó Noul avança entre Cantó i Fujian. Les autoritats xineses activen protocols d\'emergència a les zones costaneres afectades.',
    url: 'https://www.infobae.com/america/agencias/2026/07/26/domingo-26-de-julio-de-2026-0200-gmt/',
  },
  {
    id: 'n011',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Internacional',
    title: 'Illa a Vietnam — gira asiàtica per internacionalitzar Catalunya',
    desc: 'El president de la Generalitat visita la ciutat portuària de Da Nang per reforçar les relacions comercials i promoure l\'economia catalana al sud-est asiàtic.',
    url: 'https://es.euronews.com/video/2026/07/26/ultimas-noticias-26-julio-2026-manana',
  },
  {
    id: 'n010',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Economia',
    title: 'Decret llei de lloguers — pròrrogues i regulació del lloguer de temporada',
    desc: 'El Govern prepara mesures per contenir l\'escalada de rendes: pròrrogues fins al juny de 2028, regulació del lloguer de temporada i beneficis fiscals per als propietaris.',
    url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/',
  },
  {
    id: 'n009',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Internacional',
    title: 'Trump i l\'OTAN — Espanya "redimida" pel compromís en defensa',
    desc: 'Donald Trump afirma que Espanya s\'ha "redimit per complet" del seu compromís en defensa de l\'OTAN. El Govern nega qualsevol pagament addicional.',
    url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/',
  },
  {
    id: 'n008',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Premis',
    title: 'Premis Nacionals d\'Innovació 2026 — Almirall, gran empresa guanyadora',
    desc: 'El Ministeri de Ciència atorga el Premi Nacional d\'Innovació a Almirall, farmacèutica barcelonina i referent mundial en dermatologia.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  {
    id: 'n007',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Clima',
    title: 'Nova onada de calor — temperatures superiors a 40°C',
    desc: 'Juny de 2026, el mes més calurós registrat a l\'Europa Occidental, segons Copernicus. Temperatures superiors a 40°C amenacen àmplies zones d\'Espanya.',
    url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/',
  },
  {
    id: 'n006',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Judicial',
    title: 'Cas Begoña Gómez — Fiscalia reitera la petició d\'absolució',
    desc: 'El Ministeri Públic descarta delicte de corrupció o tràfic d\'influències. La sol·licitud afecta la cònjuge del president, la seva assessora i l\'empresari Barrabés.',
    url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/',
  },
  {
    id: 'n005',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Policia',
    title: 'Fugitiu reclamat per França — detingut en hotel de Barcelona',
    desc: 'El Grup de Fugitius de la Brigada Provincial deté el presumpte autor d\'un assassinat a trets a Toló. Passa a presó provisional a l\'espera d\'extradició accelerada.',
    url: 'https://www.moncloa.com/2026/07/25/detenido-fugitivo-asesinato-barcelona-3405245/',
  },
  {
    id: 'n004',
    date: '2026-07-26',
    dateLabel: '07·26',
    tag: 'Successos',
    title: 'Incendi Los Gallardos — dotze morts a Almeria',
    desc: 'Incendi forestal amb almenys 12 víctimes mortals. S\'investiga la caiguda d\'un cable elèctric com a causa. Obre debat sobre la responsabilitat de les infraestructures.',
    url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/',
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
