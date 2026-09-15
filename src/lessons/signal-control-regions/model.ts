export type RegionName = 'control-low' | 'signal' | 'control-high';

export type PreparedBin = {
  mass: number;
  expectedBackground: number;
  observed: number;
};

export const PREPARED_SPECTRUM: readonly PreparedBin[] = [
  { mass: 105, expectedBackground: 19, observed: 20 },
  { mass: 110, expectedBackground: 17, observed: 16 },
  { mass: 115, expectedBackground: 15, observed: 15 },
  { mass: 120, expectedBackground: 14, observed: 15 },
  { mass: 125, expectedBackground: 13, observed: 20 },
  { mass: 130, expectedBackground: 13, observed: 14 },
  { mass: 135, expectedBackground: 14, observed: 13 },
  { mass: 140, expectedBackground: 16, observed: 17 },
  { mass: 145, expectedBackground: 18, observed: 18 },
];

export function regionForMass(mass: number): RegionName {
  if (mass < 120) return 'control-low';
  if (mass <= 130) return 'signal';
  return 'control-high';
}

export function summarizePreparedRegions() {
  return PREPARED_SPECTRUM.reduce((summary, bin) => {
    const region = regionForMass(bin.mass);
    summary[region].expectedBackground += bin.expectedBackground;
    summary[region].observed += bin.observed;
    return summary;
  }, {
    'control-low': { expectedBackground: 0, observed: 0 },
    signal: { expectedBackground: 0, observed: 0 },
    'control-high': { expectedBackground: 0, observed: 0 },
  } as Record<RegionName, { expectedBackground: number; observed: number }>);
}

export function evaluatePrediction(value: string): boolean {
  return value === 'freeze-then-unblind';
}

export function evaluateTransfer(value: string): boolean {
  return value === 'control-region';
}
