# InfoPol — Claude Code Project Guide

## Stack
- React 18 + React Router v6 + Vite (frontend)
- Express.js port 3001 (backend / API)
- Capacitor (iOS + Android builds)

## Dev
```
npm run dev    # Vite :5173 + Express :3001
npm run build  # production build → dist/
```

## News automation — daily at 22:00

This project has a scheduled Claude Code session that runs every day at 22:00
to search for and publish the day's news. The session should follow these steps:

### 1 — Search for news (parallel searches)
Search these topics for the current date:
- Notícies polítiques Catalunya i Espanya
- Economia, habitatge, empresa, mercats
- Internacional (conflictes, cimeres, geopolítica)
- Esports (resultats, Copa, Liga, Mundial si escau)
- Cultura, ciència, descobriments, premis
- Successos policials i judicials a Catalunya i Espanya
- Qualsevol cosa rellevant per a agents de policia (legislació, dispositius)

### 2 — Format news items
Each item must follow this schema (written in Catalan):
```json
{
  "id": "n{YYYYMMDD}_{NNN}",
  "date": "YYYY-MM-DD",
  "dateLabel": "MM·DD",
  "category": "internacional|politica|economia|esports|cultura|seguretat|ciencia",
  "tag": "INTERNACIONAL|POLÍTICA|ECONOMIA|ESPORTS|CULTURA|SEGURETAT|CIÈNCIA",
  "title": "Headline in Catalan (max ~80 chars)",
  "desc": "Two-sentence summary in Catalan",
  "url": "https://link-to-full-article"
}
```

### 3 — Update server/noticias.json
- Keep the last 30 days of news (drop older items).
- Prepend today's items at the top of the array.
- Aim for 6–10 quality items per day across all categories.

### 4 — Commit and push
```
git add server/noticias.json
git commit -m "noticias: {YYYY-MM-DD} actualització diària"
git push -u origin claude/great-dijkstra-frrmfe
```

## Category → color mapping (tokens)
| Category    | Color   | Hex       |
|-------------|---------|-----------|
| internacional | teal  | #1FB286   |
| esports       | orange| #FF7A1A   |
| economia      | purple| #9C4FE0   |
| seguretat     | blue  | #3B6BF5   |
| politica      | amber | #E89421   |
| cultura       | gold  | #F0B400   |
| ciencia       | cyan  | #0BB4C2   |
