// Pàgina de "Lleis" — la biblioteca de fitxes de norma, agrupada per mòdul.
import { useNavigate } from 'react-router-dom';

import Capcalera from '../components/Capcalera';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';
import { Mono, V } from '../lib/v3';

/** Accent de cada mòdul. Serveix per distingir-los d'un cop d'ull. */
const MODULE_ACCENT: Record<string, string> = {
  'ce78': '#E5484D',
  'codi-penal': '#C13030',
  'eac': '#E89A1C',
  'fcs': '#2F6BD8',
  'lecrim': '#9747D6',
  'menors': '#E85D8C',
  'municipi': '#2FB66B',
  'sc': '#2a3a52',
  'transit': '#C4530A',
};

export default function Leyes() {
  const { t } = useT();
  const nav = useNavigate();
  const totalCards = MODULES.reduce((acc, m) => acc + getCardsByModule(m.slug).length, 0);

  return (
    <div className="v3-page v3-anim">
      <Capcalera
        kicker={t('home.leyes.badge')}
        titol={t('leyes.title')}
        lead={t('leyes.subtitle')}
        xifres={[
          { valor: String(MODULES.length), label: t('home.sections') },
          { valor: String(totalCards), label: plural(t, totalCards, 'cards') },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {MODULES.map((m) => {
          const count = getCardsByModule(m.slug).length;
          const accent = MODULE_ACCENT[m.slug] ?? V.terraInk;
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => nav(`/leyes/s/${m.slug}`)}
              style={{
                textAlign: 'left', cursor: 'pointer', border: `1px solid ${V.hair}`,
                borderRadius: 18, padding: 17, background: V.surface, color: V.ink,
                boxShadow: V.shadow, display: 'flex', alignItems: 'flex-start', gap: 13,
              }}>
              <span style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 14,
                background: `${accent}1F`, color: accent, fontSize: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.icon}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.25 }}>
                  {t(`module.${m.slug}.title`)}
                </span>
                <span style={{ display: 'block', fontSize: 12.5, color: V.muted, lineHeight: 1.4, marginTop: 4 }}>
                  {t(`module.${m.slug}.desc`)}
                </span>
                <Mono size={9.5} color={accent} style={{ display: 'block', marginTop: 8, letterSpacing: 1.2 }}>
                  {count} {plural(t, count, 'cards').toUpperCase()}
                </Mono>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
