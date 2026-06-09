// Aplica les metadades SEO per defecte de cada secció en navegar.
// Les pàgines amb títol a mida (useSeo) tenen prioritat.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyMeta, metaForPath, getExplicit } from '../lib/seo';

export default function RouteMeta() {
  const loc = useLocation();
  useEffect(() => {
    if (getExplicit() === loc.pathname) return; // ja l'ha posat la pàgina
    applyMeta({ ...metaForPath(loc.pathname), path: loc.pathname });
  }, [loc.pathname]);
  return null;
}
