import assert from 'node:assert/strict';
import test from 'node:test';
import {
  diagnoseLinearFit,
  evaluatePrediction,
  evaluateTransfer,
  POINT_UNCERTAINTY,
} from '../src/lessons/read-fit-critically/model.ts';

test('model-window diagnostics recover the prepared linear trend', () => {
  const report = diagnoseLinearFit('model-window');
  assert.equal(POINT_UNCERTAINTY, 0.2);
  assert.ok(Math.abs(report.intercept - 2.04) < 1e-12);
  assert.ok(Math.abs(report.slope - 1.5) < 1e-12);
  assert.ok(Math.abs(report.slopeError - 0.0632455532) < 1e-9);
  assert.ok(Math.abs(report.reducedChi2 - 0.6) < 1e-12);
  assert.equal(report.ndf, 3);
});

test('full-range diagnostics expose an inadequate straight-line model', () => {
  const report = diagnoseLinearFit('full');
  assert.ok(Math.abs(report.slope - 2.6714285714) < 1e-9);
  assert.ok(report.slopeError < diagnoseLinearFit('model-window').slopeError);
  assert.ok(report.reducedChi2 > 100);
  assert.ok(Math.max(...report.points.map((point) => Math.abs(point.pull))) > 10);
});

test('E5 checkpoints distinguish precision from model adequacy', () => {
  assert.equal(evaluatePrediction('full-range-inadequate'), true);
  assert.equal(evaluatePrediction('full-range-better'), false);
  assert.equal(evaluateTransfer('residuals-and-gof'), true);
  assert.equal(evaluateTransfer('small-error'), false);
});
