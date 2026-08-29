import assert from 'node:assert/strict';
import test from 'node:test';
import { PIPELINE_EVENTS, buildPipelineFrames, evaluateFirstFilterPrediction, eventStatus } from '../src/lessons/data-pipeline/model.ts';

test('each pipeline filter receives only survivors from the previous step', () => {
  const [input, photons, pt] = buildPipelineFrames();
  assert.deepEqual(input.remaining, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6']);
  assert.deepEqual(photons.removed, ['E2', 'E5']);
  assert.deepEqual(photons.remaining, ['E1', 'E3', 'E4', 'E6']);
  assert.deepEqual(pt.entered, photons.remaining);
  assert.deepEqual(pt.removed, ['E3']);
  assert.deepEqual(pt.remaining, ['E1', 'E4', 'E6']);
});

test('the second filter never reintroduces an event removed earlier', () => {
  const [, , pt] = buildPipelineFrames();
  assert.equal(eventStatus(pt, 'E2'), 'removed-before');
  assert.equal(eventStatus(pt, 'E3'), 'removed-now');
  assert.equal(eventStatus(pt, 'E4'), 'remaining');
});

test('first-filter prediction is tied to photon count only', () => {
  assert.equal(evaluateFirstFilterPrediction('e1-e3-e4-e6').correct, true);
  assert.equal(evaluateFirstFilterPrediction('e1-e4-e6').correct, false);
  assert.equal(PIPELINE_EVENTS.length, 6);
});
