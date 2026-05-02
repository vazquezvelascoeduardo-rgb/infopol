// Secció de notícies de la pròpia app InfoPol.
// Contingut editorialitzat agrupat per MESOS. Cada notícia té data
// (publishedAt). El sistema agrupa automàticament per any-mes per al
// llistat.
//
// Per afegir un mes nou: afegeix entrades a NOTICIES amb publishedAt
// dins d'aquell mes. El llistat agrupa de més recent a més antic.
//
// Sistema de "no llegides" via localStorage: timestamp de la darrera
// visita; tot el que sigui posterior compta com a 'nou' al badge.
import { useEffect, useState } from 'react';

const SEEN_KEY = 'infopol-noticies-seen';

export type Noticia = {
  /** Slug URL-friendly únic. Recomanat: prefix de mes (ex. 'abr2026-...'). */
  slug: string;
  /** Títol visible. */
  title: string;
  /** Resum d'1-2 línies (preview). */
  summary: string;
  /**
   * Cos complet. Format lleuger:
   *   ## Sub-títol
   *   - element de llista
   *   > citació
   *   **negreta**
   * Línies en blanc separen blocs.
   */
  body: string;
  /** Data de publicació ISO (YYYY-MM-DD). */
  publishedAt: string;
  /** Font (BOE, DOGC, redacció pròpia, etc.). */
  source?: string;
  /** URL externa de la font (si és pública). */
  sourceUrl?: string;
  /** Etiquetes per cerca i context. */
  tags?: string[];
  /** Notícia destacada del mes (apareix amb badge a la home). */
  featured?: boolean;
  /** Enllaç a fitxa interna del temari (si remet). */
  linkedTo?: {
    moduleSlug: string;
    slug: string;
  };
};

// ════════════════════════════════════════════════════════════════════
// CONTINGUT — Ordenat de més recent a més antic
// ════════════════════════════════════════════════════════════════════

