import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  INFRACTIONS, TOTES_INFRACCIONS, NORMES, FONT, FILTRES,
  BAREM_VELOCITAT, BAREM_ALCOHOL,
  LLINDAR_PENAL_ALCOHOL, LLINDAR_PENAL_VELOCITAT,
  sancioVelocitat, sancioAlcohol, searchInfractions, findInfraction,
} from '../src/data/infractions.js';

// ─── Integritat del catàleg ─────────────────────────────────────────────────

test('el catàleg conserva els 584 supòsits transcrits del PDF del SCT', () => {
  assert.equal(INFRACTIONS.length, 584);
});

test('cap fitxa es queda sense import ni remissió a barem', () => {
  const orfes = INFRACTIONS.filter(i => !i.fine && !i.barem && !i.fineLabel);
  assert.deepEqual(orfes.map(i => i.id), []);
});

test('tota fitxa cita una norma coneguda i un article', () => {
  for (const i of INFRACTIONS) {
    assert.ok(NORMES[i.norm], `${i.id}: norma desconeguda «${i.norm}»`);
    assert.match(i.article, /^Art\. \S/, `${i.id}: article mal format`);
    assert.ok(i.title.length > 5, `${i.id}: concepte buit`);
  }
});

test('els identificadors són únics', () => {
  const ids = TOTES_INFRACCIONS.map(i => i.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('el DTE declarat és la meitat de la quantia, tret dels casos sense descompte', () => {
  for (const i of INFRACTIONS) {
    if (i.fine50 == null || !i.fine) continue;
    assert.equal(i.fine50, i.fine / 2, `${i.id}: DTE incoherent`);
  }
});

test('les fitxes sense descompte no porten import amb DTE', () => {
  for (const i of INFRACTIONS.filter(x => x.dteNo)) {
    assert.equal(i.fine50, undefined, `${i.id}: dteNo però amb fine50`);
  }
});

test('la font i la versió estan declarades', () => {
  assert.equal(FONT.entitat, 'Servei Català de Trànsit');
  assert.equal(FONT.versio, '2026-02-01');
  assert.equal(FONT.llistaTancada, false);
});

// ─── Barem de velocitat ─────────────────────────────────────────────────────

test('el barem cobreix els límits de 20 a 120 km/h i cap més', () => {
  assert.deepEqual(BAREM_VELOCITAT.limits, [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
});

test('els cinc trams del barem mantenen els imports i punts de l’annex IV', () => {
  assert.deepEqual(
    BAREM_VELOCITAT.bands.map(b => [b.fine, b.punts]),
    [[100, 0], [300, 2], [400, 4], [500, 6], [600, 6]],
  );
});

test('velocitat: casos concrets de cada tram amb límit 50', () => {
  const casos = [
    [55, 100, 0], [75, 300, 2], [85, 400, 4], [95, 500, 6], [105, 600, 6],
  ];
  for (const [v, fine, punts] of casos) {
    const r = sancioVelocitat(50, v, true);
    assert.equal(r.fine, fine, `50/${v}: import`);
    assert.equal(r.punts, punts, `50/${v}: punts`);
    assert.equal(r.fine50, fine / 2);
  }
});

test('velocitat: per sota del primer tram no hi ha infracció', () => {
  assert.equal(sancioVelocitat(50, 50, true).senseInfraccio, true);
});

test('velocitat: el llindar penal depèn del tipus de via', () => {
  // +60 exactes en urbana encara NO és delicte; +61 sí.
  assert.equal(sancioVelocitat(50, 110, true).penal, undefined);
  assert.equal(sancioVelocitat(50, 111, true).penal, true);
  // en interurbana el llindar és +80.
  assert.equal(sancioVelocitat(50, 111, false).penal, undefined);
  assert.equal(sancioVelocitat(50, 131, false).penal, true);
});

test('velocitat: el resultat penal cita l’art. 379.1 CP i no dona import', () => {
  const r = sancioVelocitat(120, 205, false);
  assert.equal(r.article, LLINDAR_PENAL_VELOCITAT.article);
  assert.equal(r.fine, undefined);
});

test('velocitat: un límit fora del barem no retorna res', () => {
  assert.equal(sancioVelocitat(130, 200, false), null);
  assert.equal(sancioVelocitat(50, NaN, false), null);
});

// ─── Barem d'alcoholèmia ────────────────────────────────────────────────────

test('alcohol: conductor general, els dos trams i la reincidència', () => {
  assert.deepEqual(
    (({ fine, fine50, punts }) => ({ fine, fine50, punts }))(sancioAlcohol(0.30)),
    { fine: 500, fine50: 250, punts: 4 },
  );
  assert.deepEqual(
    (({ fine, fine50, punts }) => ({ fine, fine50, punts }))(sancioAlcohol(0.55)),
    { fine: 1000, fine50: 500, punts: 6 },
  );
  assert.equal(sancioAlcohol(0.30, 'general', true).fine, 1000);
  assert.equal(sancioAlcohol(0.30, 'general', true).punts, 4);
});

test('alcohol: el tram del professional comença a 0,16 i el del general a 0,26', () => {
  assert.equal(sancioAlcohol(0.20, 'professional').fine, 500);
  assert.equal(sancioAlcohol(0.20, 'general').senseInfraccio, true);
});

test('alcohol: el menor sense permís és sancionable des de qualsevol taxa', () => {
  assert.equal(sancioAlcohol(0.05, 'menor').fine, 500);
  assert.equal(sancioAlcohol(0.05, 'menor').punts, 0);
});

test('alcohol: els subperfils de menor amb permís apliquen punts condicionats', () => {
  const novell = sancioAlcohol(0.20, 'menor-novell');
  assert.equal(novell.fine, 500);
  assert.equal(novell.condicional, true);
  assert.equal(sancioAlcohol(0.40, 'menor-experimentat').fine, 500);
});

test('alcohol: a partir de 0,60 mg/l el resultat és penal i no administratiu', () => {
  for (const perfil of ['general', 'professional', 'menor', 'menor-novell']) {
    const r = sancioAlcohol(0.60, perfil);
    assert.equal(r.penal, true, `${perfil}: 0,60 hauria de ser penal`);
    assert.equal(r.fine, undefined, `${perfil}: no pot donar import administratiu`);
    assert.equal(r.article, LLINDAR_PENAL_ALCOHOL.article);
  }
});

test('alcohol: cap tram del barem arriba al llindar penal', () => {
  const trams = BAREM_ALCOHOL.perfils.flatMap(p => [
    ...p.trams, ...(p.subperfils || []).flatMap(s => s.trams),
  ]);
  for (const t of trams) {
    if (t.to !== null) {
      assert.ok(t.to < LLINDAR_PENAL_ALCOHOL.aireEspirat, `tram fins a ${t.to} envaeix el penal`);
    }
  }
});

test('alcohol: un perfil inexistent no retorna res', () => {
  assert.equal(sancioAlcohol(0.30, 'inventat'), null);
  assert.equal(sancioAlcohol(NaN), null);
});

// ─── Cerca ──────────────────────────────────────────────────────────────────

test('la cerca ignora accents i majúscules', () => {
  assert.ok(searchInfractions('alcoholemia').length > 0);
  assert.equal(
    searchInfractions('alcoholemia').length,
    searchInfractions('ALCOHOLÈMIA').length,
  );
});

test('la cerca exigeix tots els termes', () => {
  const dos = searchInfractions('drogues bicicleta');
  assert.ok(dos.length > 0);
  assert.ok(dos.every(i => /bicicleta/i.test(i.title)));
});

test('els filtres per norma no barregen normes', () => {
  for (const norm of ['trlsv', 'rgc', 'rgcond', 'rgv', 'lrcscvm', 'repc']) {
    const r = searchInfractions('', norm);
    assert.ok(r.length > 0, `${norm}: sense resultats`);
    assert.ok(r.every(i => i.norm === norm), `${norm}: filtre permeable`);
  }
});

test('cada filtre declarat retorna alguna cosa', () => {
  for (const f of FILTRES) {
    assert.ok(TOTES_INFRACCIONS.filter(f.test).length > 0, `filtre buit: ${f.id}`);
  }
});

test('els supòsits de seguretat ciutadana citen l’art. 36.6 i el 36.4 correctes', () => {
  assert.equal(findInfraction('SC-001').article, 'Art. 36.6 LO 4/2015');
  assert.equal(findInfraction('SC-002').article, 'Art. 36.4 LO 4/2015');
  assert.equal(findInfraction('SC-001').fineLabel, '601 – 30.000 €');
});
