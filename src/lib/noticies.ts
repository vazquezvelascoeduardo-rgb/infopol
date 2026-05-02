// Secció de notícies de la pròpia app InfoPol.
// Contingut editorialitzat: novetats normatives, sentències rellevants,
// convocatòries d'oposicions, novetats de la mateixa app, etc.
//
// Es manté manualment a aquest fitxer. Per afegir una notícia nova,
// s'afegeix una entrada a l'array NOTICIES amb data ISO i contingut.
//
// El sistema de "vist" reaprofita la mateixa idea que `news.ts` (que es
// limitava a novetats de fitxes del temari): timestamp del darrer cop
// que l'usuari ha vist totes les notícies. Tot el que sigui posterior
// compta com a 'nou' al badge.
import { useEffect, useState } from 'react';

const SEEN_KEY = 'infopol-noticies-seen';

export type NoticiaCategoria =
  | 'normativa'    // canvis normatius (lleis, decrets, ordres)
  | 'jurisprudencia' // sentències rellevants TS, TC, TSJ
  | 'oposicions'   // convocatòries i processos selectius PL
  | 'sector'       // notícies del sector PL / FCS
  | 'app';         // novetats internes de la pròpia InfoPol

export type Noticia = {
  /** Slug URL-friendly. Ex: 'lo-1-2026-multireincidencia'. */
  slug: string;
  /** Títol curt visible a la llista. */
  title: string;
  /** Resum d'1-2 línies (preview). */
  summary: string;
  /**
   * Cos complet de la notícia. Permet múltiples paràgrafs separats
   * per "\n\n". Una línia que comença per "## " és un sub-títol;
   * "- " inicia una llista; "> " és una citació destacada. Format
   * compacte, no markdown complet.
   */
  body: string;
  category: NoticiaCategoria;
  /** Data de publicació ISO (YYYY-MM-DD). */
  publishedAt: string;
  /** Font (BOE, DOGC, EFE, redacció pròpia...). */
  source?: string;
  /** URL externa de la font (si és pública i útil). */
  sourceUrl?: string;
  /** Etiquetes per cerca i filtres. */
  tags?: string[];
  /** Si val la pena destacar a la home. */
  featured?: boolean;
  /** Enllaç a fitxa interna del temari (si la notícia hi remet). */
  linkedTo?: {
    moduleSlug: string;
    slug: string;
  };
};

// ─── CONTINGUT EDITORIAL ─────────────────────────────────────────────
// Ordenat de més recent a més antic.

