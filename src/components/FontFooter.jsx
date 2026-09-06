import { T } from '../tokens';
import { FONT } from '../data/infractions';

/** Peu de font i avís legal. Obligatori a tota pantalla que mostri el catàleg. */
export default function FontFooter({ compact = false }) {
  return (
    <div style={{ padding: compact ? '12px 0 0' : '18px 16px 8px' }}>
      <div style={{ background: '#fff', borderRadius: T.r.md, padding: 12, boxShadow: T.shadow.card }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: T.inkMuted }}>
          Font
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginTop: 3 }}>
          {FONT.entitat} — «{FONT.document}», {FONT.versioLabel}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 6, lineHeight: 1.5 }}>
          {FONT.notaFont}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 6, lineHeight: 1.5 }}>
          {FONT.avisLegal}
        </div>
      </div>
    </div>
  );
}
