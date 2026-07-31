// Temari de Policia Local — índex oficial.
//
// Aquesta llista MANA. El temari antic de la web (les fitxes de
// `content/` per mòduls) ja no s'ensenya a "Estudia per tema": era una
// biblioteca de normes, no un temari, i barrejava coses que no entren a
// l'examen amb coses que sí.
//
// La numeració és la de la convocatòria i té forats a propòsit (del 13
// salta al 20): són temes que no formen part d'aquest temari. No s'han
// de renumerar per fer-los seguits — el número és com el troba l'opositor
// a les bases.
//
// Un tema surt com a "disponible" quan té fitxer de contingut a
// `content/`. Mentre no en tingui, es veu però es diu que encara no hi
// és, en comptes d'obrir una pantalla buida.

export type BlocTemari = {
  clau: string;
  titol: string;
};

export type TemaPL = {
  /** Número de la convocatòria. */
  num: number;
  titol: string;
  /** Bloc al qual pertany. */
  bloc: string;
  /** Nom del fitxer a content/temari-pl/, sense extensió. */
  fitxer: string;
};

export const BLOCS: BlocTemari[] = [
  { clau: 'institucional', titol: 'Àmbit institucional i administratiu' },
  { clau: 'seguretat', titol: 'Seguretat pública i règim policial' },
  { clau: 'penal', titol: 'Àmbit penal i processal' },
  { clau: 'transit', titol: 'Trànsit i seguretat viària' },
];

export const TEMES: TemaPL[] = [
  // ── Àmbit institucional i administratiu ──────────────────────
  { num: 1, bloc: 'institucional', fitxer: '01-constitucio', titol: 'Constitució espanyola de 1978 — estructura i principis generals, títol I i títol VIII' },
  { num: 2, bloc: 'institucional', fitxer: '02-eac', titol: "LO 6/2006, de reforma de l'Estatut d'Autonomia de Catalunya" },
  { num: 3, bloc: 'institucional', fitxer: '03-lrbrl', titol: 'Llei 7/1985, reguladora de les bases del règim local' },
  { num: 4, bloc: 'institucional', fitxer: '04-lrjsp', titol: 'Llei 40/2015, de règim jurídic del sector públic' },
  { num: 5, bloc: 'institucional', fitxer: '05-lpac', titol: 'Llei 39/2015, del procediment administratiu comú' },
  { num: 6, bloc: 'institucional', fitxer: '06-ebep', titol: "RDL 5/2015, Estatut bàsic de l'empleat públic" },
  { num: 7, bloc: 'institucional', fitxer: '07-prl', titol: 'Llei 31/1995, de prevenció de riscos laborals' },
  { num: 8, bloc: 'institucional', fitxer: '08-igualtat', titol: "Pla d'igualtat d'oportunitats de l'Ajuntament de Barcelona i LO 3/2007" },
  { num: 9, bloc: 'institucional', fitxer: '09-carta-municipal', titol: 'Llei 22/1998, Carta municipal de Barcelona' },
  { num: 10, bloc: 'institucional', fitxer: '10-regim-especial-bcn', titol: 'Llei 1/2006, règim especial del municipi de Barcelona' },
  { num: 11, bloc: 'institucional', fitxer: '11-ciutat-barcelona', titol: 'Coneixement de la ciutat de Barcelona' },
  { num: 12, bloc: 'institucional', fitxer: '12-organigrama-municipal', titol: 'Decret de la Comissió de Govern de 30 de maig de 2024 — organigrama municipal' },
  { num: 13, bloc: 'institucional', fitxer: '13-proteccio-civil', titol: 'Llei 4/1997, de protecció civil de Catalunya' },

  // ── Seguretat pública i règim policial ───────────────────────
  { num: 20, bloc: 'seguretat', fitxer: '20-lofcs', titol: 'LO 2/1986, de forces i cossos de seguretat' },
  { num: 21, bloc: 'seguretat', fitxer: '21-policies-locals', titol: 'Llei 16/1991, de les policies locals de Catalunya' },
  { num: 22, bloc: 'seguretat', fitxer: '22-sistema-seguretat', titol: 'Llei 4/2003, de ordenació del sistema de seguretat pública de Catalunya' },
  { num: 23, bloc: 'seguretat', fitxer: '23-lopsc', titol: 'LO 4/2015, de protecció de la seguretat ciutadana' },
  { num: 24, bloc: 'seguretat', fitxer: '24-codi-etica', titol: 'Acord GOV/25/2015 — Codi d\'ètica de la policia de Catalunya' },
  { num: 25, bloc: 'seguretat', fitxer: '25-lopdgdd', titol: 'LO 3/2018, de protecció de dades personals i garantia dels drets digitals' },
  { num: 26, bloc: 'seguretat', fitxer: '26-dades-penals', titol: 'LO 7/2021, de protecció de dades amb finalitats penals' },
  { num: 27, bloc: 'seguretat', fitxer: '27-espectacles', titol: 'Llei 11/2009, de regulació administrativa dels espectacles públics i activitats recreatives' },

  // ── Àmbit penal i processal ──────────────────────────────────
  { num: 28, bloc: 'penal', fitxer: '28-lecrim', titol: 'Llei d\'enjudiciament criminal — policia judicial i detenció' },
  { num: 29, bloc: 'penal', fitxer: '29-habeas-corpus', titol: 'LO 6/1984, de procediment d\'habeas corpus' },
  { num: 30, bloc: 'penal', fitxer: '30-dret-reunio', titol: 'LO 9/1983, reguladora del dret de reunió' },
  { num: 31, bloc: 'penal', fitxer: '31-codi-penal', titol: 'LO 10/1995, Codi penal' },
  { num: 32, bloc: 'penal', fitxer: '32-armes', titol: 'RD 137/1993 (Reglament d\'armes) i Decret 219/1996 (armament de les policies locals)' },
  { num: 33, bloc: 'penal', fitxer: '33-menors', titol: 'LO 5/2000, de responsabilitat penal dels menors' },

  // ── Trànsit i seguretat viària ───────────────────────────────
  { num: 34, bloc: 'transit', fitxer: '34-lsv', titol: 'RDL 6/2015, Llei sobre trànsit, circulació de vehicles a motor i seguretat viària' },
  { num: 35, bloc: 'transit', fitxer: '35-conductors', titol: 'RD 818/2009, Reglament general de conductors' },
  { num: 36, bloc: 'transit', fitxer: '36-circulacio', titol: 'RD 1428/2003, Reglament general de circulació' },
  { num: 37, bloc: 'transit', fitxer: '37-vehicles', titol: 'RD 2822/1998, Reglament general de vehicles' },
];

export const temesDelBloc = (clau: string): TemaPL[] =>
  TEMES.filter((t) => t.bloc === clau);

export const temaPerNum = (num: number): TemaPL | undefined =>
  TEMES.find((t) => t.num === num);
