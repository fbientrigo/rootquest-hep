import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluatePlan, evaluateTransfer, F1_PLAN } from '../src/lessons/assemble-analysis/model.ts';

test('question-first plan identifies the required analysis pieces', () => {
  assert.equal(evaluatePlan('question-first'), true);
  assert.equal(evaluatePlan('plot-first'), false);
  assert.deepEqual(F1_PLAN.columns, ['Photon_pt', 'Photon_eta', 'Photon_phi']);
  assert.equal(F1_PLAN.output, 'Histo1D(m_gg)');
});

test('transfer respects derived-column dependency order', () => {
  assert.equal(evaluateTransfer('define-filter-histogram'), true);
  assert.equal(evaluateTransfer('filter-histogram-define'), false);
  assert.equal(evaluateTransfer('histogram-only'), false);
});
