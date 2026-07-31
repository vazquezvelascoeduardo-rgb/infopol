// Plans i mòduls de pagament.
//
// Encara no es cobra res: avui tothom té el pla gratuït i tot està
// obert. Aquest fitxer existeix perquè el dia que s'activi la
// subscripció no calgui repassar mig projecte buscant on posar els
// panys — el lloc és aquí, i és un sol lloc.
//
// COM S'ACTIVARÀ (quan toqui)
//
//   1. A Supabase, afegir a `profiles` dues columnes:
//        pla        text    not null default 'gratuit'
//        pla_fins   timestamptz  null      -- quan caduca
//      i una política RLS perquè l'usuari només pugui LLEGIR el seu pla,
//      mai escriure'l. Qui l'escriu és el webhook de la passarel·la.
//
//   2. El cobrament NO pot passar pel navegador. Va així:
//        · l'usuari clica "Fes-te Pro"
//        · una edge function crea la sessió de pagament (Stripe) amb la
//          clau secreta, que viu com a secret de la funció
//        · la passarel·la avisa la funció quan cobra i és ella qui posa
//          pla = 'pro' a `profiles`
//      A l'app mòbil això no val: Apple obliga a fer servir les seves
//      compres dins de l'app per a contingut digital (i es queda una
//      comissió). Caldrà expo-in-app-purchases i validar el rebut des
//      d'una edge function abans de marcar el pla.
//
//   3. Omplir MODULS_PRO amb el que sigui de pagament i ja està: les
//      pantalles pregunten `potAccedir()` i pinten el cadenat soles.
//
// IMPORTANT: això és una comoditat de la interfície, no una barrera.
// Amagar un botó no protegeix res — qui vulgui pot cridar l'API igual.
// El contingut de pagament de debò s'ha de protegir al servidor (RLS a
// Supabase o una edge function que comprovi el pla abans de servir-lo).

export type Pla = 'gratuit' | 'pro';

/** Claus dels mòduls que un dia seran de pagament. */
export type ModulPro =
  | 'temari-complet'
  | 'esquemes'
  | 'flashcards'
  | 'diagnostic'
  | 'xat-illimitat';

/**
 * Mòduls tancats ara mateix. Buit = tot obert, que és on som avui.
 * Afegir-hi una clau és l'únic que cal per bloquejar-lo a tot arreu.
 */
export const MODULS_PRO: ReadonlySet<ModulPro> = new Set<ModulPro>([]);

/** Etiqueta i explicació de cada mòdul, per al cartell del pany. */
export const INFO_MODUL: Record<ModulPro, { titol: string; per_que: string }> = {
  'temari-complet': {
    titol: 'Temari complet',
    per_que: 'Tots els temes desenvolupats, no només els d\'exemple.',
  },
  esquemes: {
    titol: 'Resums i esquemes',
    per_que: 'Cada llei resumida en una pàgina per repassar el dia abans.',
  },
  flashcards: {
    titol: 'Flashcards',
    per_que: 'Repàs espaiat amb targetes de tot el temari.',
  },
  diagnostic: {
    titol: 'Diagnòstic',
    per_que: 'Test llarg que et diu on estàs fluix i què repassar.',
  },
  'xat-illimitat': {
    titol: 'Xat sense límit',
    per_que: 'Consultes il·limitades al Diligenciador.',
  },
};

/**
 * Pla d'un perfil. Mentre la columna no existeixi a la base de dades,
 * el camp arriba com a `undefined` i tothom és 'gratuit' — que és
 * exactament el que volem fins que s'activi el cobrament.
 */
export function plaDelPerfil(perfil: { pla?: string | null } | null | undefined): Pla {
  return perfil?.pla === 'pro' ? 'pro' : 'gratuit';
}

/** Si aquest pla pot obrir aquest mòdul. */
export function potAccedir(modul: ModulPro, pla: Pla): boolean {
  if (pla === 'pro') return true;
  return !MODULS_PRO.has(modul);
}

/** Si el mòdul s'ha de pintar amb cadenat per a aquest pla. */
export function esBloquejat(modul: ModulPro, pla: Pla): boolean {
  return !potAccedir(modul, pla);
}
