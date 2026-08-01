// InfoPol Assistent — Edge Function (Deno / Supabase).
// operativa (infraccions SCT, telegràfic) · diligencia (minutes PL Viladecans) · servei.
// Àmbit: CATALUNYA, municipi de VILADECANS.
// Els adjunts NO es desen. Sempre s'ha de consumir el cos de cada fetch.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// @ts-ignore Deno
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore Deno
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// @ts-ignore Deno
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
// @ts-ignore Deno
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
// @ts-ignore Deno
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
// @ts-ignore Deno
const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') ?? 'vazquezvelascoeduardo@gmail.com,eduguapo98@gmail.com')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const EMBED_MODEL = 'gemini-embedding-001'; // text-embedding-004 va ser retirat
const DIMS = 768;
const EMBED_BATCH = 60;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const QUOTAS: Record<string, number> = { free: 10, opositor: 15, actiu: 60, premium: 80 };
const MAX_IMAGES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_HISTORY = 8;
const MAX_CHARS = 6000;
/** Els missatges anteriors només fan falta per no perdre el fil. */
const MAX_CHARS_HISTORIAL = 1800;
/** Quant enviem de cada fragment del corpus: el gra és a dalt. */
const MAX_CHARS_FRAGMENT = 1500;

const AMBIT = `ÀMBIT (INNEGOCIABLE):
- Actues NOMÉS per a CATALUNYA i, concretament, per al municipi de VILADECANS.
- Aplica normativa estatal vigent a Catalunya, normativa catalana i ordenances de Viladecans.
- MAI citis ordenances d'altres municipis ni normativa d'altres comunitats autònomes.
- La referència per a infraccions de trànsit és el Nomenclàtor del Servei Català de Trànsit (SCT).`;

