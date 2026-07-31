// Mode estudi — índex de lleis.
//
// És la mateixa entrada que a l'app: tries la llei i te'n vas al lector,
// on pots subratllar. Els subratllats es guarden al núvol, així que el
// que marquis aquí surt al mòbil i a l'inrevés.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { ALL_CARDS, MODULES, getCardsByModule } from '../lib/content';
import { llegeixTots, type Subratllat } from '../lib/subratllats';
import { CardV, I, Mono, RV, TitolV, V } from '../lib/v3';

export default function Estudi() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [subs, setSubs] = useState<Subratllat[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let viu = true;
    if (!user) { setSubs([]); return; }
    llegeixTots().then((s) => { if (viu) setSubs(s); }).catch(() => {});
    return () => { viu = false; };
  }, [user]);

  // Quants subratllats té cada mòdul, per ensenyar per on vas.
  const perModul = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of subs) {
      const modul = s.doc.split('/')[0];
      m.set(modul, (m.get(modul) ?? 0) + 1);
    }
    return m;
  }, [subs]);

  const moduls = useMemo(() => {
    const text = q.trim().toLowerCase();
    return MODULES
      .map((m) => ({ m, fitxes: getCardsByModule(m.slug) }))
      .filter(({ m, fitxes }) => {
        if (!fitxes.length) return false;
        if (!text) return true;
        return m.title.toLowerCase().includes(text)
          || m.description.toLowerCase().includes(text);
      });
  }, [q]);

  return (
    <div className="v3-page v3-anim">
      <TitolV fort="Estudia" post="per tema" />
      <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 20px', lineHeight: 1.5 }}>
        El temari sencer. Selecciona qualsevol frase per subratllar-la; després la
        tindràs al repàs i a l'app del mòbil.
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, background: V.surface,
        borderRadius: 12, padding: '11px 15px', maxWidth: 460, marginBottom: 20,
        boxShadow: V.shadow,
      }}>
        <I n="search" size={16} sw={2} color={V.muted} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtra per llei…"
          aria-label="Filtra per llei"
          style={{
            flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none',
            color: V.ink, fontSize: 13.5, fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {moduls.map(({ m, fitxes }) => {
          const marcats = perModul.get(m.slug) ?? 0;
          return (
            <CardV key={m.slug} pad={18} r={RV.lg} onClick={() => nav(`/estudi/${m.slug}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{
                  width: 42, height: 42, flexShrink: 0, borderRadius: 14,
                  background: V.terraSoft, color: V.terraInk,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I n="book" size={19} sw={1.9} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: -0.4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: V.muted, marginTop: 3 }}>
                    {fitxes.length} fitx{fitxes.length === 1 ? 'a' : 'es'}
                    {marcats > 0 && ` · ${marcats} subratllat${marcats === 1 ? '' : 's'}`}
                  </div>
                </div>
                <I n="arrow" size={15} sw={2.4} color={V.faint} />
              </div>
            </CardV>
          );
        })}
      </div>

      {moduls.length === 0 && (
        <p style={{ fontSize: 13.5, color: V.muted }}>Cap llei amb aquest nom.</p>
      )}

      {ALL_CARDS.length > 0 && (
        <Mono size={9.5} color={V.faint} style={{ display: 'block', marginTop: 24 }}>
          {ALL_CARDS.length} FITXES EN TOTAL
        </Mono>
      )}
    </div>
  );
}
