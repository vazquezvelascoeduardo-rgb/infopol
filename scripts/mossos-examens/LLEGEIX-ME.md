# Exàmens oficials de Mossos → tests

Converteix els PDF oficials de la subprova de coneixements en `TestTopic`
de `src/data/tests/`.

## Com s'usa

Els scripts llegeixen el **text ja extret** dels PDF, no els PDF. Per
afegir una convocatòria nova:

1. Deixa el PDF a `Documents\Examens-Oposicions\01-Mossos\`.
2. Extreu-ne el text amb `pdf-parse` (`new PDFParse({data}).getText()`) i
   desa'l amb el mateix nom però `.txt` a la carpeta d'aquests scripts.
3. Afegeix una entrada a `EXAMENS` dins de `genera.mjs`.
4. `node genera.mjs` i després `node valida.mjs`.
5. Registra el nou fitxer a `src/data/tests/index.ts`.

## Què s'ha de mirar abans de donar-ho per bo

`valida.mjs` ha de dir **0 avisos**. I encara així, obre'n tres o quatre
preguntes i comprova la resposta contra el PDF: que el parser no es queixi
vol dir que el format quadra, no que la plantilla estigui ben llegida.

## Per què no hi són tots els exàmens

Dels 17 PDF de la carpeta, només 5 han entrat:

- **10 estan escanejats com a imatge** i no tenen capa de text. Sense OCR no
  se'n pot treure res, i un OCR sobre un examen oficial hi posaria errates.
- **46/19** (`Models-subprova-coneixements-i-plantilles-correccio-4619.pdf`)
  té la plantilla amb les «C» llegides com a «e» (`14 e B`, `17 ,e D`).
  Endevinar-les seria posar respostes falses.
- **Coneixements i idiomes 46/23** són blocs de comprensió lectora: setze
  textos amb sis preguntes cadascun, numerades de l'1 al 6 cada cop. Sense
  el text al davant, les preguntes no volen dir res.

La regla, aquí, és que davant del dubte la pregunta es queda fora. Una
pregunta amb la resposta canviada és pitjor que no tenir-la, perquè algú
se l'aprendrà malament.
