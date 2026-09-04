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
  // ── 04·09·2026 ──────────────────────────────────────────────────
  {
    id: 'n013',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Política · Catalunya',
    title: 'Finançament autonòmic: la Generalitat veu una "finestra d\'oportunitat" i demana a Junts no bloquejar-la',
    desc: 'La consellera d\'Economia, Alícia Romero, celebra la proposta del Ministeri d\'Hisenda i insta Junts a no vetar el nou model. El PP i Madrid ho rebutgen per "trencament de la igualtat entre ciutadans".',
    url: 'https://www.moncloa.com/2026/09/04/financiacion-autonomica-cataluna-ventana-junts-3426221/',
  },
  {
    id: 'n014',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Successos · Catalunya',
    title: 'Mossos i Policia Nacional detenen tres fugitius internacionals a Barcelona i Salou',
    desc: 'Un turc reclamat per dos homicidis a Istanbul, un francès condemnat a cadena perpètua per un assassinat a París, i el cap del càrtel colombià "El Mesa" —vinculat a set morts i tràfic de cocaïna— van ser capturats en una operació coordinada.',
    url: 'https://www.catalunyapress.es/articulo/sucesos/2026-09-03/6002184-detenidos-catalunya-tres-fugitivos-internacionales-acusados-homicidio-crimen-organizado',
  },
  {
    id: 'n015',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Política · Espanya',
    title: 'Crisi de Ceuta: el govern confirma el creuament massiu del 30 i 31 de juliol',
    desc: 'Pedro Sánchez admet que desenes de milers de persones van creuar la frontera en dos dies. La investigació apunta a campanyes a xarxes socials com a detonant. L\'Audiència Nacional recolza la jutge instructora.',
    url: 'https://www.infobae.com/espana/agencias/2026/09/04/temas-del-dia-de-efe-espana-del-viernes-4-de-septiembre-de-2026-1330-horas/',
  },
  {
    id: 'n016',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Internacional',
    title: 'Iran ataca bases americanes a Kuwait i els Emirats Àrabs amb míssils i drons',
    desc: 'L\'exèrcit de Kuwait va interceptar part de l\'atac, que va qualificar de "violació greu del dret internacional". Trump suggereix que els EUA podrien no donar suport al Regne Unit en una possible confrontació sobre les Malvines, en una jornada de tensió geopolítica global.',
    url: 'https://es.euronews.com/2026/09/04/euronews-hoy-las-noticias-del-4-de-septiembre-de-2026-milei-reivindica-la-soberania-sobre-',
  },
  {
    id: 'n017',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Internacional',
    title: 'Milei reivindica la sobirania argentina sobre les Malvines i anuncia sancions a petrolieres britàniques',
    desc: '"Les Malvines són argentines, per la història i pel dret". El president argentí decreta sancions a les empreses que extreuen petroli a les illes sense autorització de Buenos Aires i anuncia una nova base naval a Ushuaia.',
    url: 'https://es.euronews.com/2026/09/04/euronews-hoy-las-noticias-del-4-de-septiembre-de-2026-milei-reivindica-la-soberania-sobre-',
  },
  {
    id: 'n018',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Economia · Espanya',
    title: 'El preu de la llum supera els 200 €/MWh en diverses franges del dia',
    desc: 'La borsa elèctrica registra pics de 200 euros per megawatt hora enmig d\'una onada de calor que la AEMET qualifica d\'anòmala per a un mes de setembre, activant avisos grocs i taronges a 15 comunitats autònomes.',
    url: 'https://www.periodistadigital.com/periodismo/20260904/10-asuntos-marcan-politica-periodismo-espana-viernes-4-septiembre-2026-calor-ceuta-noticia-689405243759/',
  },
  {
    id: 'n019',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Esports · Bàsquet',
    title: 'La selecció femenina de bàsquet debuta al Mundial de Berlín contra les anfitriones alemanyes',
    desc: 'Espanya obre el seu Mundial contra Alemanya a l\'Uber Arena de Berlín (17.45 h), amb les entrades exhaurides. FCB i Reial Madrid coneixeran avui els seus rivals en la fase de grups de la Champions League femenina.',
    url: 'https://www.infobae.com/espana/agencias/2026/09/04/temas-del-dia-de-efe-espana-del-viernes-4-de-septiembre-de-2026-1330-horas/',
  },
  {
    id: 'n020',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Esports · Ciclisme',
    title: 'La Vuelta a Espanya: 13a etapa de 192,8 km en disputa',
    desc: 'La ronda espanyola affronta avui la seva 13a etapa, amb un recorregut de gairebé 193 quilòmetres en una jornada clau per als objectius generals de la carrera.',
    url: 'https://espndeportes.espn.com/futbol/equipo/calendario/_/id/164/espana',
  },
  {
    id: 'n021',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Cultura · Cinema',
    title: 'Festival de Cinema de Sant Sebastià obre portes amb presències internacionals destacades',
    desc: 'El Festival Internacional de Cinema de Sant Sebastià inicia la seva nova edició amb la presència d\'actrors i directors de primer nivell mundial. La Biennal de Flamenc de Sevilla es perfila com un dels grans esdeveniments culturals de la tardor.',
    url: 'https://www.infobae.com/espana/agencias/2026/09/04/temas-del-dia-de-efe-espana-del-viernes-4-de-septiembre-de-2026-1330-horas/',
  },
  {
    id: 'n022',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Cultura · Internacional',
    title: 'La Biennal del Llibre de São Paulo obre amb Espanya com a país convidat',
    desc: 'El major festival literari d\'Amèrica Llatina obre les seves portes amb Espanya a l\'epicentre. Paral·lelament, la artista colombiana Doris Salcedo presenta a Bogotà la sèrie completa dels 80 gravats de "Los desastres de la guerra" de Goya.',
    url: 'https://www.infobae.com/espana/agencias/2026/09/04/temas-del-dia-de-efe-espana-del-viernes-4-de-septiembre-de-2026-1330-horas/',
  },
  {
    id: 'n023',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Ciència',
    title: 'Premis Ig Nobel 2026: l\'anàlisi aerodinàmica dels mocs i l\'urinari antisalpicades, entre els guanyadors',
    desc: 'La 36a edició dels Premis Ig Nobel premia investigacions que primer fan riure i després fer pensar. Els guardonats d\'enguany inclouen treballs sobre la mecànica de sonar-se el nas i el disseny de urinaris que minimitzen els esquitxos.',
    url: 'https://www.periodismo.com/2026/09/04/ganadores-de-los-premios-ig-nobel-2026-a-lo-mas-insolito-de-la-ciencia/',
  },
  {
    id: 'n024',
    date: '2026-09-04',
    dateLabel: '09·04',
    tag: 'Clima · Europa',
    title: 'França viu l\'estiu més càlid des del 1900; Europa bat rècords de temperatures',
    desc: '53 dies consecutius d\'onada de calor a França, el pitjor estiu des de fa 126 anys. Bèlgica i el Regne Unit també registren els seus estius més calorosos de la història recent, en un context d\'acceleració del canvi climàtic europeu.',
    url: 'https://es.euronews.com/2026/09/04/euronews-hoy-las-noticias-del-4-de-septiembre-de-2026-milei-reivindica-la-soberania-sobre-',
  },
  // ── Normativa vigent ─────────────────────────────────────────────
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
