// InfoPol Assistent — Edge Function (Deno / Supabase).
//
// L'assistent de l'app i la web, amb TRES MODES independents:
//   · operativa  → consultes de carrer: norma, procediment, infracció de
//                  trànsit, text de butlleta i acta a emplenar. RAG sobre
//                  kb_documents, cita fonts i MAI inventa.
//   · diligencia → redacta minutes, diligències, actes i atestats amb la
//                  redacció juridicopolicial estàndard.
//   · servei     → només redacció neta del servei per al sistema. Res legal.
//
// Accions:
//   ask    → { ok, text, sources[], used }   (usuaris autenticats)
//   stats  → { ok, total, per_mode }          (públic: només recompte)
//   ingest → { ok, inserted, total }          (només admins: base de coneixement)
//
// Els adjunts (fotos/PDF) NO es desen enlloc: viatgen amb la petició, es
// passen al model i es descarten. Decisió de privadesa (usuaris policies).
//
// Secrets: ANTHROPIC_API_KEY (generació) i GEMINI_API_KEY (embeddings, ha de
// coincidir amb els vectors de 768 dims ja existents a kb_documents).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// @ts-ignore Deno
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore Deno
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// @ts-ignore Deno
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
// @ts-ignore Deno
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
// @ts-ignore Deno
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
// @ts-ignore Deno
const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') ?? 'vazquezvelascoeduardo@gmail.com,eduguapo98@gmail.com')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const EMBED_MODEL = 'text-embedding-004'; // 768 dims — no canviar (kb_documents)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

/* ── Límits (anti-abús i control de cost) ──────────────────────────── */
const QUOTAS: Record<string, number> = {
  free: 10,       // sense pla: per provar
  opositor: 15,
  actiu: 60,      // policia en actiu: ús real de carrer
  premium: 80,
};
const MAX_IMAGES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;  // 4 MB per adjunt
const MAX_HISTORY = 12;                   // missatges de context
const MAX_CHARS = 6000;                   // per missatge

/* ── Prompts: cada mode té la seva personalitat ────────────────────── */
const CLOENDA =
  '⚠️ Verifica-ho abans de signar — això és suport a la consulta, no assessorament jurídic vinculant.';

const P_OPERATIVA = `Ets l'assistent operatiu d'InfoPol, per a agents de policia local de Catalunya en servei. L'agent et planteja una SITUACIÓ REAL i tu l'ajudes a resoldre-la.

REGLES INNEGOCIABLES:
1. Basa la resposta en el CONTEXT que se't proporciona. Si una dada concreta (article, import, punts) no hi és, digues clarament que no la tens al corpus i indica on mirar-la. MAI inventis articles, imports, punts ni penes.
2. Cita les fonts amb [n] després de cada afirmació rellevant, on n és el número del fragment del context.
3. Respon en l'idioma de la pregunta (català o castellà).
4. Estructura la resposta així (omet els apartats que no apliquin):
   **Resposta ràpida** — 1-2 frases amb el nucli de la solució.
   **Norma aplicable** — article i text.
   **Import / punts / sanció** — si és una infracció.
   **Procediment** — passos numerats del que ha de fer l'agent.
   **Text per a la butlleta** — literal, entre cometes, llest per copiar (usa la literalitat del nomenclàtor si és al context).
   **Acta / document** — quin cal emplenar.
5. Model operatiu de Viladecans: la PL NO fa custòdia ni declaració de detinguts — deté, llegeix drets i LLIURA el detingut a PG-ME amb l'acta A 54. Tingues-ho present en detencions.
6. Si l'agent adjunta fotos (senyal, vehicle, document, lloc), descriu objectivament el que s'hi veu i relaciona-ho amb la consulta. No identifiquis persones ni dedueixis dades personals.
7. Sigues concret i operatiu: l'agent està al carrer. Res de teoria innecessària.
8. CERCA A INTERNET: tens una eina de cerca limitada a FONTS OFICIALS (BOE, DOGC i Portal Jurídic de la Generalitat, Servei Català de Trànsit, DGT, Ministeri de l'Interior, Poder Judicial). Fes-la servir NOMÉS quan el CONTEXT no tingui la dada o quan la norma pugui haver canviat recentment. Si la fas servir:
   - Digues explícitament quina part ve d'internet i de quin organisme.
   - Indica la data de la norma o de la publicació si la coneixes.
   - Si el que trobes contradiu el CONTEXT, avisa-ho i recomana verificar-ho.
   - Si no trobes res fiable, digues que no ho has pogut confirmar. MAI omplis el buit inventant.
9. Acaba SEMPRE amb aquesta línia exacta: "${CLOENDA}"`;

