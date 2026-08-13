import { T } from '../tokens';
import Icon from './Icon';
import { useContent } from '../content/ContentProvider';

function statusInfo(meta) {
  switch (meta.status) {
    case 'checking':
      return { label: 'Comprovant actualitzacions…', cat: 'operativa', icon: 'clock' };
    case 'updated':
      return { label: 'Contingut actualitzat', cat: 'atajos', icon: 'check' };
    case 'current':
      return { label: 'Tens l\'última versió', cat: 'atajos', icon: 'check' };
    case 'error':
      return { label: meta.error || 'Sense connexió', cat: 'alcohol', icon: 'x' };
    default:
      return { label: 'Pendent de comprovar', cat: 'psico', icon: 'bell' };
  }
}

function formatChecked(ts) {
  if (!ts) return 'mai';
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const hh = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  return sameDay ? `avui ${hh}` : `${d.getDate()}/${d.getMonth() + 1} ${hh}`;
}

/**
 * Targeta d'estat del contingut: mostra la versió que té el dispositiu i
 * permet forçar la descàrrega de contingut nou sense actualitzar l'app.
 */
export default function ContentCard() {
  const { meta, refresh } = useContent();
  const s = statusInfo(meta);
  const k = T.cat[s.cat];
  const busy = meta.status === 'checking';

  return (
    <div style={{ background: '#fff', borderRadius: T.r.lg, boxShadow: T.shadow.card, padding: 14, borderLeft: `3px solid ${k.solid}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: k.soft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name={s.icon} size={17} color={k.ink} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: T.ink }}>Contingut de l'app</div>
          <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 1 }}>
            Versió {meta.version}{meta.updatedAt ? ` · ${meta.updatedAt}` : ''}
            {meta.isRemote ? ' · descarregat' : ' · inclòs a l\'app'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, fontSize: 11.5, color: k.ink, fontWeight: 600 }}>
          {s.label}
          <span style={{ color: T.inkFaint, fontWeight: 500 }}> · comprovat {formatChecked(meta.checkedAt)}</span>
        </div>
        <button
          onClick={() => refresh({ force: true })}
          disabled={busy}
          style={{
            border: 'none', background: busy ? T.bg : k.solid, color: busy ? T.inkMuted : '#fff',
            borderRadius: 999, padding: '8px 14px', fontFamily: T.font, fontWeight: 800, fontSize: 12,
            letterSpacing: 0.3, cursor: busy ? 'default' : 'pointer', flexShrink: 0,
            boxShadow: busy ? 'none' : 'inset 0 -3px 0 rgba(0,0,0,0.16)',
          }}
        >
          {busy ? 'Comprovant…' : 'Actualitzar'}
        </button>
      </div>
    </div>
  );
}
