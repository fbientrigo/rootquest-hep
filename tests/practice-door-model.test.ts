import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildSelectionHistogram,
  deriveSelection,
  evaluatePracticeAnswer,
  meetsSelectionGoal,
  selectionEventEnergy,
  selectionEvents,
} from '../src/lessons/practice-doors/model.ts';

test('selection lab goals become stricter without rewarding over-tightening', () => {
  const stageOne = deriveSelection(30);
  const stageTwo = deriveSelection(40);
  const stageThree = deriveSelection(50);
  const tooTight = deriveSelection(60);

  assert.deepEqual(stageOne, {
    signalKept: 4,
    backgroundKept: 5,
    signalTotal: 5,
    backgroundTotal: 7,
  });
  assert.equal(meetsSelectionGoal(1, stageOne), true);
  assert.equal(meetsSelectionGoal(2, stageTwo), true);
  assert.equal(meetsSelectionGoal(3, stageThree), true);
  assert.equal(meetsSelectionGoal(3, tooTight), false);
});

test('selection visual data preserves the same sample used by the cut model', () => {
  const histogram = buildSelectionHistogram();

  assert.equal(histogram.length, 10);
  assert.equal(histogram.reduce((sum, bin) => sum + bin.signal, 0), 5);
  assert.equal(histogram.reduce((sum, bin) => sum + bin.background, 0), 7);
  assert.equal(selectionEvents.length, 12);
  assert.ok(selectionEvents.every((event) => selectionEventEnergy(event) >= event.pt));
});

test('practice answer keys encode the intended reasoning progression', () => {
  assert.equal(evaluatePracticeAnswer('observe', 1, 'c'), true);
  assert.equal(evaluatePracticeAnswer('observe', 2, 'b'), true);
  assert.equal(evaluatePracticeAnswer('observe', 3, 'a'), true);

  assert.equal(evaluatePracticeAnswer('predict', 1, 'fewer'), true);
  assert.equal(evaluatePracticeAnswer('predict', 2, 'decrease'), true);
  assert.equal(evaluatePracticeAnswer('predict', 3, 'grouping'), true);

  assert.equal(evaluatePracticeAnswer('code', 1, 'filter'), true);
  assert.equal(evaluatePracticeAnswer('code', 2, 'define'), true);
  assert.equal(evaluatePracticeAnswer('code', 3, 'histo1d'), true);
  assert.equal(evaluatePracticeAnswer('code', 1, 'define'), false);
});
