// Component arrel amb les rutes i el marc comú (header amb cerca i tema).
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Section from './pages/Section';
import CardPage from './pages/CardPage';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cerca" element={<SearchResults />} />
        <Route path="/s/:moduleSlug" element={<Section />} />
        <Route path="/s/:moduleSlug/:slug" element={<CardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
