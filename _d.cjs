const { build } = require('esbuild');
const fs = require('fs'); const path = require('path');
const dir = 'C:/Users/edugu/Documents/infopol/src/data/tests';
(async () => {
  for (const f of process.argv.slice(2)) {
    const out = path.join('C:/Users/edugu/AppData/Local/Temp', `t-${f}.cjs`);
    await build({ entryPoints: [path.join(dir, `${f}.ts`)], bundle: true, format: 'cjs', outfile: out, platform: 'node', logLevel: 'silent' });
    const mod = require(out);
    const topic = mod.default ?? Object.values(mod)[0];
    console.log(`\n##### ${f} — ${topic.questions.length} preguntes`);
    for (const q of topic.questions) console.log(`${q.text} → ${q.options[q.correct]}`);
    fs.rmSync(out, { force: true });
  }
})();
