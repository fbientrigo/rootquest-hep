import assert from 'node:assert/strict';
import test from 'node:test';
import { DERIVED_SAMPLE_SCENARIOS, evaluateChoice, snapshotColumns } from '../src/lessons/derived-sample/model.ts';

test('C6 scenarios distinguish persistence, one-off analysis and debugging', () => {
  assert.equal(DERIVED_SAMPLE_SCENARIOS.length, 3);
  assert.equal(evaluateChoice('reuse', 'snapshot'), true);
  assert.equal(evaluateChoice('reuse', 'range'), false);
  assert.equal(evaluateChoice('one-off', 'pipeline'), true);
  assert.equal(evaluateChoice('debug', 'range'), true);
});

test('snapshot column selection keeps only available unique requested columns', () => {
  assert.deepEqual(
    snapshotColumns(['event', 'm_gg', 'massOffset'], ['massOffset', 'event', 'missing', 'massOffset']),
    ['massOffset', 'event'],
  );
});
