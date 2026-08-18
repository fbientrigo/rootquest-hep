import assert from 'node:assert/strict';
import test from 'node:test';
import { createLessonSession } from '../src/learning/runtime/session.ts';

test('notifies immediately, updates explicitly, and resets deterministically', () => {
  const changes: Array<{ count: number; type: string; reason?: string }> = [];
  const session = createLessonSession(() => ({ count: 0, selected: [] as string[] }));

  session.subscribe((state, change) => {
    changes.push({ count: state.count, type: change.type, ...('reason' in change && change.reason ? { reason: change.reason } : {}) });
  });

  session.update((state) => ({ ...state, count: state.count + 1 }), 'increment');
  session.update((state) => ({ ...state, selected: ['E1'] }), 'select event');
  session.reset('learner reset');

  assert.deepEqual(session.getState(), { count: 0, selected: [] });
  assert.deepEqual(changes, [
    { count: 0, type: 'initial' },
    { count: 1, type: 'update', reason: 'increment' },
    { count: 1, type: 'update', reason: 'select event' },
    { count: 0, type: 'reset', reason: 'learner reset' },
  ]);
});

test('snapshot cannot mutate the live lesson state', () => {
  const session = createLessonSession(() => ({ nested: { value: 3 } }));
  const snapshot = session.snapshot();

  snapshot.nested.value = 99;

  assert.equal(session.getState().nested.value, 3);
});

test('dispose removes listeners, runs cleanup once, and rejects later updates', () => {
  let cleanupCalls = 0;
  let listenerCalls = 0;
  const session = createLessonSession(() => ({ value: 1 }));

  session.subscribe(() => listenerCalls += 1);
  session.onDispose(() => cleanupCalls += 1);
  session.dispose();
  session.dispose();

  assert.equal(listenerCalls, 1);
  assert.equal(cleanupCalls, 1);
  assert.throws(
    () => session.update({ value: 2 }),
    /lesson session has been disposed/,
  );
});

