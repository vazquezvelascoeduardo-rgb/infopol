// Llistat dels temes de test disponibles + dashboard global de stats.
import { Link } from 'react-router-dom';
import { getTopicsByCategory } from '../../data/tests';
import {
  getTopicStats, globalAverage, levelFromBest, useGlobalStats, type Level,
} from '../../lib/testStats';
import { ACHIEVEMENTS } from '../../lib/achievements';
import { useT } from '../../lib/i18n';

const LEVEL_META: Record<Level, { icon: string; label: string; cls: string }> = {
  none:         { icon: '·',  label: 'Sense empezar', cls: 'text-slate-400 dark:text-slate-500' },
  novice:       { icon: '🌱', label: 'Principiant',   cls: 'text-emerald-600 dark:text-emerald-400' },
  intermediate: { icon: '📘', label: 'Intermedi',     cls: 'text-blue-600 dark:text-blue-400' },
  advanced:     { icon: '🎯', label: 'Avançat',       cls: 'text-amber-600 dark:text-amber-400' },
  expert:       { icon: '🏆', label: 'Expert',        cls: 'text-purple-600 dark:text-purple-400' },
};

export default function TestList() {
  const { t } = useT();

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

      {/* Dashboard d'estats globals */}
      <Dashboard />

      {/* TEMARI OFICIAL */}
      <SectionTitle icon="📚" label={t('test.list.section.temari')} />
      <ul className="space-y-3 mb-6">
        {getTopicsByCategory('temari').map((topic) => (
          <TopicCard key={topic.slug} slug={topic.slug} icon={topic.icon}
            accent={topic.accent} title={topic.title}
            description={topic.description} />
        ))}

        {/* Mode 'tots els temes' (només del temari) */}
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
                  {t('test.list.allMixedDescShort')}
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

      {/* CULTURA GENERAL — separat visualment */}
      {getTopicsByCategory('cultura').length > 0 && (
        <>
          <SectionTitle icon="🌍" label={t('test.list.section.cultura')} variant="cultura" />
          <ul className="space-y-3">
            {getTopicsByCategory('cultura').map((topic) => (
              <TopicCard key={topic.slug} slug={topic.slug} icon={topic.icon}
                accent={topic.accent} title={topic.title}
                description={topic.description} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function SectionTitle({
  icon, label, variant = 'temari',
}: { icon: string; label: string; variant?: 'temari' | 'cultura' }) {
  const cls = variant === 'cultura'
    ? 'from-slate-400 to-slate-600 dark:from-slate-300 dark:to-slate-500'
    : 'from-amber-400 to-amber-600 dark:from-amber-300 dark:to-amber-500';
  return (
    <div className="flex items-center gap-3 my-3">
      <span className={`h-5 w-1.5 rounded-full bg-gradient-to-b ${cls}`} />
      <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
        <span aria-hidden>{icon}</span>
        {label}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
    </div>
  );
}

function Dashboard() {
  const { t } = useT();
  const stats = useGlobalStats();
  const { attempts, avgGrade } = globalAverage(stats);
  const unlocked = stats.achievements.length;
  const totalAch = ACHIEVEMENTS.length;

  if (attempts === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-4 mb-5 text-center text-sm
        border-slate-300 bg-slate-50/60 text-slate-500
        dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
        💡 {t('test.dashboard.empty')}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-3 gap-2 mb-5">
      <div className="rounded-xl border p-3 text-center
        border-slate-200/80 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="text-xl" aria-hidden>📝</div>
        <div className="text-2xl font-black leading-none text-blue-700 dark:text-blue-400">
          {attempts}
        </div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
          {t('test.dashboard.attempts')}
        </div>
      </div>

      <div className="rounded-xl border p-3 text-center
        border-slate-200/80 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="text-xl" aria-hidden>📊</div>
        <div className="text-2xl font-black leading-none text-emerald-700 dark:text-emerald-400">
          {avgGrade.toFixed(1)}
        </div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
          {t('test.dashboard.avg')}
        </div>
      </div>

      <Link
        to="/test/logros"
        className="rounded-xl border p-3 transition text-center hover:shadow-md
          border-amber-200/70 bg-gradient-to-br from-amber-50 to-yellow-50
          dark:border-white/10 dark:from-[#2a210f] dark:to-[#0f1d34]"
      >
        <div className="text-xl" aria-hidden>🏅</div>
        <div className="text-2xl font-black leading-none text-amber-700 dark:text-amber-400">
          {unlocked}<span className="text-base font-bold opacity-50">/{totalAch}</span>
        </div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-700/70 dark:text-amber-400/70 mt-0.5">
          {t('test.dashboard.achievements')}
        </div>
      </Link>
    </section>
  );
}

function TopicCard({
  slug, icon, accent, title, description,
}: {
  slug: string; icon: string; accent: string;
  title: string; description?: string;
}) {
  const stats = getTopicStats(slug);
  const level = levelFromBest(stats?.best);
  const meta = LEVEL_META[level];

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
            <div className="mt-2 flex items-center gap-3 text-[11px]">
              {/* Nivell qualitatiu */}
              <span className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide ${meta.cls}`}>
                <span aria-hidden>{meta.icon}</span>
                <span>{meta.label}</span>
              </span>
              {stats && stats.attempts > 0 && (
                <>
                  <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    ⭐ {stats.best.toFixed(1)}
                  </span>
                  <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {stats.attempts} {stats.attempts === 1 ? 'test' : 'tests'}
                  </span>
                </>
              )}
            </div>
          </div>
          <span aria-hidden className="shrink-0 text-slate-400 group-hover:translate-x-1 transition">→</span>
        </div>
      </Link>
    </li>
  );
}
