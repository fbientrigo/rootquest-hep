export type AngularPair = {
  label: string;
  eta1: number;
  phi1: number;
  eta2: number;
  phi2: number;
};

export const D4_PAIRS: readonly AngularPair[] = [
  { label: 'A', eta1: 0.3, phi1: 0.2, eta2: 0.5, phi2: 0.35 },
  { label: 'B', eta1: 0.3, phi1: 0.2, eta2: 1.2, phi2: 1.0 },
  { label: 'C', eta1: 0.3, phi1: 3.05, eta2: 0.35, phi2: -3.05 },
] as const;

export function wrappedDeltaPhi(phi1: number, phi2: number) {
  const twoPi = 2 * Math.PI;
  const wrapped = ((phi1 - phi2 + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  return Math.abs(wrapped);
}

export function angularSeparation(pair: AngularPair) {
  const deltaEta = Math.abs(pair.eta1 - pair.eta2);
  const deltaPhi = wrappedDeltaPhi(pair.phi1, pair.phi2);
  return { deltaEta, deltaPhi, deltaR: Math.hypot(deltaEta, deltaPhi) };
}

export function evaluateBoundaryPrediction(value: string) {
  return value === 'close-across-boundary';
}

export function evaluateTransfer(value: string) {
  return value === 'pair-one';
}
