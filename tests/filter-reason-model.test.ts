import assert from 'node:assert/strict';
import test from 'node:test';
import { predictionIsCorrect, rootFilterCode, survivorsFor } from '../src/lessons/filter-reason/model.ts';

test('C2 applies each criterion independently to the full sample', () => {
  assert.deepEqual(survivorsFor('two-photons'), ['E1','E3','E4','E6']);
  assert.deepEqual(survivorsFor('hard-leading'), ['E1','E2','E4','E5','E6']);
  assert.deepEqual(survivorsFor('mass-window'), ['E1','E4','E6']);
});

test('C2 ROOT code mirrors the selected criterion', () => {
  assert.equal(rootFilterCode('two-photons'), 'selected = df.Filter("photonCount == 2")');
  assert.equal(rootFilterCode('mass-window'), 'selected = df.Filter("mass >= 120 && mass < 130")');
});

test('C2 prediction checks the actual survivor set', () => {
  assert.equal(predictionIsCorrect('hard-leading', 'e1-e2-e4-e5-e6'), true);
  assert.equal(predictionIsCorrect('hard-leading', 'e1-e4-e6'), false);
});
