/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = __dirname + '/..';

let raw;
try {
  raw = execSync('npx eslint . --ext .js,.jsx --format=json', { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (e) {
  raw = (e.stdout || Buffer.alloc(0)).toString();
}

const results = JSON.parse(raw);
const issues = {};
for (const r of results) {
  for (const m of r.messages) {
    if (m.ruleId !== 'no-unused-vars' && m.ruleId !== 'prefer-const') continue;
    if (!issues[r.filePath]) issues[r.filePath] = { unused: new Set(), preferConst: new Set() };
    if (m.ruleId === 'no-unused-vars') {
      const match = m.message.match(/^'([^']+)'/);
      if (match) issues[r.filePath].unused.add(match[1]);
    } else {
      issues[r.filePath].preferConst.add(m.line);
    }
  }
}

let totalMods = 0;
for (const [filePath, info] of Object.entries(issues)) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = content.replace(
    /import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"])\s*;?/g,
    (match, names, source) => {
      const parts = names.split(',').map(s => s.trim()).filter(Boolean);
      const kept = parts.filter(p => {
        const baseName = p.split(/\s+as\s+/)[0].trim();
        return !info.unused.has(baseName);
      });
      if (kept.length === 0) return '';
      if (kept.length === parts.length) return match;
      return `import { ${kept.join(', ')} } from ${source};`;
    }
  );

  for (const name of info.unused) {
    const re = new RegExp(`(\\{\\s*[^}]*?)\\b${name}\\b(\\s*[,}][^}]*?\\})`, 'g');
    content = content.replace(re, (m, before, after) => `${before}_${name}${after}`);
  }

  if (info.preferConst.size) {
    const lines = content.split('\n');
    for (const lineNo of info.preferConst) {
      if (lineNo - 1 >= lines.length) continue;
      const line = lines[lineNo - 1];
      if (/^\s*let\s+/.test(line) && !/^\s*let\s+_\w+/.test(line)) {
        lines[lineNo - 1] = line.replace(/^(\s*)let\b/, '$1const');
      }
    }
    content = lines.join('\n');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    totalMods++;
    console.log('  modified:', path.relative(root, filePath));
  }
}

console.log(`\n  total ${totalMods} files modified`);
