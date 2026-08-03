# Psicotècnics generats

No són un banc de preguntes: és un **programa que en fabrica**. Cada ítem
surt d'una llavor, i la resposta correcta no és una opinió meva sinó una
conseqüència del model. Això vol dir que cada opositor pot fer un examen
diferent i que no hi ha res a copiar, perquè no hi ha cap fitxer de
preguntes.

## Què hi ha i en quin estat

| Fitxer | Família | Estat |
|---|---|---|
| `plegat.mjs` | Motor: del desplegable al cub | **Validat** |
| `cubs.mjs` | Desplegable → quin cub | **Validat** (comprovat a mà per l'Eduardo) |
| `series.mjs` | Sèrie en graella 3×3 i sèrie de comptatge | Provat, pendent de repàs fi |

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

## El que NO està fet: el mirall

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
