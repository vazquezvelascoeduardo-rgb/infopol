// Component arrel amb les rutes i el marc comú (header amb cerca i tema).
//
// **Rutes públiques** (accessibles sense iniciar sessió):
//   /                          → Home
//   /operativa/*               → Operativa (Trànsit, Penal i subseccions)
//   /superbuscador             → cercador del catàleg SCT
//   /cerca                     → resultats de cerca
//   /leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026 → catàleg SCT
//   /calculadora-alcohol       → eina ràpida de campament
//   /avis-legal, /privacitat   → pàgines legals
//   /noticies, /cultura-general → contingut tipus "esquer" per atraure registres
//   /login                     → inici de sessió / registre
//
// **Rutes privades** (requereixen sessió):
//   /leyes (excepte el catàleg SCT)
//   /recursos
//   /academia, /retos, /test/*
//   /perfil
//
// Lazy loading: les pàgines es carreguen sota demanda per reduir el
// bundle inicial. Home s'inclou directament (és la primera vista).
import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RequireAuth from './components/RequireAuth';

const Leyes = lazy(() => import('./pages/Leyes'));
const Section = lazy(() => import('./pages/Section'));
const CardPage = lazy(() => import('./pages/CardPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Operativa = lazy(() => import('./pages/Operativa'));
const Trafico = lazy(() => import('./pages/operativa/Trafico'));
const Penal = lazy(() => import('./pages/operativa/Penal'));
const PenalTaulaActes = lazy(() => import('./pages/operativa/PenalTaulaActes'));
const PenalTaulaDrogues = lazy(() => import('./pages/operativa/PenalTaulaDrogues'));
const PenalRecursos = lazy(() => import('./pages/operativa/PenalRecursos'));
const PenalDretsDetingut = lazy(() => import('./pages/operativa/PenalDretsDetingut'));
const Superbuscador = lazy(() => import('./pages/Superbuscador'));
const Recursos = lazy(() => import('./pages/Recursos'));
const CalculadoraAlcohol = lazy(() => import('./pages/CalculadoraAlcohol'));
const AvisLegal = lazy(() => import('./pages/AvisLegal'));
const Privacitat = lazy(() => import('./pages/Privacitat'));
const Academia = lazy(() => import('./pages/Academia'));
const Retos = lazy(() => import('./pages/Retos'));
const TestList = lazy(() => import('./pages/test/TestList'));
const TestSession = lazy(() => import('./pages/test/TestSession'));
const Achievements = lazy(() => import('./pages/test/Achievements'));
const Noticies = lazy(() => import('./pages/Noticies'));
const NoticiaDetall = lazy(() => import('./pages/NoticiaDetall'));
const CulturaGeneral = lazy(() => import('./pages/CulturaGeneral'));
const CulturaGeneralSection = lazy(() => import('./pages/CulturaGeneralSection'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));

// Slugs públics dins /leyes — l'única fitxa accessible sense sessió és
// el catàleg SCT 2026. Si en un futur en cal afegir d'altres, ampliar
// aquesta llista.
const PUBLIC_LEYES_CARDS: Array<{ moduleSlug: string; slug: string }> = [
  { moduleSlug: 'transit', slug: 'cataleg-d-infraccions-de-transit-sct-2026' },
];

function PageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-center text-slate-500 dark:text-slate-400">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
    </div>
  );
}

// Redirigeix /test/<rest> → /policia-local/<rest> preservant subrutes.
function RedirectTestToPoliciaLocal() {
  const loc = useLocation();
  const rest = loc.pathname.replace(/^\/test\/?/, '');
  return <Navigate to={`/policia-local/${rest}${loc.search}`} replace />;
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* === Públiques === */}
          <Route path="/" element={<Home />} />
          <Route path="/operativa" element={<Operativa />} />
          <Route path="/operativa/trafico/*" element={<Trafico />} />
          <Route path="/operativa/penal/taula-actes" element={<PenalTaulaActes />} />
          <Route path="/operativa/penal/taula-drogues" element={<PenalTaulaDrogues />} />
          <Route path="/operativa/penal/recursos" element={<PenalRecursos />} />
          <Route path="/operativa/penal/drets-detingut" element={<PenalDretsDetingut />} />
          <Route path="/operativa/penal/*" element={<Penal />} />
          <Route path="/cerca" element={<SearchResults />} />
          <Route path="/superbuscador" element={<Superbuscador />} />
          <Route path="/calculadora-alcohol" element={<CalculadoraAlcohol />} />
          <Route path="/avis-legal" element={<AvisLegal />} />
          <Route path="/privacitat" element={<Privacitat />} />
          <Route path="/noticies" element={<Noticies />} />
          <Route path="/noticies/:slug" element={<NoticiaDetall />} />
          <Route path="/cultura-general" element={<CulturaGeneral />} />
          <Route path="/cultura-general/:id" element={<CulturaGeneralSection />} />
          <Route path="/login" element={<Login />} />

          {/* Excepcions públiques de /leyes — més específiques primer.
              El catàleg SCT és accessible sense sessió. */}
          {PUBLIC_LEYES_CARDS.map((c) => (
            <Route
              key={`${c.moduleSlug}/${c.slug}`}
              path={`/leyes/s/${c.moduleSlug}/${c.slug}`}
              element={<CardPage />}
            />
          ))}

          {/* === Privades === */}
          <Route
            path="/leyes"
            element={
              <RequireAuth>
                <Leyes />
              </RequireAuth>
            }
          />
          <Route
            path="/leyes/s/:moduleSlug"
            element={
              <RequireAuth>
                <Section />
              </RequireAuth>
            }
          />
          <Route
            path="/leyes/s/:moduleSlug/:slug"
            element={
              <RequireAuth>
                <CardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/recursos"
            element={
              <RequireAuth>
                <Recursos />
              </RequireAuth>
            }
          />
          <Route
            path="/academia"
            element={
              <RequireAuth>
                <Academia />
              </RequireAuth>
            }
          />
          <Route
            path="/retos"
            element={
              <RequireAuth>
                <Retos />
              </RequireAuth>
            }
          />
          <Route
            path="/policia-local"
            element={
              <RequireAuth>
                <TestList />
              </RequireAuth>
            }
          />
          <Route
            path="/policia-local/logros"
            element={
              <RequireAuth>
                <Achievements />
              </RequireAuth>
            }
          />
          <Route
            path="/policia-local/:slug"
            element={
              <RequireAuth>
                <TestSession />
              </RequireAuth>
            }
          />
          {/* Redirects: /test/* → /policia-local/* (compat amb bookmarks). */}
          <Route path="/test" element={<Navigate to="/policia-local" replace />} />
          <Route path="/test/*" element={<RedirectTestToPoliciaLocal />} />
          <Route
            path="/perfil"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
