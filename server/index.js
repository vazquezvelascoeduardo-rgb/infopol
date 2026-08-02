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
  // Notícies del dia — 2026-08-02
  {
    id: 'nd001',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Política · CAT',
    title: 'Sàmper reivindica un model turístic propi per Catalunya que prioritzi el resident',
    desc: 'El conseller defensa al Parlament que Catalunya necessita competències pròpies en turisme i un major retorn econòmic per als residents i el comerç local.',
    url: null,
  },
  {
    id: 'nd002',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Successos · BCN',
    title: "Junts reclama la dimissió de Paneque i Nadal per l'esvoranc del carrer Putxet",
    desc: "L'esvoranc ha forçat el desallotjament de 93 habitatges al barri de Sant Gervasi de Barcelona. Junts exigeix responsabilitats polítiques.",
    url: null,
  },
  {
    id: 'nd003',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Política · ESP',
    title: "Crisi a Ceuta: 72 morts en la travessia des del Marroc i Sánchez qualifica l'onada d'atac territorial",
    desc: 'Al menys 72 persones han mort intentant creuar des del Marroc. La UE critica la gestió migratòria i reclama control efectiu de les fronteres.',
    url: 'https://en.wikipedia.org/wiki/2026_Morocco%E2%80%93Spain_border_incident',
  },
  {
    id: 'nd004',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Medi Ambient · ESP',
    title: "Sánchez reclama un gran pacte d'Estat contra l'emergència climàtica pels incendis a la Península",
    desc: 'Grans incendis forestals afecten Madrid, Àvila, Toledo i Castelló. 8,5 milions d\'espanyols viuen en zones d\'alt risc d\'incendi forestal.',
    url: null,
  },
  {
    id: 'nd005',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Internacional',
    title: 'Keiko Fujimori assoleix la presidència del Perú malgrat haver perdut la segona volta',
    desc: "La filla d'Alberto Fujimori governarà en un context d'alta inestabilitat política i haurà de negociar acords parlamentaris per tirar endavant el seu programa.",
    url: null,
  },
  {
    id: 'nd006',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Economia',
    title: "Les compravendes d'habitatge cauen un 7,3% al maig encadenant cinc mesos a la baixa",
    desc: 'Malgrat la reducció d\'operacions, els preus han repuntat un 12,9% durant el primer trimestre del 2026.',
    url: 'https://www.pressdigital.es/articulo/economia/2026-08-02/5973053-principales-titulares-periodicos-domingo-2-agosto',
  },
  {
    id: 'nd007',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Esports · Futbol',
    title: "El Barça accepta negociar la sortida de Ferran Torres al PSG",
    desc: "Torres se sent infravalorat al club blaugrana. El PSG ja té un principi d'acord amb el jugador, que va marcar el gol del Mundial per Espanya.",
    url: 'https://www.forbes.com/sites/tomsanderson/2026/08/02/fc-barcelona-now-willing-to-let-ferran-torres-complete-psg-transfer/',
  },
  {
    id: 'nd008',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Esports · Futbol',
    title: "Al-Hilal negocia amb el Barça per Cancelo en una oferta d'uns 10 milions d'euros",
    desc: 'El cas Cancelo es desencalla: el club saudita presentarà una oferta formal al Barça per segellar el traspàs del lateral portuguès.',
    url: 'https://www.barcablaugranes.com/barcelona-news/128023/fc-barcelona-news-2-august-2026-jesse-bisiwu-first-training-session-ferran-torres-psg-heating-up',
  },
  {
    id: 'nd009',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Successos · CAT',
    title: "Mossos obren foc contra un multirreincident que intenta atropellar agents a l'Hospitalet",
    desc: "Un home amb llarg historial delictiu va embestir una patrulla dels Mossos d'Esquadra a l'Hospitalet de Llobregat. Cap agent va resultar ferit.",
    url: 'https://www.youtube.com/watch?v=DuBTy0GqNwM',
  },
  {
    id: 'nd010',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Ciència · Premis',
    title: "L'Estat atorga els Premis Nacionals d'Investigació 2026 amb 20 guardons de 30.000 €",
    desc: "Àngel Carracedo (USC) guanya el Premi Gregorio Marañón per medicina forense i genòmica. Primera edició amb dos premis atorgats íntegrament a investigadores.",
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/MICIU-concede-Premios-Nacionales-Investigacion-2026.html',
  },
  {
    id: 'nd011',
    date: '2026-08-02',
    dateLabel: '08·02',
    tag: 'Ciència · Astronomia',
    title: "L'eclipsi solar total del 12 d'agost serà l'últim visible des d'Europa fins al 2180",
    desc: "En deu dies es podrà observar el fenomen des d'algunes zones del continent. Les properes generacions no tindran una oportunitat equivalent fins d'aquí 154 anys.",
    url: null,
  },
  // Actualitat normativa
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
