#!/usr/bin/env node
// Genera el corpus del Chat InfoPol (public/chat-corpus.json) a partir
// del contingut ja verificat del repo:
//   1. Fitxes d'Operativa (trànsit + penal) — arbres de decisió aplanats
//   2. Nomenclàtor SCT 2026 (534 infraccions, per llei i en lots)
//   3. Catàleg d'actes de la PL Viladecans (quan procedeix cadascuna)
//   4. Taula d'actes policials (mòdul penal)
//   5. Fitxes de lleis de content/ (Markdown i HTML, netejats)
//
// Sortida: array de documents {title, source, kind, content} preparats
// per a l'acció `ingest` de l'Edge Function infopol-chat (que els
// trosseja i els vectoritza). Executar: node scripts/build-chat-corpus.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'public', 'chat-corpus.json');
const MAX_DOC = 4500; // caràcters per document (la funció trosseja més fi)

const docs = [];
const push = (title, source, kind, content) => {
  const clean = content.replace(/\n{3,}/g, '\n\n').trim();
  if (!clean) return;
  if (clean.length <= MAX_DOC) { docs.push({ title, source, kind, content: clean }); return; }
  // Divideix per paràgrafs respectant el límit.
  let part = 1, buf = '';
  for (const p of clean.split(/\n\n+/)) {
    if ((buf + '\n\n' + p).length > MAX_DOC && buf) {
      docs.push({ title: `${title} (${part})`, source, kind, content: buf.trim() });
      part++; buf = p;
    } else buf = buf ? buf + '\n\n' + p : p;
  }
  if (buf.trim()) docs.push({ title: part > 1 ? `${title} (${part})` : title, source, kind, content: buf.trim() });
};

/* ── 1) Fitxes d'Operativa ───────────────────────────────────── */
const flat = (v, indent = '') => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map((x) => `${indent}- ${flat(x)}`).join('\n');
  return Object.entries(v).map(([k, x]) => `${indent}${k.replace(/_/g, ' ')}: ${flat(x, indent + '  ')}`).join('\n');
};

function checklistToText(j) {
  const L = [];
  L.push(`FITXA OPERATIVA: ${j.titol}`);
  if (j.base_legal) L.push(`Base legal: ${[].concat(j.base_legal).join(' · ')}`);
  for (const [k, v] of Object.entries(j)) {
    if (['id', 'titol', 'categoria', 'icono', 'base_legal', 'inici', 'nodes'].includes(k)) continue;
    L.push(`\n${k.replace(/_/g, ' ').toUpperCase()}:\n${flat(v)}`);
  }
  L.push('\n=== SITUACIONS I PREGUNTES DE LA FITXA ===');
  for (const n of Object.values(j.nodes || {})) {
    if (n.final) continue;
    L.push(`• ${n.titol}${n.text ? ' — ' + n.text : ''}`);
    if (n.info) L.push(`  ${n.info}`);
  }
  L.push('\n=== RESULTATS (SANCIONS I PROCEDIMENT) ===');
  for (const n of Object.values(j.nodes || {})) {
    if (!n.final) continue;
    L.push(`\n► ${n.titol}`);
    if (n.concepte_butlleta) L.push(`Concepte de butlleta: ${n.concepte_butlleta}`);
    const meta = [n.article_butlleta && `Article: ${n.article_butlleta}`, n.import && `Import: ${n.import}`, n.punts && `Punts: ${n.punts}`, n.pena && `Pena: ${n.pena}`].filter(Boolean);
    if (meta.length) L.push(meta.join(' | '));
    for (const key of ['info', 'info_clau', 'accio']) if (n[key]) L.push(`${n[key]}`);
    for (const key of ['accions_ordenades', 'accions_operatives', 'requisits_clau', 'exemples', 'qual_es_qual']) {
      if (n[key]) L.push(`${key.replace(/_/g, ' ')}:\n${flat(n[key])}`);
    }
    if (n.actes_viladecans) L.push(`Actes a emplenar (PL Viladecans):\n${flat(n.actes_viladecans)}`);
  }
  if (j.notes_finals) L.push(`\nNOTES FINALS:\n${flat(j.notes_finals)}`);
  return L.join('\n');
}

for (const dir of ['trafico-checklists', 'penal-checklists']) {
  const base = join(ROOT, 'src', 'data', dir);
  for (const f of readdirSync(base).filter((x) => x.endsWith('.json') && !x.startsWith('_index'))) {
    const j = JSON.parse(readFileSync(join(base, f), 'utf8'));
    const area = dir.startsWith('trafico') ? 'Trànsit' : 'SC/Penal';
    if (f.startsWith('_taula')) {
      push(`Taula d'actes policials (${area})`, `operativa/${j.id || f}`, 'acta', flat(j));
    } else {
      push(`Operativa ${area} — ${j.titol}`, `operativa/${dir.startsWith('trafico') ? 'trafico' : 'penal'}/${j.id}`, 'procediment', checklistToText(j));
    }
  }
}

