import { PIPELINE_EVENTS, type PipelineEvent } from '../data-pipeline/model.ts';

export type DerivedObservableId = 'mass-offset' | 'hard-leading-flag';

export interface DerivedObservable {
  id: DerivedObservableId;
  column: string;
  expression: string;
  value: (event: PipelineEvent) => number | boolean;
}

export const DERIVED_OBSERVABLES: Record<DerivedObservableId, DerivedObservable> = {
  'mass-offset': {
    id: 'mass-offset',
    column: 'massOffset',
    expression: 'mass - 125.0',
    value: (event) => event.mass - 125,
  },
  'hard-leading-flag': {
    id: 'hard-leading-flag',
    column: 'hardLeading',
    expression: 'leadingPhotonPt > 35',
    value: (event) => event.leadingPhotonPt > 35,
  },
};

export function rowsWithDefinedColumn(
  observableId: DerivedObservableId,
  events: readonly PipelineEvent[] = PIPELINE_EVENTS,
) {
  const observable = DERIVED_OBSERVABLES[observableId];
  return events.map((event) => ({ ...event, derivedValue: observable.value(event) }));
}

export function rootDefineCode(observableId: DerivedObservableId) {
  const observable = DERIVED_OBSERVABLES[observableId];
  return `withColumn = df.Define("${observable.column}", "${observable.expression}")`;
}

export function definePreservesRows(
  observableId: DerivedObservableId,
  events: readonly PipelineEvent[] = PIPELINE_EVENTS,
) {
  return rowsWithDefinedColumn(observableId, events).length === events.length;
}

export function transferPredictionIsCorrect(value: string) {
  return value === 'all-rows';
}
