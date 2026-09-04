import assert from 'node:assert/strict';
import test from 'node:test';
import { changedCoordinates, coordinateForQuestion, etaRegion, getPreset } from '../src/lessons/object-coordinates/model.ts';

test('D1 presets isolate one coordinate at a time', () => {
  const baseline = getPreset('baseline');
  assert.deepEqual(changedCoordinates(baseline, getPreset('harder')), ['pt']);
  assert.deepEqual(changedCoordinates(baseline, getPreset('forward')), ['eta']);
  assert.deepEqual(changedCoordinates(baseline, getPreset('rotated')), ['phi']);
});

test('D1 maps analysis questions to the intended coordinates', () => {
  assert.equal(coordinateForQuestion('transverse-hardness'), 'pt');
  assert.equal(coordinateForQuestion('around-beam'), 'phi');
  assert.equal(coordinateForQuestion('beam-direction'), 'eta');
});

test('D1 eta regions preserve central and beam-hemisphere meaning', () => {
  assert.equal(etaRegion(0), 'central');
  assert.equal(etaRegion(2), 'forward-positive');
  assert.equal(etaRegion(-2), 'forward-negative');
});
