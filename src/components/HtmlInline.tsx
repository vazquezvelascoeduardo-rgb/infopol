// Renderitza un document HTML d'una infografia COM A PART del DOM de
// l'app (sense iframe). Aïllament d'estils via "scoping": s'extreu el
// <style> del <head> de la fitxa, es prefixa cada selector amb la
// classe del contenidor (`.fitxa-html-scope`) i s'injecta. El cos
// (<body>) es renderitza dins d'aquest contenidor.
//
// Avantatges respecte de l'iframe:
//   - Scroll natural i sense recàlcul d'alçada.
//   - La cerca del navegador (Ctrl+F) troba el text de la infografia.
//   - El tema clar/fosc usa les mateixes variables que la resta de l'app.
//   - Els scripts inline funcionen perquè comparteixen el `document`.
import { useEffect, useRef } from 'react';

type Props = { html: string; title: string };

const SCOPE_CLASS = 'fitxa-html-scope';

// Sobreescriptura de variables CSS i estils per al MODE CLAR. La classe
// `ipol-light` s'afegeix al contenidor quan l'app està en mode clar i
// força una paleta blanc/dorat real (no inversió de colors).
//
// Estratègia (en quatre capes):
//   1) Sobreescrivim TOTES les variables CSS conegudes per girar la
//      paleta navy → blanca.
//   2) Forcem el text a colors foscos i el fons del scope a blanc.
//   3) Reescrivim els fons "hardcodejats" (gradients de contenidors com
//      .header, .cronologia, .info-banner, etc.) a versions clares.
//   4) Reescrivim els colors de text "clars" (#FFD060, #6AADDC, #E86050…)
//      a versions amb prou contrast sobre blanc.
const LIGHT_THEME_CSS = `
  /* ── 1) Variables CSS ── */
  .${SCOPE_CLASS}.ipol-light {
    background: #ffffff !important;
    background-image: none !important;
    color: #0a1628 !important;

    --bg-main: #ffffff !important;
    --bg-section: #f8fafc !important;
    --text-main: #0a1628 !important;
    --text-secondary: #475569 !important;
    --border: #c8a028 !important;

    --accent-gold: #a16207 !important;
    --accent-blue: #1e40af !important;
    --alert-red: #b91c1c !important;
    --positive-green: #15803d !important;

    --bg: #ffffff !important;
    --bg2: #f8fafc !important;
    --txt: #0a1628 !important;
    --txt2: #475569 !important;
    --gold: #a16207 !important;
    --blue: #1e40af !important;
    --blue-royal: #1e40af !important;
    --green: #15803d !important;
    --red: #b91c1c !important;
  }

  /* ── 2) Text per defecte fosc dins del scope ── */
  .${SCOPE_CLASS}.ipol-light,
  .${SCOPE_CLASS}.ipol-light p,
  .${SCOPE_CLASS}.ipol-light li,
  .${SCOPE_CLASS}.ipol-light span:not([style*="color"]),
  .${SCOPE_CLASS}.ipol-light div:not([style*="color"]),
  .${SCOPE_CLASS}.ipol-light td,
  .${SCOPE_CLASS}.ipol-light th {
    color: #0f172a;
  }

  /* ── 3) Contenidors amb fons fosc hardcodejat → versió clara ── */

  /* Capçaleres amb gradients navy (.header, .escudo, .poster) */
  .${SCOPE_CLASS}.ipol-light .header,
  .${SCOPE_CLASS}.ipol-light .poster > .header,
  .${SCOPE_CLASS}.ipol-light .header-block,
  .${SCOPE_CLASS}.ipol-light .escudo-wrap {
    background: linear-gradient(135deg, #fffbea 0%, #fef3c7 100%) !important;
    border-color: #a16207 !important;
    color: #0f172a !important;
    box-shadow: 0 1px 3px rgba(15,23,42,0.06) !important;
  }

  /* Cronologia / línies de temps */
  .${SCOPE_CLASS}.ipol-light .cronologia,
  .${SCOPE_CLASS}.ipol-light .timeline-wrap,
  .${SCOPE_CLASS}.ipol-light .historia,
  .${SCOPE_CLASS}.ipol-light .evolucio {
    background: linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%) !important;
    border-color: #a16207 !important;
    color: #0f172a !important;
    box-shadow: 0 1px 2px rgba(15,23,42,0.04) !important;
  }

  /* Info banners (gradient blue) */
  .${SCOPE_CLASS}.ipol-light .info-banner,
  .${SCOPE_CLASS}.ipol-light .banner-info,
  .${SCOPE_CLASS}.ipol-light .notice,
  .${SCOPE_CLASS}.ipol-light .info-box {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
    border-color: #2563eb !important;
    color: #1e3a8a !important;
    box-shadow: 0 1px 2px rgba(37,99,235,0.08) !important;
  }
  .${SCOPE_CLASS}.ipol-light .info-banner *,
  .${SCOPE_CLASS}.ipol-light .banner-info *,
  .${SCOPE_CLASS}.ipol-light .info-box * {
    color: #1e3a8a !important;
  }

  /* Reforma / alerta banners (gradient red) */
  .${SCOPE_CLASS}.ipol-light .reforma-banner,
  .${SCOPE_CLASS}.ipol-light .alerta-box,
  .${SCOPE_CLASS}.ipol-light .alerta-banner,
  .${SCOPE_CLASS}.ipol-light .warning,
  .${SCOPE_CLASS}.ipol-light .stc-banner {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
    border-color: #dc2626 !important;
    color: #7f1d1d !important;
    box-shadow: 0 1px 2px rgba(220,38,38,0.08) !important;
  }
  .${SCOPE_CLASS}.ipol-light .reforma-banner *,
  .${SCOPE_CLASS}.ipol-light .alerta-box *,
  .${SCOPE_CLASS}.ipol-light .alerta-banner *,
  .${SCOPE_CLASS}.ipol-light .stc-banner * {
    color: #7f1d1d !important;
  }

  /* Categoria + section blocks (the "panels" and accordion containers) */
  .${SCOPE_CLASS}.ipol-light .categoria,
  .${SCOPE_CLASS}.ipol-light .section,
  .${SCOPE_CLASS}.ipol-light .panel,
  .${SCOPE_CLASS}.ipol-light .card,
  .${SCOPE_CLASS}.ipol-light .box,
  .${SCOPE_CLASS}.ipol-light .clas-card,
  .${SCOPE_CLASS}.ipol-light .principis-box,
  .${SCOPE_CLASS}.ipol-light .clasif-card,
  .${SCOPE_CLASS}.ipol-light .org,
  .${SCOPE_CLASS}.ipol-light .w3 {
    background: #ffffff !important;
    border-color: #e2e8f0 !important;
    box-shadow: 0 1px 2px rgba(15,23,42,0.04) !important;
  }

  /* Cat-header (clickable accordion bar — usually blue) */
  .${SCOPE_CLASS}.ipol-light .cat-header {
    background: linear-gradient(135deg, #fbf3d8 0%, #fef9e8 100%) !important;
    color: #0f172a !important;
    border-bottom: 1px solid #c8a028 !important;
  }
  .${SCOPE_CLASS}.ipol-light .cat-header * {
    color: #0f172a !important;
  }
  .${SCOPE_CLASS}.ipol-light .cat-icon {
    color: #a16207 !important;
  }

  /* Capçaleres de secció amb fons hardcoded navy/blau-royal als HTMLs:
     les passem a una paleta blava clara amb text fosc per a llegibilitat. */
  .${SCOPE_CLASS}.ipol-light .s-title,
  .${SCOPE_CLASS}.ipol-light .alc-card-title {
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%) !important;
    color: #1e3a8a !important;
    border-bottom: 1px solid #93c5fd !important;
  }
  .${SCOPE_CLASS}.ipol-light .s-title *,
  .${SCOPE_CLASS}.ipol-light .alc-card-title * {
    color: #1e3a8a !important;
  }

  /* Capçalera CP (Codi Penal) amb fons rgba(200,40,30,.2) → versió clara
     amb to vermell suau perquè es mantingui la jerarquia visual. */
  .${SCOPE_CLASS}.ipol-light .cp-card-title,
  .${SCOPE_CLASS}.ipol-light .cp-header {
    background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%) !important;
    color: #7f1d1d !important;
    border-color: #fca5a5 !important;
  }
  .${SCOPE_CLASS}.ipol-light .cp-card-title *,
  .${SCOPE_CLASS}.ipol-light .cp-header * {
    color: #7f1d1d !important;
  }

  /* Subtítols de grup amb fons rgba(0,0,0,.2) — passar a slate clar. */
  .${SCOPE_CLASS}.ipol-light .sub-group-title {
    background: #f1f5f9 !important;
    color: #a16207 !important;
    border-top-color: #fbbf24 !important;
  }

  /* Tabs (catàleg de trànsit) — text fosc en mode clar. */
  .${SCOPE_CLASS}.ipol-light .tab-btn {
    background: #ffffff !important;
    color: #475569 !important;
    border-color: #cbd5e1 !important;
  }
  .${SCOPE_CLASS}.ipol-light .tab-btn:hover {
    color: #a16207 !important;
    border-color: #a16207 !important;
  }
  .${SCOPE_CLASS}.ipol-light .tab-btn.active {
    background: #fef3c7 !important;
    color: #422006 !important;
    border-color: #a16207 !important;
  }
  .${SCOPE_CLASS}.ipol-light .tab-btn.active * {
    color: #422006 !important;
  }
  .${SCOPE_CLASS}.ipol-light .tab-btn .badge-count {
    background: #f1f5f9 !important;
    color: #475569 !important;
  }

  /* Capçaleres CP card de la cataleg — bg navy ara passa a blanc. */
  .${SCOPE_CLASS}.ipol-light .cp-card,
  .${SCOPE_CLASS}.ipol-light .alc-card {
    background: #ffffff !important;
    color: #0f172a !important;
  }

  /* Files i cel·les de taula d'infraccions */
  .${SCOPE_CLASS}.ipol-light .inf-table thead tr {
    background: #f1f5f9 !important;
  }
  .${SCOPE_CLASS}.ipol-light .inf-table th {
    color: #475569 !important;
  }
  .${SCOPE_CLASS}.ipol-light .inf-table td {
    color: #0f172a !important;
    border-bottom-color: #e2e8f0 !important;
  }
  .${SCOPE_CLASS}.ipol-light .inf-table tr:hover td {
    background: #fef3c7 !important;
  }
  .${SCOPE_CLASS}.ipol-light .inf-table tr.highlight td {
    background: #fee2e2 !important;
  }

  /* Delito / article entries (left-bordered cards) */
  .${SCOPE_CLASS}.ipol-light .delito,
  .${SCOPE_CLASS}.ipol-light .article,
  .${SCOPE_CLASS}.ipol-light .item,
  .${SCOPE_CLASS}.ipol-light .agravada {
    background: #f8fafc !important;
    border-left-color: #a16207 !important;
    color: #0f172a !important;
  }
  .${SCOPE_CLASS}.ipol-light .delito *,
  .${SCOPE_CLASS}.ipol-light .article *,
  .${SCOPE_CLASS}.ipol-light .agravada * {
    color: #0f172a;
  }

  /* Tables */
  .${SCOPE_CLASS}.ipol-light .mini-tabla,
  .${SCOPE_CLASS}.ipol-light .tabla-discip,
  .${SCOPE_CLASS}.ipol-light .inf-table,
  .${SCOPE_CLASS}.ipol-light table {
    background: #ffffff !important;
    color: #0f172a !important;
    border-color: #e2e8f0 !important;
  }
  .${SCOPE_CLASS}.ipol-light .td-header,
  .${SCOPE_CLASS}.ipol-light .td-cell,
  .${SCOPE_CLASS}.ipol-light .celda,
  .${SCOPE_CLASS}.ipol-light th,
  .${SCOPE_CLASS}.ipol-light tbody tr,
  .${SCOPE_CLASS}.ipol-light tbody td {
    background: transparent !important;
    color: #0f172a !important;
    border-color: #e2e8f0 !important;
  }
  .${SCOPE_CLASS}.ipol-light .td-header,
  .${SCOPE_CLASS}.ipol-light thead,
  .${SCOPE_CLASS}.ipol-light thead th {
    background: #f1f5f9 !important;
    color: #0f172a !important;
    font-weight: 700;
  }

  /* Subtle "key" highlight, "art-ref", badges */
  .${SCOPE_CLASS}.ipol-light .key,
  .${SCOPE_CLASS}.ipol-light .art-ref,
  .${SCOPE_CLASS}.ipol-light .art-badge,
  .${SCOPE_CLASS}.ipol-light .badge-clave {
    color: #a16207 !important;
  }

  /* Notes (notas policiales / clave) */
  .${SCOPE_CLASS}.ipol-light .nota-policial {
    background: #f0fdf4 !important;
    color: #14532d !important;
    border-left-color: #15803d !important;
  }
  .${SCOPE_CLASS}.ipol-light .nota-policial * { color: #14532d !important; }

  .${SCOPE_CLASS}.ipol-light .nota-clave,
  .${SCOPE_CLASS}.ipol-light .nota-agrav {
    background: #fffbeb !important;
    color: #713f12 !important;
    border-left-color: #a16207 !important;
  }
  .${SCOPE_CLASS}.ipol-light .nota-clave *,
  .${SCOPE_CLASS}.ipol-light .nota-agrav * { color: #713f12 !important; }

  /* "Recuerda" highlight box (full gold) — invertim per llegibilitat */
  .${SCOPE_CLASS}.ipol-light .recuerda {
    background: #fef3c7 !important;
    color: #422006 !important;
    border: 2px solid #a16207 !important;
  }
  .${SCOPE_CLASS}.ipol-light .recuerda * { color: #422006 !important; }

  /* Reference labels (light blue / light text) → readable on white */
  .${SCOPE_CLASS}.ipol-light .ref-ley { color: #1e3a8a !important; }
  .${SCOPE_CLASS}.ipol-light .ref-desc { color: #1e40af !important; }
  .${SCOPE_CLASS}.ipol-light .ref-fecha {
    color: #1e3a8a !important;
    background: rgba(255,255,255,0.7) !important;
    border-color: #2563eb !important;
  }

  /* Subtitles, secondary text */
  .${SCOPE_CLASS}.ipol-light .subtitle,
  .${SCOPE_CLASS}.ipol-light .label,
  .${SCOPE_CLASS}.ipol-light .pena-max,
  .${SCOPE_CLASS}.ipol-light .delito-desc {
    color: #475569 !important;
  }

  /* Header label / "esquema operativo policial" tag */
  .${SCOPE_CLASS}.ipol-light .header-text .label,
  .${SCOPE_CLASS}.ipol-light .header .label,
  .${SCOPE_CLASS}.ipol-light .law-id {
    color: #a16207 !important;
  }

  /* H1 spans that were gold accents */
  .${SCOPE_CLASS}.ipol-light h1 span,
  .${SCOPE_CLASS}.ipol-light .header-text h1 span {
    color: #a16207 !important;
  }

  /* Timeline items: gold dates, dark events */
  .${SCOPE_CLASS}.ipol-light .timeline-item .fecha,
  .${SCOPE_CLASS}.ipol-light .timeline-item .data {
    color: #a16207 !important;
  }
  .${SCOPE_CLASS}.ipol-light .timeline-item .evento,
  .${SCOPE_CLASS}.ipol-light .timeline-item .esdeveniment {
    color: #1e293b !important;
  }
  .${SCOPE_CLASS}.ipol-light .timeline-item .evento b,
  .${SCOPE_CLASS}.ipol-light .timeline-item b {
    color: #a16207 !important;
  }

  /* Severity tags: keep their semantic colors but darker for contrast */
  .${SCOPE_CLASS}.ipol-light .clas-leve { background: #dcfce7 !important; border-color: #15803d !important; }
  .${SCOPE_CLASS}.ipol-light .clas-leve .tipo { color: #166534 !important; }
  .${SCOPE_CLASS}.ipol-light .clas-menos { background: #dbeafe !important; border-color: #2563eb !important; }
  .${SCOPE_CLASS}.ipol-light .clas-menos .tipo { color: #1e40af !important; }
  .${SCOPE_CLASS}.ipol-light .clas-grave { background: #fee2e2 !important; border-color: #dc2626 !important; }
  .${SCOPE_CLASS}.ipol-light .clas-grave .tipo { color: #991b1b !important; }

  /* ── BADGES SEMÀNTICS — paletes clares amb significat ── */

  /* MOLT GREU / GRAVE / "Greu" → vermell clar */
  .${SCOPE_CLASS}.ipol-light .badge-grave,
  .${SCOPE_CLASS}.ipol-light .pill-MG,
  .${SCOPE_CLASS}.ipol-light .badge-mixto,
  .${SCOPE_CLASS}.ipol-light .multa-mg,
  .${SCOPE_CLASS}.ipol-light .pts,
  .${SCOPE_CLASS}.ipol-light .cc-greu,
  .${SCOPE_CLASS}.ipol-light .vel-mg,
  .${SCOPE_CLASS}.ipol-light .dc-greu {
    background: #fee2e2 !important;
    color: #991b1b !important;
    border-color: #fca5a5 !important;
  }
  .${SCOPE_CLASS}.ipol-light .badge-grave *,
  .${SCOPE_CLASS}.ipol-light .pill-MG *,
  .${SCOPE_CLASS}.ipol-light .pts *,
  .${SCOPE_CLASS}.ipol-light .vel-mg *,
  .${SCOPE_CLASS}.ipol-light .cc-greu * {
    color: #991b1b !important;
  }

  /* GRAVE / Menys greu (intermedi) → ambre clar */
  .${SCOPE_CLASS}.ipol-light .badge-info,
  .${SCOPE_CLASS}.ipol-light .pill-G,
  .${SCOPE_CLASS}.ipol-light .badge-menos,
  .${SCOPE_CLASS}.ipol-light .multa-g,
  .${SCOPE_CLASS}.ipol-light .cc-menys,
  .${SCOPE_CLASS}.ipol-light .vel-g,
  .${SCOPE_CLASS}.ipol-light .dc-menys,
  .${SCOPE_CLASS}.ipol-light .nota-agrav {
    background: #fef3c7 !important;
    color: #854d0e !important;
    border-color: #fbbf24 !important;
  }
  .${SCOPE_CLASS}.ipol-light .pill-G *,
  .${SCOPE_CLASS}.ipol-light .vel-g *,
  .${SCOPE_CLASS}.ipol-light .cc-menys *,
  .${SCOPE_CLASS}.ipol-light .nota-agrav * {
    color: #854d0e !important;
  }

  /* LLEU / Lleve / OK → verd clar */
  .${SCOPE_CLASS}.ipol-light .pill-L,
  .${SCOPE_CLASS}.ipol-light .badge-leve,
  .${SCOPE_CLASS}.ipol-light .badge-nuevo,
  .${SCOPE_CLASS}.ipol-light .cc-lleu,
  .${SCOPE_CLASS}.ipol-light .dc-lleu {
    background: #dcfce7 !important;
    color: #166534 !important;
    border-color: #86efac !important;
  }
  .${SCOPE_CLASS}.ipol-light .pill-L *,
  .${SCOPE_CLASS}.ipol-light .cc-lleu * {
    color: #166534 !important;
  }

  /* MULTA / IMPORT (€) — verd clar (els diners "positius" en green/emerald) */
  .${SCOPE_CLASS}.ipol-light .multa,
  .${SCOPE_CLASS}.ipol-light .multa-badge,
  .${SCOPE_CLASS}.ipol-light .multa-alta,
  .${SCOPE_CLASS}.ipol-light .pena-multa,
  .${SCOPE_CLASS}.ipol-light .amount,
  .${SCOPE_CLASS}.ipol-light .amount.gold,
  .${SCOPE_CLASS}.ipol-light .seg-amounts {
    background: #d1fae5 !important;
    color: #065f46 !important;
    border-color: #6ee7b7 !important;
  }
  .${SCOPE_CLASS}.ipol-light .multa *,
  .${SCOPE_CLASS}.ipol-light .multa-badge *,
  .${SCOPE_CLASS}.ipol-light .multa-alta *,
  .${SCOPE_CLASS}.ipol-light .pena-multa *,
  .${SCOPE_CLASS}.ipol-light .amount *,
  .${SCOPE_CLASS}.ipol-light .seg-amounts * {
    color: #065f46 !important;
  }
  /* Però si hi ha .amount.red (categòricament negatiu), es queda en vermell */
  .${SCOPE_CLASS}.ipol-light .amount.red {
    background: #fee2e2 !important;
    color: #991b1b !important;
  }

  /* Pena penal (no monetària) — neutral però distingible */
  .${SCOPE_CLASS}.ipol-light .pena-chip,
  .${SCOPE_CLASS}.ipol-light .pena-tag,
  .${SCOPE_CLASS}.ipol-light .pena-preso,
  .${SCOPE_CLASS}.ipol-light .pena-treb,
  .${SCOPE_CLASS}.ipol-light .pena-perm,
  .${SCOPE_CLASS}.ipol-light .pena-alt {
    background: #ede9fe !important;
    color: #5b21b6 !important;
    border-color: #c4b5fd !important;
  }
  .${SCOPE_CLASS}.ipol-light .pena-preso *,
  .${SCOPE_CLASS}.ipol-light .pena-treb *,
  .${SCOPE_CLASS}.ipol-light .pena-perm * {
    color: #5b21b6 !important;
  }

  /* Tipus-badge (codi-penal): subordinat al tipus específic. Per defecte
     ambre (com a "no-greu" / informatiu) — quan a la classe hi ha .greu/.menys
     s'aplica les regles d'amunt. */
  .${SCOPE_CLASS}.ipol-light .tipo-badge {
    background: #fef3c7 !important;
    color: #854d0e !important;
    border-color: #fbbf24 !important;
  }
  .${SCOPE_CLASS}.ipol-light .badge-clave,
  .${SCOPE_CLASS}.ipol-light .badge-local {
    background: #dbeafe !important;
    color: #1e40af !important;
    border-color: #93c5fd !important;
  }

  /* Article badge / referència — gold pill (manté la identitat) */
  .${SCOPE_CLASS}.ipol-light .art-badge,
  .${SCOPE_CLASS}.ipol-light .art-ref {
    background: #fef3c7 !important;
    color: #92400e !important;
    border-color: #fbbf24 !important;
  }

  /* ── 4) Text de colors clars hardcodejats → variants foscos ── */

  /* Or pàl·lid → or fosc */
  .${SCOPE_CLASS}.ipol-light [style*="color:#FFD060"],
  .${SCOPE_CLASS}.ipol-light [style*="color: #FFD060"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E8C060"],
  .${SCOPE_CLASS}.ipol-light [style*="color: #E8C060"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E8CC80"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#F0D888"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E8D890"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E8A028"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#e0a050"] {
    color: #a16207 !important;
  }

  /* Vermell pàl·lid → vermell fosc */
  .${SCOPE_CLASS}.ipol-light [style*="color:#FF8070"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#FF8870"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E86050"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E84038"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E08888"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E88880"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#FFB8B0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#FFB8A8"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#F8C8C0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#FFEBE8"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#FFD0CC"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#e05050"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#ff7070"] {
    color: #b91c1c !important;
  }

  /* Verd pàl·lid → verd fosc */
  .${SCOPE_CLASS}.ipol-light [style*="color:#4ACD7A"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#5EC880"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#5AE090"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#2AA858"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#B0E8C0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#A8D4C0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E0FFF0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#4bc878"] {
    color: #15803d !important;
  }

  /* Blau pàl·lid → blau fosc */
  .${SCOPE_CLASS}.ipol-light [style*="color:#6AADDC"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#6ab0f0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#8FB8E0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#A8C4E0"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#A8BAD4"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#D8E0EE"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#D8EBFF"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#DCE8FF"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#E0F0FF"],
  .${SCOPE_CLASS}.ipol-light [style*="color:#F0F4FF"] {
    color: #1e40af !important;
  }

  /* Lila → lila fosc (tags morats poc freqüents) */
  .${SCOPE_CLASS}.ipol-light [style*="color:#c49af0"] {
    color: #6b21a8 !important;
  }

  /* Background fosc en línia → fons clar */
  .${SCOPE_CLASS}.ipol-light [style*="background:rgba(10,22,40"],
  .${SCOPE_CLASS}.ipol-light [style*="background: rgba(10,22,40"],
  .${SCOPE_CLASS}.ipol-light [style*="background:rgba(0,0,0"],
  .${SCOPE_CLASS}.ipol-light [style*="background: rgba(0,0,0"] {
    background: #f1f5f9 !important;
    color: #0f172a !important;
  }

  /* Botons "imprimir" tipus pill */
  .${SCOPE_CLASS}.ipol-light .btn-print,
  .${SCOPE_CLASS}.ipol-light .print-btn,
  .${SCOPE_CLASS}.ipol-light .clear-btn {
    background: #f1f5f9 !important;
    color: #0f172a !important;
    border-color: #cbd5e1 !important;
  }
  .${SCOPE_CLASS}.ipol-light .btn-print:hover,
  .${SCOPE_CLASS}.ipol-light .print-btn:hover,
  .${SCOPE_CLASS}.ipol-light .clear-btn:hover {
    background: #e2e8f0 !important;
  }

  /* Search bar + tabs (catàleg de trànsit) */
  .${SCOPE_CLASS}.ipol-light .search-bar,
  .${SCOPE_CLASS}.ipol-light .search-bar input {
    background: #f1f5f9 !important;
    color: #0f172a !important;
    border-color: #cbd5e1 !important;
  }
  .${SCOPE_CLASS}.ipol-light .tab-btn {
    background: #f8fafc !important;
    color: #475569 !important;
    border-color: #cbd5e1 !important;
  }
  .${SCOPE_CLASS}.ipol-light .tab-btn.active {
    background: #fef3c7 !important;
    color: #422006 !important;
    border-color: #a16207 !important;
  }
`;