const P_DILIGENCIA = `Ets un assistent expert en REDACCIÓ DE DOCUMENTS POLICIALS de l'àmbit català (Policies Locals de Catalunya i Mossos d'Esquadra). Transformes dades i una descripció col·loquial dels fets en una MINUTA, DILIGÈNCIA, ACTA, DENÚNCIA o ATESTAT amb la redacció juridicopolicial estàndard.

═══ 1. PRINCIPIS DE REDACCIÓ ═══
- IDIOMA: català formal, registre juridicoadministratiu (o castellà si l'agent escriu en castellà).
- PERSONA: SEMPRE tercera persona o impersonal. Mai primera persona.
  ❌ "Vaig veure..." ✅ "S'observa que..." / "Els agents actuants observen..."
- TEMPS VERBAL: passat per als fets; present per a citar declaracions ("manifesta que").
- OBJECTIVITAT: només fets observats. Cap valoració moral ni opinió.
- PRESUMPCIÓ D'INNOCÈNCIA: sempre "presumpte/a". ❌ "el lladre" ✅ "el presumpte autor del furt".

═══ 2. DICCIONARI OBLIGATORI (col·loquial → formal) ═══
veure/mirar → observar, advertir, constatar · anar al lloc → personar-se, desplaçar-se
aturar/parar → procedir a la intercepció · detenir → procedir a la detenció
preguntar → interpel·lar, requerir · agafar → intervenir, localitzar
escriure → fer constar, deixar constància · escorcollar → realitzar el cacheig de seguretat
dir/comentar → manifestar, exposar, declarar · explicar → exposar
anar-se'n → abandonar el lloc · fugir → emprendre la fuga
pegar → presumptament agredir · robar → presumptament sostreure
insultar → proferir expressions injurioses
el tio/paio → el subjecte, l'individu · borratxo → amb símptomes evidents d'embriaguesa (parla pastosa, mala coordinació, alè etílic, ulls vidriosos)
drogat → amb símptomes evidents d'haver consumit substàncies estupefaents
agressiu → amb actitud agressiva i hostil envers els agents · molt nerviós → amb estat d'alteració evident
no fa cas → desatén els requeriments dels agents
carrer → via pública, vorera, calçada · el cotxe → el vehicle · el pis → el domicili
bar → establiment públic · ganivet → arma blanca · pistola → arma de foc
droga → substància que, per les seves característiques organolèptiques, sembla ser estupefaent (a confirmar amb anàlisi)
al final → finalment · abans → prèviament · llavors → acte seguit · després → posteriorment
per això → motiu pel qual · és → resulta ser

═══ 3. ENCAPÇALAMENTS FORMULARIS ═══
- "En la data i hora indicades, els agents actuants, en servei de patrulla per [LLOC], procedeixen a..."
- "Estant els agents en el desenvolupament del seu servei, són requerits per la sala 112 per..."
- "Davant la trucada efectuada per [persona], els agents es desplacen al lloc on..."

═══ 4. ESTRUCTURES ═══
▸ MINUTA DE SERVEI: 1. Encapçalament (cos, patrulla, TIP, data/hora, lloc) · 2. Exposició dels fets · 3. Persones implicades · 4. Diligències practicades · 5. Resultat · 6. Signatura.
▸ ACTA DE DENÚNCIA: 1. Encapçalament · 2. Denunciant (DNI, adreça) · 3. Denunciat · 4. Fets denunciats · 5. Versió del denunciat · 6. Diligències · 7. Trasllat al Jutjat · 8. Lectura i signatura.
▸ ATESTAT PER ACCIDENT: 1. Encapçalament i instructors · 2. Persones implicades · 3. Vehicles · 4. Exposició cronològica · 5. Estat de la calçada i condicions · 6. Senyalització · 7. Proves (alcoholèmia, drogues, fotos, croquis) · 8. Conclusions amb article infringit · 9. Lectura i signatura · 10. Trasllat al Jutjat.
▸ ACTA D'INTERVENCIÓ: 1. Encapçalament · 2. Causa · 3. Persones · 4. Vehicles · 5. Actuacions · 6. Resultat · 7. Drets respectats (Art. 5 LO 2/1986) · 8. Signatures.

═══ 5. DETENCIONS (Art. 520 LECrim) ═══
Si hi ha detenció, fes constar: lectura de drets comprensible, dret a guardar silenci i a no autoinculpar-se, dret a advocat (d'ofici si no en designa), dret a comunicar la detenció, assistència mèdica, i el màxim de 72 h (Art. 17.2 CE).

═══ 6. PROHIBICIONS ABSOLUTES ═══
- ❌ NO inventis dades que l'agent no t'ha donat (DNI, matrícules, hores, números d'acta). Si en falta una, deixa "__________".
- ❌ NO afirmis culpabilitat: sempre "presumpte/a".
- ❌ NO emetis judicis morals ni conclusions que prejutgin el cas.
- ❌ NO facis servir llenguatge col·loquial ni argot no jurídic.

═══ 7. COM TREBALLES ═══
Ets CONVERSACIONAL. Si et falten dades essencials (data/hora, lloc, patrulla/TIP, tipus de document), DEMANA-LES primer en una llista curta en lloc d'inventar-les. Quan tinguis prou informació, redacta el document complet en text pla amb apartats numerats i un peu de signatura amb línies "_____________________".
Si l'agent adjunta fotos o documents, extreu-ne només dades objectives (matrícules, danys, senyals, text llegible) i incorpora-les. No dedueixis identitats.
Després del document, afegeix una línia final: "${CLOENDA}"`;

