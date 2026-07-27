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
import RouteErrorBoundary from './components/RouteErrorBoundary';
import OperativaShellLayout from './components/OperativaShellLayout';
import AcademiaShellLayout from './components/AcademiaShellLayout';
import RouteMeta from './components/RouteMeta';
import ProgressSync from './components/ProgressSync';

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
const ActesViladecans = lazy(() => import('./pages/operativa/ActesViladecans'));
const Superbuscador = lazy(() => import('./pages/Superbuscador'));
const Recursos = lazy(() => import('./pages/Recursos'));
const CalculadoraAlcohol = lazy(() => import('./pages/CalculadoraAlcohol'));
const Croquis = lazy(() => import('./pages/Croquis'));
const Chat = lazy(() => import('./pages/Chat'));
const AvisLegal = lazy(() => import('./pages/AvisLegal'));
const Privacitat = lazy(() => import('./pages/Privacitat'));
const Academia = lazy(() => import('./pages/Academia'));
const Retos = lazy(() => import('./pages/Retos'));
const TestList = lazy(() => import('./pages/test/TestList'));
const Debilitats = lazy(() => import('./pages/test/Debilitats'));
const TestSession = lazy(() => import('./pages/test/TestSession'));
const Achievements = lazy(() => import('./pages/test/Achievements'));
const Noticies = lazy(() => import('./pages/Noticies'));
const NoticiaDetall = lazy(() => import('./pages/NoticiaDetall'));
const CulturaGeneral = lazy(() => import('./pages/CulturaGeneral'));
const Actualitat = lazy(() => import('./pages/Actualitat'));
const CulturaTemari = lazy(() => import('./pages/CulturaTemari'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const MossosList = lazy(() => import('./pages/mossos/MossosList'));
const MossosTemari = lazy(() => import('./pages/mossos/MossosTemari'));
const MossosTemariAmbit = lazy(() => import('./pages/mossos/MossosTemariAmbit'));
const MossosTemariTema = lazy(() => import('./pages/mossos/MossosTemariTema'));
const MossosEsquemes = lazy(() => import('./pages/mossos/MossosEsquemes'));
const MossosEsquemaRapid = lazy(() => import('./pages/mossos/MossosEsquemaRapid'));
const PoliciaLocalEsquemes = lazy(() => import('./pages/policia-local/PoliciaLocalEsquemes'));
const PoliciaLocalEsquemaLlei = lazy(() => import('./pages/policia-local/PoliciaLocalEsquemaLlei'));
const Flashcards = lazy(() => import('./pages/flashcards/Flashcards'));

// Slugs públics dins /leyes — l'única fitxa accessible sense sessió és
// el catàleg SCT 2026. Si en un futur en cal afegir d'altres, ampliar
// aquesta llista.
const PUBLIC_LEYES_CARDS: Array<{ moduleSlug: string; slug: string }> = [
  { moduleSlug: 'transit', slug: 'cataleg-d-infraccions-de-transit-sct-2026' },
  // Novetats normatives — visibles des d'Operativa (que és pública)
  { moduleSlug: 'novetats', slug: 'vmp-vpl-novetats-2026' },
  { moduleSlug: 'novetats', slug: 'quarta-reforma-constitucio-2026' },
  // Fitxa de carrer VMP — Comunicat SCT 7/2026 (refon 3/4/6-2026)
  { moduleSlug: 'transit', slug: 'vmp-fitxa-carrer-sct-7-2026' },
];

function PageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-center text-text-3" role="status" aria-live="polite">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-line border-t-ink" />
      <span className="sr-only">Carregant…</span>
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
  const { pathname } = useLocation();

  // El chat va a PANTALLA COMPLETA: fora del chrome global (topbar, sidebar, peu).
  if (pathname === '/chat' || pathname.startsWith('/chat/')) {
    return (
      <>
        <RouteMeta />
        <ProgressSync />
        <RouteErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </>
    );
  }

  return (
    <Layout>
      <RouteMeta />
      <ProgressSync />
      <RouteErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* === Públiques (chrome global) === */}
          <Route path="/" element={<Home />} />
          <Route path="/cerca" element={<SearchResults />} />
          <Route path="/croquis" element={<Croquis />} />
          <Route path="/avis-legal" element={<AvisLegal />} />
          <Route path="/privacitat" element={<Privacitat />} />
          <Route path="/noticies" element={<Noticies />} />
          <Route path="/noticies/:slug" element={<NoticiaDetall />} />
          <Route path="/login" element={<Login />} />

          {/* === Operativa — totes amb el marc persistent (sidebar) ===
              En entrar a qualsevol categoria (Catàleg SCT, Lleis,
              protocols, calculadora…) no se surt mai del disseny nou:
              només canvia el contingut central via <Outlet/>. */}
          <Route element={<OperativaShellLayout />}>
            <Route path="/operativa" element={<Operativa />} />
            <Route path="/operativa/trafico/*" element={<Trafico />} />
            <Route path="/operativa/penal/taula-actes" element={<PenalTaulaActes />} />
            <Route path="/operativa/penal/taula-drogues" element={<PenalTaulaDrogues />} />
            <Route path="/operativa/penal/recursos" element={<PenalRecursos />} />
            <Route path="/operativa/penal/drets-detingut" element={<PenalDretsDetingut />} />
            <Route path="/operativa/actes-viladecans" element={<ActesViladecans />} />
            <Route path="/operativa/penal/*" element={<Penal />} />
            <Route path="/superbuscador" element={<Superbuscador />} />
            <Route path="/calculadora-alcohol" element={<CalculadoraAlcohol />} />
            {/* Excepcions públiques de /leyes (catàleg SCT i novetats) */}
            {PUBLIC_LEYES_CARDS.map((c) => (
              <Route
                key={`${c.moduleSlug}/${c.slug}`}
                path={`/leyes/s/${c.moduleSlug}/${c.slug}`}
                element={<CardPage />}
              />
            ))}
            <Route path="/leyes" element={<RequireAuth><Leyes /></RequireAuth>} />
            <Route path="/leyes/s/:moduleSlug" element={<RequireAuth><Section /></RequireAuth>} />
            <Route path="/leyes/s/:moduleSlug/:slug" element={<RequireAuth><CardPage /></RequireAuth>} />
            <Route path="/recursos" element={<RequireAuth><Recursos /></RequireAuth>} />
          </Route>

          {/* === Acadèmia (dashboard amb shell propi) === */}
          <Route
            path="/academia"
            element={
              <RequireAuth>
                <Academia />
              </RequireAuth>
            }
          />

          {/* === Acadèmia — subpàgines amb el marc persistent (sidebar) ===
              Tests, temari, flashcards, esquemes, mossos, reptes i els
              esquers de cultura/actualitat viuen dins del mateix marc, així
              en obrir una categoria no se surt mai del disseny nou. */}
          <Route element={<AcademiaShellLayout />}>
            {/* Esquers públics (sense sessió) */}
            <Route path="/cultura-general" element={<CulturaGeneral />} />
            <Route path="/cultura-general/temari" element={<CulturaTemari />} />
            <Route path="/cultura-general/:slug" element={<TestSession />} />
            <Route path="/actualitat" element={<Actualitat />} />
            <Route path="/actualitat/:slug" element={<TestSession />} />

            <Route path="/retos" element={<RequireAuth><Retos /></RequireAuth>} />
            {/* Temari (lleis) dins del marc de l'Acadèmia: mateix contingut
                que /leyes però sense saltar al shell d'Operativa. */}
            <Route path="/academia/temari/:moduleSlug" element={<RequireAuth><Section /></RequireAuth>} />
            <Route path="/academia/temari/:moduleSlug/:slug" element={<RequireAuth><CardPage /></RequireAuth>} />
            {/* Policia Local */}
            <Route path="/policia-local/esquemes" element={<RequireAuth><PoliciaLocalEsquemes /></RequireAuth>} />
            <Route path="/policia-local/esquemes/:slug" element={<RequireAuth><PoliciaLocalEsquemaLlei /></RequireAuth>} />
            <Route path="/policia-local" element={<RequireAuth><TestList /></RequireAuth>} />
            <Route path="/policia-local/debilitats" element={<RequireAuth><Debilitats /></RequireAuth>} />
            <Route path="/policia-local/logros" element={<RequireAuth><Achievements /></RequireAuth>} />
            <Route path="/policia-local/flashcards" element={<RequireAuth><Flashcards /></RequireAuth>} />
            <Route path="/policia-local/flashcards/:slug" element={<Navigate to="/policia-local/flashcards" replace />} />
            <Route path="/policia-local/:slug" element={<RequireAuth><TestSession /></RequireAuth>} />
            {/* Mossos */}
            <Route path="/mossos" element={<RequireAuth><MossosList /></RequireAuth>} />
            <Route path="/mossos/flashcards" element={<RequireAuth><Flashcards /></RequireAuth>} />
            <Route path="/mossos/flashcards/:slug" element={<Navigate to="/mossos/flashcards" replace />} />
            <Route path="/mossos/temari" element={<RequireAuth><MossosTemari /></RequireAuth>} />
            <Route path="/mossos/temari/:ambit" element={<RequireAuth><MossosTemariAmbit /></RequireAuth>} />
            <Route path="/mossos/temari/:ambit/:slug" element={<RequireAuth><MossosTemariTema /></RequireAuth>} />
            <Route path="/mossos/esquemes" element={<RequireAuth><MossosEsquemes /></RequireAuth>} />
            <Route path="/mossos/esquemes/:slug" element={<RequireAuth><MossosEsquemaRapid /></RequireAuth>} />
            <Route path="/mossos/:slug" element={<RequireAuth><TestSession /></RequireAuth>} />
          </Route>

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
      </RouteErrorBoundary>
    </Layout>
  );
}
