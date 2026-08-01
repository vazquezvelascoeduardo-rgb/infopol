// Edge Function: revisa els directoris d'Actualitat usant Claude amb web_search.
//
// v3 — per què hi ha aquesta versió:
//   Personalitats té ~200 entrades repartides en una vintena de grups, i
//   la funció els repassava TOTS en una sola execució, amb una crida a
//   la IA i 4 segons d'espera per grup. Passava del límit de temps del
//   worker i moria amb WORKER_RESOURCE_LIMIT: el cron setmanal deia que
//   havia anat bé —la petició HTTP sí— però no s'escrivia res. Per això
//   personalitats es va quedar congelada.
//
//   Ara cada execució agafa només uns quants grups, i tria primer els
//   que fa més temps que no es revisen. Setmana rere setmana va rodant i
//   els repassa tots, sense petar mai.
//
// Millores v2 (es mantenen):
// - Per a esports/premis: només processa la secció del mes actual
//   (section_sort=0), evitant repassar històrics que no canvien.
// - Delay de 4 segons entre crides per evitar rate limit (50k tok/min).
// - Parsing millorat: extreu el primer bloc JSON entre claus si Claude
//   torna text raonant abans del JSON.

// @ts-ignore Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// @ts-ignore Deno
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore Deno
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// @ts-ignore Deno
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
// @ts-ignore Deno
const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_AI_CALLS_PER_RUN = 30;
const DELAY_BETWEEN_CALLS_MS = 4000;
/** Grups per execució i categoria. Amb 8 i 4 s d'espera, una execució
 *  no arriba al minut de feina de la IA i el worker aguanta de sobres. */
const MAX_GROUPS_PER_RUN = 8;

type Row = {
  id: string;
  category: string;
  section_key: string;
  section_title: string;
  section_short_label: string;
  section_icon: string;
  section_accent: string;
  section_sort: number;
  subsection_title: string | null;
  subsection_icon: string | null;
  subsection_compact: boolean;
  subsection_sort: number;
  position: string;
  name: string;
  detail: string | null;
  flag: string | null;
  url: string | null;
  recent: boolean;
  entry_sort: number;
  source_hash: string | null;
  updated_at: string | null;
};

type AIEntry = {
  position: string;
  name: string;
  detail?: string | null;
  flag?: string | null;
  url?: string | null;
  recent?: boolean;
};

type AIResponse =
  | { no_changes: true; reason?: string }
  | { no_changes: false; entries: AIEntry[]; summary?: string };

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function extractJSON(text: string): unknown {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  // 1. Prova directa
  try { return JSON.parse(cleaned); } catch { /* segueix */ }
  // 2. Cerca primer bloc {...} balancejat
  let depth = 0;
  let start = -1;
  for (let i = 0; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        const candidate = cleaned.slice(start, i + 1);
        try { return JSON.parse(candidate); } catch { /* segueix */ }
      }
    }
  }
  throw new Error(`No JSON trobat a: ${cleaned.slice(0, 200)}`);
}

const SYSTEM_PROMPT = `Ets l'editor de la secció Actualitat de l'app InfoPol per a policia local de Catalunya. La teva feina és mantenir al dia un directori jeràrquic d'entries.

Rebràs una llista d'entries d'una subsecció. Has de:
1. Si és una secció de personalitats (càrrecs): usar web_search per verificar si encara són correctes.
2. Si és una secció d'esports o premis d'un mes actual: usar web_search per veure si hi ha nous esdeveniments / guanyadors a afegir.
3. Tornar la llista COMPLETA actualitzada.

IMPORTANT: la teva resposta ha de ser NOMÉS un JSON vàlid. No incloguis text, raonament ni explicacions abans o després. Comença directament amb { i acaba amb }.

FORMAT:

Si no hi ha canvis:
{ "no_changes": true, "reason": "breu motiu" }

Si hi ha canvis (cal retornar TOTES les entries actualitzades):
{
  "no_changes": false,
  "summary": "breu resúm (max 200 car)",
  "entries": [
    { "position": "...", "name": "...", "detail": "...", "flag": "🇦🇩", "recent": true/false },
    ...
  ]
}

REGLES:
- IDIOMA: català formal. Tradueix si web_search t'ha donat castellà/anglès.
- NO inventis: si dubtes, manté l'entry original.
- Sigues conservador.
- Marca recent:true només entries amb canvis dels últims 7 dies.`;

