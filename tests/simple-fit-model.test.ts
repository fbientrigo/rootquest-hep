import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fitLinearLeastSquares,
  linearValue,
  pointsForRange,
  evaluatePrediction,
  evaluateTransfer,
} from '../src/lessons/simple-fit/model.ts';

test('linearValue maps intercept and slope to a visible model value', () => {
  assert.equal(linearValue(4, 2, 1.5), 8);
});

test('model-window fit uses only the declared linear region', () => {
  assert.deepEqual(pointsForRange('model-window').map((point) => point.x), [0, 1, 2, 3, 4]);
  const fit = fitLinearLeastSquares('model-window');
  assert.ok(Math.abs(fit.intercept - 2.04) < 1e-12);
  assert.ok(Math.abs(fit.slope - 1.5) < 1e-12);
  assert.equal(fit.minX, 0);
  assert.equal(fit.maxX, 4);
});

test('including outer structure pulls the same linear fit upward', () => {
  const fit = fitLinearLeastSquares('full');
  assert.ok(Math.abs(fit.intercept - 0.3714285714285701) < 1e-12);
  assert.ok(Math.abs(fit.slope - 2.6714285714285717) < 1e-12);
  assert.ok(fit.slope > fitLinearLeastSquares('model-window').slope);
});

test('E4 prediction and transfer evaluate the intended causal ideas', () => {
  assert.equal(evaluatePrediction('slope-increases'), true);
  assert.equal(evaluatePrediction('slope-unchanged'), false);
  assert.equal(evaluateTransfer('tf1-range-r'), true);
  assert.equal(evaluateTransfer('full-no-range'), false);
});
