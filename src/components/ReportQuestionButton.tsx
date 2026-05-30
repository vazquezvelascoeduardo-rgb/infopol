// Botó "Informar d'un error" per a una pregunta de test.
// En clicar, desplega un petit formulari amb un comentari opcional i
// envia el report a Supabase (revisable des del dashboard / MCP). Si el
// backend no està actiu o falla, ofereix un enllaç mailto de reserva.
import { useState } from 'react';
import {
  submitQuestionReport,
  buildReportMailto,
  type QuestionReportInput,
} from '../lib/reportQuestion';

type Phase = 'idle' | 'form' | 'sending' | 'done' | 'mailto';

export default function ReportQuestionButton(props: QuestionReportInput) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [reason, setReason] = useState('');

  async function send() {
    setPhase('sending');
    const ok = await submitQuestionReport({ ...props, reason });
    setPhase(ok ? 'done' : 'mailto');
  }

  if (phase === 'done') {
    return (
      <div className="rep-msg ok">✓ Gràcies! Ho revisarem ben aviat.</div>
    );
  }

  if (phase === 'idle') {
    return (
      <button type="button" className="rep-btn" onClick={() => setPhase('form')}>
        ⚠️ Informar d'un error
      </button>
    );
  }

  return (
    <div className="rep-box">
      <label className="rep-label" htmlFor={`rep-${props.questionId}`}>
        Què hi ha malament? (opcional)
      </label>
      <textarea
        id={`rep-${props.questionId}`}
        className="rep-area"
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Ex: la resposta correcta hauria de ser…"
        disabled={phase === 'sending'}
      />
      {phase === 'mailto' ? (
        <div className="rep-msg err">
          No s'ha pogut enviar automàticament.{' '}
          <a href={buildReportMailto({ ...props, reason })}>Envia'l per correu →</a>
        </div>
      ) : null}
      <div className="rep-actions">
        <button
          type="button"
          className="rep-btn primary"
          onClick={send}
          disabled={phase === 'sending'}
        >
          {phase === 'sending' ? 'Enviant…' : 'Enviar report'}
        </button>
        <button
          type="button"
          className="rep-btn ghost"
          onClick={() => setPhase('idle')}
          disabled={phase === 'sending'}
        >
          Cancel·la
        </button>
      </div>
    </div>
  );
}
