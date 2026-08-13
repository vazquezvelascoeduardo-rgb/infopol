import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, ProgressBar, CatIcon } from '../../components/Shared';
import { useContent } from '../../content/ContentProvider';

const SEXE_OPTIONS = ['Home', 'Dona'];
const EDAT_RANGES = ['18–30 anys', '31–40 anys'];

const USER_MARKS = {
  'course-navette': { H: { '18–30': 9.2, '31–40': 8.5 }, D: { '18–30': 7.8, '31–40': 7.0 } },
  'circuit-agilitat': { H: { '18–30': 11.4, '31–40': 12.1 }, D: { '18–30': 14.1, '31–40': 14.8 } },
  'press-banca': { H: { '18–30': 22, '31–40': 18 }, D: { '18–30': 12, '31–40': 10 } },
  'salt-horitzontal': { H: { '18–30': 1.72, '31–40': 1.85 }, D: { '18–30': 1.72, '31–40': 1.55 } },
};

function PhysicRow({ test, sexe, edatKey, edatLabel }) {
  const mark = (USER_MARKS[test.id]?.[sexe]?.[edatKey]) ?? 0;
  const minKey = `${sexe === 'Home' ? 'H' : 'D'}_${edatKey.replace('–', '_')}`;
  const minInfo = test.minimums[minKey] || Object.values(test.minimums)[0];
  const isInverse = minInfo?.inverse;
  const passes = isInverse ? mark <= minInfo.min : mark >= minInfo.min;
  const k = passes ? T.cat.physical : T.cat.alcohol;
  const pct = isInverse
    ? Math.max(0, Math.min(100, (minInfo.min / mark) * 100))
    : Math.max(0, Math.min(100, (mark / (minInfo.min * 1.3)) * 100));

  const ratingStars = passes ? (pct > 90 ? '★★★★★' : pct > 75 ? '★★★★' : '★★★') : '';

  return (
    <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, borderLeft: `3px solid ${k.solid}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CatIcon cat={passes ? 'physical' : 'alcohol'} icon={test.icon} size={36} rounded={10} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: T.ink }}>{test.name}</div>
          <div style={{ fontSize: 11, color: k.ink, marginTop: 1, fontWeight: 700 }}>
            {passes ? `Apte ${ratingStars}` : 'No apte — Millora necessària'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: -0.4, color: T.ink, lineHeight: 1 }}>{mark}</div>
          <div style={{ fontSize: 10, color: T.inkMuted, fontWeight: 600 }}>{test.unit}</div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <ProgressBar value={pct} color={k.solid} height={5} />
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: T.inkMuted }}>
        Mínim: <b style={{ color: T.ink }}>{minInfo?.min} {test.unit}</b>
      </div>
    </div>
  );
}

export default function ScreenFisiques() {
  const [sexe, setSexe] = useState('Home');
  const [edat, setEdat] = useState('18–30 anys');
  const { physicalTests: PHYSICAL_TESTS = [] } = useContent();
  const edatKey = edat.replace(' anys', '');
  const sexeKey = sexe === 'Home' ? 'H' : 'D';

  const passedCount = PHYSICAL_TESTS.filter(test => {
    const mark = USER_MARKS[test.id]?.[sexeKey]?.[edatKey] ?? 0;
    const minKey = `${sexeKey}_${edatKey.replace('–', '_')}`;
    const minInfo = test.minimums[minKey] || Object.values(test.minimums)[0];
    return minInfo?.inverse ? mark <= minInfo.min : mark >= minInfo.min;
  }).length;

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.physical.ink, marginBottom: 4 }}>Proves físiques · Mossos</div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>Calculadora de marques</h1>
      </div>

      {/* selectors */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Sexe</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {SEXE_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setSexe(opt)} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 12, background: sexe === opt ? T.cat.physical.solid : T.bg, color: sexe === opt ? '#fff' : T.inkSoft, boxShadow: sexe === opt ? 'inset 0 -2px 0 rgba(0,0,0,0.15)' : 'none' }}>{opt}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Edat</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {EDAT_RANGES.map(opt => (
                <button key={opt} onClick={() => setEdat(opt)} style={{ flex: 1, padding: '7px 2px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 11, background: edat === opt ? T.cat.physical.solid : T.bg, color: edat === opt ? '#fff' : T.inkSoft, boxShadow: edat === opt ? 'inset 0 -2px 0 rgba(0,0,0,0.15)' : 'none' }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* tests */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PHYSICAL_TESTS.map(test => (
          <PhysicRow key={test.id} test={test} sexe={sexe} edatKey={edatKey} edatLabel={edat} />
        ))}
      </div>

      {/* summary */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ background: passedCount >= 3 ? T.cat.physical.soft : T.cat.alcohol.soft, borderRadius: T.r.md, padding: 14, display: 'flex', gap: 10 }}>
          <Icon name="bolt" size={20} color={passedCount >= 3 ? T.cat.physical.ink : T.cat.alcohol.ink} />
          <div style={{ fontSize: 12.5, color: passedCount >= 3 ? T.cat.physical.ink : T.cat.alcohol.ink, lineHeight: 1.4, fontWeight: 600 }}>
            <b>Estimació actual:</b> {passedCount}/{PHYSICAL_TESTS.length} proves aptes.{' '}
            {passedCount < PHYSICAL_TESTS.length
              ? 'Treballa les proves pendents per arribar a la qualificació mínima.'
              : 'Estàs preparat per als físics dels Mossos. Excel·lent!'}
          </div>
        </div>
      </div>
    </div>
  );
}
