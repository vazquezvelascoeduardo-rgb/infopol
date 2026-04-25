// Pàgina interactiva de Trànsit (Operativa).
// Recorre l'arbre TRAFICO_TREE: a cada nivell mostra les opcions com a
// targetes seleccionables. Quan s'arriba a una fulla, es mostra el
// resultat amb la norma, article, multa, punts, etc.
//
// L'estat de la selecció s'expressa a la URL com a "trail" de IDs
// separats per "/" (p. ex. /operativa/trafico/alcoholemia/alc-penal).
// Així es pot tornar amb el botó del navegador i compartir l'enllaç.
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TRAFICO_TREE, type Bilingual, type TraficNode, type TraficSeverity } from '../../lib/operativa-trafico';
import { useT, type Locale } from '../../lib/i18n';

function pickB(b: Bilingual, locale: Locale): string {
  return b[locale] ?? b.es ?? b.ca ?? '';
}

// Recorre l'arbre seguint un trail d'ids. Retorna { node, breadcrumb }.
function traverse(
  root: TraficNode,
  trail: string[],
): { node: TraficNode | null; breadcrumb: TraficNode[] } {
  const breadcrumb: TraficNode[] = [root];
  let cursor: TraficNode = root;
  for (const id of trail) {
    const next = cursor.children?.find((c) => c.id === id);
    if (!next) return { node: null, breadcrumb };
    breadcrumb.push(next);
    cursor = next;
  }
  return { node: cursor, breadcrumb };
}

export default function Trafico() {
  const params = useParams();
  const navigate = useNavigate();
  const { t, locale } = useT();

  // El paràmetre "*" captura la resta del path després de
  // /operativa/trafico/...
  const rest = params['*'] ?? '';
  const trail = rest.split('/').filter(Boolean);
  const { node, breadcrumb } = traverse(TRAFICO_TREE, trail);

  // Construïm les URLs incrementals per al breadcrumb.
  function urlForCrumbIndex(idx: number): string {
    const sub = breadcrumb.slice(1, idx + 1).map((n) => n.id);
    return sub.length === 0
      ? '/operativa/trafico'
      : `/operativa/trafico/${sub.join('/')}`;
  }

  if (!node) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">
          {t('trafico.notFound')}
        </p>
        <Link to="/operativa/trafico" className="text-blue-600 dark:text-blue-400 underline">
          {t('trafico.startOver')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span aria-hidden>/</span>
        {breadcrumb.map((n, i) => {
          const last = i === breadcrumb.length - 1;
          const label = i === 0 ? t('operativa.trafico.title') : pickB(n.label, locale);
          return (
            <span key={n.id} className="flex items-center gap-1">
              {last ? (
                <span className="text-slate-700 dark:text-slate-200 font-medium">{label}</span>
              ) : (
                <Link to={urlForCrumbIndex(i)} className="hover:underline">{label}</Link>
              )}
              {!last && <span aria-hidden>/</span>}
            </span>
          );
        })}
      </nav>

      {/* Botó "tornar enrere" si no estem a l'arrel */}
      {trail.length > 0 && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition
            border-slate-200 hover:bg-slate-50 text-slate-700
            dark:border-white/10 dark:hover:bg-white/5 dark:text-slate-200"
        >
          <span aria-hidden>←</span> {t('trafico.back')}
        </button>
      )}

      {/* Si és FULLA: mostrem el resultat. */}
      {node.result ? (
        <ResultPanel node={node} locale={locale} />
      ) : (
        // Si NO és fulla: mostrem la pregunta i les opcions.
        <SelectionPanel node={node} locale={locale} trail={trail} />
      )}
    </div>
  );
}

