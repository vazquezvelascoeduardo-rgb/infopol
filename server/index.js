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

// Noticias generals diàries (actualitzades a les 22h)
const GENERAL_NEWS = [
  // ─── 28 · SET · 2026 ───────────────────────────────────────────
  { id: 'g2026-09-28-01', date: '2026-09-28', dateLabel: '09·28', cat: 'politica', tag: 'Política · CAT', title: 'Aliança Catalana en ascens i Junts en caiguda, segons el CEO', desc: 'El baròmetre 2026 del Centre d\'Estudis d\'Opinió mostra un nou escenari al Parlament. El PSC d\'Illa es manté estable mentre AC puja meteòricament.', url: 'https://www.democrata.es/catalunya/' },
  { id: 'g2026-09-28-02', date: '2026-09-28', dateLabel: '09·28', cat: 'politica', tag: 'Política · CAT', title: 'Junts demana la dimissió de Paneque i Nadal per l\'esvoranc del Putxet', desc: 'L\'enfonsament ha forçat l\'evacuació de 93 habitatges a Barcelona. Junts responsabilitza els consellers de Territori i Cultura de la gestió de la crisi.', url: 'https://www.infobae.com/espana/agencias/2026/09/28/temas-del-dia-de-efe-espana-del-lunes-28-de-septiembre-de-2026-1330-horas/' },
  { id: 'g2026-09-28-03', date: '2026-09-28', dateLabel: '09·28', cat: 'politica', tag: 'Política · ES', title: 'Sánchez rep el primer ministre de Groenlàndia al Palau de Congressos de Catalunya', desc: 'Pedro Sánchez i Jens Frederik Nielsen s\'reunen a Barcelona per tractar cooperació àrtica, recursos naturals i relacions bilaterals.', url: 'https://www.infobae.com/espana/agencias/2026/09/28/temas-del-dia-de-efe-espana-del-lunes-28-de-septiembre-de-2026-1330-horas/' },
  { id: 'g2026-09-28-04', date: '2026-09-28', dateLabel: '09·28', cat: 'economia', tag: 'Economia · ES', title: 'El Govern prepara noves mesures per intervenir el mercat del lloguer', desc: 'La proposta inclou la pròrroga de dos anys per als contractes que arribin al venciment. Díaz i Paneque inauguren 36 habitatges protegits a Cardedeu.', url: 'https://www.infobae.com/espana/agencias/2026/09/28/temas-del-dia-de-efe-espana-del-lunes-28-de-septiembre-de-2026-1330-horas/' },
  { id: 'g2026-09-28-05', date: '2026-09-28', dateLabel: '09·28', cat: 'economia', tag: 'Economia · ES', title: 'El PIB creix un 0,7% al 2T i la CEOE revisa al alça la previsió fins al 2,6%', desc: 'El consum de les llars s\'accelera fins l\'1,2% i la inversió creix un 1,4%. L\'IPC d\'agost es situa al 4,3%, set dècimes per sobre del juliol.', url: 'https://www.merca2.es/2026/09/27/pib-espana-segundo-trimestre-empleo-2462792/' },
  { id: 'g2026-09-28-06', date: '2026-09-28', dateLabel: '09·28', cat: 'policial', tag: 'Policial · CAT', title: 'Mossos investiguen el quart segrest exprés a Catalunya en un mes, ara a Calella', desc: 'És el novè cas de detencions il·legals vinculades al tràfic de drogues des de gener. La víctima va desaparèixer al Maresme cap a les 21:30 h del diumenge.', url: 'https://www.moncloa.com/2026/09/28/secuestro-calella-cuarto-cataluna-3439226/' },
  { id: 'g2026-09-28-07', date: '2026-09-28', dateLabel: '09·28', cat: 'policial', tag: 'Policial · ES', title: 'Tres detinguts a Benidorm per l\'assassinat d\'una dona en presumpta violència de gènere', desc: 'L\'agressor, de 30 anys, hauria matat la seva parella amb arma blanca. Dos homes de 40 i 45 anys queden detinguts per encobrir el crim i traslladar el cadàver.', url: 'https://www.infobae.com/america/agencias/2026/09/28/la-policia-detiene-en-benidorm-a-un-hombre-por-el-asesinato-de-su-pareja-y-a-otros-dos-por-encubrirlo/' },
  { id: 'g2026-09-28-08', date: '2026-09-28', dateLabel: '09·28', cat: 'policial', tag: 'Policial · ES', title: 'Cinc joves detinguts per dos intents d\'homicidi al districte de Ciudad Lineal de Madrid', desc: 'Dos dels detinguts són menors d\'edat. Les agressions, vinculades presumptament al grup DDP, van tenir lloc el mes d\'agost al barri de Ciudad Lineal.', url: 'https://www.madridactual.es/noticias-regionales/sucesos/policia-detiene-presuntos-miembros-ddp-intentos-homicidio-20260928-8120865.html' },
  { id: 'g2026-09-28-09', date: '2026-09-28', dateLabel: '09·28', cat: 'internacional', tag: 'Internacional', title: 'Opositores veneçolans protesten exigint el retorn de Machado i eleccions lliures', desc: 'Centenars de persones surten als carrers de les principals ciutats de Veneçuela per denunciar el règim de Maduro i reclamar processos electorals democràtics.', url: 'https://es.euronews.com/video/2026/09/28/ultimas-noticias-28-septiembre-2026-tarde' },
  { id: 'g2026-09-28-10', date: '2026-09-28', dateLabel: '09·28', cat: 'internacional', tag: 'Internacional', title: 'Sèrbia i Croàcia acceleren el rearmament enmig d\'una retòrica creixent als Balcans', desc: 'Els dos països reforcen els seus exèrcits amb nova maquinària i personal. Experts adverteixen d\'un augment de tensions regionals.', url: 'https://es.euronews.com/video/2026/09/28/ultimas-noticias-28-septiembre-2026-tarde' },
  { id: 'g2026-09-28-11', date: '2026-09-28', dateLabel: '09·28', cat: 'esports', tag: 'Esports · ES', title: 'La selecció espanyola prepara el duel de la Lliga de Nacions contra Croàcia a Sevilla', desc: 'La vigent campiona del món entrena a la Ciutat del Futbol de Las Rozas. El partit es disputa dimarts i és clau per al lideratge del grup.', url: 'https://www.infobae.com/espana/agencias/2026/09/26/domingo-27-de-septiembre-de-2026/' },
  { id: 'g2026-09-28-12', date: '2026-09-28', dateLabel: '09·28', cat: 'esports', tag: 'Esports · ES', title: 'Pontevedra tanca el Campionat Mundial de Triatló amb rècord d\'assistència', desc: 'La competició, celebrada del 24 al 27 de setembre, ha congregat atletes de més de 150 països. La ciutat gallega es consolida com a seu esportiva internacional.', url: 'https://www.olympics.com/es/noticias/calendario-deportes-2026' },
  { id: 'g2026-09-28-13', date: '2026-09-28', dateLabel: '09·28', cat: 'cultura', tag: 'Cultura · ES', title: 'Iberseries & Platino Indústria inaugura la seva 6a edició a Madrid', desc: 'El major fòrum audiovisual de parla hispana i portuguesa reuneix professionals de cinema i televisió del 29 de setembre al 2 d\'octubre a Madrid.', url: 'https://www.infobae.com/espana/agencias/2026/09/28/temas-del-dia-de-efe-espana-del-lunes-28-de-septiembre-de-2026-1330-horas/' },
  { id: 'g2026-09-28-14', date: '2026-09-28', dateLabel: '09·28', cat: 'cultura', tag: 'Cultura · CAT', title: 'IV edició dels Premis Vanguardia a Barcelona amb presència de Sánchez i Feijóo', desc: 'La gala de lliurament de premis de La Vanguardia reuneix les principals autoritats polítiques de l\'Estat a Barcelona a les 20:00 h.', url: 'https://www.infobae.com/espana/agencias/2026/09/28/temas-del-dia-de-efe-espana-del-lunes-28-de-septiembre-de-2026-1330-horas/' },
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

app.get('/api/general-news', (req, res) => {
  const { cat, date } = req.query;
  let result = GENERAL_NEWS;
  if (cat && cat !== 'totes') result = result.filter(n => n.cat === cat);
  if (date) result = result.filter(n => n.date === date);
  res.json(result);
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
