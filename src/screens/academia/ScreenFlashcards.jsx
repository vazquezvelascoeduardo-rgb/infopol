import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, ProgressBar, Pill, DuoButton } from '../../components/Shared';
import { useContent } from '../../content/ContentProvider';

const RATINGS = [
  { cat: 'alcohol', label: 'Malament', sub: '<1d' },
  { cat: 'psico', label: 'Difícil', sub: '2d' },
  { cat: 'tests', label: 'Bé', sub: '5d' },
  { cat: 'atajos', label: 'Fàcil', sub: '14d' },
];

export default function ScreenFlashcards() {
  const navigate = useNavigate();
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState([]);
  const { flashcards: FLASHCARDS = [] } = useContent();

  const total = FLASHCARDS.length;
  const card = total > 0 ? FLASHCARDS[cardIdx % total] : null;
  const pct = total > 0 ? (cardIdx / total) * 100 : 0;

  const handleRating = () => {
    setDone(d => [...d, cardIdx]);
    setFlipped(false);
    if (cardIdx + 1 >= total) {
      navigate('/academia');
    } else {
      setCardIdx(i => i + 1);
    }
  };

  if (!card) {
    return (
      <div className="screen" style={{ background: T.bg }}>
        <StatusBar />
        <div style={{ padding: '6px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/academia')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="x" size={18} color={T.ink} />
          </button>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.5, margin: 0 }}>Flashcards</h1>
        </div>
        <div style={{ padding: '10px 16px' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 18, boxShadow: T.shadow.card, fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>
            Encara no hi ha cartes publicades. Apareixeran quan s'actualitzi el contingut.
          </div>
        </div>
      </div>
    );
  }

  const catK = T.cat[card.cat] || T.cat.leyes;

  return (
    <div className="screen" style={{ background: T.bg }}>
      <StatusBar />
      <div style={{ padding: '6px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate('/academia')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <Icon name="x" size={18} color={T.ink} />
        </button>
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.academia.ink }}>Repàs espaiat · {cardIdx + 1}/{total}</div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.5, margin: 0 }}>Flashcards</h1>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <ProgressBar value={pct} color={T.cat.academia.solid} />
      </div>

      {/* card stack */}
      <div style={{ padding: '20px 16px 0', position: 'relative', height: 340 }}>
        {/* background stubs */}
        <div style={{ position: 'absolute', top: 28, left: 26, right: 26, bottom: 20, background: '#fff', borderRadius: T.r.xl, boxShadow: T.shadow.card, transform: 'rotate(-3deg)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 14, left: 20, right: 20, bottom: 14, background: '#fff', borderRadius: T.r.xl, boxShadow: T.shadow.card, transform: 'rotate(2deg)', opacity: 0.8 }} />

        {/* main card */}
        <div onClick={() => setFlipped(f => !f)} style={{ position: 'absolute', top: 0, left: 8, right: 8, bottom: 10, background: '#fff', borderRadius: T.r.xl, padding: 22, boxShadow: T.shadow.pop, borderTop: `4px solid ${catK.solid}`, display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Pill bg={catK.soft} fg={catK.ink}>{card.tema}</Pill>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, fontFamily: T.fontMono }}>{cardIdx + 1}/{total}</span>
          </div>

          {!flipped ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Pregunta</div>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: -0.4, lineHeight: 1.25, color: T.ink, flex: 1 }}>{card.question}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.inkMuted, fontSize: 12, fontWeight: 600, marginTop: 12 }}>
                <Icon name="eye" size={14} color={T.inkMuted} /> Toca per girar la carta
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: catK.ink, marginBottom: 8 }}>Resposta</div>
              <div style={{ fontSize: 15, lineHeight: 1.55, color: T.ink, flex: 1 }}>{card.answer}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.inkMuted, fontSize: 12, fontWeight: 600, marginTop: 12 }}>
                <Icon name="eye" size={14} color={T.inkMuted} /> Toca per tornar a la pregunta
              </div>
            </>
          )}
        </div>
      </div>

      {/* rating buttons */}
      {flipped && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8, textAlign: 'center' }}>Com ho recordes?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {RATINGS.map(r => {
              const k = T.cat[r.cat];
              return (
                <button key={r.label} onClick={handleRating} style={{ background: '#fff', border: `2px solid ${k.soft}`, borderRadius: 12, padding: '10px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11.5, color: k.ink }}>{r.label}</span>
                  <span style={{ fontSize: 10, color: T.inkMuted, fontWeight: 600, fontFamily: T.fontMono }}>{r.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!flipped && cardIdx > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ background: T.cat.academia.soft, borderRadius: T.r.md, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="check" size={16} color={T.cat.academia.ink} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.cat.academia.ink }}>{cardIdx} cartes repassades — continua!</span>
          </div>
        </div>
      )}
    </div>
  );
}