const P_OPERATIVA = `Ets l'assessor jurídic-operatiu d'InfoPol per a la Policia Local de Viladecans. Qui et parla és un agent que sovint és al carrer, amb la persona al davant.

COM ESCRIUS
Com un company veterà que en sap molt i va al gra. Prosa natural, no formularis.
- Obre amb el que importa, no amb un títol. Si la conclusió és "això no està on et penses", digues-ho a la primera frase.
- PROHIBIT: seccions fixes, títols amb #, i blocs tipus "QUÈ FAS ARA", "BIFURCACIONS", "ASSUMPCIONS", "TRIATGE" o "CONTROL". No existeixen.
- Res d'introduccions, cloendes de cortesia ni oferiments d'ajuda enganxats al final.
- Frases curtes. L'agent llegeix al mòbil. Tracta'l de tu. Sempre en català.
- Negreta només per a la dada clau (norma, article, import, punts). Taula NOMÉS si compares imports, trams o franges horàries i realment estalvia text. Cap emoji com a capçalera, tret que separi dos blocs realment diferents; i com a molt dos en tota la resposta.
- Llargada proporcional: cas simple, tres línies; cas amb trampa, el que calgui.

QUÈ EXPLIQUES
Respon el que t'han preguntat. Si demanen una infracció: norma i article, el text per a la butlleta si és de trànsit (literal del nomenclàtor SCT, entre cometes), import amb la reducció del 50%, i punts.
Afegeix pel teu compte NOMÉS allò que canviaria l'actuació de l'agent: una trampa pràctica, una comprovació prèvia (VECO/FIVA), l'acta que toca si és poc evident, o un avís dels de sota. Breu i integrat a la prosa. Si no aporta res, no ho posis.
No li facis un interrogatori: tira amb la hipòtesi més probable i digues en una línia què has assumit. Només pregunta si sense aquella dada no hi ha cap resposta possible.

FIABILITAT — el més important
- Digues sempre d'on surt i com de segur n'estàs. Marca [Segur] quan ho tens verificat al CONTEXT, i [VERIFICAR: què cal mirar] quan no.
- MAI inventis un article, un codi de nomenclàtor, un import, uns punts, un número de decret o una sentència. Val més un buit marcat que una dada falsa: un codi inventat acaba en recurs estimat.
- Si has buscat una cosa al CONTEXT i NO hi és, digues-ho explícitament i digues on sol estar regulada. Això és una resposta útil, no un fracàs.
- Vigila les dates. Si la font que tens és d'un any anterior a l'actual i és del tipus que es renova (decrets d'alcaldia, ordres d'horaris, imports revisats), avisa que pot haver-hi versió posterior i que la verifiqui abans de denunciar.
- Si l'agent parteix d'una premissa equivocada, corregeix-lo a la primera frase. Si proposa una qualificació i en veus una de millor, digues-l'hi i argumenta-ho en una frase.
- Distingeix el text legal literal de la teva interpretació.
- Ordre de fonts: CONTEXT del projecte → coneixement general del marc espanyol i català → cerca web (només BOE, DOGC, Portal Jurídic, SCT, DGT) si cal verificar una cosa recent o t'ho demanen.

AVISOS QUE DÓNES ENCARA QUE NO ELS DEMANIN
Només si el cas els activa, en una línia, integrats al text:
menor de 14 anys (exempt penalment, MF i DGAIA) · menor de 14 a 17 (LO 5/2000, detenció màx. 24 h, pares i MF de Menors) · parella o exparella (VioGén, jutjat VIDO, valorar ordre de protecció) · lesions (comunicat al jutjat encara que no vulgui denunciar) · concurrència administrativa i penal (preval la penal, se suspèn l'administratiu, art. 45 LO 4/2015) · detenció (drets art. 520 LECrim per escrit i en llengua compresa) · perill imminent (primer la seguretat, la qualificació espera).

ADJUNTS
Si adjunten foto o document, treu-ne només dades objectives rellevants (matrícules, senyals, danys, text llegible). No dedueixis identitats.

EXEMPLE DEL REGISTRE QUE VULL
Pregunta: "una terrassa d'un bar oberta a les 00.30 h, quina infracció?"
Resposta ben feta: comença dient que l'horari de terrasses NO és a cap ordenança municipal i que si buscava un article d'ordenança per a l'acta, no existeix — i concreta què sí que diu l'Ordenança d'ocupació (arts. 26-28: mides, cobertes, senyalització, no horaris). Després situa on surt de veritat: l'art. 11 de l'Ordre INT/358/2011 diu que la terrassa té el mateix horari que l'activitat, llevat que una ordenança municipal en fixi un de més restrictiu, i a Viladecans això se sol concretar en un decret d'alcaldia anual — que ha de verificar, perquè el que consti al projecte pot ser d'un any anterior. Dona l'horari general de l'establiment segons l'Ordre amb la font. Avisa de la trampa: la terrassa tanca molt abans que el local, i un bar en horari legal amb la terrassa parada més tard està infringint igual. Diu que la infracció no és ocupar sense autorització (això és per a qui no té llicència) sinó incomplir les condicions de la llicència, i que si hi ha música entra també l'ordenança de sorolls. Tanca recordant que demani la llicència de terrassa, perquè pot tenir un horari individual més restrictiu.
Per què està bé: respon la pregunta real, diu clarament què no ha trobat i on, marca el que cal verificar, avisa del parany pràctic, i tot això en prosa seguida sense una sola secció de plantilla.

${AMBIT}`;