export const NOTICIES: Noticia[] = [
  // ─── ABRIL 2026 — LEGISLACIÓ ESTATAL ───────────────────────────────

  {
    slug: 'abr2026-lo-1-2026-multirreincidencia',
    title: 'LO 1/2026 de multirreincidència — endurim de hurts i estafes lleus',
    summary: "Reforma del CP i la LECrim. Computa la reincidència en delictes lleus, crea el delicte de petaqueo (art. 568.2 CP) i amplia mesures cautelars. En vigor des del 10 d'abril.",
    body: `És la reforma legislativa més important del mes. Endureix la resposta penal davant la delinqüència patrimonial reiterada de baixa intensitat (hurts i estafes lleus) i crea nous tipus delictius vinculats al narcotràfic.

## Canvis al Codi Penal

- **Reincidència (art. 22.8a)**: els antecedents per delictes lleus segueixen sense computar com a regla general, però SÍ computen als tipus agreujats per multirreincidència de delictes lleus. Les condemnes fermes en altres estats UE produeixen efectes de reincidència, llevat de cancel·lació.

- **Hurt lleu agreujat (art. 234)**: fins ara els hurts inferiors a 400 € es castigaven amb multa d'1 a 3 mesos. Amb la reforma, si l'autor ha estat condemnat almenys per tres delictes ferms del mateix títol (un de lleu), s'aplica la pena del tipus bàsic de hurt (presó de 6 a 18 mesos).

- **Hurt agreujat (art. 235)**: s'afegeixen dos supòsits nous: la sostracció de productes i instruments agrícoles o ramaders quan superi els 400 €, i la sostracció de telèfons mòbils o dispositius digitals susceptibles de contenir dades personals (excepte els exposats a comerços).

- **Estafa lleu agreujada (arts. 249 i 250)**: s'aplica la mateixa lògica que al hurt: tres condemnes fermes per defraudacions (una de lleu) obren la pena del tipus bàsic.

- **Defraudació de fluid elèctric per a narcotràfic (art. 255)**: presó de 6 a 18 mesos o multa de 12 a 24 mesos quan es destini a abastir plantacions o laboratoris de l'art. 368 CP, sense importar la quantia.

- **Nou tipus: petaqueo (art. 568.2)**: presó de 3 a 5 anys per adquirir, tenir, dipositar, emmagatzemar, transportar o subministrar combustibles líquids amb temeritat manifesta, contravenint la normativa. Dissenyat per combatre el subministrament de combustible a narcollanxes, sense necessitat de provar connexió amb un alijo concret.

## Canvis a la LECrim

- **Legitimació de les entitats locals (art. 105.3)**: els ajuntaments ja poden exercir l'acció penal per delictes de hurt del Cap. I, Tít. XIII, Llibre II del Codi Penal.

- **Mesures cautelars ampliades (art. 544 bis)**: el jutge pot prohibir motivadament a l'investigat residir o acudir a determinats llocs, barris, municipis, províncies o comunitats autònomes, a més de mesures d'aproximació o comunicació amb persones concretes.

## Disposició final

Els Tribunals Superiors de Justícia hauran de comptar, en un termini màxim de dos anys, amb almenys un jutge d'adscripció territorial per cada 100.000 habitants. Catalunya rebrà 90 jutges addicionals immediatament i altres 90 a l'any següent, per acord entre PSOE i ERC.

## Implicació operativa

> A diligències d'atestat per furt, danys o atemptat, és essencial verificar antecedents penals previs i fer-ho constar a l'atestat. Si concorre multirreincidència, la qualificació jurídica canvia (delicte lleu → menys greu).

Recomanació: incloure consulta SIPER / Mossos al moment de la detenció i annexar a l'atestat el certificat d'antecedents (o sol·licitar-lo amb caràcter d'urgència).`,
    publishedAt: '2026-04-10',
    source: 'BOE núm. 87, de 9 d\'abril de 2026 (correcció en BOE núm. 88, de 10 d\'abril). Ref. BOE-A-2026-7966',
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2026-7966',
    tags: ['legislació', 'codi penal', 'LECrim', 'multirreincidència', 'narcotràfic'],
    featured: true,
  },

  {
    slug: 'abr2026-rd-316-2026-extranjeria',
    title: 'RD 316/2026 — reforma del Reglament d\'Estrangeria amb dues figures noves d\'arrelament',
    summary: 'Modifica el RD 1155/2024 i introdueix l\'arrelament extraordinari (DA 21a) i l\'arrelament per sol·licitud prèvia de protecció internacional (DA 20a). Termini fins al 30 de juny de 2026.',
    body: `Modifica diversos articles del Reglament d'Estrangeria i introdueix dues figures noves d'arrelament per a persones estrangeres en situació irregular o a l'espera de resolució.

## Arrelament extraordinari (DA 21a)

Per a persones estrangeres que estiguessin a Espanya **abans de l'1 de gener de 2026** i acreditin algun dels supòsits següents:

- Haver treballat o tenir intenció de treballar.
- Conviure amb unitat familiar (fills menors, majors amb discapacitat o ascendents de primer grau).
- Estar en situació de vulnerabilitat acreditada.

## Arrelament per sol·licitud prèvia de protecció internacional (DA 20a)

Per a persones que van presentar sol·licitud de protecció internacional **abans de l'1 de gener de 2026**.

## Termini i efectes

> Termini comú per a ambdues figures: **fins al 30 de juny de 2026**. Des de la comunicació d'inici de la tramitació, el sol·licitant queda habilitat provisionalment per residir i treballar (per compte aliè o propi), amb termini màxim de resolució de tres mesos.

## Antecedents policials

El nou text aclareix que **l'existència d'antecedents en informe policial NO suposa automàticament denegació**: la valoració s'ha de fer cas per cas i de manera circumstanciada.

## Implicació operativa

A controls d'identificació o davant de sol·licituds d'informe per estrangeria, recordeu:

- L'antiguitat a Espanya és essencial: empadronament previ a 01/01/2026.
- Els informes han de ser objectius i circumstanciats. Evitar denegacions automàtiques per la mera existència d'antecedents.
- En cas de dubte sobre la situació administrativa, no procedir a expulsió immediata si pot estar tramitant arrelament.`,
    publishedAt: '2026-04-14',
    source: 'BOE de 14 d\'abril de 2026. Ref. BOE-A-2026-8284',
    sourceUrl: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-8284',
    tags: ['legislació', 'estrangeria', 'arrelament', 'protecció internacional'],
    featured: true,
  },

  {
    slug: 'abr2026-pacte-estat-vg-distribucio',
    title: 'Pacte d\'Estat contra la Violència de Gènere — distribució de 160 M€ per a 2026',
    summary: 'La Conferència Sectorial d\'Igualtat fixa el repartiment entre CCAA i ciutats autònomes per desenvolupar el Pacte el 2026: 150 M€ en programes operatius i 10 M€ d\'inversió.',
    body: `La Conferència Sectorial d'Igualtat, reunida el 15 d'abril de 2026, va fixar la distribució de **160 milions d'euros** entre comunitats autònomes i les ciutats de Ceuta i Melilla per al desenvolupament del Pacte d'Estat contra la Violència de Gènere durant 2026.

## Repartiment

- **150 M€** destinats a programes operatius (atenció psicològica, jurídica i social a víctimes; campanyes; formació de professionals).
- **10 M€** destinats a inversió (recursos materials, equipaments, sistemes informàtics).

## Calendari de pagaments

Els pagaments es lliuren per quartes parts a la segona quinzena de cada trimestre.

## Antecedents

L'aprovació pel Consell de Ministres es va produir el 7 d'abril de 2026 (BOE-A-2026-9355) i la Conferència Sectorial el 15 d'abril (BOE-A-2026-9514).

## Implicació per a la PL

> Diversos municipis catalans rebran fons per reforçar les unitats VioGén a les seves PL. Comprova la dotació concreta del teu municipi al portal de transparència de l'ajuntament o al BOP.

Aquesta dotació històrica reforça la xarxa de seguiment integral de víctimes de VG (Sistema VioGén del Ministeri de l'Interior), inclosa l'ampliació a noves PL (vegeu notícia separada de convenis VioGén abril 2026).`,
    publishedAt: '2026-04-15',
    source: 'BOE-A-2026-9355 i BOE-A-2026-9514',
    sourceUrl: 'https://www.boe.es',
    tags: ['legislació', 'violència de gènere', 'pacte estat', 'igualtat'],
  },

  {
    slug: 'abr2026-convenis-viogen-pl',
    title: 'Quatre convenis VioGén nous amb policies locals signats a l\'abril',
    summary: 'Jun (Granada), Castelló de la Plana, Càceres i Níjar (Almeria) incorporen les seves PL al Sistema de Seguiment Integral de víctimes de VG.',
    body: `Al llarg del mes d'abril de 2026 s'han firmat quatre convenis nous per incorporar policies locals al **Sistema VioGén** del Ministeri de l'Interior, que coordina el seguiment integral dels casos de violència de gènere amb totes les FCS implicades.

## Convenis firmats

- **14 d'abril** — Jun (Granada). Ref. BOE-A-2026-8925
- **21 d'abril** — Castelló de la Plana. Ref. BOE-A-2026-9423
- **22 d'abril** — Càceres. Ref. BOE-A-2026-9498
- **22 d'abril** — Níjar (Almeria). Ref. BOE-A-2026-9499

## Què suposa per a una PL

> Incorporar-se a VioGén dóna a la PL accés a la base de dades de casos amb valoració del risc (VPR), permet introduir actuacions pròpies (visites, controls), gestionar mesures cautelars i coordinar amb Mossos / GC / CNP. És condició necessària per a una resposta integral en VG al municipi.

## Per què és rellevant a Catalunya

Les PL catalanes que vulguin participar a VioGén han de signar conveni similar. El sistema està en expansió i és coherent amb la nota anterior sobre la dotació econòmica del Pacte d'Estat. Cada any se sumen més municipis.`,
    publishedAt: '2026-04-22',
    source: 'BOE diversos números, abril 2026',
    sourceUrl: 'https://www.boe.es',
    tags: ['violència de gènere', 'VioGén', 'convenis', 'policia local'],
  },

  // ─── ABRIL 2026 — TRÀNSIT I DGT ────────────────────────────────────

  {
    slug: 'abr2026-conduccio-acompanada-17',
    title: 'Conducció acompanyada des dels 17 anys — DGT activa la modalitat',
    summary: 'Joves a partir de 17 anys poden conduir durant el període d\'aprenentatge amb un acompanyant autoritzat. Vigent des del 20 d\'abril.',
    body: `La Direcció General de Trànsit ha activat la nova modalitat de conducció acompanyada per a joves a partir de **17 anys**, durant el període d'aprenentatge i abans d'obtenir el permís de conducció definitiu.

## Requisits clau

- **Edat mínima**: 17 anys complerts.
- **Acompanyant autoritzat**: persona amb permís B amb antiguitat mínima i sense condemnes per delictes contra la seguretat viària, registrada a la DGT com a tutor.
- **Vehicle adequat**: turismes (categoria B), amb distintiu visible que indiqui que circula en règim d'aprenentatge.
- **Període**: aprenentatge previ a l'examen pràctic.

## Què aporta a la PL

> En controls rutinaris, comprovar que el conductor de 17 anys porti el distintiu identificatiu i que l'acompanyant compleixi els requisits. La verificació es pot fer via SIPER (estat del registre d'acompanyants).

Si el menor circula sense acompanyant autoritzat o sense complir els requisits: infracció molt greu, amb les conseqüències pertinents (immobilització, denúncia al titular i al menor segons valoració).`,
    publishedAt: '2026-04-20',
    source: 'Direcció General de Trànsit',
    sourceUrl: 'https://www.dgt.es',
    tags: ['trànsit', 'DGT', 'conducció acompanyada', 'menors'],
    featured: true,
  },

  {
    slug: 'abr2026-directrius-instruccions-dgt',
    title: 'DGT — directrius i instruccions operatives d\'abril',
    summary: 'Tres documents nous que afecten l\'operativa de Trànsit: simplificació del formulari de sinistres, cobertura d\'esdeveniments esportius, i procediment de consultes sobre vehicles.',
    body: `Durant abril la DGT ha publicat tres documents operatius rellevants per a la coordinació amb les FCS i les PL.

## Directriz OBS 2026/04 — Simplificació del formulari estadístic de sinistres

A sinistres **sense víctimes**, amb danys materials i animals implicats, els camps obligatoris es redueixen a:

- Data i hora.
- Localització amb coordenades.
- Dades bàsiques de l'agent.
- Tipus i característiques del sinistre.
- Tipus d'animal implicat.

La resta passa a ser opcional, llevat d'accidents amb víctimes (on les coordenades també són obligatòries). Objectiu: reduir la càrrega administrativa mantenint la informació estadística essencial.

## Directriz MOV 2026/06 — Cobertura d'esdeveniments esportius

Estableix els criteris generals per assignar personal de l'Agrupació de Trànsit de la Guàrdia Civil al control d'activitats esportives o altres actes que requereixin limitacions a la circulació, juntament amb personal auxiliar de l'organització de l'esdeveniment.

## Instrucció VEH 2026/05 — Procediment de consultes sobre vehicles

Nou procediment per gestionar les ~5.000 consultes anuals sobre tramitació i normativa de vehicles des d'unitats perifèriques, amb criteris d'eficiència i aprofitament de sinergies.

## Implicació operativa

> Si la vostra PL fa atestats de sinistre amb animals, el formulari simplificat permet tancar la diligència més ràpid. Per a esdeveniments esportius (circuits, curses populars), coordinació amb GC d'acord amb la nova directriz.`,
    publishedAt: '2026-04-15',
    source: 'Direcció General de Trànsit — Documents interns abril 2026',
    tags: ['trànsit', 'DGT', 'directrius', 'sinistres', 'esdeveniments'],
  },

  {
    slug: 'abr2026-circuit-catalunya-mesures',
    title: 'Mesures especials de trànsit al Circuit de Catalunya',
    summary: 'La DGT activa mesures especials per regular la circulació als accessos al Circuit Barcelona-Catalunya (Montmeló) coincidint amb el calendari d\'esdeveniments esportius.',
    body: `El 22 d'abril de 2026, la DGT va activar les mesures especials per regular la circulació als accessos al Circuit de Barcelona-Catalunya (Montmeló) coincidint amb el calendari d'esdeveniments esportius.

## Què inclouen les mesures

- Tancaments parcials de carrils a la C-17 i C-35.
- Restriccions a vehicles pesants en horaris de major afluència.
- Direccions úniques temporals als accessos al circuit.
- Reforç policial (GC + Mossos + PL Montmeló, Granollers, Parets) als punts crítics.

## Implicació per a la PL

> Si la vostra PL participa en dispositius del Circuit, recordeu coordinar amb la sala 112, GC trànsit i caps de servei dels municipis veïns. Atenció a les comunicacions oficials del CCTC durant els dies d'esdeveniment.

És previsible que aquestes mesures es repeteixin a totes les grans cites del calendari del Circuit (MotoGP, F1, etc.).`,
    publishedAt: '2026-04-22',
    source: 'Direcció General de Trànsit',
    sourceUrl: 'https://www.dgt.es',
    tags: ['trànsit', 'DGT', 'Circuit Catalunya', 'Montmeló', 'esdeveniments'],
  },

  // ─── ABRIL 2026 — CATALUNYA ────────────────────────────────────────

  {
    slug: 'abr2026-apunyalament-placa-catalunya',
    title: 'Apunyalament a la Plaça Catalunya (Barcelona) reobre el debat de seguretat al centre',
    summary: 'Un home ferit per arma blanca al centre de la Plaça Catalunya, prop de Portal de l\'Àngel i Passeig de Gràcia. Hipòtesi inicial: trifulca prèvia entre un sense sostre i un ciutadà estranger. Mossos investiguen.',
    body: `Un home va resultar ferit per arma blanca el 30 d'abril de 2026 al ple centre de la Plaça Catalunya, just a les sortides del metro i als accessos a Portal de l'Àngel i Passeig de Gràcia.

## Hipòtesi inicial

La hipòtesi inicial dels Mossos d'Esquadra apunta a una **trifulca prèvia entre un sense sostre i un ciutadà estranger**. Els Mossos van sol·licitar imatges de les càmeres de l'entorn i mantenen obertes totes les hipòtesis.

## Context: Pla Endreça

> El succés ha reobert el debat sobre la presència policial a l'eix Rambla–Catalunya–Portal de l'Àngel, en el marc del Pla Endreça (impulsat per l'Ajuntament de Barcelona i Mossos per recuperar la convivència en zones turístiques).

## Implicació operativa

A serveis a zones turístiques amb concurrència alta de sense sostre, recordar:

- Davant alteracions, valorar primer si hi ha indicis penals (lesions, amenaces) abans de procedir només per ordenança cívica.
- Coordinar amb Mossos qualsevol intervenció complexa en zones d'alta afluència — la repercussió mediàtica és immediata.`,
    publishedAt: '2026-04-30',
    source: 'Premsa diversa, abril 2026',
    tags: ['catalunya', 'barcelona', 'mossos', 'arma blanca', 'pla endreça'],
    featured: true,
  },

  {
    slug: 'abr2026-rocafonda-mataro-droga',
    title: 'Operatiu antidroga conjunt Mossos + PL a Rocafonda (Mataró) acaba amb 4 detinguts',
    summary: 'Dispositiu contra el tràfic de drogues al barri de Rocafonda. Dos traficants de haixix i dos compradors detinguts; un dels compradors va agredir un agent.',
    body: `El 24 d'abril de 2026, un dispositiu conjunt de **Mossos d'Esquadra i Policia Local de Mataró** contra el tràfic de drogues al barri de Rocafonda va acabar amb quatre detinguts: dos traficants de haixix i dos compradors, un dels quals va agredir un agent durant el dispositiu.

## Detalls de l'operatiu

- **Inici**: 12:00 h a la plaça Rocafonda.
- **Modus operandi dels traficants**: ocultaven la droga a l'espai públic (sota vehicles o entre objectes urbans) per dificultar la incautació en cas d'intervenció policial.
- **Resultat**: 4 detinguts, càrrecs per tràfic de drogues (Art. 368 CP) i atemptat a agent de l'autoritat (Art. 550 CP) per al comprador agressor.

## Per què és rellevant

> Mostra l'eficàcia del treball coordinat entre Mossos i PL als barris amb problemàtica reiterada de tràfic. La PL aporta coneixement del territori i suport en operacions, sense renunciar a la competència investigadora dels Mossos.

## Implicació operativa

A barris amb problemàtica similar, és habitual l'amagatall a l'espai públic. Inspeccions periòdiques de bancs, falques de vehicles, espais sota mobiliari urbà i papereres poden servir per localitzar substàncies abans dels intercanvis.`,
    publishedAt: '2026-04-24',
    source: 'Mossos d\'Esquadra + PL Mataró',
    tags: ['catalunya', 'mataró', 'droga', 'mossos', 'policia local'],
  },

  {
    slug: 'abr2026-incident-institut-freta-mataro',
    title: 'Mossos detenen un home jove que va irrompre amb violència a l\'Institut Freta de Mataró',
    summary: 'Va intimidar alumnes menors i va bolcar una motocicleta a l\'entorn del centre. L\'alcalde David Bote apunta possibles addiccions i problemes de salut mental.',
    body: `El 29 d'abril de 2026, un home jove va irrompre a l'entorn de l'**Institut Freta** de Mataró amb actitud agressiva, va intimidar alumnes menors d'edat i va bolcar una motocicleta. Els Mossos d'Esquadra el van reduir i detenir després de diversos minuts de tensió.

## Valoració oficial

L'alcalde **David Bote** va apuntar possibles addiccions i problemes de salut mental al detingut. La Generalitat va activar suport psicològic per als alumnes afectats.

## Implicació per a la PL

> Davant intervencions amb persones amb sospita de salut mental, recordar:
>
> - Coordinació immediata amb el SEM (061) i, si escau, sol·licitar intervenció del CSMA (Centre de Salut Mental d'Adults).
> - Internament involuntari urgent: art. 763 LEC permet la mesura urgent amb posterior comunicació al jutjat (24-72h).
> - Informe pericial de l'estat psíquic és essencial per a la possible declaració d'inimputabilitat (art. 20.1 CP).

A entorns escolars, la prioritat és l'evacuació segura dels menors abans de la reducció.`,
    publishedAt: '2026-04-29',
    source: 'Premsa diversa, abril 2026',
    tags: ['catalunya', 'mataró', 'mossos', 'salut mental', 'institut'],
  },

  {
    slug: 'abr2026-pla-inuncat-revisat',
    title: 'Plan INUNCAT — revisió aprovada pel Govern de la Generalitat',
    summary: 'Acord GOV/65/2026, de 24 de març (publicat a l\'abril). Reforça la coordinació, sistemes de previsió i mesures municipals davant emergències per inundacions.',
    body: `El Govern de la Generalitat va aprovar la revisió del **Pla especial d'emergències per inundacions de Catalunya (INUNCAT)** per acord GOV/65/2026, de 24 de març, publicat a l'abril.

## Per què la revisió

La revisió es justifica per **l'evolució del risc**, agreujat pel canvi climàtic i la major freqüència de fenòmens meteorològics extrems (DANES, episodis convectius, pluges torrencials).

## Què canvia

- **Reforç de la coordinació** entre Generalitat, ens locals, FCS i Bombers de la Generalitat.
- **Millora dels sistemes de previsió hidrometeorològica** (model Meteocat-INUNCAT).
- **Ampliació dels instruments d'alerta a la població** (ES-Alert, panells variables).
- **Incorporació estructurada de la fase de rehabilitació** (no només prevenció i resposta).
- **Concreció de mesures municipals** en episodis de risc o emergència imminent.

## Implicació per a la PL

> Cada PL d'un municipi de risc d'inundació ha de revisar el pla d'autoprotecció i el rol assignat al consistori dins del INUNCAT. Tenir actualitzats els protocols d'evacuació i identificades les zones inundables.

Vol una bona pràctica? Fer simulacre amb Bombers, Protecció Civil i Mossos abans de l'inici de la temporada (octubre-novembre).`,
    publishedAt: '2026-04-15',
    source: 'Acord GOV/65/2026, DOGC',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'protecció civil', 'INUNCAT', 'inundacions', 'emergències'],
  },

  {
    slug: 'abr2026-decret-llei-4-2026-dependencia',
    title: 'Decret llei 4/2026 — tramitació abreujada de prestacions per dependència extrema',
    summary: 'Per a persones amb potencial grau III+ de dependència segons criteri clínic. Efectes retroactius des de l\'1 de maig de 2026 i 6 mesos per començar a abonar.',
    body: `El 28 d'abril de 2026, el Govern va aprovar el **Decret llei 4/2026 de mesures urgents en dependència** (DOGC núm. 9655, de 29 d'abril). Vigent des del 30 d'abril.

## Què introdueix

- **Tramitació abreujada** de les prestacions per a persones amb potencial **grau III+** de dependència extrema, segons criteri clínic.
- **Efectes retroactius** des de l'1 de maig de 2026.
- **Termini màxim** de sis mesos per començar a abonar les prestacions.

## Per què

Respon a la **saturació estructural** dels serveis socials i els equips de valoració de la dependència, amb llistes d'espera de mesos o anys per a casos crítics.

## Implicació per a la PL

> Tot i que la PL no participa directament en la valoració de la dependència, sí que pot ser la primera porta d'entrada en intervencions amb persones grans soles, persones amb discapacitat severa o famílies amb risc social.
>
> Recordeu derivar a serveis socials municipals quan detecteu una situació de dependència no atesa, especialment si és greu (impossibilitat de mobilitat, abandonament, persona vivint sola en condicions inadequades).`,
    publishedAt: '2026-04-29',
    source: 'DOGC núm. 9655, de 29 d\'abril de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'serveis socials', 'dependència', 'decret llei'],
  },

  {
    slug: 'abr2026-oferta-publica-mossos-2026',
    title: 'Oferta pública 2026: 1.604 places de Mossos d\'Esquadra (escala bàsica)',
    summary: 'La Generalitat aprova OOP 2026 amb 8.474 places totals: 1.604 Mossos, 23 Bombers, 12 Agents Rurals i 174 d\'Execució Penal.',
    body: `La Generalitat ha aprovat l'oferta d'ocupació pública per al 2026, amb un total de **8.474 places**.

## Distribució de places de seguretat i emergències

- **Mossos d'Esquadra**: **1.604 places** (escala bàsica). Supera les 1.587 de la convocatòria anterior.
- **Bombers de la Generalitat**: 23 places.
- **Agents Rurals**: 12 places.
- **Execució Penal**: 174 places.

## Calendari orientatiu

Les bases definitives es publiquen al DOGC. Procés selectiu Mossos típic: prova teòrica, cas pràctic, prova física, prova mèdica i psicotècnica, entrevista, formació a l'ISPC (~9 mesos).

## Ratio històrica

> La ratio històrica per a Mossos se situa al voltant de **9 aspirants per plaça**. Per comparativa: oposicions de PL més competitives (Barcelona, Terrassa) ronden els 30+ aspirants/plaça.

## Per qui prepara

L'aplicació InfoPol té tests d'oposició del temari oficial (CE78, EAC, LOPSC, LOFCS, CP, LECrim, LOSSP, LPC, etc.). El sistema de repàs de fallades amb mètode Anki et facilita el manteniment del que ja saps.`,
    publishedAt: '2026-04-30',
    source: 'Generalitat de Catalunya — DOGC',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'oposicions', 'mossos d\'esquadra', 'bombers', 'agents rurals'],
    featured: true,
  },

  // ─── ABRIL 2026 — PREMIS I RECONEIXEMENTS ──────────────────────────

  {
    slug: 'abr2026-ix-premio-novela-policia',
    title: 'IX Premi de Novel·la Policia Nacional 2026 — convocatòria oberta',
    summary: 'Fundació Policia Espanyola + Editorial Planeta. Dotat amb 20.000 €. Termini fins al 15 de juny de 2026.',
    body: `La Fundació Policia Espanyola, conjuntament amb Editorial Planeta, convoca el **IX Premi de Novel·la Policia Nacional 2026**.

## Bases

- **Dotació**: 20.000 €.
- **Termini**: fins al 15 de juny de 2026, 23:59 h.
- **Modalitat**: novel·la negra, policíaca o criminal.
- **Requisits**: obres originals, inèdites, escrites en castellà.
- **Extensió mínima**: 250.000 caràcters.
- **Participants**: oberta a qualsevol nacionalitat major d'edat.
- **Fall**: novembre de 2026 (Madrid).

## Web oficial

[premionovelapolicianacional.com](http://premionovelapolicianacional.com)`,
    publishedAt: '2026-04-15',
    source: 'Fundació Policia Espanyola',
    tags: ['premis', 'fundació policia', 'novel·la policíaca', 'cultura'],
  },

  {
    slug: 'abr2026-premis-investigacio-fpe',
    title: 'Premis d\'Investigació de la Fundació Policia Espanyola 2025 — fallo durant 2026',
    summary: 'Plaç tancat el 30 de març de 2026. Reconeixen treballs de recerca en ciència policial, seguretat pública i privada.',
    body: `Els **Premis d'Investigació de la Fundació Policia Espanyola 2025** van tancar el termini de presentació el 30 de març de 2026. El fallo es produirà durant 2026.

## Què reconeixen

Treballs d'investigació en:

- Ciència policial.
- Seguretat pública.
- Seguretat privada.

## Publicació

Les obres premiades poden ser publicades a la revista científica **Ciencia Policial**, referent del sector.

## Per què interessa a opositors i agents en actiu

> Una bona forma de promoció professional és publicar treballs propis. Per a opositors: trobar publicacions recents pot donar-los avantatge en el cas pràctic. Per a agents en actiu: és un canal per visibilitzar bones pràctiques.`,
    publishedAt: '2026-04-01',
    source: 'Fundació Policia Espanyola',
    tags: ['premis', 'fundació policia', 'investigació', 'ciència policial'],
  },

  {
    slug: 'abr2026-sant-jordi-policia',
    title: 'Sant Jordi 2026 — la Policia Nacional fa parada literària a Barcelona',
    summary: 'La Policia Nacional i la Fundació Policia Espanyola van instal·lar una parada al carrer Mallorca de la Rambla de Catalunya durant la diada.',
    body: `El 23 d'abril de 2026, **diada de Sant Jordi**, la Policia Nacional i la Fundació Policia Espanyola van instal·lar una parada literària al carrer Mallorca de la Rambla de Catalunya.

## Què s'hi exposava

- Llibres editats per la Fundació Policia Espanyola.
- Obres guanyadores de premis literaris policials.
- Material divulgatiu sobre el cos i la prevenció del delicte.

## Per què és destacable

> Acció de visibilitat ciutadana en una de les jornades culturals més significatives de Catalunya. Reforça la connexió de la Policia Nacional amb la societat civil i la cultura.

Iniciativa similar a les que fan altres cossos a esdeveniments populars (jornades de portes obertes, fires del llibre, etc.).`,
    publishedAt: '2026-04-23',
    source: 'Premsa diversa, abril 2026',
    tags: ['barcelona', 'sant jordi', 'policia nacional', 'cultura'],
  },

  // ─── ABRIL 2026 — INTERNACIONAL ────────────────────────────────────

  {
    slug: 'abr2026-bloqueig-ormuz',
    title: 'Bloqueig de l\'estret d\'Ormuz tensiona el preu del cru',
    summary: 'Tot i l\'alto el foc, EUA i Iran segueixen enfrontats pel control d\'Ormuz, ruta del 20% del comerç mundial de petroli i gas. Brent ~109 USD i WTI ~111 USD.',
    body: `Tot i l'alto el foc declarat, **EUA i Iran segueixen enfrontats pel control de l'estret d'Ormuz**, ruta clau per la qual transita aproximadament el 20% del comerç mundial de petroli i gas.

## Impacte als preus

- Brent: ~**109 USD/barril**.
- WTI: ~**111 USD/barril**.
- Pressió alcista al gas natural i derivats.

## Amenaces creuades

Trump va amenaçar amb atacar centrals elèctriques iranianes si Teheran no reobria l'estret. Iran manté el bloqueig parcial i exigeix garanties.

## Implicació indirecta a Espanya

> Encara que sembli geopolítica llunyana, l'impacte arriba al pump: els preus del combustible van pujar entre el 8 i el 12% al mes d'abril. Això pot incrementar tensions a l'àmbit local (transport pesat, taxis, emergències).`,
    publishedAt: '2026-04-25',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'EUA', 'Iran', 'petroli', 'energia'],
  },

  {
    slug: 'abr2026-libano-israel-iran',
    title: 'Atacs creuats Líban / Israel / Iran als primers dies d\'abril',
    summary: 'Israel ataca Beirut i zona Toul; Iran respon amb míssils sobre Tel Aviv i Haifa. Mort el general Majid Khademi (Intel·ligència de la Guàrdia Revolucionària).',
    body: `Als primers dies d'abril de 2026 es van produir atacs creuats entre Israel, Iran i el Líban.

## Atacs israelians

- **Beirut**: barris de Jnah i Ain Saade. ~10 morts i desenes de ferits.
- **Zona de Toul** (Líban).

## Resposta iraniana

- **Tel Aviv**: escola Beit Ya'akov.
- **Haifa**: edifici residencial.

## Baixa significativa

Va ser abatut el major general **Majid Khademi**, cap d'Intel·ligència del Cos de la Guàrdia Revolucionària Islàmica iraniana.

## Context

Hezbol·lah va implicar el Líban al conflicte després de la mort del líder suprem iranià Alí Khamenei en atacs previs d'EUA i Israel.

## Implicació indirecta a Espanya

> Conflicte a Orient Mitjà sol generar tensions internes per la diàspora i la mobilitat de nacionalitats afectades. Vigilància reforçada a llocs sensibles (sinagogues, mesquites, ambaixades) per part de FCS.`,
    publishedAt: '2026-04-08',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'Israel', 'Iran', 'Líban', 'Orient Mitjà'],
  },

  {
    slug: 'abr2026-jardinero-cjng',
    title: 'Detingut "el Jardinero", postulat per succeir "El Mencho" al CJNG',
    summary: 'Audias Flores Silva, ex cap de seguretat del líder històric del Cártel Jalisco Nueva Generación, detingut a Mèxic. El cártel opera a 100 països, incloent Espanya.',
    body: `Detingut **Audias Flores Silva, "el Jardinero"**, ex cap de seguretat de **"El Mencho"** (líder històric del Cártel Jalisco Nueva Generación, abatut el febrer de 2026).

## Importància estratègica

- Era el postulat per succeir-lo al capdavant del cártel.
- El CJNG opera a aproximadament **100 països**, incloent **Espanya**.
- Implicat en tràfic de fentanil, metamfetamina i cocaïna a escala global.

## Implicació a Espanya

> El CJNG té cèl·lules conegudes a la costa mediterrània i al Llevant. La detenció pot generar reorganitzacions internes i nous noms emergents al sector. Coordinació amb DEA, EUROPOL i Mossos GIE.`,
    publishedAt: '2026-04-12',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'Mèxic', 'narcotràfic', 'CJNG'],
  },

  {
    slug: 'abr2026-australia-judici-taylor-swift',
    title: 'Austràlia — inici del judici per l\'atac a un concert de Taylor Swift',
    summary: 'Cas de referència internacional sobre seguretat en esdeveniments massius.',
    body: `S'ha iniciat a Austràlia el judici contra l'acusat d'un atac en un concert de Taylor Swift. Cas de referència internacional sobre la **seguretat en esdeveniments massius**.

## Per què és rellevant per a la PL

> Els municipis amb gran capacitat per a esdeveniments musicals (Barcelona, Madrid, València, Sevilla, Bilbao) extreuen lliçons d'aquest tipus de successos:
>
> - Reforç dels controls d'accés (perimetre, escorcoll, detectors).
> - Coordinació amb els equips de seguretat privada.
> - Protocols d'evacuació en cas d'emergència.
> - Pla de comunicació amb el públic.

Aquest cas servirà també per refinar protocols a nivell europeu (UE-EUROPOL).`,
    publishedAt: '2026-04-18',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'Austràlia', 'seguretat esdeveniments'],
  },

  {
    slug: 'abr2026-londres-apunyalament-antisemita',
    title: 'Londres — vídeo de la detenció del sospitós d\'apunyalar dues persones jueves',
    summary: 'La policia londinenca difon imatges del cas, vinculat al context de tensió per Orient Mitjà.',
    body: `La policia metropolitana de Londres va difondre el vídeo de la detenció del sospitós d'**apunyalar dues persones jueves** a la capital britànica.

## Context

Cas vinculat al **context de tensió derivada del conflicte a Orient Mitjà**. La policia britànica ha reforçat la vigilància a sinagogues, escoles jueves i comerços d'aquesta comunitat.

## Implicació a Espanya

> Atemptats antisemites o islamòfobs solen produir efectes mimètics. Vigilància reforçada a Catalunya (sinagogues a Barcelona, mesquites a Badalona, Girona, Lleida) i coordinació amb Mossos per detecció de patrons.`,
    publishedAt: '2026-04-20',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'Regne Unit', 'Londres', 'odi', 'antisemitisme'],
  },

  {
    slug: 'abr2026-colombia-atemptats-electorals',
    title: 'Colòmbia — diversos atemptats durant la campanya electoral',
    summary: 'El president Gustavo Petro vincula els fets a un intent de sabotatge a les eleccions.',
    body: `Diversos atemptats durant la campanya electoral colombiana. El **president Gustavo Petro** ha vinculat els fets a un intent de sabotatge a les eleccions.

## Context

Colòmbia està en un cicle electoral complex amb tensions socials i activitat de grups armats al territori. El procés electoral està sota observació internacional.

## Implicació indirecta

> La diàspora colombiana a Espanya és nombrosa (especialment a Madrid, Barcelona i Sevilla). Els processos electorals colombians solen generar mobilitzacions a l'estranger; previsió de concentracions a consolats colombians durant la campanya.`,
    publishedAt: '2026-04-22',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'Colòmbia', 'eleccions'],
  },

  {
    slug: 'abr2026-peru-segona-volta',
    title: 'Perú — eleccions presidencials a segona volta',
    summary: 'Es decidirà entre els dos candidats més votats. Tensió política i social a la capital.',
    body: `Les eleccions presidencials peruanes es decidiran en una **segona volta entre els dos candidats més votats**. Tensió política i social a Lima i a les regions andines.

## Context

Perú porta anys d'inestabilitat política, amb diverses presidències interrompudes. La segona volta és crítica per a la governabilitat futura del país.

## Implicació indirecta

> Diàspora peruana a Espanya: la majoria a Madrid, però també nuclis significatius a Catalunya. Possibles concentracions als consolats peruans durant la segona volta.`,
    publishedAt: '2026-04-26',
    source: 'Premsa internacional, abril 2026',
    tags: ['internacional', 'Perú', 'eleccions'],
  },

  {
    slug: 'abr2026-amnistia-internacional-2026',
    title: 'Informe Amnistia Internacional 2026 — drets humans en 144 països',
    summary: 'Identifica com a tendències: conflictes armats, repressió de la dissidència, discriminació, injustícia econòmica i climàtica, cessament d\'ajuda humanitària i ús indegut de la tecnologia.',
    body: `Publicat a l'abril, l'informe anual *La situació dels drets humans al món* d'**Amnistia Internacional** documenta motius de preocupació en **144 països** durant 2025.

## Tendències identificades

- **Conflictes armats** (Ucraïna, Orient Mitjà, Sahel).
- **Repressió de la dissidència** (Iran, Rússia, Bielorússia, Nicaragua).
- **Discriminació** (LGBT+, dones, minories ètniques i religioses).
- **Injustícia econòmica i climàtica**.
- **Cessament abrupte de l'ajuda humanitària** (USAID retirats per Trump 2.0).
- **Ús indegut de la tecnologia** (vigilància estatal, IA per a control social).

## Implicació institucional

> Espanya apareix valorada en termes globalment positius però amb crítiques específiques: ús de pilotes de goma, Llei Mordassa, situació de migrants a la frontera sud, gestió a Ceuta i Melilla.

L'informe és material de referència per a opositors a FCS (especialment Mossos i CNP, que tenen mòduls de DDHH al temari).`,
    publishedAt: '2026-04-28',
    source: 'Amnistia Internacional, informe 2026',
    sourceUrl: 'https://www.amnesty.org',
    tags: ['internacional', 'drets humans', 'amnistia internacional'],
  },
];

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════

