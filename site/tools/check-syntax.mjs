// tools/check-syntax.mjs — 递归检查 site/ 下所有 .js 的语法（node --check）
// 用法：node tools/check-syntax.mjs
import { readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(process.argv[2] || 'site');
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'vendor') continue;
      walk(p);
    } else if (name.endsWith('.js') || name.endsWith('.mjs')) {
      files.push(p);
    }
  }
}
walk(ROOT);

let bad = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status === 0) {
    console.log('  OK   ' + relative(ROOT, f));
  } else {
    bad++;
    console.log('  FAIL ' + relative(ROOT, f));
    console.log(String(r.stderr).split('\n').slice(0, 6).join('\n'));
  }
}
console.log(`\n${files.length - bad} / ${files.length} 个文件语法通过`);
process.exit(bad ? 1 : 0);
