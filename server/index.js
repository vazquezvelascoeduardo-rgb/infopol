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
  // ── 25 novembre 2026 ──────────────────────────────────────────
  {
    id: 'n011',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Política · Catalunya',
    title: 'Puigdemont: "Vaig aprofitar l\'ambició de Sánchez per derrotar Espanya"',
    desc: 'El líder de Junts afirma en una entrevista que va explotar la dependència del PSOE per aconseguir l\'aprovació de la Llei d\'Amnistia. El Govern català rebutja que se\'n presenti com una derrota d\'Espanya en plena campanya del 29-N.',
    url: 'https://www.democrata.es/politica/puigdemont-asegura-aprovecho-ambicion-sanchez-derrotar-espana-con-amnistia/',
  },
  {
    id: 'n010',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Política · Espanya',
    title: 'Campanya 29-N: Feijóo i Ayuso, gran acte a Madrid; Colau demana el vot útil d\'esquerres',
    desc: 'A quatre dies de les eleccions generals, el PP celebra un gran míting a Madrid amb Feijóo i Ayuso a les 19:30 h. Ada Colau (Frente Amplio) apel·la al vot per frenar un govern PP-Vox. Pedro Sánchez anuncia 30.000 M€ en mesures socials en l\'últim Consell de Ministres pre-electoral.',
    url: 'https://okdiario.com/espana/ultima-hora-directo-actualidad-politica-espana-elecciones-generales-del-29-n-campana-electoral-hoy-vivo-8-21264308',
  },
  {
    id: 'n009',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Economia',
    title: 'La UE avisa Espanya per la despesa pública i Garamendi critica els "decrets electorals"',
    desc: 'La Comissió Europea torna a advertir Espanya per l\'excés de despesa pública mentre el govern mobilitza 30.000 M€ de cara al 29-N. El president de la CEOE, Garamendi, qualifica les mesures de "decrets electorals". L\'Ibex 35 registra una sessió volàtil marcada per l\'incertesa pre-electoral.',
    url: 'https://www.bolsamania.com/noticias/economia/cinco-noticias-mas-importantes-miercoles-25-noviembre--24285926.html',
  },
  {
    id: 'n008',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Economia · Empresa',
    title: 'Indra presenta Forward2030: vol duplicar la seva mida en quatre anys',
    desc: 'La tecnològica de defensa i transport Indra presenta el seu nou pla estratègic Forward2030 amb l\'objectiu de més que duplicar el seu volum de negoci fins a l\'any 2030. L\'empresa aposta per la ciberseguretat, la intel·ligència artificial i les solucions de defensa europees.',
    url: 'https://www.eleconomista.es/',
  },
  {
    id: 'n007',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Esports · Champions',
    title: 'El Barça arrasa el Sabah FK (1-4) a Bakú i consolida el lideratge a la Champions',
    desc: 'Anthony Gordon firma un doblet (min. 31 i 51) i el Barcelona goletja el Sabah FK al seu estadi de Bakú en la jornada 5 de la fase de lliga. Adeyemi i Gabriel Jesús completen el marcador. El Barça suma 12 punts i es situa entre els primers de la taula.',
    url: 'https://www.beinsports.com/es-us/football/uefa-champions-league/articles/todos-los-goles-sabah-vs-barcelona-champions-league-2026-11-25',
  },
  {
    id: 'n006',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Esports · Tennis',
    title: 'Copa Davis: Itàlia inicia la defensa del títol contra Corea del Sud',
    desc: 'La selecció italiana de tennis, campiona defensora, comença avui la seva actuació a la Copa Davis contra Corea del Sud. La competició reuneix les millors nacions del món en un format de fas final per setmanes.',
    url: 'https://www.prensa-latina.cu/2026/11/25/primer-boletin-de-deportes-981/',
  },
  {
    id: 'n005',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Successos · Espanya',
    title: 'Detingut per llançar quatre explosius casolans contra la comissaria de Palència',
    desc: 'La Policia Nacional ha detingut un home com a presumpte autor del llançament de quatre artefactes explosius casolans contra la façana de la Comissaria de Palència. Cap dels enginys va impactar dins del recinte policial. La investigació dels fets continua oberta.',
    url: 'https://moncloa.com/2026/11/25/detenido-explosivos-comisaria-palencia-3474382',
  },
  {
    id: 'n004',
    date: '2026-11-25',
    dateLabel: '11·25',
    tag: 'Successos · Catalunya',
    title: 'Un home mor apunyalat a la festa major de Manresa; els Mossos identifiquen dos menors',
    desc: 'Un home molt conegut al Bages va morir apunyalat durant la festa major de Manresa. Els Mossos d\'Esquadra han identificat dos menors com a presumptes implicats en els fets i continuen la recerca d\'altres dues persones. El cas es troba en fase d\'investigació.',
    url: 'https://elmon.cat/es/sucesos/',
  },
  // ── Noticias anteriors ────────────────────────────────────────
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
