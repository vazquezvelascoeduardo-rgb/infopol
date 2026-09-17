// Verifica índex, recorreguts complets i paritat amb l'app operativa.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(web, 'src/data/penal-checklists');
const index = JSON.parse(fs.readFileSync(path.join(dir, '_index-penal.json'), 'utf8'));
const entries = index.blocs.flatMap((b) => b.escenaris);
assert.equal(entries.length, index.total_escenaris);
assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
let comprovats = 0;
for (const entry of entries) {
  const raw = fs.readFileSync(path.join(dir, entry.fitxer), 'utf8');
  const doc = JSON.parse(raw);
  assert.equal(doc.id, entry.id);
  if (!doc.fonts) continue;
  const visitats = new Set();
  function visita(id, cami = []) {
    assert.ok(!cami.includes(id), `${entry.id}: cicle a ${id}`);
    const node = doc.nodes[id];
    assert.ok(node, `${entry.id}: referència trencada ${id}`);
    visitats.add(id);
    if (node.final) {
      assert.ok(node.titol && node.accions?.length, `${entry.id}: final buit`);
      return;
    }
    assert.ok(node.opcions?.length, `${entry.id}: camí sense sortida`);
    for (const op of node.opcions) visita(op.va_a, [...cami, id]);
  }
  visita(doc.inici);
  assert.equal(visitats.size, Object.keys(doc.nodes).length, `${entry.id}: nodes inaccessibles`);
  for (const font of doc.fonts) assert.equal(new URL(font.url).protocol, 'https:');
  if (process.argv[2]) {
    const app = path.resolve(process.argv[2]);
    assert.equal(fs.readFileSync(path.join(app, 'src/content/penal-checklists', entry.fitxer), 'utf8'), raw);
    const mapa = fs.readFileSync(path.join(app, 'src/app/checklist/[id].tsx'), 'utf8');
    assert.ok(mapa.includes(`require('@/content/penal-checklists/${entry.fitxer}')`));
  }
  comprovats++;
}
assert.equal(comprovats, 8);
console.log(`${entries.length} entrades correctes; ${comprovats} procediments nous amb tots els camins verificats.`);
