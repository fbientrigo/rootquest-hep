import assert from 'node:assert/strict';
import test from 'node:test';
import { ACTION_QUESTIONS, actionMatchesQuestion, transferActionForIntent } from '../src/lessons/actions-summary/model.ts';

test('C4 maps each analysis question to one direct action', () => {
  assert.equal(ACTION_QUESTIONS.length, 4);
  assert.equal(actionMatchesQuestion('entries', 'count'), true);
  assert.equal(actionMatchesQuestion('mean-mass', 'mean'), true);
  assert.equal(actionMatchesQuestion('sum-weight', 'sum'), true);
  assert.equal(actionMatchesQuestion('mass-shape', 'histo1d'), true);
  assert.equal(actionMatchesQuestion('mass-shape', 'mean'), false);
});

test('C4 transfer vocabulary distinguishes extrema and 2D distributions', () => {
  assert.equal(transferActionForIntent('minimum'), 'Min');
  assert.equal(transferActionForIntent('maximum'), 'Max');
  assert.equal(transferActionForIntent('relationship'), 'Histo2D');
});
