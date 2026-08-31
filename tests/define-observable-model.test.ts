import assert from 'node:assert/strict';
import test from 'node:test';
import { PIPELINE_EVENTS } from '../src/lessons/data-pipeline/model.ts';
import { definePreservesRows, rootDefineCode, rowsWithDefinedColumn, transferPredictionIsCorrect } from '../src/lessons/define-observable/model.ts';

test('Define-derived mass offset preserves every input row', () => {
  const rows = rowsWithDefinedColumn('mass-offset');
  assert.equal(rows.length, PIPELINE_EVENTS.length);
  assert.deepEqual(rows.map((row) => row.id), PIPELINE_EVENTS.map((event) => event.id));
  assert.deepEqual(rows.map((row) => row.derivedValue), [-3, -16, -8, 0, 13, 2]);
  assert.equal(definePreservesRows('mass-offset'), true);
});

test('boolean Define creates true/false values without filtering false rows', () => {
  const rows = rowsWithDefinedColumn('hard-leading-flag');
  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map((row) => row.derivedValue), [true, true, false, true, true, true]);
  assert.equal(rows.find((row) => row.id === 'E3')?.derivedValue, false);
});

test('ROOT bridge reflects the selected derived observable', () => {
  assert.equal(rootDefineCode('mass-offset'), 'withColumn = df.Define("massOffset", "mass - 125.0")');
  assert.equal(rootDefineCode('hard-leading-flag'), 'withColumn = df.Define("hardLeading", "leadingPhotonPt > 35")');
  assert.equal(transferPredictionIsCorrect('all-rows'), true);
  assert.equal(transferPredictionIsCorrect('filtered'), false);
});
