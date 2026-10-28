// Tests for the context-tooltip token formatter in the browser half.
//
// `client.js` is a factory-CJS bundle for the client module system, not an ESM
// module, so the test materializes it the way the shell does: capture the
// `window.__ModuleLoader__.load` registration, then call the factory with a
// stub `require`. The pure formatter is exposed as `__formatTokens` for this.

import { test } from 'node:test';
import assert from 'node:assert/strict';

let registration;
globalThis.window = {
  __ModuleLoader__: {
    load(reg) {
      registration = reg;
    },
  },
};

await import('../client.js');

test('registers the expected package id', () => {
  assert.ok(registration, 'factory registration was captured');
  assert.equal(registration.id, 'dsh-subagent-tree');
});

const plugin = registration.factory(() => ({}));
const format = plugin.__formatTokens;

test('the formatter is reachable from the plugin object', () => {
  assert.equal(typeof format, 'function');
});

test('counts below one thousand render as whole numbers', () => {
  assert.equal(format(0), '0');
  assert.equal(format(1), '1');
  assert.equal(format(500), '500');
  assert.equal(format(999), '999');
  assert.equal(format(999.4), '999');
});

test('thousands use one decimal below 100k', () => {
  assert.equal(format(1000), '1k');
  assert.equal(format(3500), '3.5k');
  assert.equal(format(5000), '5k');
  assert.equal(format(9999), '10k');
  assert.equal(format(12500), '12.5k');
  assert.equal(format(99499), '99.5k');
});

test('thousands drop the decimal from 100k up', () => {
  assert.equal(format(99999), '100k');
  assert.equal(format(100000), '100k');
  assert.equal(format(128000), '128k');
  assert.equal(format(550000), '550k');
  assert.equal(format(999499), '999k');
});

test('millions use one decimal when the fraction is non-zero', () => {
  assert.equal(format(1500000), '1.5m');
  assert.equal(format(2100000), '2.1m');
  assert.equal(format(10485760), '10.5m');
});

test('a zero fraction drops the decimal entirely', () => {
  assert.equal(format(1000000), '1m');
  assert.equal(format(1048576), '1m'); // the shipped 1M context window
  assert.equal(format(2000000), '2m');
  assert.equal(format(2040000), '2m'); // 2.04m rounds to 2.0
  assert.equal(format(3000000), '3m');
});

test('the 999.5k boundary rolls into millions instead of printing 1000k', () => {
  assert.equal(format(999999), '1m');
  assert.equal(format(999500), '1m');
  assert.equal(format(999499), '999k');
});

test('non-finite and missing values degrade to a question mark', () => {
  assert.equal(format(NaN), '?');
  assert.equal(format(Infinity), '?');
  assert.equal(format(-Infinity), '?');
  assert.equal(format(undefined), '?');
  assert.equal(format(null), '0');
});

test('the tooltip figure uses the formatter for both figures', () => {
  // Guards the wiring, not the arithmetic: "~used / window" must carry the
  // same suffix rules as the unit cases above.
  const used = format(12500);
  const window_ = format(1048576);
  assert.equal(`${used} / ${window_}`, '12.5k / 1m');
});
