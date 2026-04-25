# InfoPol

App de consulta personal per a agents de policia local (Catalunya).
Funciona com a **PWA**: es pot instal·lar al mòbil i a l'escriptori i funciona **sense connexió** un cop oberta.

---

## Com engegar l'app al teu ordinador

Només cal fer-ho un cop:

1. Instal·la **Node.js 20 o superior** des de https://nodejs.org (el botó "LTS").
2. Obre el terminal (Mac: _Terminal_; Windows: _PowerShell_).
3. Vés a la carpeta del projecte:
   ```bash
   cd ruta/a/infopol
   ```
4. Instal·la les dependències (només el primer cop):
   ```bash
   npm install
   ```

Per treballar dia a dia:

- **Mode desenvolupament** (recàrrega automàtica mentre edites fitxes):
  ```bash
  npm run dev
  ```
  Obre el navegador a l'adreça que et mostra el terminal (normalment `http://localhost:5173`).

- **Previsualitzar com funcionarà la versió final**:
  ```bash
  npm run build
  npm run preview
  ```

---

## Com afegir una fitxa nova (sense tocar codi)

Cada **fitxa** és un fitxer amb extensió `.md` (Markdown) dins de la carpeta `content/`.

### 1) Tria la secció on vols afegir la fitxa

Les carpetes disponibles són:

| Secció a l'app | Descripció                                 | Carpeta              |
| -------------- | ------------------------------------------ | -------------------- |
| CE78           | Constitució Espanyola de 1978              | `content/ce78/`      |
| Codi penal     | Llei Orgànica 10/1995, del Codi penal      | `content/codi-penal/`|
| EAC            | Estatut d'Autonomia de Catalunya           | `content/eac/`       |
| FCS            | Forces i Cossos de Seguretat               | `content/fcs/`       |
| LECrim         | Llei d'Enjudiciament Criminal              | `content/lecrim/`    |
| Menors         | Normativa relativa a menors                | `content/menors/`    |
| Municipi       | Règim municipal i ordenances               | `content/municipi/`  |
| SC             | Seguretat Ciutadana (LOPSC)                | `content/sc/`        |
| Trànsit        | Trànsit, circulació i seguretat viària     | `content/transit/`   |

### 2) Crea un fitxer `.md` dins d'aquesta carpeta



El nom del fitxer ha d'estar **en minúscules, sense accents ni espais**, amb guions. Per exemple:

```
content/transit/exces-de-velocitat.md
```

### 3) Copia aquesta plantilla i edita-la

```markdown
---
title: Excés de velocitat — Art. 76 — sanció 300 €
---

# Excés de velocitat — Art. 76 — sanció 300 €

**Àmbit:** Llei sobre Trànsit (RDL 6/2015).

## Conducta
Descripció breu de la conducta sancionable.

## Sanció
- **Import:** 300 €
- **Punts:** 2
- **Graduació:** greu

## Procediment
1. Identificació del conductor.
2. Redacció del butlletí.
3. Trasllat a tràmit.

## Observacions
> Notes pràctiques, referències, etc.
```

El que hi ha entre les dues línies `---` és la **cabecera** (frontmatter): només cal `title`. El títol és el que apareixerà al llistat.
Tot el que hi ha a sota és **text lliure en Markdown**:

- `# Títol`, `## Subtítol`, `### Subsubtítol`
- Llistes amb `- ` o `1. `
- **negreta** amb `**text**`, *cursiva* amb `*text*`
- `codi en línia` amb cometes inverses
- Cites amb `> `
- Enllaços amb `[text](https://…)`
- Línies horitzontals amb `---`

### 4) Mira-ho a l'app

Si tens `npm run dev` engegat, la fitxa apareix a l'instant dins de la secció corresponent.
Si no, prem `Ctrl+C` al terminal i torna a engegar `npm run dev`.

### 5) Per la versió publicada

Quan hagis acabat d'afegir o modificar fitxes, executa:

```bash
npm run build
```

Això genera la carpeta `dist/` amb l'app a punt per publicar.

---

## Importar fitxes en bloc des de HTML (p. ex. Google Drive)

Si tens un munt de documents a Google Drive i els vols passar a l'app de cop,
fes això:

### 1) Baixa els documents com a HTML

A Google Drive, obre la carpeta, **selecciona-ho tot** (`Ctrl+A`), botó dret →
**Descarregar**. Drive t'enviarà un **ZIP**.

Si són Google Docs natius, Drive els exportarà com a HTML automàticament.

### 2) Descomprimeix i posa els HTML a `_import/`

Dins de la carpeta del projecte, crea una carpeta `_import/` i copia-hi
**tots els fitxers .html** (poden estar en subcarpetes; no passa res).

```
infopol/
└── _import/
    ├── Constitució art 17.html
    ├── trànsit/
    │   └── alcoholèmia.html
    └── … (tots els teus fitxers)
```

### 3) Executa la importació

Des del terminal, dins la carpeta `infopol`:

```bash
npm run import
```

El script farà això automàticament:

- Llegirà tots els `.html` dins de `_import/`.
- Convertirà cada un a **Markdown** net.
- **Classificarà** cada fitxa al mòdul correcte mirant el nom del fitxer i
  el contingut (busca paraules clau com *Constitució*, *Codi penal*,
  *Trànsit*, *LOPSC*, *alcoholèmia*, *menor*, etc.).