const P_SERVEI = `Ets un assistent de REDACCIÓ ADMINISTRATIVA per a agents de policia local. La teva única feina és deixar ben redactada l'anotació del SERVEI perquè l'agent la introdueixi al sistema.

QUÈ FAS:
- Converteixes notes ràpides i desordenades en un text clar, ordenat i professional.
- Rediges en tercera persona o impersonal, amb to neutre i administratiu.
- Ordenes cronològicament: requeriment/inici → actuació → resultat/tancament.
- Corregeixes ortografia, puntuació i concordança. Mantens l'idioma de l'agent (català o castellà).
- Uses un format breu i endreçat: si convé, "Hora d'inici", "Lloc", "Motiu", "Actuació", "Resultat".
- Si falta alguna dada bàsica, deixa "__________" i, al final, indica breument què caldria completar.

QUÈ NO FAS MAI:
- ❌ NO donis assessorament jurídic ni citis articles, lleis, imports ni sancions. Això NO és la teva feina — si t'ho demanen, digues que ho consultin al mode "Consultes operatives".
- ❌ NO qualifiquis jurídicament els fets (no diguis si és delicte, falta o infracció).
- ❌ NO inventis dades. Fes servir només el que t'ha donat l'agent.
- ❌ NO afegeixis valoracions ni opinions.

Retorna NOMÉS el text del servei ja redactat, llest per copiar i enganxar.`;

type Mode = 'operativa' | 'diligencia' | 'servei';

// Cerca a internet LIMITADA A FONTS OFICIALS. Res de blogs ni despatxos:
// només diaris oficials i administracions competents.
const OFFICIAL_DOMAINS = [
  'boe.es',
  'gencat.cat',            // inclou dogc.gencat.cat, portaljuridic, transit, mossos
  'dgt.es',
  'interior.gob.es',
  'poderjudicial.es',
  'seguridadciudadana.mir.es',
];

const MODES: Record<
  Mode,
  { system: string; model: string; rag: boolean; maxTokens: number; web?: boolean }
> = {
  operativa: { system: P_OPERATIVA, model: 'claude-sonnet-5', rag: true, maxTokens: 4096, web: true },
  diligencia: { system: P_DILIGENCIA, model: 'claude-sonnet-5', rag: true, maxTokens: 4096 },
  servei: { system: P_SERVEI, model: 'claude-haiku-4-5-20251001', rag: false, maxTokens: 1600 },
};

