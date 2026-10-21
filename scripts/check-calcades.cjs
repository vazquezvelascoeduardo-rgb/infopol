// Geometria i regressió visual del muntatge de calçades per peces.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const mod = { exports: {} };
const physics = {};
new Function('exports', ts.transpileModule(fs.readFileSync('src/lib/croquisPhysics.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(physics);
new Function('exports', 'require', ts.transpileModule(fs.readFileSync('src/lib/croquisRoads.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(mod.exports, (name) => name === './croquisPhysics' ? physics : require(name));
const { boques, boquesLliures, encaixa, apropa, uneixVia } = mod.exports;
const base = { id: 'a', kind: 'via-peca', roadPiece: 'recta', x: 600, y: 950, rotation: 0, scaleX: 1, scaleY: 1, width: 165, roadLength: 240 };
for (const roadPiece of ['recta', 'dreta90', 'esquerra90', 'dreta45', 'esquerra45', 'te', 'y', 'creu']) {
  const target = boques(base)[1];
  const next = encaixa({ ...base, id: 'b', roadPiece }, 0, target);
  const start = boques(next)[0];
  assert.ok(Math.hypot(start.x - target.x, start.y - target.y) < 0.001);
  assert.ok(Math.abs(start.width - target.width) < 0.001);
  assert.equal(boquesLliures([base, next]).length, boques(next).length);
  const snapped = apropa({ ...next, x: next.x + 15 }, [base], 25);
  assert.ok(Math.abs(snapped.x - next.x) < 0.001);
}
const target = boques(base)[1];
const free = uneixVia([target.x, target.y, target.x + 150, target.y - 200], [base], 165);
assert.equal(free.length, 6);
assert.equal(free[2], target.x);
assert.ok(free[3] < target.y);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://127.0.0.1:5173/croquis');
    await page.getByRole('button', { name: /PNG/ }).waitFor();
    await page.getByTitle('Via personalitzada', { exact: true }).click();
    await page.getByRole('button', { name: 'Començar un traçat nou', exact: true }).click();
    await page.getByLabel('Amplada de calçada', { exact: true }).fill('165');
    await page.getByTitle('Tram recte', { exact: true }).click();
    await page.getByLabel('Longitud o radi', { exact: true }).fill('240');
    const scene = () => page.evaluate(() => JSON.parse(localStorage.getItem('infopol:croquis:v1')));
    for (const label of ['Corba 90°', 'Tram recte', 'Corba 90° esquerra', 'Cruïlla en T']) {
      const prev = (await scene()).els.at(-1);
      await page.getByTitle(label, { exact: true }).click();
      const next = (await scene()).els.at(-1);
      const a = boques(prev)[1], b = boques(next)[0];
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 0.001, label);
      assert.ok(Math.abs(a.width - b.width) < 0.001);
      await page.getByLabel('Longitud o radi', { exact: true }).fill('240');
    }
    const before = await scene();
    await page.getByTitle('Desfer (Ctrl+Z)').click();
    await page.getByTitle('Refer (Ctrl+Maj+Z)').click();
    assert.deepEqual(await scene(), before);
    await page.reload();
    await page.getByRole('button', { name: /PNG/ }).waitFor();
    assert.deepEqual(await scene(), before);
    await page.getByTitle('Via personalitzada', { exact: true }).click();
    await page.getByLabel('Allunyar', { exact: true }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /PNG/ }).click();
    const download = await downloadPromise;
    assert.equal(await download.failure(), null);
    const out = 'C:/Users/edugu/Codex/comprovacio-calcades'; fs.mkdirSync(out, { recursive: true });
    await download.saveAs(out + '/calcades.png');
    const sharp = require('sharp');
    const { data, info } = await sharp(out + '/calcades.png').raw().toBuffer({ resolveWithObject: true });
    assert.ok(info.height > 2240, 'El PNG inclou el traçat fora del llenç inicial');
    for (let i = 0; i < data.length; i += info.channels) assert.ok(!(data[i + 2] > data[i] + 80), 'Sense connectors blaus al PNG');
    await page.screenshot({ path: out + '/editor.png' });
    await page.setViewportSize({ width: 800, height: 900 });
    assert.ok(await page.getByLabel('Encaix automàtic').isVisible());
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate((els) => localStorage.setItem('infopol:croquis:v1', JSON.stringify({ road: 'cap', els, header: {}, legend: false })), [
      { ...base, x: 600, y: 900 }, { ...base, id: 'b', x: 950, y: 650 },
    ]);
    await page.reload();
    await page.getByRole('button', { name: /PNG/ }).waitFor();
    const box = await page.locator('.konvajs-content').boundingBox();
    const scale = Math.min((box.width - 72) / 1680, (box.height - 72) / 1120);
    const point = (x, y) => ({ x: box.x + (box.width - 1680 * scale) / 2 + x * scale, y: box.y + (box.height - 1120 * scale) / 2 + y * scale });
    const from = point(950, 530), to = point(620, 540);
    await page.mouse.move(from.x, from.y); await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 12 }); await page.mouse.up();
    const moved = (await scene()).els[1];
    assert.ok(Math.abs(moved.x - 600) < 0.01 && Math.abs(moved.y - 660) < 0.01, 'Encaix en arrossegar');
    await page.getByTitle('Desfer (Ctrl+Z)').click();
    assert.equal((await scene()).els[1].x, 950);
    await page.getByTitle('Via personalitzada', { exact: true }).click();
    await page.getByRole('button', { name: 'Dibuixar via lliure', exact: true }).click();
    for (const p of [point(600, 660), point(700, 400)]) { await page.mouse.click(p.x, p.y); await page.waitForTimeout(600); }
    await page.getByRole('button', { name: '✅ Acabar', exact: true }).click();
    const freeRoad = (await scene()).els.find((e) => e.kind === 'via-lliure');
    assert.equal(freeRoad.width, 165);
    assert.equal(freeRoad.points.length, 6);
    assert.equal(freeRoad.points[2], 600);
    assert.deepEqual(errors, []);
    console.log('Correcte: encaix de totes les peces, amplada, tangents, desfer/refer, persistència, PNG i controls responsius.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
