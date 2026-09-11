import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveBins, displayedBinValues, evaluatePrediction, evaluateTransfer, totalWeight, WEIGHTED_EVENTS } from '../src/lessons/event-weights/model.ts';

test('E2 separates row count from summed event contribution', () => {
  assert.equal(WEIGHTED_EVENTS.length, 6);
  assert.equal(totalWeight(), 8);
  assert.deepEqual(displayedBinValues('entries'), [2, 3, 1]);
  assert.deepEqual(displayedBinValues('weighted'), [2, 3.5, 2.5]);
});

test('E2 weighted bins sum the event weights without changing membership', () => {
  const bins = deriveBins();
  assert.deepEqual(bins.map((bin) => bin.entries), [2, 3, 1]);
  assert.deepEqual(bins.map((bin) => bin.weighted), [2, 3.5, 2.5]);
  assert.equal(bins.reduce((sum, bin) => sum + bin.weighted, 0), totalWeight());
  assert.equal(evaluatePrediction('third-grows-most'), true);
  assert.equal(evaluateTransfer('two-point-zero'), true);
});
