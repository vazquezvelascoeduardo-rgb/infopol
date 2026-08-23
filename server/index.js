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
  // ── Noticias 23/08/2026 ──────────────────────────────────────
  {
    id: 'n010',
    date: '2026-08-23',
    dateLabel: '08·23',
    tag: 'Policial · CAT',
    title: 'Mort a la Ràpita en una baralla multitudinària',
    desc: 'Els Mossos reben l\'avís a les 3.30 h. Un home mor al lloc de l\'incident. La Divisió d\'Investigació Criminal de les Terres de l\'Ebre investiga les circumstàncies de l\'agressió entre grups.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-08-23/5991464-muere-hombre-rpita-agresion-entre-varios-grupos',
  },
  {
    id: 'n011',
    date: '2026-08-23',
    dateLabel: '08·23',
    tag: 'Internacional',
    title: 'Jackson Hole i G20: el deute dels EUA, al centre del debat global',
    desc: 'Els EUA acullen els dos grans fòrums financers de la setmana. El creixent volum del deute federal i la política de tipus d\'interès centren l\'agenda dels ministres de Finances del G20.',
    url: 'https://www.infobae.com/america/agencias/2026/08/23/domingo-23-de-agosto-de-2026-1200-gmt/',
  },
  {
    id: 'n012',
    date: '2026-08-23',
    dateLabel: '08·23',
    tag: 'Internacional',
    title: '\'Veus per la vida\': concert solidari pel terratrèmol de Colòmbia',
    desc: 'Karol G, Miguel Bosé, Maluma i altres artistes actuen per recaptar fons per a les zones afectades pel sisme de magnitud 7,4 del 10 d\'agost, que va causar centenars de víctimes.',
    url: 'https://www.infobae.com/america/agencias/2026/08/23/domingo-23-de-agosto-de-2026-1200-gmt/',
  },
  // ── Noticias 22/08/2026 ──────────────────────────────────────
  {
    id: 'n009',
    date: '2026-08-22',
    dateLabel: '08·22',
    tag: 'Policial · CAT',
    title: 'Dispositiu Kanpai a Puigcerdà: 4 detinguts i 162 identificats',
    desc: 'Operació conjunta de Mossos, Policia Local, Policia Nacional i Guàrdia Civil. S\'han efectuat inspeccions a establiments i diverses denúncies administratives i penals.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-08-22/5991023-dispositivo-kanpai-pone-foco-puigcerd-cuatro-detenidos-162-identificados',
  },
  {
    id: 'n008',
    date: '2026-08-22',
    dateLabel: '08·22',
    tag: 'Política · CAT',
    title: 'Pressupostos 2026: el Govern afronta la tardor sota pressió de Junts i ERC',
    desc: 'Malgrat l\'aprovació de les segones comptes de la legislatura el 2 de juliol (49.162 M€), el Govern d\'Illa enfronta noves negociacions sobre finançament singular i habitatge.',
    url: 'https://www.moncloa.com/2026/08/22/presupuestos-cataluna-2026-illa-prorroga-3419232/',
  },
  {
    id: 'n007',
    date: '2026-08-22',
    dateLabel: '08·22',
    tag: 'Esports · ES',
    title: 'La Vuelta a Espanya 2026 arrenca a Mònaco',
    desc: '21 etapes i 3.275 km fins a la meta de Granada el 13 de setembre. La ronda espanyola comença al Principat de Mònaco en una edició de recorregut particularment exigent.',
    url: 'https://www.olympics.com/es/noticias/calendario-deportes-2026',
  },
  // ── Noticias 19/08/2026 ──────────────────────────────────────
  {
    id: 'n006',
    date: '2026-08-19',
    dateLabel: '08·19',
    tag: 'Ciència',
    title: 'Conferència Mundial de Robòtica a Pequín: 300 empreses exhibeixen robots humanoides',
    desc: 'Més de 300 companyies han presentat robots humanoides, industrials i de servei. La indústria accelera el desplegament de robots a fàbriques i entorns comercials a escala global.',
    url: 'https://es.euronews.com/video/2026/08/23/ultimas-noticias-23-agosto-2026-manana',
  },
  // ── Noticias 07/08/2026 ──────────────────────────────────────
  {
    id: 'n005',
    date: '2026-08-07',
    dateLabel: '08·07',
    tag: 'Societat · CAT',
    title: 'Socavó del Putxet: el 40% dels veïns no tornarà fins al setembre',
    desc: 'Un mes després del sot de vuit metres al barri de Sant Gervasi–la Bonanova (L9), uns 93 habitatges continuen desallotjats. Nous sondejos del terreny allarguen l\'espera.',
    url: 'https://metropoliabierta.elespanol.com/sarria-sant-gervasi/20260807/incertidumbre-vecinos-desalojados-putxet-mes-socavon-l9-no-podra-volver-casa-septiembre/1003742785229_0.html',
  },
  // ── Noticias 30/07/2026 ──────────────────────────────────────
  {
    id: 'n004',
    date: '2026-07-30',
    dateLabel: '07·30',
    tag: 'Economia · ES',
    title: 'Espanya lidera la UE: PIB del 0,7% al segon trimestre de 2026',
    desc: 'La zona euro creix el 0,4% en el segon trimestre, mentre Espanya s\'anota el 0,7%. El país es consolida com a motor econòmic europeu per tercer any consecutiu.',
    url: 'https://www.moncloa.com/2026/07/30/pib-eurozona-segundo-trimestre-2026-espana-3408106',
  },
  // ── Normativa ────────────────────────────────────────────────
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
