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
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'CENIF · Ceuta',
    title: 'Agents marroquins van guiar l\'entrada massiva de migrants a Ceuta',
    desc: 'Un informe de 55 pàgines del CENIF conclou que les forces de seguretat del Marroc van planificar i guiar activament més de 70.000 migrants per les costes ceutíes el 30 i 31 de juliol.',
    url: 'https://www.infobae.com/espana/2026/09/02/el-informe-policial-sostiene-que-la-entrada-de-migrantes-en-ceuta-se-produjo-con-agente-marroquies-guiando-el-cruce-a-traves-del-agua/',
  },
  {
    id: 'n011',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'SEPE · Agost 2026',
    title: 'L\'atur puja 44.419 persones a l\'agost però marca el mínim des del 2007',
    desc: 'Espanya registra 2,35 milions d\'aturats, la xifra més baixa per a un mes d\'agost en 19 anys. La Seguretat Social assoleix el rècord de 22,34 milions d\'afiliats.',
    url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/trabajo14/Paginas/2026/020926-datos-paro-agosto.aspx',
  },
  {
    id: 'n010',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'Atur · Catalunya',
    title: 'Catalunya lidera la pujada de l\'atur a l\'agost amb 14.592 nous desocupats',
    desc: 'La pujada catalana del 4,63% supera la mitjana estatal. Les dades interanuals marquen mínims des del 2008 amb 116.437 nous cotitzants respecte l\'any anterior.',
    url: 'https://www.moncloa.com/2026/09/02/paro-cataluna-agosto-2026-minimos-3425033',
  },
  {
    id: 'n009',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'Govern · Ceuta',
    title: 'El govern aprova un pla de xoc de 309 M€ per a Ceuta',
    desc: 'El Consell de Ministres mobilitza 309 milions d\'euros en mesures de suport econòmic, reforç de serveis públics, seguretat i acollida de migrants a la ciutat autònoma.',
    url: 'https://www.infobae.com/espana/agencias/2026/09/01/temas-del-dia-de-efe-espana-del-miercoles-2-de-septiembre-de-2026/',
  },
  {
    id: 'n008',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'CEO · Baròmetre',
    title: 'Aliança Catalana puja de forma meteòrica i Junts cau al primer baròmetre de 2026',
    desc: 'El CEO publica el primer baròmetre de l\'any: el PSC d\'Illa consolida posicions, Aliança Catalana es converteix en la tercera força i Junts perd suport al Parlament.',
    url: 'https://www.elnacional.cat/es',
  },
  {
    id: 'n007',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'UE · Seguretat',
    title: 'La UE promet una resposta ferma als atacs híbrids russos a Leipzig',
    desc: 'Els líders europeus es reuneixen a Leipzig per coordinar la resposta als atacs d\'interferència i sabotatge atribuïts a Rússia en territori de la Unió Europea.',
    url: 'https://es.euronews.com/2026/09/02/euronews-hoy-las-noticias-del-2-de-septiembre-de-2026-la-policia-senala-a-marruecos-por-la',
  },
  {
    id: 'n006',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'Suïssa · Argòvia',
    title: 'Detenen un sospitós pel tirotejo en una festa rave al cantó suís d\'Argòvia',
    desc: 'La policia d\'Argòvia informa de la investigació i la captura d\'un home com a presumpte autor del tiroteig ocorregut durant el cap de setmana en una rave multitudinària.',
    url: 'https://es.euronews.com/2026/09/02/euronews-hoy-las-noticias-del-2-de-septiembre-de-2026-la-policia-senala-a-marruecos-por-la',
  },
  {
    id: 'n005',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'Srebrenica · Mladic',
    title: 'Srebrenica es manifesta contra la glorificació de Mladic, mort la setmana passada',
    desc: 'La ciutat bosniana convoca concentracions per rebutjar els homenatges al criminal de guerra serbobosnià Ratko Mladic, condemnat pel genocidi de Srebrenica el 1995.',
    url: 'https://es.euronews.com/2026/09/02/euronews-hoy-las-noticias-del-2-de-septiembre-de-2026-la-policia-senala-a-marruecos-por-la',
  },
  {
    id: 'n004',
    date: '2026-09-02',
    dateLabel: '09·02',
    tag: 'Breakthrough 2026',
    title: 'Els Premis Breakthrough 2026, els "Oscars de la ciència", reconeixen la innovació mundial',
    desc: 'Hollywood reuneix estrelles i científics en la gala dels Premis Breakthrough amb reconeixements milionaris als avenços en biomedicina, física fonamental i matemàtiques.',
    url: 'https://www.porlalinea.com.do/premios-breakthrough-2026-hollywood-ciencia/',
  },
  {
    id: 'n003',
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
    id: 'n001',
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