async function askClaude(
  categoryLabel: string,
  sectionTitle: string,
  subsectionTitle: string | null,
  entries: Array<{ position: string; name: string; detail: string | null; flag: string | null; recent: boolean }>,
): Promise<AIResponse> {
  const userPrompt = `CATEGORIA: ${categoryLabel}
SECCIÓ: ${sectionTitle}
SUBSECCIÓ: ${subsectionTitle ?? '(sense títol)'}

ENTRIES ACTUALS (${entries.length}):
${entries.map((e, i) => `${i + 1}. position="${e.position}" / name="${e.name}" / detail="${e.detail ?? ''}" / flag="${e.flag ?? ''}"`).join('\n')}

Verifica cada entry amb web search i RETORNA NOMÉS EL JSON sense cap text addicional.`;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [
        { type: 'web_search_20250305', name: 'web_search', max_uses: 3 },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = (data?.content ?? [])
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('\n')
    .trim();
  return extractJSON(text) as AIResponse;
}

async function logRun(
  admin: ReturnType<typeof createClient>,
  category: string,
  added: number,
  updated: number,
  removed: number,
  aiCalls: number,
  errors: string[],
  durationMs: number,
) {
  await admin.from('directory_update_runs').insert({
    category,
    changes_added: added,
    changes_updated: updated,
    changes_removed: removed,
    ai_calls: aiCalls,
    errors,
    duration_ms: durationMs,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** El moment més antic de revisió d'un grup: per anar pels més endarrerits. */
function antiguitat(rows: Row[]): number {
  let min = Infinity;
  for (const r of rows) {
    const t = r.updated_at ? Date.parse(r.updated_at) : 0;
    if (!Number.isNaN(t) && t < min) min = t;
  }
  return min === Infinity ? 0 : min;
}

// @ts-ignore Deno.serve
Deno.serve(async (req: Request) => {
  const auth = req.headers.get('Authorization') ?? '';
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return json(401, { ok: false, error: 'No autoritzat.' });
  }
  if (!ANTHROPIC_API_KEY) {
    return json(500, { ok: false, error: 'ANTHROPIC_API_KEY no configurada.' });
  }

  let body: { categories?: string[]; max_groups?: number } = {};
  try {
    if (req.headers.get('content-length')) body = await req.json();
  } catch { /* ignore */ }
  const categories = body.categories ?? ['personalitats'];
  const maxGrups = Math.max(1, Math.min(30, body.max_groups ?? MAX_GROUPS_PER_RUN));

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
  const summary: Record<string, unknown> = {};

  for (const category of categories) {
    const startedAt = Date.now();
    let aiCalls = 0;
    let added = 0;
    let updated = 0;
    const removed = 0;
    const errors: string[] = [];

    const { data: rowsData, error } = await admin
      .from('directories')
      .select('*')
      .eq('category', category)
      .order('section_sort', { ascending: true })
      .order('subsection_sort', { ascending: true })
      .order('entry_sort', { ascending: true });
    if (error || !rowsData) {
      errors.push(`Read error: ${error?.message ?? 'unknown'}`);
      await logRun(admin, category, 0, 0, 0, 0, errors, Date.now() - startedAt);
      summary[category] = { errors };
      continue;
    }
    let rows = rowsData as Row[];

    // Per a esports i premis: només la secció més recent (section_sort = 0)
    // Per a personalitats: totes les seccions, però per tandes.
    if (category === 'esports' || category === 'premis') {
      rows = rows.filter((r) => r.section_sort === 0);
    }

    // Agrupar per (section_key, subsection_sort)
    const groups = new Map<string, Row[]>();
    for (const r of rows) {
      const key = `${r.section_key}|${r.subsection_sort}`;
      const list = groups.get(key) ?? [];
      list.push(r);
      groups.set(key, list);
    }

    // Els que fa més temps que no es revisen, primer, i només una tanda:
    // així cada execució acaba de sobres i, entre setmanes, es repassen
    // tots sense deixar-ne cap enrere.
    const totalGrups = groups.size;
    const tanda = Array.from(groups.entries())
      .sort((a, b) => antiguitat(a[1]) - antiguitat(b[1]))
      .slice(0, maxGrups);

    for (const [groupKey, groupRows] of tanda) {
      if (aiCalls >= MAX_AI_CALLS_PER_RUN) {
        errors.push(`MAX_AI_CALLS_PER_RUN assolit a ${groupKey}`);
        break;
      }
      try {
        if (aiCalls > 0) await sleep(DELAY_BETWEEN_CALLS_MS);
        aiCalls++;
        const first = groupRows[0];
        const resp = await askClaude(
          category,
          first.section_title,
          first.subsection_title,
          groupRows.map((r) => ({
            position: r.position,
            name: r.name,
            detail: r.detail,
            flag: r.flag,
            recent: r.recent,
          })),
        );

        if ('no_changes' in resp && resp.no_changes) {
          // Encara que no canviï res, es marca com a revisat: si no, el
          // mateix grup sortiria escollit cada setmana i la resta no es
          // repassaria mai.
          await admin
            .from('directories')
            .update({ updated_at: new Date().toISOString() })
            .eq('category', category)
            .eq('section_key', first.section_key)
            .eq('subsection_sort', first.subsection_sort);
          continue;
        }
        if (!('entries' in resp) || !Array.isArray(resp.entries)) {
          errors.push(`${groupKey}: resposta sense entries`);
          continue;
        }

        const { error: delErr } = await admin
          .from('directories')
          .delete()
          .eq('category', category)
          .eq('section_key', first.section_key)
          .eq('subsection_sort', first.subsection_sort);
        if (delErr) {
          errors.push(`Delete ${groupKey}: ${delErr.message}`);
          continue;
        }
        const inserts = resp.entries.map((e, i) => ({
          category,
          section_key:         first.section_key,
          section_title:       first.section_title,
          section_short_label: first.section_short_label,
          section_icon:        first.section_icon,
          section_accent:      first.section_accent,
          section_sort:        first.section_sort,
          subsection_title:    first.subsection_title,
          subsection_icon:     first.subsection_icon,
          subsection_compact:  first.subsection_compact,
          subsection_sort:     first.subsection_sort,
          position:  e.position,
          name:      e.name,
          detail:    e.detail ?? null,
          flag:      e.flag ?? null,
          url:       e.url ?? null,
          recent:    !!e.recent,
          entry_sort: i,
        }));
        const { error: insErr } = await admin.from('directories').insert(inserts);
        if (insErr) {
          errors.push(`Insert ${groupKey}: ${insErr.message}`);
          continue;
        }
        if (inserts.length > groupRows.length) added += inserts.length - groupRows.length;
        updated += groupRows.length;
      } catch (e) {
        errors.push(`${groupKey}: ${(e as Error).message}`);
      }
    }

    await logRun(admin, category, added, updated, removed, aiCalls, errors, Date.now() - startedAt);
    summary[category] = {
      added, updated, removed, ai_calls: aiCalls,
      grups_totals: totalGrups, grups_revisats: tanda.length,
      errors,
    };
  }

  return json(200, { ok: true, summary });
});
