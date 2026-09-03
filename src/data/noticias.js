// Notícies InfoPol — actualitzades diàriament
// Format: { id, date ('MM·DD'), cat, catToken, title, desc, link }

export const NOTICIAS = [
  // ── 3 de setembre de 2026 ─────────────────────────────────────────
  {
    id: 20260903_001,
    date: '09·03',
    cat: 'Política',
    catToken: 'operativa',
    title: 'Sánchez compareix al Congrés per la crisi migratòria de Ceuta',
    desc: 'El president del Govern defensa la seva gestió i proposa reconèixer Ceuta i Melilla com a regions ultraperifèriques de la UE. Milers de persones es manifesten a Madrid en suport a la ciutat autònoma.',
    link: 'https://www.infobae.com/espana/2026/09/03/comparecencia-de-pedro-sanchez-sobre-la-crisis-de-ceuta-y-el-papel-de-marruecos-en-directo/',
  },
  {
    id: 20260903_002,
    date: '09·03',
    cat: 'Succès',
    catToken: 'alcohol',
    title: 'Més de 80 morts en un caiac a la deriva al sud de Canàries',
    desc: 'Una embarcació sortida de Gàmbia el 7 d\'agost amb 128 persones va ser rescatada quan portava 26 dies a la deriva. Entre les víctimes, tres dones i una bebè. Els supervivents reben atenció de la Creu Roja a Arguineguín.',
    link: 'https://es.euronews.com/my-europe/2026/09/03/mueren-80-inmigrantes-cayuco-sur-canarias-llevaba-26-dias-deriva',
  },
  {
    id: 20260903_003,
    date: '09·03',
    cat: 'Internacional',
    catToken: 'atajos',
    title: 'Inundacions Nepal-Tibet: més d\'1.100 morts i 5.000 desapareguts',
    desc: 'Les riuades originades per un col·lapse glacial al Langtang Lirung han devastat 72 km del riu Trishuli. El desastre s\'estén fins a l\'Índia, on han arribat cossos arrossegats 240 km riu avall.',
    link: 'https://www.aljazeera.com/news/liveblog/2026/9/1/nepal-tibet-floods-live-rescue-efforts-under-way-death-toll-crosses-1000',
  },
  {
    id: 20260903_004,
    date: '09·03',
    cat: 'Política',
    catToken: 'operativa',
    title: 'CEO: Aliança Catalana s\'enlaira i enfonsa Junts — el PSC resisteix',
    desc: 'El primer baròmetre de 2026 del Centre d\'Estudis d\'Opinió dibuixa un nou escenari: Aliança Catalana passaria de 2 a 23-25 escons i Junts cau de 35 a 16-18. El PSC guanyaria amb 36-38 diputats.',
    link: 'https://www.cope.es/emisoras/catalunya/noticias/ceo-dibuja-nuevo-escenario-politico-psc-pierde-fuelle-alianca-catalana-dispara-hunde-junts-20260709_3401900.html',
  },
  {
    id: 20260903_005,
    date: '09·03',
    cat: 'Cultura',
    catToken: 'psico',
    title: 'Els Premis Joventut arriben per primera vegada a Europa amb una gala a Starlite Marbella',
    desc: 'La cerimònia reuneix més de 250 artistes —Quevedo, Camilo, Manuel Carrasco, Marc Anthony i Ana Mena— en el nou format PJ Fest que s\'estén tota una setmana i connecta Marbella amb Miami i Los Angeles.',
    link: 'https://www.elespanol.com/malaga/cultura/20260903/marbella-hace-historia-premios-juventud-toman-starlite-artistas-quevedo-camilo-ana-mena/1003744369796_0.html',
  },
  {
    id: 20260903_006,
    date: '09·03',
    cat: 'Internacional',
    catToken: 'atajos',
    title: '180.000 africans expulsats de Sud-àfrica per xenofòbia tornen sense feina ni béns',
    desc: 'La majoria dels repatriats retornen als seus països en condicions precàries, amb les famílies separades i sense recursos econòmics, enmig d\'un repunt de la violència xenòfoba a Sud-àfrica.',
    link: 'https://www.infobae.com/america/agencias/2026/09/03/temas-del-dia-de-efe-internacional-del-jueves-3-de-septiembre-2026-1200-gmt/',
  },
  {
    id: 20260903_007,
    date: '09·03',
    cat: 'Economia',
    catToken: 'leyes',
    title: 'Consell de Política Fiscal aprova la reforma del model de finançament entre tensions',
    desc: 'La reunió arriba marcada pel rebuig de les comunitats del PP i l\'absència de Madrid. El Govern defensa la proposta que canviaria la distribució de recursos entre territoris.',
    link: 'https://www.infobae.com/espana/agencias/2026/09/02/temas-del-dia-de-efe-espana-del-jueves-3-de-septiembre-2026/',
  },
];

export const NOTICIAS_BY_DATE = NOTICIAS.reduce((acc, n) => {
  if (!acc[n.date]) acc[n.date] = [];
  acc[n.date].push(n);
  return acc;
}, {});
