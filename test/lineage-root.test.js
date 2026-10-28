// Tests for the lineage walk that roots the tree at the highest discoverable
// ancestor.
//
// Guarding this one specifically: the client's list projection renames the
// wire field `parentSessionId` to `parentId` when it builds `byId`. Reading the
// wire name silently roots every tree at the tab's own session — the tree looks
// fine, just rooted one level too deep — so the fixtures here are shaped like
// the real projection (`{ id, parentId }`), with the wire name covered only as
// a fallback case.

import { test } from 'node:test';
import assert from 'node:assert/strict';

let registration;
globalThis.window = {
  __ModuleLoader__: { load(reg) { registration = reg; } },
};

await import('../client.js');

const plugin = registration.factory(() => ({}));
const rootOf = plugin.__rootOf;

test('the lineage walk is reachable from the plugin object', () => {
  assert.equal(typeof rootOf, 'function');
});

test('a root session is its own root', () => {
  const summaries = { ids: ['r'], byId: { r: { id: 'r' } } };
  assert.equal(rootOf(summaries, 'r'), 'r');
});

test('a single parent is followed (client-store shape: parentId)', () => {
  const summaries = { ids: ['r', 'a'], byId: { r: { id: 'r' }, a: { id: 'a', parentId: 'r' } } };
  assert.equal(rootOf(summaries, 'a'), 'r');
});

test('the whole chain is walked, not just one hop', () => {
  const summaries = {
    ids: ['r', 'b', 'a'],
    byId: { r: { id: 'r' }, b: { id: 'b', parentId: 'r' }, a: { id: 'a', parentId: 'b' } },
  };
  assert.equal(rootOf(summaries, 'a'), 'r');
});

test('the wire field name still works as a fallback', () => {
  const summaries = { ids: ['r', 'a'], byId: { r: { id: 'r' }, a: { id: 'a', parentSessionId: 'r' } } };
  assert.equal(rootOf(summaries, 'a'), 'r');
});

test('a parent missing from the store stops the walk at the highest known ancestor', () => {
  const summaries = { ids: ['a'], byId: { a: { id: 'a', parentId: 'gone' } } };
  assert.equal(rootOf(summaries, 'a'), 'a');
});

test('a session absent from the store roots at itself', () => {
  const summaries = { ids: ['r'], byId: { r: { id: 'r' } } };
  assert.equal(rootOf(summaries, 'unknown'), 'unknown');
});

test('a lineage cycle terminates instead of looping', () => {
  const summaries = {
    ids: ['a', 'b'],
    byId: { a: { id: 'a', parentId: 'b' }, b: { id: 'b', parentId: 'a' } },
  };
  const result = rootOf(summaries, 'a');
  assert.ok(result === 'a' || result === 'b');
});

test('missing snapshots and ids degrade to the requested id', () => {
  assert.equal(rootOf(undefined, 'a'), 'a');
  assert.equal(rootOf({}, 'a'), 'a');
  assert.equal(rootOf({ ids: [], byId: {} }, undefined), undefined);
});
