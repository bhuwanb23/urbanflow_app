#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Coverage gate (warn-only).
 * Reads coverage/coverage-summary.json and prints a warning if global lines
 * coverage is below 60%. Does NOT exit with non-zero code.
 */
const fs = require('fs');
const path = require('path');

const summaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
if (!fs.existsSync(summaryPath)) {
  console.log('\n  [coverage] no coverage summary found at', summaryPath);
  process.exit(0);
}

let summary;
try {
  summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
} catch (e) {
  console.log('\n  [coverage] could not parse', summaryPath, '-', e.message);
  process.exit(0);
}

const total = summary.total || {};
const linesPct = total.lines ? total.lines.pct : 0;
const stmtsPct = total.statements ? total.statements.pct : 0;
const funcsPct = total.functions ? total.functions.pct : 0;
const branchPct = total.branches ? total.branches.pct : 0;

const LINE_TARGET = 60;
const FUNC_TARGET = 60;
const STMT_TARGET = 60;
const BRANCH_TARGET = 50;

console.log('\n  [coverage] === Coverage Gate (warn-only, target 60% lines) ===');
console.log(`    lines:      ${linesPct}%  (target ${LINE_TARGET}%)`);
console.log(`    statements: ${stmtsPct}%  (target ${STMT_TARGET}%)`);
console.log(`    functions:  ${funcsPct}%  (target ${FUNC_TARGET}%)`);
console.log(`    branches:   ${branchPct}%  (target ${BRANCH_TARGET}%)`);

const under = [];
if (linesPct < LINE_TARGET) under.push(`lines ${linesPct}% < ${LINE_TARGET}%`);
if (stmtsPct < STMT_TARGET) under.push(`statements ${stmtsPct}% < ${STMT_TARGET}%`);
if (funcsPct < FUNC_TARGET) under.push(`functions ${funcsPct}% < ${FUNC_TARGET}%`);
if (branchPct < BRANCH_TARGET) under.push(`branches ${branchPct}% < ${BRANCH_TARGET}%`);

if (under.length) {
  console.log(`\n  [coverage] ⚠️  WARN: below target — ${under.join(', ')}`);
} else {
  console.log('\n  [coverage] ✅ all targets met');
}
process.exit(0);
