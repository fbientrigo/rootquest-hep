export interface PipelineEvent {
  id: string;
  photonCount: number;
  leadingPhotonPt: number;
  mass: number;
}

export const PIPELINE_EVENTS: readonly PipelineEvent[] = [
  { id: 'E1', photonCount: 2, leadingPhotonPt: 48, mass: 122 },
  { id: 'E2', photonCount: 1, leadingPhotonPt: 60, mass: 109 },
  { id: 'E3', photonCount: 2, leadingPhotonPt: 31, mass: 117 },
  { id: 'E4', photonCount: 2, leadingPhotonPt: 42, mass: 125 },
  { id: 'E5', photonCount: 3, leadingPhotonPt: 70, mass: 138 },
  { id: 'E6', photonCount: 2, leadingPhotonPt: 55, mass: 127 },
] as const;

export interface PipelineFrame {
  id: 'input' | 'photons' | 'pt';
  entered: readonly string[];
  removed: readonly string[];
  remaining: readonly string[];
}

export function buildPipelineFrames(
  events: readonly PipelineEvent[] = PIPELINE_EVENTS,
): readonly PipelineFrame[] {
  const all = events.map(({ id }) => id);
  const afterPhotons = events.filter(({ photonCount }) => photonCount === 2).map(({ id }) => id);
  const afterPt = events
    .filter(({ id, leadingPhotonPt }) => afterPhotons.includes(id) && leadingPhotonPt > 35)
    .map(({ id }) => id);

  return [
    { id: 'input', entered: all, removed: [], remaining: all },
    {
      id: 'photons',
      entered: all,
      removed: all.filter((id) => !afterPhotons.includes(id)),
      remaining: afterPhotons,
    },
    {
      id: 'pt',
      entered: afterPhotons,
      removed: afterPhotons.filter((id) => !afterPt.includes(id)),
      remaining: afterPt,
    },
  ];
}

export function evaluateFirstFilterPrediction(value: string) {
  const correct = value === 'e1-e3-e4-e6';
  return { correct, remaining: ['E1', 'E3', 'E4', 'E6'] as const };
}

export function eventStatus(frame: PipelineFrame, eventId: string) {
  if (frame.removed.includes(eventId)) return 'removed-now' as const;
  if (!frame.entered.includes(eventId)) return 'removed-before' as const;
  return 'remaining' as const;
}
