import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildTraceFrames,
  createHistogramState,
  createTreeState,
  deriveHistogram,
  evaluateBinPrediction,
  evaluateTracePrediction,
  selectedBranch,
} from '../src/lessons/learning-engine-lab/model.ts';

test('histogram derivation separates selection from grouping', () => {
  const initial = deriveHistogram(createHistogramState());
  const regrouped = deriveHistogram({ binCount: 10, threshold: 0 });
  const selected = deriveHistogram({ binCount: 10, threshold: 4 });

  assert.equal(initial.bins.length, 5);
  assert.equal(regrouped.bins.length, 10);
  assert.equal(initial.selectedCount, regrouped.selectedCount);
  assert.equal(
    selected.bins.reduce((sum, bin) => sum + bin.count, 0),
    selected.selectedCount,
  );
  assert.ok(selected.selectedCount < regrouped.selectedCount);
  assert.equal(evaluateBinPrediction('narrower').correct, true);
  assert.equal(evaluateBinPrediction('more-data').correct, false);
});

test('tree selection derives one linked branch view from explicit state', () => {
  assert.equal(selectedBranch(createTreeState()).name, 'photon_pt');
  assert.equal(selectedBranch({ selectedBranchId: 'event-weight' }).type, 'float');
});

test('trace frames preserve sequential filter meaning', () => {
  const frames = buildTraceFrames();

  assert.equal(frames.length, 4);
  assert.deepEqual(frames[0].remaining, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6']);
  assert.deepEqual(frames[1].removed, ['E2', 'E5']);
  assert.deepEqual(frames[1].remaining, ['E1', 'E3', 'E4', 'E6']);
  assert.deepEqual(frames[2].removed, ['E3']);
  assert.deepEqual(frames[2].remaining, ['E1', 'E4', 'E6']);
  assert.deepEqual(frames[3].distribution, [122, 125, 127]);
  assert.equal(evaluateTracePrediction('e1-e3-e4-e6').correct, true);
});

