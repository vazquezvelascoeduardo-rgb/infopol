// Aplica el catàleg SCT 2026 (sct-nomenclator.json) al fitxer HTML
// del catàleg. Per cada llei, insereix una nova secció <div class="sec">
// al final del seu panel amb les files que NO existeixen ja al catàleg
// (dedup per article + concepte normalitzat).
//
// Format de fila generat (igual que les existents):
//   <tr class="row-{sev}">
//     <td>concepte text</td>
//     <td class="col-art">10.1</td>
//     <td><span class="sev sev-{sev}">{N}</span></td>
//     <td class="col-eur"><span class="eur-pill[heavy]">{multa}</span></td>
//     <td class="col-dte">{dte}</td>
//     <td class="col-pts">{punts ?? "—"}</td>
//   </tr>

import fs from 'node:fs';

const HTML_PATH = 'content/transit/cataleg-d-infraccions-de-transit-sct-2026.ca.html';
const JSON_PATH = 'src/data/sct-nomenclator.json';

const { rows } = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
let html = fs.readFileSync(HTML_PATH, 'utf8');

// Mapping: lawId del nomenclàtor → panel-id del HTML
const PANEL_FOR_LAW = {
  lsv: 'p-lsv',
  rgc: 'p-rgc',
  rgcond: 'p-cond',
  rgv: 'p-rgv',
  seg: 'p-seg',
  // 'repc' (escoles particulars conductors) no té panel; el saltarem.
};

