import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluatePrediction,
  evaluateTransfer,
  regionForMass,
  summarizePreparedRegions,
} from '../src/lessons/signal-control-regions/model.ts';

test('prepared region boundaries keep signal and controls distinct', () => {
  assert.equal(regionForMass(115), 'control-low');
  assert.equal(regionForMass(120), 'signal');
  assert.equal(regionForMass(130), 'signal');
  assert.equal(regionForMass(135), 'control-high');
});

test('prepared yields are derived from the fixed region definition', () => {
  const summary = summarizePreparedRegions();
  assert.deepEqual(summary['control-low'], { expectedBackground: 51, observed: 51 });
  assert.deepEqual(summary.signal, { expectedBackground: 40, observed: 49 });
  assert.deepEqual(summary['control-high'], { expectedBackground: 48, observed: 48 });
});

test('E6 checkpoints distinguish frozen testing from tuning on observed signal data', () => {
  assert.equal(evaluatePrediction('freeze-then-unblind'), true);
  assert.equal(evaluatePrediction('peek-and-shift'), false);
  assert.equal(evaluatePrediction('reoptimize-after-peek'), false);
  assert.equal(evaluateTransfer('control-region'), true);
  assert.equal(evaluateTransfer('signal-region'), false);
});
