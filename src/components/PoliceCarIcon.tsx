// Icona SVG d'un cotxe patrulla (vista frontal/tres quarts).
// Escalable: la mida la controles amb className (p. ex. "h-10 w-auto").
// Els colors estan fixats al propi SVG perquè el cotxe sempre tingui
// el mateix aspecte reconeixible, independentment del tema clar/fosc.
type Props = { className?: string };

export default function PoliceCarIcon({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 72 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      role="img"
    >
      {/* Cos inferior del cotxe */}
      <rect x="2" y="24" width="68" height="18" rx="3" fill="#1d4ed8" />
      {/* Cabina (sostre) */}
      <path d="M14 24 L22 12 L50 12 L58 24 Z" fill="#1e40af" />
      {/* Finestres */}
      <path d="M24 14 L34 14 L34 23 L22 23 Z" fill="#dbeafe" />
      <path d="M38 14 L48 14 L56 23 L38 23 Z" fill="#dbeafe" />
      {/* Muntant central */}
      <rect x="34" y="14" width="3" height="9" fill="#1e40af" />
      {/* Franja groga "POLICIA" */}
      <rect x="2" y="30" width="68" height="3" fill="#fbbf24" />
      {/* Barra de llums (vermell + blau) */}
      <rect x="26" y="8" width="20" height="4" rx="1" fill="#0f172a" />
      <rect x="26" y="8" width="10" height="4" fill="#ef4444" />
      <rect x="36" y="8" width="10" height="4" fill="#3b82f6" />
      {/* Llum davantera */}
      <rect x="2" y="26" width="3" height="3" rx="0.5" fill="#fef3c7" />
      {/* Rodes */}
      <circle cx="16" cy="42" r="5" fill="#0f172a" />
      <circle cx="56" cy="42" r="5" fill="#0f172a" />
      <circle cx="16" cy="42" r="2" fill="#94a3b8" />
      <circle cx="56" cy="42" r="2" fill="#94a3b8" />
    </svg>
  );
}
