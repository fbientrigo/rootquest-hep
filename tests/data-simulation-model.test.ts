import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addHistograms,
  deriveDataSimulation,
  divideHistograms,
  evaluatePrediction,
  evaluateTransfer,
  normalizeToUnitArea,
} from '../src/lessons/data-simulation/model.ts';

test('MC components add bin by bin before comparison with Data', () => {
  assert.deepEqual(addHistograms([2, 3, 2], [1, 1.5, 1]), [3, 4.5, 3]);
});

test('absolute-yield comparison preserves the prepared normalization mismatch', () => {
  const result = deriveDataSimulation('yield');
  assert.deepEqual(result.data, [6, 9, 6]);
  assert.deepEqual(result.mc, [3, 4.5, 3]);
  assert.deepEqual(result.ratio, [2, 2, 2]);
  assert.equal(result.dataTotal, 21);
  assert.equal(result.mcTotal, 10.5);
});

test('shape-only normalization removes the yield mismatch but preserves relative shape', () => {
  const result = deriveDataSimulation('shape');
  assert.deepEqual(result.ratio, [1, 1, 1]);
  assert.ok(Math.abs(result.dataTotal - 1) < 1e-12);
  assert.ok(Math.abs(result.mcTotal - 1) < 1e-12);
  assert.deepEqual(normalizeToUnitArea([2, 3, 2]), [2 / 7, 3 / 7, 2 / 7]);
});

test('histogram division exposes undefined zero-denominator bins rather than inventing a ratio', () => {
  const ratio = divideHistograms([2, 1], [1, 0]);
  assert.equal(ratio[0], 2);
  assert.ok(Number.isNaN(ratio[1]));
});

test('prediction and transfer target the normalization decision rather than API recall', () => {
  assert.equal(evaluatePrediction('yield-disappears'), true);
  assert.equal(evaluatePrediction('yield-remains'), false);
  assert.equal(evaluateTransfer('keep-yield'), true);
  assert.equal(evaluateTransfer('unit-area'), false);
});
