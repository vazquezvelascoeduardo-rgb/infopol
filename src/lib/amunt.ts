/**
 * Torna a dalt de tot.
 *
 * A l'àrea privada el que scrolleja no és la finestra sinó el `<main>`
 * de l'AppShell (té `overflow-y: auto` i l'alçada del viewport). Per
 * això `window.scrollTo(0, 0)` sol no movia res a escriptori: canviaves
 * d'apartat del temari i el text nou s'obria a mitja pàgina, on t'havies
 * quedat llegint l'anterior.
 *
 * Es mouen els dos per si la pàgina va fora de l'AppShell (la portada,
 * el login) o si a mòbil qui scrolleja és el document.
 */
export function amunt() {
  document.querySelector('.v3-main')?.scrollTo({ top: 0 });
  window.scrollTo(0, 0);
}