function SelectionPanel({
  node,
  locale,
  trail,
}: {
  node: TraficNode;
  locale: Locale;
  trail: string[];
}) {
  const { t } = useT();
  const question = node.question
    ? pickB(node.question, locale)
    : t('trafico.selectOption');
  return (
    <>
      <header className="rounded-2xl border p-5 mb-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
          {t('operativa.trafico.title')}
        </div>
        <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight">
          {question}
        </h1>
        {node.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {pickB(node.description, locale)}
          </p>
        )}
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {node.children?.map((child) => {
          const childTrail = [...trail, child.id];
          const isLeaf = !child.children;
          return (
            <li key={child.id}>
              <Link
                to={`/operativa/trafico/${childTrail.join('/')}`}
                className="group flex items-start gap-3 rounded-xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
                  border-slate-200 bg-white hover:border-blue-400/60
                  dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
              >
                {child.icon && (
                  <span aria-hidden className="text-2xl shrink-0">{child.icon}</span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{pickB(child.label, locale)}</div>
                  {child.description && (
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {pickB(child.description, locale)}
                    </div>
                  )}
                  <div className="mt-2 text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {isLeaf ? t('trafico.viewResult') : t('trafico.continue')} →
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function ResultPanel({ node, locale }: { node: TraficNode; locale: Locale }) {
  const { t } = useT();
  const r = node.result!;
  const sev = severityStyle(r.severity);

  return (
    <article className="space-y-4">
      <header className="rounded-2xl border p-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className={`text-[11px] uppercase tracking-[0.25em] ${sev.label}`}>
          {t(`trafico.severity.${r.severity}`)}
        </div>
        <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight">
          {pickB(node.label, locale)}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {pickB(r.conduct, locale)}
        </p>
      </header>

      {/* Targetes amb les dades clau */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label={t('trafico.result.law')} value={r.law} icon="📕" />
        <Field label={t('trafico.result.article')} value={r.article} icon="§" />
        {r.fine && (
          <Field label={t('trafico.result.fine')} value={r.fine} icon="💶" highlight />
        )}
        {typeof r.points === 'number' && (
          <Field
            label={t('trafico.result.points')}
            value={`${r.points} ${t(r.points === 1 ? 'trafico.points.one' : 'trafico.points.other')}`}
            icon="🪪"
          />
        )}
      </div>

      {r.notes && (
        <div className="rounded-xl border-l-4 p-4
          border-l-amber-500 bg-amber-50 text-amber-900
          dark:bg-amber-400/10 dark:text-amber-200 dark:border-l-amber-400/70">
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-1">
            {t('trafico.result.notes')}
          </div>
          <div className="text-sm">{pickB(r.notes, locale)}</div>
        </div>
      )}

      {r.penal && (
        <div className="rounded-xl border-l-4 p-4
          border-l-red-500 bg-red-50 text-red-900
          dark:bg-red-400/10 dark:text-red-200 dark:border-l-red-400/70">
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-1">
            {t('trafico.result.penal')} · {r.penal.article}
          </div>
          <div className="text-sm">{pickB(r.penal.description, locale)}</div>
        </div>
      )}

      <div className="pt-2">
        <Link
          to="/operativa/trafico"
          className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold transition
            border-blue-400/60 text-blue-700 hover:bg-blue-50
            dark:border-blue-400/40 dark:text-blue-300 dark:hover:bg-blue-400/10"
        >
          ← {t('trafico.startOver')}
        </Link>
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4
      ${highlight
        ? 'border-amber-300 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-400/10'
        : 'border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f1d34]'}`}>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className="flex items-center gap-2 text-base font-semibold">
        {icon && <span aria-hidden className="text-lg">{icon}</span>}
        <span>{value}</span>
      </div>
    </div>
  );
}

function severityStyle(s: TraficSeverity): { label: string } {
  switch (s) {
    case 'leve':
      return { label: 'text-green-600 dark:text-green-400' };
    case 'grave':
      return { label: 'text-amber-600 dark:text-amber-400' };
    case 'muy-grave':
      return { label: 'text-red-600 dark:text-red-400' };
  }
}
