// Prova de navegació amb dades fictícies; no inicia sessió al servidor real.
const { createRequire } = require('node:module');
const assert = require('node:assert/strict');
const { chromium } = createRequire(process.argv[2])('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1100, height: 850 } });
  const user = { id: '00000000-0000-0000-0000-000000000001', email: 'prova@example.invalid', role: 'authenticated', aud: 'authenticated', app_metadata: {}, user_metadata: {} };
  const expires = Math.floor(Date.now()/1000)+3600;
  const token = ['eyJhbGciOiJIUzI1NiJ9', Buffer.from(JSON.stringify({ sub: user.id, exp: expires, role: 'authenticated' })).toString('base64url'), 'prova'].join('.');
  let authorized = true;
  let privateRequests = 0;
  await context.route('https://ispc-test.supabase.co/**', async route => {
    const url = new URL(route.request().url());
    let data = [];
    if (url.pathname.includes('/auth/v1/user')) data = user;
    else if (url.pathname.endsWith('/ispc_access')) data = authorized ? [{ user_id: user.id, active: true, email: user.email }] : [];
    else if (url.pathname.endsWith('/ispc_topics')) data = authorized ? [{ slug: 'ispc-1-1', title: '1.1 Tema de prova', module: 'Mòdul 1', question_count: 5, source_count: 1 }] : [];
    else if (url.pathname.endsWith('/ispc_questions')) { privateRequests++; data = authorized ? Array.from({length: 5}, (_,i) => ({ id: `prova-${i}`, text: `Pregunta fictícia ${i+1}?`, options: ['Correcta','Distractor B','Distractor C','Distractor D'], correct: 0, reference: 'Font fictícia', explanation: 'Explicació de prova.' })) : []; }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
  await context.addInitScript(({user, token, expires}) => {
    localStorage.setItem('infopol-auth', JSON.stringify({ access_token: token, refresh_token: 'prova', expires_at: expires, expires_in: 3600, token_type: 'bearer', user }));
  }, {user, token, expires});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:4189/ispc');
  await page.getByText('1.1 Tema de prova', {exact: true}).waitFor();
  await page.getByRole('link', {name: 'Fes un test →'}).click();
  await page.getByText('1.1 Tema de prova', {exact: true}).first().waitFor();
  await page.getByRole('button', {name: 'Comença el test', exact: true}).click();
  await page.getByText(/Pregunta fictícia/).first().waitFor();
  for (let i = 0; i < 5; i++) {
    const current = await page.getByText(/Pregunta fictícia/).first().textContent();
    await page.getByText('Correcta', {exact: true}).first().click();
    if (i < 4) await page.waitForFunction(text => ![...document.querySelectorAll('*')].some(e => e.childElementCount === 0 && e.textContent === text), current);
  }
  await page.getByRole('button', {name: 'Acabar', exact: true}).click();
  await page.getByText('Font fictícia', {exact: false}).first().waitFor();
  assert.ok((await page.locator('main').textContent()).includes('10.00'));
  await page.getByText('Explicació de prova.', {exact: true}).first().waitFor();
  assert.equal(await page.evaluate(() => JSON.stringify(localStorage).includes('Pregunta fictícia')), false, 'El contingut privat no es desa al navegador');
  await page.screenshot({path: 'C:/Users/edugu/Codex/ISPC/prova-ui.png', fullPage: true});
  assert.equal(privateRequests, 1);
  authorized = false;
  await page.goto('http://127.0.0.1:4189/ispc/ispc-1-1');
  await page.getByText(/El teu compte no té autorització/).waitFor();
  assert.equal(privateRequests, 1, 'No ha de demanar preguntes sense autorització');
  assert.deepEqual(errors, []);
  console.log('OK: catàleg, tema privat i denegació sense consultar preguntes.');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
