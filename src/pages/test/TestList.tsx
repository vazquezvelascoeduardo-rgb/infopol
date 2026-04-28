// Llistat dels temes de test disponibles.
import { Link } from 'react-router-dom';
import { TOPICS, getAllQuestions } from '../../data/tests';
import { useTopicProgress } from '../../lib/testProgress';
import { useT } from '../../lib/i18n';

export default function TestList() {
  const { t } = useT();

  const totalQuestions = getAllQuestions().length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('test.list.title')}</span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-blue-200/70 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0e2244] dark:to-[#0f1d34]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-3xl text-white shadow-inner">
            📝
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-blue-700 dark:text-blue-400/90">
              {t('test.list.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('test.list.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('test.list.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <ul className="space-y-3">
        {TOPICS.map((topic) => (
          <TopicCard key={topic.slug} slug={topic.slug} icon={topic.icon}
            accent={topic.accent} title={topic.title}
            description={topic.description} total={topic.questions.length} />
        ))}

        {/* Mode 'tots els temes' */}
        <li>
          <Link
            to="/test/tot"
            className="group block rounded-2xl border p-5 transition
              border-purple-200/70 bg-gradient-to-br from-purple-50/60 via-white to-fuchsia-50/40
              hover:border-purple-400/60 hover:shadow-md
              dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a0f2e] dark:to-[#0a1628]
              dark:hover:border-purple-400/40"
          >
            <div className="flex items-center gap-4">
              <span aria-hidden className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 text-2xl text-white shadow-inner">
                🎲
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base">{t('test.list.allMixed')}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('test.list.allMixedDesc').replace('{n}', String(totalQuestions))}
                </div>
              </div>
              <span className="shrink-0 text-purple-700 dark:text-purple-400 text-sm font-semibold inline-flex items-center gap-1">
                <span className="hidden sm:inline">{t('test.start')}</span>
                <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

function TopicCard({
  slug, icon, accent, title, description, total,
}: {
  slug: string; icon: string; accent: string;
  title: string; description?: string; total: number;
}) {
  const { t } = useT();
  const { answeredCount } = useTopicProgress(slug);
  const remaining = total - answeredCount;
  const progress = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <li>
      <Link
        to={`/test/${slug}`}
        className="group relative block overflow-hidden rounded-2xl border p-5 transition
          border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md
          dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40"
      >
        <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
        <div className="flex items-center gap-4">
          <span aria-hidden className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-2xl text-white shadow-inner`}>
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-base">{title}</div>
            {description && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {description}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="font-mono text-slate-600 dark:text-slate-300">
                {answeredCount} / {total}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${accent} transition-all`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {remaining > 0 ? `${remaining} ${t('test.list.remaining')}` : `✓ ${t('test.list.allDone')}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