/* ── 2) Nomenclàtor SCT ──────────────────────────────────────── */
{
  const raw = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'sct-nomenclator.json'), 'utf8'));
  const arr = Array.isArray(raw) ? raw : Object.values(raw).find(Array.isArray);
  const byLaw = new Map();
  for (const e of arr) {
    const k = e.lawShort || 'ALTRES';
    if (!byLaw.has(k)) byLaw.set(k, []);
    byLaw.get(k).push(e);
  }
  const SEV = { L: 'LLEU', G: 'GREU', MG: 'MOLT GREU' };
  for (const [law, entries] of byLaw) {
    for (let i = 0; i < entries.length; i += 25) {
      const chunk = entries.slice(i, i + 25);
      const body = chunk.map((e) =>
        `${law} art. ${e.article} [${SEV[e.severity] || e.severity}] ${e.fine} € (DTE ${e.dte} €)${e.points ? ` −${e.points} punts` : ''}: ${(e.concepte || '').slice(0, 220)}`
      ).join('\n');
      const n = Math.floor(i / 25) + 1;
      push(`Nomenclàtor SCT 2026 — ${law} (bloc ${n})`, `sct/${law.toLowerCase()}-${n}`, 'llei',
        `CATÀLEG OFICIAL D'INFRACCIONS DE TRÀNSIT (SCT 2026) — ${chunk[0]?.lawFull || law}\n${body}`);
    }
  }
}

/* ── 3) Catàleg d'actes de Viladecans (parse del .ts) ────────── */
{
  const ts = readFileSync(join(ROOT, 'src', 'data', 'actes-viladecans.ts'), 'utf8');
  const entries = [...ts.matchAll(/\{\s*serie:\s*'(\w+)',\s*codi:\s*'([^']+)',\s*nom:\s*(['"])([\s\S]*?)\3,(?:\s*variants:\s*(['"])([\s\S]*?)\5,)?(?:\s*ambit:\s*'(\w+)',)?\s*quan:\s*"([\s\S]*?)"\s*\}/g)];
  if (entries.length < 60) throw new Error(`Parse actes: només ${entries.length} entrades — revisa la regex`);
  const bySerie = new Map();
  for (const m of entries) {
    const [, serie, codi, , nom, , variants, ambit, quan] = m;
    if (!bySerie.has(serie)) bySerie.set(serie, []);
    bySerie.get(serie).push(`${codi} — ${nom}${ambit ? ` [${ambit}]` : ''}${variants ? ` (versions: ${variants})` : ''}\nQuan procedeix: ${quan}`);
  }
  for (const [serie, list] of bySerie) {
    push(`Actes PL Viladecans — Sèrie ${serie}`, `actes-viladecans/${serie.toLowerCase()}`, 'acta',
      `CATÀLEG D'ACTES I DOCUMENTS DE LA POLICIA LOCAL DE VILADECANS — Sèrie ${serie}\n\n${list.join('\n\n')}`);
  }
  console.log(`Actes parsejades: ${entries.length}`);
}

/* ── 4) Fitxes de lleis de content/ ──────────────────────────── */
const stripHtml = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<br\s*\/?>(\s*)/gi, '\n')
  .replace(/<\/(p|div|li|h[1-6]|tr|section|article)>/gi, '\n')
  .replace(/<li[^>]*>/gi, '- ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#\d+;|&[a-z]+;/gi, ' ')
  .replace(/[ \t]{2,}/g, ' ');
const stripMd = (s) => s
  .replace(/^---[\s\S]*?---\n/, '')     // frontmatter
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // imatges
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[#*_`>]+/g, ' ')
  .replace(/[ \t]{2,}/g, ' ');

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    const ext = extname(name).toLowerCase();
    if (ext !== '.md' && ext !== '.html') continue;
    const raw = readFileSync(p, 'utf8');
    const text = ext === '.md' ? stripMd(raw) : stripHtml(raw);
    const title = basename(name, ext).replace(/[-_]/g, ' ');
    const rel = p.slice(ROOT.length).replace(/^content\//, '');
    push(`Fitxa legal — ${title}`, `content/${rel}`, 'llei', text);
  }
}
walk(join(ROOT, 'content'));

/* ── Sortida ─────────────────────────────────────────────────── */
writeFileSync(OUT, JSON.stringify(docs, null, 1) + '\n');
const bytes = statSync(OUT).size;
const byKind = {};
for (const d of docs) byKind[d.kind] = (byKind[d.kind] || 0) + 1;
console.log(`✔ ${docs.length} documents → public/chat-corpus.json (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
console.log('Per tipus:', byKind);
