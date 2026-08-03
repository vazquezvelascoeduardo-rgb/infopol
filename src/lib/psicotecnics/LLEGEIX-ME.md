# Psicotècnics generats

No són un banc de preguntes: és un **programa que en fabrica**. Cada ítem
surt d'una llavor, i la resposta correcta no és una opinió meva sinó una
conseqüència del model. Això vol dir que cada opositor pot fer un examen
diferent i que no hi ha res a copiar, perquè no hi ha cap fitxer de
preguntes.

## Què hi ha i en quin estat

| Fitxer | Família | Estat |
|---|---|---|
| `plegat.mjs` | Motor: del desplegable al cub, i les dues vistes | **Validat** |
| `cubs.mjs` | Desplegable → quin cub | **Validat** (comprovat a mà per l'Eduardo) |
| `mirall.mjs` | Cub + mirall → quin desplegable | **Validat pel programa**, pendent de mà |
| `figures.mjs` | Imatge reflectida / girada sense reflectir | **Validat pel programa**, pendent de mà |
| `numeric.mjs` | Aritmètica, probabilitat i sèries de números | **Validat pel programa**, pendent de mà |
| `comptar.mjs` | Comptar símbols i taules de correspondències | **Validat pel programa**, pendent de mà |
| `abstracte.mjs` | Matriu de figures de línia (o-exclusiu), 5 opcions | **Validat pel programa**, pendent de mà |
| `dau.mjs` | El dau que roda pel tauler | **Validat pel programa**, pendent de mà |
| `dades.mjs` | Taules, gràfic de sectors i gràfic de barres | **Validat pel programa**, pendent de mà |
| `disc.mjs` | El disc girat, amb la fletxa d'orientació | **Validat pel programa**, pendent de mà |
| `verbal.mjs` | Sinònims/antònims i analogies | ⚠️ vegeu més avall |
| `atzar.mjs` | L'atzar compartit: barreja i posició de la bona | — |

## La família verbal juga en una altra lliga

Cal que quedi escrit. A totes les altres famílies la resposta bona surt
d'un invariant o d'un compte, i el programa la pot garantir sol. A
`verbal.mjs` surt d'una **taula escrita a mà**, i per tant:

- **El que les proves SÍ comproven**: que cap dels tres distractors no
  compleix la relació que demana l'enunciat, que no es repeteix cap
  paraula, que el sinònim i l'antònim no es confonen, i que cap dels
  «propers» no és en realitat un sinònim. Tot això es comprova contra la
  taula i és de debò.
- **El que NO poden comprovar**: que la taula sigui bona. Un sinònim
  discutible passaria sense que res ho digués.

Per això les analogies van amb relacions **tancades** —país i capital,
animal i pell, instrument i magnitud—, on la parella és un fet. I els
sinònims porten un sol sinònim i un sol antònim per paraula, amb una
llista a part de paraules del mateix camp que expressament NO ho són:
aquestes fan de distractors.

Al simulacre de l'iOpos hi ha un ítem que ensenya el parany: TRANSLÚCID
amb «Diàfan» com a bona i «Transparent» entre els distractors. Totes dues
valen. Aquí això no pot passar, perquè els distractors només surten de la
llista de les que no ho són.

**I una diferència de fons**: aquesta família és l'única que NO és
infinita. Les altres fabriquen ítems a partir d'una llavor i no es
repeteixen mai; aquesta té 30 paraules i 60 parelles, i quan s'acaben, es
repeteixen. Ampliar-la vol dir escriure més taula i que algú la validi.
| `series.mjs` | Sèries: graella, comptatge, rellotge i sectors | **Validat pel programa**, pendent de mà |

## Les dues maneres de preguntar-ho

Als exàmens no sempre demanen la que correspon: alguns anys demanen la que
**NO** correspon, i aleshores n'hi ha tres de bones i una de dolenta. Ho
fan tant a `cubs.mjs` com a `mirall.mjs`, i s'hi arriba amb el segon
paràmetre de `generaItem`.

Girar-ho no és canviar l'enunciat: obliga a fabricar **tres desplegables
diferents que pleguin tots al mateix cub**, i això no surt a mà. Per
això `mirall.mjs` té `desplega`, que fa el camí invers —d'un cub, un
desplegable— plegant la forma amb marques per saber quin marc li toca a
cada casella. Que sigui correcte no me'l crec jo: es comprova plegant el
que surt i mirant que doni el cub de partida.

Les proves es passen amb `node proves-geometria.mjs`, `node proves-mirall.mjs`,
`node proves-figures.mjs` i `node proves-numeric.mjs`. Cap ítem no s'envia
sense que passin.

## Qui comprova què

Són dues meitats, i cadascú fa la seva. Això no és una manera de parlar:
és el repartiment que fa que no quedi cap forat.

- **Les proves** comproven que la resposta bona és la bona: que només una
  opció respon, que la geometria compleix els invariants, que el dibuix cau
  on diu la geometria. Jo no puc mirar un SVG, o sigui que d'aquí no en pot
  sortir res sobre com es veu.
- **L'Eduardo** comprova que es vegi bé: que no quedi petit, que dues
  opcions no es trepitgin, que la figura s'entengui d'un cop d'ull. El
  resultat no el pot comprovar, i no cal que ho faci.

Com que ell no pot comprovar el resultat, la garantia ha de sortir tota de
les proves. Per això la regla d'aquesta carpeta és que **cada resposta es
comprova per un camí diferent del que l'ha calculada**:

| Família | El segon camí |
|---|---|
| Cubs i mirall | Els invariants: sumes set, les dues quiralitats, el volteig |
| Numèric | Es rellegeix l'enunciat generat i es torna a fer el problema |
| Comptar | Es fabrica decidint quants n'hi ha, i després es compten |
| Abstracte | Es torna a aplicar la regla, i es prova que cap altra no encaixa |
| Dau | Un diccionari de sis bandes contra el motor fent girar el cub |
| Dades | Es refà el càlcul llegint la taula o el gràfic, no els números d'origen |
| Disc | S'alinea la fletxa i es compara el contingut, com fa qui el resol |
| Sèries | Es passa el catàleg de regles i totes han de donar el mateix cinquè |

### L'errada que amagaven les sèries

`series.mjs` estava donat per bo i tenia un forat: no comprovava que la
regla fos **única**. Amb un pas de dos, la marca torna al punt de partida
cada quatre quadres, i llavors "avança dos" i "retrocedeix dos" expliquen
exactament els mateixos quatre quadres però donen cinquens diferents. La
sèrie no tenia resposta i res no ho deia.

També barrejava amb `sort(() => r() - 0.5)` i no comprovava que hi hagués
tres distractors: si no n'hi havia, tornava un ítem amb menys de quatre
opcions.

## Dos paranys de l'atzar, tots dos ja mossegats

Van a `atzar.mjs`, junts i explicats, perquè no tornin a passar:

1. **Barrejar amb `sort(() => r() - 0.5)`** no reparteix igual. Sembla que
   sí, i no ho fa.
2. **Triar on va la bona amb el mateix atzar que ha fabricat l'ítem**
   tampoc, i costa més de veure: els generadors fan intents fins que en
   surt un de bo, i uns ítems en necessiten més que altres, o sigui que
   quan s'arriba a triar la posició l'atzar ja ha avançat un nombre de
   passos que depèn de l'ítem.
3. I una tercera que va sortir generant una tanda: si la posició depèn
   **només** de la llavor, dues famílies generades amb les mateixes
   llavors donen la mateixa lletra ítem a ítem. Amb les tres menes de
   gràfic i les llavors 1101–1104 sortia `a, a, d, b` a totes tres. Per
   això `posicioBona` demana també el nom de la família.

## El bloc numèric

És l'únic que es pot comprovar del tot, perquè la resposta és un càlcul. Hi
ha dues regles:

1. **Res de comes flotants.** Tot amb enters i fraccions exactes, i si un
   enunciat no dona un resultat net, es llença i se'n fa un altre.
2. **Cada resposta es comprova per un camí diferent del que l'ha calculada.**
   A la probabilitat, el segon camí és comptar els 36 casos un per un.

I les proves hi afegeixen un tercer camí, que és el bo: **llegeixen
l'enunciat generat, en treuen els números i tornen a fer el problema des de
zero**. Així també es veuria l'errada clàssica de calcular amb un número i
escriure'n un altre. Passen els 400.

A les sèries de números el perill és que la sèrie tingui dues explicacions
que donin resultats diferents. Per evitar-ho es prova tot el catàleg de
regles contra els termes que es veuen, i si n'hi ha dues que hi encaixen i
no coincideixen, l'ítem es llença.

## Les dues famílies de figures

Van juntes perquè són la mateixa pregunta del revés, i el que les fa tenir
una sola resposta és com es reparteixen les opcions: a la del mirall la
bona és el reflex i les altres tres són girs; a la del gir, al revés. Així
no hi ha res a discutir.

La regla exacta surt de la 35 del simulacre: la mostra té una ratlla
vertical i un punt blanc a dalt a l'esquerra, i la bona té la ratlla igual
i el punt a dalt a la **dreta**. És el reflex per l'eix vertical, sense cap
gir; el distractor és la mostra girada mitja volta.

La figura no és un dibuix sinó una **graella de caselles** amb una casella
marcada, i del contorn en surt el polígon irregular. Així el programa
comprova sol que la figura no té cap simetria —si en tingués, girar-la i
reflectir-la donarien el mateix i l'ítem no tindria resposta.

## Els models que surten a l'examen

Hi ha dos exàmens de referència i **no porten la mateixa barreja**, així
que convé tenir-los tots dos:

**Mossos 2022** (80 preguntes en 35 minuts — 26 segons cadascuna, o sigui
que bona part mesura velocitat, no dificultat). No hi surt la família del
mirall; en canvi hi pesen molt l'atenció i les dades. De les 46 primeres:

| Model | Vegades | Estat |
|---|---|---|
| Comptar símbols | 8 | fet |
| Taules i gràfics de dades | 7 | pendent |
| Matriu 3×3 | 6 | pendent |
| Sinònims i antònims | 6 | pendent |
| Aritmètica | 4 | fet |
| Rotació de disc amb fletxa | 3 | pendent |
| Sèries de figures | 3 | parcial |
| Taules de correspondències | 2 | fet |
| Desplegable → cub | 2 | fet |
| El dau que roda | 2 | pendent |
| Analogies verbals | 2 | pendent |

**iOpos**, que va de cinc en cinc:

| Model | Preguntes | Estat |
|---|---|---|
| Analogies verbals | 1, 6, 11, 16… | pendent |
| Cub + mirall → desplegable | 2, 3, 8, 18, 28, 43, 53 | fet |
| Sèrie de figures | 4, 14, 24, 29, 34… | parcial |
| Imatge reflectida en un mirall | 5, 15, 25, 35, 45, 55 | pendent |
| Problemes aritmètics | 7, 12, 17, 22… | pendent |
| Matriu 3×3 | 9, 19, 49 | pendent |
| Imatge girada (sense reflectir) | 10, 20, 30, 50, 60 | pendent |
| Desplegable → quin cub | 13, 23, 33, 38, 40, 48, 58 | fet |

## Com es comprova que està bé

El motor de plegat no es valida mirant-lo, es valida amb proves que no
depenen del criteri de ningú:

1. **La prova del dau.** Es numera una creu i es plega. Si el plegat és
   correcte, les cares oposades sumen set. Si estigués mal, els parells
   sortirien creuats. Passa.
2. **Les parelles de la creu.** El centre ha de quedar oposat a la tercera
   casella de la tira, i les dues ales entre elles. Passa.
3. **Sis cares diferents.** Qualsevol desenvolupament que no en doni sis
   no és un desenvolupament. Aquest control va enxampar tres formes que
   havíem donat per bones i no plegaven.
4. **24 orientacions i 24 vistes.** El grup de rotacions del cub.

`cubs.mjs` genera els desenvolupaments candidats i **es queda només amb
els que passen el control**: avui en són 18, de formes diferents, perquè
no vagin tots amb la mateixa creu.

## El mirall, ja fet

El mirall és un pla darrere del cub, de cara a qui mira. Amb aquesta
col·locació —i només amb aquesta— el reflex ensenya justament les tres
cares amagades. I com que el pla del mirall no toca les direccions de la
pantalla, el reflex es projecta exactament on es projectaria el cub: el
mateix hexàgon, però amb les cares del darrere. Es veuen des de dins, i
per això surten capgirades: per dibuixar-les cal el volteig, que ara hi és
(`orientacio` torna gir **i** volteig, i el dibuix aplica `scale(-1,1)`).

Les proves que ho tanquen, totes sobre un dau occidental de veritat i per
a les 24 orientacions:

1. Les oposades sumen set, i cub i mirall sumen set posició a posició.
2. **Les dues quiralitats.** Al vèrtex on es troben l'1, el 2 i el 3, el
   cub es llegeix antihorari i el reflex, horari. Sempre.
3. Al cub no hi ha mai volteig; al mirall n'hi ha sempre.
4. Que el que es dibuixa és el que hi ha: es projecten punts de cada cara
   i es comparen amb on els posa el parell (gir, volteig).

### Els models que falten, amb el format ja tret del material

- **Bateria abstracte** (campus iOpos, sessió 5). Matriu de figures de
  línia, i la regla és un **XOR d'elements**: a cada fila, el tercer quadre
  porta els elements que surten a UN dels dos primers i no als dos. Vist a
  l'exercici 2: (rodona + ratlla vertical), (rodona + ratlla horitzontal) →
  la rodona hi és a tots dos i marxa, queden les dues ratlles, o sigui una
  creu. I (rombe + creu), (creu) → queda el rombe. **Cinc opcions, a–e**,
  no quatre.
- **Bateria cub en plànol** (dau que roda). El dau ensenya tres números, hi
  ha un camí de caselles grises i una X, i es demana què queda a dalt. A
  l'enunciat hi diuen que les oposades sumen set.
- **Els desplegables porten caselles en blanc.** A la bateria de cubs
  desplegats en són dues de sis; a la del mirall, una.

### ATENCIÓ: això no és l'exercici de l'examen

El material d'acadèmia diu, amb aquestes paraules, que al mirall
"aparecen reflejadas **algunas de** las caras ocultas", i afegeix que "las
caras posteriores de los desarrollos **están en blanco**". Als dibuixos,
el cub va a baix a la dreta i el reflex a dalt a l'esquerra, tots dos en
postura isomètrica normal, i els desplegables tenen caselles buides.

Això lliga amb una cosa que va sortir fent els números: **cap mirall pla no
pot ensenyar les tres cares amagades en la postura isomètrica de sempre.**
És impossible, no és qüestió de dibuixar-ho millor. Per això l'examen diu
"algunes": el mirall que fan servir n'ensenya **dues** de les tres amagades
i en repeteix una de les que ja es veuen —aquesta repetida és la que permet
orientar el reflex. Així se'n coneixen cinc de sis, i la sisena és la
casella en blanc del desplegable.

El que hi ha fet ara ensenya les tres amagades i les sis caselles
dibuixades: és exacte i passa les proves, però **no és l'exercici de
l'examen**, és més fàcil i es veu diferent. Cal refer-ho amb el mirall
que toca; i de passada desapareix el dubte de com col·locar el reflex,
perquè amb el mirall bo ja surt en postura normal.

Un altre detall del mateix material: **els desplegables porten caselles en
blanc** també a la família de `cubs.mjs` —sis caselles i només quatre amb
figura—, i ara mateix se'n dibuixen sempre sis.

Com es col·loca el reflex al paper és una decisió a part, i està presa:
va en estil **exacte**, que és ensenyar el reflex tal com surt —es veu el
vèrtex del darrere, i l'hexàgon queda com un cub mirat des de sota. L'altra
manera (`'iopos'`) és el mateix dibuix girat mitja volta; hi és al codi,
però no s'utilitza.

Als exàmens la família va amb **dau de punts i una cara negra**. La cara
negra no és decoració: trenca la regla del set, que si no faria l'ítem
regalat. I aquí una cara no és un nom sinó una **màscara de 3×3**: l'1, el
4, el 5 i la negra es veuen igual girats, i el 2, el 3 i el 6 no. Per això
la unicitat de la resposta es comprova per com es veu, no per com es diu.

### El que NO estava fet (queda per memòria)

La família "es presenta un cub i un mirall" (cub → quin desplegable) està
començada però **és incorrecta i no s'ha de fer servir**.

El motiu: un mirall reflecteix en un **pla**, i el codi feia una reflexió
**pel centre**. Encerta quines cares es veuen —les sumes donen set— però
no com es veuen: es diferencien en un gir. I hi ha un problema de fons,
que una cara reflectida **no es pot descriure amb un gir**; cal a més un
volteig, i la funció que calcula l'orientació només sap tornar quarts de
volta.

Per arreglar-ho fa falta:

- que cada cara porti, a més del gir, una **marca de volteig**, i que en
  dibuixar-la s'hi apliqui `scale(-1,1)` quan toqui;
- definir el mirall com la vista des del vèrtex contrari amb la imatge
  invertida d'esquerra a dreta, que és el que fan els exàmens.

I quan estigui, hi ha una prova objectiva que ho tanca: **un dau és
quiral**. Al vèrtex on es troben l'1, el 2 i el 3, un dau occidental es
llegeix en sentit antihorari, sempre. La seva imatge al mirall s'ha de
llegir en sentit horari. Si es compleixen alhora les sumes set i les dues
quiralitats, la reflexió és exacta.

## Com entraria a l'app

El dibuix es descriu amb formes senzilles i es pinta amb SVG. A la web va
directe; a l'app, amb `react-native-svg`, que ja hi és. Cap imatge, cap
recurs nou i cap build: viatja per OTA com la resta del contingut.
