import { TREE_BRANCHES, TREE_ENTRIES } from '../tree-branch-entry/model.ts';

const photonPtBranch = TREE_BRANCHES.find((branch) => branch.name === 'photon_pt');
const eventWeightBranch = TREE_BRANCHES.find((branch) => branch.name === 'event_weight');

if (!photonPtBranch || !eventWeightBranch) {
  throw new Error('B3 requires the photon_pt and event_weight branches promoted by B2.');
}

export const COLLECTION_ENTRIES = TREE_ENTRIES;
export const COLLECTION_BRANCHES = TREE_BRANCHES;

export interface EventCollectionSnapshot {
  entryIndex: number;
  photonPt: readonly number[];
  photonCount: number;
  eventWeight: number;
}

export function parseVectorValue(serialized: string): readonly number[] {
  const trimmed = serialized.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
  const body = trimmed.slice(1, -1).trim();
  if (!body) return [];
  return body.split(',').map((value) => Number(value.trim()));
}

export function getEventCollectionSnapshot(entryIndex: number): EventCollectionSnapshot {
  const safeIndex = Math.max(0, Math.min(COLLECTION_ENTRIES - 1, Math.trunc(entryIndex)));
  const photonPt = parseVectorValue(photonPtBranch.values[safeIndex] ?? photonPtBranch.values[0]);
  const eventWeight = Number(eventWeightBranch.values[safeIndex] ?? eventWeightBranch.values[0]);

  return {
    entryIndex: safeIndex,
    photonPt,
    photonCount: photonPt.length,
    eventWeight,
  };
}

export function branchShape(type: string): 'collection' | 'scalar' {
  return type.includes('vector<') ? 'collection' : 'scalar';
}

export function evaluateMultiplicityPrediction(value: string) {
  const correct = value === 'three-values-one-entry';
  return {
    correct,
    message: correct
      ? 'One entry can hold three photon values in a collection branch while event_weight still stores one scalar value for that same entry.'
      : 'A collection changes how many values a branch can hold inside one entry; it does not turn those values into separate tree entries.',
  };
}

export function evaluateCollectionTransfer(value: string) {
  const correct = value === 'one-event-three-jets';
  return {
    correct,
    message: correct
      ? 'A vector-like jet_pt value with three elements represents three jet values inside one event-like entry, while run_number remains one scalar for that entry.'
      : 'Count entries and collection elements separately: three elements in jet_pt can belong to one entry rather than three different events.',
  };
}
