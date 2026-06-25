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
  // ── Actualització diària 2026-06-25 ──────────────────────────
  {
    id: 'n004',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'INT · Catàstrofe',
    title: 'Terratrèmol a Veneçuela: 188 morts i més de 130 rèpliques',
    desc: 'Dos sismes devasten Caracas i altres estats. EUA anuncia ajuda milionària. La presidenta Rodríguez crea un fons de 200M$ per a la reconstrucció.',
    url: 'https://www.eltiempo.com/mundo/venezuela/ultimas-noticias-del-fuerte-terremoto-en-venezuela-este-jueves-25-de-junio-reacciones-del-mundo-balance-de-danos-cifras-de-heridos-y-muertos-3566923',
  },
  {
    id: 'n005',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'INT · Esports',
    title: 'Mundial 2026: Mèxic goleja la Rep. Txeca (3-0) i lidera el grup A',
    desc: 'Primera vegada que Mèxic finalitza una fase de grups amb puntuació perfecta en un Mundial. 80.000 espectadors al camp.',
    url: 'https://www.infobae.com/deportes/2026/06/25/mundial-2026-en-vivo-ultimas-noticias-de-hoy-25-de-junio-partidos-resultados-y-la-definicion-de-los-grupos/',
  },
  {
    id: 'n006',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'ESP · Judicial',
    title: 'El jutge Peinado obre judici oral contra Begoña Gómez i li retira el passaport',
    desc: 'Mesures cautelars per tràfic d\'influències, corrupció privada i malversació. Haurà de comparèixer davant el jutge cada dues setmanes.',
    url: 'https://www.eldiario.es/politica/ultima-hora-decision-peinado-enviar-juicio-begona-gomez_6_13320274.html',
  },
  {
    id: 'n007',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'ESP · Esports',
    title: 'Espanya golpeja l\'Aràbia Saudita (4-0) i s\'acosta als vuitens del Mundial 2026',
    desc: 'La Roja domina el grup H. El 27 de juny s\'enfronta a l\'Uruguai en el partit decisiu per tancar la fase de grups.',
    url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures',
  },
  {
    id: 'n008',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'CAT · Successos',
    title: 'Mossos i Policia Nacional desmantellen 12 hivernacles de marihuana a Tarragona',
    desc: '14 detinguts, 6 ingressats a presó. Xarxa de cultiu indoor desarticulada a Cabra del Camp amb droga, armes i diners intervinguts.',
    url: 'https://www.catalunyapress.cat/article/successos-catalunya/2026-06-24/5931240-desmuntada-xarxa-amb-12-plantacions-marihuana-indoor-tarragona',
  },
  {
    id: 'n009',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'ESP · Economia',
    title: 'El PIB d\'Espanya creix un 2,7% interanual al primer trimestre de 2026',
    desc: 'Millor resultat que el T4 2025. L\'OCDE preveu un 2,2% per a tot l\'any i eleva la inflació esperada fins al 3,3%.',
    url: 'https://www.diarioenpositivo.com/economia/economia-ocde-mejora-prevision-pib-espana-2026-22-eleva-inflacion-33/20260603114106083039.amp.html',
  },
  {
    id: 'n010',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'ESP · Política',
    title: '900.000 sol·licituds en la campanya de regularització de migrants a Espanya',
    desc: 'Gairebé el doble de les previsions. El nou arrelament social del RD 316/2026 permet regularitzar fins al 30 de juny de 2026.',
    url: 'https://theobjective.com/espana/',
  },
  {
    id: 'n011',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'INT · Política',
    title: 'L\'ONU acusa Israel d\'atacar deliberadament nens palestins a Gaza',
    desc: 'Informe de la Comissió de Nacions Unides denuncia atacs sistemàtics contra la infància. Rússia avança lentament a l\'est d\'Ucraïna.',
    url: 'https://cnnespanol.cnn.com/',
  },
  {
    id: 'n012',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'ESP · Judicial',
    title: 'La Policia Nacional blinda els seus agents davant el jutge Peinado',
    desc: 'La Direcció General defensa la reputació dels funcionaris implicats en la investigació del cas Begoña Gómez.',
    url: 'https://www.catalunyapress.cat/article/politica-nacional/2026-06-21/5927330-policia-respon-jutge-pentinat-i-blinda-reputacio-dels-seus-funcionaris',
  },
  {
    id: 'n013',
    date: '2026-06-25',
    dateLabel: '06·25',
    tag: 'INT · Ciència',
    title: 'Premis Breakthrough 2026: sis guardons de 3M$ celebren la millor ciència mundial',
    desc: 'Els "Òscars de la ciència" premien recerques en ciències de la vida, física fonamental i matemàtiques. Gala a Santa Mònica.',
    url: 'https://www.porlalinea.com.do/premios-breakthrough-2026-hollywood-ciencia/',
  },
  // ── Actualitat normativa ──────────────────────────────────────
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
