import assert from 'node:assert/strict';
import test from 'node:test';
import {
  D5_SCENARIOS,
  diphotonInvariantMass,
  evaluateOpeningPrediction,
  evaluateTransfer,
} from '../src/lessons/four-vectors/model.ts';

test('D5 computes invariant mass from the summed massless photon four-momenta', () => {
  assert.ok(Math.abs(diphotonInvariantMass(D5_SCENARIOS[0]) - 19.8669) < 1e-3);
  assert.ok(Math.abs(diphotonInvariantMass(D5_SCENARIOS[1]) - 100) < 1e-10);
  assert.ok(Math.abs(diphotonInvariantMass(D5_SCENARIOS[2]) - 90.0675) < 1e-3);
});

test('D5 prediction checks target qualitative mass reasoning rather than API recall', () => {
  assert.equal(evaluateOpeningPrediction('back-to-back-larger'), true);
  assert.equal(evaluateOpeningPrediction('same-mass'), false);
  assert.equal(evaluateTransfer('mass-doubles'), true);
  assert.equal(evaluateTransfer('mass-zero'), false);
});
