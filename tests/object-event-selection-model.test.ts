import assert from 'node:assert/strict';
import test from 'node:test';
import { D2_EVENTS, evaluateMaskPrediction, evaluateTransfer, selectObjects } from '../src/lessons/object-event-selection/model.ts';

test('D2 keeps object selection separate from event acceptance', () => {
  const a = selectObjects(D2_EVENTS[0]);
  assert.deepEqual(a.mask, [true, true, false]);
  assert.deepEqual(a.selected.map((photon) => photon.pt), [52, 34]);
  assert.equal(a.eventPasses, true);

  const b = selectObjects(D2_EVENTS[1]);
  assert.deepEqual(b.mask, [true, false, false]);
  assert.equal(b.selected.length, 1);
  assert.equal(b.eventPasses, false);
});

test('D2 predictions target the two-level selection model', () => {
  assert.equal(evaluateMaskPrediction('mask-does-not-decide-event'), true);
  assert.equal(evaluateMaskPrediction('mask-decides-event'), false);
  assert.equal(evaluateTransfer('select-objects-then-count'), true);
});