- Desarà cada fitxa a `content/<modul>/<nom>.md` amb el títol al
  _frontmatter_ (ja llest per aparèixer a l'app).

### 4) Revisa el resum

Al final veuràs un resum com aquest:

```
Resum:
  ce78: 5
  codi-penal: 12
  transit: 8
  _sense-classificar: 2
```

Si n'hi ha cap a **`_sense-classificar`**, vol dir que no ha trobat pistes
clares al nom ni al contingut. Obre `content/_sense-classificar/`, mira cada
`.md` i mou-lo a la carpeta correcta.

### 5) Comprova a l'app

Engega `npm run dev` i navega per les seccions. Si alguna fitxa ha caigut al
mòdul equivocat, **arrossega-la** a la carpeta correcta: no cal tocar cap codi.

### 6) Neteja

Quan estiguis content amb el resultat, pots **esborrar la carpeta `_import/`**.
Ja és a `.gitignore`, així que no es puja mai al repositori.

---

## Cerca global

A la part superior hi ha una caixa de cerca. Escriu i mostrarà totes les fitxes
(de qualsevol secció) que continguin el text al **títol** o dins del **cos**.
No cal posar accents: "transit" troba "trànsit".

---

## Mode clar / fosc

El botó de la dreta del cercador canvia entre tema clar i fosc. La preferència
es desa al navegador. Per defecte, l'app s'obre en **mode fosc** (l'estètica
principal de les infografies).

Les **infografies HTML també respecten el tema**: quan poses la app en clar,
s'inverteixen automàticament la lluminositat i el fons de la ficha (sense
perdre els colors d'accent com vermell, blau o daurat), de manera que tot
quedi llegible.

---

## Icones per a cada ficha

Cada ficha mostra un icona a la llista. L'icona es tria d'aquesta manera:

1. **Override explícit** (opcional). Si el fitxer HTML té un `<meta name="infopol-icon" content="🚗">` al `<head>`, es fa servir aquest. En un fitxer Markdown, afegeix `icon: 🚗` al frontmatter.
2. **Inferit pel títol i el contingut** (p. ex., "alcoholèmia" → 🍷, "VMP" → 🛴, "constitució" → ⚖️, "armament" → 🔫, "ordenança" → 🏢, ...).
3. **Icona del mòdul** com a fallback.

Per tant, **no cal que hi facis res**: el que tinguis es classificarà sol.
Si vols forçar un icona concret, fes servir la meta tag.

---

## Com instal·lar l'app al mòbil o a l'escriptori

Un cop l'app és servida per HTTPS (o en `localhost`), el navegador permet instal·lar-la com a PWA:

- **iPhone / iPad (Safari):** botó _Compartir_ → _Afegir a la pantalla d'inici_.
- **Android (Chrome):** menú ⋮ → _Instal·la l'aplicació_ o _Afegir a la pantalla d'inici_.
- **Ordinador (Chrome / Edge):** a la barra d'adreces apareix una icona d'instal·lació (pantalla amb una fletxa cap avall).

Un cop instal·lada, la pots obrir com qualsevol altra app. Funciona **offline**
gràcies al service worker.

---

## Com publicar l'app a internet

L'app és **100% estàtica** (no necessita servidor ni base de dades). El que es publica
és el contingut de la carpeta `dist/` generada per `npm run build`.

Pots fer servir qualsevol allotjament d'estàtics gratuït; alguns exemples:

### Opció A — Vercel (recomanada, molt senzilla)

1. Crea un compte a https://vercel.com i connecta'l al repositori de Git.
2. Import → selecciona aquest repositori.
3. Framework: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Desplega. En cada _push_ al branch principal es publicarà automàticament.

### Opció B — Netlify

1. Crea un compte a https://netlify.com i connecta el repositori.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Desplega.

### Opció C — GitHub Pages

1. Executa `npm run build`.
2. Puja el contingut de `dist/` al branch `gh-pages` (amb l'acció de GitHub o manualment).

### Opció D — Qualsevol servidor web

Puja el contingut de `dist/` per FTP al teu hosting. Assegura't que el servidor
redirigeixi totes les rutes no trobades al `index.html` (per a la PWA cal **HTTPS**).

---

## Estructura del projecte (resum)

```
infopol/
├── content/                         ← LES TEVES FITXES (edita aquí)
│   ├── ce78/
│   ├── codi-penal/
│   ├── eac/
│   ├── fcs/
│   ├── lecrim/
│   ├── menors/
│   ├── municipi/
│   ├── sc/
│   └── transit/
├── public/                          ← icones i favicon
├── src/                             ← codi de l'app (normalment no cal tocar-ho)
├── index.html
├── package.json
└── vite.config.ts
```

---

## Preguntes freqüents

**Puc editar les fitxes des del mòbil?**
Sí, si tens el projecte en un servei com GitHub pots editar els fitxers `.md`
directament des del web. Quan guardis, Vercel/Netlify tornaran a publicar l'app.

**Funciona sense connexió?**
Sí. Un cop oberta l'app una primera vegada, el service worker la cacheja i
podràs consultar les fitxes sense dades mòbils.

**He afegit una fitxa i no apareix.**
- Comprova que el fitxer té extensió `.md`.
- Comprova que està dins d'una de les carpetes llistades a dalt.
- Si tens `npm run dev` engegat, refresca la pàgina.
- Si ja havies fet `npm run build`, torna a executar-lo.

**Com afegeixo una secció nova?**
Edita `src/lib/content.ts` i afegeix una entrada a l'array `MODULES` amb
`slug`, `title`, `description` i `accent`. Després crea la carpeta corresponent
dins de `content/`.

---

## Scripts disponibles

- `npm run dev` — Engega el servidor de desenvolupament.
- `npm run build` — Compila l'app per producció.
- `npm run preview` — Serveix la versió compilada localment.
- `npm run typecheck` — Comprova els tipus de TypeScript.
- `npm run icons` — Regenera els PNGs de la PWA a partir de `public/favicon.svg`.
- `npm run import` — Importa i classifica els HTML de `_import/` a `content/`.
