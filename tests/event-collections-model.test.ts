import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COLLECTION_BRANCHES,
  branchShape,
  evaluateCollectionTransfer,
  evaluateMultiplicityPrediction,
  getEventCollectionSnapshot,
  parseVectorValue,
} from '../src/lessons/event-collections/model.ts';

test('B3 reuses B2 branch data and separates collection multiplicity from entry count', () => {
  assert.deepEqual(COLLECTION_BRANCHES.map((branch) => branch.name), ['photon_pt', 'photon_eta', 'event_weight']);
  assert.deepEqual(getEventCollectionSnapshot(0), { entryIndex: 0, photonPt: [42.1, 31.8], photonCount: 2, eventWeight: 1 });
  assert.deepEqual(getEventCollectionSnapshot(1), { entryIndex: 1, photonPt: [56.4], photonCount: 1, eventWeight: 0.82 });
});

test('B3 identifies scalar and vector-like branch shapes', () => {
  assert.equal(branchShape('vector<float>'), 'collection');
  assert.equal(branchShape('float'), 'scalar');
  assert.deepEqual(parseVectorValue('[45.0, 28.2]'), [45, 28.2]);
});

test('B3 prediction and transfer reject collection elements as extra events', () => {
  assert.equal(evaluateMultiplicityPrediction('three-values-one-entry').correct, true);
  assert.equal(evaluateMultiplicityPrediction('three-entries').correct, false);
  assert.equal(evaluateCollectionTransfer('one-event-three-jets').correct, true);
  assert.equal(evaluateCollectionTransfer('three-events').correct, false);
});
