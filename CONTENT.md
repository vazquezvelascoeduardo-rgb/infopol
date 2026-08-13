# Publicar contingut sense fer un build nou

Aquest document explica com actualitzar el temari, els psicotècnics, els tests,
les flashcards, les infraccions i els protocols de l'app **sense compilar res,
sense passar per Xcode ni Android Studio i sense revisió d'App Store o Google Play**.

---

## Per què abans no funcionava

Fins ara tot el contingut vivia dins de `src/data/*.js` i s'incrustava dins del
paquet JavaScript en fer `npm run build`. Capacitor copia aquest paquet dins del
binari (`webDir: 'dist'`), així que **el contingut viatjava dins de l'app**:
canviar una pregunta obligava a fer build, `cap sync`, arxivar, pujar a la botiga
i esperar la revisió. Per això les novetats de la web mai arribaven a l'app.

A més, els **psicotècnics** no existien: a la pantalla d'acadèmia només hi havia
un quadre decoratiu sense pantalla ni preguntes al darrere.

## Com funciona ara

L'app llegeix el contingut per aquest ordre:

1. El **JSON remot** descarregat en aquesta sessió.
2. El **JSON remot desat** al dispositiu (memòria cau) d'una sessió anterior.
3. El **contingut inclòs al binari** (`src/content/bundled.js`), com a reserva.

En arrencar — i cada cop que l'app torna a primer pla — es comprova si hi ha una
versió nova. Si el `version` del JSON remot és **més alt** que el que té el
dispositiu, s'adopta i queda desat. Si no hi ha internet, l'app segueix
funcionant amb l'últim contingut descarregat.

> ⚠️ Això actualitza **dades**, no codi. És el que permeten expressament les dues
> botigues. Una funcionalitat nova (una pantalla que encara no existeix) sí que
> continua necessitant un build.

---

## Publicar una actualització

### 1. Edita el contingut

Edita els fitxers de `src/data/`:

| Fitxer | Què conté |
|---|---|
| `src/data/temari.js` | Lliçons de cada bloc del temari |
| `src/data/academia.js` | Blocs (`TEMES`), preguntes de test, flashcards, proves físiques |
| `src/data/psicotecnics.js` | Categories i preguntes de psicotècnics |
| `src/data/infractions.js` | Infraccions de trànsit |
| `src/data/protocols.js` | Protocols operatius |

### 2. Genera i valida el JSON

```bash
npm run content:build     # escriu content/content.json amb la versió +1
npm run content:check     # valida format, versions i respostes correctes
```

`content:check` avisa, entre altres coses, si una pregunta té l'índex `correct`
fora de rang o si una categoria de psicotècnics s'ha quedat sense preguntes.

### 3. Publica-ho

```bash
git add content/content.json src/data
git commit -m "Contingut: temari nou + psicotècnics"
git push -u origin main
```

Les apps instal·lades detecten la versió nova la pròxima vegada que s'obren.
L'usuari també pot forçar-ho des de **Perfil → Contingut → Actualitzar**.

---

## D'on descarrega el contingut

Per ordre, la primera font que respongui correctament:

1. `VITE_CONTENT_URL` — variable d'entorn fixada en fer el build.
2. `https://raw.githubusercontent.com/vazquezvelascoeduardo-rgb/infopol/main/content/content.json`

Configurat a `src/content/ContentProvider.jsx` (constant `CONTENT_SOURCES`).

### Servir-ho des d'infopol.app

Si prefereixes controlar-ho des del teu domini, publica el mateix JSON a
`https://infopol.app/app-content.json` i compila una vegada amb:

```bash
VITE_CONTENT_URL=https://infopol.app/app-content.json npm run build
```

L'única condició és que la URL respongui amb capçalera CORS
`Access-Control-Allow-Origin: *`, perquè la WebView de Capacitor no comparteix
origen amb el teu domini. (`raw.githubusercontent.com` ja la retorna.)

### Provar una font alternativa sense recompilar

Des de la consola de la WebView:

```js
localStorage.setItem('infopol.content.url', 'https://exemple.com/proves.json');
location.reload();
```

---

## Format del JSON

```jsonc
{
  "version": 2,                 // OBLIGATORI · enter · ha de pujar a cada publicació
  "updatedAt": "2026-08-13",
  "label": "Contingut v2",

  "temes": [                    // blocs del temari
    { "id": 1, "title": "…", "cat": "leyes", "icon": "scale",
      "lessons": 14, "done": 14, "status": "done" }
  ],

  "temari": {                   // lliçons, indexades per id de bloc
    "3": {
      "intro": "…",
      "lessons": [
        { "id": "t3-l2", "title": "…", "minutes": 16, "summary": "…",
          "blocks": [
            { "h": "Títol", "p": "Paràgraf" },
            { "list": ["Punt 1", "Punt 2"] },
            { "note": "Avís destacat" }
          ] }
      ]
    }
  },

  "testQuestions":  [ { "id": "q001", "temaTitle": "…", "question": "…",
                        "options": ["A","B","C","D"], "correct": 1,
                        "explanation": "…", "xp": 20 } ],

  "psicoCategories": [ { "id": "series-num", "cat": "psico", "icon": "hash",
                         "title": "Sèries numèriques", "desc": "…", "minutes": 12 } ],

  "psicoQuestions": { "series-num": [ /* mateix format que testQuestions */ ] },

  "flashcards":    [ { "id": "fc001", "tema": "…", "question": "…",
                       "answer": "…", "cat": "leyes" } ],
  "physicalTests": [ /* … */ ],
  "infractions":   [ /* … */ ],
  "protocols":     [ /* … */ ]
}
```

Notes importants:

- **`correct` és l'índex de la resposta correcta començant per 0.** La primera
  opció és `0`, no `1`.
- Les claus que no incloguis al JSON **no es perden**: es mantenen les del binari.
  Pots publicar només `psicoQuestions` si només toques psicotècnics.
- `cat` accepta: `leyes`, `operativa`, `transito`, `alcohol`, `atajos`, `tests`,
  `academia`, `physical`, `psico`. Determina el color de la targeta.
- Si el JSON és invàlid o la versió no puja, l'app **l'ignora** i segueix amb el
  contingut bo. Mai es queda en blanc.

---

## Quan sí que cal un build nou

- Pantalles o funcionalitats noves.
- Canvis de disseny, navegació o icones.
- Actualitzar `src/content/bundled.js` perquè una instal·lació nova ja porti el
  contingut al dia sense haver de descarregar res. En fer-ho, puja també
  `BUNDLED_VERSION` i torna a generar el JSON amb una versió superior.

Per a la resta, `npm run content:build` i un `git push` són suficients.
