import { BRANCHES, type BranchDefinition } from '../learning-engine-lab/model.ts';

export const TREE_NAME = 'Events';
export const TREE_ENTRIES = 3;
export const TREE_BRANCHES: readonly BranchDefinition[] = BRANCHES;

export interface TreeBranchEntryState {
  selectedBranchId: string;
  entryIndex: number;
}

export const createTreeBranchEntryState = (): TreeBranchEntryState => ({
  selectedBranchId: TREE_BRANCHES[0].id,
  entryIndex: 0,
});

export function getSelectedBranch(state: TreeBranchEntryState) {
  return TREE_BRANCHES.find((branch) => branch.id === state.selectedBranchId) ?? TREE_BRANCHES[0];
}

export function getEntryValue(state: TreeBranchEntryState) {
  const branch = getSelectedBranch(state);
  return branch.values[state.entryIndex] ?? branch.values[0];
}

export function describeCoordinate(state: TreeBranchEntryState) {
  const branch = getSelectedBranch(state);
  return {
    tree: TREE_NAME,
    branch: branch.name,
    entry: state.entryIndex,
    value: getEntryValue(state),
  };
}

export function evaluateBranchPrediction(value: string) {
  const correct = value === 'same-entry-different-branch';
  return {
    correct,
    message: correct
      ? 'Selecting another branch keeps the entry index fixed and reads a different column-like field for that same entry.'
      : 'The branch choice changes which stored field you inspect; it does not create a new entry or move to another event-like record.',
  };
}

export function evaluateTransfer(value: string) {
  const correct = value === 'branch-column-entry-row';
  return {
    correct,
    message: correct
      ? 'A useful mental model is TTree ≈ dataset, branch ≈ column, and entry ≈ row-like record. It is an analogy for reasoning, not a claim that ROOT implements an ordinary table internally.'
      : 'Use the analogy by role: branches organize fields across entries, while an entry groups the values that belong to one record-like step through the tree.',
  };
}