// Normalitza text per a comparació de duplicats.
function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’‘`·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Escape HTML
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── 1. Extreure les files JA presents al HTML per panel ──────────
// Per cada panel-id, registrem un Set de claus (article + concepte[:60]).
const existingByPanel = new Map();
function getExistingForPanel(panelId) {
  let set = existingByPanel.get(panelId);
  if (set) return set;
  set = new Set();
  // Captura tot el contingut del panel
  const reSec = new RegExp(`id="${panelId}"[\\s\\S]*?</section>`, 'i');
  const m = html.match(reSec);
  if (m) {
    const section = m[0];
    // Cada <tr ...><td>concepte</td><td class="col-art">article</td>...
    const trRe = /<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*col-art[^>]*>([\s\S]*?)<\/td>/g;
    let tm;
    while ((tm = trRe.exec(section)) !== null) {
      const concept = norm(tm[1].replace(/<[^>]+>/g, ''));
      const article = norm(tm[2].replace(/<[^>]+>/g, ''));
      set.add(`${article}|${concept.slice(0, 60)}`);
    }
  }
  existingByPanel.set(panelId, set);
  return set;
}

// ─── 2. Per a cada llei, generar la taula de noves files ──────────
const newSectionsByPanel = new Map();
const stats = {};

for (const row of rows) {
  const panelId = PANEL_FOR_LAW[row.lawId];
  if (!panelId) continue;

  const existing = getExistingForPanel(panelId);
  const key = `${norm(row.article)}|${norm(row.concepte).slice(0, 60)}`;
  if (existing.has(key)) {
    stats[row.lawId] = stats[row.lawId] || { kept: 0, dup: 0 };
    stats[row.lawId].dup++;
    continue;
  }
  existing.add(key); // evita duplicats internament a la nova llista

  stats[row.lawId] = stats[row.lawId] || { kept: 0, dup: 0 };
  stats[row.lawId].kept++;

  const sevLow = row.severity.toLowerCase();
  const eurClass = row.severity === 'MG' || (row.severity === 'G' && Number(row.fine) >= 500)
    ? 'eur-pill heavy'
    : 'eur-pill';
  const fineText = row.fine === 'Veure barem'
    ? '<span class="eur-pill veur">Veure barem</span>'
    : `<span class="${eurClass}">${escapeHtml(row.fine || '—')}</span>`;
  const dteText = row.dte || '—';
  const ptsText = row.points || '—';
  const artText = row.article.toUpperCase();

  const tr = `          <tr class="row-${sevLow}"><td>${escapeHtml(row.concepte)}</td><td class="col-art">${escapeHtml(artText)}</td><td><span class="sev sev-${sevLow}">${row.severity}</span></td><td class="col-eur">${fineText}</td><td class="col-dte">${escapeHtml(dteText)}</td><td class="col-pts">${escapeHtml(ptsText)}</td></tr>`;

  if (!newSectionsByPanel.has(panelId)) newSectionsByPanel.set(panelId, []);
  newSectionsByPanel.get(panelId).push(tr);
}

// ─── 3. Files manuals d'Asseguranca (RDL 8/2004) ──────────────────
// Aquesta secció del PDF té un format especial (multa segons classe de
// permís) que el parser no captura bé. Les afegim manualment.
const SEG_MANUAL = [
  { art: '2.1', sev: 'MG', fine: '650', dte: '325', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil (sense conduir) — supòsit base' },
  { art: '2.1', sev: 'MG', fine: '1000', dte: '500', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil — ciclomotors (classe AM)' },
  { art: '2.1', sev: 'MG', fine: '1250', dte: '625', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil — vehicle autoritzat amb llicència de conducció' },
  { art: '2.1', sev: 'MG', fine: '1500', dte: '750', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil — motocicletes classes A1, A2 i A' },
  { art: '2.1', sev: 'MG', fine: '2800', dte: '1400', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil — turismes classes B i B+E' },
  { art: '2.1', sev: 'MG', fine: '2800', dte: '1400', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil — camions classes C1, C1+E, C i C+E' },
  { art: '2.1', sev: 'MG', fine: '2800', dte: '1400', concept: 'No tenir concertada l\'assegurança obligatòria de responsabilitat civil — autobusos classes D1, D1+E, D i D+E' },
  { art: '2.1', sev: 'MG', fine: '350', dte: '175', concept: 'Circular un Vehicle Personal Lleuger (VPL) certificat i inscrit sense AOV (DA 1a Llei 5/2025)' },
  { art: '2.1', sev: 'MG', fine: '800', dte: '400', concept: 'Circular un VMP considerat vehicle a motor (MOM > 25 kg, > 14 km/h) sense AOV — Com. 6/2026 SCT' },
];

const segExisting = getExistingForPanel('p-seg');
const segRows = [];
for (const e of SEG_MANUAL) {
  const key = `${norm(e.art)}|${norm(e.concept).slice(0, 60)}`;
  if (segExisting.has(key)) continue;
  segExisting.add(key);
  const sevLow = e.sev.toLowerCase();
  const eurClass = e.sev === 'MG' ? 'eur-pill heavy' : 'eur-pill';
  segRows.push(
    `          <tr class="row-${sevLow}"><td>${escapeHtml(e.concept)}</td><td class="col-art">${e.art}</td><td><span class="sev sev-${sevLow}">${e.sev}</span></td><td class="col-eur"><span class="${eurClass}">${e.fine}</span></td><td class="col-dte">${e.dte}</td><td class="col-pts">—</td></tr>`
  );
}
if (segRows.length > 0) {
  const existing = newSectionsByPanel.get('p-seg') || [];
  newSectionsByPanel.set('p-seg', [...segRows, ...existing]);
}

// ─── 4. Inserir les noves seccions al HTML ────────────────────────
function buildSection(panelId, trs) {
  const headerLabel = {
    'p-lsv': 'Catàleg complet · TRLSV (Nomenclàtor SCT 2026)',
    'p-rgc': 'Catàleg complet · RGC (Nomenclàtor SCT 2026)',
    'p-cond': 'Catàleg complet · RG Conductors (Nomenclàtor SCT 2026)',
    'p-rgv': 'Catàleg complet · RGV (Nomenclàtor SCT 2026)',
    'p-seg': 'Catàleg complet · Assegurança RDL 8/2004 (Nomenclàtor SCT 2026)',
  }[panelId] || 'Catàleg complet (Nomenclàtor SCT 2026)';

  return `
    <div class="sec" data-import="sct-nomenclator-2026">
      <div class="sec-head"><span class="ico">📋</span> ${headerLabel} <span class="sev sev-l" style="margin-left:8px; font-size:11px;">+${trs.length} files</span></div>
      <p style="font-size:12.5px; color:var(--text-3); margin: 4px 0 10px; font-style: italic;">
        Importat automàticament del Nomenclàtor SCT 2026 (Servei Català de Trànsit, 01/02/2026). Les files
        marcades com a "curades" més amunt poden contenir notes operatives addicionals. Si trobes errors
        de redacció al text d'alguna fila, reporta'l per a la propera actualització.
      </p>
      <table class="tbl">
        <thead><tr><th>Concepte</th><th class="col-art">Art.</th><th class="col-n">N</th><th class="col-eur">€</th><th class="col-dte">DTE</th><th class="col-pts">PTS</th></tr></thead>
        <tbody>
${trs.join('\n')}
        </tbody>
      </table>
    </div>
`;
}

for (const [panelId, trs] of newSectionsByPanel.entries()) {
  const section = buildSection(panelId, trs);
  // Insertar abans del </section> del panel
  const re = new RegExp(`(id="${panelId}"[\\s\\S]*?)</section>`, 'i');
  if (re.test(html)) {
    html = html.replace(re, `$1${section}  </section>`);
  } else {
    console.warn(`⚠️ panel ${panelId} NOT FOUND`);
  }
}

fs.writeFileSync(HTML_PATH, html, 'utf8');

console.log('Files importades per panel:');
for (const [law, s] of Object.entries(stats)) {
  console.log(`  ${law.padEnd(8)} +${s.kept} noves, ${s.dup} duplicats saltats`);
}
console.log(`  seg (manual) +${segRows.length}`);
console.log('Total inserit:', [...newSectionsByPanel.values()].reduce((a, b) => a + b.length, 0));
