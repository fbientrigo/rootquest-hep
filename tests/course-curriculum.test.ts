import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  coreLessons,
  courseUnits,
  nextLesson,
  spiralAnchor,
  type CourseLessonStatus,
} from '../src/course/curriculum.ts';

const curriculumDoc = readFileSync(new URL('../docs/05_CURRICULUM.md', import.meta.url), 'utf8');

function documentedStatus(id: string): CourseLessonStatus {
  const line = curriculumDoc.split('\n').find((candidate) => candidate.startsWith(`| ${id} |`));
  assert.ok(line, `${id} is missing from docs/05_CURRICULUM.md`);
  if (line.includes('LIVE')) return 'live';
  if (line.includes('NEXT')) return 'next';
  return 'planned';
}

test('course registry has unique lesson ids and one NEXT lesson', () => {
  const ids = [spiralAnchor.id, ...coreLessons.map((lesson) => lesson.id)];
  assert.equal(new Set(ids).size, ids.length);
  const next = coreLessons.filter((lesson) => lesson.status === 'next');
  assert.equal(next.length, 1);
  assert.equal(nextLesson?.id, 'C4');
});

test('learner-facing statuses mirror the canonical curriculum document', () => {
  for (const lesson of [spiralAnchor, ...coreLessons]) {
    assert.equal(lesson.status, documentedStatus(lesson.id), `${lesson.id} status drifted from docs/05_CURRICULUM.md`);
  }
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
