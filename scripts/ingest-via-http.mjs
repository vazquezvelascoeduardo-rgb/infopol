#!/usr/bin/env node
// Ingesta del corpus del Chat via HTTP contra l'Edge Function desplegada.
// Pensat per a la càrrega inicial automatitzada (bootstrap) o per a
// re-indexacions des de CI. Ús:
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_ANON_KEY=sb_publishable_... \
//   BOOTSTRAP_TOKEN=... \
//   node scripts/ingest-via-http.mjs [--batch 6] [--from 0]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const URL_BASE = process.env.SUPABASE_URL ?? 'https://dnjblfqantxdqfvqbqqi.supabase.co';
const ANON = process.env.SUPABASE_ANON_KEY ?? '';
const TOKEN = process.env.BOOTSTRAP_TOKEN ?? '';
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const BATCH = opt('batch', 6);
const FROM = opt('from', 0);

if (!ANON || !TOKEN) {
  console.error('Falten SUPABASE_ANON_KEY o BOOTSTRAP_TOKEN a l\'entorn.');
  process.exit(1);
}

const corpus = JSON.parse(readFileSync(join(ROOT, 'public', 'chat-corpus.json'), 'utf8'));
console.log(`Corpus: ${corpus.length} documents · lots de ${BATCH} · començant a ${FROM}`);

async function call(body) {
  const r = await fetch(`${URL_BASE}/functions/v1/infopol-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      'x-bootstrap-token': TOKEN,
    },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let d;
  try { d = JSON.parse(text); } catch { d = { error: `HTTP ${r.status}: ${text.slice(0, 200)}` }; }
  if (!r.ok && !d.error) d.error = `HTTP ${r.status}`;
  return d;
}

let errors = 0;
for (let i = FROM; i < corpus.length; i += BATCH) {
  const batch = corpus.slice(i, i + BATCH);
  const t0 = Date.now();
  const d = await call({ action: 'ingest', documents: batch, replace: true });
  if (d.error) {
    errors++;
    console.error(`❌ lot ${i}-${i + batch.length}: ${d.error}`);
    if (errors >= 3) { console.error(`ATURAT. Reprèn amb: --from ${i}`); process.exit(1); }
    i -= BATCH; // reintenta el mateix lot
    await new Promise((r) => setTimeout(r, 4000));
    continue;
  }
  errors = 0;
  console.log(`✔ ${Math.min(i + BATCH, corpus.length)}/${corpus.length} (+${d.inserted} fragments, total ${d.total}) ${Date.now() - t0} ms`);
}
const stats = await call({ action: 'stats' });
console.log(`🎉 Ingesta completa. Fragments totals: ${stats.count}`);
