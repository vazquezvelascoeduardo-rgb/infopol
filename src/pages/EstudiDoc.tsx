// Mode estudi — el lector d'una fitxa, amb subratllats.
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import LectorEstudi from '../components/LectorEstudi';
import { useAuth } from '../lib/auth';
import { MODULES, getCard, pickBody } from '../lib/content';
import { normalitzaCos } from '../lib/estudi-cos';
import { mdToHtml } from '../lib/markdown';
import { I, TitolV, V } from '../lib/v3';

export default function EstudiDoc() {
  const { moduleSlug = '', slug = '' } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const card = getCard(moduleSlug, slug);
  const modul = MODULES.find((m) => m.slug === moduleSlug);

  const html = useMemo(() => {
    if (!card) return '';
    const { body } = pickBody(card, 'ca');
    const brut = card.kind === 'md' ? mdToHtml(body) : body;
    return normalitzaCos(brut);
  }, [card]);

  if (!card) {
    return (
      <div className="v3-page v3-anim">
        <TitolV fort="Fitxa" post="no trobada" />
        <Link to="/estudi" style={{ fontSize: 14, fontWeight: 700 }}>Torna a l'índex</Link>
      </div>
    );
  }

  return (
    <div className="v3-page v3-anim">
      <button
        type="button"
        onClick={() => nav(`/estudi/${moduleSlug}`)}
        style={{
          border: 'none', background: 'transparent', color: V.muted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, padding: 0, marginBottom: 14,
          fontSize: 13, fontWeight: 600,
        }}>
        <I n="back" size={15} sw={2.2} /> {modul?.title ?? 'Enrere'}
      </button>

      <h1 style={{
        fontSize: 'clamp(24px,3.2vw,32px)', fontWeight: 800, letterSpacing: -1.2,
        lineHeight: 1.12, margin: '0 0 20px', color: V.ink, maxWidth: 720,
      }}>
        {card.title}
      </h1>

      <LectorEstudi
        doc={`${moduleSlug}/${slug}`}
        html={html}
        senseSessio={!user}
      />
    </div>
  );
}
