// InfoPol Chat — Edge Function (Deno / Supabase).
// L'expert normatiu de la web: RAG sobre el corpus InfoPol (fitxes
// d'operativa, nomenclàtor SCT, actes de Viladecans i fitxes de lleis)
// amb Gemini. Accions:
//   stats  → { count }
//   ask    → { answer, sources[], usage }            (usuaris autenticats)
//   ingest → { inserted, total }                     (només admins; replace per font)
//   purge  → { deleted, total }                      (només admins)
//
// Secrets necessaris (supabase secrets set):
//   GEMINI_API_KEY   — clau de Google AI Studio
//   ADMIN_EMAILS     — opcional, llista separada per comes (default: els 2 admins)
// SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY els injecta la plataforma.
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const ADMINS = (Deno.env.get("ADMIN_EMAILS") ?? "vazquezvelascoeduardo@gmail.com,eduguapo98@gmail.com")
  .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
// Token de bootstrap OPCIONAL per a la ingesta inicial automatitzada
// (només actiu si el secret BOOTSTRAP_TOKEN està definit; es pot
// esborrar el secret un cop feta la càrrega per tancar la porta).
const BOOTSTRAP_TOKEN = Deno.env.get("BOOTSTRAP_TOKEN") ?? "";
const EMBED_MODEL = "text-embedding-004";           // 768 dims
const GEN_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"]; // fallback en cadena
const DAILY_LIMIT = 40;                              // preguntes/usuari/dia

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/* ── Gemini helpers ─────────────────────────────────────────── */
async function embed(texts: string[]): Promise<number[][]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents?key=${GEMINI_KEY}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: texts.map((t) => ({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: t.slice(0, 9000) }] },
      })),
    }),
  });
  if (!r.ok) throw new Error(`Embeddings ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const d = await r.json();
  return (d.embeddings ?? []).map((e: { values: number[] }) => e.values);
}

async function generate(system: string, user: string): Promise<{ text: string; usage?: unknown }> {
  let lastErr = "";
  for (const model of GEN_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1400 },
      }),
    });
    if (r.ok) {
      const d = await r.json();
      const text = d.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
      return { text, usage: d.usageMetadata };
    }
    lastErr = `${model} → ${r.status}: ${(await r.text()).slice(0, 200)}`;
  }
  throw new Error(`Generació fallida (${lastErr})`);
}

/* ── Trossejat per a la ingesta ─────────────────────────────── */
function chunk(text: string, size = 1600, overlap = 200): string[] {
  const paras = text.split(/\n\n+/);
  const out: string[] = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > size && buf) {
      out.push(buf.trim());
      buf = buf.slice(Math.max(0, buf.length - overlap)) + "\n\n" + p; // solapament
    } else buf = buf ? buf + "\n\n" + p : p;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter((c) => c.length > 40);
}

/* ── Prompt de sistema: l'EXPERT InfoPol ────────────────────── */
const SYSTEM = `Ets l'assistent expert d'InfoPol, una eina de consulta per a agents i aspirants de policia local de Catalunya (usuari tipus: Policia Local de Viladecans).

REGLES INNEGOCIABLES:
1. Respon NOMÉS amb la informació del CONTEXT que se't proporciona. Si la resposta no hi és, digues-ho clarament ("No tinc aquesta informació al corpus") i suggereix on mirar (quina fitxa d'Operativa o llei). MAI inventis articles, imports o penes.
2. Cita les fonts amb [n] al final de cada afirmació rellevant, on n és el número del fragment del context.
3. Respon en l'idioma de la pregunta (català o castellà).
4. Estructura la resposta així quan sigui una consulta operativa:
   **Resposta ràpida** (1-2 frases amb el nucli)
   Després, si escau: **Article** · **Import/Pena** · **Procediment** (passos numerats) · **Actes a emplenar (PL Viladecans)**.