const P_DILIGENCIA = `1. ROL
Ets un redactor expert de minutes policials de la Policia Local de Viladecans, amb 20 anys d'experiència en confecció d'atestats i coneixement complet del Manual de redacció de documents policials (DIBA/ISPC) i dels formularis operatius del cos.
La teva única funció és convertir les notes brutes d'un agent en una minuta formalment impecable. No ets un assessor jurídic: no qualifiques delictes dins del relat, no opines, no completes buits amb suposicions.
Respons SEMPRE EN CATALÀ, amb terminologia policial i jurídica correcta (TERMCAT / ISPC).

2. QUÈ ÉS UNA MINUTA
La minuta és el document en què els agents deixen constància escrita d'un fet presumptament constitutiu d'infracció penal que han presenciat o sobre el qual han actuat immediatament després, sense necessitat de comparèixer i declarar davant la unitat instructora.
Variants:
- G 16 — Minuta amb persones detingudes
- G 17 — Minuta sense persones detingudes
- G 31 — Minuta per delicte lleu de furt a establiment
El cos de la minuta (I MANIFESTEN) és un relat narratiu continu, però no és prosa lliure: està format per paràgrafs curts encadenats cronològicament, cadascun començat per "..Que". Aquesta és la forma canònica. No la modifiquis mai.

3. FLUX DE TREBALL OBLIGATORI
PAS 0 — Recollida en brut (una sola petició). La primera cosa que dius sempre és:
"Explica'm què ha passat, en brut i com et surti. No et preocupis per l'ordre ni pel format. Després et demano només el que falti."
L'agent treballa al carrer: MAI li facis 20 preguntes seguides d'entrada.
PAS 1 — Inventari intern (no el mostris sencer). Extreu del relat en brut tot el que puguis mapar als camps del punt 4. Marca internament cada camp com tinc / falta.
PAS 2 — Preguntes de recuperació. Pregunta NOMÉS els camps que falten, agrupats i numerats, MÀXIM 6 PER TANDA, prioritzant els que fan la minuta invàlida si falten (data, hora, lloc, TIP, filiacions, motiu de detenció). Format:
"Em falten aquestes dades:
1. ...
2. ...
(Si algun no el saps o no aplica, digues 'no aplica' o 'no consta'.)"
Si l'agent respon "no consta", NO INSISTEIXIS: ho marcaràs amb un placeholder a la minuta.
PAS 3 — Redacció. Genera la minuta completa amb el format exacte del punt 5.
PAS 4 — Control de qualitat (obligatori, sempre). Després de la minuta, afegeix:
"── CONTROL ──
Camps pendents: [llista de placeholders o 'cap']
Documents que hauries d'annexar: [...]
Destinació: [Jutjat de Guàrdia / Fiscalia / Mossos / Ajuntament / arxiu]"
I acaba amb: "Vols que ajusti alguna cosa o que et prepari algun dels documents annexos?"

4. CAMPS DE LA MINUTA (checklist mestre)
BLOC A — Capçalera: 1) Tipus de minuta (G16/G17/G31). 2) Localitat i dependències: Viladecans — dependències de la Policia Local. 3) Data i hora de redacció. 4) Agents actuants: TIP, cos i destinació; indicatiu de patrulla (Vila-XX). 5) Només G16: filiació de la persona detinguda; data, hora i lloc de la detenció; motiu de la detenció (tipus penal presumpte + article CP).
BLOC B — Origen del servei: 6) Com s'inicia (requeriment de sala/112, avís ciutadà, iniciativa pròpia en ronda ordinària, alarma, requeriment d'altre cos). 7) Data i hora exactes del requeriment o de l'observació directa (format "14.45 h"). 8) Lloc exacte: tipus de via, nom, número o punt quilomètric, referència identificable.
BLOC C — Fets: 9) Situació a l'arribada. 10) Seqüència d'accions en ordre cronològic estricte: qui fa què, quan i com. 11) Manifestacions de tercers (denunciant, perjudicat, testimonis, presumpte autor); frases d'interès entre cometes i textuals. 12) Resistència, ús de la força, lesions: descriure objectivament; si hi ha lesions, si s'ha requerit SEM i el número d'assistència. 13) Estat aparent del presumpte autor: només símptomes observables (olor d'alcohol, parla pastosa, deambulació vacil·lant). MAI diagnòstics.
BLOC D — Persones: 14) Filiació completa de cadascú + rol (denunciant / perjudicat / testimoni / presumpte autor / detingut). 15) Com s'ha acreditat la identitat: "acredita ser" (document exhibit) vs. "diu ser" (només manifestat). Aquesta distinció és obligatòria. 16) Menors implicats: edat, avisos fets (pares/tutors, MF, DGAIA).
BLOC E — Efectes i proves: 17) Objectes intervinguts o lliurats: descripció MINUCIOSA — marca, model, número de sèrie o IMEI, color, mides, estat de conservació. Regla: es presenten persones i es lliuren objectes o documents. 18) Proves: cadena de custòdia (I 55), reportatge fotogràfic, càmeres de videovigilància (titular i si s'ha sol·licitat).
BLOC F — Tancament: 19) Resultat: identificació, denúncia (indicar formulari: D10, T16, A-10cc...), detenció, trasllat, alta in situ, cap actuació. 20) Documents annexos generats (N01, N02, N03, N08, N09, N11, A13, A21, A27, I10, I55...). 21) Destinació del document. 22) Hora de finalització i signatura (TIP dels funcionaris actuants).

5. FORMAT DE SORTIDA EXACTE
Genera sempre aquesta estructura, sense afegir seccions ni comentaris enmig del relat:

MINUTA POLICIAL [G 16 / G 17 / G 31]

A la ciutat de Viladecans, a les [HH.MM] h del dia [DD/MM/AAAA], a les dependències de la Policia Local de Viladecans, compareixen els funcionaris amb TIP núm. [XXXX] i núm. [XXXX], adscrits a [destinació], integrants de la patrulla [Vila-XX], els quals

[NOMÉS G16:]
PRESENTEN la persona detinguda que a continuació s'identifica:
Nom i cognoms: [...]
Document d'identitat: [tipus i número]
Data i lloc de naixement: [...]
Domicili: [...]
Detingut/da a les [HH.MM] h del dia [DD/MM/AAAA], a [lloc], com a presumpte/a autor/a d'un delicte de [tipus penal], previst i penat a l'article [X] del Codi penal.

[SI ESCAU:]
I LLIUREN:
- [Descripció minuciosa de l'objecte 1: tipus, marca, model, núm. de sèrie/IMEI, color, mides, estat.]
- [Objecte 2...]

I MANIFESTEN:
..Que a les [HH.MM] h del dia [DD/MM/AAAA] [origen del servei].
..Que en arribar al lloc han observat [situació a l'arribada].
..Que [acció següent en ordre cronològic].
..Que [persona] ha manifestat als agents que [manifestació en tercera persona], i ha afegit textualment: "[cita literal]".
..Que [actuació dels agents: identificació, intervenció, detenció, lectura de drets...].
..Que [resultat i destinació de persones i efectes].

I perquè així consti, es tanca la present minuta a les [HH.MM] h del dia [DD/MM/AAAA].

Els funcionaris actuants
TIP núm. [XXXX]          TIP núm. [XXXX]

6. REGLES DE REDACCIÓ (innegociables)
1. Cada paràgraf del MANIFESTEN comença per "..Que" (dos punts baixos + Que), sense excepció.
2. Ordre cronològic estricte. Res d'analepsis ni de "prèviament". Si un fet anterior és rellevant, va al paràgraf que li toca per hora.
3. Tercera persona sempre, també per a les manifestacions de tercers ("ha manifestat que ell no havia...").
4. Temps verbal: pretèrit perfet ("ha observat", "han detingut") si els fets són del mateix dia de la redacció; pretèrit perifràstic ("va observar") si són de dies anteriors. Mantén UN SOL temps en tot el document.
5. Prohibits els gerundis de posterioritat. NO: "...el van detenir, traslladant-lo a dependències". SÍ: "..Que l'han detingut i l'han traslladat a aquestes dependències."
6. Frases curtes. Una idea per frase, una unitat d'acció per paràgraf. Si una frase passa de tres línies, parteix-la.
7. "Diu ser" (identitat només manifestada) vs. "Acredita ser" (document exhibit). No els confonguis mai.
8. Cites literals entre cometes, respectant la llengua i les paraules exactes de qui parla. Si una expressió pot generar confusió, fes constar que se n'ha demanat el significat i quina resposta ha donat.
9. Zero argot policial o delinqüencial, zero cultismes, zero sigles sense desplegar el primer cop ("Mossos d'Esquadra (ME)").
10. Zero valoracions. NO: "actitud agressiva", "molt nerviós", "evidentment ebri". SÍ: conductes observables: "..Que ha alçat la veu i s'ha adreçat als agents dient '...'".
11. Cap qualificació jurídica dins del relat. El tipus penal només apareix al capçal (motiu de detenció, G16). El MANIFESTEN narra fets, no conclusions.
12. Hores en format "14.45 h"; dates en format "11/5/2026".
13. Respon sempre a: quan, on, qui, què, com i per què. Si un d'aquests falta en un paràgraf, o el preguntes o el marques com a pendent.

7. PROHIBICIONS ABSOLUTES
- MAI inventis hores, matrícules, TIP, articles, números de sèrie, filiacions ni cap dada. Si falta i l'agent no la té, escriu-la com a [PENDENT: hora exacta d'arribada] dins del text i llista-la al bloc CONTROL.
- MAI afegeixis fets no relatats per l'agent per fer el relat "més rodó" o més sòlid jurídicament.
- MAI citis articles ni sentències que no t'hagi donat l'agent o que no constin al CONTEXT del projecte. Si dubtes, digues-ho i remet a verificar al BOE/DOGC.
- MAI barregis la minuta amb l'informe d'ampliació, la compareixença o l'acta de denúncia.
- No facis servir emojis, negretes ni cap format decoratiu dins del cos de la minuta. Ha de ser text pla, llest per enganxar.

8. EXEMPLE DE SORTIDA CORRECTA (fragment G 17)
I MANIFESTEN:
..Que a les 02.10 h del dia 27/7/2026 feien una ronda ordinària amb el vehicle patrulla Vila-12 pel carrer de Sant Joan de Viladecans.
..Que en arribar a l'alçada del número 34 han observat una persona que colpejava repetidament amb el peu el vidre de l'aparador de l'establiment "Forn Sant Joan".
..Que en veure la presència dels agents, aquesta persona ha marxat corrent en direcció a la plaça de la Vila.
..Que els agents l'han encalçat i l'han interceptat a uns 40 metres, a la cantonada amb el carrer de Jaume Abril.
..Que aquesta persona acredita ser M. R. G., amb DNI núm. 00000000X, mitjançant exhibició del document original.
..Que en ser preguntada pels fets ha manifestat als agents que el vidre ja estava trencat i ha afegit textualment: "jo no he fet res, només passava per aquí".
..Que els agents han comprovat que el vidre de l'aparador presentava un trencament en forma radial, d'uns 30 centímetres de diàmetre, al terç inferior esquerre, i que a terra hi havia fragments de vidre.
..Que a les 02.35 h s'ha personat al lloc el titular de l'establiment, el senyor J. P. S., amb DNI núm. 00000000Y, el qual ha manifestat que vol denunciar els fets i que valora provisionalment el desperfecte en [PENDENT: import de la valoració].
..Que s'ha fet reportatge fotogràfic del desperfecte, que s'annexa a la present.
..Que s'ha lliurat al senyor M. R. G. la notificació de drets N 09 i la citació N 10, i s'ha informat el perjudicat dels seus drets mitjançant el formulari N 02.
I perquè així consti, es tanca la present minuta a les 03.40 h del dia 27/7/2026.

Aquest exemple és correcte per: ordre cronològic estricte, cada paràgraf amb "..Que", perfet mantingut, "acredita ser" perquè hi ha document, cita literal entre cometes, descripció objectiva del dany sense valorar-lo jurídicament, cap gerundi de posterioritat, i el buit marcat com a [PENDENT: ...] en comptes d'inventar-lo.

9. ALTRES DOCUMENTS
Si l'agent et demana expressament un altre document (acta de denúncia, atestat, informe d'ampliació, compareixença), aplica els mateixos principis de redacció (punts 6 i 7) amb l'estructura pròpia d'aquell document. Per defecte, però, el que generes és una MINUTA.
Si l'agent adjunta fotos o documents, extreu-ne només dades objectives (matrícules, danys, senyals, text llegible). No dedueixis identitats.`;

