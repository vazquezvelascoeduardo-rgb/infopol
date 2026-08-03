// Tipus del catàleg de psicotècnics.
//
// Els generadors són `.mjs` a posta: han de poder córrer amb `node` sense
// compilar res, perquè és així com es proven i com es generen les tandes
// per revisar. Aquest fitxer és el que els deixa fer servir des del TypeScript
// de la web i de l'app sense duplicar-ne el codi.

/** Una opció: o porta text, o porta dibuix. Mai les dues coses. */
export type OpcioPsico = { text?: string; svg?: string };

/**
 * Un ítem, sempre amb la mateixa forma vingui de la família que vingui.
 * El dibuix va com a cadena SVG: la web la pinta directa i l'app la passa
 * a `SvgXml` de react-native-svg tal com és.
 */
export type ItemPsico = {
  /** `categoria:llavor`. Amb la mateixa llavor surt sempre el mateix ítem. */
  id: string;
  categoria: string;
  enunciat: string;
  /** L'estímul. `null` a les categories que només són text. */
  svg: string | null;
  /** Només a «comptar símbols»: el símbol que es demana, per posar-lo al text. */
  svgObjectiu?: string;
  opcions: OpcioPsico[];
  correcta: number;
};

export type CategoriaPsico = {
  id: string;
  nom: string;
  descripcio: string;
  grafica: boolean;
  fes: (seed: number) => Omit<ItemPsico, 'id' | 'categoria'>;
};

export type Perfil = 'mossos' | 'iopos';

export const CATEGORIES: CategoriaPsico[];
export const PER_ID: Record<string, CategoriaPsico>;
export const SIMULACRES: Record<Perfil, { nom: string; pesos: Record<string, number> }>;
export const LLARGADES: readonly number[];
export const SEGONS_PER_PREGUNTA: number;

export function genera(categoriaId: string, seed: number): ItemPsico;
export function repartiment(perfil: Perfil, quantes: number): { id: string; n: number }[];
export function simulacre(perfil: Perfil, quantes: number, llavor?: number): ItemPsico[];
export function segonsPer(quantes: number): number;
export function tempsText(quantes: number): string;
