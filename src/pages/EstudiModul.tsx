// Mode estudi — les fitxes d'una llei.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { MODULES, getCardsByModule } from '../lib/content';
import { llegeixTots, type Subratllat } from '../lib/subratllats';
import { CardV, I, RV, TitolV, V } from '../lib/v3';

export default function EstudiModul() {
  const { moduleSlug = '' } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [subs, setSubs] = useState<Subratllat[]>([]);

  const modul = MODULES.find((m) => m.slug === moduleSlug);
  const fitxes = useMemo(() => getCardsByModule(moduleSlug), [moduleSlug]);

  useEffect(() => {
    let viu = true;
    if (!user) { setSubs([]); return; }
    llegeixTots().then((s) => { if (viu) setSubs(s); }).catch(() => {});
    return () => { viu = false; };
  }, [user]);

  const perFitxa = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of subs) m.set(s.doc, (m.get(s.doc) ?? 0) + 1);
    return m;
  }, [subs]);

  if (!modul) {
    return (
      <div className="v3-page v3-anim">
        <TitolV fort="Llei" post="no trobada" />
        <Link to="/estudi" style={{ fontSize: 14, fontWeight: 700 }}>Torna a l'índex</Link>
      </div>
    );
  }

  return (
    <div className="v3-page v3-anim">
      <button
        type="button"
        onClick={() => nav('/estudi')}
        style={{
          border: 'none', background: 'transparent', color: V.muted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, padding: 0, marginBottom: 14,
          fontSize: 13, fontWeight: 600,
        }}>
        <I n="back" size={15} sw={2.2} /> Totes les lleis
      </button>

      <TitolV fort={modul.title} />
      <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 20px' }}>{modul.description}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 760 }}>
        {fitxes.map((f) => {
          const marcats = perFitxa.get(`${f.moduleSlug}/${f.slug}`) ?? 0;
          return (
            <CardV
              key={f.slug}
              pad={16}
              r={RV.md}
              onClick={() => nav(`/estudi/${f.moduleSlug}/${f.slug}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{
                  width: 38, height: 38, flexShrink: 0, borderRadius: 12,
                  background: marcats > 0 ? V.terraSoft : V.surface2,
                  color: marcats > 0 ? V.terraInk : V.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I n="doc" size={17} sw={1.9} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, letterSpacing: -0.25 }}>
                    {f.title}
                  </span>
                  {marcats > 0 && (
                    <span style={{ display: 'block', fontSize: 11.5, color: V.terraInk, marginTop: 3 }}>
                      {marcats} subratllat{marcats === 1 ? '' : 's'}
                    </span>
                  )}
                </span>
                <I n="arrow" size={15} sw={2.4} color={V.faint} />
              </div>
            </CardV>
          );
        })}
      </div>
    </div>
  );
}
