import assert from 'node:assert/strict';
import test from 'node:test';
import { coreLessons, courseUnits, nextLesson, spiralAnchor } from '../src/course/curriculum.ts';

test('course registry has unique lesson ids and one NEXT lesson', () => {
  const ids = [spiralAnchor.id, ...coreLessons.map((lesson) => lesson.id)];
  assert.equal(new Set(ids).size, ids.length);

  const next = coreLessons.filter((lesson) => lesson.status === 'next');
  assert.equal(next.length, 1);
  assert.equal(nextLesson?.id, 'A4');
});

test('every LIVE learner-facing lesson has a route', () => {
  const live = [spiralAnchor, ...coreLessons].filter((lesson) => lesson.status === 'live');
  assert.ok(live.length > 0);

  for (const lesson of live) {
    assert.ok(lesson.href, `${lesson.id} is LIVE but has no learner-facing route`);
    assert.match(lesson.href!, /^learn\/.+\/$/);
  }
});

test('course units preserve canonical A through F order', () => {
  assert.deepEqual(courseUnits.map((unit) => unit.id), ['A', 'B', 'C', 'D', 'E', 'F']);
});
