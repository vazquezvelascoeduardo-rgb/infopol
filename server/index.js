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
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Política · Espanya',
    title: 'Ceuta reforça la frontera davant una nova convocatòria d\'entrada massiva',
    desc: 'El Marroc deté 148 persones mentre Espanya desplega efectius a la frontera. El ministre Albares visita Ceuta i reafirma el compromís estatal. Cinc mil persones romanen al territori des de la crisi del 30 de juliol.',
    url: 'https://www.elespanol.com/espana/politica/20260815/ultima-hora-politica-directo-refuerzan-seguridad-frontera-ceuta-nueva-convocatoria-entrada-sabado-agosto/1003744353840_10.html',
  },
  {
    id: 'n005',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Política · Catalunya',
    title: 'Aliança Catalana s\'enfila als sondejos mentre Junts perd suport al Parlament',
    desc: 'El primer baròmetre del CEO del 2026 revela un nou escenari: el PSC d\'Illa es manté al capdavant, però Aliança Catalana experimenta un ascens meteòric mentre Junts perd terreny.',
    url: 'https://catalunyanoticies.com/2026/08/',
  },
  {
    id: 'n006',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Internacional',
    title: 'Terratrèmol de 7,7 sacseja les costes d\'Indonèsia i força evacuacions',
    desc: 'Un sisme de gran magnitud va colpir la zona de Maumere, causant danys materials i provocant que la població fugís en massa. Les autoritats avaluen l\'abast dels danys.',
    url: 'https://es.euronews.com/2026/08/15',
  },
  {
    id: 'n007',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Internacional',
    title: 'Líban denuncia 11 morts en atacs israelians — Hezbollah amenaça represàlies',
    desc: 'El president libanès qualifica els atacs d\'un "missatge clar". Hezbollah avisa que les accions israelianes "rebran una resposta adequada".',
    url: 'https://es.euronews.com/2026/08/15',
  },
  {
    id: 'n008',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Internacional',
    title: 'Els talibans celebren el cinquè aniversari al poder a l\'Afganistan',
    desc: 'L\'ONU alerta sobre la greu situació dels drets humans al país. Les dones segueixen excloses de l\'educació i la vida pública sota el règim talibà.',
    url: 'https://es.euronews.com/2026/08/15',
  },
  {
    id: 'n009',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Policial',
    title: 'Detingut per matar la seva parella a Marbella — denúncies mútues una setmana abans',
    desc: 'Un home de 59 anys va confessar l\'atac amb arma blanca a San Pedro Alcántara. La víctima, de 35 anys i origen veneçolà, havia presentat una denúncia mútua el dia 1 d\'agost.',
    url: 'https://www.moncloa.com/2026/08/13/crimen-marbella-denuncias-mutuas-detenido-3414560',
  },
  {
    id: 'n010',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Ciència',
    title: 'Premis Breakthrough 2026 — sis guardons de 3 M$ en física, biomedicina i matemàtiques',
    desc: 'Els "Oscar de la ciència" reconeixen investigadors pioners en ciències de la vida i física fonamental. Matthias Mann guanya el Gairdner per establir les bases de la proteòmica moderna.',
    url: 'https://www.porlalinea.com.do/premios-breakthrough-2026-hollywood-ciencia/',
  },
  {
    id: 'n011',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Esports',
    title: 'La LaLiga 2026-27 arrencarà sense Barça ni Reial Madrid a la primera jornada',
    desc: 'Tots dos clubs tindran descans a l\'estrena de la competició. El Reial Madrid debutarà el 22 d\'agost visitant l\'Espanyol. El Barça juga el Trofeu Joan Gamper contra l\'Al Ahly el dia 19.',
    url: 'https://libero.pe/futbol-internacional/liga-espanola/2026/08/14/barcelona-real-madrid-jugaran-fecha-1-de-laliga-202627-661150',
  },
  {
    id: 'n012',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Medi Ambient',
    title: 'La sequera persistent deixa rius alemanys gairebé secs i amenaça l\'ecosistema fluvial',
    desc: 'La calor extrema i la manca de pluja han reduït dràsticament els cabals fluvials a Alemanya. La baixa oxigenació de l\'aigua posa en risc la fauna piscícola a tot el país.',
    url: 'https://es.euronews.com/2026/08/15',
  },
  {
    id: 'n013',
    date: '2026-08-15',
    dateLabel: '08·15',
    tag: 'Economia · Catalunya',
    title: 'Catalunya defensa un model turístic que prioritzi el resident davant el massiu',
    desc: 'Sàmper reivindica al Parlament mesures per reforçar el comerç local i augmentar el retorn econòmic. La DGT activa el dispositiu especial per la festivitat del 15 d\'agost.',
    url: 'https://www.democrata.es/catalunya/',
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
