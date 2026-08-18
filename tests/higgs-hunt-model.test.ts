import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canAdvance,
  createHiggsHuntState,
  deriveMassHistogram,
  deriveTrainingMetrics,
  evaluateRulePrediction,
  formatRootCode,
  objectSelectionState,
  toggleObjectSelection,
} from '../src/lessons/higgs-hunt/model.ts';

test('object selection is bounded, reversible, and identifies the diphoton pair', () => {
  let selected = toggleObjectSelection([], 'photon-1');
  selected = toggleObjectSelection(selected, 'jet-1');
  selected = toggleObjectSelection(selected, 'photon-2');

  assert.deepEqual(selected, ['jet-1', 'photon-2']);
  assert.equal(objectSelectionState(selected).includesJet, true);
  selected = toggleObjectSelection(selected, 'jet-1');
  selected = toggleObjectSelection(selected, 'photon-1');
  assert.equal(objectSelectionState(selected).correct, true);
});

test('prediction checks the filter rule rather than transverse momentum', () => {
  assert.equal(evaluateRulePrediction('a-c').correct, true);
  assert.match(evaluateRulePrediction('a-d').message, /photon count only/i);
});

test('the default cut reproduces deterministic training metrics', () => {
  const metrics = deriveTrainingMetrics({ photonPtThreshold: 35 });

  assert.equal(metrics.selected.length, 18);
  assert.equal(metrics.signalEfficiency, 0.9);
  assert.equal(metrics.backgroundRejection, 0.55);
});

test('histogram bins preserve the selected sample', () => {
  const histogram = deriveMassHistogram({ photonPtThreshold: 35, binCount: 12 });

  assert.equal(histogram.bins.length, 12);
  assert.equal(histogram.selectedCount, 18);
  assert.equal(
    histogram.bins.reduce((total, bin) => total + bin.count, 0),
    histogram.selectedCount,
  );
});

test('stage gates and ROOT code derive from explicit state', () => {
  const initial = createHiggsHuntState();
  assert.equal(canAdvance(initial), false);

  const ready = {
    ...initial,
    selectedObjectIds: ['photon-1', 'photon-2'],
    photonPtThreshold: 47,
    binCount: 16,
  };
  assert.equal(canAdvance(ready), true);
  assert.match(formatRootCode(ready), /leading_photon_pt >= 47/);
  assert.match(formatRootCode(ready), /16, 100\., 160\./);
});