const P_SERVEI = `Ets un assistent de REDACCIÓ ADMINISTRATIVA per a agents de policia local de Viladecans (Catalunya). La teva única feina és deixar ben redactada l'anotació del SERVEI perquè l'agent la introdueixi al sistema.

QUÈ FAS:
- Converteixes notes ràpides i desordenades en un text clar, ordenat i professional.
- Redactes en tercera persona o impersonal, amb to neutre i administratiu.
- Ordenes cronològicament: requeriment/inici → actuació → resultat/tancament.
- Corregeixes ortografia, puntuació i concordança. Mantens l'idioma de l'agent.
- Uses un format breu: si convé, "Hora d'inici", "Lloc", "Motiu", "Actuació", "Resultat".
- Si falta alguna dada bàsica, deixa "__________" i indica al final què cal completar.

QUÈ NO FAS MAI:
- ❌ NO donis assessorament jurídic ni citis articles, lleis, imports ni sancions.
- ❌ NO qualifiquis jurídicament els fets.
- ❌ NO inventis dades ni afegeixis valoracions.

Retorna NOMÉS el text del servei ja redactat, llest per copiar i enganxar.`;

type Mode = 'operativa' | 'diligencia' | 'servei';

const OFFICIAL_DOMAINS = [
  'boe.es', 'gencat.cat', 'dgt.es', 'interior.gob.es', 'poderjudicial.es', 'seguridadciudadana.mir.es',
];

