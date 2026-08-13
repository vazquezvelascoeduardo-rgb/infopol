import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, CatIcon, Pill } from '../../components/Shared';
import { useContent } from '../../content/ContentProvider';

function CategoryRow({ c, count, onClick }) {
  const k = T.cat[c.cat] || T.cat.psico;
  const disabled = count === 0;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card,
        borderLeft: `3px solid ${k.solid}`, display: 'flex', alignItems: 'center', gap: 12,
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.55 : 1,
      }}
    >
      <CatIcon cat={c.cat} icon={c.icon} size={42} rounded={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14.5, color: T.ink, letterSpacing: -0.2 }}>{c.title}</div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 2, lineHeight: 1.35 }}>{c.desc}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
          <Pill bg={k.soft} fg={k.ink}>{count} preguntes</Pill>
          {c.minutes ? <Pill bg={T.bg} fg={T.inkMuted}>{c.minutes} min</Pill> : null}
        </div>
      </div>
      <Icon name="chevron-right" size={18} color={T.inkMuted} />
    </div>
  );
}

export default function ScreenPsicotecnics() {
  const navigate = useNavigate();
  const { psicoCategories = [], psicoQuestions = {}, meta } = useContent();

  const totalQuestions = psicoCategories.reduce(
    (sum, c) => sum + (psicoQuestions[c.id]?.length || 0), 0,
  );

  return (
    <div className="screen" style={{ background: T.bg }}>
      <StatusBar />

      <div style={{ padding: '6px 16px 14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button onClick={() => navigate('/academia')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 4 }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.psico.ink, marginBottom: 4 }}>Acadèmia · Aptituds</div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0, lineHeight: 1.05 }}>Psicotècnics</h1>
          <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 4 }}>
            {psicoCategories.length} categories · {totalQuestions} preguntes
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {psicoCategories.map(c => (
          <CategoryRow
            key={c.id}
            c={c}
            count={psicoQuestions[c.id]?.length || 0}
            onClick={() => navigate(`/academia/psicotecnics/${c.id}`)}
          />
        ))}
      </div>

      {psicoCategories.length === 0 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 18, boxShadow: T.shadow.card, fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>
            Encara no s'ha descarregat el contingut de psicotècnics. Comprova la connexió i torna-ho a provar des del teu perfil.
          </div>
        </div>
      )}

      <div style={{ padding: '18px 16px 0', fontSize: 11, color: T.inkFaint, textAlign: 'center' }}>
        Contingut v{meta.version}{meta.updatedAt ? ` · ${meta.updatedAt}` : ''}
      </div>
    </div>
  );
}
