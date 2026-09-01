import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { T } from './tokens';
import { TabBar } from './components/Shared';

import ScreenLanding from './screens/ScreenLanding';
import ScreenOnboarding from './screens/ScreenOnboarding';
import ScreenPerfil from './screens/ScreenPerfil';

import ScreenOperativaHome from './screens/operativa/ScreenOperativaHome';
import ScreenInfraccions from './screens/operativa/ScreenInfraccions';
import ScreenFitxa from './screens/operativa/ScreenFitxa';
import ScreenProtocol from './screens/operativa/ScreenProtocol';
import ScreenMapa from './screens/operativa/ScreenMapa';

import ScreenAcademiaHome from './screens/academia/ScreenAcademiaHome';
import ScreenNoticies from './screens/ScreenNoticies';
import ScreenTemari from './screens/academia/ScreenTemari';
import ScreenTest from './screens/academia/ScreenTest';
import ScreenFlashcards from './screens/academia/ScreenFlashcards';
import ScreenStats from './screens/academia/ScreenStats';
import ScreenFisiques from './screens/academia/ScreenFisiques';

const OP_TABS = [
  { id: 'home', label: 'Inici', icon: 'home', path: '/operativa' },
  { id: 'leyes', label: 'Lleis', icon: 'scale', path: '/operativa/infraccions' },
  { id: 'protocol', label: 'Protocols', icon: 'route', path: '/operativa/protocol' },
  { id: 'mapa', label: 'Mapa', icon: 'map', path: '/operativa/mapa' },
  { id: 'me', label: 'Tu', icon: 'user', path: '/perfil?from=op' },
];

const AC_TABS = [
  { id: 'home', label: 'Pla', icon: 'home', path: '/academia' },
  { id: 'temari', label: 'Temari', icon: 'book', path: '/academia/temari' },
  { id: 'tests', label: 'Tests', icon: 'check', path: '/academia/test' },
  { id: 'stats', label: 'Stats', icon: 'chart', path: '/academia/stats' },
  { id: 'me', label: 'Tu', icon: 'user', path: '/perfil?from=ac' },
];

function OperativaShell() {
  const loc = useLocation();
  const p = loc.pathname;
  let active = 'home';
  if (p.includes('/infraccions')) active = 'leyes';
  else if (p.includes('/protocol')) active = 'protocol';
  else if (p.includes('/mapa')) active = 'mapa';
  return (
    <>
      <Outlet />
      <TabBar tabs={OP_TABS} active={active} mode="operativa" />
    </>
  );
}

function AcademiaShell() {
  const loc = useLocation();
  const p = loc.pathname;
  let active = 'home';
  if (p.includes('/temari')) active = 'temari';
  else if (p.includes('/test') || p.includes('/flashcards')) active = 'tests';
  else if (p.includes('/stats') || p.includes('/fisiques')) active = 'stats';
  return (
    <>
      <Outlet />
      <TabBar tabs={AC_TABS} active={active} mode="academia" />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScreenLanding />} />
      <Route path="/onboarding" element={<ScreenOnboarding />} />
      <Route path="/operativa" element={<OperativaShell />}>
        <Route index element={<ScreenOperativaHome />} />
        <Route path="infraccions" element={<ScreenInfraccions />} />
        <Route path="infraccions/:id" element={<ScreenFitxa />} />
        <Route path="protocol" element={<ScreenProtocol />} />
        <Route path="protocol/:id" element={<ScreenProtocol />} />
        <Route path="mapa" element={<ScreenMapa />} />
      </Route>
      <Route path="/academia" element={<AcademiaShell />}>
        <Route index element={<ScreenAcademiaHome />} />
        <Route path="temari" element={<ScreenTemari />} />
        <Route path="test" element={<ScreenTest />} />
        <Route path="flashcards" element={<ScreenFlashcards />} />
        <Route path="stats" element={<ScreenStats />} />
        <Route path="fisiques" element={<ScreenFisiques />} />
      </Route>
      <Route path="/perfil" element={<ScreenPerfil />} />
      <Route path="/noticies" element={<ScreenNoticies />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
