import assert from 'node:assert/strict';
import test from 'node:test';
import { demoRootFile, evaluateInspectionTransfer, evaluateObjectChoice, getRootObject, listRootObjects } from '../src/lessons/root-file-inspection/model.ts';

test('B1 inventory exposes stable names and ROOT classes', () => {
  assert.equal(demoRootFile.name, 'analysis.root');
  assert.deepEqual(listRootObjects().map((object) => [object.name, object.kind]), [
    ['Events', 'TTree'],
    ['m_gg', 'TH1D'],
    ['efficiency', 'TGraphErrors'],
  ]);
  assert.equal(getRootObject('m_gg')?.title, 'Diphoton invariant mass');
  assert.equal(getRootObject('missing'), undefined);
});

test('B1 requires evidence-driven retrieval instead of guessing', () => {
  assert.equal(evaluateObjectChoice('m_gg').correct, true);
  assert.equal(evaluateObjectChoice('Events').correct, false);
  assert.equal(evaluateInspectionTransfer('list-first').correct, true);
  assert.equal(evaluateInspectionTransfer('guess-get').correct, false);
});
