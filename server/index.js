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
  // ── 14·08·2026 ──────────────────────────────────────────────
  {
    id: 'n004',
    date: '2026-08-14',
    dateLabel: '08·14',
    tag: 'Successos',
    title: 'Detingut al centre de Barcelona un fugitiu recercat per cadena perpètua',
    desc: 'La Policía Nacional arresta al casc antic un fugitiu sobre qui pesava una ordre de cerca i captura de la justícia islandesa per un crim violent. Enfrontava presó perpètua.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-08-14/5984107-detenido-pleno-centro-barcelona-peligroso-fugitivo-enfrenta-cadena-perpetua',
  },
  {
    id: 'n005',
    date: '2026-08-14',
    dateLabel: '08·14',
    tag: 'Meteorologia',
    title: 'Alerta taronja per calor a Catalunya: temperatures de fins a 40 °C',
    desc: 'El Meteocat activa l\'alerta taronja a Barcelona i el litoral català. Les temperatures poden arribar als 40 °C i s\'esperen tempestes a partir del cap de setmana.',
    url: 'https://www.catalunyapress.es/articulo/sociedad/2026-08-14/5983894-meteocat-alerta-naranja-calor-catalunya-40-grados',
  },
  {
    id: 'n006',
    date: '2026-08-14',
    dateLabel: '08·14',
    tag: 'Política',
    title: 'Rollán visita Ceuta per abordar la crisi migratòria amb Vivas',
    desc: 'El president del Senat, Pedro Rollán, viatja a Ceuta per analitzar la situació que travessa la ciutat autònoma juntament amb el president local, Juan Jesús Vivas.',
    url: 'https://www.elespanol.com/espana/politica/20260814/ultima-hora-politica-directo-presidente-senado-visita-ceuta-analizar-situacion-atraviesa-ciudad-junto-vivas/1003744352778_10.html',
  },
  {
    id: 'n007',
    date: '2026-08-14',
    dateLabel: '08·14',
    tag: 'Esports',
    title: 'Barça 26/27: Gordon arriba per 70 M€ i Ferran Torres marxa cap al PSG',
    desc: 'El FC Barcelona tanca la incorporació d\'Anthony Gordon (Newcastle) per 70 M€ per a la temporada 2026/27. Paral·lelament, Ferran Torres enfilaria cap al PSG per 50 M€.',
    url: 'https://sports.yahoo.com/articles/fc-barcelona-news-14-august-090000737.html',
  },
  // ── 12·08·2026 ──────────────────────────────────────────────
  {
    id: 'n008',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Política',
    title: 'El govern aprova la pròrroga de la nuclear d\'Almaraz fins al 2030',
    desc: 'El Consell de Ministres autoritza la pròrroga d\'explotació de la central nuclear d\'Almaraz. La mesura ha generat crítiques de Sumar i Aliança Verda.',
    url: 'https://www.eldiario.es/politica/ultima-hora-actualidad-politica-directo_6_13441846.html',
  },
  {
    id: 'n009',
    date: '2026-08-12',
    dateLabel: '08·12',
    tag: 'Ciència',
    title: 'L\'eclipse total del 12 d\'agost: el proper complet sobre Europa no arribarà fins al 2180',
    desc: 'L\'eclipsi solar total d\'avui és un fenomen irrepetible per a generacions futures. Científics de tot el món han aprofitat el pas de l\'ombra per realitzar observacions úniques.',
    url: 'https://okdiario.com/ciencia/noticias-cientificas-que-definiran-2026-16260734',
  },
  // ── 08·08·2026 ──────────────────────────────────────────────
  {
    id: 'n010',
    date: '2026-08-08',
    dateLabel: '08·08',
    tag: 'Economia',
    title: 'La Fed manté la política restrictiva: la inflació segueix per sobre dels objectius',
    desc: 'El president de la Fed de Kansas City avisa que la inflació és massa alta i que la política monetària haurà de mantenir-se restrictiva. Cauen les expectatives de retallades de tipus a curt termini.',
    url: 'https://digitalfuentes7.wordpress.com/2026/08/08/5-noticias-economicas-de-hoy-8-de-agosto-2026-ee-uu-petroleo-e-ia/',
  },
  // ── 30·07·2026 ──────────────────────────────────────────────
  {
    id: 'n011',
    date: '2026-07-30',
    dateLabel: '07·30',
    tag: 'Ciència',
    title: 'Premis Nacionals d\'Investigació 2026: 20 categories i dues primeres vegades femenines',
    desc: 'El Ministeri de Ciència atorga els Premis Nacionals d\'Investigació 2026. Per primera vegada el premi Margarita Salas i l\'Ángela Ruiz Robles recauen en dones investigadores.',
    url: 'https://www.infosalus.com/salud-investigacion/noticia-ciencia-concede-premios-nacionales-investigacion-2026-reconocen-excelencia-investigadores-20260730172439.html',
  },
  // ── Normativa anterior ──────────────────────────────────────
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
