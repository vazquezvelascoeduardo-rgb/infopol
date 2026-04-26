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
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leyes from './pages/Leyes';
import Section from './pages/Section';
import CardPage from './pages/CardPage';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import Operativa from './pages/Operativa';
import Trafico from './pages/operativa/Trafico';
import Penal from './pages/operativa/Penal';
import PenalTaulaActes from './pages/operativa/PenalTaulaActes';
import PenalTaulaDrogues from './pages/operativa/PenalTaulaDrogues';
import PenalRecursos from './pages/operativa/PenalRecursos';
import PenalDretsDetingut from './pages/operativa/PenalDretsDetingut';
import Superbuscador from './pages/Superbuscador';

export default function App() {
  return (
    <Layout>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
