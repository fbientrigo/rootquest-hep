import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateErrorPrediction, evaluateRepresentationTransfer, measurementPoints, scaledPoints, yInterval } from '../src/lessons/measurement-errors/model.ts';

test('scaling uncertainty never moves the central measurements', () => {
  const doubled = scaledPoints(2);
  assert.equal(doubled.length, measurementPoints.length);
  doubled.forEach((point, index) => {
    assert.equal(point.x, measurementPoints[index].x);
    assert.equal(point.y, measurementPoints[index].y);
    assert.equal(point.ey, measurementPoints[index].ey * 2);
  });
});

test('y interval is symmetric around the reported central value', () => {
  const point = measurementPoints[3];
  const [low, high] = yInterval(point);
  assert.equal((low + high) / 2, point.y);
  assert.equal(high - low, 2 * point.ey);
});

test('A4 prediction and transfer assess the intended mental model', () => {
  assert.equal(evaluateErrorPrediction('same-center-wider-bar').correct, true);
  assert.equal(evaluateErrorPrediction('move-center').correct, false);
  assert.equal(evaluateRepresentationTransfer('graph-errors').correct, true);
  assert.equal(evaluateRepresentationTransfer('histogram').correct, false);
});