5. Model operatiu de Viladecans: la PL NO fa custòdia ni declaració de detinguts — deté, llegeix drets (N 01) i LLIURA el detingut a PG-ME amb l'acta A 54. Tingues-ho en compte en tota resposta sobre detencions.
6. Si et demanen redactar un concepte de butlleta o esborrany d'acta: fes-ho utilitzant EXACTAMENT la literalitat del context (conceptes del nomenclàtor SCT o de les fitxes), i marca'l com a ESBORRANY.
7. Sigues concís: màxim ~300 paraules llevat que demanin detall.
8. Acaba SEMPRE amb aquesta línia: "⚠️ Verifica-ho abans de signar — això és suport a l'estudi/consulta, no assessorament jurídic vinculant."`;

/* ── Handler ────────────────────────────────────────────────── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    if (!GEMINI_KEY) return json({ error: "Falta el secret GEMINI_API_KEY a la funció." }, 500);
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");

    // Usuari autenticat (el client envia el JWT de sessió).
    const auth = req.headers.get("Authorization") ?? "";
    const { data: userData } = await admin.auth.getUser(auth.replace(/^Bearer\s+/i, ""));
    const user = userData?.user ?? null;
    const email = (user?.email ?? "").toLowerCase();
    // Bootstrap: permet la ingesta automatitzada inicial sense sessió
    // d'usuari, amb un token d'un sol ús guardat com a secret.
    const bootstrapOk = !!BOOTSTRAP_TOKEN && req.headers.get("x-bootstrap-token") === BOOTSTRAP_TOKEN;
    const isAdmin = ADMINS.includes(email) || bootstrapOk;

    if (action === "stats") {
      const { count } = await admin.from("chat_docs").select("id", { count: "exact", head: true });
      return json({ count: count ?? 0 });
    }

    if (!user && !bootstrapOk) return json({ error: "Cal iniciar sessió." }, 401);
    if (!user && bootstrapOk && action === "ask") return json({ error: "El bootstrap només permet ingest/purge/stats." }, 403);

    if (action === "ingest") {
      if (!isAdmin) return json({ error: "Només administradors." }, 403);
      const documents = Array.isArray(body.documents) ? body.documents : [];
      const replace = body.replace !== false; // per defecte substitueix per font
      if (!documents.length) return json({ error: "Sense documents." }, 400);
      let inserted = 0;
      for (const doc of documents) {
        const source = String(doc.source ?? doc.title ?? "sense-font");
        const pieces = chunk(String(doc.content ?? ""));
        if (!pieces.length) continue;
        if (replace) await admin.from("chat_docs").delete().eq("source", source);
        for (let i = 0; i < pieces.length; i += 16) {
          const batch = pieces.slice(i, i + 16);
          const vecs = await embed(batch);
          const rows = batch.map((content, j) => ({
            source,
            title: String(doc.title ?? source),
            kind: String(doc.kind ?? "document"),
            content,
            embedding: vecs[j],
          }));
          const { error } = await admin.from("chat_docs").insert(rows);
          if (error) throw new Error("Insert: " + error.message);
          inserted += rows.length;
        }
      }
      const { count } = await admin.from("chat_docs").select("id", { count: "exact", head: true });
      return json({ inserted, total: count ?? 0 });
    }

    if (action === "purge") {
      if (!isAdmin) return json({ error: "Només administradors." }, 403);
      const q = admin.from("chat_docs").delete();
      const { count: before } = await admin.from("chat_docs").select("id", { count: "exact", head: true });
      if (body.source) await q.eq("source", String(body.source));
      else await q.neq("id", 0);
      const { count: after } = await admin.from("chat_docs").select("id", { count: "exact", head: true });
      return json({ deleted: (before ?? 0) - (after ?? 0), total: after ?? 0 });
    }

    if (action === "ask") {
      const question = String(body.question ?? "").trim();
      if (!question) return json({ error: "Pregunta buida." }, 400);

      // Límit diari per usuari (no aplica als admins).
      if (!isAdmin) {
        const day = new Date().toISOString().slice(0, 10);
        const { data: u } = await admin.from("chat_usage")
          .select("count").eq("user_id", user.id).eq("day", day).maybeSingle();
        const used = u?.count ?? 0;
        if (used >= DAILY_LIMIT) return json({ error: `Has arribat al límit diari (${DAILY_LIMIT} consultes). Torna demà.` }, 429);
        await admin.from("chat_usage").upsert({ user_id: user.id, day, count: used + 1 });
      }

      const [qvec] = await embed([question]);
      const { data: hits, error: mErr } = await admin.rpc("match_chat_docs", {
        query_embedding: qvec,
        match_count: 10,
      });
      if (mErr) throw new Error("Cerca: " + mErr.message);
      const context = (hits ?? [])
        .map((h: { title: string; content: string }, i: number) => `[${i + 1}] (${h.title})\n${h.content}`)
        .join("\n\n---\n\n");

      const { text, usage } = await generate(
        SYSTEM,
        `CONTEXT:\n${context || "(buit)"}\n\nPREGUNTA DE L'AGENT:\n${question}`,
      );
      const sources = (hits ?? []).map((h: { source: string; title: string; kind: string }) => ({
        source: h.source, title: h.title, kind: h.kind,
      }));
      return json({ answer: text, sources, usage });
    }

    return json({ error: `Acció desconeguda: ${action}` }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
