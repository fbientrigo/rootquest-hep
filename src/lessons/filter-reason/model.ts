import { PIPELINE_EVENTS, type PipelineEvent } from '../data-pipeline/model.ts';

export type FilterCriterionId = 'two-photons' | 'hard-leading' | 'mass-window';

export interface FilterCriterion {
  id: FilterCriterionId;
  expression: string;
  test: (event: PipelineEvent) => boolean;
}

export const FILTER_CRITERIA: Record<FilterCriterionId, FilterCriterion> = {
  'two-photons': {
    id: 'two-photons',
    expression: 'photonCount == 2',
    test: (event) => event.photonCount === 2,
  },
  'hard-leading': {
    id: 'hard-leading',
    expression: 'leadingPhotonPt > 35',
    test: (event) => event.leadingPhotonPt > 35,
  },
  'mass-window': {
    id: 'mass-window',
    expression: 'mass >= 120 && mass < 130',
    test: (event) => event.mass >= 120 && event.mass < 130,
  },
};

export function survivorsFor(
  criterionId: FilterCriterionId,
  events: readonly PipelineEvent[] = PIPELINE_EVENTS,
) {
  return events.filter(FILTER_CRITERIA[criterionId].test).map((event) => event.id);
}

export function rootFilterCode(criterionId: FilterCriterionId) {
  return `selected = df.Filter("${FILTER_CRITERIA[criterionId].expression}")`;
}

export function predictionIsCorrect(criterionId: FilterCriterionId, value: string) {
  return value === survivorsFor(criterionId).join('-').toLowerCase();
}
