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
  // ── 01·10·2026 ────────────────────────────────────────────────
  {
    id: 'n004',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'SUCCESSOS',
    title: 'Detingut un menor de 16 anys com a administrador del grup ransomware KillSec',
    desc: 'Operació conjunta de la DIC dels Mossos i la UCO de la Guàrdia Civil amb suport d\'Europol, FBI i Policia Federal belga. Assegurats més d\'1.100 TB de dades i cinc servidors centrals.',
    url: 'https://www.elliberal.cat/2026/10/01/detenido-alicante-menor-16-anos-killsec-ransomware/',
  },
  {
    id: 'n005',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'SUCCESSOS',
    title: 'Incidents a la plaça Urquinaona en la manifestació del 9è aniversari de l\'1-O',
    desc: 'Uns 600 manifestants convocats per l\'ANC cremar contenidors a Urquinaona. Els Mossos d\'Esquadra despleguen antidisturbis per restablir l\'ordre al final de l\'acte.',
    url: 'https://www.infobae.com/espana/agencias/2026/10/01/la-manifestacion-del-1-o-en-barcelona-termina-con-incidentes-en-la-plaza-urquinaona/',
  },
  {
    id: 'n006',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'POLÍTICA',
    title: 'Debat de política general — ERC i Comuns critiquen l\'executiu d\'Illa per manca de rumb',
    desc: 'Tercer i darrer dia del debat al Parlament. ERC i els Comuns qualifiquen el Govern de "mig gas" i "sense direcció". El Parlament aprova instar l\'Estat a tancar el nou sistema de finançament per al 2027.',
    url: 'https://www.elespanol.com/espana/politica/20261001/ultima-hora-politica-directo-acampada-sol-vive-quinta-noche-vez-gente-llamamientos-huelga-general/1003744404165_10.html',
  },
  {
    id: 'n007',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'POLÍTICA',
    title: 'Felip VI i Sánchez al Fòrum La Toja: Ceuta, Marroc i Intel·ligència Artificial',
    desc: 'La VIII edició del Fòrum La Toja reuneix el Rei i el President del Govern per debatre la situació a Ceuta, les relacions amb el Marroc i els reptes de la IA en l\'agenda espanyola.',
    url: 'https://www.infobae.com/espana/agencias/2026/10/01/temas-del-dia-de-efe-espana-del-jueves-1-de-octubre-de-2026/',
  },
  {
    id: 'n008',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'ECONOMIA',
    title: 'L\'Ibex 35 cau un 2,2% i retrocedeix als 19.000 punts enmig de la incertesa global',
    desc: 'La borsa espanyola encadena pèrdues en un context de revisió a la baixa del comerç internacional. Iberdrola s\'acosta a ser la major elèctrica del món, a sols un 1,6% de superar el gigant nord-americà.',
    url: 'https://www.eleconomista.es/',
  },
  {
    id: 'n009',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'ESPORTS',
    title: 'Valentino Rossi torna al Circuit de Catalunya en un cap de setmana especial del motor',
    desc: 'La llegenda italiana del motociclisme fa una aparició especial al Circuit de Barcelona-Catalunya. L\'esdeveniment aplega aficionats del motor de tota la península.',
    url: 'https://www.elnacional.cat/es/deportes.html',
  },
  {
    id: 'n010',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'ESPORTS',
    title: 'La sub-21 espanyola s\'enfronta a San Marino en qualificació europea',
    desc: 'La selecció espanyola sub-21 juga al petit estat de San Marino la tercera jornada de la fase de classificació. A la UEFA Nations League, Espanya s\'enfrontarà a partits entre Alemanya-Sèrbia i Dinamarca-Portugal.',
    url: 'https://espndeportes.espn.com/futbol/equipo/calendario/_/id/164/spain',
  },
  {
    id: 'n011',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'CIÈNCIA',
    title: 'Science Fest a Màlaga: Premis Dones Científiques i debat sobre IA i genoma',
    desc: 'Sis investigadors internacionals es reuneixen a Màlaga per abordar evolució humana, genètica i IA. S\'entreguen els Premis Dones Científiques, que reconeixen investigadores a l\'avantguarda del coneixement a Espanya.',
    url: 'https://muyinteresante.okdiario.com/ciencia/science-fest-malaga-2026-invitacion.html',
  },
  {
    id: 'n012',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'INTERNACIONAL',
    title: 'Iran obre la via diplomàtica amb els EUA set mesos després d\'iniciar-se la guerra',
    desc: 'El govern iranià dona senyals de voler negociar amb Washington tot mantenint el bloqueig militar a l\'estret d\'Ormuz, on la Guàrdia Revolucionària continua atacant embarcacions.',
    url: 'https://enperspectiva.uy/en-perspectiva-programa/noticias-del-jueves-1-de-octubre-de-2026/',
  },
  {
    id: 'n013',
    date: '2026-10-01',
    dateLabel: '10·01',
    tag: 'INTERNACIONAL',
    title: 'Israel denuncia un intent d\'atemptat en un vol de Flydubai amb destinació a Tel Aviv',
    desc: 'Un pilot va apunyalar un company a la cabina en un vol cap a Israel amb l\'aparent intenció d\'estavellar l\'aeronau. L\'avió va realitzar un aterratge d\'emergència a l\'Aràbia Saudita sense víctimes.',
    url: 'https://www.infobae.com/america/agencias/2026/10/01/jueves-1-de-octubre-de-2026-0700-gmt/',
  },
  // ── anteriors ─────────────────────────────────────────────────
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
