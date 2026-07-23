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

/**
 * Categoria de contingut. Cada apartat de l'app té una pestanya pròpia
 * a /noticies. Per defecte 'noticies' (notícies generals d'actualitat).
 */
export type NoticiaCategoria = 'noticies' | 'personalitats' | 'premis' | 'esports';

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
  /**
   * Pestanya de contingut on apareix la notícia. Per defecte 'noticies'.
   * Permet separar 'personalitats', 'premis' i 'esports' a tabs propis.
   */
  category?: NoticiaCategoria;
  /** Notícia destacada del mes (apareix amb badge a la home). */
  featured?: boolean;
  /**
   * URL d'una imatge representativa (recomanat 16:9, mín. 800px ample).
   * Pot ser una URL externa estable (ex. Wikimedia Commons, CDN propi).
   * Es renderitza com a thumbnail al llistat i com a hero al detall.
   */
  image?: string;
  /** Text alternatiu de la imatge (accessibilitat). */
  imageAlt?: string;
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
  // ─── JULIOL 2026 — ESPORTS · TOUR DE FRANÇA ────────────────────────

  {
    slug: 'jul2026-tour-franca-pogacar-lider',
    title: 'Tour de França 2026 — Pogačar defensa el groc a la darrera setmana',
    summary: "Tadej Pogačar lidera la general del Tour 2026 amb uns 4 minuts i mig sobre Remco Evenepoel després de l'etapa 17. Evenepoel va guanyar la contrarellotge de l'etapa 16. La cursa acaba el 26 de juliol.",
    body: `El **Tour de França 2026** (4–26 de juliol) encara la seva darrera setmana amb **Tadej Pogačar** com a líder de la classificació general.

## Situació a 23 de juliol

- **Mallot groc**: Tadej Pogačar (UAE).
- **Segon**: Remco Evenepoel, a uns **4 minuts i 32 segons** després de l'etapa 17.
- Evenepoel va guanyar la **contrarellotge individual de l'etapa 16**, però Pogačar va mantenir el liderat.

## ⚠️ Atenció per a tests d'actualitat

> La cursa **no acaba fins al 26 de juliol** a París. Aquesta entrada reflecteix l'estat provisional a 23/07/2026 — comprova el guanyador final abans de donar-lo per fet en un test.

## Context

Pogačar busca revalidar el títol aconseguit el 2025. El duel Pogačar–Evenepoel ha marcat tota l'edició, amb la lluita pel mallot verd entre Pedersen i Philipsen com a segon focus d'atenció.`,
    publishedAt: '2026-07-22',
    source: 'ProCyclingUK · Cyclinguptodate',
    sourceUrl: 'https://procyclinguk.com/gc-and-jerseys-after-tour-de-france-2026-stage-16-pogacar-holds-yellow-as-evenepoel-wins-time-trial/',
    tags: ['esports', 'ciclisme', 'Tour de França', 'Pogačar', 'Evenepoel'],
    category: 'esports',
  },

  // ─── JULIOL 2026 — TRÀNSIT · COMUNICAT SCT 7/2026 (VMP) ────────────

  {
    slug: 'jul2026-comunicat-7-2026-vmp',
    title: 'VMP — Comunicat 7/2026 del SCT: text refós en vigor des del 20 de juliol',
    summary: "El Servei Català de Trànsit publica el Comunicat informatiu 7/2026, que refon els comunicats 3/2026, 4/2026 i 6/2026 sobre VMP i vehicles similars. En vigor des del 20/07/2026. La fitxa de carrer d'InfoPol ja està actualitzada.",
    body: `**Director:** Ramon Lamiel i Villaró · **Entrada en vigor:** 20/07/2026 · **Refon:** Comunicats 3/2026, 4/2026 i 6/2026

El **Comunicat informatiu SCT 7/2026** unifica en un sol text tota la doctrina operativa sobre **Vehicles de Mobilitat Personal (VMP)** i vehicles similars. La **fitxa de carrer d'InfoPol** ja incorpora tot el contingut.

## ⭐ Classificació — la dada crítica és la MOM

> **MOM > 25 kg i velocitat > 14 km/h → VEHICLE DE MOTOR** (art. 1 bis RDL 8/2004): AOV obligatori sempre.
> **La resta → VPL** (MOM ≤ 25 kg, o > 25 kg amb 6–14 km/h).

La MOM consta al REVEMP; si el vehicle no està inscrit, l'agent l'ha d'anotar a la butlleta.

## 💶 Quadre de denúncies principal

| Fet | Article | Import |
|-----|---------|--------|
| Sense AOV — vehicle de motor | 1 bis RDL 8/2004 | **800 €** |
| Sense AOV — VPL | DA 1a Llei 5/2025 | **300 €** |
| Sense certificat de circulació | 22 bis.2 RGV | 200 € |
| No inscrit al RNV | 22 bis.2 RGV | 100 € |
| Sense etiqueta o placa de marcatge | 22 bis.2 RGV | 80 € |
| Annex XXI — molt greu (manipulació velocitat) | 22 bis.2 RGV | 500 € |
| Annex XXI — greu (enllumenat, rodes) | 22 bis.2 RGV | 200 € |
| Annex XXI — lleu (timbre, cavallet) | 22 bis.2 RGV | 80 € |

Totes amb **reducció del 50%** per pagament anticipat.

## 🚨 Filtre AOV en VPL

Només es pot denunciar un VPL per manca d'assegurança si té **els tres requisits**: certificat de circulació + inscripció al RNV + etiqueta identificativa. **Si en falta un, no es denuncia l'AOV.**

## 📅 Dates clau del certificat

- Comercialitzat **abans del 22/01/2024** → exempt de certificat fins al **22/01/2027**.
- Comercialitzat després → denunciable ara.

## 📝 Altres regles operatives

- **Incompatibilitats**: sense certificat *absorbeix* no inscrit al RNV i sense placa; no inscrit *absorbeix* sense etiqueta.
- **Responsable**: 1r el titular inscrit al RNV; si no consta, el conductor. **Menors**: pares/tutors responen solidàriament (art. 82 LSV).
- **Mai** es denuncia un VMP per manca de permís de conduir.

> 💡 Consulta la fitxa de carrer completa (identificació, blocs de decisió i vehicles fora del Reglament UE 168/2013) a l'enllaç de baix.`,
    publishedAt: '2026-07-20',
    source: 'Servei Català de Trànsit · Comunicat informatiu 7/2026',
    tags: ['trànsit', 'VMP', 'VPL', 'SCT', 'sancions', 'temari'],
    category: 'noticies',
    featured: true,
    linkedTo: {
      moduleSlug: 'transit',
      slug: 'vmp-fitxa-carrer-sct-7-2026',
    },
  },

  // ─── JULIOL 2026 — PERSONALITATS · DEFUNCIONS ──────────────────────

  {
    slug: 'jul2026-mor-kevin-keegan',
    title: 'Mor Kevin Keegan, llegenda del futbol anglès i doble Pilota d\'Or',
    summary: "L'exfutbolista i exentrenador anglès Kevin Keegan va morir el 20 de juliol de 2026 als 75 anys, a causa d'un càncer d'estómac. Va ser el primer futbolista britànic a guanyar dues Pilotes d'Or consecutives (1978 i 1979).",
    body: `**Kevin Keegan** (1951–2026) va morir el **20 de juliol de 2026** als **75 anys**, després d'un càncer d'estómac en fase quatre diagnosticat a principis del 2026.

## Palmarès i fites

- Primer futbolista britànic amb **dues Pilotes d'Or consecutives** (1978 i 1979, a l'Hamburg).
- Amb el **Liverpool**: 3 lligues, 1 Copa d'Europa, 1 FA Cup i 2 Copes de la UEFA.
- Internacional amb **Anglaterra**, selecció que després també va entrenar.
- Ídol del **Newcastle United** com a jugador i com a tècnic.

## Per què pot sortir en un test

> Les defuncions de grans figures de l'esport són pregunta recurrent d'actualitat. Dada clau: **20 de juliol de 2026, 75 anys, doble Pilota d'Or (1978-1979)**.`,
    publishedAt: '2026-07-20',
    source: 'El Español',
    sourceUrl: 'https://www.elespanol.com/deportes/futbol/20260720/muere-kevin-keegan-leyenda-futbol-ingles-ganador-balones-oro-anos/1003744327982_0.html',
    tags: ['personalitats', 'defuncions', 'futbol', 'Kevin Keegan'],
    category: 'personalitats',
  },

  // ─── JULIOL 2026 — ESPORTS · MUNDIAL DE FUTBOL ─────────────────────

  {
    slug: 'jul2026-espanya-campiona-mundial',
    title: 'Espanya guanya el Mundial 2026 — 1-0 a l\'Argentina a la pròrroga',
    summary: "Espanya es proclama campiona del món de futbol el 19 de juliol de 2026 al MetLife Stadium (Nova Jersey), en vèncer l'Argentina 1-0 a la pròrroga amb gol de Ferran Torres. És el segon títol mundial després del de 2010.",
    body: `**Final:** Espanya 1 - 0 Argentina (pròrroga) · **Data:** 19/07/2026 · **Estadi:** MetLife Stadium (Nova Jersey, EUA) · **Gol:** Ferran Torres (min. 106)

**Espanya és campiona del món de futbol per segona vegada.** La selecció va derrotar l'**Argentina** per **1-0 a la pròrroga** a la final del **Mundial 2026**, amb un gol de **Ferran Torres al minut 106**.

## ⭐ Dades per a tests

- **Data de la final**: 19 de juliol de 2026.
- **Seu**: MetLife Stadium, Nova Jersey (Estats Units).
- **Resultat**: Espanya 1 - 0 Argentina (després de la pròrroga).
- **Golejador**: Ferran Torres.
- **Segon Mundial** d'Espanya (l'anterior: Sud-àfrica 2010).
- Primer país que té **alhora el Mundial masculí i el femení** (el femení es va guanyar el 2023).

## Un Mundial històric

El **Mundial 2026** ha estat el primer amb **48 seleccions** i el primer organitzat per **tres països**: Estats Units, Mèxic i Canadà.`,
    publishedAt: '2026-07-19',
    source: 'NPR · FIFA',
    sourceUrl: 'https://www.npr.org/2026/07/19/nx-s1-5899071/2026-world-cup-fifa-argentina-spain-final-championship',
    tags: ['esports', 'futbol', 'Mundial 2026', 'Espanya', 'seleccions'],
    category: 'esports',
    featured: true,
  },

  // ─── JULIOL 2026 — ESPORTS · SANFERMINES ───────────────────────────

  {
    slug: 'jul2026-sanfermines-balanc',
    title: 'Sanfermines 2026 — balanç final: 57 atesos, 5 ferits per banya i cap mort',
    summary: "Els vuit encierros de San Fermín 2026 (7-14 de juliol) es tanquen amb 57 persones ateses a l'Hospital Universitari de Navarra, 5 ferides per banya i 3 casos greus. Cap víctima mortal. La xifra d'atesos puja respecte del 2025 (45) i el 2024 (43).",
    body: `Les festes de **San Fermín 2026** de Pamplona s'han tancat amb un balanç sanitari dels **vuit encierros** superior al d'anys anteriors, però **sense víctimes mortals**.

## Balanç dels 8 encierros

- **57 persones ateses** a l'Hospital Universitari de Navarra (45 el 2025, 43 el 2024).
- **5 ferits per asta de toro** (mateixa xifra que el 2025).
- **3 casos greus**.
- Augment de fractures, luxacions i traumatismes cranials i toràcics.

## El darrer encierro (14 de juliol)

Els toros de la ramaderia **Jandilla** van tancar les festes amb una cursa de **2 minuts i 25 segons** i **dos ferits per banya**: un jove de 18 anys de Pamplona (cuixa) i un home de 46 anys de Guadalajara (tòrax).

## Per què és rellevant

> Grans esdeveniments festius com els Sanfermines són un exemple clàssic de **dispositius policials de seguretat massiva** (controls d'accés, coordinació sanitària, gestió de multituds) i pregunta recurrent d'actualitat de juliol.`,
    publishedAt: '2026-07-14',
    source: 'Noticias de Navarra',
    sourceUrl: 'https://www.noticiasdenavarra.com/san-fermin/2026/07/14/parte-medico-octavo-encierro-san-fermin-2026-11324205.html',
    tags: ['esports', 'Sanfermines', 'Pamplona', 'seguretat esdeveniments'],
    category: 'esports',
  },

  // ─── JULIOL 2026 — ESPORTS · WIMBLEDON ─────────────────────────────

  {
    slug: 'jul2026-wimbledon-sinner-noskova',
    title: 'Wimbledon 2026 — Sinner revalida el títol i Nosková guanya el seu primer Grand Slam',
    summary: "Jannik Sinner venç Alexander Zverev a la final masculina de Wimbledon 2026 i encadena dos títols consecutius. En dones, la txeca Linda Nosková supera Karolína Muchová i es converteix en la campiona més jove des de Kvitová (2011).",
    body: `El torneig de **Wimbledon 2026** es va tancar el cap de setmana de l'11 i 12 de juliol amb aquests campions:

## 🏆 Final masculina

- **Jannik Sinner** (Itàlia) venç **Alexander Zverev** (Alemanya): 6-7(7), 7-6(2), 6-3, 6-4.
- És el seu **segon Wimbledon consecutiu** i el **cinquè Grand Slam** de la seva carrera.

## 🏆 Final femenina

- **Linda Nosková** (Txèquia) venç **Karolína Muchová** (Txèquia): 6-2, 5-7, 6-3 — final 100% txeca.
- **Primer Grand Slam** de Nosková, amb **21 anys i 236 dies**: la campiona més jove de Wimbledon des de **Petra Kvitová el 2011**.

## Per a tests

> Wimbledon és l'únic Grand Slam sobre gespa. Campions 2026: **Sinner** (masculí) i **Nosková** (femení).`,
    publishedAt: '2026-07-12',
    source: 'ESPN · Wimbledon',
    sourceUrl: 'https://www.espn.com/tennis/story/_/id/49342484/wimbledon-2026-men-final-live-tennis-latest-updates-jannik-sinner-alexander-zverev-news-results-schedule-weather',
    tags: ['esports', 'tennis', 'Wimbledon', 'Sinner', 'Nosková'],
    category: 'esports',
  },

  // ─── JULIOL 2026 — PERSONALITATS · NOMENAMENTS ─────────────────────

  {
    slug: 'jul2026-anson-director-aeat',
    title: 'Antonio Ansón, nou director general de l\'Agència Tributària',
    summary: "El Consell de Ministres nomena Antonio Ansón Latorre director general de l'AEAT el 7 de juliol de 2026, en substitució de Soledad Fernández. Inspector d'Hisenda amb 27 anys de trajectòria, dirigia el gabinet del secretari d'Estat d'Hisenda.",
    body: `El **Consell de Ministres** ha aprovat el nomenament d'**Antonio Ansón Latorre** com a nou **director general de l'Agència Estatal d'Administració Tributària (AEAT)**.

## Dades del nomenament

- **Data**: 7 de juliol de 2026.
- **Substitueix**: Soledad Fernández, que havia demanat el relleu; es va esperar al final de la campanya de la Renda (final de juny).
- **Perfil**: nascut a Saragossa (1962), inspector d'Hisenda amb **27 anys de trajectòria**. Des de l'abril de 2025 dirigia el gabinet del secretari d'Estat d'Hisenda, Jesús Gascón.

## Per a tests

> Els relleus al capdavant de grans organismes estatals (AEAT, DGT, CIS, RTVE...) són pregunta típica d'actualitat institucional. Dada clau: **Antonio Ansón, director general de l'AEAT des del juliol de 2026**.`,
    publishedAt: '2026-07-07',
    source: 'The Objective · elDiario.es',
    sourceUrl: 'https://theobjective.com/economia/2026-07-07/gobierno-antonio-anson-director-agencia-tributaria/',
    tags: ['personalitats', 'nomenaments', 'AEAT', 'Hisenda'],
    category: 'personalitats',
  },

  // ─── JUNY 2026 — TRÀNSIT · OPERACIÓ ESTIU DGT ──────────────────────

  {
    slug: 'jun2026-dgt-operacio-estiu',
    title: 'La DGT activa l\'Operació Estiu 2026: 104 milions de desplaçaments previstos',
    summary: "Trànsit preveu més de 104 milions de desplaçaments de llarg recorregut entre l'1 de juliol i el 31 d'agost (+3,7%). El primer dispositiu especial va del 3 al 5 de juliol. És el primer estiu amb la balisa V-16 connectada obligatòria.",
    body: `La **Direcció General de Trànsit (DGT)** ha activat l'**Operació Estiu 2026**, el dispositiu especial per als desplaçaments de les vacances.

## Xifres clau

- Més de **104 milions de desplaçaments** de llarg recorregut previstos entre l'1 de juliol i el 31 d'agost: 49,7 milions al juliol i 54,5 milions a l'agost.
- Un **3,7% més** que l'estiu passat.
- **Primera operació sortida**: del divendres 3 de juliol (15 h) al diumenge 5 de juliol (24 h), amb 4,83 milions de desplaçaments.

## Les 4 operacions especials

1. **Primera operació sortida**: 3–5 de juliol.
2. **Operació 1 d'agost**: 31 de juliol – 2 d'agost.
3. **Operació 15 d'agost**: 14–16 d'agost.
4. **Operació retorn**: 28–31 d'agost.

## ⭐ Novetat 2026

> És el **primer estiu amb la balisa V-16 connectada obligatòria** (des de l'1 de gener de 2026 substitueix els triangles de preavís). Dada molt preguntable en tests de trànsit.`,
    publishedAt: '2026-06-30',
    source: 'DGT — Nota de premsa 30/06/2026',
    sourceUrl: 'https://www.dgt.es/comunicacion/notas-de-prensa/20260630-trafico-activa-operacion-verano-2026/',
    tags: ['trànsit', 'DGT', 'operació estiu', 'V-16', 'seguretat viària'],
    category: 'noticies',
  },

  // ─── JUNY 2026 — PERSONALITATS · DEFUNCIONS ────────────────────────

  {
    slug: 'jun2026-mor-david-hockney',
    title: 'Mor David Hockney, un dels grans pintors contemporanis, als 88 anys',
    summary: "El pintor britànic David Hockney, figura clau del pop art i cèlebre per les seves piscines californianes, va morir l'11 de juny de 2026 a casa seva als 88 anys, un mes abans de fer-ne 89.",
    body: `El pintor britànic **David Hockney** (Bradford, Yorkshire, 1937) va morir **l'11 de juny de 2026** a casa seva, **als 88 anys**, segons va comunicar la seva representant.

## Qui era

- Pilar del **pop art** britànic des dels anys 60.
- Cèlebre per les seves **piscines i paisatges californians** (va viure molts anys a Los Angeles) i, més tard, pels paisatges de Yorkshire i l'experimentació amb l'iPad.
- Considerat un dels artistes més estimats i cotitzats de l'art contemporani dels segles XX i XXI.

## Per a tests

> Dada clau: **David Hockney, pintor britànic, mor l'11 de juny de 2026 als 88 anys**.`,
    publishedAt: '2026-06-12',
    source: 'CNN en Español',
    sourceUrl: 'https://cnnespanol.cnn.com/2026/06/12/mundo/muere-artista-britanico-david-hockney-trax',
    tags: ['personalitats', 'defuncions', 'art', 'David Hockney'],
    category: 'personalitats',
  },

  // ─── JUNY 2026 — PREMIS · PRINCESA D'ASTÚRIES ──────────────────────

  {
    slug: 'jun2026-julian-barnes-princesa-asturies-lletres',
    title: 'Julian Barnes, Premi Princesa d\'Astúries de les Lletres 2026',
    summary: "L'escriptor britànic Julian Barnes, premi Booker 2011 per 'El sentit d'un final', guanya el Princesa d'Astúries de les Lletres 2026, anunciat el 10 de juny. El jurat el presidia Santiago Muñoz Machado.",
    body: `L'escriptor britànic **Julian Barnes** ha estat guardonat amb el **Premi Princesa d'Astúries de les Lletres 2026**, anunciat el **10 de juny de 2026** a Oviedo.

## Qui és

- Una de les grans veus de la **narrativa anglesa** contemporània: novel·la, relat, assaig i memòries.
- **Premi Booker 2011** per *The Sense of an Ending* (*El sentit d'un final*).
- El jurat, presidit per **Santiago Muñoz Machado** (director de la RAE), en va destacar la creació literària "en tots els seus gèneres".

## ⭐ Princesa d'Astúries 2026 — guardons fallats fins al juliol

| Categoria | Guardonat |
|-----------|-----------|
| **Lletres** | Julian Barnes |
| **Esports** | Leo Messi |
| **Arts** | Patti Smith |
| **Comunicació i Humanitats** | Studio Ghibli |
| **Investigació Científica i Tècnica** | D. Klenerman, S. Balasubramanian i P. Mayer |
| **Cooperació Internacional** | Banc Mundial de Llavors de Svalbard |

> Les categories restants (Ciències Socials i Concòrdia) es fallen a les setmanes següents. **Cerimònia de lliurament: 23 d'octubre de 2026 a Oviedo**, presidida pels Reis.`,
    publishedAt: '2026-06-10',
    source: 'Fundación Princesa de Asturias',
    sourceUrl: 'https://www.fpa.es/es/area-de-comunicacion-y-prensa/notas-de-prensa/julian-barnes-premio-princesa-de-asturias-de-las-letras-2026/',
    tags: ['premis', 'Princesa d\'Astúries', 'literatura', 'Julian Barnes'],
    category: 'premis',
  },

  // ─── JUNY 2026 — PREMIS · LLETRES CATALANES ────────────────────────

  {
    slug: 'jun2026-biel-mesquida-premi-honor-lletres',
    title: 'Biel Mesquida rep el 58è Premi d\'Honor de les Lletres Catalanes',
    summary: "L'escriptor mallorquí Biel Mesquida va rebre el 8 de juny de 2026, al Palau de la Música Catalana, el 58è Premi d'Honor de les Lletres Catalanes, que atorga Òmnium Cultural i està dotat amb 20.000 euros.",
    body: `L'escriptor, biòleg i comunicador mallorquí **Biel Mesquida** va rebre el **8 de juny de 2026**, al **Palau de la Música Catalana**, el **58è Premi d'Honor de les Lletres Catalanes**.

## El premi

- L'atorga **Òmnium Cultural** des del 1969.
- Dotació: **20.000 euros**.
- Reconeix una persona que, per la seva obra literària o científica en llengua catalana, ha contribuït de manera notable i continuada a la vida cultural dels territoris de parla catalana.

## El guardonat

El jurat va distingir Mesquida com a **"creador verbal"** que ha cultivat tots els gèneres: poesia, conte, novel·la, periodisme i crítica literària.

> Per a tests d'àmbit català: **58a edició · Biel Mesquida · Òmnium Cultural · lliurament el 8 de juny de 2026 al Palau de la Música**.`,
    publishedAt: '2026-06-08',
    source: 'Òmnium Cultural · Palau de la Música Catalana',
    sourceUrl: 'https://www.palaumusica.cat/ca/58e-premi-d-honor-de-les-lletres-catalanes-2026_1636408',
    tags: ['premis', 'lletres catalanes', 'Òmnium Cultural', 'Biel Mesquida'],
    category: 'premis',
  },

  // ─── JUNY 2026 — ESPORTS · ROLAND GARROS ───────────────────────────

  {
    slug: 'jun2026-roland-garros-zverev-andreeva',
    title: 'Roland Garros 2026 — primer Grand Slam per a Zverev i Andreeva',
    summary: "Alexander Zverev guanya el seu primer Grand Slam en vèncer Flavio Cobolli en cinc sets a la final de Roland Garros (7 de juny). En dones, Mirra Andreeva, de 19 anys, derrota Maja Chwalińska i es converteix en la campiona més jove a París des de Seles (1992).",
    body: `El **Roland Garros 2026** va coronar dos campions inèdits en Grand Slam:

## 🏆 Final masculina (7 de juny)

- **Alexander Zverev** (Alemanya) venç **Flavio Cobolli** (Itàlia): 6-1, 4-6, 6-4, 6-7(5), 6-1.
- **Primer Grand Slam** de Zverev, després d'haver perdut tres finals prèvies de 'major'.

## 🏆 Final femenina (6 de juny)

- **Mirra Andreeva** venç la qualificada **Maja Chwalińska** (Polònia): 6-3, 6-2.
- **Primer Grand Slam** d'Andreeva amb només **19 anys**: la campiona femenina més jove de Roland Garros des de **Monica Seles el 1992**.

## Per a tests

> Roland Garros és el Grand Slam sobre **terra batuda** (París, maig-juny). Campions 2026: **Zverev** i **Andreeva**.`,
    publishedAt: '2026-06-07',
    source: 'NPR · Roland-Garros',
    sourceUrl: 'https://www.npr.org/2026/06/07/g-s1-126803/french-open-2026-alexander-zverev-grand-slam-title',
    tags: ['esports', 'tennis', 'Roland Garros', 'Zverev', 'Andreeva'],
    category: 'esports',
  },

  // ─── JUNY 2026 — PREMIS · PRINCESA D'ASTÚRIES ESPORTS ──────────────

  {
    slug: 'jun2026-messi-princesa-asturies-esports',
    title: 'Leo Messi, Premi Princesa d\'Astúries dels Esports 2026',
    summary: "El futbolista argentí Leo Messi guanya el Premi Princesa d'Astúries dels Esports 2026, anunciat el 3 de juny. El jurat en destaca els 47 títols (4 Champions, 10 Lligues i el Mundial 2022) i la seva dimensió social i solidària.",
    body: `El futbolista argentí **Leo Messi** ha estat guardonat amb el **Premi Princesa d'Astúries dels Esports 2026**, anunciat el **3 de juny de 2026**.

## Motius del jurat

- Trajectòria amb un **impacte esportiu excepcional i molt regular en el temps**.
- **47 títols**, entre els quals **4 Champions League, 10 Lligues** i la **Copa del Món de la FIFA 2022**.
- Dimensió social: referent de constància, humilitat i compromís; **ambaixador d'UNICEF** i impulsor de la Fundació Leo Messi (educació i salut).

## Per a tests

> Guanyadors recents del Princesa d'Astúries dels Esports: **Leo Messi (2026)**. La cerimònia de lliurament és el **23 d'octubre de 2026 a Oviedo**.`,
    publishedAt: '2026-06-03',
    source: 'Fundación Princesa de Asturias',
    sourceUrl: 'https://www.fpa.es/es/area-de-comunicacion-y-prensa/notas-de-prensa/leo-messi-premio-princesa-de-asturias-de-los-deportes-2026/',
    tags: ['premis', 'Princesa d\'Astúries', 'esports', 'Messi'],
    category: 'premis',
  },

  // ─── MAIG 2026 — ESPORTS · FINAL DE LA CHAMPIONS ───────────────────

  {
    slug: 'mai2026-final-champions-psg-arsenal',
    title: 'El PSG revalida la Champions als penals contra l\'Arsenal a Budapest',
    summary: "El París Saint-Germain guanya la Champions League 2025-26 en vèncer l'Arsenal als penals (4-3, després d'un 1-1) a la final del 30 de maig al Puskás Aréna de Budapest. És el segon club de l'era Champions que revalida el títol.",
    body: `**Final:** PSG 1 (4) - 1 (3) Arsenal · **Data:** 30/05/2026 · **Estadi:** Puskás Aréna (Budapest) · **Assistència:** 61.035

El **París Saint-Germain** va conquerir la **Champions League 2025-26** en superar l'**Arsenal** als **penals (4-3)** després d'empatar 1-1 al final de la pròrroga.

## El partit

- **Kai Havertz** va avançar l'Arsenal al minut 6.
- **Ousmane Dembélé** va empatar de penal per al PSG.
- **Vitinha** (PSG) va ser escollit millor jugador de la final.

## ⭐ Dada per a tests

> El PSG es converteix en el **segon club de l'era Champions (des de 1992) que revalida el títol**, després d'haver guanyat també l'edició 2024-25.`,
    publishedAt: '2026-05-30',
    source: 'Olympics.com · UEFA',
    sourceUrl: 'https://www.olympics.com/en/news/uefa-mens-champions-league-final-2026-arsenal-paris-saint-germain-live-ticker',
    tags: ['esports', 'futbol', 'Champions League', 'PSG', 'Arsenal'],
    category: 'esports',
  },

  // ─── MAIG 2026 — CONSTITUCIONAL · 4a REFORMA CE ────────────────────

  {
    slug: 'mai2026-quarta-reforma-ce-formentera',
    title: '4a reforma de la Constitució Espanyola — Formentera ja té senador propi',
    summary: "El Rei Felip VI ha sancionat el 19 de maig de 2026 la quarta reforma de la Constitució Espanyola, que modifica l'article 69.3 perquè Formentera tingui un senador propi al Senat, independent d'Eivissa. És la quarta reforma en 48 anys.",
    body: `**Sancionada per Felip VI:** 19/05/2026 · **Publicació BOE:** 19/05/2026 · **Article reformat:** 69.3 CE · **Procediment:** art. 167 CE (ordinari)

S'ha aprovat la **4a reforma de la Constitució Espanyola** des de la seva entrada en vigor el 1978. La reforma modifica l'**article 69.3 CE** per atorgar a **Formentera un senador propi** al Senat, separant la seva representació de la d'Eivissa.

## ⭐ Les 4 reformes de la CE 1978 — actualitzat

| Reforma | Data | Article | Motiu |
|---------|------|---------|-------|
| **1a** | 27/08/1992 | art. 13.2 | Tractat de Maastricht (sufragi UE municipals) |
| **2a** | 27/09/2011 | art. 135 | Estabilitat pressupostària (crisi euro) |
| **3a** | 15/02/2024 | art. 49 | "Persones amb discapacitat" (terminologia inclusiva) |
| **4a** 🆕 | 19/05/2026 | art. 69.3 | **Senador propi a Formentera** |

## ⚖️ Què canvia exactament a l'art. 69.3 CE

L'article 69.3 enumera les illes que tenen circumscripció pròpia per a l'elecció de senadors. **Abans**: Eivissa-Formentera compartien senador. **Ara**: cada illa té el seu propi senador.

> El Senat passa de **208 senadors** elegits per circumscripció a **209**. Es manté el sistema de senadors autonòmics (1 per CA + 1 per cada milió d'habitants).

## 🏝️ Per què la reforma

Formentera (≈12.000 habitants) és la primera illa amb **Consell Insular propi des de 2007** que continuava compartint senador amb Eivissa. La reforma corregeix una incongruència institucional: si té Cabildo/Consell propi, també ha de tenir senador propi (segons el mateix art. 69.3 CE).

## 📝 Procediment seguit

- **Art. 167 CE** (procediment ordinari): no afecta el Títol Preliminar, ni la Secció 1a del Capítol II del Títol I, ni el Títol II.
- **Sense referèndum obligatori** (només si ho demanen 1/10 dels diputats o senadors en els 15 dies següents — no es va sol·licitar).
- Aprovat per **majoria de 3/5 al Congrés i al Senat** (text final el 13/05/2026).

## 📚 Per al temari de Policia Local

- **Hi ha 4 reformes** a la CE 1978 (no 3 — error típic en temaris desactualitzats).
- **Data exacta**: 19/05/2026.
- **Article reformat**: art. 69.3 CE.
- **Procediment**: art. 167 CE (no calia art. 168 perquè no afecta el Títol II ni la Secció 1a Capítol II Títol I).
- Atenció als enunciats: si pregunten "Quantes reformes té la CE?", la resposta correcta des del 19/05/2026 és **4**.

> 💡 També tens una fitxa específica sobre aquesta reforma a la categoria **Novetats Normatives** del menú de Lleis.`,
    publishedAt: '2026-05-19',
    source: 'BOE · Reial Decret Legislatiu de sanció · RTVE',
    tags: ['constitucional', 'CE 1978', 'reforma', 'Senat', 'Formentera', 'temari'],
    featured: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Spanish_Constitution_1978.jpg/1200px-Spanish_Constitution_1978.jpg',
    imageAlt: 'Portada de la Constitució Espanyola de 1978',
    linkedTo: {
      moduleSlug: 'novetats',
      slug: 'quarta-reforma-constitucio-2026',
    },
  },

  // ─── MAIG 2026 — TRÀNSIT · VMP / VPL ───────────────────────────────

  {
    slug: 'mai2026-comunicat-6-2026-vmp-vpl',
    title: 'Actualització VMP — Comunicat 6/2026 SCT amb 5 noves infraccions',
    summary: "La fitxa de VMP s'ha actualitzat amb el Comunicat 6/2026 del Servei Català de Trànsit: 5 noves infraccions al catàleg, distinció VMP a motor (800 €) vs VPL (300 €) sense AOV, i règim transitori M/Z. Vigor des del 18/05/2026.",
    body: `**Director:** Ramon Lamiel i Villaró · **Signat:** 15/05/2026 · **Entrada en vigor:** 18/05/2026

Hem actualitzat la **fitxa operativa del VMP** amb el contingut del **Comunicat 6/2026** del Servei Català de Trànsit, que incorpora **5 noves infraccions** al catàleg vinculades a la regulació dels **Vehicles de Mobilitat Personal (VMP)** i dels **Vehicles Personals Lleugers (VPL)**, després de l'entrada en vigor del **Reial decret 52/2026**, de 28 de gener, que regula el **Registre Nacional de Vehicles Personals Lleugers**.

> 📄 **Tot el contingut nou està ja integrat a la fitxa VMP existent** (no és una llei separada). Pots accedir-hi des de l'enllaç de baix per veure-ho amb la resta del marc legal del VMP.

## ⭐ Les 5 noves infraccions

| Nº | Infracció | Qualif. | Sanció |
|:--:|----------|:------:|:------:|
| 1 | Sense **etiqueta identificativa** o **placa de marcatge** | 🟢 LLEU | **80 €** |
| 2 | **No inscrit** al RNV | 🟢 LLEU | **100 €** |
| 3 | Annex XXI: afecta **greument la seguretat** *(manipulació velocitat, modificació estructural)* | 🔴 MOLT GREU | **500 €** |
| 4 | Annex XXI: il·luminació, rodes… | 🟠 GREU | **200 €** |
| 5 | Annex XXI: dispositiu sonor, cavallet… | 🟢 LLEU | **80 €** |

Totes amb base normativa l'**article 22 del Reglament General de Vehicles (RGV)** i amb el **descompte del 50%** per pagament anticipat.

## 🚨 Distinció VMP a motor ≠ VPL

És essencial perquè determina l'obligació d'assegurança i l'import de la sanció.

- **VMP considerat vehicle a motor** → **sempre** obligat a AOV. Sanció sense assegurança: **800 €**.
- **VPL certificat i inscrit** → obligat a AOV. Sanció: **300 €** (150 € reducció — abans 350 €).
- **VPL no certificat o no inscrit** → no obligat a AOV (però sí denunciable per manca d'inscripció).

La diferenciació es fa per la **Massa en Ordre de Marxa (MOM)** que consta al Registre Nacional de Vehicles.

## ⚠️ Identificació M vs Z

- **Etiqueta M** = VMP **certificat** (comercialitzat des del 22/01/2024). Porta placa + etiqueta M.
- **Etiqueta Z** = VMP **no certificat** (anteriors al 22/01/2024). Règim transitori fins al **22/01/2027**.

## 📝 Operativa per l'agent

- Si el VMP **no està inscrit al RNV**, l'agent ha d'indicar **obligatòriament el pes** del vehicle a la butlleta (la MOM permet determinar si és VMP a motor o VPL).
- **No tramitar denúncies alhora** per "no certificat + no inscrit" ni "no placa + no certificat".
- **Menors d'edat (art. 82 LSV)**: pares/tutors responen **solidàriament** de la multa — fer constar les seves dades.

## 📜 Marc normatiu de referència

- RD 970/2020 — marc jurídic VMP
- Llei 5/2025, DA 1a — obligació d'assegurar VPL
- **RD 52/2026 (28 gen.)** — Registre Nacional de VPL · vigor 30/01/2026
- Comunicats 3/2026 i 4/2026 — sancions sense AOV
- **Comunicat 6/2026** — 5 noves infraccions · vigor 18/05/2026

> 💡 **Llegeix el comunicat complet:** detall de l'Annex XXI, formulació de denúncies i taula M/Z amb mnemotècnia.`,
    publishedAt: '2026-05-18',
    source: 'Servei Català de Trànsit · Comunicat informatiu 6/2026',
    tags: ['trànsit', 'VMP', 'VPL', 'SCT', 'sancions', 'registre vehicles'],
    featured: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/E-scooter_in_Helsinki.jpg/1200px-E-scooter_in_Helsinki.jpg',
    imageAlt: 'Patinet elèctric (VMP) circulant per ciutat',
    linkedTo: {
      moduleSlug: 'transit',
      slug: 'vmp-esquema-operativo-policial',
    },
  },

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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1200px-Flag_of_Spain.svg.png',
    imageAlt: 'Bandera d\'Espanya, símbol de la legislació estatal',
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Logotipo_DGT_Espa%C3%B1a.svg/1200px-Logotipo_DGT_Espa%C3%B1a.svg.png',
    imageAlt: 'Logotip de la Direcció General de Trànsit',
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/1200px-Flag_of_Catalonia.svg.png',
    imageAlt: 'Bandera de Catalunya — Generalitat',
    tags: ['catalunya', 'oposicions', 'mossos d\'esquadra', 'bombers', 'agents rurals'],
    featured: true,
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

  // ─── MARÇ 2026 — LEGISLACIÓ ESTATAL ────────────────────────────────

  {
    slug: 'mar2026-rdl-7-2026-pla-orient-mitja',
    title: 'RDL 7/2026 — Pla Integral de Resposta a la Crisi a Orient Mitjà',
    summary: 'Resposta urgent a la guerra oberta entre EUA-Israel i Iran (28 feb). Bloqueig d\'Ormuz, caiguda de borses, disrupció aèria. Mesures energètiques, laborals i tributàries. Vigent des del 22 de març.',
    body: `Pla integral aprovat al Consell de Ministres extraordinari del 20 de març de 2026 en resposta a l'inici de la **guerra oberta a Orient Mitjà** després de l'operació militar conjunta EUA-Israel contra Iran del 28 de febrer i la resposta iraniana.

## Context

El conflicte va provocar caiguda generalitzada de les borses, disrupció del trànsit aeri internacional i **bloqueig de l'estret d'Ormuz** (ruta del 20% del comerç mundial de petroli i gas).

## Mesures energètiques

- **Baixada** de l'Impost sobre Hidrocarburs i de l'Impost Especial sobre Electricitat.
- **IVA al 10%** de carburants i electricitat fins al 30 de juny de 2026 (sotmès a evolució de l'IPC).
- **Rebaixa del 80%** als peatges d'accés a les xarxes de transport i distribució durant tot 2026.
- **Reforç i pròrroga** del bo social elèctric i tèrmic durant 2026.
- **Prohibició de tall de subministrament** d'aigua i energia a consumidors vulnerables, ampliada fins al 31/12/2026.
- Flexibilització temporal dels contractes de subministrament elèctric i de gas natural.

## Mesures laborals

- Les empreses beneficiàries d'ajudes directes **no podran acomiadar** per causes econòmiques, tècniques, organitzatives, de producció ni per força major fins al 30 de juny de 2026.
- S'avança 12 mesos (al 5 de desembre de 2026) l'entrada en vigor de l'obligació d'elaborar **Plans de Mobilitat Sostenible al Treball** en empreses i entitats públiques amb més de 200 treballadors (o 100 per torn).

## Mesures tributàries

Es reintrodueixen les deduccions per:
- Obres de millora de l'eficiència energètica en habitatges.
- Adquisició de vehicles elèctrics endollables i de pila de combustible.
- Instal·lació de sistemes d'autoconsum renovable.

## Implicació indirecta per a la PL

> Vigilar tensions als sectors afectats (taxis, transport pesat, repartidors). Possible increment de protestes i bloquejos, sobretot a accessos a zones industrials i refineries. Coordinar amb Mossos / GC per als dispositius de manteniment de l'ordre públic.`,
    publishedAt: '2026-03-22',
    source: 'BOE núm. 71, de 21 de març de 2026 (correcció en BOE núm. 74). Convalidat al Congrés el 26 de març. Ref. BOE-A-2026-6544',
    sourceUrl: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-6544',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1200px-Flag_of_Spain.svg.png',
    imageAlt: 'Bandera d\'Espanya — Govern central',
    tags: ['legislació', 'crisi energètica', 'orient mitjà', 'IVA', 'plans mobilitat'],
    featured: true,
  },

  {
    slug: 'mar2026-rdl-8-2026-lloguer',
    title: 'RDL 8/2026 — Pròrroga extraordinària per a contractes de lloguer d\'habitatge habitual',
    summary: 'Aprovat en paral·lel al RDL 7/2026. Permet a l\'arrendatari sol·licitar pròrroga de fins a 2 anys addicionals per als contractes que vencin abans del 31/12/2027.',
    body: `Adoptat en paral·lel al RDL 7/2026, aquest decret introdueix una **pròrroga extraordinària** per als contractes d'arrendament d'habitatge habitual subjectes a la Llei 29/1994 que estiguessin vigents a l'entrada en vigor del decret i el període de pròrroga obligatòria o tàcita acabi abans del 31 de desembre de 2027.

## Característiques

- Pròrroga per **terminis anuals**, fins a un màxim de **2 anys addicionals**.
- A sol·licitud de l'arrendatari (no automàtica).
- L'arrendador està obligat a acceptar-la, llevat d'excepcions taxades:
  - Acord diferent entre les parts.
  - Nou contracte ja firmat.
  - Necessitat acreditada de l'arrendador d'ocupar l'habitatge.

## Per què

> Mesura conjuntural per protegir els llogaters davant la pujada generalitzada de preus i el context d'inestabilitat econòmica derivat de la crisi a Orient Mitjà.

## Implicació per a la PL

A intervencions per desnonaments o conflictes per impagament, comprovar si el contracte podia gaudir de pròrroga extraordinària. Si l'arrendador ha incomplert l'obligació de prorrogar, el desnonament pot ser nul.`,
    publishedAt: '2026-03-21',
    source: 'BOE de 21 de març de 2026',
    sourceUrl: 'https://www.boe.es',
    tags: ['legislació', 'lloguer', 'habitatge', 'desnonaments'],
  },

  {
    slug: 'mar2026-oep-estatal-2026',
    title: 'OEP estatal 2026: 2.704 places CNP escala bàsica + 150 escala executiva + Guàrdia Civil',
    summary: 'RD 207/2026 i RD 206/2026. CNP: 2.704 + 150 + 225 promoció interna. GC: 1.296 places militars + 240 Colegio Guardias Jóvenes.',
    body: `El Consell de Ministres va aprovar l'11 de març de 2026 dos reials decrets que estableixen l'oferta d'ocupació pública per als principals cossos estatals.

## Policia Nacional (RD 207/2026)

- **2.704 places** a l'escala bàsica (segona categoria).
  - **541 reservades a militars professionals de tropa i marineria** amb almenys 5 anys de servei.
- **150 places** a l'escala executiva (segona categoria).
- **225 places addicionals** per promoció interna des de subinspector.

Total CNP: **3.079 places** (incloent promoció).

## Guàrdia Civil (RD 206/2026)

- **1.296 places** reservades a militars de tropa/marineria.
- **240 places** per al Colegio de Guardias Jóvenes.

## Implicació per a opositors

> Si estàs preparant CNP o GC, aquesta és la convocatòria de l'any. Calendari habitual: bases al BOE durant el 2n trimestre, exàmens al 4t trimestre.

## Comparativa amb altres convocatòries

- Mossos d'Esquadra: 1.604 places (escala bàsica).
- PL Catalunya: ~1.200 places previstes en diversos municipis.

Total places de seguretat 2026: ~6.000 entre estatals + autonòmics + locals catalans.`,
    publishedAt: '2026-03-13',
    source: 'BOE núm. 62, de 13 de març de 2026. Ref. BOE-A-2026-5999 (CNP) i RD 206/2026 (GC)',
    sourceUrl: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-5999',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1200px-Flag_of_Spain.svg.png',
    imageAlt: 'Bandera d\'Espanya — convocatòria estatal',
    tags: ['legislació', 'oposicions', 'CNP', 'guàrdia civil', 'OEP estatal'],
    featured: true,
  },

  {
    slug: 'mar2026-rd-180-2026-sanitat-estrangers',
    title: 'RD 180/2026 — Atenció sanitària a estrangers en situació irregular',
    summary: 'Regula el dret a la protecció de la salut amb càrrec a fons públics per a persones estrangeres sense residència legal a Espanya.',
    body: `Regula el reconeixement del **dret a la protecció de la salut i a l'atenció sanitària amb càrrec a fons públics** per a persones estrangeres que es trobin a Espanya sense residència legal.

## Per què és rellevant

Reactiva i clarifica el dret de l'estranger irregular a l'atenció sanitària, després d'anys d'incertesa normativa des del RDL 16/2012.

## Implicació per a la PL

> En intervencions amb persones estrangeres en situació irregular que requereixin atenció mèdica:
>
> - Activar 061 / SEM com en qualsevol cas.
> - NO condicionar l'accés a l'atenció a la situació administrativa.
> - Si la persona requereix internament o ha estat víctima de delicte: facilitar accés a sanitat pública sense més requisits.

També rellevant per a unitats de proximitat amb població migrant.`,
    publishedAt: '2026-03-12',
    source: 'BOE de 12 de març de 2026',
    sourceUrl: 'https://www.boe.es',
    tags: ['legislació', 'sanitat', 'estrangeria', 'drets'],
  },

  {
    slug: 'mar2026-rd-238-2026-factura-electronica',
    title: 'RD 238/2026 — Factura electrònica obligatòria entre empresaris',
    summary: 'Estableix els requisits tècnics i d\'informació del sistema espanyol de factura electrònica obligatòria entre empresaris i professionals.',
    body: `Desenvolupa l'article 2 bis de la Llei 56/2007 i estableix:

- Requisits tècnics i d'informació del sistema espanyol de **factura electrònica obligatòria** entre empresaris i professionals.
- Requisits de les **plataformes d'intercanvi** de factures electròniques: interoperabilitat i interconnexió mínima.
- Regulació dels diferents **estats de les factures**.
- Obligacions de **subministrament d'informació** a l'administració.

## Implicació per a la PL

> Operacions amb facturacions sospitoses (frau fiscal, blanqueig): a partir d'ara, l'evidència electrònica ha d'estar al sistema oficial. Coordinar amb AEAT (Agència Tributària) i unitats especialitzades (Mossos GIE / Hisenda) en investigacions econòmiques.`,
    publishedAt: '2026-03-27',
    source: 'BOE de 27 de març de 2026',
    sourceUrl: 'https://www.boe.es',
    tags: ['legislació', 'factura electrònica', 'AEAT', 'frau fiscal'],
  },

  {
    slug: 'mar2026-rd-241-2026-revaloritzacio-pensions',
    title: 'RD 241/2026 — Revalorització de pensions per al 2026',
    summary: 'Estableix la limitació de la quantia inicial i la revalorització de les pensions del sistema de la Seguretat Social i altres prestacions per al 2026.',
    body: `Estableix:

- **Limitació** de la quantia inicial de les pensions públiques.
- **Revalorització** de les pensions del sistema de la Seguretat Social.
- Mateixes mesures per a **Classes Passives de l'Estat** i altres prestacions socials públiques per a l'exercici 2026.

## Per qui afecta

Beneficiaris de pensions de jubilació, invalidesa, viduïtat, orfandat, o altres prestacions a càrrec de la Seguretat Social.`,
    publishedAt: '2026-03-26',
    source: 'BOE de 26 de març de 2026',
    sourceUrl: 'https://www.boe.es',
    tags: ['legislació', 'pensions', 'seguretat social'],
  },

  // ─── MARÇ 2026 — TRÀNSIT I DGT ─────────────────────────────────────

  {
    slug: 'mar2026-33-radars-nous',
    title: '33 nous radars en 11 CCAA — comencen a sancionar a finals de març',
    summary: '20 fixos i 13 de tramo. Activació informativa el 27 de febrer; sanció efectiva des de finals de març (Setmana Santa). Forma part del Pla 2025-2026 (122 punts).',
    body: `La DGT va posar en marxa **33 nous punts de control de velocitat** entre febrer i març de 2026: **20 radars fixos i 13 de tramo**, repartits en onze comunitats autònomes.

## Calendari

- **27 de febrer de 2026**: activació operativa amb fase informativa (carta sense sanció).
- **Finals de març (Setmana Santa)**: comencen a sancionar amb normalitat.

## Pla 2025-2026

Forma part del Pla d'instal·lació de **122 nous punts** de control per a 2025-2026, dels quals ja són operatius **106**.

## Ubicacions destacades

- **Comunitat Valenciana**: dos radars de tramo a Alacant (A-31 i A-7), un fix addicional a Alacant.
- **Castella i Lleó**: Àvila (4 radars de tramo: dos a la AV-562 i dos a la N-403), Lleó (CL-623), Segòvia (SG-205), Valladolid (VA-30).
- **Cantàbria**: tres fixos a N-611, CA-142 i CA-141.
- **Astúries**: AS-116 i AS-377.
- **Galícia**: A Corunya (N-550), Pontevedra (VG-20).
- **Aragó**: dos a la N-232 (Saragossa).
- **Madrid**: nous radars a Galapagar operatius des del 23 de març.

## Implicació per a la PL

> Si patrulles a vies on hi ha nous radars de tramo, recordar que la mesura és la **velocitat mitjana** entre dos punts (no la puntual). Això redueix les possibilitats d'accelerar només davant la càmera.`,
    publishedAt: '2026-03-27',
    source: 'Direcció General de Trànsit',
    sourceUrl: 'https://www.dgt.es',
    tags: ['trànsit', 'DGT', 'radars', 'velocitat'],
  },

  {
    slug: 'mar2026-campanya-peatons-mobil',
    title: 'Campanya DGT sobre vianants i mòbil: "no quieres perderte nada y terminas perdiéndolo todo"',
    summary: 'Del 24 de març al 13 d\'abril de 2026. Alerta del risc del telèfon mòbil al creuar la calçada. 1 de cada 3 vianants creua mirant el dispositiu.',
    body: `La Direcció General de Trànsit va llançar la campanya amb el lema **"no quieres perderte nada y terminas perdiéndolo todo"**, centrada a alertar del risc de l'ús del telèfon mòbil al creuar la calçada.

## Període

Del **24 de març al 13 d'abril de 2026**.

## Dades clau

- Segons la DGT, **1 de cada 3 vianants** creua el carrer mirant el mòbil.
- Augmenta significativament el risc d'atropellament.

## Implicació per a la PL

> Encara que el vianant no comet sanció administrativa per anar mirant el mòbil, sí que pot ser un argument important en la **valoració de la culpa concurrent** en un atropellament. A diligències de sinistre amb vianant atropellat, fer constar a l'atestat si hi ha indicis (testimonis, càmeres) que el vianant anava utilitzant el mòbil.`,
    publishedAt: '2026-03-24',
    source: 'Direcció General de Trànsit',
    sourceUrl: 'https://www.dgt.es',
    tags: ['trànsit', 'DGT', 'campanyes', 'vianants', 'mòbil'],
  },

  // ─── MARÇ 2026 — CATALUNYA ─────────────────────────────────────────

  {
    slug: 'mar2026-decret-llei-1-2026-dependencia',
    title: 'Decret-llei 1/2026 — prestacions per a grau III+ de dependència extrema',
    summary: 'Antecedent directe del Decret-llei 4/2026 d\'abril. Regula prestacions econòmiques per a persones amb grau III+ i modifica la Llei 12/2007 de serveis socials.',
    body: `Regula les **prestacions econòmiques** per a persones amb **grau III+ de dependència extrema** i modifica la Llei 12/2007, d'11 d'octubre, de serveis socials.

## Per què és rellevant

És l'**antecedent directe** del Decret-llei 4/2026 d'abril, que va ampliar i aprofundir aquestes mesures (vegeu notícia separada d'abril). Els dos decrets responen a la saturació estructural dels serveis socials i els equips de valoració de la dependència.

## Implicació per a la PL

> Les PL són sovint el primer punt de contacte amb persones grans soles, persones amb discapacitat severa o famílies en risc. En detectar una situació de dependència no atesa, derivar a serveis socials municipals i, si és greu, activar el protocol d'urgència social.`,
    publishedAt: '2026-03-19',
    source: 'DOGC núm. 9628, de 19 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'serveis socials', 'dependència', 'decret-llei'],
  },

  {
    slug: 'mar2026-decret-llei-2-2026-suplement-credit',
    title: 'Decret-llei 2/2026 — suplement de crèdit als pressupostos prorrogats',
    summary: 'Concessió d\'un suplement de crèdit als pressupostos de la Generalitat per al 2023, prorrogats per segon any consecutiu davant la falta d\'aprovació de pressupostos propis.',
    body: `Concessió d'un **suplement de crèdit** als pressupostos de la Generalitat de Catalunya per al 2023, **prorrogats per segon any consecutiu** per al 2026 davant la manca d'aprovació de pressupostos propis.

## Context polític

> Catalunya viu en pròrroga pressupostària des del 2023. Aquesta situació limita la capacitat d'inversió i obliga a aprovar suplements de crèdit puntuals per cobrir necessitats sobrevingudes (sanitat, educació, serveis socials, seguretat).

## Implicació indirecta per a la PL

Encara que el decret no afecti directament la policia, els pressupostos prorrogats limiten la capacitat de noves places, equipaments i programes específics. Cal seguir l'evolució dels pressupostos 2027 per saber l'horitzó de noves convocatòries.`,
    publishedAt: '2026-03-23',
    source: 'DOGC de 23 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'pressupostos', 'generalitat', 'pròrroga'],
  },

  {
    slug: 'mar2026-decret-llei-3-2026-fiscal-urbanisme',
    title: 'Decret-llei 3/2026 — paquet de mesures urgents (fiscal, urbanisme, habitatge, personal)',
    summary: 'Modifica diverses normes (funció interventora, finances públiques, dret a l\'habitatge, TRLU). Inclou modificacions que afecten Agents Rurals i Agència de Ciberseguretat.',
    body: `Paquet de **mesures urgents** en diversos àmbits: fiscal, simplificació i agilització en la gestió, urbanisme i habitatge, personal, i altres mesures urgents en pròrroga pressupostària.

## Què modifica

- **Llei 16/1984** de la funció interventora.
- **Text refós de la Llei de finances públiques**.
- **Llei 18/2007** del dret a l'habitatge.
- **TRLU** (Text refós de la Llei d'urbanisme).
- Normativa relativa al **cos d'Agents Rurals** i a l'**Agència de Ciberseguretat de Catalunya**.

## Tarifa CO₂ vehicles N1

Aprova la **tarifa de l'impost sobre les emissions de CO₂ dels vehicles de tracció mecànica** de l'exercici 2025 corresponent a vehicles de la **categoria N1 (furgonetes)**.

## Implicació per a la PL

> A controls d'identificació i circulació, recordar:
>
> - Els canvis al règim d'Agents Rurals poden afectar les coordinacions amb aquest cos en territoris naturals (parcs, espais protegits).
> - L'Agència de Ciberseguretat reforça la seva capacitat: les PL han de coordinar amb ella en incidents informàtics rellevants.
> - Tarifa CO₂ furgonetes: comprovar a SIPER el règim fiscal del vehicle si hi ha sospita d'evasió.`,
    publishedAt: '2026-03-25',
    source: 'DOGC núm. 9632, de 25 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'decret-llei', 'urbanisme', 'habitatge', 'agents rurals', 'ciberseguretat'],
  },

  {
    slug: 'mar2026-llei-3-2026-aran',
    title: 'Llei 3/2026 — règim jurídic aplicable a Aran',
    summary: 'Modifica el text refós de la Llei municipal i de règim local de Catalunya per reforçar la singularitat institucional, cultural, històrica i lingüística d\'Aran.',
    body: `Modifica el text refós de la Llei municipal i de règim local de Catalunya en relació amb el **règim jurídic aplicable a Aran**, reforçant la seva singularitat institucional, cultural, històrica i lingüística com a entitat territorial occitana dins de Catalunya.

## Singularitat aranesa

Aran és l'única entitat territorial de Catalunya amb llengua oficial pròpia (occità, en la variant aranesa) reconeguda a l'EAC i al RD respectiu. Té institucions pròpies: el **Conselh Generau d'Aran** i el **Síndic d'Aran**.

## Implicació per a la PL

> Si la PL d'algun municipi català actua a Aran (o es coordina amb la PL de Vielha-Mijaran o altres municipis aranesos), recordar:
>
> - L'occità és llengua oficial al territori — recomanable atenció bàsica en aranès.
> - Les ordenances municipals d'Aran poden tenir especificitats culturals (festes tradicionals com el Crema deth Haro, etc.).`,
    publishedAt: '2026-03-13',
    source: 'DOGC de 13 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'aran', 'occità', 'règim local'],
  },

  {
    slug: 'mar2026-llei-2-2026-impost-turisme',
    title: 'Llei 2/2026 — impost sobre estades en establiments turístics (vigor 1 abril)',
    summary: 'Modifica l\'impost i crea la taxa per la gestió del recàrrec municipal. Permet als ajuntaments aprovar imports diferents per codi postal i període, amb límit màxim.',
    body: `**Modificació** de l'impost sobre les estades en establiments turístics i creació de la **tasa pel servei de gestió i recaptació del recàrrec municipal** de l'impost.

## Novetat clau

> Permet als ajuntaments aprovar **imports diferents segons codi postal i període** de liquidació, amb un límit màxim establert per la llei.

Això habilita una **regulació geogràfica** del turisme dins d'un mateix municipi: tarifes més altes a zones de pressió turística (Ciutat Vella de Barcelona, Eixample, Sant Martí), més baixes a zones perifèriques.

## Vigor

A partir de l'**1 d'abril de 2026**.

## Implicació per a la PL

A intervencions a establiments turístics (HUTS, hotels, hostals, càmpings), comprovar que disposin de la documentació fiscal corresponent. La PL pot col·laborar amb Hisenda municipal a inspeccions conjuntes.

També rellevant per a la lluita contra els pisos turístics il·legals: la falta d'imposició és un dels indicadors d'irregularitat.`,
    publishedAt: '2026-03-10',
    source: 'DOGC de 10 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'impostos', 'turisme', 'HUTS'],
  },

  {
    slug: 'mar2026-decret-45-2026-presidencia',
    title: 'Decret 45/2026 — reestructuració parcial del Departament de la Presidència',
    summary: 'Reorganització de l\'estructura interna del Departament de la Presidència de la Generalitat.',
    body: `Reorganitza l'**estructura del Departament de la Presidència** de la Generalitat de Catalunya.

## Implicació indirecta

Reestructuracions departamentals afecten les vies de coordinació institucional. Els municipis i les PL han d'actualitzar contactes en cas que canviïn interlocutors a les diferents direccions generals.`,
    publishedAt: '2026-03-26',
    source: 'DOGC de 26 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    tags: ['catalunya', 'generalitat', 'presidència', 'reestructuració'],
  },

  {
    slug: 'mar2026-oep-mossos-2026-oficial',
    title: 'OEP Mossos 2026 oficial — 1.604 places escala bàsica (objectiu 25.000 efectius)',
    summary: 'Aprovació formal al DOGC. Forma part de l\'objectiu d\'arribar a 25.000 efectius de Mossos el 2030. Convocatòria prevista per al 2T del 2026.',
    body: `La Generalitat va aprovar **formalment** l'oferta pública d'ocupació del 2026, amb un total de **8.474 places**.

## Distribució en cossos operatius

- **Mossos d'Esquadra**: **1.604 places** (escala bàsica) — supera les 1.587 de la convocatòria anterior.
- **Bombers de la Generalitat**: 23 places.
- **Agents Rurals**: 12 places.
- **Execució Penal**: 174 places.

## Objectiu estratègic

> Forma part de l'objectiu d'arribar als **25.000 efectius de Mossos el 2030** (actualment ~20.000).

## Calendari

Convocatòria prevista per al **segon trimestre del 2026**. Bases definitives al DOGC pròximament.

## Per a opositors

L'aplicació InfoPol té tests d'oposició del temari oficial complet (CE78, EAC, LOPSC, LOFCS, CP, LECrim, LOSSP, LPC, codi ètica, armament, LECrim, LOPVVD, LO 5/2000 menors, LEPAR, LPAC). El sistema de repàs de fallades amb mètode Anki (vegeu notícia d'abril) facilita el manteniment del que ja saps.`,
    publishedAt: '2026-03-26',
    source: 'DOGC núm. 9633, de 26 de març de 2026',
    sourceUrl: 'https://dogc.gencat.cat',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/1200px-Flag_of_Catalonia.svg.png',
    imageAlt: 'Bandera de Catalunya — Mossos d\'Esquadra',
    tags: ['catalunya', 'oposicions', 'mossos d\'esquadra', 'OEP'],
    featured: true,
  },

  // ─── MARÇ 2026 — SUCCESSOS DESTACATS ───────────────────────────────

  {
    slug: 'mar2026-macrooperatiu-mafia-turca',
    title: 'Macrooperatiu coordinat Mossos + CNP + Europol contra la mafia turca a Barcelona, Girona i Màlaga',
    summary: 'Tràfic internacional d\'armes i drogues. Més de 6 detinguts en la primera fase. Una desena d\'entrades simultànies a 3 províncies.',
    body: `El 23 de març de 2026 es va dur a terme un operatiu coordinat entre **Mossos d'Esquadra, Policia Nacional i Europol** iniciat a les 6 del matí a Barcelona contra una organització vinculada presumptament a la **mafia turca**, dedicada al tràfic internacional d'armes i drogues.

## Resultats inicials

- **Més de 6 detinguts** en la primera fase.
- **Més d'una desena d'entrades i registres simultanis**.
- Ubicacions: àrea metropolitana de Barcelona, demarcació de Girona, província de Màlaga.

## Suport tècnic

- **Policia Científica** per a inspeccions i diligències evidencials.
- **Unitat Canina** (canins detectors d'estupefaents i armes).
- Equips de seguretat ciutadana com a perímetre.
- **Col·laboració internacional d'Europol**.

## Per què és rellevant

> Mostra el nivell de coordinació trinacional (Mossos + CNP + Europol) en operatius contra crim organitzat transnacional. La presència de la mafia turca a Espanya és creixent, sovint vinculada a tràfic d'armes i estupefaents en ruta UE-Orient Mitjà.

## Implicació per a la PL

Si la vostra PL participa o és perimetral en operatius d'aquest tipus, recordar:
- Coordinar amb la sala 112 i amb el comandament de Mossos al territori.
- Mantenir distància segura — armes i possible resistència.
- No interferir amb la cadena de custòdia d'evidències.`,
    publishedAt: '2026-03-23',
    source: 'Mossos d\'Esquadra + CNP + Europol',
    tags: ['successos', 'mossos', 'CNP', 'europol', 'mafia turca', 'crim organitzat'],
    featured: true,
  },

  {
    slug: 'mar2026-pla-kanpai-87-detinguts',
    title: 'Pla Kanpai — 87 detinguts per multirreincidència a Barcelona i àrea metropolitana',
    summary: 'Madrugada del 21 març. 293 antecedents acumulats. 1.063 identificats. Impacte també a Badalona, Sabadell i L\'Hospitalet.',
    body: `Els Mossos d'Esquadra van detenir **87 persones** la matinada del **21 de març de 2026** a Barcelona i una desena de municipis propers en una operació contra la **multirreincidència**, amb **293 antecedents acumulats** entre tots els detinguts.

## Resultats a Barcelona

- **1.063 persones identificades**.
- **42 detencions** per delictes d'estrangeria, trencaments de condemna i violència de gènere.
- Requisades armes.
- Tramitades més de **200 denúncies administratives**.

## Impacte territorial

El dispositiu va tenir impacte també a **Badalona, Sabadell i L'Hospitalet de Llobregat**, amb:
- Incautació de patinets elèctrics (sospita de robatori).
- Inspecció de comerços (botigues amb sospita de venda d'objectes robats o substàncies prohibides).

## Per què és rellevant

> El Pla Kanpai s'emmarca en l'estratègia coordinada Mossos + PL contra la multirreincidència delictiva, una línia política reforçada precisament per la **LO 1/2026 de multirreincidència** publicada al BOE l'abril de 2026 (vegeu notícia separada).

## Implicació operativa

A intervencions amb persones identificades amb antecedents per delicte lleu reiterat:
- Comprovar via SIPER el nombre de condemnes anteriors.
- Si concorre multirreincidència (3+ condemnes fermes en 5 anys del mateix tipus), la qualificació jurídica del nou fet pot canviar (delicte lleu → menys greu).`,
    publishedAt: '2026-03-21',
    source: 'Mossos d\'Esquadra',
    tags: ['successos', 'mossos', 'pla kanpai', 'multirreincidència', 'barcelona', 'badalona'],
    featured: true,
  },

  // ─── MARÇ 2026 — INTERNACIONAL ─────────────────────────────────────

  {
    slug: 'mar2026-inici-guerra-orient-mitja',
    title: 'Inici de la guerra oberta a Orient Mitjà — Operació militar conjunta EUA + Israel contra Iran (28 feb)',
    summary: 'Bloqueig de l\'estret d\'Ormuz, caiguda de borses, disrupció aèria internacional. Motiva el RDL 7/2026 espanyol amb mesures econòmiques d\'emergència.',
    body: `Operació militar conjunta d'**Estats Units i Israel contra el règim d'Iran**, iniciada el 28 de febrer de 2026, i resposta iraniana. El conflicte s'ha desenvolupat durant tot març amb:

## Conseqüències globals

- **Caiguda generalitzada** de les borses mundials.
- **Disrupció del trànsit aeri internacional**.
- **Bloqueig de l'estret d'Ormuz**, ruta clau del comerç mundial de gas i petroli (~20% global).
- **Volatilitat sostinguda** als mercats energètics, amb preus superiors als previs a la crisi.
- **Augment de la inflació** i dels costos energètics per a llars i empreses a tota Europa.

## Resposta espanyola

És el conflicte que motiva el **RDL 7/2026 espanyol del Pla Integral de Resposta a la Crisi a Orient Mitjà** (vegeu notícia separada): IVA reduït de carburants, prohibició de tall de subministrament a vulnerables, deduccions fiscals per eficiència energètica i vehicles elèctrics.

## Continuïtat a abril

Els atacs creuats Líban / Israel / Iran continuen els primers dies d'abril (vegeu notícia d'abril 2026), incloent l'abatiment del general Majid Khademi (cap d'Intel·ligència de la Guàrdia Revolucionària iraniana).

## Implicació indirecta a Espanya

> Vigilància reforçada a llocs sensibles (sinagogues, mesquites, ambaixades) per part de FCS. Possibles tensions a la diàspora iraniana / israeliana / àrab a Catalunya.`,
    publishedAt: '2026-03-01',
    source: 'Premsa internacional, febrer-març 2026',
    tags: ['internacional', 'EUA', 'Israel', 'Iran', 'orient mitjà', 'guerra'],
    featured: true,
  },

  {
    slug: 'mar2026-calendari-electoral-llatinoamerica',
    title: 'Any electoral decisiu a Amèrica Llatina — 47% dels habitants voten el 2026',
    summary: 'Costa Rica obre el cicle, Perú continua. Resten Colòmbia (maig), Haití (agost) i Brasil (octubre, Lula busca reelecció). Presència explícita de Trump com a agent extern.',
    body: `Març confirma 2026 com a **any electoral decisiu a Amèrica Llatina**, amb prop del **47% dels habitants de la regió afrontant eleccions presidencials**.

## Calendari electoral

- **Costa Rica** — obertura del cicle (febrer).
- **Perú** — continua (segona volta a abril).
- **Colòmbia** — maig.
- **Haití** — agost.
- **Brasil** — octubre, amb **Lula da Silva** buscant reelecció.

## Context geopolític

> Tots els processos queden marcats per l'**omnipresència de Donald Trump com a gran agent extern**, amb un discurs explícit d'alineament hemisfèric i pressió sobre candidats.

## Implicació indirecta a Espanya

La diàspora llatinoamericana a Espanya és nombrosa: ecuatorians, colombians, peruans, brasilers, mexicans, veneçolans... Els processos electorals solen generar **mobilitzacions a consolats** durant les campanyes i el dia electoral.

A Catalunya: vigilància reforçada a consolats de Barcelona durant els pics electorals (concentracions, possibles incidents si els resultats són controvertits).`,
    publishedAt: '2026-03-15',
    source: 'Premsa internacional, març 2026',
    tags: ['internacional', 'amèrica llatina', 'eleccions', 'trump'],
  },

  {
    slug: 'mar2026-cumbre-celac-bogota',
    title: 'Cumbre CELAC i Foro CELAC-África a Bogotá — Petro i Lula es reuneixen',
    summary: 'El 21 de març. Lula critica les accions d\'EUA sobre Veneçuela i Cuba; Petro qüestiona la capacitat de l\'ONU per evitar conflictes.',
    body: `Reunió bilateral a Bogotá el 21 de març entre **Gustavo Petro** (Colòmbia) i **Luiz Inácio Lula da Silva** (Brasil) en el marc de l'encontre de la **Comunitat d'Estats Llatinoamericans i Caribenys (CELAC)** i del **Fòrum d'Alt Nivell CELAC-Àfrica**.

## Posicions destacades

- **Lula** va criticar les accions dels Estats Units sobre Veneçuela i Cuba.
- **Petro** va qüestionar la capacitat de l'**ONU** per evitar conflictes (en al·lusió tant a Orient Mitjà com a Amèrica Llatina).

## Per què és rellevant

> Reflecteix la **polarització Sud Global vs Nord Global** que defineix la política internacional al 2026. CELAC busca consolidar un bloc llatinoamericà més autònom respecte als EUA, alhora que aprofundeix relacions amb Àfrica.`,
    publishedAt: '2026-03-21',
    source: 'Premsa internacional, març 2026',
    tags: ['internacional', 'CELAC', 'Brasil', 'Colòmbia', 'diplomàcia'],
  },

  {
    slug: 'mar2026-veneçuela-post-maduro',
    title: 'Veneçuela post-Maduro — Delcy Rodríguez presidenta encarregada, sense calendari electoral',
    summary: 'Després del derrocament de Maduro a inicis del 2026 per intervenció unilateral d\'EUA. Diosdado Cabello descarta eleccions a curt termini. María Corina Machado anuncia disposició a presentar-se.',
    body: `Març de 2026 transcorre amb la nova **presidenta encarregada de Veneçuela, Delcy Rodríguez**, en un escenari obert tras el **derrocament de Nicolás Maduro** a inicis d'any per una **intervenció unilateral dels Estats Units**.

## Posicions

- **Diosdado Cabello** (Ministeri de l'Interior veneçolà) declara que en el curt termini **no hi ha plans d'organitzar eleccions presidencials**.
- **María Corina Machado** (líder opositora) anuncia la seva **disposició a presentar-se com a candidata** si es convoquen comicis.

## Context

L'escenari veneçolà segueix sent altament inestable, amb tensions internes entre faccions del govern Rodríguez i pressió internacional per a una transició democràtica.

## Implicació indirecta a Espanya

> Espanya té una de les diàspores veneçolanes més grans d'Europa (especialment Madrid, Galícia, Canàries i Catalunya). Possibles concentracions als consolats veneçolans i embaixada a Madrid; vigilància reforçada per part de FCS.

També rellevant per a tràmits d'asil i protecció internacional: Espanya manté línia de protecció subsidiària per a veneçolans amb perfil polític sensible.`,
    publishedAt: '2026-03-25',
    source: 'Premsa internacional, març 2026',
    tags: ['internacional', 'Veneçuela', 'EUA', 'transició política'],
  },

  // ─── FEBRER 2026 — LEGISLACIÓ ESTATAL ──────────────────────────────

  {
    slug: 'feb2026-rdl-2-2026-vulnerabilitat',
    title: 'RDL 2/2026 — mesures urgents en vulnerabilitat social i finançament territorial (DEROGAT)',
    summary: 'Ampliava la suspensió de desnonaments, prorrogava bo social i prohibia talls de subministraments. Derogat pel Congrés el 26 de febrer; gran part del contingut va tornar al RDL 7/2026 de març.',
    body: `Reial Decret-llei aprovat per fer front a situacions de vulnerabilitat social, en matèria tributària i relativa als recursos dels sistemes de finançament territorial.

## Què contemplava

- **Actualització de les entregues a compte** a les CCAA per al 2026.
- **Suspensió de desnonaments i llançaments** en supòsits de vulnerabilitat fins al 31 de desembre de 2026.
- **Pròrroga del bo social elèctric i tèrmic**.
- **Prohibició de tall de subministraments bàsics** a consumidors vulnerables.
- **Deduccions fiscals** per obres d'eficiència energètica i vehicles elèctrics.

## Derogació al Congrés

> El **26 de febrer de 2026** el Congrés dels Diputats el va derogar (BOE-A-2026-4667). Una part important del contingut es va reintroduir posteriorment al **RDL 7/2026 de març** (Pla Integral de Resposta a la Crisi a Orient Mitjà; vegeu notícia separada de març).

## Implicació operativa

Durant el període de vigència (4 al 26 de febrer), les mesures eren plenament aplicables. Tot i la derogació posterior, els actes administratius dictats al seu empara mantenen la seva validesa.

> Per a la PL: rellevant en intervencions per desnonaments durant aquell període. La cobertura del decret derogat continua aplicable als procediments iniciats abans del 26 de febrer.`,
    publishedAt: '2026-02-04',
    source: 'BOE núm. 31, de 4 de febrer de 2026. Ref. BOE-A-2026-2547. Derogació: BOE-A-2026-4667',
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2026-2547',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1200px-Flag_of_Spain.svg.png',
    imageAlt: "Bandera d'Espanya — legislació estatal",
    tags: ['legislació', 'vulnerabilitat', 'desnonaments', 'bo social', 'derogat'],
    featured: true,
  },

  {
    slug: 'feb2026-rdl-3-2026-revaloritzacio-pensions',
    title: 'RDL 3/2026 — revalorització de pensions del 2,7% i altres mesures urgents',
    summary: 'Pensions contributives +2,7% respecte 31/12/2025. Límit màxim 3.359,60 €/mes. Complement de bretxa de gènere a 36,90 €/mes. Pensions no contributives 8.803,20 €/any.',
    body: `Per al 2026 les pensions contributives i les de classes passives es revaloritzen amb caràcter general en un **2,7%** respecte al seu import a 31 de desembre de 2025.

## Xifres clau

- **Límit màxim** de pensions públiques: **3.359,60 €/mes**.
- **Complement de bretxa de gènere**: **36,90 €/mes**.
- **Pensions no contributives** d'invalidesa i jubilació: **8.803,20 €/any**.

## Bombers i agents forestals

Estableix un **tipus de cotització addicional del 10,60%** per a bombers forestals i agents forestals com a contrapartida del reconeixement d'un coeficient reductor a la seva edat de jubilació.

## Metges del SNS

Prorroga fins al **31 de desembre de 2026** la mesura que permet a metges de família i pediatres del SNS **compatibilitzar el 75% de la seva pensió** de jubilació amb la continuïtat al servei actiu.

## Per a opositors

> Si estàs opositant a Mossos, Bombers de la Generalitat o Agents Rurals, recorda que aquests cossos també tenen coeficients reductors propis a la seva edat de jubilació, regulats per normativa específica.`,
    publishedAt: '2026-02-04',
    source: 'BOE núm. 31, de 4 de febrer de 2026. Ref. BOE-A-2026-2548',
    sourceUrl: 'https://www.boe.es/boe/dias/2026/02/04/pdfs/BOE-S-2026-31.pdf',
    tags: ['legislació', 'pensions', 'seguretat social', 'bombers forestals', 'SNS'],
  },

  {
    slug: 'feb2026-conveni-oit-maternitat',
    title: 'Espanya publica el Conveni OIT sobre protecció de la maternitat',
    summary: 'Reconeix llicència de maternitat d\'almenys 14 setmanes i prohibeix l\'acomiadament d\'embarassades. Revisa el Conveni de 1952.',
    body: `Espanya publica al BOE el **Conveni sobre la protecció de la maternitat de l'OIT**, que revisa el Conveni (revisat) de 1952.

## Mesures principals

- Reconeix a tota dona una **llicència de maternitat d'almenys 14 setmanes**.
- Estableix que les **prestacions pecuniàries** han de garantir a la dona i al fill **condicions de salut adequades i nivell de vida adequat**.
- **Prohibeix a l'empresari acomiadar** una dona embarassada.

## Marc jurídic intern

> A Espanya, la durada del permís de maternitat ja era de 16 setmanes (i el de paternitat també està equiparat des del 2021). El Conveni OIT estableix un mínim que la legislació espanyola supera.

## Per a la PL

A diligències per VG / VD on hi hagi una víctima embarassada o amb fills lactants, la coordinació amb els serveis socials i de salut ha d'incloure l'aplicació de protocols específics i recordar el dret a la prestació econòmica.`,
    publishedAt: '2026-02-10',
    source: 'BOE núm. 36, de 10 de febrer de 2026. Ref. BOE-A-2026-3010',
    sourceUrl: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3010',
    tags: ['legislació', 'OIT', 'maternitat', 'drets laborals'],
  },

  // ─── FEBRER 2026 — TRÀNSIT I DGT ───────────────────────────────────

  {
    slug: 'feb2026-activacio-33-radars',
    title: 'Activació dels 33 nous radars (fase informativa) — 27 de febrer',
    summary: '20 radars fixos i 13 de tramo en 11 CCAA. El primer mes envien carta sense sancionar; sancions efectives al final de març.',
    body: `La DGT va posar en funcionament **33 nous punts de control de velocitat** a carreteres de **11 comunitats autònomes** el 27 de febrer de 2026: 20 radars fixos i 13 de tramo.

## Pla 2025-2026

Forma part del Pla d'instal·lació de **122 nous punts** de control per al període 2025-2026.

## Calendari de l'activació

- **27 de febrer** — Activació amb fase informativa: carta als conductors que excedeixen el límit, sense sanció.
- **Final de març** — Inici del període sancionador efectiu.

## Marc sancionador

> Les multes per excés de velocitat poden anar de **100 a 600 €** i comportar la pèrdua de punts del carnet en funció de l'excés comès.

## Continuïtat al març

A l'abril, la totalitat dels 33 radars ja estan sancionant. Vegeu la notícia de març amb les ubicacions detallades.`,
    publishedAt: '2026-02-27',
    source: 'Direcció General de Trànsit',
    sourceUrl: 'https://www.dgt.es/comunicacion/notas-de-prensa/20260227-Trafico-33-nuevos-radares-carreteras/',
    tags: ['trànsit', 'DGT', 'radars', 'velocitat'],
  },

  {
    slug: 'feb2026-balisa-v16-vigor',
    title: 'Balisa V-16 connectada — obligatorietat plena consolidada al febrer',
    summary: 'Únic mitjà legal per senyalitzar vehicles aturats. Substitueix definitivament els triangles. Sanció 80 €. AEPD confirma que les dades són anonimitzades.',
    body: `Des de l'1 de gener de 2026 (i consolidada al febrer), la **balisa V-16 connectada** és l'**únic mitjà legal** per senyalitzar vehicles immobilitzats per avaria o accident, substituint definitivament els triangles d'emergència.

## Sanció

La infracció per **no portar la balisa V-16** és lleu: **80 €**.

## Funcionament i privacitat

El dispositiu emet una senyal mentre està encès i deixa de fer-ho en apagar-lo, **sense generar historial de moviments**. L'**AEPD** (Agència Espanyola de Protecció de Dades) ha confirmat:

> La balisa **NO està associada a una persona o matrícula**. Les dades enviades a la DGT són **anonimitzades**.

## Plataforma DGT 3.0

A través de la plataforma DGT 3.0 es centralitza la informació en temps real per a:

- Conductors (avisos via apps i navegadors).
- Serveis d'emergència.
- Gestors d'infraestructures.

També integra dades del **Servei Català de Trànsit** i de la **Direcció de Trànsit del Govern Basc**.

## Implicació per a la PL

> A controls rutinaris, comprovar que el conductor porta la V-16 connectada (no l'antiga V-16 sense connectivitat IoT, que ja NO compleix la normativa). Si en mostra una de no connectada → infracció (80 €).`,
    publishedAt: '2026-02-15',
    source: 'DGT + AEPD',
    sourceUrl: 'https://www.dgt.es/muevete-con-seguridad/tecnologia-e-innovacion-en-carretera/Dispositivos-de-presenalizacion-V16/',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Logotipo_DGT_Espa%C3%B1a.svg/1200px-Logotipo_DGT_Espa%C3%B1a.svg.png',
    imageAlt: 'Logotip de la Direcció General de Trànsit',
    tags: ['trànsit', 'DGT', 'V16', 'AEPD', 'DGT 3.0'],
  },

  // ─── FEBRER 2026 — CATALUNYA ───────────────────────────────────────

  {
    slug: 'feb2026-llei-1-2026-presons',
    title: 'Llei 1/2026 — personal de centres penitenciaris reconegut com a agents de l\'autoritat',
    summary: 'Equipara els funcionaris de presons al règim dels Mossos d\'Esquadra: condició d\'agent de l\'autoritat + obligació d\'indemnització de la Generalitat per lesions o danys en servei.',
    body: `Modificació del text únic de la Llei de la funció pública de l'Administració de la Generalitat de Catalunya (DL 1/1997).

## Què reconeix

- **La condició d'agents de l'autoritat** al personal funcionari i al personal directiu que exerceixen funcions de **règim interior i de rehabilitació** als **centres penitenciaris catalans** i que depenen orgànicament del departament competent en execució penitenciària.

## Equiparació amb altres cossos

> Equipara aquest personal a altres servidors públics especialment exposats a l'exercici de les seves funcions, com el **Cos de Mossos d'Esquadra**.

## Indemnitat

Reconeix expressament l'**obligació de la Generalitat d'indemnitzar** les lesions personals i danys materials que el personal pugui patir en l'exercici de les seves funcions, **llevat de dol o negligència**, garantint el principi d'indemnitat.

## Implicació operativa

A intervencions a centres penitenciaris, la Mossos pot requerir suport del personal de presons amb la mateixa consideració jurídica que entre cossos policials. També rellevant per a:

- Atestats per agressions a personal penitenciari (Art. 550 CP — atemptat a agent de l'autoritat).
- Coordinació en gestió d'incidents (motins, fugues).`,
    publishedAt: '2026-02-06',
    source: 'DOGC núm. 9599, de 6 de febrer de 2026. BOE núm. 46, de 20 de febrer de 2026',
    sourceUrl: 'https://noticias.juridicas.com/base_datos/CCAA/986751-l-1-2026-de-4-feb-ca-cataluna-modificacion-del-texto-unico-de-la-ley-de-la.html',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/1200px-Flag_of_Catalonia.svg.png',
    imageAlt: 'Bandera de Catalunya — Generalitat',
    tags: ['catalunya', 'execució penal', 'agents autoritat', 'funcionaris'],
    featured: true,
  },

  {
    slug: 'feb2026-erratas-llei-11-2025-habitatge',
    title: 'Correcció d\'errates de la Llei 11/2025 sobre habitatge i urbanisme',
    summary: 'Modifica diverses normes (Llei 3/2007 obra pública, Llei 13/1996 fiances, TRLU, Llei 18/2007, Decret-llei 1/2015, Llei 11/2022).',
    body: `Correcció d'errates de la **Llei 11/2025**, de 29 de desembre, de mesures en matèria d'habitatge i urbanisme. Modifica diversa normativa:

## Normes modificades

- **Llei 3/2007** de l'obra pública.
- **Llei 13/1996** del Registre i dipòsit de fiances dels contractes de lloguer.
- **Text refós de la Llei d'urbanisme (DL 1/2010)**.
- **Llei 18/2007** del dret a l'habitatge.
- **Decret-llei 1/2015** de mobilització d'habitatges després de processos d'execució hipotecària.
- **Llei 11/2022** de millorament urbà, ambiental i social dels barris.

## Per què és rellevant

Encara que es tracti formalment d'una correcció d'errates, els canvis poden afectar **procediments en curs** d'execució hipotecària, dipòsit de fiances o sancionadors urbanístics.

## Implicació per a la PL

> A intervencions per ocupacions, desnonaments o sancions urbanístiques municipals, comprovar la versió actualitzada de la norma. La PL no aplica directament aquesta legislació però sovint és primer interlocutor en incidents derivats.`,
    publishedAt: '2026-02-19',
    source: 'DOGC, 19 de febrer de 2026',
    sourceUrl: 'https://noticias.juridicas.com/base_datos/CCAA/983141-l-11-2025-de-29-dic-ca-cataluna-medidas-en-materia-de-vivienda-y-urbanismo.html',
    tags: ['catalunya', 'habitatge', 'urbanisme', 'fiances'],
  },

  {
    slug: 'feb2026-mossos-radicalitzacio-2025',
    title: 'Mossos detecten 204 casos de radicalització violenta el 2025',
    summary: 'Comissaria General d\'Informació. 161 casos de radicalització violenta + 47 impactes educatius/socials. 62% jihadisme · 11% ultradreta · 6% altres.',
    body: `La **Comissaria General d'Informació** dels Mossos d'Esquadra ha publicat el balanç de processos de radicalització detectats el 2025: **204 casos** en total.

## Distribució global

- **161 casos** de radicalització violenta.
- **47 impactes** educatius o socials gestionats mitjançant els **protocols Prev**.

## Distribució per tipologies

- **62% jihadisme** — la majoria dels casos.
- **11% ultradreta**.
- **6% altres tipologies extremistes**.
- Resta: pendent de catalogació.

## Coordinació

> Els Mossos van participar en **366 reunions** de coordinació interna i multiagència, incloent **policies locals i meses territorials**.

## Operació online

A l'àmbit digital, l'última operació conjunta mitjançant el **Protocol europeu de resposta davant crisis online**, coordinada per **Europol i Citco**, va retirar **més de 2.000 continguts** relacionats amb terrorisme i extremismes violents.

## Implicació per a la PL

A municipis amb meses territorials de radicalització:

- Coordinació regular amb Mossos i amb serveis socials.
- Detecció primerenca de canvis de comportament a entorns escolars o juvenils.
- No "criminalitzar" perfils prematurament: el protocol Prev és preventiu, no punitiu.`,
    publishedAt: '2026-02-15',
    source: 'Mossos d\'Esquadra — Comissaria General d\'Informació',
    sourceUrl: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-02-15/5772848-mossos-desquadra-detectan-204-casos-posible-radicalizacion-violenta-2025',
    tags: ['catalunya', 'mossos', 'radicalització', 'antiterrorisme', 'protocol prev'],
    featured: true,
  },

  // ─── FEBRER 2026 — SUCCESSOS DESTACATS ─────────────────────────────

  {
    slug: 'feb2026-pandilla-barrio-18',
    title: 'Detinguts líders de la Pandilla Barrio 18 a Barcelona — operatiu CGI + FBI',
    summary: '3 detinguts. Pretenien establir una nova "clica" a Barcelona ocupant l\'espai d\'una estructura desarticulada al 2023. Operació CGI + Brigada Provincial Informació + FBI.',
    body: `Operatiu de la **Comissaria General d'Informació (CGI)** i la **Brigada Provincial d'Informació de Barcelona**, amb suport del **FBI estadounidenc**.

## Resultats

- **3 detinguts**.
- Lideraven una nova **"cancha" o "clica" de la Mara Pandilla Barrio 18 ("Calle 18")** que pretenia establir-se a Barcelona, ocupant l'espai d'una estructura similar desarticulada el febrer de 2023 (**Operació Salvaguarda**).

## Càrrecs

- **Pertinença a organització criminal** (Art. 570 bis CP).
- **Lesions** (Art. 147 CP).
- **Amenaces** (Art. 169 CP).
- **Tinença il·lícita d'armes de foc** (Art. 564 CP).

## Modus operandi

> Realitzaven labors de **proselitisme a Nou Barris i L'Hospitalet de Llobregat**. S'havien dirigit a ciutadans d'origen llatinoamericà amb amenaces i agressions.

## Material intervingut

- Una **arma de foc artesanal** apta per a ús (coneguda com a "chilena") amb munició de calibre 12.
- **Simbologia de la banda**.

## Implicació per a la PL

A municipis amb població llatinoamericana significativa (Barcelona, L'Hospitalet, Badalona, Santa Coloma de Gramenet, Cornellà, Mataró), la PL ha de:

- Coordinar amb Mossos i CNP davant qualsevol indici de proselitisme de bandes (símbols, grafits, conductes intimidants).
- Recordar que la pertinença per simple membre és Art. 570 ter (penes inferiors al líder de l'Art. 570 bis).
- Documentar amb fotografies tota simbologia per facilitar identificació posterior.`,
    publishedAt: '2026-02-20',
    source: 'Policia Nacional / Mossos d\'Esquadra',
    sourceUrl: 'https://www.policia.es/_es/comunicacion_prensa_detalle.php?ID=16079',
    tags: ['successos', 'CNP', 'mossos', 'FBI', 'bandes', 'pandilla barrio 18'],
    featured: true,
  },

  // ─── FEBRER 2026 — INTERNACIONAL ───────────────────────────────────

  {
    slug: 'feb2026-inici-guerra-eua-israel-iran',
    title: 'Inici de la guerra EUA + Israel contra Iran — 28 de febrer',
    summary: 'Atacs sorpresa coordinats sobre ciutats iranianes durant negociacions a Ginebra. Resposta iraniana amb míssils sobre Israel i bases EUA al Golf. Cierre selectiu d\'Ormuz. Mort d\'Alí Khameneí.',
    body: `Les aviacions d'**Estats Units i Israel** van llançar **per sorpresa** una sèrie de bombardeigs coordinats sobre diverses ciutats d'Iran el dissabte **28 de febrer de 2026**, mentre estaven en curs negociacions diplomàtiques a Ginebra. L'operació havia estat planificada durant mesos.

## Resposta iraniana

- Llançament de **míssils balístics i drons** contra Israel i bases militars estadounidenques a **Bahrain, Kuwait, Catar, Emirats Àrabs Units, Aràbia Saudita, Jordània i Iraq**.
- **Cierre selectiu de l'estret d'Ormuz**, ruta crítica del comerç mundial de petroli i gas.

## Conseqüències immediates

- **Assassinat del líder suprem iranià Alí Khameneí** i d'alts comandaments militars.
- Atacs contra civils iranians, especialment l'atac contra l'**escola primària Shajare Tayebé** i el **pavelló esportiu de Lamerd**.
- Forta pujada del preu del petroli i gas natural a nivell global.
- Caiguda generalitzada de les borses mundials i disrupció del trànsit aeri.

## Resposta espanyola

> Aquest conflicte és la causa directa del **Reial Decret-llei 7/2026 espanyol** aprovat el 20 de març (Pla Integral de Resposta a la Crisi a Orient Mitjà; vegeu notícia separada de març).

## Antecedents

La guerra és la continuació de la **"Guerra dels Dotze Dies" (juny de 2025)** i de les **protestes iranianes de 2025-2026**, en un context de sancions agreujades per l'Administració Trump i reactivació de sancions de l'ONU a petició de França, Alemanya i Regne Unit.

## Implicació indirecta a Espanya

Vigilància reforçada a llocs sensibles (sinagogues, mesquites, ambaixades). Diàspora iraniana, israeliana i àrab a Catalunya pot patir tensions internes.`,
    publishedAt: '2026-02-28',
    source: 'Premsa internacional, febrer 2026',
    sourceUrl: 'https://es.wikipedia.org/wiki/Guerra_de_Estados_Unidos_e_Israel_contra_Ir%C3%A1n',
    tags: ['internacional', 'EUA', 'Israel', 'Iran', 'orient mitjà', 'guerra'],
    featured: true,
  },

  {
    slug: 'feb2026-veneçuela-intervencio-eua',
    title: 'Continuïtat de la intervenció dels EUA a Veneçuela',
    summary: 'Després de la captura de Maduro el 3 de gener, el febrer es consolida la nova situació amb Delcy Rodríguez encarregada. ~70 morts. Trump: EUA "administrarà" Veneçuela.',
    body: `Després de la captura de **Nicolás Maduro i la seva esposa el 3 de gener de 2026** mitjançant una operació militar estadounidenca amb bombardeigs a Caracas, Aragua i La Guaira, i el reconeixement formal del govern de **Delcy Rodríguez** per part dels EUA, durant el febrer es consolida la nova situació.

## Xifres

- La intervenció va causar **almenys 70 morts** segons fonts estadounidenques.
- Inclosos **32 agents cubans** identificats pel govern de Cuba.

## Mesures de l'administració Trump

- Designa el **Tren de Aragua, Mara Salvatrucha i altres 6 grups** amb seu a Mèxic com a **organitzacions terroristes estrangeres**.
- Restableix el reconeixement diplomàtic i consular amb el nou govern veneçolà (5 de març).
- Anuncia que **EUA "administrarà" Veneçuela** a l'espera d'una transició de poder, que Trump declara podria durar anys.
- Concedeix preferència a empreses estatunidenques en contractes petroliers i auríferes.

## Reacció internacional

> Experts en dret internacional qualifiquen l'operació de **contrària al dret internacional**, sense autorització del Consell de Seguretat de l'ONU ni del Congrés estadounidenc. El Ple del Consell de Drets Humans de l'ONU denuncia el bloqueig com a **"agressió armada il·legal"**.

## Implicació indirecta a Espanya

Espanya té una de les **diàspores veneçolanes més grans d'Europa** (especialment Madrid, Galícia, Canàries i Catalunya). Possibles concentracions als consolats i embaixada; vigilància reforçada per part de FCS.

També rellevant per a tràmits d'asil i protecció internacional: Espanya manté línia de protecció subsidiària per a veneçolans amb perfil polític sensible.`,
    publishedAt: '2026-02-15',
    source: 'Premsa internacional, gener-febrer 2026',
    sourceUrl: 'https://es.wikipedia.org/wiki/Ataque_estadounidense_a_Venezuela_de_2026',
    tags: ['internacional', 'Veneçuela', 'EUA', 'intervenció militar', 'transició política'],
  },

  {
    slug: 'feb2026-cartels-organitzacions-terroristes',
    title: 'Designació de càrtels llatinoamericans com a organitzacions terroristes',
    summary: 'Tren de Aragua, MS-13, CJNG i Cártel de los Soles entre els designats per Trump. Implicacions operatives per a cossos policials europeus en perseguir xarxes amb presència a Espanya.',
    body: `Confirmació durant el febrer del procés iniciat per l'**Administració Trump** de designar diverses organitzacions criminals transnacionals com a **organitzacions terroristes estrangeres**.

## Càrtels designats

- **Tren de Aragua** (Veneçuela).
- **Mara Salvatrucha (MS-13)** (centramericana, presència àmplia a EUA i Europa).
- **Cártel Jalisco Nueva Generación (CJNG)** (Mèxic, presència a 100 països).
- **Cártel de los Soles** (Veneçuela).

## Implicacions operatives a Europa

> Encara que la designació és estatunidenca, té impacte a Europa: més coordinació trinacional (DEA + Europol + cossos policials europeus), priorització en investigacions transnacionals i intercanvi reforçat d'informació.

## Implicació per a Espanya

Espanya té cèl·lules conegudes:

- **Tren de Aragua** — costa mediterrània, Andalusia, Catalunya.
- **MS-13** — Madrid, Barcelona, ciutats amb diàspora salvadorenca.
- **CJNG** — costa llevant i andalusa.

A municipis amb diàspora llatinoamericana significativa, la PL ha de:

- Estar atenta a símbols, grafits, conductes intimidants.
- Coordinar amb Mossos / CNP davant qualsevol indici de presència organitzada.
- Recordar la connexió possible amb la notícia de Pandilla Barrio 18 al febrer (vegeu notícia separada).`,
    publishedAt: '2026-02-22',
    source: 'Premsa internacional, febrer 2026',
    sourceUrl: 'https://es.wikipedia.org/wiki/Intervenci%C3%B3n_de_Estados_Unidos_en_Venezuela_de_2025-2026',
    tags: ['internacional', 'EUA', 'càrtels', 'terrorisme', 'tren de aragua', 'MS-13', 'CJNG'],
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

/** Categoria d'una notícia (amb default a 'noticies'). */
export function getCategory(n: Noticia): NoticiaCategoria {
  return n.category ?? 'noticies';
}

/** Filtre pel valor de categoria. */
export function getNoticiesByCategory(cat: NoticiaCategoria, items: Noticia[] = NOTICIES): Noticia[] {
  return items.filter((n) => getCategory(n) === cat);
}

/** Comptadors per categoria (per badges i tabs). */
export function getCategoryCounts(items: Noticia[] = NOTICIES): Record<NoticiaCategoria, number> {
  const out: Record<NoticiaCategoria, number> = {
    noticies: 0,
    personalitats: 0,
    premis: 0,
    esports: 0,
  };
  for (const n of items) {
    out[getCategory(n)]++;
  }
  return out;
}

/**
 * Llista de mesos amb notícies, ordenats desc, amb comptador.
 * Útil per renderitzar el selector de mes al llistat.
 */
export function getMonthBuckets(items: Noticia[] = NOTICIES): Array<{ key: string; count: number }> {
  const counts = new Map<string, number>();
  for (const n of items) {
    const k = getMonthKey(n.publishedAt);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, count]) => ({ key, count }));
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
