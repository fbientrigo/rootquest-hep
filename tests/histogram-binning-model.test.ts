import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveHistogram,
  evaluateBinPrediction,
  evaluateTransferAnswer,
} from '../src/lessons/histogram-binning/model.ts';

test('rebinning preserves source values while changing interval width', () => {
  const fiveBins = deriveHistogram({ binCount: 5 });
  const tenBins = deriveHistogram({ binCount: 10 });

  assert.equal(fiveBins.sourceCount, 20);
  assert.equal(tenBins.sourceCount, 20);
  assert.equal(fiveBins.inRangeCount, 20);
  assert.equal(tenBins.inRangeCount, 20);
  assert.equal(fiveBins.binWidth, 1.6);
  assert.equal(tenBins.binWidth, 0.8);
  assert.equal(fiveBins.bins.length, 5);
  assert.equal(tenBins.bins.length, 10);
  assert.equal(evaluateBinPrediction('narrower').correct, true);
  assert.equal(evaluateTransferAnswer('same-values').correct, true);
});

test('range edges follow ROOT-style underflow and overflow semantics', () => {
  const histogram = deriveHistogram(
    { binCount: 4 },
    [-0.1, 0, 1.9, 2, 7.999, 8, 9],
  );

  assert.equal(histogram.underflow, 1);
  assert.equal(histogram.overflow, 2);
  assert.equal(histogram.inRangeCount, 4);
  assert.deepEqual(histogram.bins.map((bin) => bin.count), [2, 1, 0, 1]);
});
