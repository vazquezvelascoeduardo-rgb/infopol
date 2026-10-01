// Aplica el suplement revisat al catàleg font i genera la fitxa consultable.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../infopol-operativa/package.json', import.meta.url));
const { JSDOM } = require('jsdom');
const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const write = (p,v) => fs.writeFileSync(new URL(p,root),v,'utf8');
const data = JSON.parse(read('src/data/sct-8-2026.json'));
const norm = s => s.replace(/\s+/g,' ').trim();
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const catalogPath='content/transit/cataleg-d-infraccions-de-transit-sct-2026.ca.html';
const doc = new JSDOM(read(catalogPath)).window.document;
doc.querySelectorAll('[data-sct8-generated]').forEach(e=>e.remove());
// Les files anteriors es conserven per a fets anteriors a l’entrada en vigor.
const oldArticles = new Set(['64.a','64.b','64.c','65.3.a','65.3.b','123','12.1','12.2','12.4','31','32','38.4','65.1.a','65.2','85.4','88.1','118.3','121.1','121.4','121.5','122.1','122.4','122.5','122.6','122.7','122.8','124.4']);
let historical=0;
for(const tr of doc.querySelectorAll('#p-rgc .tbl tbody tr')) {
 const td=tr.querySelectorAll('td'); if(td.length<2)continue;
 const art=norm(td[1].textContent).toLowerCase();
 const text=norm(td[0].textContent);
 if(oldArticles.has(art) || (art==='18.2' && /auricular|cascos/i.test(text) && !/telefonia|telèfon/i.test(text)) || (art==='118.1' && /bicicleta/i.test(text)) || (art==='36.2' && /envaint la calçada d’una autovia/.test(text)) || (art==='123' && !/grup de persones/.test(text))) {
  tr.dataset.vigentFins='2026-09-30';
  tr.dataset.nota='Redacció anterior: només per a fets fins al 30-09-2026. Per a fets posteriors consulta les opcions del Comunicat SCT 8/2026.';
  if(!td[0].querySelector('.sct8-historic')) td[0].insertAdjacentHTML('beforeend','<small class="sct8-historic" style="display:block;color:#9a3412">HISTÒRIC · fins al 30-09-2026</small>');
  historical++;
 }
}
function renderRow(r) {
 const blocked=r.estat!=='ordinari';
 const note=[blocked?'CONSULTA / NO UTILITZAR DIRECTAMENT COM A BUTLLETA.':'Des de l’1-10-2026.',r.nota].filter(Boolean).join(' ');
 return `<tr class="row-${r.severity.toLowerCase()}" data-vigent-des-de="${r.vigentDesDe}" data-opcio="${r.opcio}" data-font="Comunicat SCT 8/2026 · punt ${r.numero} · pàgina ${r.pagina}" data-estat="${r.estat}" data-nota="${escape(r.nota)}"><td><span class="sct-concepte">${escape(r.concepte)}</span><small style="display:block;color:#9a3412">${escape(note)} · Opció ${r.opcio||'no indicada'}</small></td><td class="col-art">${r.article}</td><td><span class="sev sev-${r.severity.toLowerCase()}">${r.severity}</span></td><td class="col-eur">${r.fine}</td><td class="col-dte">${r.dte}</td><td class="col-pts">${r.points||'—'}</td></tr>`;
}
for(const law of ['lsv','rgc','rgv']) {
 const panel=doc.querySelector('#p-'+law); if(!panel)throw Error(law);
 panel.insertAdjacentHTML('afterbegin',`<div class="sec" data-sct8-generated="true"><h2>Comunicat SCT 8/2026 · entrada general 1-10-2026</h2><p>Consulta les notes de cada opció. Hi ha discrepàncies amb el BOE i règims transitoris. Els imports indicats són els del comunicat; no acrediten per si sols la procedència de la denúncia.</p><table class="tbl"><thead><tr><th>Concepte</th><th>Art.</th><th>N</th><th>€</th><th>DTE</th><th>Punts</th></tr></thead><tbody>${data.rows.filter(r=>r.lawId===law).map(renderRow).join('\n')}</tbody></table></div>`);
}
write(catalogPath,'<!DOCTYPE html>\n'+doc.documentElement.outerHTML);
const summary=`<h1>Comunicat SCT 8/2026 · usuaris vulnerables</h1>
<p>Revisió: 29-09-2026. Font: comunicat aportat i <a href="https://www.boe.es/eli/es/rd/2026/06/24/518">RD 518/2026, de 24 de juny (BOE)</a>. El comunicat escriu «maig» al punt 2: la data correcta és juny.</p>
<h2>Quan s’aplica</h2><ul><li>Entrada general: 1-10-2026. Abans, aplicar la regulació anterior; no anticipar sancions.</li><li>1-10-2027: enllumenat diürn dels VMP i exigència de casc homologat UNECE R22 en ciclomotors; mentrestant poden usar casc certificat.</li><li>Guants: des de l’1-10-2026, guants de protecció d’ús actual en interurbana. Les especificacions tècniques noves esperen l’ordre ministerial. No denunciar manca d’homologació encara no exigible.</li><li>Seients i remolcs de bicicletes: règim transitori de la DT 2a; seients homologats i remolcs permesos. No exigir especificacions futures.</li></ul>
<h2>VMP i bicicletes</h2><ul><li>VMP: mínim 15 anys; casc cordat; element lluminós o reflectant a 150 m de nit o amb poca visibilitat; llums de nit. Sense detracció de punts.</li><li>VMP: excepció a vies interurbanes i túnels urbans per vies ciclistes i vies prohibides a vehicles de motor si els senyals no ho prohibeixen. No autoritza autopistes, autovies ni travessies.</li><li>Bicicletes: casc en interurbana sense les antigues exempcions; menors de 16 anys en totes les vies; professionals també en urbana i travessies.</li><li>Professionals amb moto, ciclomotor, bici/cicle o VMP: armilla d’alta visibilitat en totes les vies.</li><li>Vies urbanes: 5 m de distància del vehicle de motor a bicicleta o VMP precedent; carril dret amb excepcions per seguretat o canvi de direcció; centre del carril preferent.</li><li>El carril bici és preferent; per fer-lo obligatori cal R-407a. Doble sentit ciclista només amb autorització municipal i senyalització en les condicions de l’art. 153.6.</li><li>Voreres: prohibició general; l’ordenança pot permetre bicicletes d’infants fins a 12 anys a càrrec d’un adult a peu. Diferenciar la resta de zones de vianants.</li></ul>
<h2>Motos, avançaments i emergències</h2><ul><li>Calçat tancat en totes les vies i guants en interurbana per a conductors i passatgers dels vehicles de l’art. 118.1; excepció d’autoprotecció amb cinturó documentada.</li><li>Motocicletes: armilla com a dotació; ús quan el conductor surt i ocupa calçada o voral interurbà.</li><li>Avançar vulnerables fora de poblat: reduir almenys 20 km/h respecte del límit, 1,5 m i canvi complet de carril si n’hi ha més d’un per sentit. No inventar punts: consultar l’opció concreta.</li><li>Vehicles immobilitzats per accident, avaria o serveis de l’art. 88: 1,5 m i reducció de 20 km/h.</li><li>Retencions: corredor d’emergència al centre amb dos carrils; amb tres o més, entre l’esquerre i el contigu.</li><li>Neu: prohibit avançar; carril dret, o també el contigu si hi ha tres o més, deixant lliures la resta de l’esquerra.</li><li>Motocicletes pel voral: només trams habilitats i senyalitzats, congestió amb trànsit detingut, fila d’un, màxim 30 km/h i prioritat de qui hi està obligat.</li></ul>
<h2>Cinturons i autobusos</h2><p>Se suprimeixen les exempcions dels conductors de taxi, repartiment i ensenyament. Es mantenen les excepcions expressament previstes per la norma, inclosa la regla específica de SRI en taxis urbans de l’art. 119.2. Autobusos amb viatgers dempeus o sense cinturó: màxim 80 km/h en qualsevol via fora de poblat.</p>
<h2>Discrepàncies que requereixen contrast</h2><p>Es conserva el text del SCT per traçabilitat, però les opcions 41, 59, 64, 68 i 79 no es presenten com a text de denúncia validat. Preval la norma del BOE; cal aclariment del SCT sobre el codi/redactat.</p><ul>${data.rows.filter(r=>r.estat==='revisio').map(r=>`<li><b>Punt ${r.numero} · ${r.article} · opció ${r.opcio}:</b> ${escape(r.nota)}</li>`).join('')}</ul>`;
const style='<style>body{font:16px/1.6 system-ui;margin:24px auto;padding:0 20px;max-width:1100px;color:#172334}h1,h2{color:#174e78}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #ccd3dc;padding:9px;text-align:left}small{display:block}a{color:#1565ad}</style>';
write('content/transit/comunicat-sct-8-2026.ca.html',`<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><title>Comunicat SCT 8/2026 · vulnerables, vigència i catàleg</title>${style}</head><body>${summary}<h2>Les 88 opcions del comunicat</h2><table><thead><tr><th>Concepte i nota</th><th>Art.</th><th>N</th><th>€</th><th>DTE</th><th>Punts</th></tr></thead><tbody>${data.rows.map(renderRow).join('\n')}</tbody></table></body></html>`);
write('src/data/sct-8-2026-resum.html', summary);
console.log(`Suplement: 88 opcions; ${historical} files anteriors marcades amb data límit.`);