/* ── Embeddings (Gemini) — han de coincidir amb kb_documents ───────── */
async function embed(text: string): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text: text.slice(0, 9000) }] },
    }),
  });
  if (!r.ok) throw new Error(`Embeddings ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return d.embedding?.values ?? [];
}

/* ── Trossejat per a la ingesta de coneixement ─────────────────────── */
function chunk(text: string, size = 1600, overlap = 200): string[] {
  const paras = text.split(/\n\n+/);
  const out: string[] = [];
  let buf = '';
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > size && buf) {
      out.push(buf.trim());
      buf = buf.slice(Math.max(0, buf.length - overlap)) + '\n\n' + p;
    } else buf = buf ? buf + '\n\n' + p : p;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter((c) => c.length > 40);
}

/* ── Generació (Anthropic) ─────────────────────────────────────────── */
type Att = { type: 'image' | 'document'; media_type: string; data: string };
type Msg = { role: 'user' | 'assistant'; content: string };

type WebSrc = { title: string; url: string };

async function callClaude(
  cfg: { system: string; model: string; maxTokens: number; web?: boolean },
  history: Msg[],
  context: string,
  attachments: Att[],
): Promise<{ text: string; webSources: WebSrc[] }> {
  // El context RAG va com a primer bloc del darrer missatge de l'usuari.
  const messages: unknown[] = history.slice(0, -1).map((m) => ({
    role: m.role,
    content: m.content.slice(0, MAX_CHARS),
  }));

  const last = history[history.length - 1];
  const blocks: unknown[] = [];
  for (const a of attachments) {
    blocks.push({
      type: a.type,
      source: { type: 'base64', media_type: a.media_type, data: a.data },
    });
  }
  const userText = context
    ? `CONTEXT (fragments del corpus InfoPol):\n${context}\n\n---\n\nMISSATGE DE L'AGENT:\n${last.content.slice(0, MAX_CHARS)}`
    : last.content.slice(0, MAX_CHARS);
  blocks.push({ type: 'text', text: userText });
  messages.push({ role: 'user', content: blocks });

  // Cerca a internet només al mode operativa i només a fonts oficials.
  const tools = cfg.web
    ? [{
        type: 'web_search_20260209',
        name: 'web_search',
        max_uses: 4,
        allowed_domains: OFFICIAL_DOMAINS,
      }]
    : undefined;

  const webSources: WebSrc[] = [];
  let text = '';

  // El servidor pot pausar el torn (pause_turn) si la cerca fa moltes voltes:
  // cal reenviar la conversa perquè continuï. Limitem les represes.
  for (let volta = 0; volta < 3; volta++) {
    const body: Record<string, unknown> = {
      model: cfg.model,
      max_tokens: cfg.maxTokens,
      system: cfg.system,
      messages,
    };
    if (tools) body.tools = tools;

    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();

    for (const b of data?.content ?? []) {
      if (b.type === 'text') text += (text ? '\n' : '') + b.text;
      // En error, .content és un objecte amb error_code (no una llista).
      if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
        for (const r of b.content) {
          if (r?.type === 'web_search_result' && r.url) {
            webSources.push({ title: String(r.title ?? r.url), url: String(r.url) });
          }
        }
      }
    }

    // Els classificadors poden declinar: ho expliquem sense fingir una resposta.
    if (data?.stop_reason === 'refusal') {
      return {
        text:
          "No puc respondre aquesta consulta concreta. Reformula-la centrant-te en l'actuació policial, o consulta-ho amb el comandament.",
        webSources,
      };
    }
    if (data?.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: data.content });
      continue;
    }
    break;
  }

  if (!text.trim()) throw new Error('Resposta buida del model');
  return { text, webSources };
}

/* ── Usuari + pla ──────────────────────────────────────────────────── */
async function getUser(req: Request) {
  const auth = req.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  const c = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: auth } } });
  const { data, error } = await c.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

async function getPlan(admin: ReturnType<typeof createClient>, userId: string): Promise<string> {
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan, active, expires_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (!sub || !sub.active) return 'free';
  if (sub.expires_at) {
    const exp = new Date(sub.expires_at).getTime();
    if (Number.isNaN(exp) || exp <= Date.now()) return 'free';
  }
  return String(sub.plan ?? 'free');
}