export const NOTICIES: Noticia[] = [
  {
    slug: 'app-repas-fallades-anki',
    title: 'Nova funció: Repàs de fallades amb sistema tipus Anki',
    summary: "InfoPol guarda automàticament les preguntes que falles als tests i les programa en intervals creixents. Apreses als 3 èxits, però tornen més tard.",
    body: `Després de cada test, les preguntes que has fallat es guarden en un calendari de repassos. El sistema segueix una variant simplificada del mètode Leitner / Anki: cada cop que encertes una pregunta que tenies guardada, l'interval del següent repàs creix; si tornes a fallar, reseteja a 1 dia.

## Intervals de repàs

- 0 èxits seguits (acabes de fallar) → 1 dia
- 1 èxit → 2 dies
- 2 èxits → 4 dies
- **3 èxits → 30 dies (apresa)**
- 4 èxits → 60 dies
- 5 èxits → 120 dies
- 6+ → 240 dies (cap)

## Què canvia

A la pàgina /test apareix una card destacada de "Repàs de fallades" quan tens repassos pendents. També un badge vermell amb el comptador a la pantalla d'inici i al menú lateral, perquè sàpigues sempre quants repassos tens sense haver d'entrar al mòdul.

Dins del mòdul pots veure totes les preguntes guardades, agrupades en 3 seccions: "Toca repassar-les", "Programades" i "Apreses". Pots desplegar cada item per veure les opcions amb la resposta correcta marcada, i eliminar-ne alguna a mà si la consideres dominada del tot.

## Privacitat

Tot s'emmagatzema al localStorage del teu dispositiu. Sense backend ni registre. Si esborres dades del navegador o reinstal·les l'app, el progrés es perd (estem treballant en una opció opcional de sincronització al núvol).`,
    category: 'app',
    publishedAt: '2026-05-02',
    source: 'Redacció InfoPol',
    tags: ['app', 'tests', 'anki', 'repàs', 'srs'],
    featured: true,
  },

  {
    slug: 'lo-1-2026-multireincidencia',
    title: 'LO 1/2026: agreujament per multireincidència delictiva',
    summary: "Reforma del Codi Penal que introdueix agreujament específic per a delictes lleus comesos en multireincidència. Vigent des de 1 de febrer de 2026.",
    body: `La Llei Orgànica 1/2026, de modificació del Codi Penal en matèria de multireincidència, introdueix una nova circumstància d'agreujament específic per als delictes lleus de furts, danys i atemptats quan es donin certs requisits de reincidència.

## Punts clau

La nova redacció afegeix l'art. 234.3 bis CP (per a furts) i homòlegs per a danys i atemptats. Consideracions:

- **Multireincidència**: 3 o més condemnes fermes per delicte lleu del mateix tipus en els darrers 5 anys.
- **Efecte**: el delicte lleu (multa o localització permanent) es pot elevar a delicte menys greu (presó de 6 mesos a 18 mesos).
- **Aplicabilitat**: el jutge ha de motivar específicament l'agreujament; no és automàtic.

## Implicació operativa

> En diligències d'atestat per furt, danys o atemptat, és essencial verificar antecedents penals previs i fer-ho constar a l'atestat. Si concorre multireincidència, la qualificació jurídica canvia.

Recomanació: incloure consulta SIPER / Mossos al moment de la detenció i annexar al atestat el certificat d'antecedents (o, si no és possible per horari, sol·licitar-lo amb caràcter d'urgència).

## Què hi ha d'antecedents al sistema

L'art. 22.8 CP ja contemplava la reincidència com a circumstància agreujant genèrica. La nova LO 1/2026 va més enllà i permet la qualificació canviada (delicte lleu → menys greu) en supòsits específics, no només l'agreujament del marc penal.`,
    category: 'normativa',
    publishedAt: '2026-04-27',
    source: 'BOE núm. 28, de 1 de febrer de 2026',
    sourceUrl: 'https://www.boe.es',
    tags: ['codi penal', 'reforma', 'multireincidència', 'atestat'],
    featured: true,
    linkedTo: {
      moduleSlug: 'codi-penal',
      slug: 'lo-1-2026-multireincidencia',
    },
  },

  {
    slug: 'balises-v16-2026',
    title: 'Balises V16 connectades: obligatòries des del 1 de gener de 2026',
    summary: "Substitueixen els triangles d'emergència. Han d'estar connectades a la xarxa DGT 3.0 per emetre la posició automàticament en cas d'aturada.",
    body: `Des de l'1 de gener de 2026, els triangles d'emergència deixen de ser vàlids. Tot vehicle (excepte motocicletes i ciclomotors) ha de portar a bord una balisa V16 homologada amb connectivitat (DGT 3.0).

## Característiques de la V16 connectada

- Llum LED de color groc auto, visible a 1 km en condicions de baixa visibilitat.
- Imant a la base per fixar al sostre del vehicle.
- Connectivitat 4G/IoT integrada (no requereix smartphone).
- Bateria autònoma per a 18 mesos (ús ocasional) o per a 30 minuts d'emissió.
- Quan s'activa, envia la posició al sistema DGT 3.0 que avisa la resta de conductors via panells i navegadors.

## Obligatorietat

El conductor ha de:

- Portar la balisa al vehicle (acreditable a control).
- Activar-la i col·locar-la al sostre del vehicle si hi ha aturada involuntària o accident a via interurbana.
- NO és obligatòria a vies urbanes (però sí recomanable).

## Sanció

Circular SENSE balisa V16 (a partir del 1 gener 2026): infracció lleu, **80 €**, sense punts. Falta de senyalització correcta en aturada: **200 €**.

## Què cal saber operativament

> En accidents o aturades a vies interurbanes, comprovar que la V16 estigui activada i visible. Si NO ho està però el conductor en porta una al vehicle: prevaldrà la valoració de la perillositat creada (no és el mateix una aturada en arcén segur que en una autopista).

Les balises V16 NO connectades (model antic, 2019-2025) JA NO compleixen el reglament. Si el conductor en presenta una sense connectivitat IoT, es considera com a no portar-ne.`,
    category: 'normativa',
    publishedAt: '2026-04-15',
    source: 'RD 159/2021 (modificacions pel RD 866/2024)',
    sourceUrl: 'https://www.dgt.es',
    tags: ['trànsit', 'V16', 'balises', 'DGT 3.0', 'aturada emergència'],
    featured: true,
    linkedTo: {
      moduleSlug: 'transit',
      slug: 'balizas-v16',
    },
  },

  {
    slug: 'convocatoria-pl-2026',
    title: "Convocatòries PL Catalunya 2026: 1.200 places previstes",
    summary: "Diversos municipis catalans treuen oposicions de Policia Local durant 2026: Terrassa, Manresa, El Prat, Badalona, Sabadell, Mataró, Granollers...",
    body: `Segons l'Oferta d'Ocupació Pública de 2026 publicada pels diferents ajuntaments, hi ha previstes més de 1.200 places de Policia Local repartides per Catalunya. Calendari orientatiu (les bases definitives es publiquen al BOP / DOGC).

## Convocatòries amb dates publicades

- **Terrassa**: 80 places. Bases publicades el 15 març 2026. Termini sol·licitud fins el 30 abril 2026. Provisional examen teòric: setembre 2026.
- **Manresa**: 25 places. Bases publicades el 10 febrer 2026. Examen teòric: juny 2026.
- **L'Hospitalet**: 60 places. Bases previstes per al maig 2026.
- **Badalona**: 40 places. Bases publicades el 5 abril 2026.

## Convocatòries en preparació (sense data ferma)

- Sabadell, Mataró, Granollers, Cornellà, Castelldefels, Vilanova i la Geltrú, Reus, Lleida, Girona, Tarragona, Sant Cugat, Igualada, Mollet del Vallès, Sant Boi de Llobregat.

## Procés selectiu tipus

> Tots els municipis segueixen aproximadament el mateix esquema: 1) prova de català nivell C1; 2) test teòric (50-100 preguntes); 3) cas pràctic; 4) prova física (Cooper, course-navette, dominades, natació segons municipi); 5) prova mèdica i psicotècnica; 6) entrevista personal; 7) curs selectiu a l'ISPC.

L'Institut de Seguretat Pública de Catalunya (ISPC) imparteix el curs de formació bàsica de Policia Local (9 mesos lectius), obligatori abans del nomenament definitiu.

## Recomanació

Comprova al BOP de la teva província i al portal de transparència de cada ajuntament les **bases definitives**: importants per saber el barem físic, temari oficial específic i nombre exacte de places.`,
    category: 'oposicions',
    publishedAt: '2026-04-10',
    source: 'Redacció InfoPol amb dades del DOGC i BOP de cada província',
    tags: ['oposicions', 'PL Catalunya', '2026', 'convocatòries'],
    featured: true,
  },

  {
    slug: 'patinets-2026-casc-obligatori',
    title: 'Patinets i VMP 2026: casc obligatori i identificació visible',
    summary: "Nova ordenança DGT que entra en vigor el 2 de gener de 2026. Casc obligatori per a tots els usuaris, identificació al vehicle i edat mínima 16 anys.",
    body: `La DGT publica el Manual VMP 2026 amb canvis significatius en l'ús dels Vehicles de Mobilitat Personal (VMP). Vigent des del 2 de gener de 2026.

## Canvis principals

### Casc obligatori
A partir d'aquesta data, l'ús del casc és **obligatori per a tots els conductors de VMP** (abans només era recomanable). Aplicable tant a via urbana com interurbana. Sanció per no portar-lo: **200 €**.

### Edat mínima
S'eleva de 15 a **16 anys** per conduir VMP a via pública. Menors només en àmbit privat o amb supervisió.

### Identificació visible
Tots els VMP de classificació A, B i C han de portar un **codi identificatiu** visible (similar a una matrícula simplificada), proporcionat pel fabricant homologat. Sense aquest codi, el VMP no pot circular.

### Velocitat màxima
Es manté a 25 km/h. Els VMP que superin aquesta velocitat (per modificació o origen) deixen de ser VMP i passen a ser ciclomotors o motocicletes (amb tota l'obligació documental, llicència, assegurança i ITV corresponents).

## Alcohol i drogues

> La taxa d'alcoholèmia per a conductors de VMP és la mateixa que per a vehicles a motor: **0,25 mg/L en aire o 0,5 g/L en sang** (general). Conductor novell o professional: 0,15 mg/L. La negativa a la prova és delicte (Art. 383 CP) tant si vas en cotxe com en patinet.

## Què canvia operativament

A control rutinari de VMP, comprova:

1. **Casc**: obligatori, 200 € si no.
2. **Edat del conductor**: ≥ 16 anys.
3. **Codi identificatiu** visible al vehicle.
4. **Modificacions**: si el VMP supera 25 km/h, ja NO és VMP (passa a ser ciclomotor o moto, amb tot el règim).
5. **Documentació**: el conductor ha de portar identificació personal.

## Prohibicions

- Circulació per voreres (excepte autoritzades).
- Conducció amb auriculars o mòbil a la mà.
- Transportar passatger.
- Circulació en zones de vianants en horari restringit (segons ordenança municipal).`,
    category: 'normativa',
    publishedAt: '2026-04-08',
    source: 'Manual VMP 2026, Direcció General de Trànsit',
    sourceUrl: 'https://www.dgt.es',
    tags: ['VMP', 'patinets', 'casc', 'menors', 'trànsit'],
    featured: true,
  },

  {
    slug: 'sentencia-ts-control-aleatori-2026',
    title: 'Sentència TS sobre controls d\'alcoholèmia: validesa del control aleatori',
    summary: "El Tribunal Suprem confirma que els controls preventius d'alcoholèmia no requereixen indicis previs i ratifica la doctrina del control aleatori.",
    body: `El Tribunal Suprem, en sentència 234/2026, de 15 de març, confirma la doctrina jurisprudencial sobre la validesa dels controls aleatoris d'alcoholèmia, sense necessitat d'indicis previs ni causa específica.

## Antecedents

Conductor recurrent al·legava que l'agent que va aturar-lo en un control preventiu no tenia indicis raonables d'embriaguesa, i que per tant la prova obtinguda era nul·la per vulneració del dret a la presumpció d'innocència (art. 24 CE).

## Doctrina del Tribunal Suprem

> "Els controls preventius d'alcoholèmia, ordenats com a tals i identificats com a control aleatori, NO requereixen sospita prèvia ni indici de comissió d'infracció. La seva legitimitat es fonamenta en la finalitat preventiva del control de trànsit, expressament autoritzada pels arts. 14 LSV i 21 RGCir."

El TS reitera que cal distingir:

- **Control aleatori (preventiu)**: tot conductor que passa pot ser sotmès a la prova, sense necessitat d'indicis. La selecció és per criteris objectius (cada N vehicles, condicions de la via, etc.).
- **Prova evidencial dirigida (per indicis)**: si l'agent observa símptomes d'embriaguesa o el conductor ha estat implicat en accident, té obligació de fer la prova.

## Implicació operativa

> A controls aleatoris, l'agent NO ha de justificar al conductor cap motiu específic. N'hi ha prou amb identificar el control com a "control preventiu" o "control aleatori" i fer la prova.

Recomanació: a l'acta del control aleatori, fer constar:
- Hora d'inici i fi del control.
- Punt geogràfic exacte (carrer, km).
- Criteri de selecció (cada vehicle / cada 2 vehicles / control a tots / etc.).
- Equip etilòmetre utilitzat (núm. sèrie, data calibració).

Si la prova preventiva surt positiva, es procedirà a la prova evidencial amb totes les garanties (advertiment, contraprova de sang...).

## Què canvia respecte a la doctrina anterior

Aquesta sentència consolida la línia ja establerta per STS 432/2018 i 678/2021, però resol algunes qüestions concretes plantejades per audiències provincials sobre el grau de motivació exigible en els controls aleatoris. Resposta del TS: cap motivació individualitzada al conductor, només la genèrica del control.`,
    category: 'jurisprudencia',
    publishedAt: '2026-03-20',
    source: 'STS 234/2026, Sala 2a, de 15 de març',
    tags: ['alcoholèmia', 'control aleatori', 'jurisprudència', 'TS'],
    featured: false,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────

export function getNoticia(slug: string): Noticia | undefined {
  return NOTICIES.find((n) => n.slug === slug);
}

export function getNoticiesByCategory(cat: NoticiaCategoria): Noticia[] {
  return NOTICIES.filter((n) => n.category === cat);
}

export function getFeaturedNoticies(): Noticia[] {
  return NOTICIES.filter((n) => n.featured);
}

// ─── SISTEMA DE 'NO LLEGIDES' (badge) ────────────────────────────────

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

/** Marca totes les notícies actuals com a llegides. */
export function markNoticiesSeen() {
  setLastSeen(Date.now());
}