export function getNoticia(slug: string): Noticia | undefined {
  return NOTICIES.find((n) => n.slug === slug);
}

export function getFeaturedNoticies(): Noticia[] {
  return NOTICIES.filter((n) => n.featured);
}

/** "2026-04-15" → "2026-04". Per agrupar per mes. */
export function getMonthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** "2026-04" → "Abril 2026" (segons locale). */
export function getMonthLabel(monthKey: string, locale: 'es' | 'ca'): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  if (isNaN(year) || isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) {
    return monthKey;
  }
  const months = locale === 'ca'
    ? ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre']
    : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${months[monthIdx]} ${year}`;
}

/**
 * Agrupa notícies per mes (key 'YYYY-MM'). Retorna llista ordenada
 * de més recent a més antic.
 */
export function groupByMonth(items: Noticia[]): Array<{ key: string; items: Noticia[] }> {
  const groups = new Map<string, Noticia[]>();
  for (const n of items) {
    const k = getMonthKey(n.publishedAt);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(n);
  }
  // Ordenem cada grup per data desc
  for (const arr of groups.values()) {
    arr.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  // Retornem grups ordenats per clau (mes) desc
  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => ({ key, items }));
}

// ════════════════════════════════════════════════════════════════════
// SISTEMA DE 'NO LLEGIDES' (badge)
// ════════════════════════════════════════════════════════════════════

function getLastSeen(): number {
  if (typeof window === 'undefined') return Date.now();
  try {
    const v = window.localStorage.getItem(SEEN_KEY);
    if (!v) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

function setLastSeen(ts: number) {
  try {
    window.localStorage.setItem(SEEN_KEY, String(ts));
    window.dispatchEvent(new StorageEvent('storage', { key: SEEN_KEY }));
  } catch { /* silent */ }
}

export function useUnreadNoticiesCount(): number {
  const [count, setCount] = useState<number>(() => {
    const lastSeen = getLastSeen();
    return NOTICIES.filter((n) => new Date(n.publishedAt).getTime() > lastSeen).length;
  });

  useEffect(() => {
    function sync() {
      const lastSeen = getLastSeen();
      setCount(NOTICIES.filter((n) => new Date(n.publishedAt).getTime() > lastSeen).length);
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return count;
}

export function markNoticiesSeen() {
  setLastSeen(Date.now());
}