// Prefixa un selector individual amb el scope. Tracta casos especials:
//   :root, html, body  →  .fitxa-html-scope
//   html.foo, body.foo →  .fitxa-html-scope.foo
//   .foo .bar          →  .fitxa-html-scope .foo .bar
function prefixSelector(selector: string, scope: string): string {
  const sel = selector.trim();
  if (!sel) return sel;

  const scopeSel = `.${scope}`;

  // :root, html, body → escope arrel
  if (sel === ':root' || sel === 'html' || sel === 'body') return scopeSel;

  // html.x, html#x, html[...] → .scope.x / .scope#x / etc.
  if (/^html[.#\[]/.test(sel)) return scopeSel + sel.slice(4);
  if (/^body[.#\[]/.test(sel)) return scopeSel + sel.slice(4);

  // html > x, body > x, body x ...
  if (/^(?:html|body)\s|^(?:html|body)[>~+]/.test(sel)) {
    return scopeSel + sel.replace(/^(?:html|body)/, '');
  }

  return `${scopeSel} ${sel}`;
}

// Recorre les regles CSS i prefixa les selector-rules. Les @media
// es processen recursivament. @keyframes i @font-face queden globals
// (els noms són globals per definició).
function scopeRule(rule: CSSRule, scope: string): string {
  // CSSStyleRule
  if (rule.constructor.name === 'CSSStyleRule' || (typeof CSSStyleRule !== 'undefined' && rule instanceof CSSStyleRule)) {
    const styleRule = rule as CSSStyleRule;
    const selectors = styleRule.selectorText
      .split(',')
      .map((s) => prefixSelector(s, scope))
      .join(', ');
    return `${selectors} { ${styleRule.style.cssText} }`;
  }

  // CSSMediaRule
  if (rule.constructor.name === 'CSSMediaRule' || (typeof CSSMediaRule !== 'undefined' && rule instanceof CSSMediaRule)) {
    const mediaRule = rule as CSSMediaRule;
    const inner = Array.from(mediaRule.cssRules)
      .map((r) => scopeRule(r, scope))
      .join('\n');
    return `@media ${mediaRule.conditionText} { ${inner} }`;
  }

  // CSSSupportsRule
  if (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule) {
    const supRule = rule as CSSSupportsRule;
    const inner = Array.from(supRule.cssRules)
      .map((r) => scopeRule(r, scope))
      .join('\n');
    return `@supports ${supRule.conditionText} { ${inner} }`;
  }

  // @keyframes, @font-face, @import, etc. — globals, deixar tal qual.
  return rule.cssText;
}

// Aïlla un CSS aplicant un prefix a tots els selectors. Fa servir el
// CSSOM del navegador (afegint i eliminant immediatament un <style>
// amb media="not all" perquè no apliqui mai els estils crus).
function scopeCSS(cssText: string, scope: string): string {
  if (!cssText.trim()) return '';
  if (typeof document === 'undefined') return cssText;

  const styleEl = document.createElement('style');
  styleEl.media = 'not all';
  styleEl.textContent = cssText;
  document.head.appendChild(styleEl);
  try {
    const sheet = styleEl.sheet as CSSStyleSheet | null;
    if (!sheet) return cssText;
    return Array.from(sheet.cssRules)
      .map((r) => scopeRule(r, scope))
      .join('\n');
  } catch {
    // Davant qualsevol error de parse, tornem el CSS sense scope —
    // millor mostrar la fitxa una mica sortida que no res.
    return cssText;
  } finally {
    styleEl.remove();
  }
}

// Embolcalla un script en una IIFE amb try/catch per dos motius:
//   1) Aïllament: variables top-level (let/const) no contaminen
//      l'scope global ni provoquen errors de redeclaració quan es
//      torna a una fitxa ja visitada.
//   2) Tolerància a errors: si el script peta, no trenca la app.
// Com que les funcions declarades dins de la IIFE serien LOCALS i els
// handlers inline (`onclick="toggle(this)"`) busquen funcions a window,
// detectem totes les declaracions `function NAME(...)` i les exposem
// explícitament com a `window.NAME`.
function wrapScript(source: string): string {
  const fnNames = new Set<string>();
  for (const m of source.matchAll(/^\s*function\s+([a-zA-Z_$][\w$]*)\s*\(/gm)) {
    fnNames.add(m[1]);
  }
  const exposes = [...fnNames]
    .map((n) => `try { window[${JSON.stringify(n)}] = ${n}; } catch (_e) {}`)
    .join('\n');
  return `;(function(){\ntry {\n${source}\n${exposes}\n} catch (e) { console.error('[infopol/fitxa] script error:', e); }\n})();`;
}

// Reactiva els <script> que el navegador NO executa quan s'inserten
// via innerHTML. Crea un nou <script> amb el mateix contingut/src
// (després d'embolcallar-lo) i el substitueix.
function executeScripts(container: HTMLElement) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    for (const attr of Array.from(oldScript.attributes)) {
      // Si és un script extern (src), no podem embolcallar-lo:
      // el copiem tal qual.
      if (attr.name === 'src') {
        newScript.setAttribute(attr.name, attr.value);
      } else if (attr.name !== 'type') {
        newScript.setAttribute(attr.name, attr.value);
      }
    }
    const src = oldScript.textContent || '';
    newScript.textContent = src.trim() ? wrapScript(src) : '';
    oldScript.parentNode?.replaceChild(newScript, oldScript);
  });
}

export default function HtmlInline({ html }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1) Parseja el document.
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 2) Extreu i aïlla els <style> del <head>.
    const styleEls = Array.from(doc.head.querySelectorAll('style'));
    const cssRaw = styleEls.map((s) => s.textContent || '').join('\n');
    const cssScoped = scopeCSS(cssRaw, SCOPE_CLASS);

    // 3) Munta el contenidor: classe d'scope + estils + cos.
    container.className = SCOPE_CLASS;
    container.innerHTML = '';

    if (cssScoped.trim()) {
      const styleNode = document.createElement('style');
      styleNode.setAttribute('data-fitxa-style', '');
      styleNode.textContent = cssScoped + '\n' + LIGHT_THEME_CSS;
      container.appendChild(styleNode);
    } else {
      // Fitxa sense estils propis: només el bloc de tema clar.
      const styleNode = document.createElement('style');
      styleNode.textContent = LIGHT_THEME_CSS;
      container.appendChild(styleNode);
    }

    // 4) Insereix el cos i reactiva els scripts.
    const bodyHtml = doc.body ? doc.body.innerHTML : '';
    const bodyHost = document.createElement('div');
    bodyHost.setAttribute('data-fitxa-body', '');
    bodyHost.innerHTML = bodyHtml;
    container.appendChild(bodyHost);
    executeScripts(bodyHost);

    // 5) Sincronitza el tema (clar/fosc) amb la classe `dark` del <html>.
    function applyTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      container!.classList.toggle('ipol-light', !isDark);
    }
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      themeObserver.disconnect();
      // Buidem el contenidor en desmuntar perquè els <style> i scripts
      // d'aquesta fitxa no segueixin actius en navegar a una altra.
      if (container) container.innerHTML = '';
    };
  }, [html]);

  return <div ref={containerRef} />;
}
