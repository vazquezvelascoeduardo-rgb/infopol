import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, CatIcon, Pill, ProgressBar } from '../../components/Shared';
import { useContent } from '../../content/ContentProvider';

function Block({ b, k }) {
  return (
    <div style={{ marginTop: 12 }}>
      {b.h && (
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: k.ink, marginBottom: 5 }}>{b.h}</div>
      )}
      {b.p && (
        <div style={{ fontSize: 13, lineHeight: 1.55, color: T.inkSoft }}>{b.p}</div>
      )}
      {Array.isArray(b.list) && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {b.list.map((item, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.5, color: T.inkSoft }}>{item}</li>
          ))}
        </ul>
      )}
      {b.note && (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, background: T.cat.psico.soft, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="bolt" size={16} color={T.cat.psico.ink} />
          <div style={{ fontSize: 12, color: T.cat.psico.ink, lineHeight: 1.45, fontWeight: 600 }}>{b.note}</div>
        </div>
      )}
    </div>
  );
}

function Lesson({ lesson, k, open, onToggle }) {
  return (
    <div style={{ background: '#fff', borderRadius: T.r.lg, boxShadow: T.shadow.card, borderLeft: `3px solid ${k.solid}`, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14, color: T.ink, letterSpacing: -0.2, lineHeight: 1.3 }}>{lesson.title}</div>
          {lesson.summary && (
            <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.35 }}>{lesson.summary}</div>
          )}
          {lesson.minutes ? (
            <div style={{ marginTop: 7 }}><Pill bg={T.bg} fg={T.inkMuted}>{lesson.minutes} min</Pill></div>
          ) : null}
        </div>
        <Icon name={open ? 'chevron-down' : 'chevron-right'} size={18} color={T.inkMuted} />
      </div>
      {open && (
        <div style={{ padding: '0 14px 16px', borderTop: `1px solid ${T.hairline}` }}>
          {(lesson.blocks || []).map((b, i) => <Block key={i} b={b} k={k} />)}
        </div>
      )}
    </div>
  );
}

export default function ScreenTemaDetall() {
  const navigate = useNavigate();
  const { temaId } = useParams();
  const { temes = [], temari = {} } = useContent();
  const [openId, setOpenId] = useState(null);

  const tema = temes.find(t => String(t.id) === String(temaId));
  const detail = temari[temaId] || temari[Number(temaId)] || null;
  const lessons = detail?.lessons || [];
  const k = T.cat[tema?.cat] || T.cat.academia;
  const pct = tema && tema.lessons > 0 ? Math.round((tema.done / tema.lessons) * 100) : 0;

  return (
    <div className="screen" style={{ background: T.bg }}>
      <StatusBar />

      <div style={{ padding: '6px 16px 14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button onClick={() => navigate('/academia/temari')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 4 }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: k.ink, marginBottom: 4 }}>Bloc {temaId}</div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.5, margin: 0, lineHeight: 1.15 }}>
            {tema?.title || 'Tema'}
          </h1>
        </div>
      </div>

      {tema && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, display: 'flex', alignItems: 'center', gap: 12 }}>
            <CatIcon cat={tema.cat} icon={tema.icon} size={40} rounded={12} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: T.inkMuted }}>{tema.done}/{tema.lessons} lliçons · {lessons.length} publicades</div>
              <div style={{ marginTop: 7 }}><ProgressBar value={pct} color={k.solid} height={6} /></div>
            </div>
          </div>
        </div>
      )}

      {detail?.intro && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.5 }}>{detail.intro}</div>
        </div>
      )}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lessons.map(l => (
          <Lesson
            key={l.id}
            lesson={l}
            k={k}
            open={openId === l.id}
            onToggle={() => setOpenId(id => (id === l.id ? null : l.id))}
          />
        ))}
      </div>

      {lessons.length === 0 && (
        <div style={{ padding: '10px 16px' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 18, boxShadow: T.shadow.card, fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>
            Aquest bloc encara no té lliçons publicades. Apareixeran automàticament quan s'actualitzi el contingut, sense haver d'actualitzar l'app.
          </div>
        </div>
      )}
    </div>
  );
}
