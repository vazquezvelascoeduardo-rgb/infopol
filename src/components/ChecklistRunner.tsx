// Runner d'un checklist operatiu (arbre de decisió).
//
// Gestiona el recorregut pel graf de nodes: cada node intermedi mostra
// una llista d'opcions (botons grans, pensats per al mòbil); en clicar,
// avancem al node indicat per `va_a` i guardem l'historial.
//
// Quan arribem a un node final, mostrem una targeta amb el resultat:
// import, punts, pena, accions, document i base legal — amb colors
// diferents segons el `tipus`.
import { useEffect, useState } from 'react';
import {
  isFinalNode,
  type Checklist,
  type ChecklistFinalNode,
  type ChecklistNode,
  type ChecklistResultKind,
} from '../lib/operativa-trafico';
import { useT } from '../lib/i18n';

type Props = { checklist: Checklist };

export default function ChecklistRunner({ checklist }: Props) {
  const { t } = useT();
  // Pila d'IDs de nodes visitats. El darrer és l'actiu. Comença amb
  // `inici`. En clicar una opció, hi afegim el seu `va_a`. En clicar
  // "enrere", treiem el darrer.
  const [trail, setTrail] = useState<string[]>([checklist.inici]);

  // Si canvia el checklist (l'usuari va a un altre escenari) reiniciem.
  useEffect(() => {
    setTrail([checklist.inici]);
  }, [checklist.id, checklist.inici]);

  const currentId = trail[trail.length - 1];
  const node: ChecklistNode | undefined = checklist.nodes[currentId];

  // Detecció de referències trencades (millor mostrar un error clar).
  if (!node) {
    return (
      <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-4 text-red-900
        dark:bg-red-400/10 dark:text-red-200 dark:border-l-red-400/70">
        <div className="font-semibold">{t('checklist.brokenLink')}</div>
        <div className="text-sm mt-1">
          {t('checklist.brokenLinkDetail').replace('{id}', currentId)}
        </div>
        <button
          type="button"
          onClick={() => setTrail([checklist.inici])}
          className="mt-3 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold
            border-red-300 text-red-700 hover:bg-red-100
            dark:border-red-400/40 dark:text-red-200 dark:hover:bg-red-400/10"
        >
          ↻ {t('checklist.restart')}
        </button>
      </div>
    );
  }

  function goTo(id: string) {
    setTrail((prev) => [...prev, id]);
  }
  function goBack() {
    setTrail((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }
  function restart() {
    setTrail([checklist.inici]);
  }

  return (
    <div className="space-y-4">
      {/* Barra superior amb accions: enrere + reiniciar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          disabled={trail.length <= 1}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition
            border-slate-200 hover:bg-slate-50 text-slate-700
            dark:border-white/10 dark:hover:bg-white/5 dark:text-slate-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← {t('checklist.back')}
        </button>
        <button
          type="button"
          onClick={restart}
          disabled={trail.length === 1}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition
            border-slate-200 hover:bg-slate-50 text-slate-700
            dark:border-white/10 dark:hover:bg-white/5 dark:text-slate-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↻ {t('checklist.restart')}
        </button>
        {trail.length > 1 && (
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            {t('checklist.step').replace('{n}', String(trail.length))}
          </span>
        )}
      </div>

      {isFinalNode(node) ? (
        <FinalCard node={node} onRestart={restart} />
      ) : (
        <QuestionPanel node={node} onSelect={goTo} />
      )}
    </div>
  );
}

function QuestionPanel({
  node,
  onSelect,
}: {
  node: Exclude<ChecklistNode, ChecklistFinalNode>;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {/* Pregunta */}
      <header className="rounded-2xl border p-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        {node.titol && (
          <div className="text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
            {node.titol}
          </div>
        )}
        {node.text && (
          <h2 className="mt-1 text-lg sm:text-xl font-bold tracking-tight">
            {node.text}
          </h2>
        )}
        {node.info && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            ℹ️ {node.info}
          </p>
        )}
      </header>

      {/* Opcions (botons grans, mín. 50px alçada per a mòbil) */}
      <ul className="grid grid-cols-1 gap-2.5">
        {node.opcions.map((op, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onSelect(op.va_a)}
              className="w-full text-left flex items-center gap-3 rounded-xl border min-h-[56px] px-4 py-3 transition shadow-sm
                hover:-translate-y-0.5 hover:shadow-md
                border-slate-200 bg-white hover:border-blue-400/60
                dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
            >
              <span className="font-semibold flex-1">{op.etiqueta}</span>
              <span aria-hidden className="text-blue-600 dark:text-blue-400 text-xl">→</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function FinalCard({
  node,
  onRestart,
}: {
  node: ChecklistFinalNode;
  onRestart: () => void;
}) {
  const { t } = useT();
  const style = kindStyle(node.tipus);

  return (
    <article className={`rounded-2xl border-l-8 p-5 sm:p-6 shadow-sm space-y-4
      ${style.border} ${style.bg} ${style.text}`}>
      {/* Etiqueta del tipus + títol */}
      <header>
        <div className={`text-[11px] uppercase tracking-[0.25em] font-bold ${style.label}`}>
          {t(`checklist.kind.${node.tipus ?? 'procediment'}`)}
        </div>
        <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight">
          {node.titol}
        </h2>
        {node.text && (
          <p className="mt-2 text-sm opacity-90">{node.text}</p>
        )}
        {node.info && (
          <p className="mt-2 text-sm opacity-90">ℹ️ {node.info}</p>
        )}
      </header>

      {/* Camps clau en graella */}
      {(node.import || node.punts || node.pena) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {node.import && (
            <KeyField label={t('checklist.fine')} value={node.import} icon="💶" />
          )}
          {node.punts && (
            <KeyField label={t('checklist.points')} value={node.punts} icon="🪪" />
          )}
          {node.pena && (
            <KeyField label={t('checklist.penalty')} value={node.pena} icon="⚖️" wide />
          )}
        </div>
      )}

      {/* Acció única */}
      {node.accio && (
        <Section label={t('checklist.action')} icon="👉">
          <p>{node.accio}</p>
        </Section>
      )}

      {/* Llista d'accions */}
      {node.accions && node.accions.length > 0 && (
        <Section label={t('checklist.actions')} icon="🚓">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.accions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Requisits (per ex. negativa a proves) */}
      {node.requisits && node.requisits.length > 0 && (
        <Section label={t('checklist.requirements')} icon="✅">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.requisits.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Document a generar */}
      {node.document && (
        <Section label={t('checklist.document')} icon="📄">
          <p className="font-medium">{node.document}</p>
        </Section>
      )}

      {/* Base legal */}
      {node.base_legal && node.base_legal.length > 0 && (
        <Section label={t('checklist.legalBasis')} icon="📕">
          <ul className="flex flex-wrap gap-1.5">
            {node.base_legal.map((b, i) => (
              <li
                key={i}
                className="rounded-md border px-2 py-0.5 text-xs font-mono
                  border-current/40 bg-white/40 dark:bg-black/20"
              >
                {b}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* CTA */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold transition
            border-current/40 hover:bg-white/30 dark:hover:bg-black/20"
        >
          ↻ {t('checklist.startOver')}
        </button>
      </div>
    </article>
  );
}

function KeyField({
  label,
  value,
  icon,
  wide,
}: {
  label: string;
  value: string;
  icon?: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-white/60 dark:bg-black/20 p-3
      border-current/30 ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">{label}</div>
      <div className="flex items-center gap-2 text-base font-bold">
        {icon && <span aria-hidden className="text-lg">{icon}</span>}
        <span>{value}</span>
      </div>
    </div>
  );
}

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-1.5 flex items-center gap-1.5">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function kindStyle(kind: ChecklistResultKind | undefined) {
  switch (kind) {
    case 'ok':
      return {
        border: 'border-l-green-500 dark:border-l-green-400/70',
        bg: 'bg-green-50 dark:bg-green-400/10',
        text: 'text-green-900 dark:text-green-100',
        label: 'text-green-700 dark:text-green-300',
      };
    case 'administrativa':
      return {
        border: 'border-l-amber-500 dark:border-l-amber-400/70',
        bg: 'bg-amber-50 dark:bg-amber-400/10',
        text: 'text-amber-900 dark:text-amber-100',
        label: 'text-amber-700 dark:text-amber-300',
      };
    case 'penal':
      return {
        border: 'border-l-red-500 dark:border-l-red-400/70',
        bg: 'bg-red-50 dark:bg-red-400/10',
        text: 'text-red-900 dark:text-red-100',
        label: 'text-red-700 dark:text-red-300',
      };
    case 'procediment':
    default:
      return {
        border: 'border-l-blue-500 dark:border-l-blue-400/70',
        bg: 'bg-blue-50 dark:bg-blue-400/10',
        text: 'text-blue-900 dark:text-blue-100',
        label: 'text-blue-700 dark:text-blue-300',
      };
  }
}
