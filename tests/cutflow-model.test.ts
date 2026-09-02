import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCutflow, evaluateFinalCountInference, evaluateTransfer, finalSurvivorCount, largestAbsoluteLoss } from '../src/lessons/cutflow/model.ts';

test('cutflow measures each filter against the rows that actually reach it', () => {
  const [photons, pt] = buildCutflow();
  assert.deepEqual(
    { entered: photons.entered, passed: photons.passed, rejected: photons.rejected },
    { entered: 6, passed: 4, rejected: 2 },
  );
  assert.deepEqual(
    { entered: pt.entered, passed: pt.passed, rejected: pt.rejected },
    { entered: 4, passed: 3, rejected: 1 },
  );
  assert.equal(pt.relativeEfficiency, 0.75);
  assert.equal(pt.cumulativeEfficiency, 0.5);
  assert.equal(finalSurvivorCount(), 3);
});

test('largest loss is diagnosed from stage counts, not the final count alone', () => {
  assert.equal(largestAbsoluteLoss().id, 'two-photons');
  assert.equal(evaluateFinalCountInference('need-stage-counts'), true);
  assert.equal(evaluateFinalCountInference('final-is-enough'), false);
});

test('transfer identifies the stage with the largest event loss', () => {
  assert.equal(evaluateTransfer('cut-b'), true);
  assert.equal(evaluateTransfer('cut-a'), false);
});
