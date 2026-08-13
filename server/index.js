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
  // ── 13 d'agost de 2026 ─────────────────────────────────────
  {
    id: 'n004',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'CIÈNCIA',
    title: 'Eclipse solar total — primer des de 1905 visible a Espanya peninsular',
    desc: 'La franja de totalitat va creuar ahir la meitat nord de la Península, de la Corunya fins a Castelló. La propera oportunitat d\'un eclipse total des d\'Espanya no arribarà fins al 2180.',
    url: 'https://es.wikipedia.org/wiki/Eclipse_solar_del_12_de_agosto_de_2026',
  },
  {
    id: 'n005',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'MOSSOS',
    title: '700 Mossos desplegats per l\'eclipse — operació per terra, mar i aire a Catalunya',
    desc: 'Dispositiu de seguretat coordinat des de Reus per gestionar les concentracions al Camp de Tarragona, Terres de l\'Ebre i Ponent. Es van distribuir 150.000 ulleres homologades.',
    url: 'https://www.moncloa.com/2026/08/11/mossos-dispositivo-eclipse-solar-cataluna-3413790',
  },
  {
    id: 'n006',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'POLÍTICA',
    title: 'Catalunya es nega a acollir més menors migrants — Ceuta en situació crítica',
    desc: 'La vicepresidenta Estarellas afirma que el Govern no pot assumir més acollides mentre continuïn arribant pasteres. El dimecres va arribar una embarcació amb 14 menors a Formentera.',
    url: 'https://www.elespanol.com/espana/politica/20260813/ultima-hora-politica-directo-infancia-reune-comunidades-aprobar-presupuesto-millones-acogida-menores-ceuta/1003744351777_10.html',
  },
  {
    id: 'n007',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'POLÍTICA',
    title: 'Marroc amenaça suspendre el conveni d\'extradició — IU alerta del risc per a la sobirania',
    desc: 'El coordinador federal d\'IU, Antonio Maíllo, adverteix que la sobirania espanyola "està en perill" davant l\'escalada marroquina contra la política de regularització de migrants.',
    url: 'https://www.elespanol.com/espana/politica/20260813/ultima-hora-politica-directo-infancia-reune-comunidades-aprobar-presupuesto-millones-acogida-menores-ceuta/1003744351777_10.html',
  },
  {
    id: 'n008',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'ECONOMIA',
    title: 'Gasoil +15,7% interanual el juliol — s\'activen les mesures del decret anticrisi',
    desc: 'El preu del gasoil supera el llindar del 15% previst al decret de contenció de l\'impacte de la guerra de l\'Iran. El PIB espanyol preveu créixer un 2,5% el 2026, per sobre de l\'eurozona.',
    url: 'https://www.eleconomista.es/',
  },
  {
    id: 'n009',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'ECONOMIA',
    title: 'Rècord de baixes voluntàries — 1,54 milions en el primer semestre de 2026',
    desc: 'Al juny es van registrar 323.455 baixes voluntàries d\'afiliació a la SS, un 3,9% més interanual. La xifra acumulada en el primer semestre és la més alta des que hi ha registres.',
    url: null,
  },
  {
    id: 'n010',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'ESPORTS',
    title: 'Espanya, campiona del Món 2026 — Ferrán Torres, l\'heroi del Mundial',
    desc: 'La selecció espanyola es va proclamar campiona de la Copa del Món de la FIFA 2026 (Canadà-Mèxic-EUA) el 19 de juliol. Els clubs han reprès la pretemporada en ple agost.',
    url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/espana-triunfa-en-un-mundial-pionero',
  },
  {
    id: 'n011',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'ESPORTS',
    title: 'Trofeu Joan Gamper el 19 d\'agost — FC Barcelona vs Al Ahly al Camp Nou',
    desc: 'Últim examen de pretemporada del Barça abans del debut a LaLiga el 23 d\'agost. El club torna d\'una temporada amb el bicampionat de Lliga i la Supercopa d\'Espanya.',
    url: 'https://www.fcbarcelona.es/es/futbol/primer-equipo/noticias/',
  },
  {
    id: 'n012',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'JUDICIAL',
    title: '5 anys de presó per violació en un bar de Pamplona — sentència del 10 d\'agost',
    desc: 'L\'Audiència Provincial de Navarra condemna un home per violar una coneguda en els lavabos d\'un establiment. El tribunal va valorar la declaració de la víctima com a plenament creïble.',
    url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/',
  },
  {
    id: 'n013',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'INTERNACIONAL',
    title: 'Iran reestructura el comandament militar amb "doctrina ofensiva" — tensió a l\'Estret d\'Ormuz',
    desc: 'Tehran nomena generals del CGRI associats a posicions dures sobre el conflicte. S\'obren converses via mediadors per definir un marc temporal d\'acord provisional amb els EUA.',
    url: 'https://www.justsecurity.org/153621/early-edition-august-13-2026/',
  },
  {
    id: 'n014',
    date: '2026-08-13',
    dateLabel: '08·13',
    tag: 'INTERNACIONAL',
    title: 'Colòmbia autoritza operacions militars dels EUA en territori colombià contra càrtels',
    desc: 'Pete Hegseth celebra l\'adhesió de Colòmbia a la coalició "Americas Counter Cartel Coalition". Es preveu la presència militar nord-americana per a operacions antidroga conjuntes.',
    url: 'https://havanatimes.org/news/international-news-briefs-for-thursday-august-13-2026/',
  },
  // ── Anteriors ───────────────────────────────────────────────
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
