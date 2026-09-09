import assert from 'node:assert/strict';
import test from 'node:test';
import { D6_EVENT, buildCandidate, evaluatePairPrediction, evaluateTransfer } from '../src/lessons/build-candidate/model.ts';

test('D6 selects photons before ordering and builds the candidate from the two leading survivors', () => {
  const snapshot = buildCandidate(D6_EVENT, 30);
  assert.deepEqual(snapshot.mask, [true, true, true, false]);
  assert.deepEqual(snapshot.selected.map(({ id }) => id), ['D', 'C', 'A']);
  assert.deepEqual(snapshot.ordered.map(({ id }) => id), ['A', 'C', 'D']);
  assert.deepEqual(snapshot.candidate?.map(({ id }) => id), ['A', 'C']);
  assert.ok(snapshot.mass !== null);
  assert.ok(Math.abs(snapshot.mass - 108.53948452783212) < 1e-9);
});

test('D6 does not invent a two-object candidate when fewer than two selected photons remain', () => {
  const snapshot = buildCandidate(D6_EVENT, 50);
  assert.deepEqual(snapshot.selected.map(({ id }) => id), ['A']);
  assert.equal(snapshot.candidate, null);
  assert.equal(snapshot.mass, null);
});

test('D6 prediction checks target ordering and safe multiplicity reasoning', () => {
  assert.equal(evaluatePairPrediction('A-C'), true);
  assert.equal(evaluatePairPrediction('D-C'), false);
  assert.equal(evaluateTransfer('filter-before-indexing'), true);
  assert.equal(evaluateTransfer('duplicate-leading'), false);
});
