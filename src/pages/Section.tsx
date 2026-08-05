// Pàgina d'un mòdul de Lleis: capçalera del mòdul i les seves fitxes.
import { useNavigate, useParams } from 'react-router-dom';

import Capcalera from '../components/Capcalera';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';
import { Mono, V } from '../lib/v3';

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

export default function Section() {
  const { moduleSlug = '' } = useParams();
  const nav = useNavigate();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const { t } = useT();

  if (!mod) {
    return (
      <div className="v3-page v3-anim">
        <p style={{ fontSize: 15, color: V.muted }}>{t('section.notFound')}</p>
        <button
          type="button"
          onClick={() => nav('/leyes')}
          style={{
            marginTop: 14, cursor: 'pointer', border: 'none', borderRadius: 999,
            padding: '10px 18px', background: V.terra, color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
          {t('leyes.title')}
        </button>
      </div>
    );
  }

  const cards = getCardsByModule(moduleSlug);
  const accent = MODULE_ACCENT[mod.slug] ?? V.terraInk;

  return (
    <div className="v3-page v3-anim">
      <Capcalera
        kicker={`${mod.icon} ${t('home.leyes.badge')}`}
        titol={t(`module.${mod.slug}.title`)}
        lead={t(`module.${mod.slug}.desc`)}
        accent={accent}
        xifres={[{ valor: String(cards.length), label: plural(t, cards.length, 'cards') }]}
      />

      {cards.length === 0 ? (
        <div style={{
          border: `1px dashed ${V.border}`, borderRadius: 18, padding: 28,
          textAlign: 'center', color: V.muted, fontSize: 14, background: V.surface2,
        }}>
          {t('section.empty')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {cards.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => nav(`/leyes/s/${c.moduleSlug}/${c.slug}`)}
              style={{
                textAlign: 'left', cursor: 'pointer', border: `1px solid ${V.hair}`,
                borderRadius: 18, padding: '14px 15px', background: V.surface, color: V.ink,
                boxShadow: V.shadow, display: 'flex', alignItems: 'center', gap: 13,
              }}>
              <span style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 14,
                background: `${accent}1F`, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.icon}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14.5, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.3 }}>
                  {c.title}
                </span>
                <span style={{
                  display: 'block', fontSize: 12.5, color: V.muted, marginTop: 3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {resum(c.searchText)}
                </span>
              </span>
              <Mono size={14} color={accent} style={{ flexShrink: 0 }}>›</Mono>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function resum(text: string): string {
  const s = text.replace(/\s+/g, ' ').trim();
  return s.length > 140 ? `${s.slice(0, 137)}…` : s;
}
