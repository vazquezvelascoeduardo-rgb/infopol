// Panell de debilitats + pla de repàs.
// A partir de les preguntes que l'usuari ha fallat (sistema SRS de
// failures.ts) mostra on falla més, què toca repassar avui i un accés
// directe per repassar. Tot al navegador, amb dades reals (res inventat).
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { A, Ic, Mono, Card, PageHead, Chip } from '../../lib/design';
import { useAllFailures, LEARNED_THRESHOLD, type FailureRecord } from '../../lib/failures';
import { TOPICS } from '../../data/tests';

// Mapa slug → metadades del tema (títol, categoria, icona).
const TOPIC_META = new Map(TOPICS.map((t) => [t.slug, t]));
const CAT_LABEL: Record<string, string> = {
  temari: 'Temari PL', mossos: 'Mossos', cultura: 'Cultura', municipi: 'Municipi', actualitat: 'Actualitat',
};

type Group = {
  slug: string; title: string; cat: string;
  pending: number; learned: number; due: number; total: number; fails: number;
};

function human(next: number, now: number): string {
  if (next <= now) return 'Avui';
  const d = Math.ceil((next - now) / 86400000);
  if (d === 1) return 'Demà';
  if (d < 30) return `En ${d} dies`;
  return `En ${Math.round(d / 30)} mesos`;
}

