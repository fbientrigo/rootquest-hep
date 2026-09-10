import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveTradeoff, evaluateDirectionPrediction, evaluateTransfer } from '../src/lessons/signal-background/model.ts';

test('E1 derives the expected loose and tighter selection trade-offs from the reused practice sample', () => {
  const loose = deriveTradeoff(30);
  const tight = deriveTradeoff(40);

  assert.equal(loose.signalKept, 4);
  assert.equal(loose.signalTotal, 5);
  assert.equal(loose.backgroundKept, 5);
  assert.equal(loose.backgroundTotal, 7);
  assert.equal(loose.signalEfficiency, 4 / 5);
  assert.equal(loose.backgroundRejection, 2 / 7);

  assert.equal(tight.signalKept, 3);
  assert.equal(tight.backgroundKept, 3);
  assert.equal(tight.signalEfficiency, 3 / 5);
  assert.equal(tight.backgroundRejection, 4 / 7);
  assert.ok(tight.signalEfficiency < loose.signalEfficiency);
  assert.ok(tight.backgroundRejection > loose.backgroundRejection);
});

test('E1 transfer threshold satisfies both stated constraints', () => {
  const chosen = deriveTradeoff(40);
  assert.ok(chosen.signalEfficiency >= 0.6);
  assert.ok(chosen.backgroundRejection >= 0.5);
  assert.ok(deriveTradeoff(30).backgroundRejection < 0.5);
  assert.ok(deriveTradeoff(50).signalEfficiency < 0.6);
  assert.equal(evaluateDirectionPrediction('signal-down-background-rejection-up'), true);
  assert.equal(evaluateTransfer('40'), true);
});
