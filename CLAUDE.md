# InfoPol — Rutina Diària de Notícies

## Propòsit d'aquesta sessió programada

Ets la rutina automàtica diària d'InfoPol, programada per executar-se cada dia a les **22:00h**.
La teva tasca és buscar les notícies del dia, afegir-les al codi i fer push.

---

## Procés pas a pas

### 1. Buscar notícies d'avui

Fes cerques web en paral·lel per a **cada categoria** amb la data d'avui:

| Àmbit       | Categories a cobrir                              |
|-------------|--------------------------------------------------|
| Catalunya   | política, economia, succés, cultura, esport local |
| Espanya     | política, economia, legislació, succés rellevant  |
| Internacional | política, conflictes, economia, ciència, cultura, premis, esport |

Consultes de cerca recomanades (substituir `[DATA]` per la data d'avui):
- `"notícies Catalunya [DATA] política economia"`
- `"noticias España [DATA] política economía legislación"`
- `"news world [DATA] politics economy science sports"`
- `"noticias policiales sucesos Cataluña España [DATA]"`
- `"descubrimientos ciencia premios [DATA]"`
- `"deportes resultados España [DATA]"`

### 2. Seleccionar les notícies

Tria **5–10 notícies** representant el màxim de categories possible. Prioritza:
- Notícies amb impacte directe a Catalunya o Espanya
- Esdeveniments únics d'avui (inauguracions, resultats, sentències, descobriments)
- Notícies amb URL verificable a l'article original

### 3. Afegir les notícies al codi

Edita **dos fitxers** seguint el patró existent:

#### `server/index.js` — array `NEWS`
```js
{
  id: 'nXXX',           // Número seqüencial seguint l'última entrada
  date: 'YYYY-MM-DD',   // Data ISO
  dateLabel: 'MM·DD',   // Ex: '06·11'
  tag: 'ETIQUETA',      // Veure taula d'etiquetes
  title: 'Titular en català',
  desc: 'Resum breu en català (màxim 2 frases).',
  url: 'https://...',   // URL de l'article original (mai null per a noves entrades)
}
```

#### `src/screens/operativa/ScreenOperativaHome.jsx` — array `NEWS`
```js
{ date: 'MM·DD', tag: 'ETIQUETA', title: 'Titular en català', desc: 'Resum.', url: 'https://...' }
```

**Regles importants:**
- Afegir sempre les noves notícies al **PRINCIPI** dels arrays (ordre cronològic invers)
- Mai eliminar notícies existents
- Escriure sempre en **català**
- Incloure sempre una URL vàlida a l'article original

### 4. Commit i push

```bash
git add server/index.js src/screens/operativa/ScreenOperativaHome.jsx
git commit -m "notícies: actualització diària [DATA]"
git push -u origin claude/great-dijkstra-mwmpn8
```

---

## Taula d'etiquetes

| Etiqueta        | Quan usar-la                                    |
|-----------------|-------------------------------------------------|
| `POL · CAT`     | Política catalana (Generalitat, partits, etc.)  |
| `POL · ESP`     | Política espanyola (Govern, Congrés, etc.)      |
| `INT · POL`     | Política internacional                          |
| `INT · CONFLICTE` | Guerres, conflictes armats, crisi diplomàtica |
| `ECO · CAT`     | Economia catalana                               |
| `ECO · ESP`     | Economia espanyola (pressupostos, EPA, IPC...)  |
| `ECO · INT`     | Economia internacional (BCE, Fed, mercats...)   |
| `ESPORT`        | Resultats i notícies esportives generals        |
| `UCL YYYY-YY`   | Champions League (final, semifinals, etc.)      |
| `MUNDIAL YYYY`  | Copa del Món de futbol                          |
| `SUCCÉS`        | Crims, operacions policials, sentències         |
| `JUDICIAL`      | Sentències rellevants, processos judicials      |
| `CIÈNCIA`       | Descobriments, recerca, espai, tecnologia       |
| `CULTURA`       | Premis, art, literatura, cinema                 |
| `LO X/YYYY`     | Llei orgànica (legislació)                      |
| `RD X/YYYY`     | Reial decret (legislació)                       |
| `Circ. X/YYYY`  | Circulars fiscalia / instruccions policials     |

---

## Exemple de notícia ben formatada

```js
{
  id: 'n015',
  date: '2026-06-12',
  dateLabel: '06·12',
  tag: 'POL · CAT',
  title: 'El Parlament aprova els pressupostos de la Generalitat per al 2027',
  desc: 'Primera aprovació pressupostària en tres anys. El document destina 2.200 M€ a sanitat i 1.800 M€ a educació.',
  url: 'https://www.parlament.cat/...',
}
```

---

## Notificació

Si l'execució és correcta, envia una notificació breu amb el resum de les notícies afegides.
Si hi ha errors (la cerca no retorna resultats, fallada de push, etc.), notifica l'error immediatament.
