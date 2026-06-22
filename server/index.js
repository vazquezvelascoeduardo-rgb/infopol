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
  // ── 22 juny 2026 ───────────────────────────────────────────────
  {
    id: 'n010',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Esports · Mundial 2026',
    title: 'Messi, màxim golejador de la història dels Mundials amb 18 dianes',
    desc: 'Doblet davant Àustria (2-0) classifica l\'Argentina per als setzens. Supera els 17 gols de Klose. França-Iraq i Jordània-Algèria, altres partits del dia.',
    url: 'https://www.eltiempo.com/deportes/futbol-internacional/mundial-2026-hoy-lunes-22-de-junio-siga-la-jornada-de-este-lunes-con-argentina-francia-senegal-irak-austria-y-argelia-3566031',
  },
  {
    id: 'n009',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Internacional · Economia',
    title: 'Mor Alan Greenspan, expresident de la Fed, als 100 anys',
    desc: 'Va presidir la Reserva Federal dels EUA durant 18,5 anys. Va morir per complicacions del Parkinson. La seva esposa, la periodista Andrea Mitchell, ha confirmat la notícia.',
    url: 'https://www.lanacion.com.ar/estados-unidos/murio-alan-greenspan-el-historico-jefe-de-la-fed-que-marco-una-era-en-wall-street-nid22062026/',
  },
  {
    id: 'n008',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Internacional · Política',
    title: 'De la Espriella, nou president de Colòmbia amb resultat molt ajustat',
    desc: 'El candidat conservador obté el 49,66% davant el 48,70% d\'Iván Cepeda. Rellevarà Gustavo Petro l\'agost. Victòria decidida a la segona volta del diumenge 21.',
    url: 'https://www.eltiempo.com/politica/elecciones-colombia-2026/resultados-segunda-vuelta-presidencial-2026-siga-el-minuto-a-minuto-del-preconteo-de-la-registraduria-nacional-3565893',
  },
  {
    id: 'n007',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Internacional · Pau',
    title: 'EEUU i l\'Iran signen acord provisional de 14 punts per aturar el conflicte',
    desc: 'Cessament immediat de les operacions militars, congelament del programa nuclear iranià durant 20 anys i reobertura de l\'estret d\'Ormuz. Negociacions definitives a Suïssa en 60 dies.',
    url: 'https://www.lanacion.com.ar/el-mundo/el-acuerdo-completo-de-14-puntos-que-firmaran-eeuu-e-iran-para-poner-fin-a-la-guerra-en-medio-nid17062026/',
  },
  {
    id: 'n006',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Catalunya · Política',
    title: 'Illa negocia contra rellotge el finançament singular i els pressupostos',
    desc: 'El PSC necessita tancar acord amb ERC i els Comuns abans de l\'estiu per evitar eleccions anticipades. ERC reconeix que el traspàs de l\'IRPF requerirà tres anys.',
    url: 'https://www.moncloa.com/2026/05/31/erc-irpf-traspaso-cataluna-dificultades-3381065/',
  },
  {
    id: 'n005',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Espanya · Economia',
    title: 'L\'OCDE eleva el PIB d\'Espanya al 2,2% però revisa la inflació al 3,3%',
    desc: 'Espanya, l\'economia avançada amb millor rendiment de 2026. L\'organisme atribueix la pujada de preus a la tensió energètica derivada del conflicte a l\'Orient Mitjà.',
    url: 'https://www.merca2.es/2026/06/03/previsiones-ocde-espana-2026-2388975/',
  },
  {
    id: 'n004',
    date: '2026-06-22',
    dateLabel: '06·22',
    tag: 'Policial · Mossos',
    title: 'Presó provisional per a 6 dels 16 detinguts en xarxa de narcotràfic a Girona',
    desc: 'Guàrdia Civil i Mossos d\'Esquadra van desmantellar la trama de narcotràfic i blanqueig. Quatre resten sense fiança; dos amb fiança de 150.000 €.',
    url: 'https://www.infobae.com/espana/agencias/2026/05/29/prision-provisional-para-seis-de-los-16-detenidos-en-una-trama-de-narcotrafico-y-blanqueo/',
  },
  // ── Normativa anterior ─────────────────────────────────────────
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
