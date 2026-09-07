import assert from 'node:assert/strict';
import test from 'node:test';
import { D4_PAIRS, angularSeparation, evaluateBoundaryPrediction, evaluateTransfer, wrappedDeltaPhi } from '../src/lessons/angular-separation/model.ts';

test('D4 computes DeltaR from eta and wrapped phi separation', () => {
  const a = angularSeparation(D4_PAIRS[0]);
  assert.ok(Math.abs(a.deltaEta - 0.2) < 1e-12);
  assert.ok(Math.abs(a.deltaPhi - 0.15) < 1e-12);
  assert.ok(Math.abs(a.deltaR - 0.25) < 1e-12);
});

test('D4 wraps phi across the +/-pi boundary instead of using raw subtraction', () => {
  const c = angularSeparation(D4_PAIRS[2]);
  assert.ok(wrappedDeltaPhi(3.05, -3.05) < 0.2);
  assert.ok(c.deltaR < 0.2);
});

test('D4 prediction and transfer evaluate the intended reasoning', () => {
  assert.equal(evaluateBoundaryPrediction('close-across-boundary'), true);
  assert.equal(evaluateBoundaryPrediction('far-raw-subtraction'), false);
  assert.equal(evaluateTransfer('pair-one'), true);
  assert.equal(evaluateTransfer('pair-two'), false);
});
