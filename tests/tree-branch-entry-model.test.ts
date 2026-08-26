import assert from 'node:assert/strict';
import test from 'node:test';
import {
  TREE_BRANCHES,
  createTreeBranchEntryState,
  describeCoordinate,
  evaluateBranchPrediction,
  evaluateTransfer,
  getEntryValue,
} from '../src/lessons/tree-branch-entry/model.ts';

test('B2 keeps branch and entry as independent coordinates', () => {
  const state = { selectedBranchId: 'event-weight', entryIndex: 1 };
  const coordinate = describeCoordinate(state);
  assert.deepEqual(coordinate, {
    tree: 'Events',
    branch: 'event_weight',
    entry: 1,
    value: '0.82',
  });
  assert.equal(getEntryValue(state), '0.82');
});

test('B2 promotes the existing lab branch definitions instead of cloning them', () => {
  assert.deepEqual(TREE_BRANCHES.map((branch) => branch.name), ['photon_pt', 'photon_eta', 'event_weight']);
  assert.equal(createTreeBranchEntryState().entryIndex, 0);
});

test('B2 prediction and transfer test the intended mental model', () => {
  assert.equal(evaluateBranchPrediction('same-entry-different-branch').correct, true);
  assert.equal(evaluateBranchPrediction('new-entry').correct, false);
  assert.equal(evaluateTransfer('branch-column-entry-row').correct, true);
  assert.equal(evaluateTransfer('entry-column').correct, false);
});
