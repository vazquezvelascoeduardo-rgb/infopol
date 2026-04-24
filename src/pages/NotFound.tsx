// Pàgina 404 bàsica.
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Pàgina no trobada.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 underline">
        Torna a l'inici
      </Link>
    </div>
  );
}
