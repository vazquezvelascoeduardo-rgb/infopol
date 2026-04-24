// Pàgina 404.
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center">
      <div className="text-7xl font-black tracking-tight text-amber-600 dark:text-amber-400">
        404
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Pàgina no trobada.</p>
      <Link to="/" className="mt-4 inline-block text-amber-600 dark:text-amber-400 underline">
        Torna a l'inici
      </Link>
    </div>
  );
}
