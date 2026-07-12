# InfoPol Chat — guia de desplegament (5 passos, ~10 min)

El Chat és un RAG: el corpus del repo (fitxes d'operativa, nomenclàtor SCT,
actes de Viladecans i fitxes de lleis) es vectoritza a Supabase i Gemini
respon citant NOMÉS aquest contingut.

## 0) Requisits
- Una clau de **Google AI Studio** (gratuïta): https://aistudio.google.com/apikey
- Node instal·lat (per al CLI de Supabase via npx).

## 1) Esquema de base de dades (una vegada)
Obre el **SQL Editor** del projecte `dnjblfqantxdqfvqbqqi` i executa el
contingut de `supabase/migrations/20260712000000_infopol_chat.sql`.
(És idempotent: re-executar-lo no fa mal.)

## 2) Secret de la funció
```bash
npx supabase login                        # una vegada (obre el navegador)
npx supabase secrets set GEMINI_API_KEY=LA_TEVA_CLAU \
  --project-ref dnjblfqantxdqfvqbqqi
```
Opcional: `ADMIN_EMAILS=email1,email2` (per defecte ja hi ha els 2 admins).

## 3) Desplegar la funció
Des de l'arrel del repo:
```bash
npx supabase functions deploy infopol-chat --project-ref dnjblfqantxdqfvqbqqi
```

## 4) Regenerar el corpus (cada cop que canviï el contingut de la web)
```bash
node scripts/build-chat-corpus.mjs   # genera public/chat-corpus.json
git add public/chat-corpus.json && git commit && git push
```

## 5) Indexar el corpus (des de la web, un clic)
1. Entra a **infopol.app/chat** amb un compte admin.
2. Obre **"Carregar contingut (admin)"** → targeta **"Corpus InfoPol complet"**
   → **"Indexar-ho tot"**.
3. Espera la barra de progrés (~2-4 min). Cada `source` SUBSTITUEIX la seva
   versió anterior: pots repetir-ho sempre que actualitzis contingut.

## Com funciona per dins
- `ingest`: trosseja (~1.600 caràcters amb solapament), vectoritza amb
  `text-embedding-004` i desa a `chat_docs` (replace per font).
- `ask`: vectoritza la pregunta → `match_chat_docs` (HNSW, cosinus, top 10)
  → Gemini 2.5 Flash amb un prompt d'expert que: respon només amb el
  context, cita fonts [n], aplica el model de custòdia de Viladecans
  (A 54, mai AD 01) i tanca sempre amb l'avís de verificació.
- Límit: 40 consultes/usuari/dia (admins exempts). Taula `chat_usage`.

## Costos orientatius (Gemini, juliol 2026)
- Ingesta completa del corpus (~1,2 MB): cèntims, una vegada.
- Cada pregunta: ~3-6k tokens d'entrada + ~500 de sortida → fraccions de
  cèntim amb Flash. 18 usuaris actuals = cost negligible.
