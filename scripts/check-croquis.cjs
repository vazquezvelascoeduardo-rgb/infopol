// Prova de regressió en un navegador real, amb un perfil temporal.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const sharp = require('sharp');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', async (dialog) => { errors.push(dialog.message()); await dialog.dismiss(); });
    await page.goto('http://127.0.0.1:5173/croquis');
    await page.getByRole('button', { name: /PNG/ }).waitFor();
    const source = await sharp({ create: { width: 200, height: 100, channels: 3, background: '#ff0000' } }).png().toBuffer();
    await page.locator('input[type=file][accept="image/*"]').setInputFiles({ name: 'fons.png', mimeType: 'image/png', buffer: source });
    await page.getByLabel('Encaix del fons').waitFor();
    await page.getByRole('button', { name: '🚗 Turisme', exact: true }).click();
    const props = page.locator('.cq-props');
    await props.getByLabel('Estat del vehicle').selectOption('mov');
    await props.getByLabel("Mostrar fletxa / P i indicador d'estat").uncheck();
    await props.getByLabel("Text de l'etiqueta").fill('Vehicle A');
    const scene = () => page.evaluate(() => JSON.parse(localStorage.getItem('infopol:croquis:v1')));
    let saved = await scene();
    assert.equal(saved.els[0].backgroundFit, 'cover');
    assert.equal(saved.els[1].showState, false);
    assert.equal(saved.els[1].data.estat, 'mov');
    assert.equal(saved.els[1].labelText, 'Vehicle A');
    await props.getByRole('button', { name: 'Amagar', exact: true }).click();
    assert.equal((await scene()).els[1].hidden, true);
    await props.getByRole('button', { name: 'Mostrar', exact: true }).click();
    assert.equal((await scene()).els[1].hidden, false);
    await props.getByLabel('Estat del vehicle').selectOption('estacionat');
    assert.equal((await scene()).els[1].showState, false);
    await props.getByLabel('Estat del vehicle').selectOption('');
    assert.equal((await scene()).els[1].data.estat, undefined);
    await props.getByLabel('Estat del vehicle').selectOption('mov');
    // Arrossegar l'etiqueta no ha de moure ni el vehicle ni el llenç.
    const box = await page.locator('.konvajs-content').boundingBox();
    const scale = Math.min((box.width - 72) / 1680, (box.height - 72) / 1120);
    const car = saved.els[1];
    const x = box.x + (box.width - 1680 * scale) / 2 + car.x * scale;
    const y = box.y + (box.height - 1120 * scale) / 2 + (car.y + 58) * scale;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 65, y + 40, { steps: 8 });
    await page.mouse.up();
    saved = await scene();
    assert.equal(saved.els[1].x, car.x);
    assert.ok(saved.els[1].labelX > 50, 'Etiqueta desplaçada independentment');
    async function exporta() {
      const pending = page.waitForEvent('download');
      await page.getByRole('button', { name: /PNG/ }).click();
      const download = await pending;
      const path = await download.path();
      const { info, data } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.width, 3360);
      assert.equal(info.height, 2240);
      // El fons vermell arriba a la cantonada, sense marges buits.
      const offset = (10 * info.width + 10) * info.channels;
      assert.ok(data[offset] > 240 && data[offset + 1] < 20);
    }
    await exporta();
    await page.getByRole('button', { name: 'Allunyar', exact: true }).click();
    await page.getByRole('button', { name: 'Allunyar', exact: true }).click();
    await exporta();
    await page.reload();
    await page.getByLabel('Encaix del fons').waitFor();
    saved = await scene();
    assert.equal(saved.els[1].showState, false);
    assert.ok(saved.els[1].labelX > 50);
    await page.setViewportSize({ width: 800, height: 900 });
    await page.getByRole('button', { name: '🚗 Turisme', exact: true }).click();
    await page.locator('.cq-mobile-vehicle summary').click();
    await page.locator('.cq-mobile-vehicle').getByLabel('Mostrar etiqueta', { exact: true }).uncheck();
    assert.equal((await scene()).els.at(-1).showLabel, false);
    assert.deepEqual(errors, []);
    console.log('Correcte: PNG, zoom, fons complet, etiqueta independent, persistència i controls mòbils.');
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