export default function Debilitats() {
  const all = useAllFailures();
  const now = Date.now();

  const { groups, counts } = useMemo(() => {
    const map = new Map<string, Group>();
    let total = 0, due = 0, learned = 0, pending = 0;
    for (const r of all as FailureRecord[]) {
      total++;
      const isDue = r.nextReviewAt <= now;
      if (isDue) due++;
      if (r.learned) learned++; else pending++;
      const meta = TOPIC_META.get(r.topicSlug);
      let g = map.get(r.topicSlug);
      if (!g) {
        g = { slug: r.topicSlug, title: meta?.title || r.topicSlug, cat: meta?.category || 'temari', pending: 0, learned: 0, due: 0, total: 0, fails: 0 };
        map.set(r.topicSlug, g);
      }
      g.total++; g.fails += r.failures;
      if (isDue) g.due++;
      if (r.learned) g.learned++; else g.pending++;
    }
    // Ordena: primer els que tenen més preguntes pendents (debilitats),
    // desempatant pel total de fallades acumulades.
    const groups = [...map.values()].sort((a, b) => b.pending - a.pending || b.fails - a.fails);
    return { groups, counts: { total, due, learned, pending } };
  }, [all, now]);

  const linkFor = (cat: string, slug: string) =>
    cat === 'mossos' ? `/mossos/${slug}`
    : cat === 'cultura' ? `/cultura-general/${slug}`
    : cat === 'actualitat' ? `/actualitat/${slug}`
    : `/policia-local/${slug}`;

  const Stat = ({ n, label, color }: { n: number; label: string; color: string }) => (
    <div style={{ flex: 1, minWidth: 92, background: A.bgSoft, border: `1px solid ${A.line}`, borderRadius: A.rlg, padding: '14px 16px' }}>
      <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 30, lineHeight: 1, color }}>{n}</div>
      <Mono size={9} color={A.inkMuted} style={{ display: 'block', marginTop: 6 }}>{label}</Mono>
    </div>
  );

  return (
    <div className="a-main-pad" style={{ maxWidth: 920, margin: '0 auto', width: '100%' }}>
      <PageHead kicker="Acadèmia · repàs intel·ligent" title="Les teves debilitats"
        desc="Aquí veus on falles més i què et toca repassar. Es construeix amb les preguntes que has errat, espaiant els repassos fins que les domines." />

      {counts.total === 0 ? (
        <Card pad={28} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
          <h3 style={{ fontFamily: A.display, fontWeight: 700, fontSize: 20, color: A.ink, margin: '0 0 6px' }}>Encara no hi ha res per repassar</h3>
          <p style={{ fontFamily: A.sans, fontSize: 15, color: A.inkSoft, margin: '0 auto 18px', maxWidth: 460, lineHeight: 1.5 }}>
            Fes alguns tests i, cada cop que falles una pregunta, apareixerà aquí. Et direm en quins temes fluixeges i quan repassar-los.
          </p>
          <Link to="/policia-local"><Chip tone="terracota" solid>Anar als tests →</Chip></Link>
        </Card>
      ) : (
        <>
          {/* Resum */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <Stat n={counts.due} label="Toca avui" color={counts.due ? A.terracota : A.inkMuted} />
            <Stat n={counts.pending} label="Per dominar" color={A.ink} />
            <Stat n={counts.learned} label="Apreses" color={A.green} />
            <Stat n={counts.total} label="En seguiment" color={A.inkSoft} />
          </div>

          {/* CTA repàs */}
          <Card pad={18} style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 22, background: counts.due ? A.terraSoft : A.card, border: `1px solid ${counts.due ? A.terracota : A.line}` }}>
            <span style={{ width: 46, height: 46, borderRadius: 13, background: counts.due ? A.terracota : A.bgSoft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Ic name="bolt" size={24} color={counts.due ? '#fff' : A.inkMuted} fill={!!counts.due} />
            </span>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.ink }}>
                {counts.due ? `Tens ${counts.due} pregunta${counts.due === 1 ? '' : 's'} per repassar` : 'Estàs al dia 🎉'}
              </div>
              <p style={{ margin: '2px 0 0', fontFamily: A.sans, fontSize: 13.5, color: A.inkSoft }}>
                {counts.due ? 'Repassa-les ara per fixar-les abans que se t\'oblidin.' : 'No hi ha res pendent. Pots forçar un repàs general quan vulguis.'}
              </p>
            </div>
            <Link to="/policia-local/repas" className="a-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: A.ink, color: '#fff', borderRadius: 14, padding: '12px 20px', fontFamily: A.display, fontWeight: 700, fontSize: 14.5, textDecoration: 'none', boxShadow: A.shadowMd }}>
              {counts.due ? 'Repassar ara' : 'Repàs general'} <Ic name="arrow" size={17} color="#fff" sw={2.3} />
            </Link>
          </Card>

          {/* Debilitats per tema */}
          <Mono size={10} color={A.inkMuted} style={{ display: 'block', marginBottom: 10 }}>On falles més</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {groups.map((g) => {
              const pct = g.total ? Math.round((g.learned / g.total) * 100) : 0;
              const nextRec = all.filter((r) => r.topicSlug === g.slug).sort((a, b) => a.nextReviewAt - b.nextReviewAt)[0];
              return (
                <Link key={g.slug} to={linkFor(g.cat, g.slug)} className="a-hover" style={{ textDecoration: 'none' }}>
                  <Card pad={16} hover style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink }}>{g.title}</span>
                        <Chip tone={g.cat === 'mossos' ? 'blue' : g.cat === 'cultura' ? 'purple' : g.cat === 'actualitat' ? 'amber' : 'terracota'}>{CAT_LABEL[g.cat] || g.cat}</Chip>
                        {g.due > 0 && <Chip tone="red" solid>{g.due} avui</Chip>}
                      </div>
                      {/* barra de domini */}
                      <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: A.line, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: pct > 66 ? A.green : pct > 33 ? A.gold : A.red, transition: 'width .3s' }} />
                      </div>
                      <div style={{ marginTop: 7, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <Mono size={9} color={A.inkMuted}>{g.pending} per dominar</Mono>
                        <Mono size={9} color={A.inkMuted}>{g.learned}/{g.total} apreses</Mono>
                        {nextRec && <Mono size={9} color={nextRec.nextReviewAt <= now ? A.terracota : A.inkMuted}>Pròxim: {human(nextRec.nextReviewAt, now)}</Mono>}
                      </div>
                    </div>
                    <Ic name="chevR" size={18} color={A.inkFaint} />
                  </Card>
                </Link>
              );
            })}
          </div>

          <p style={{ marginTop: 18, fontFamily: A.sans, fontSize: 12.5, color: A.inkMuted, lineHeight: 1.5 }}>
            Una pregunta es marca com a <b>apresa</b> quan l'encertes {LEARNED_THRESHOLD} cops seguits, però segueix tornant cada cop més espaiada per no oblidar-la.
          </p>
        </>
      )}
    </div>
  );
}
