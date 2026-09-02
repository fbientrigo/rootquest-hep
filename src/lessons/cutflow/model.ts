import { PIPELINE_EVENTS, buildPipelineFrames } from '../data-pipeline/model.ts';

export interface CutflowRow {
  id: 'two-photons' | 'hard-leading';
  name: string;
  entered: number;
  passed: number;
  rejected: number;
  relativeEfficiency: number;
  cumulativeEfficiency: number;
}

export function buildCutflow(): readonly CutflowRow[] {
  const [input, photons, pt] = buildPipelineFrames(PIPELINE_EVENTS);
  const initial = input.remaining.length;
  return [
    {
      id: 'two-photons',
      name: 'Exactly two photons',
      entered: photons.entered.length,
      passed: photons.remaining.length,
      rejected: photons.removed.length,
      relativeEfficiency: photons.remaining.length / photons.entered.length,
      cumulativeEfficiency: photons.remaining.length / initial,
    },
    {
      id: 'hard-leading',
      name: 'Leading photon pT > 35 GeV',
      entered: pt.entered.length,
      passed: pt.remaining.length,
      rejected: pt.removed.length,
      relativeEfficiency: pt.remaining.length / pt.entered.length,
      cumulativeEfficiency: pt.remaining.length / initial,
    },
  ] as const;
}

export function largestAbsoluteLoss(rows: readonly CutflowRow[] = buildCutflow()) {
  return rows.reduce((largest, row) => row.rejected > largest.rejected ? row : largest);
}

export function finalSurvivorCount() {
  const frames = buildPipelineFrames(PIPELINE_EVENTS);
  return frames.at(-1)?.remaining.length ?? 0;
}

export function evaluateFinalCountInference(value: string) {
  return value === 'need-stage-counts';
}

export function evaluateTransfer(value: string) {
  return value === 'cut-b';
}
