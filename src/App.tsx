// Component arrel amb les rutes.
//
// L'estructura és de dos móns:
//
//   PÚBLIC  — la portada, el registre i els legals. Cadascun porta el seu
//             propi marc; no hi ha barra lateral.
//               /            → presentació d'InfoPol
//               /login       → entrar o registrar-se
//               /avis-legal, /privacitat
//
//   PRIVAT  — tota l'app. Un únic marc (AppShell, disseny v3) amb barra
//             lateral de tinta, capçalera amb cercador i el contingut al
//             mig. Requereix sessió: qui no en té, cap a /login.
//               /app         → resum de la preparació
//               /academia/*, /policia-local/*, /mossos/*, /retos
//               /operativa/*, /leyes/*, /recursos, /superbuscador…
//               /croquis, /noticies, /chat, /perfil
//
// Lazy loading: les pàgines es carreguen sota demanda per reduir el
// bundle inicial. Home s'inclou directament (és la primera vista).
import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AppShell from './components/AppShell';
import RequireAuth from './components/RequireAuth';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import RouteMeta from './components/RouteMeta';
import ProgressSync from './components/ProgressSync';
import GdprBanner from './components/GdprBanner';

const Inici = lazy(() => import('./pages/Inici'));
const Estudi = lazy(() => import('./pages/Estudi'));
const EstudiTema = lazy(() => import('./pages/EstudiTema'));
const Repas = lazy(() => import('./pages/Repas'));
const Diagnostic = lazy(() => import('./pages/Diagnostic'));
const Quadrant = lazy(() => import('./pages/Quadrant'));
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
const ZonaTest = lazy(() => import('./pages/test/ZonaTest'));
const CategoriaTemes = lazy(() => import('./pages/test/CategoriaTemes'));
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
// El temari de Mossos ja es llegeix amb el mateix lector que el de
// Policia Local (EstudiTema). Aquestes dues pàgines només queden per als
// enllaços vells, que hi arribin i no es trobin un 404.
const MossosTemariAmbit = lazy(() => import('./pages/mossos/MossosTemariAmbit'));
const MossosTemariTema = lazy(() => import('./pages/mossos/MossosTemariTema'));
const MossosEsquemes = lazy(() => import('./pages/mossos/MossosEsquemes'));
const MossosEsquemaRapid = lazy(() => import('./pages/mossos/MossosEsquemaRapid'));
const PoliciaLocalEsquemes = lazy(() => import('./pages/policia-local/PoliciaLocalEsquemes'));
const PoliciaLocalEsquemaLlei = lazy(() => import('./pages/policia-local/PoliciaLocalEsquemaLlei'));
const Flashcards = lazy(() => import('./pages/flashcards/Flashcards'));

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
  return (
    <>
      <RouteMeta />
      <ProgressSync />
      <RouteErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* ═══ Públic ═══ */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/avis-legal" element={<AvisLegal />} />
            <Route path="/privacitat" element={<Privacitat />} />

            {/* ═══ Privat — tot dins del marc v3 ═══ */}
            <Route element={<RequireAuth><AppShell /></RequireAuth>}>
              <Route path="/app" element={<Inici />} />
              <Route path="/cerca" element={<SearchResults />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/croquis" element={<Croquis />} />
              <Route path="/perfil" element={<Profile />} />

              {/* Notícies */}
              <Route path="/noticies" element={<Noticies />} />
              <Route path="/noticies/:slug" element={<NoticiaDetall />} />

              {/* Operativa */}
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
              <Route path="/leyes" element={<Leyes />} />
              <Route path="/leyes/s/:moduleSlug" element={<Section />} />
              <Route path="/leyes/s/:moduleSlug/:slug" element={<CardPage />} />
              <Route path="/recursos" element={<Recursos />} />

              {/* Estudia per tema — el temari propi (no les fitxes de lleis) */}
              <Route path="/estudi" element={<Estudi />} />
              <Route path="/estudi/tema/:num" element={<EstudiTema />} />
              {/* Enllaços vells al temari per mòduls: cap al temari nou. */}
              <Route path="/estudi/:moduleSlug" element={<Navigate to="/estudi" replace />} />
              <Route path="/estudi/:moduleSlug/:slug" element={<Navigate to="/estudi" replace />} />
              <Route path="/repas" element={<Repas />} />
              {/* "Resums" fora: només queden els esquemes. */}
              <Route path="/resums" element={<Navigate to="/policia-local/esquemes" replace />} />
              <Route path="/diagnostic" element={<Diagnostic />} />
              <Route path="/quadrant" element={<Quadrant />} />

              {/* Acadèmia */}
              <Route path="/academia" element={<Academia />} />
              {/* El temari antic vivia també sota /academia/temari, duplicant
                  les fitxes de lleis. Ja no: qui hi arribi per un enllaç vell
                  va a parar a la biblioteca, que és on són de debò. */}
              <Route path="/academia/temari/*" element={<Navigate to="/leyes" replace />} />
              <Route path="/cultura-general" element={<CulturaGeneral />} />
              <Route path="/cultura-general/temari" element={<CulturaTemari />} />
              <Route path="/cultura-general/:slug" element={<TestSession />} />
              <Route path="/actualitat" element={<Actualitat />} />
              <Route path="/actualitat/:slug" element={<TestSession />} />
              <Route path="/retos" element={<Retos />} />

              {/* Policia Local */}
              <Route path="/policia-local/esquemes" element={<PoliciaLocalEsquemes />} />
              <Route path="/policia-local/esquemes/:slug" element={<PoliciaLocalEsquemaLlei />} />
              <Route path="/policia-local" element={<ZonaTest cos="pl" />} />
              <Route path="/policia-local/cat/:clau" element={<CategoriaTemes cos="pl" />} />
              <Route path="/policia-local/debilitats" element={<Debilitats />} />
              <Route path="/policia-local/logros" element={<Achievements />} />
              <Route path="/policia-local/flashcards" element={<Flashcards />} />
              <Route path="/policia-local/flashcards/:slug" element={<Navigate to="/policia-local/flashcards" replace />} />
              <Route path="/policia-local/:slug" element={<TestSession />} />

              {/* Mossos */}
              <Route path="/mossos" element={<ZonaTest cos="mossos" />} />
              <Route path="/mossos/cat/:clau" element={<CategoriaTemes cos="mossos" />} />
              <Route path="/mossos/flashcards" element={<Flashcards />} />
              <Route path="/mossos/flashcards/:slug" element={<Navigate to="/mossos/flashcards" replace />} />
              <Route path="/mossos/temari" element={<Navigate to="/estudi" replace />} />
              <Route path="/mossos/estudi/:num" element={<EstudiTema cos="mossos" />} />
              <Route path="/mossos/temari/:ambit" element={<MossosTemariAmbit />} />
              <Route path="/mossos/temari/:ambit/:slug" element={<MossosTemariTema />} />
              <Route path="/mossos/esquemes" element={<MossosEsquemes />} />
              <Route path="/mossos/esquemes/:slug" element={<MossosEsquemaRapid />} />
              <Route path="/mossos/:slug" element={<TestSession />} />

              {/* Compat amb enllaços antics */}
              <Route path="/test" element={<Navigate to="/policia-local" replace />} />
              <Route path="/test/*" element={<RedirectTestToPoliciaLocal />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
      <GdprBanner />
    </>
  );
}
