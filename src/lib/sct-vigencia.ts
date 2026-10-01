// Dates civils a Catalunya: no depenen de la zona horària del dispositiu.
export type VigenciaSct = { vigentDesDe?: string; vigentFins?: string; estat?: string; nota?: string };
export function dataCatalunya(ara = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(ara);
}
export function avisVigencia(r: VigenciaSct, data = dataCatalunya()): string {
  if (r.estat === 'revisio') return 'DISCREPÀNCIA SCT / BOE · no utilitzar directament com a butlleta';
  if (r.estat === 'pendent-ordre') return 'HOMOLOGACIÓ PENDENT D’ORDRE · no exigir especificacions futures';
  if (r.vigentDesDe && data < r.vigentDesDe) return `ENCARA NO VIGENT · des de ${r.vigentDesDe}`;
  if (r.vigentFins) return `REDACTAT ANTERIOR · només per a fets fins al ${r.vigentFins}`;
  if (r.vigentDesDe) return `VIGENT DES DE ${r.vigentDesDe}`;
  return '';
}
export function permetButlleta(r: VigenciaSct, data = dataCatalunya()): boolean {
  return !(r.estat === 'revisio' || r.estat === 'pendent-ordre' || (r.vigentDesDe && data < r.vigentDesDe) || (r.vigentFins && data > r.vigentFins));
}
