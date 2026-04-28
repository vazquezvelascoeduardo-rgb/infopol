// Component arrel amb les rutes i el marc comú (header amb cerca i tema).
//
// Estructura de rutes:
//   /                          → pantalla principal (Lleis vs Operativa)
//   /leyes                     → tauler de mòduls (CE78, Codi penal, …)
//   /leyes/s/:moduleSlug       → secció (llistat de fitxes del mòdul)
//   /leyes/s/:moduleSlug/:slug → fitxa concreta
//   /operativa                 → temes operatius (Trànsit, Seguretat ciutadana…)
//   /operativa/trafico/*       → arbre interactiu de Trànsit
//   /cerca                     → resultats de cerca
//
// Lazy loading: les pàgines es carreguen sota demanda per reduir el
// bundle inicial. Home s'inclou directament (és la primera vista).
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

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
const TestList = lazy(() => import('./pages/test/TestList'));
const TestSession = lazy(() => import('./pages/test/TestSession'));

function PageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-center text-slate-500 dark:text-slate-400">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leyes" element={<Leyes />} />
          <Route path="/leyes/s/:moduleSlug" element={<Section />} />
          <Route path="/leyes/s/:moduleSlug/:slug" element={<CardPage />} />
          <Route path="/operativa" element={<Operativa />} />
          <Route path="/operativa/trafico/*" element={<Trafico />} />
          <Route path="/operativa/penal/taula-actes" element={<PenalTaulaActes />} />
          <Route path="/operativa/penal/taula-drogues" element={<PenalTaulaDrogues />} />
          <Route path="/operativa/penal/recursos" element={<PenalRecursos />} />
          <Route path="/operativa/penal/drets-detingut" element={<PenalDretsDetingut />} />
          <Route path="/operativa/penal/*" element={<Penal />} />
          <Route path="/cerca" element={<SearchResults />} />
          <Route path="/superbuscador" element={<Superbuscador />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/calculadora-alcohol" element={<CalculadoraAlcohol />} />
          <Route path="/avis-legal" element={<AvisLegal />} />
          <Route path="/privacitat" element={<Privacitat />} />
          {/* Tests — no enllaçats des del menu (acces per URL directa). */}
          <Route path="/test" element={<TestList />} />
          <Route path="/test/:slug" element={<TestSession />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
