export type DerivedSampleChoice = 'snapshot' | 'pipeline' | 'range';

export type DerivedSampleScenario = {
  id: 'reuse' | 'one-off' | 'debug';
  prompt: string;
  bestChoice: DerivedSampleChoice;
};

export const DERIVED_SAMPLE_SCENARIOS: DerivedSampleScenario[] = [
  {
    id: 'reuse',
    prompt: 'You will reuse the selected rows and derived columns in several later analyses.',
    bestChoice: 'snapshot',
  },
  {
    id: 'one-off',
    prompt: 'You only need one final histogram from the current pipeline.',
    bestChoice: 'pipeline',
  },
  {
    id: 'debug',
    prompt: 'You want to inspect only a few passing entries while debugging the chain.',
    bestChoice: 'range',
  },
];

export function evaluateChoice(scenarioId: DerivedSampleScenario['id'], choice: DerivedSampleChoice): boolean {
  const scenario = DERIVED_SAMPLE_SCENARIOS.find((candidate) => candidate.id === scenarioId);
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioId}`);
  return scenario.bestChoice === choice;
}

export function snapshotColumns(sourceColumns: string[], requestedColumns: string[]): string[] {
  const available = new Set(sourceColumns);
  return requestedColumns.filter((column, index) => available.has(column) && requestedColumns.indexOf(column) === index);
}
