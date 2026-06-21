// Esquemes detallats de Mossos (format temari jeràrquic).
// Substitueixen el format "esquema ràpid" visual. Cada entrada és un tema
// amb el cos en Markdown (## seccions, ### subapartats, dades clau en negreta).
// Contingut proporcionat per l'usuari; només es reestructura i es neteja.
export type EsquemaDetall = {
  slug: string;          // route param a /mossos/esquemes/:slug
  ambit: 'A' | 'B' | 'C';
  codi: string;          // 'A.6'
  title: string;
  subtitle?: string;
  temariSlug?: string;   // per enllaçar al tema complet del temari
  md: string;            // cos en Markdown
};

const A6 = `## 1. La migració a Catalunya i els fluxos migratoris

### a) Les migracions contemporànies

Els factors rellevants que generen diferències entre els hàbitats d'una societat són: **gènere, religió, ètnia, classe social**, etc.

Segons l'**ONU**, el **2020** uns **272 milions** de persones havien migrat del seu territori d'origen (més del **3% de la població mundial**), entre altres motius per aconseguir millors oportunitats al país de destinació. Segons l'**ACNUR**, més de **89,3 milions** de persones han perdut la seva llar a causa de la violència.

La **globalització** és un dels fenòmens econòmics i socials més destacables del món actual: desplaçament internacional constant de mercaderies, capitals i persones, a distàncies cada cop més llargues i en temps cada cop més curts.

Durant els últims 40 anys s'han consolidat noves pautes migratòries internacionals. Del fenomen migratori contemporani en destaquen **3 dimensions**:

1. Creixement o manteniment del volum de migrants (fenomen permanent).
2. Ampliació de xarxes i cadenes migratòries (dominen les sud-nord i transoceàniques; recentment, també les est-oest).
3. Diversitat de tipus migratoris (raons econòmiques, polítiques i socials).

### b) La immigració a Espanya i a Catalunya

A Espanya, **8 de cada 10** estrangers disposen de targeta de residència permanent, a més dels que ja han obtingut la nacionalitat; això l'ha convertit en un important centre de recepció d'immigració.

La **nacionalitat per residència** és la via de naturalització de la població estrangera (per acumulació d'anys):

- **10 anys** per norma general.
- **5 anys** per als refugiats.
- **2 anys** per a iberoamericans, filipins, equatoguineans, portuguesos i sefardites.

Els estrangers residents regularitzats a Espanya són el **12,25%** del total de la població (Ministeri d'Inclusió, Seguretat Social i Migracions + Observatori Permanent de la Immigració).

Espanya (i especialment Catalunya) es van convertir en receptors d'immigració internacional per **2 factors**:

1. Ràpid creixement econòmic durant els anys 90 i principis del s. XXI, amb mercats de treball molt diferenciats.
2. Realitat demogràfica d'Espanya i Catalunya en procés d'envelliment.

Canvis en els corrents migratoris cap a Espanya i Catalunya:

1. Augment de la immigració europea comunitària davant de l'extracomunitària.
2. Immigració heterogènia: la majoria ve d'**Amèrica Llatina i Europa**; l'**Àfrica** queda en 3r lloc (el **72% ve del Marroc**); d'**Àsia**, la majoria ve de la **Xina**. Però els estrangers amb més presència a Espanya provenen de **Romania, el Marroc i el Regne Unit**.
3. Dues grans modalitats: **immigració econòmica i laboral** (de països andins d'Amèrica, Àfrica, Europa de l'Est i Àsia; emigren en xarxes familiars i de suport) i **immigració de països desenvolupats** (jubilats, estudiants; sectors d'alta qualificació).
4. Immigració estable i permanent (de llarga durada).

**Destinacions preferents** de la immigració estrangera: **Catalunya, Madrid i la Comunitat Valenciana** (6 de cada 10 estrangers).

### c) La dinàmica migratòria i l'evolució de la població catalana

La migració és el factor que més ha condicionat l'evolució de la població de Catalunya. Dels corrents que més l'han afectat l'últim segle (fins als anys 70), els més importants són els procedents de **regions d'Espanya** (el **18%** dels habitants de Catalunya no han nascut a Catalunya).

Va ser durant els anys 90 que hi va haver una forta recepció d'immigració estrangera, amb un **doble flux**:

1. Procedent de països europeus comunitaris (**23,1%** dels estrangers).
2. Procedent de països extracomunitaris (Àfrica i Llatinoamèrica).

Estrangers amb més presència a Catalunya, per ordre: **marroquins (19%)**, romanesos, italians i xinesos; després pakistanesos, hondurenys, colombians i francesos. Segons dades de 2015, a Catalunya hi conviuen gairebé **200 nacionalitats**.

Diversitat demogràfica:

- Immigració **pakistanesa** bàsicament masculina (**70,6%**).
- Immigració **boliviana** femenina (**59,6%**).
- Immigració **xinesa** equilibrada (migració familiar).

Les principals àrees receptores coincideixen amb la distribució general de la població: l'eix litoral i l'entorn metropolità, amb **Barcelona** al capdavant (**21,28%** de la població estrangera resident, **348.302** persones); l'àmbit metropolità concentra el **61,56%** dels estrangers de Catalunya. Alguns nuclis menors destaquen: **Castelló d'Empúries (43,54%)** i **Guissona (52,61%)** de població nascuda a l'estranger.

## 2. Les polítiques públiques en matèria d'immigració

### a) Política migratòria comunitària

La politització de la immigració a la UE creix. El control de fluxos és més restrictiu amb els estrangers de països no comunitaris. L'estrangeria a la UE es divideix en **2 categories**:

1. **Estrangers comunitaris**: gràcies al **Tractat d'Amsterdam (1999)** poden moure's, treballar i residir a qualsevol país de la UE amb requisits només burocràtics (amplis drets laborals, socials i polítics).
2. **Estrangers no comunitaris (tercers països)**: drets i possibilitats més limitades i més rigidesa per mantenir-se al país; l'entrada restringida afavoreix l'entrada clandestina.

Legislació europea:

- **Pacte Europeu sobre Immigració i Asil (2009)**: limitar el nivell d'immigració a les necessitats del mercat laboral.
- **Directiva 2011/95/UE**: motius per atorgar la protecció internacional; defineix qui és refugiat i què implica ser-ho.

### b) Política migratòria d'Espanya i Catalunya

**Espanya:**

1. **LO 8/2000**, sobre drets i llibertats dels estrangers a Espanya i la seva integració social.
2. **Llei 12/2009, de 30 d'octubre**, reguladora del dret d'asil i de la protecció subsidiària.
3. **2011**: reglament dels règims d'entrada, sortida i estada dels estrangers.

**Catalunya:**

1. **1993**: Pla interdepartamental d'immigració.
2. **2008**: Pacte Nacional per a la Immigració i creació de la **Taula de Ciutadania i Immigració** (consulta i participació).
3. **Llei 10/2010, de 7 de maig**, d'acollida de les persones immigrades i retornades a Catalunya.
4. **Decret 150/2014**, dels serveis d'acollida.
5. **2014**: Pla de ciutadania i migracions horitzó 2016.
6. **Pla de ciutadania i de les migracions 2017-2020**.

## 3. Models d'integració i marcs de convivència en la societat multicultural

L'afluència migratòria pot tenir implicacions per a (1) la societat receptora i (2) els col·lectius immigrants. Hi ha **3 models teòrics**:

1. **Assimilació** — l'immigrant s'adequa a la societat receptora i n'adquireix la cultura majoritària; pressuposa que, adoptant la nova cultura, serà admès com un membre més, i que l'aculturació reduiria la discriminació. *Crítica:* no permet mantenir la identitat cultural pròpia.
2. **Melting pot (gresol cultural)** — fusió d'elements culturals i identitats en una nova cultura general construïda des de zero; harmonització de cultures per fomentar la pertinença. *Crítica:* no permet mantenir la identitat cultural pròpia.
3. **Pluralisme cultural** — ni natius ni immigrants volen perdre la identitat; l'adaptació es fa creant principis comuns de convivència, mantenint les peculiaritats a l'esfera privada. *Crítica:* pot fomentar la fragmentació.

## 4. Polítiques públiques en matèria d'igualtat d'oportunitats

Les **polítiques públiques** són decisions dels òrgans de govern (normes, disposicions, estratègies, plans...). Tenen per objecte:

1. Determinar les actuacions que el govern planifica o executa en una matèria.
2. Proposar modificacions o innovacions normatives.

Les polítiques d'**igualtat d'oportunitats** estudien quines mesures han de prendre les institucions per resoldre les desigualtats entre homes i dones (àmbits polític, econòmic, social i cultural).

A **Espanya**: **Llei 3/2007, de 22 de març**, per a la igualtat efectiva entre dones i homes (regulació específica de les diferents manifestacions de discriminació).

A **Catalunya**, es desenvolupen mitjançant plans plurianuals conjunts dels departaments de la Generalitat:

- **EAC, article 41**: obligació dels poders públics de garantir el principi d'igualtat d'oportunitats entre homes i dones (igualtat real i efectiva).
- **Llei 8/2006, de 5 de juliol**, de mesures de conciliació de la vida personal, familiar i laboral del personal de les administracions públiques de Catalunya.
- Permís de l'altre progenitor: **16 setmanes** (abans 12) des de l'**1 de gener de 2021**.
- **Llei 5/2008, de 24 d'abril**, del dret de les dones a eradicar la violència masclista.
- **Llei 17/2015, de 8 de juliol**, d'igualtat efectiva de dones i homes (primera llei catalana d'igualtat).
- **1989**: creació de l'**Institut Català de les Dones**.

Plans:

- **1r Pla** d'igualtat d'oportunitats entre homes i dones: **1989-1992**.
- **Pla estratègic de polítiques de dones 2012-2015**.
- **Pla estratègic de polítiques d'igualtat de gènere 2019-2022** (vigent): objectius i mesures transversals per garantir l'equitat de gènere a l'Administració de la Generalitat.

## 5. Els serveis socials a Catalunya

### a) L'Estat del benestar i la provisió de serveis

**Estat del benestar:** el govern intervé en la societat i l'economia per proveir i mantenir el benestar del conjunt de la població; conjunt de polítiques per millorar les condicions de vida i assegurar la igualtat d'oportunitats. **4 grans dimensions:**

1. Les transferències socials (pensions, subsidi d'atur...).
2. Els serveis (educació, sanitat, ajuda a la família...).
3. Les intervencions normatives (seguretat del treballador, consumidor i medi ambient).
4. Les intervencions per estimular i garantir la creació d'ocupació.

### b) Els serveis socials

Integrats pels serveis de titularitat pública i privada de la Generalitat, les entitats locals i altres administracions. El sistema català de serveis socials és un recurs a l'abast de tota la ciutadania (informació, valoració, diagnòstic...) per fer front i prevenir situacions de necessitat personal bàsica, manca de cohesió social o familiar, o desigualtat. S'estructura en **2 grans famílies**:

1. **Atenció primària** — la més propera a la ciutadania (treballadors socials, educadors, treballadors familiars; atenció domiciliària, menjadors socials...).
2. **Atenció especialitzada** — necessitats que no es poden atendre a la xarxa bàsica, per a grups específics (gent gran, drogodependents, infants...): Centres d'Assistència i Seguiment de toxicòmans, Serveis d'Atenció a la Infància i l'Adolescència...`;

export const ESQUEMES_DETALL: EsquemaDetall[] = [
  {
    slug: 'a6-entorn-social-a-catalunya',
    ambit: 'A',
    codi: 'A.6',
    title: 'Entorn social a Catalunya',
    subtitle: "Migració i fluxos migratoris, polítiques d'immigració, models d'integració, igualtat d'oportunitats i serveis socials.",
    temariSlug: 'a6-entorn-social-a-catalunya',
    md: A6,
  },
];

export const listEsquemesDetall = (): EsquemaDetall[] => ESQUEMES_DETALL;
export const getEsquemaDetall = (slug: string): EsquemaDetall | null =>
  ESQUEMES_DETALL.find((e) => e.slug === slug) ?? null;
