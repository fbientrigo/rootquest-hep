import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FILL_VALUES,
  deriveFillState,
  evaluateFillPrediction,
  evaluateFillTransfer,
  findDisplayBin,
} from '../src/lessons/histogram-fill/model.ts';

test('each additional fill increments exactly one in-range bin', () => {
  const before = deriveFillState(3);
  const after = deriveFillState(4);
  const deltas = after.bins.map((bin, index) => bin.count - before.bins[index].count);

  assert.equal(after.filledCount, before.filledCount + 1);
  assert.equal(deltas.reduce((sum, delta) => sum + delta, 0), 1);
  assert.equal(deltas.filter((delta) => delta === 1).length, 1);
  assert.equal(deltas.filter((delta) => delta !== 0 && delta !== 1).length, 0);
});

test('all prepared measurements are accounted for after all fills', () => {
  const result = deriveFillState(FILL_VALUES.length);
  assert.equal(result.complete, true);
  assert.equal(result.inRangeCount, FILL_VALUES.length);
  assert.equal(result.underflow, 0);
  assert.equal(result.overflow, 0);
});

test('display bin follows ROOT-style half-open intervals', () => {
  assert.equal(findDisplayBin(0), '[0, 2)');
  assert.equal(findDisplayBin(4.8), '[4, 6)');
  assert.equal(findDisplayBin(8), 'overflow');
  assert.equal(findDisplayBin(-0.1), 'underflow');
});

test('prediction and transfer target the Fill mental model', () => {
  assert.equal(evaluateFillPrediction('4-6').correct, true);
  assert.equal(evaluateFillTransfer('increment-bin').correct, true);
  assert.equal(evaluateFillTransfer('set-height').correct, false);
});
