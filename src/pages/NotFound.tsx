// Pàgina 404 · Claude Design.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { A, Ic, Btn, Shell } from '../lib/design';

export default function NotFound() {
  const { t } = useT();
  return (
    <Shell max={560}>
      <div style={{ textAlign: 'center', padding: 'clamp(28px,6vw,60px) 0' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: A.terraSoft, display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <Ic name="warn" size={36} color={A.terraInk} />
        </div>
        <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(56px,12vw,84px)', letterSpacing: -3, color: A.ink, lineHeight: 1 }}>404</div>
        <p style={{ margin: '12px 0 24px', fontFamily: A.sans, fontSize: 16, color: A.inkSoft }}>{t('notFound.text')}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Btn icon="home">{t('back.home')}</Btn></Link>
        </div>
      </div>
    </Shell>
  );
}
