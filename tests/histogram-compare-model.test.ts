import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SAMPLE_A,
  SAMPLE_B,
  deriveComparison,
  evaluateNormalizationPrediction,
  evaluateNormalizationTransfer,
  normalizeBinCounts,
} from '../src/lessons/histogram-compare/model.ts';

test('sample B preserves sample A shape while doubling yield', () => {
  const raw = deriveComparison('counts');
  assert.equal(SAMPLE_B.length, SAMPLE_A.length * 2);
  assert.equal(raw.integralB, raw.integralA * 2);
  assert.deepEqual(
    raw.bins.map((bin) => bin.rawB),
    raw.bins.map((bin) => bin.rawA * 2),
  );
  assert.equal(raw.meanA, raw.meanB);
  assert.equal(raw.stdDevA, raw.stdDevB);
});

test('unit-area normalization makes both prepared shapes identical', () => {
  const shape = deriveComparison('shape');
  assert.deepEqual(
    shape.bins.map((bin) => bin.a),
    shape.bins.map((bin) => bin.b),
  );
  assert.ok(Math.abs(shape.bins.reduce((sum, bin) => sum + bin.a, 0) - 1) < 1e-12);
  assert.ok(Math.abs(shape.bins.reduce((sum, bin) => sum + bin.b, 0) - 1) < 1e-12);
});

test('normalization handles an empty histogram without dividing by zero', () => {
  assert.deepEqual(normalizeBinCounts([0, 0, 0]), [0, 0, 0]);
});

test('prediction and transfer distinguish shape questions from yield questions', () => {
  assert.equal(evaluateNormalizationPrediction('totals-disappear').correct, true);
  assert.equal(evaluateNormalizationPrediction('shape-disappears').correct, false);
  assert.equal(evaluateNormalizationTransfer('keep-counts').correct, true);
  assert.equal(evaluateNormalizationTransfer('unit-area').correct, false);
});
