# InfoPol — Instruccions per a sessions programades

## Tasca diària de notícies (22:00)

Quan s'executa una sessió programada diària, realitza els passos següents **en ordre**.

---

### PAS 1 — Cerca exhaustiva de notícies

Fes cerques web per trobar les **notícies més importants del dia** en totes les combinacions de categoria i àmbit geogràfic de la taula:

| `cat` (valor intern) | Descripció | Termes de cerca suggerits |
|---|---|---|
| `política` | Política, governança, eleccions, partits | política cataluña/españa/mundial |
| `economia` | Mercat de treball, finances, empresa, Borsa | economia, mercat, empresa, borsa, atur |
| `cultura` | Art, música, literatura, cinema, patrimoni, festivals | cultura, art, cinema, música, patrimoni |
| `descobriment` | Ciència, recerca, tecnologia, medi ambient | investigació, descobriment, ciència, tecnologia, IA |
| `premi` | Premis, guardons, reconeixements | premi, guardó, reconeixement, award |
| `esport` | Futbol, tenis, bàsquet, atletisme, F1, etc. | FCB, LaLiga, NBA, Wimbledon, MotoGP, atletisme |
| `policial` | Successos, judicial, legislació, seguretat, Mossos | mossos, policia, jutjat, judici, detenció, sentència |

| `geo` (valor intern) | Àmbit |
|---|---|
| `catalunya` | Notícies específiques de Catalunya |
| `espanya` | Notícies d'àmbit estatal (no exclusivament catalanes) |
| `internacional` | Notícies internacionals / món |

**Objectiu:** selecciona entre **10 i 15 notícies** del dia, equilibrades entre categories i àmbits. Prioritza notícies rellevants, d'impacte real i verificades. Descarta rumors, notícies d'entreteniment fútil o continguts publicitaris.

**Fonts recomanades (en ordre de preferència):**
- Catalunya: VilaWeb, Ara, El Periódico, CCMA/324, Betevé, NacióDigital
- Espanya: El País, El Mundo, La Vanguardia, Europa Press, EFE
- Internacional: Reuters, AFP, BBC, Le Monde, El País Internacional

---

### PAS 2 — Format de cada entrada

Cada notícia ha de seguir **exactament** aquesta estructura JavaScript:

```javascript
{
  id: 'n-YYYYMMDD-###',   // ex: 'n-20260607-001', '002', '003'…
  date: 'YYYY-MM-DD',      // data d'avui
  dateLabel: 'MM·DD',      // ex: '06·07'
  tag: 'ETIQUETA',         // etiqueta breu: font, institució o àmbit (màx 15 car.)
  title: 'Títol breu',     // en CATALÀ, màxim 80 caràcters
  desc: 'Resum breu.',     // en CATALÀ, 1-2 frases, màxim 200 caràcters
  url: 'https://...',      // URL a la notícia original (obligatori)
  cat: 'política',         // una de les 7 categories de dalt
  geo: 'catalunya',        // un dels 3 àmbits de dalt
},
```

**Regles de format:**
- `id`: El comptador `###` comença en `001` cada dia i s'incrementa (`001`, `002`…)
- `tag`: Etiqueta contextual breu. Exemples: `'PSC'`, `'Mossos'`, `'FCB'`, `'BCE'`, `'LaLiga'`, `'Govern'`, `'UE'`, `'ONU'`, `'Fiscalia'`, `'TSJC'`, `'TS'`, `'NASA'`, `'F1'`…
- `title`: Clar, directe, en català. No usar majúscules innecessàries ni clickbait.
- `desc`: Resum neutre que contingui el fet clau + context mínim. Pot incloure xifres rellevants.
- `url`: URL real de l'article, no de la portada del diari.

---

### PAS 3 — Actualitza `server/index.js`

1. Llegeix el fitxer `/home/user/infopol/server/index.js`
2. **Insereix** les noves entrades **al principi** del array `NEWS` (les més recents primer)
3. **Elimina** les entrades amb `date` de fa **més de 30 dies** respecte a la data d'avui
4. Mantén un **màxim de 60 entrades** al array (elimina les més antigues si cal)
5. Guarda el fitxer

---

### PAS 4 — Commit i push

Executa la branca correcta i fes el commit:

```bash
git add server/index.js
git commit -m "noticias: actualització diaria $(date +%Y-%m-%d)

$(date +%Y-%m-%d): X notícies noves afegides (política, economia, esport…)"
git push -u origin main
```

Substitueix `X` pel nombre real d'entrades afegides i la llista de categories incloses.

---

### Notes importants

- **Idioma obligatori:** Tots els `title` i `desc` en **català**. Si la notícia és internacional, tradueix el titular al català.
- **Verificació:** Si una notícia no té URL directa vàlida, descarta-la.
- **No duplicar:** Comprova que no existeixi ja una entrada amb el mateix contingut a l'array actual.
- **Errors:** Si la cerca no retorna resultats vàlids per alguna categoria, no afegeixis entrades falses; simplement ometi-la.
- **Qualitat > Quantitat:** És millor afegir 8 notícies sòlides que 15 de dubtosa rellevància.
