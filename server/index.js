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
    id: 'n013',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Ciència',
    title: 'Quinze anys del Premi Vanguardia de la Ciència: vuit finalistes liderats per dones',
    desc: 'La Fundació Catalunya La Pedrera celebra el 15è aniversari del premi científic amb vuit investigacions finalistes dirigides per investigadores catalanes.',
    url: 'https://www.fundaciocatalunya-lapedrera.com/es/noticias/quince-anos-del-premio-vanguardia-ciencia-ocho-investigaciones-finalistas-lideradas',
  },
  {
    id: 'n012',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Cultura',
    title: 'El govern concedeix els Premis Nacionals d\'Innovació i Disseny 2026',
    desc: 'La ministra Diana Morant lliura els premis que distingeixen professionals i entitats que han integrat la innovació i el disseny al creixement empresarial.',
    url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html',
  },
  {
    id: 'n011',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Economia',
    title: 'Espanya eleva la previsió de creixement del PIB al 2,6% el 2026',
    desc: 'El govern espanyol revisa a l\'alça les previsions: el PIB creixerà el doble que la zona euro, malgrat la incertesa geopolítica global.',
    url: 'https://www.catalannews.com/business/item/spain-raises-2026-gdp-growth-forecast-to-26-despite-war-uncertainty',
  },
  {
    id: 'n010',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Policial',
    title: 'El Suprem eleva al Congrés el suplicatori contra el diputat Félix Alonso',
    desc: 'L\'instructor investiga el diputat de Sumar per presumpte prevaricació com a exalcalde d\'Altafulla en la contractació pública entre 2011 i 2019.',
    url: 'https://www.eldiario.es/catalunya/supremo-pide-permiso-congreso-procesar-prevaricacion-diputado-comuns-felix-alonso_1_13379831.html',
  },
  {
    id: 'n009',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Esports',
    title: 'Espanya vença França (2-0) i es classifica per a la final del Mundial',
    desc: 'Oyarzabal i Porro marquen els gols que porten La Roja a la final del 19 de juliol, on s\'enfrontarà a Argentina o Anglaterra.',
    url: 'https://cnnespanol.cnn.com/2026/07/14/deportes/live-news/espana-francia-semifinal-mundial-2026-en-vivo-resultado-goles-orix',
  },
  {
    id: 'n008',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Internacional',
    title: 'L\'OMS alerta: el brot d\'Ebola al Congo és el tercer més gran de la història',
    desc: 'Prop de 2.000 casos i 750 morts al Congo. L\'OMS avisa que el brot supera tots els esforços internacionals de resposta.',
    url: 'https://www.infobae.com/salud/2026/07/15/la-oms-advirtio-sobre-la-rapida-expansion-del-brote-de-ebola-en-el-congo-ya-es-el-tercero-mas-grande-registrado/',
  },
  {
    id: 'n007',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Internacional',
    title: 'La UE i el Regne Unit firmen l\'acord que elimina la verja de Gibraltar',
    desc: 'La frontera física desapareix el 15 de juliol, permetent la lliure circulació als 15.000 treballadors transfronterers diaris.',
    url: 'https://www.eldiario.es/internacional/ue-reino-unido-firman-acuerdo-definitivo-tumba-verja-gibraltar_1_13379709.html',
  },
  {
    id: 'n006',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Política',
    title: 'El Congrés tomba la senda de dèficit de Sánchez amb PP, Vox i Junts',
    desc: 'Primer revés parlamentari per als pressupostos de Sánchez, que complica l\'objectiu d\'esgotar la legislatura fins al 2027.',
    url: 'https://www.elespanol.com/espana/politica/20260715/primer-reves-congreso-presupuesto-sanchez-complica-empeno-estirar-legislatura/1003744321410_0.html',
  },
  {
    id: 'n005',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Política',
    title: 'Catalunya enceta nova setmana d\'incendis amb preocupació per Aiguamúrcia',
    desc: 'L\'onada de calor i els incendis simultanis acumulen 3.800 hectàrees cremades en deu dies de juliol al territori català.',
    url: 'https://naciodigital.cat/societat/catalunya-enceta-una-nova-setmana-dincendis-amb-preocupacio-per-aiguamurcia-i-mirant-pena-roja-de-rell.html',
  },
  {
    id: 'n004',
    date: '2026-07-15',
    dateLabel: '07·15',
    tag: 'Política',
    title: 'Junts qüestiona l\'impacte demogràfic de la llei de regularització',
    desc: 'El partit de Puigdemont exigeix dades al govern espanyol sobre l\'efecte demogràfic de la regularització massiva d\'immigrants a Catalunya.',
    url: 'https://en.ara.cat/politics/junts-follows-in-the-wake-of-pp-and-vox-and-questions-the-demographic-impact-of-the-clean-law-in-catalonia_1_5799580.html',
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
