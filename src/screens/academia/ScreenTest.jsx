import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, ProgressBar, Streak, DuoButton } from '../../components/Shared';
import { TEST_QUESTIONS } from '../../data/academia';

function Option({ label, text, state, onClick }) {
  let bg = '#fff', fg = T.ink, border = T.hairline, badge = T.bg, badgeFg = T.inkSoft;
  let iconName = null;
  if (state === 'correct') { bg = T.cat.atajos.soft; fg = T.cat.atajos.ink; border = T.cat.atajos.solid; badge = T.cat.atajos.solid; badgeFg = '#fff'; iconName = 'check'; }
  if (state === 'wrong') { bg = T.cat.alcohol.soft; fg = T.cat.alcohol.ink; border = T.cat.alcohol.solid; badge = T.cat.alcohol.solid; badgeFg = '#fff'; iconName = 'x'; }
  return (
    <div onClick={onClick} style={{ background: bg, borderRadius: 14, padding: '14px', border: `2px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12, cursor: state === 'idle' ? 'pointer' : 'default', transition: 'all 0.15s' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: badge, color: badgeFg, display: 'grid', placeItems: 'center', fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, fontWeight: 700, fontSize: 14, color: fg, lineHeight: 1.35 }}>{text}</div>
      {iconName && <Icon name={iconName} size={18} color={fg} strokeWidth={2.4} />}
    </div>
  );
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function ScreenTest() {
  const navigate = useNavigate();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [timeLeft] = useState('47:12');

  const q = TEST_QUESTIONS[qIdx % TEST_QUESTIONS.length];
  const total = TEST_QUESTIONS.length;
  const answered = selected !== null;

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correct) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setQIdx(i => i + 1);
  };

  const isCorrectAnswer = selected === q.correct;

  return (
    <div className="screen" style={{ background: T.bg }}>
      <StatusBar />

      {/* exam top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 12px' }}>
        <button onClick={() => navigate('/academia')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <Icon name="x" size={18} color={T.ink} />
        </button>
        <div style={{ flex: 1, padding: '0 12px' }}>
          <ProgressBar value={((qIdx + 1) / total) * 100} color={T.cat.academia.solid} height={10} />
        </div>
        <div style={{ background: '#fff', borderRadius: 999, padding: '6px 12px', boxShadow: T.shadow.card, display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.fontMono, fontWeight: 800, fontSize: 12, color: T.cat.alcohol.solid }}>
          <Icon name="clock" size={13} color={T.cat.alcohol.solid} /> {timeLeft}
        </div>
      </div>

      {/* counter */}
      <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Streak n={23} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Pregunta {qIdx + 1}/{total}</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.cat.atajos.solid }}>{correct} correctes ✓</div>
      </div>

      {/* question */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 18, boxShadow: T.shadow.card, borderTop: `3px solid ${T.cat.tests.solid}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.tests.ink, marginBottom: 8 }}>{q.temaTitle}</div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 16, lineHeight: 1.4, color: T.ink, letterSpacing: -0.2 }}>{q.question}</div>
        </div>
      </div>

      {/* options */}
      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => {
          let state = 'idle';
          if (answered) {
            if (i === q.correct) state = 'correct';
            else if (i === selected) state = 'wrong';
          }
          return (
            <Option key={i} label={LABELS[i]} text={opt} state={answered ? state : 'idle'} onClick={() => handleSelect(i)} />
          );
        })}
      </div>

      {/* feedback */}
      {answered && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ background: isCorrectAnswer ? T.cat.atajos.soft : T.cat.alcohol.soft, borderRadius: T.r.md, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: isCorrectAnswer ? T.cat.atajos.solid : T.cat.alcohol.solid, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name={isCorrectAnswer ? 'check' : 'x'} size={18} color="#fff" strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: isCorrectAnswer ? T.cat.atajos.ink : T.cat.alcohol.ink }}>
                {isCorrectAnswer ? `Excel·lent! +${q.xp} XP` : 'Incorrecte'}
              </div>
              <div style={{ fontSize: 12, color: isCorrectAnswer ? T.cat.atajos.ink : T.cat.alcohol.ink, marginTop: 2, lineHeight: 1.4, opacity: 0.9 }}>{q.explanation}</div>
            </div>
          </div>
        </div>
      )}

      {answered && (
        <div style={{ padding: '14px 16px 0' }}>
          <DuoButton color="academia" full leftIcon="arrow-right" onClick={handleNext}>
            {qIdx + 1 < total ? 'Següent' : 'Finalitzar test'}
          </DuoButton>
        </div>
      )}
    </div>
  );
}
