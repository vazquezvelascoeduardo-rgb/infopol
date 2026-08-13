import { useMemo, useState } from 'react';
import { T } from '../tokens';
import Icon from './Icon';
import { StatusBar, ProgressBar, Streak, DuoButton } from './Shared';

const LABELS = ['A', 'B', 'C', 'D', 'E'];

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

function Summary({ correct, total, xp, cat, onRestart, onExit }) {
  const k = T.cat[cat] || T.cat.academia;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= 50;
  return (
    <div style={{ padding: '24px 16px 0' }}>
      <div style={{ background: '#fff', borderRadius: T.r.xl, padding: 24, boxShadow: T.shadow.card, textAlign: 'center', borderTop: `4px solid ${k.solid}` }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: passed ? T.cat.atajos.solid : T.cat.alcohol.solid, display: 'grid', placeItems: 'center', margin: '0 auto 14px', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.18)' }}>
          <Icon name={passed ? 'trophy' : 'flag'} size={30} color="#fff" strokeWidth={2.2} />
        </div>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6 }}>{pct}%</div>
        <div style={{ fontSize: 13, color: T.inkMuted, marginTop: 2 }}>{correct} de {total} correctes</div>
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <span style={{ background: k.soft, color: k.ink, borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 800 }}>+{xp} XP</span>
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <DuoButton color={cat} full leftIcon="play" onClick={onRestart}>Tornar-hi</DuoButton>
        <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: T.inkMuted, fontFamily: T.font, fontWeight: 700, fontSize: 13, padding: 10, cursor: 'pointer' }}>Sortir</button>
      </div>
    </div>
  );
}

/**
 * Motor de tests reutilitzable. Serveix tant per als tests del temari com per
 * als psicotècnics: només canvia el joc de preguntes que rep.
 */
export default function TestRunner({
  questions = [],
  kicker,
  cat = 'academia',
  timeLabel,
  streak,
  onExit,
  emptyMessage = 'Encara no hi ha preguntes disponibles en aquesta secció.',
}) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const q = questions[qIdx];
  const answered = selected !== null;
  const k = useMemo(() => T.cat[cat] || T.cat.academia, [cat]);

  if (total === 0) {
    return (
      <div className="screen" style={{ background: T.bg }}>
        <StatusBar />
        <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onExit} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{kicker}</div>
        </div>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 18, boxShadow: T.shadow.card, fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>
            {emptyMessage}
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correct) {
      setCorrect(c => c + 1);
      setXp(x => x + (q.xp || 10));
    }
  };

  const handleNext = () => {
    setSelected(null);
    if (qIdx + 1 >= total) setDone(true);
    else setQIdx(i => i + 1);
  };

  const restart = () => {
    setQIdx(0); setSelected(null); setCorrect(0); setXp(0); setDone(false);
  };

  if (done) {
    return (
      <div className="screen" style={{ background: T.bg }}>
        <StatusBar />
        <Summary correct={correct} total={total} xp={xp} cat={cat} onRestart={restart} onExit={onExit} />
      </div>
    );
  }

  const isCorrectAnswer = selected === q.correct;

  return (
    <div className="screen" style={{ background: T.bg }}>
      <StatusBar />

      {/* exam top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 12px' }}>
        <button onClick={onExit} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <Icon name="x" size={18} color={T.ink} />
        </button>
        <div style={{ flex: 1, padding: '0 12px' }}>
          <ProgressBar value={((qIdx + 1) / total) * 100} color={k.solid} height={10} />
        </div>
        {timeLabel && (
          <div style={{ background: '#fff', borderRadius: 999, padding: '6px 12px', boxShadow: T.shadow.card, display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.fontMono, fontWeight: 800, fontSize: 12, color: T.cat.alcohol.solid }}>
            <Icon name="clock" size={13} color={T.cat.alcohol.solid} /> {timeLabel}
          </div>
        )}
      </div>

      {/* counter */}
      <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {streak != null && <Streak n={streak} />}
          <span style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Pregunta {qIdx + 1}/{total}</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.cat.atajos.solid }}>{correct} correctes ✓</div>
      </div>

      {/* question */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 18, boxShadow: T.shadow.card, borderTop: `3px solid ${k.solid}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: k.ink, marginBottom: 8 }}>{q.temaTitle || kicker}</div>
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
          return <Option key={i} label={LABELS[i]} text={opt} state={state} onClick={() => handleSelect(i)} />;
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
                {isCorrectAnswer ? `Excel·lent! +${q.xp || 10} XP` : 'Incorrecte'}
              </div>
              <div style={{ fontSize: 12, color: isCorrectAnswer ? T.cat.atajos.ink : T.cat.alcohol.ink, marginTop: 2, lineHeight: 1.4, opacity: 0.9 }}>{q.explanation}</div>
            </div>
          </div>
        </div>
      )}

      {answered && (
        <div style={{ padding: '14px 16px 0' }}>
          <DuoButton color={cat} full leftIcon="arrow-right" onClick={handleNext}>
            {qIdx + 1 < total ? 'Següent' : 'Finalitzar'}
          </DuoButton>
        </div>
      )}
    </div>
  );
}
