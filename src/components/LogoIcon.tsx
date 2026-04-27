// Logo d'InfoPol: escut amb 3 estrelles superiors + lupa amb estrella
// dins. Usa `currentColor` per a tots els traços, així s'adapta al
// color del text del context (blau en mode clar, blanc en mode fosc).
type Props = { className?: string };

export default function LogoIcon({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      role="img"
      fill="currentColor"
    >
      {/* Escut */}
      <path
        d="M32 4 L8 14 L8 30 C8 43 18 54 32 60 C46 54 56 43 56 30 L56 14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Vora interior subtil */}
      <path
        d="M32 8 L12 16 L12 30 C12 41 20 50 32 56 C44 50 52 41 52 30 L52 16 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* 3 estrelles superiors */}
      <path d="M19.5 12.5 l0.95 1.95 l2.15 0.31 l-1.55 1.51 l0.36 2.14 l-1.91 -1.0 l-1.91 1.0 l0.36 -2.14 l-1.55 -1.51 l2.15 -0.31 z" />
      <path d="M32 11 l1.05 2.15 l2.37 0.34 l-1.71 1.67 l0.4 2.36 l-2.11 -1.11 l-2.11 1.11 l0.4 -2.36 l-1.71 -1.67 l2.37 -0.34 z" />
      <path d="M44.5 12.5 l0.95 1.95 l2.15 0.31 l-1.55 1.51 l0.36 2.14 l-1.91 -1.0 l-1.91 1.0 l0.36 -2.14 l-1.55 -1.51 l2.15 -0.31 z" />

      {/* Lupa: lent */}
      <circle cx="28" cy="32" r="11" fill="none" stroke="currentColor" strokeWidth="2.6" />
      {/* Mànec */}
      <line x1="20.3" y1="39.7" x2="14" y2="46" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />

      {/* Estrella central dins de la lent */}
      <path d="M28 26.4 l1.27 2.6 l2.86 0.41 l-2.07 2.0 l0.49 2.85 l-2.55 -1.34 l-2.55 1.34 l0.49 -2.85 l-2.07 -2.0 l2.86 -0.41 z" />
    </svg>
  );
}
