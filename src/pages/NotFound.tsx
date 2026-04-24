// Pàgina 404.
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <div className="text-7xl font-black tracking-tight text-amber-400">404</div>
      <p className="mt-2 text-slate-300">Pàgina no trobada.</p>
      <Link to="/" className="mt-4 inline-block text-amber-400 underline">
        Torna a l'inici
      </Link>
    </div>
  );
}