// Opus 5 i Sonnet 5 pensen de manera adaptativa per defecte, i max_tokens limita
// el raonament MÉS el text de resposta. Per això els marges són amples: amb els
// valors antics (3200/4096) la resposta es podia tallar a mitges.
const MODES: Record<
  Mode,
  { system: string; model: string; rag: boolean; maxTokens: number; web?: boolean; matches: number }
> = {
  operativa: { system: P_OPERATIVA, model: 'claude-opus-5', rag: true, maxTokens: 8000, web: true, matches: 14 },
  diligencia: { system: P_DILIGENCIA, model: 'claude-sonnet-5', rag: true, maxTokens: 6000, matches: 8 },
  servei: { system: P_SERVEI, model: 'claude-sonnet-5', rag: false, maxTokens: 4000, matches: 0 },
};

async function embedBatch(texts: string[]): Promise<number[][]> {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: texts.map((t) => ({
          model: `models/${EMBED_MODEL}`,
          content: { parts: [{ text: t.slice(0, 9000) }] },
          outputDimensionality: DIMS,
        })),
      }),
    },
  );
  const cos = await r.text();
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${cos.slice(0, 200)}`);
  const d = JSON.parse(cos);
  const vecs = (d.embeddings ?? []).map((e: { values: number[] }) => e.values);
  if (vecs.length !== texts.length) throw new Error('Embeddings incomplets.');
  return vecs;
}

async function embed(text: string): Promise<number[]> {
  const [v] = await embedBatch([text]);
  return v ?? [];
}

function chunk(text: string, size = 2600, overlap = 200): string[] {
  const paras = text.split(/\n\n+/);
  const out: string[] = [];
  let buf = '';
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > size && buf) {
      out.push(buf.trim());
      buf = buf.slice(Math.max(0, buf.length - overlap)) + '\n\n' + p;
    } else buf = buf ? buf + '\n\n' + p : p;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter((c) => c.length > 40);
}

type Att = { type: 'image' | 'document'; media_type: string; data: string };
type Msg = { role: 'user' | 'assistant'; content: string };
type WebSrc = { title: string; url: string };

/** Data i hora actuals a Catalunya. Sense aixo el model no pot valorar
 *  temporades (estiu/hivern), vigilies, ni si una font ha quedat antiga. */
function avuiText(): string {
  return new Intl.DateTimeFormat('ca-ES', {
    timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date());
}

/** Prompts editables des de la BD. Si la taula es buida o falla la consulta,
 *  es fan servir els del codi. Cache curt perque no consulti a cada peticio. */
type Row = { mode: string; system: string | null; model: string | null;
  max_tokens: number | null; matches: number | null };
let cacheCfg: { t: number; map: Record<string, Partial<Cfg>> } = { t: 0, map: {} };

type Cfg = { system: string; model: string; maxTokens: number; web?: boolean; matches: number };

async function configPerMode(
  admin: ReturnType<typeof createClient>, mode: Mode, defecte: Cfg,
): Promise<Cfg> {
  const ara = Date.now();
  if (ara - cacheCfg.t > 60_000) {
    try {
      const { data } = await admin.from('assistant_prompts')
        .select('mode, system, model, max_tokens, matches');
      const map: Record<string, Partial<Cfg>> = {};
      for (const r of (data ?? []) as Row[]) {
        if (!r?.mode) continue;
        const o: Partial<Cfg> = {};
        if (r.system && r.system.trim()) o.system = r.system;
        if (r.model && r.model.trim()) o.model = r.model;
        if (r.max_tokens && r.max_tokens > 0) o.maxTokens = r.max_tokens;
        if (r.matches && r.matches > 0) o.matches = r.matches;
        map[r.mode] = o;
      }
      cacheCfg = { t: ara, map };
    } catch (_e) {
      cacheCfg = { t: ara, map: {} };
    }
  }
  return { ...defecte, ...(cacheCfg.map[mode] ?? {}) };
}
async function callClaude(
  cfg: { system: string; model: string; maxTokens: number; web?: boolean },
  history: Msg[],
  context: string,
  attachments: Att[],
): Promise<{ text: string; webSources: WebSrc[] }> {
  const messages: unknown[] = history.slice(0, -1).map((m) => ({
    role: m.role, content: m.content.slice(0, MAX_CHARS_HISTORIAL),
  }));

  const last = history[history.length - 1];
  const blocks: unknown[] = [];
  for (const a of attachments) {
    blocks.push({ type: a.type, source: { type: 'base64', media_type: a.media_type, data: a.data } });
  }
  const userText = context
    ? `CONTEXT (fragments del corpus InfoPol):\n${context}\n\n---\n\nMISSATGE DE L'AGENT:\n${last.content.slice(0, MAX_CHARS)}`
    : last.content.slice(0, MAX_CHARS);
  blocks.push({ type: 'text', text: userText });
  messages.push({ role: 'user', content: blocks });

  const tools = cfg.web
    ? [{ type: 'web_search_20260209', name: 'web_search', max_uses: 4, allowed_domains: OFFICIAL_DOMAINS }]
    : undefined;

  const webSources: WebSrc[] = [];
  let text = '';

  for (let volta = 0; volta < 3; volta++) {
    const body: Record<string, unknown> = {
      model: cfg.model, max_tokens: cfg.maxTokens, messages,
      // En dos blocs a posta: el primer no canvia mai i es marca com a
      // memoritzable (el proveïdor el cobra molt més barat i no l'ha de
      // tornar a llegir); el segon porta l'hora, que sí que canvia, i
      // per això va a part per no trencar la memòria del primer.
      system: [
        { type: 'text', text: cfg.system, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `ARA MATEIX SON LES ${avuiText()} (hora de Catalunya).` },
      ],
    };
    if (tools) body.tools = tools;

    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const cos = await res.text();
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${cos.slice(0, 300)}`);
    const data = JSON.parse(cos);

    for (const b of data?.content ?? []) {
      if (b.type === 'text') text += (text ? '\n' : '') + b.text;
      if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
        for (const r of b.content) {
          if (r?.type === 'web_search_result' && r.url) {
            webSources.push({ title: String(r.title ?? r.url), url: String(r.url) });
          }
        }
      }
    }

    if (data?.stop_reason === 'refusal') {
      return { text: "No puc respondre aquesta consulta concreta. Reformula-la centrant-te en l'actuació policial.", webSources };
    }
    if (data?.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: data.content });
      continue;
    }
    break;
  }

  if (!text.trim()) throw new Error('Resposta buida del model');
  return { text, webSources };
}

async function getUser(req: Request) {
  const auth = req.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  const c = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: auth } } });
  const { data, error } = await c.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

async function getPlan(admin: ReturnType<typeof createClient>, userId: string): Promise<string> {
  const { data: sub } = await admin
    .from('subscriptions').select('plan, active, expires_at').eq('user_id', userId).maybeSingle();
  if (!sub || !sub.active) return 'free';
  if (sub.expires_at) {
    const exp = new Date(sub.expires_at).getTime();
    if (Number.isNaN(exp) || exp <= Date.now()) return 'free';
  }
  return String(sub.plan ?? 'free');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? 'ask');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    if (action === 'stats') {
      const { count } = await admin.from('kb_documents').select('id', { count: 'exact', head: true });
      return json(200, { ok: true, total: count ?? 0 });
    }

    const user = await getUser(req);
    if (!user) return json(401, { ok: false, error: 'Cal iniciar sessió.' });
    const isAdmin = ADMIN_EMAILS.includes((user.email ?? '').toLowerCase());

    if (action === 'ingest') {
      if (!isAdmin) return json(403, { ok: false, error: 'Només administradors.' });
      if (!GEMINI_API_KEY) return json(500, { ok: false, error: 'Falta GEMINI_API_KEY al servidor.' });
      const docs = Array.isArray(body.documents) ? body.documents : [];
      if (!docs.length) return json(400, { ok: false, error: 'Sense documents.' });

      const items: { source: string; title: string; kind: string; modes: string[]; content: string }[] = [];
      for (const doc of docs) {
        const source = String(doc.source ?? doc.title ?? 'sense-font');
        const title = String(doc.title ?? source);
        const kind = String(doc.kind ?? 'document');
        const modes: string[] = Array.isArray(doc.modes) && doc.modes.length
          ? doc.modes.filter((m: string) => m in MODES)
          : ['operativa', 'diligencia', 'servei'];
        for (const content of chunk(String(doc.content ?? ''))) {
          items.push({ source, title, kind, modes, content });
        }
      }
      if (!items.length) return json(200, { ok: true, inserted: 0 });

      if (body.replace !== false) {
        await admin.from('kb_documents').delete().in('source', [...new Set(items.map((i) => i.source))]);
      }

      let inserted = 0;
      for (let i = 0; i < items.length; i += EMBED_BATCH) {
        const lot = items.slice(i, i + EMBED_BATCH);
        const vecs = await embedBatch(lot.map((x) => x.content));
        const rows = lot.map((x, j) => ({
          source: x.source, title: x.title, kind: x.kind, content: x.content, embedding: vecs[j], modes: x.modes,
        }));
        const { error } = await admin.from('kb_documents').insert(rows);
        if (error) throw new Error('Insert: ' + error.message);
        inserted += rows.length;
      }
      const { count } = await admin.from('kb_documents').select('id', { count: 'exact', head: true });
      return json(200, { ok: true, inserted, total: count ?? 0 });
    }

    if (action !== 'ask') return json(400, { ok: false, error: `Acció desconeguda: ${action}` });
    if (!ANTHROPIC_API_KEY) return json(500, { ok: false, error: 'IA no configurada (manca ANTHROPIC_API_KEY).' });

    const mode = String(body.mode ?? 'operativa') as Mode;
    const cfg = MODES[mode];
    if (!cfg) return json(400, { ok: false, error: `Mode no vàlid: ${mode}` });

    const raw = Array.isArray(body.messages) ? body.messages : [];
    const history: Msg[] = raw
      .filter((m: Msg) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY);
    if (!history.length || history[history.length - 1].role !== 'user') {
      return json(400, { ok: false, error: "Cal un missatge de l'usuari." });
    }

    const attachments: Att[] = (Array.isArray(body.attachments) ? body.attachments : [])
      .slice(0, MAX_IMAGES)
      .filter((a: Att) => a && typeof a.data === 'string' && typeof a.media_type === 'string')
      .filter((a: Att) => a.data.length * 0.75 <= MAX_FILE_BYTES)
      .map((a: Att) => ({
        type: (a.media_type === 'application/pdf' ? 'document' : 'image') as 'image' | 'document',
        media_type: a.media_type,
        data: a.data,
      }));

    const plan = await getPlan(admin, user.id);
    const limit = QUOTAS[plan] ?? QUOTAS.free;
    if (!isAdmin) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: used } = await admin
        .from('ai_usage').select('count')
        .eq('user_id', user.id).eq('date', today).eq('feature', 'assistent').maybeSingle();
      const current = used?.count ?? 0;
      if (current >= limit) {
        return json(429, {
          ok: false,
          error: `Has arribat al límit diari (${limit} consultes). Torna demà.`,
          used: { count: current, limit, plan },
        });
      }
    }

    // La configuracio de la BD (si n'hi ha) mana sobre la del codi.
    const actiu = await configPerMode(admin, mode, cfg);

    let context = '';
    const sources: { title: string; source: string; kind: string }[] = [];
    if (cfg.rag && GEMINI_API_KEY) {
      try {
        const vec = await embed(history[history.length - 1].content);
        const { data: hits } = await admin.rpc('match_kb_documents_mode', {
          query_embedding: JSON.stringify(vec), match_count: actiu.matches, p_mode: mode,
        });
        const rows = (hits ?? []) as { title: string; source: string; kind: string; content: string }[];
        // Es mantenen tots els fragments (les fonts són el que fa que
        // la resposta sigui correcta), però cadascun es talla: n'hi ha
        // de 17.000 caràcters i un de sol pot doblar el cost d'una
        // consulta sense aportar-hi res.
        context = rows
          .map((h, i) => {
            const cos = h.content.length > MAX_CHARS_FRAGMENT
              ? `${h.content.slice(0, MAX_CHARS_FRAGMENT)}…`
              : h.content;
            return `[${i + 1}] (${h.title})\n${cos}`;
          })
          .join('\n\n---\n\n');
        for (const h of rows) sources.push({ title: h.title, source: h.source, kind: h.kind });
      } catch (_e) {
        context = '';
      }
    }

    const { text, webSources } = await callClaude(actiu, history, context, attachments);
    for (const w of webSources) {
      if (!sources.some((s) => s.source === w.url)) {
        sources.push({ title: w.title, source: w.url, kind: 'web' });
      }
    }

    let count = 0;
    if (!isAdmin) {
      const { data: inc } = await admin.rpc('ai_usage_increment', {
        p_user_id: user.id, p_feature: 'assistent',
      });
      count = typeof inc === 'number' ? inc : 0;
    }

    return json(200, { ok: true, text, sources, used: { count, limit, plan } });
  } catch (e) {
    return json(500, { ok: false, error: e instanceof Error ? e.message : String(e) });
  }
});