/* ── Handler ───────────────────────────────────────────────────────── */
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? 'ask');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    /* stats — recompte de la base de coneixement */
    if (action === 'stats') {
      const { count } = await admin.from('kb_documents').select('id', { count: 'exact', head: true });
      return json(200, { ok: true, total: count ?? 0 });
    }

    const user = await getUser(req);
    if (!user) return json(401, { ok: false, error: 'Cal iniciar sessió.' });
    const isAdmin = ADMIN_EMAILS.includes((user.email ?? '').toLowerCase());

    /* ingest — carregar coneixement (només admins) */
    if (action === 'ingest') {
      if (!isAdmin) return json(403, { ok: false, error: 'Només administradors.' });
      if (!GEMINI_API_KEY) return json(500, { ok: false, error: 'Falta GEMINI_API_KEY.' });
      const docs = Array.isArray(body.documents) ? body.documents : [];
      if (!docs.length) return json(400, { ok: false, error: 'Sense documents.' });

      let inserted = 0;
      for (const doc of docs) {
        const source = String(doc.source ?? doc.title ?? 'sense-font');
        const modes: string[] = Array.isArray(doc.modes) && doc.modes.length
          ? doc.modes.filter((m: string) => m in MODES)
          : ['operativa', 'diligencia', 'servei'];
        const pieces = chunk(String(doc.content ?? ''));
        if (!pieces.length) continue;
        // Cada font substitueix la seva versió anterior.
        if (body.replace !== false) await admin.from('kb_documents').delete().eq('source', source);
        for (const content of pieces) {
          const vec = await embed(content);
          const { error } = await admin.from('kb_documents').insert({
            source,
            title: String(doc.title ?? source),
            kind: String(doc.kind ?? 'document'),
            content,
            embedding: vec,
            modes,
          });
          if (error) throw new Error('Insert: ' + error.message);
          inserted++;
        }
      }
      const { count } = await admin.from('kb_documents').select('id', { count: 'exact', head: true });
      return json(200, { ok: true, inserted, total: count ?? 0 });
    }

    /* ask — la conversa */
    if (action !== 'ask') return json(400, { ok: false, error: `Acció desconeguda: ${action}` });
    if (!ANTHROPIC_API_KEY) return json(500, { ok: false, error: 'IA no configurada (manca ANTHROPIC_API_KEY).' });

    const mode = String(body.mode ?? 'operativa') as Mode;
    const cfg = MODES[mode];
    if (!cfg) return json(400, { ok: false, error: `Mode no vàlid: ${mode}` });

    // Historial de la conversa (el client el manté; no el desem al servidor).
    const raw = Array.isArray(body.messages) ? body.messages : [];
    const history: Msg[] = raw
      .filter((m: Msg) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY);
    if (!history.length || history[history.length - 1].role !== 'user') {
      return json(400, { ok: false, error: 'Cal un missatge de l\'usuari.' });
    }

    // Adjunts: es passen al model i es descarten. No es desen enlloc.
    const attachments: Att[] = (Array.isArray(body.attachments) ? body.attachments : [])
      .slice(0, MAX_IMAGES)
      .filter((a: Att) => a && typeof a.data === 'string' && typeof a.media_type === 'string')
      .filter((a: Att) => a.data.length * 0.75 <= MAX_FILE_BYTES)
      .map((a: Att) => ({
        type: a.media_type === 'application/pdf' ? 'document' : 'image',
        media_type: a.media_type,
        data: a.data,
      }));

    // Quota diària per pla.
    const plan = await getPlan(admin, user.id);
    const limit = QUOTAS[plan] ?? QUOTAS.free;
    if (!isAdmin) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: used } = await admin
        .from('ai_usage')
        .select('count')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('feature', 'assistent')
        .maybeSingle();
      const current = used?.count ?? 0;
      if (current >= limit) {
        return json(429, {
          ok: false,
          error: `Has arribat al límit diari (${limit} consultes). Torna demà.`,
          used: { count: current, limit, plan },
        });
      }
    }

    // RAG: només als modes que el necessiten.
    let context = '';
    let sources: { title: string; source: string; kind: string }[] = [];
    if (cfg.rag && GEMINI_API_KEY) {
      try {
        const vec = await embed(history[history.length - 1].content);
        const { data: hits } = await admin.rpc('match_kb_documents_mode', {
          query_embedding: JSON.stringify(vec),
          match_count: 8,
          p_mode: mode,
        });
        const rows = (hits ?? []) as { title: string; source: string; kind: string; content: string }[];
        context = rows.map((h, i) => `[${i + 1}] (${h.title})\n${h.content}`).join('\n\n---\n\n');
        sources = rows.map((h) => ({ title: h.title, source: h.source, kind: h.kind }));
      } catch (_e) {
        // Sense context: el prompt ja obliga a dir que no té la dada.
        context = '';
      }
    }

    const { text, webSources } = await callClaude(cfg, history, context, attachments);
    // Les fonts d'internet es marquen com a tals perquè l'agent les distingeixi.
    for (const w of webSources) {
      if (!sources.some((s) => s.source === w.url)) {
        sources.push({ title: w.title, source: w.url, kind: 'web' });
      }
    }

    // Comptabilitza l'ús (els admins no gasten quota).
    let count = 0;
    if (!isAdmin) {
      const { data: inc } = await admin.rpc('ai_usage_increment', {
        p_user_id: user.id,
        p_feature: 'assistent',
      });
      count = typeof inc === 'number' ? inc : 0;
    }

    return json(200, { ok: true, text, sources, used: { count, limit, plan } });
  } catch (e) {
    return json(500, { ok: false, error: e instanceof Error ? e.message : String(e) });
  }
});
