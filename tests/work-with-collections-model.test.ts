import assert from 'node:assert/strict';
import test from 'node:test';
import { D3_EVENTS, evaluatePrediction, evaluateTransfer, summarizeCollection } from '../src/lessons/work-with-collections/model.ts';

test('D3 filters and summarizes variable-length collections consistently', () => {
  assert.equal(D3_EVENTS[0].photonPt.length, 3);
  assert.equal(D3_EVENTS[1].photonPt.length, 2);
  assert.equal(D3_EVENTS[2].photonPt.length, 4);

  assert.deepEqual(summarizeCollection(D3_EVENTS[0].photonPt, 30), {
    source: [52, 34, 22],
    mask: [true, true, false],
    selected: [52, 34],
    count: 2,
    sumPt: 86,
  });
  assert.deepEqual(summarizeCollection(D3_EVENTS[2].photonPt, 40).selected, [65, 44]);
  assert.equal(summarizeCollection(D3_EVENTS[2].photonPt, 40).sumPt, 109);
});

test('D3 prediction and transfer assess the collection operation rather than syntax trivia', () => {
  assert.equal(evaluatePrediction('two-values-109'), true);
  assert.equal(evaluatePrediction('four-values'), false);
  assert.equal(evaluateTransfer('sum-selected'), true);
  assert.equal(evaluateTransfer('count-only'), false);
});
